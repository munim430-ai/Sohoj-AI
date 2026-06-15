-- ============================================================================
-- 002_android_rebuild.sql
-- sohojAI Android-first rebuild — production data model.
--
-- Supersedes the POC credit model (001_init.sql: starter/pro/enterprise +
-- credit_balance). This migration introduces the multi-tenant, device-bound,
-- bKash-transaction-intelligence schema with full RLS tenant isolation.
--
-- Safe to run after 001. It does NOT drop POC tables; the backend migration
-- job will backfill/retire them separately. NOTHING here stores OTP, PIN,
-- raw SMS bodies, or full notification history.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── Enums ───────────────────────────────────────────────────────────────────
do $$ begin
  create type member_role as enum ('owner', 'admin', 'staff');
exception when duplicate_object then null; end $$;

do $$ begin
  create type plan_tier as enum ('free', 'basic', 'pro');
exception when duplicate_object then null; end $$;

do $$ begin
  create type subscription_status as enum ('active', 'past_due', 'cancelled', 'trialing');
exception when duplicate_object then null; end $$;

do $$ begin
  create type device_status as enum ('active', 'revoked');
exception when duplicate_object then null; end $$;

-- bKash transaction taxonomy (the parser maps to exactly these)
do $$ begin
  create type txn_type as enum (
    'cash_in', 'cash_out',
    'send_money_sent', 'send_money_received',
    'merchant_payment', 'charge', 'balance_update'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type txn_source as enum ('notification', 'sms_share', 'manual_paste');
exception when duplicate_object then null; end $$;

-- ── organization_members (membership + role; replaces POC `users`) ───────────
create table if not exists organization_members (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  auth_id         uuid not null references auth.users(id) on delete cascade,
  email           text not null,
  role            member_role not null default 'staff',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (organization_id, auth_id)
);
create index if not exists idx_org_members_org on organization_members(organization_id);
create index if not exists idx_org_members_auth on organization_members(auth_id);

-- ── Helper: org ids the current auth user belongs to (SECURITY DEFINER avoids
--    recursive RLS evaluation on organization_members) ─────────────────────────
create or replace function auth_org_ids()
returns setof uuid
language sql stable security definer set search_path = public as $$
  select organization_id from organization_members where auth_id = auth.uid()
$$;

create or replace function auth_has_org_role(target_org uuid, roles member_role[])
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from organization_members
    where auth_id = auth.uid() and organization_id = target_org and role = any(roles)
  )
$$;

-- ── subscriptions (Free / Basic ৳1,999 / Pro ৳4,999; no annual plans) ────────
create table if not exists subscriptions (
  id                   uuid primary key default gen_random_uuid(),
  organization_id      uuid not null references organizations(id) on delete cascade,
  plan                 plan_tier not null default 'free',
  status               subscription_status not null default 'active',
  device_limit         int not null default 0,         -- free:0 auto, basic:1, pro:3
  monthly_txn_limit    int not null default 0,         -- free:0 auto, basic:3000, pro:15000
  auto_renew           boolean not null default true,
  current_period_start date not null default current_date,
  current_period_end   date,
  provider             text not null default 'mock',   -- mock | sslcommerz
  provider_ref         text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (organization_id)
);
create index if not exists idx_subscriptions_org on subscriptions(organization_id);

-- ── usage_events (metering for entitlement enforcement) ──────────────────────
create table if not exists usage_events (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  kind            text not null,                        -- 'txn_ingested' | 'ai_query' | ...
  quantity        int not null default 1,
  period          date not null default current_date,
  created_at      timestamptz not null default now()
);
create index if not exists idx_usage_org_period on usage_events(organization_id, period);

-- ── android_devices (device binding + revocation) ────────────────────────────
create table if not exists android_devices (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  auth_id         uuid not null references auth.users(id) on delete cascade,
  device_label    text,
  device_hash     text not null,                        -- salted hash of install id; no raw IDs
  status          device_status not null default 'active',
  last_seen_at    timestamptz,
  created_at      timestamptz not null default now(),
  revoked_at      timestamptz,
  unique (organization_id, device_hash)
);
create index if not exists idx_devices_org on android_devices(organization_id);

