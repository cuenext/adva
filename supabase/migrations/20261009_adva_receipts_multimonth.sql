-- ADVA private receipt ledger: one receipt can settle multiple monthly service lines.
create table if not exists public.adva_receipts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.adva_projects(id) on delete restrict,
  currency text not null default 'AED' check (currency in ('AED','USD','OMR','EUR','GBP')),
  amount numeric(14,2) not null check (amount > 0),
  received_on date,
  received_at timestamptz,
  method text not null default 'unspecified' check (method in ('cash','bank_transfer','card','other','unspecified')),
  note text not null default '' check (char_length(note) <= 1600),
  external_ref text unique,
  status text not null default 'posted' check (status in ('posted','void')),
  void_reason text,
  voided_at timestamptz,
  created_at timestamptz not null default now(),
  constraint receipt_dates_consistent check (
    received_at is null or received_on is null or received_on = (received_at at time zone 'Asia/Dubai')::date
  )
);
create table if not exists public.adva_receipt_allocations (
  receipt_id uuid not null references public.adva_receipts(id) on delete cascade,
  finance_id uuid not null references public.adva_monthly_finances(id) on delete restrict,
  amount numeric(14,2) not null check(amount > 0),
  primary key(receipt_id,finance_id)
);
create index if not exists adva_receipts_project_idx on public.adva_receipts(project_id,created_at desc);
create index if not exists adva_receipts_received_on_idx on public.adva_receipts(received_on desc);
create index if not exists adva_receipt_allocations_finance_idx on public.adva_receipt_allocations(finance_id);
alter table public.adva_receipts enable row level security;
alter table public.adva_receipt_allocations enable row level security;
revoke all on public.adva_receipts, public.adva_receipt_allocations from PUBLIC, anon, authenticated;
grant select, insert, update, delete on public.adva_receipts, public.adva_receipt_allocations to authenticated;
grant select, insert, update, delete on public.adva_receipts, public.adva_receipt_allocations to service_role;
drop policy if exists adva_receipts_ceo_only on public.adva_receipts;
create policy adva_receipts_ceo_only on public.adva_receipts
  for all to authenticated using ((select public.adva_is_ceo())) with check ((select public.adva_is_ceo()));
drop policy if exists adva_receipt_allocations_ceo_only on public.adva_receipt_allocations;
create policy adva_receipt_allocations_ceo_only on public.adva_receipt_allocations
  for all to authenticated using ((select public.adva_is_ceo())) with check ((select public.adva_is_ceo()));

-- Automatically keep the existing monthly finance paid figure in sync with posted receipts.
create or replace function private.adva_sync_finance_receipts()
returns trigger language plpgsql security invoker set search_path = '' as $$
declare target_id uuid;
begin
  target_id := case when tg_op = 'DELETE' then old.finance_id else new.finance_id end;
  update public.adva_monthly_finances f set amount_paid = (
    select coalesce(sum(a.amount),0)
    from public.adva_receipt_allocations a
    join public.adva_receipts r on r.id = a.receipt_id
    where a.finance_id = target_id and r.status = 'posted'
  ) where f.id = target_id;
  if tg_op = 'UPDATE' and old.finance_id is distinct from new.finance_id then
    update public.adva_monthly_finances f set amount_paid = (
      select coalesce(sum(a.amount),0)
      from public.adva_receipt_allocations a
      join public.adva_receipts r on r.id = a.receipt_id
      where a.finance_id = old.finance_id and r.status = 'posted'
    ) where f.id = old.finance_id;
  end if;
  return null;
end $$;
drop trigger if exists adva_allocations_sync_paid on public.adva_receipt_allocations;
create trigger adva_allocations_sync_paid
after insert or update or delete on public.adva_receipt_allocations
for each row execute function private.adva_sync_finance_receipts();

create or replace function private.adva_sync_voided_receipt()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if new.status is distinct from old.status then
    update public.adva_monthly_finances f set amount_paid = (
      select coalesce(sum(a.amount),0)
      from public.adva_receipt_allocations a
      join public.adva_receipts r on r.id = a.receipt_id
      where a.finance_id = f.id and r.status = 'posted'
    ) where f.id in (select finance_id from public.adva_receipt_allocations where receipt_id = new.id);
  end if;
  return null;
