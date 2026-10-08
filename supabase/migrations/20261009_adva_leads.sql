-- ADVA CRM foundation for Supabase.
-- Apply via Supabase SQL Editor AFTER reviewing with the ADVA owner.
-- This is not auto-run and does not touch the current Squarespace site.

create extension if not exists pgcrypto;

create table if not exists public.adva_leads (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 name text not null check (char_length(name) between 2 and 100),
 email text not null check (char_length(email) between 5 and 180),
 company text not null default '',
 description text not null check (char_length(description) between 12 and 2600),
 services text[] not null default '{}',
 timeline text not null default '',
 location text not null default '',
 budget text not null default '',
 status text not null default 'new' check (status in ('new','reviewing','quoted','won','lost','archived')),
 consent_to_contact boolean not null default false check (consent_to_contact = true),
 source text not null default 'adva_website'
);
create index if not exists adva_leads_created_at_idx on public.adva_leads(created_at desc);
create index if not exists adva_leads_status_idx on public.adva_leads(status);

create table if not exists public.adva_admins (
 user_id uuid primary key references auth.users(id) on delete cascade,
 role text not null check (role in ('ceo','admin','staff')),
 created_at timestamptz not null default now()
);

alter table public.adva_leads enable row level security;
alter table public.adva_admins enable row level security;

-- These tables are NOT directly accessible from the browser.
-- The server-side service_role key accesses them after validating visitors
-- and checking the authenticated admin role for internal requests.
revoke all on table public.adva_leads from public, anon, authenticated;
revoke all on table public.adva_admins from public, anon, authenticated;
grant select, insert, update, delete on public.adva_leads to service_role;
grant select, insert, update, delete on public.adva_admins to service_role;

-- No policies granting anon or authenticated direct table access.
-- CEO/admin bootstrap is intentionally manual, never self-registering.
-- Example AFTER creating an Auth user in the Supabase dashboard:
-- insert into public.adva_admins(user_id, role)
-- values ('PASTE-A-REAL-AUTH-USER-UUID-HERE', 'ceo')
-- on conflict (user_id) do update set role=excluded.role;