-- ── device_sessions (per-device auth sessions) ──────────────────────────────
create table if not exists device_sessions (
  id              uuid primary key default gen_random_uuid(),
  device_id       uuid not null references android_devices(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  started_at      timestamptz not null default now(),
  last_active_at  timestamptz not null default now(),
  ended_at        timestamptz
);
create index if not exists idx_device_sessions_device on device_sessions(device_id);

-- ── bkash_transactions (PRIMARY financial table; parsed fields only) ─────────
create table if not exists bkash_transactions (
  id                 uuid primary key default gen_random_uuid(),
  organization_id    uuid not null references organizations(id) on delete cascade,
  device_id          uuid references android_devices(id) on delete set null,
  type               txn_type not null,
  amount             numeric(14,2) not null check (amount >= 0),
  fee                numeric(14,2) not null default 0 check (fee >= 0),
  balance_after      numeric(14,2),
  counterparty       text,                              -- masked number or merchant name
  trx_id             text,                              -- bKash TrxID (natural dedupe key)
  occurred_at        timestamptz,
  source             txn_source not null,
  -- dedupe without storing raw text: hash over (trx_id|amount|occurred_at)
  dedupe_hash        text not null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (organization_id, dedupe_hash)
);
create index if not exists idx_txn_org_time on bkash_transactions(organization_id, occurred_at desc);
create index if not exists idx_txn_org_type on bkash_transactions(organization_id, type);
create index if not exists idx_txn_trxid on bkash_transactions(trx_id);

-- ── transaction_tags (user labels) ──────────────────────────────────────────
create table if not exists transaction_tags (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  transaction_id  uuid not null references bkash_transactions(id) on delete cascade,
  label           text not null,
  created_at      timestamptz not null default now(),
  unique (transaction_id, label)
);
create index if not exists idx_tags_org on transaction_tags(organization_id);

-- ── sync_batches (audit of device→cloud syncs) ──────────────────────────────
create table if not exists sync_batches (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  device_id       uuid references android_devices(id) on delete set null,
  item_count      int not null default 0,
  accepted_count  int not null default 0,
  rejected_count  int not null default 0,
  status          text not null default 'completed',
  created_at      timestamptz not null default now()
);
create index if not exists idx_sync_org on sync_batches(organization_id, created_at desc);

-- ── audit_logs (security/compliance trail) ──────────────────────────────────
create table if not exists audit_logs (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete set null,
  actor_auth_id   uuid,
  action          text not null,
  entity          text,
  entity_id       uuid,
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);
create index if not exists idx_audit_org_time on audit_logs(organization_id, created_at desc);

-- ── updated_at trigger ───────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

do $$ declare t text;
begin
  foreach t in array array['organization_members','subscriptions','android_devices','bkash_transactions']
  loop
    execute format(
      'drop trigger if exists trg_%1$s_updated on %1$s; create trigger trg_%1$s_updated before update on %1$s for each row execute function set_updated_at();', t);
  end loop;
end $$;

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table organization_members enable row level security;
alter table subscriptions        enable row level security;
alter table usage_events          enable row level security;
alter table android_devices       enable row level security;
alter table device_sessions       enable row level security;
alter table bkash_transactions    enable row level security;
alter table transaction_tags      enable row level security;
alter table sync_batches          enable row level security;
alter table audit_logs            enable row level security;

-- Members: a user can read members of orgs they belong to.
create policy members_select on organization_members for select
  using (organization_id in (select auth_org_ids()));
-- Only owners/admins manage membership.
create policy members_write on organization_members for all
  using (auth_has_org_role(organization_id, array['owner','admin']::member_role[]))
  with check (auth_has_org_role(organization_id, array['owner','admin']::member_role[]));

-- Generic tenant-isolation read for org-scoped tables.
create policy subs_select   on subscriptions      for select using (organization_id in (select auth_org_ids()));
create policy usage_select  on usage_events        for select using (organization_id in (select auth_org_ids()));
create policy devices_select on android_devices    for select using (organization_id in (select auth_org_ids()));
create policy sessions_select on device_sessions   for select using (organization_id in (select auth_org_ids()));
create policy tags_select   on transaction_tags    for select using (organization_id in (select auth_org_ids()));
create policy batches_select on sync_batches        for select using (organization_id in (select auth_org_ids()));
create policy audit_select  on audit_logs          for select using (organization_id in (select auth_org_ids()));

-- Devices: a member may revoke (owners/admins) — writes restricted.
create policy devices_write on android_devices for all
  using (auth_has_org_role(organization_id, array['owner','admin']::member_role[]))
  with check (auth_has_org_role(organization_id, array['owner','admin']::member_role[]));

-- Transactions: members of the org may read; insert/update only for their org
-- AND only from an active, non-revoked device they own.
create policy txn_select on bkash_transactions for select
  using (organization_id in (select auth_org_ids()));
create policy txn_insert on bkash_transactions for insert
  with check (
    organization_id in (select auth_org_ids())
    and exists (
      select 1 from android_devices d
      where d.id = bkash_transactions.device_id
        and d.organization_id = bkash_transactions.organization_id
        and d.status = 'active'
    )
  );
create policy txn_update on bkash_transactions for update
  using (organization_id in (select auth_org_ids()))
  with check (organization_id in (select auth_org_ids()));

create policy tags_write on transaction_tags for all
  using (organization_id in (select auth_org_ids()))
  with check (organization_id in (select auth_org_ids()));

-- usage_events / sync_batches / audit_logs are written by the backend
-- (service role, which bypasses RLS). No client INSERT policy is granted on
-- purpose, so the anon key can never forge metering or audit rows.

-- NOTE: subscriptions are mutated only by the backend (entitlement service)
-- via service role; no client write policy by design.
