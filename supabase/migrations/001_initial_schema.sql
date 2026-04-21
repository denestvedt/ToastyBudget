-- ToastyBudget Initial Schema
-- Run this in the Supabase SQL Editor to set up the database.

-- ============================================================
-- category_groups
-- Top-level groupings (e.g. Housing, Food, Transportation)
-- ============================================================
create table if not exists category_groups (
  id     text primary key,
  name   text        not null,
  icon   text,
  "order" integer    not null default 0
);

alter table category_groups enable row level security;

create policy "Allow authenticated read on category_groups"
  on category_groups for select
  using (auth.role() = 'authenticated');

create policy "Allow authenticated insert on category_groups"
  on category_groups for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated update on category_groups"
  on category_groups for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated delete on category_groups"
  on category_groups for delete
  using (auth.role() = 'authenticated');

-- ============================================================
-- budget_categories
-- Individual spending categories within a group
-- ============================================================
create table if not exists budget_categories (
  id             text primary key,
  group_id       text        not null references category_groups (id) on delete cascade,
  name           text        not null,
  budget_amount  numeric(12, 2) not null default 0,
  is_fixed       boolean     not null default false,
  is_offledger   boolean     not null default false,
  notes          text,
  "order"        integer     not null default 0
);

alter table budget_categories enable row level security;

create policy "Allow authenticated read on budget_categories"
  on budget_categories for select
  using (auth.role() = 'authenticated');

create policy "Allow authenticated insert on budget_categories"
  on budget_categories for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated update on budget_categories"
  on budget_categories for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated delete on budget_categories"
  on budget_categories for delete
  using (auth.role() = 'authenticated');

-- ============================================================
-- monthly_budgets
-- Per-category monthly budget and spent tracking
-- month format: "YYYY-MM" (e.g. "2026-04")
-- ============================================================
create table if not exists monthly_budgets (
  id             uuid primary key default gen_random_uuid(),
  category_id    text        not null references budget_categories (id) on delete cascade,
  month          text        not null,
  budget_amount  numeric(12, 2) not null default 0,
  spent_amount   numeric(12, 2) not null default 0,
  notes          text,
  unique (category_id, month)
);

alter table monthly_budgets enable row level security;

create policy "Allow authenticated read on monthly_budgets"
  on monthly_budgets for select
  using (auth.role() = 'authenticated');

create policy "Allow authenticated insert on monthly_budgets"
  on monthly_budgets for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated update on monthly_budgets"
  on monthly_budgets for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated delete on monthly_budgets"
  on monthly_budgets for delete
  using (auth.role() = 'authenticated');

-- ============================================================
-- transactions
-- Individual financial transactions imported from CSV
-- ============================================================
create table if not exists transactions (
  id           uuid primary key default gen_random_uuid(),
  date         date        not null,
  description  text        not null,
  amount       numeric(12, 2) not null,
  category_id  text        references budget_categories (id) on delete set null,
  month        text        not null,
  notes        text,
  created_at   timestamptz not null default now()
);

alter table transactions enable row level security;

create policy "Allow authenticated read on transactions"
  on transactions for select
  using (auth.role() = 'authenticated');

create policy "Allow authenticated insert on transactions"
  on transactions for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated update on transactions"
  on transactions for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated delete on transactions"
  on transactions for delete
  using (auth.role() = 'authenticated');

-- ============================================================
-- Indexes for common query patterns
-- ============================================================
create index if not exists idx_budget_categories_group_id on budget_categories (group_id);
create index if not exists idx_monthly_budgets_month on monthly_budgets (month);
create index if not exists idx_monthly_budgets_category_month on monthly_budgets (category_id, month);
create index if not exists idx_transactions_month on transactions (month);
create index if not exists idx_transactions_date on transactions (date);
create index if not exists idx_transactions_category_id on transactions (category_id);