end $$;
drop trigger if exists adva_receipt_void_sync_paid on public.adva_receipts;
create trigger adva_receipt_void_sync_paid after update of status on public.adva_receipts
for each row execute function private.adva_sync_voided_receipt();

-- Single-transaction, CEO-authorized receipt posting with exact allocation totals.
create or replace function public.adva_record_receipt(
  p_project_id uuid, p_currency text, p_amount numeric,
  p_allocations jsonb, p_received_on date default null,
  p_received_at timestamptz default null, p_method text default 'unspecified',
  p_note text default ''
) returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  v_receipt uuid;
  v_line record;
  v_finance record;
  v_total numeric := 0;
  v_count integer := 0;
begin
  if not (select public.adva_is_ceo()) then raise exception 'CEO access required'; end if;
  if p_amount is null or p_amount <= 0 or p_currency is null then raise exception 'Invalid receipt amount or currency'; end if;
  if p_allocations is null or jsonb_typeof(p_allocations) <> 'array' or jsonb_array_length(p_allocations) = 0 then
    raise exception 'At least one invoice allocation is required';
  end if;
  if p_received_at is not null and p_received_on is not null
    and (p_received_at at time zone 'Asia/Dubai')::date <> p_received_on then
    raise exception 'Receipt timestamp must match the UAE receipt date';
  end if;
  if (select count(*) from jsonb_to_recordset(p_allocations) as a(finance_id uuid,amount numeric))
    <> (select count(distinct finance_id) from jsonb_to_recordset(p_allocations) as a(finance_id uuid,amount numeric)) then
    raise exception 'An invoice may only occur once in one receipt';
  end if;
  for v_line in select * from jsonb_to_recordset(p_allocations) as a(finance_id uuid,amount numeric) loop
    if v_line.finance_id is null or v_line.amount is null or v_line.amount <= 0
      or v_line.amount <> round(v_line.amount,2) then raise exception 'Invalid allocation'; end if;
    select project_id,currency,amount_due,amount_paid into v_finance
      from public.adva_monthly_finances where id=v_line.finance_id for update;
    if not found or v_finance.project_id <> p_project_id or v_finance.currency <> p_currency then
      raise exception 'Allocation belongs to another client or currency'; end if;
    if v_line.amount > v_finance.amount_due - v_finance.amount_paid then
      raise exception 'Allocation exceeds invoice outstanding balance'; end if;
    v_total := v_total + v_line.amount;
    v_count := v_count + 1;
  end loop;
  if v_total <> p_amount then raise exception 'Receipt amount must equal its allocations'; end if;
  insert into public.adva_receipts(project_id,currency,amount,received_on,received_at,method,note)
    values(p_project_id,p_currency,p_amount,coalesce(p_received_on,(p_received_at at time zone 'Asia/Dubai')::date),
           p_received_at,p_method,coalesce(p_note,''))
    returning id into v_receipt;
  insert into public.adva_receipt_allocations(receipt_id,finance_id,amount)
    select v_receipt,a.finance_id,a.amount
    from jsonb_to_recordset(p_allocations) as a(finance_id uuid,amount numeric);
  return v_receipt;
end $$;
revoke all on function public.adva_record_receipt(uuid,text,numeric,jsonb,date,timestamptz,text,text) from PUBLIC,anon;
grant execute on function public.adva_record_receipt(uuid,text,numeric,jsonb,date,timestamptz,text,text) to authenticated;

-- Voiding retains the payment history and reconciles the monthly ledger.
create or replace function public.adva_void_receipt(p_receipt_id uuid,p_reason text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare v_status text;
begin
  if not (select public.adva_is_ceo()) then raise exception 'CEO access required'; end if;
  if char_length(btrim(coalesce(p_reason,''))) < 4 then raise exception 'A reason is required'; end if;
  select status into v_status from public.adva_receipts where id=p_receipt_id for update;
  if not found then raise exception 'Receipt does not exist'; end if;
  if v_status <> 'posted' then raise exception 'Receipt already voided'; end if;
  update public.adva_receipts
  set status='void',voided_at=now(),void_reason=left(btrim(p_reason),1000)
  where id=p_receipt_id;
  return true;
end $$;
revoke all on function public.adva_void_receipt(uuid,text) from PUBLIC,anon;
grant execute on function public.adva_void_receipt(uuid,text) to authenticated;
