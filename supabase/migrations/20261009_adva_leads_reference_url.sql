-- Optional reference links for incoming public briefs. Private through existing CEO-only RLS.
alter table public.adva_leads add column if not exists reference_url text not null default '';
do $$
begin
 if not exists(select 1 from pg_constraint where conname='adva_leads_reference_url_length' and conrelid='public.adva_leads'::regclass) then
  alter table public.adva_leads add constraint adva_leads_reference_url_length check(length(reference_url)<=600);
 end if;
end $$;
