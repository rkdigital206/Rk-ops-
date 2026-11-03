-- RK Ops — Phase 1 schema (Supabase / Postgres)
-- Run in the Supabase SQL editor. Credentials are NOT stored here:
-- keep cPanel / WP / hosting logins in a vault (Supabase Vault, Bitwarden, Infisical)
-- and store only a reference id in `vault_ref`.

create extension if not exists "pgcrypto";

create type site_platform as enum ('wordpress', 'custom_php', 'shopify', 'other');
create type integration_tier as enum ('A', 'C', 'D');
create type hosting_owner as enum ('rk_digital', 'client');
create type request_status as enum ('new', 'in_progress', 'awaiting_approval', 'done', 'follow_up_due');
create type request_priority as enum ('low', 'normal', 'urgent');

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  whatsapp text,                -- E.164, e.g. +923001234567
  email text,
  plan text default 'project',  -- care_plan | hosting_only | project
  monthly_amount numeric(10,2) default 0,
  notes text,
  created_at timestamptz default now()
);

create table hostings (
  id uuid primary key default gen_random_uuid(),
  provider text not null,       -- Hostinger | cPanel host name
  plan text,
  panel text,                   -- hPanel | cPanel
  server_ip text,
  panel_url text,
  owned_by hosting_owner not null default 'rk_digital',
  billed_to_client boolean default false,
  renewal_amount numeric(10,2),
  expires_on date not null,
  vault_ref text,               -- pointer to credentials in vault
  created_at timestamptz default now()
);

create table sites (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  hosting_id uuid references hostings(id) on delete set null,
  name text not null,
  domain text not null unique,
  platform site_platform not null default 'wordpress',
  tier integration_tier not null default 'D',
  registrar text,
  domain_expires_on date,
  ssl_expires_on date,
  repo_url text,                -- Tier C: GitHub repository
  vault_ref text,
  status text default 'up',     -- updated by uptime monitor
  uptime_pct numeric(5,2),
  response_ms integer,
  last_checked_at timestamptz,
  created_at timestamptz default now()
);

create table requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  site_id uuid references sites(id) on delete set null,
  message text not null,
  category text,                -- set by AI classifier
  priority request_priority default 'normal',
  status request_status default 'new',
  wa_message_id text unique,    -- WhatsApp message id (dedupe)
  received_at timestamptz default now(),
  completed_at timestamptz,
  followup_sent_at timestamptz
);

create table reminder_log (
  id uuid primary key default gen_random_uuid(),
  item_type text not null,      -- domain | hosting | ssl
  item_id uuid not null,
  days_before integer not null, -- 60 | 30 | 7 | 1
  recipient text not null,      -- owner | client
  sent_at timestamptz default now(),
  unique (item_type, item_id, days_before, recipient)
);

-- One row per upcoming expiry, used by n8n's daily check.
create or replace view expiry_items as
  select 'domain'::text as item_type, s.id as item_id, s.domain as label,
         c.id as client_id, c.name as client_name, c.whatsapp as client_whatsapp,
         s.domain_expires_on as expires_on, null::numeric as amount
    from sites s join clients c on c.id = s.client_id
   where s.domain_expires_on is not null
  union all
  select 'ssl', s.id, s.domain, c.id, c.name, c.whatsapp, s.ssl_expires_on, null
    from sites s join clients c on c.id = s.client_id
   where s.ssl_expires_on is not null
  union all
  select 'hosting', h.id, h.provider || ' - ' || coalesce(h.plan, ''),
         c.id, c.name, c.whatsapp, h.expires_on, h.renewal_amount
    from hostings h
    left join lateral (
      select cl.* from sites si join clients cl on cl.id = si.client_id
       where si.hosting_id = h.id limit 1
    ) c on true;

-- Row Level Security: lock everything down, access via service role / authenticated owner.
alter table clients enable row level security;
alter table hostings enable row level security;
alter table sites enable row level security;
alter table requests enable row level security;
alter table reminder_log enable row level security;

create policy "owner full access" on clients for all to authenticated using (true) with check (true);
create policy "owner full access" on hostings for all to authenticated using (true) with check (true);
create policy "owner full access" on sites for all to authenticated using (true) with check (true);
create policy "owner full access" on requests for all to authenticated using (true) with check (true);
create policy "owner full access" on reminder_log for all to authenticated using (true) with check (true);
