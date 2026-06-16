-- RLS test harness: emulates the minimal Supabase auth surface used by 002_android_rebuild.sql
-- so the policies can be executed against a plain PostgreSQL instance.
create extension if not exists pgcrypto;

create schema if not exists auth;
create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  email text
);

-- Supabase exposes auth.uid() from the request JWT. For tests we read a GUC.
create or replace function auth.uid() returns uuid
language sql stable as $$
  select nullif(current_setting('app.uid', true), '')::uuid
$$;

-- 002 references organizations(id); create the minimal shape it needs.
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

-- Client roles (match Supabase).
do $$ begin create role anon nologin; exception when duplicate_object then null; end $$;
do $$ begin create role authenticated nologin; exception when duplicate_object then null; end $$;
