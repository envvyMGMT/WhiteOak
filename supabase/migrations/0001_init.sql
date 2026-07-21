-- ============================================================
-- Blackbeam OS — initial schema (multi-tenant)
-- Apply with: supabase db push   (or the Supabase MCP apply_migration)
-- Every business is an "org"; every row is walled off by org_id via RLS.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- orgs & membership ----------
create table if not exists orgs (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  trade         text,
  service_area  text,
  license_no    text,
  phone         text,
  email         text,
  ai_tone       text default 'Friendly, plain-spoken, no jargon. Confident, fast, never pushy.',
  plan          text default 'trial',        -- trial | starter | crew | pro
  stripe_customer_id text,
  created_at    timestamptz default now()
);

-- links auth.users -> orgs (a user belongs to one org here; extend as needed)
create table if not exists memberships (
  user_id  uuid references auth.users(id) on delete cascade,
  org_id   uuid references orgs(id) on delete cascade,
  role     text default 'owner',             -- owner | crew
  primary key (user_id, org_id)
);

-- helper: the caller's org
create or replace function current_org_id() returns uuid
language sql stable security definer as $$
  select org_id from memberships where user_id = auth.uid() limit 1;
$$;

-- ---------- core tables ----------
create table if not exists leads (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references orgs(id) on delete cascade,
  name        text not null,
  phone       text,
  email       text,
  source      text,
  job         text,
  location    text,
  status      text default 'New',            -- New|Replied|Quoted|Won|Lost
  est_value   numeric default 0,
  ai_reply_at timestamptz,
  created_at  timestamptz default now()
);

create table if not exists quotes (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references orgs(id) on delete cascade,
  lead_id     uuid references leads(id) on delete set null,
  client      text,
  job         text,
  line_items  jsonb default '[]'::jsonb,
  amount      numeric default 0,
  status      text default 'Draft',          -- Draft|Sent|Viewed|Accepted|Declined
  ai_drafted  boolean default false,
  sent_at     timestamptz,
  created_at  timestamptz default now()
);

create table if not exists jobs (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references orgs(id) on delete cascade,
  quote_id    uuid references quotes(id) on delete set null,
  title       text not null,
  client      text,
  tag         text,
  stage       text default 'Scheduled',      -- Scheduled|In progress|Blocked|Done
  crew        text[] default '{}',
  value       numeric default 0,
  progress    int default 0,
  start_date  date,
  created_at  timestamptz default now()
);

create table if not exists invoices (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references orgs(id) on delete cascade,
  job_id      uuid references jobs(id) on delete set null,
  client      text,
  job         text,
  amount      numeric default 0,
  status      text default 'Draft',          -- Draft|Sent|Paid|Overdue
  due_date    date,
  pay_link    text,
  chased      boolean default false,
  created_at  timestamptz default now()
);

create table if not exists followups (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references orgs(id) on delete cascade,
  subject     text,
  channel     text,                          -- SMS|Email
  sequence    text,
  run_at      timestamptz,
  status      text default 'queued',
  automated   boolean default true,
  created_at  timestamptz default now()
);

create table if not exists automations (
  id       uuid primary key default gen_random_uuid(),
  org_id   uuid not null references orgs(id) on delete cascade,
  key      text not null,                    -- instant-reply, instant-quote, ...
  enabled  boolean default true,
  config   jsonb default '{}'::jsonb,
  unique (org_id, key)
);

create table if not exists automation_runs (
  id             uuid primary key default gen_random_uuid(),
  org_id         uuid not null references orgs(id) on delete cascade,
  automation_key text,
  input          jsonb,
  output         jsonb,
  ok             boolean default true,
  created_at     timestamptz default now()
);

-- ---------- Row-Level Security ----------
do $$
declare t text;
begin
  foreach t in array array['leads','quotes','jobs','invoices','followups','automations','automation_runs']
  loop
    execute format('alter table %I enable row level security;', t);
    execute format($p$
      create policy %1$s_rw on %1$I
        using (org_id = current_org_id())
        with check (org_id = current_org_id());
    $p$, t);
  end loop;
end $$;

alter table orgs enable row level security;
create policy orgs_rw on orgs using (id = current_org_id()) with check (id = current_org_id());
alter table memberships enable row level security;
create policy memberships_read on memberships for select using (user_id = auth.uid());

-- ---------- indexes ----------
create index if not exists idx_leads_org on leads(org_id, created_at desc);
create index if not exists idx_quotes_org on quotes(org_id, created_at desc);
create index if not exists idx_jobs_org on jobs(org_id);
create index if not exists idx_invoices_org on invoices(org_id);

-- NOTE: the n8n auto-quote workflow writes with the SERVICE ROLE key, which
-- bypasses RLS — so it must set org_id explicitly on every insert.
