-- ToastyBudget Accounts Migration
-- Run this in the Supabase SQL Editor after 001_initial_schema.sql

-- ============================================================
-- accounts
-- User-managed account balances (checking, savings, credit, etc.)
-- ============================================================
create table if not exists accounts (
  id          uuid primary key default gen_random_uuid(),
  name        text           not null,
  type        text           not null default 'checking',
  balance     numeric(12, 2) not null default 0,
  notes       text,
  updated_at  timestamptz    not null default now()
);

alter table accounts enable row level security;

create policy "Allow authenticated read on accounts"
  on accounts for select
  using (auth.role() = 'authenticated');

create policy "Allow authenticated insert on accounts"
  on accounts for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated update on accounts"
  on accounts for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated delete on accounts"
  on accounts for delete
  using (auth.role() = 'authenticated');
