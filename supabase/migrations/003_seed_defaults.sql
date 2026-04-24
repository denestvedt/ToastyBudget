-- Migration 003: Ensure accounts table exists + seed default category groups
-- Safe to run multiple times.

-- ============================================================
-- Ensure accounts table exists (re-applies 002 content safely)
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

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'accounts'
    and policyname = 'Allow authenticated read on accounts'
  ) then
    create policy "Allow authenticated read on accounts"
      on accounts for select using (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'accounts'
    and policyname = 'Allow authenticated insert on accounts'
  ) then
    create policy "Allow authenticated insert on accounts"
      on accounts for insert with check (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'accounts'
    and policyname = 'Allow authenticated update on accounts'
  ) then
    create policy "Allow authenticated update on accounts"
      on accounts for update using (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'accounts'
    and policyname = 'Allow authenticated delete on accounts'
  ) then
    create policy "Allow authenticated delete on accounts"
      on accounts for delete using (auth.role() = 'authenticated');
  end if;
end $$;

-- ============================================================
-- Seed 4 default category groups + starter categories
-- Only runs when no groups exist (first-time setup).
--
-- Groups:
--   1. Housing       — fixed costs like rent, utilities
--   2. Food & Dining — groceries and restaurants
--   3. Transportation — car, gas, transit
--   4. Savings & Investments — 401k (off-ledger), emergency fund
--
-- Off-ledger categories (is_offledger = true) are NOT tracked
-- via CSV import. Instead the user manually enters the monthly
-- contributed/spent amount directly in the Budget tab.
-- ============================================================
do $$ begin
  if not exists (select 1 from category_groups limit 1) then

    insert into category_groups (id, name, icon, "order") values
      ('group-housing',   'Housing',              '🏠', 0),
      ('group-food',      'Food & Dining',         '🍽️', 1),
      ('group-transport', 'Transportation',        '🚗', 2),
      ('group-savings',   'Savings & Investments', '💰', 3);

    -- Housing categories
    insert into budget_categories
      (id, group_id, name, budget_amount, is_fixed, is_offledger, "order") values
      ('cat-rent',      'group-housing',   'Rent / Mortgage', 0, true,  false, 0),
      ('cat-utilities', 'group-housing',   'Utilities',       0, false, false, 1),
      ('cat-insurance', 'group-housing',   'Insurance',       0, true,  false, 2);

    -- Food categories
    insert into budget_categories
      (id, group_id, name, budget_amount, is_fixed, is_offledger, "order") values
      ('cat-groceries', 'group-food',      'Groceries',       0, false, false, 0),
      ('cat-dining',    'group-food',      'Dining Out',      0, false, false, 1);

    -- Transportation categories
    insert into budget_categories
      (id, group_id, name, budget_amount, is_fixed, is_offledger, "order") values
      ('cat-car-pay',   'group-transport', 'Car Payment',     0, true,  false, 0),
      ('cat-gas',       'group-transport', 'Gas',             0, false, false, 1),
      ('cat-transit',   'group-transport', 'Transit / Uber',  0, false, false, 2);

    -- Savings & Investments — off-ledger: no CSV tracking, enter amounts manually
    insert into budget_categories
      (id, group_id, name, budget_amount, is_fixed, is_offledger, "order") values
      ('cat-401k',      'group-savings',   '401k',            0, false, true,  0),
      ('cat-emergency', 'group-savings',   'Emergency Fund',  0, false, true,  1),
      ('cat-invest',    'group-savings',   'Other Investments',0, false, true,  2);

  end if;
end $$;
