-- Finance audit must run AFTER the parent row exists, or its foreign key fails.
-- Keep updated_at mutation separate in a BEFORE UPDATE trigger.
create or replace function private.adva_finance_set_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;
create or replace function private.adva_finance_audit_after()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' or
      (old.amount_due is distinct from new.amount_due or old.amount_paid is distinct from new.amount_paid) then
    insert into public.adva_finance_audit(finance_id,project_id,event,old_due,old_paid,new_due,new_paid,actor_id)
    values (new.id,new.project_id,case when tg_op = 'INSERT' then 'created' else 'changed' end,
      case when tg_op = 'INSERT' then null else old.amount_due end,
      case when tg_op = 'INSERT' then null else old.amount_paid end,
      new.amount_due,new.amount_paid,auth.uid());
  end if;
  return new;
end $$;
revoke all on function private.adva_finance_audit_after() from PUBLIC, anon, authenticated;
drop trigger if exists adva_finance_logged on public.adva_monthly_finances;
drop trigger if exists adva_finance_updated_at on public.adva_monthly_finances;
create trigger adva_finance_updated_at before update on public.adva_monthly_finances
for each row execute function private.adva_finance_set_updated_at();
create trigger adva_finance_logged after insert or update on public.adva_monthly_finances
for each row execute function private.adva_finance_audit_after();
drop function if exists public.adva_log_finance_change();
