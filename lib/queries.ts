// Server-side data fetching — only import this from Server Components

import { createClient } from "@/lib/supabase/server";
import type {
  BudgetCategory,
  CategoryGroup,
  MonthlyBudget,
  Account,
  GroupWithCategories,
  CategoryWithMonthly,
  TransactionWithCategory,
  MonthlySummary,
  GroupSummary,
} from "@/lib/types";

// Re-export types so pages can import from one place
export type {
  BudgetCategory,
  CategoryGroup,
  MonthlyBudget,
  Account,
  GroupWithCategories,
  CategoryWithMonthly,
  TransactionWithCategory,
  MonthlySummary,
  GroupSummary,
};

// ── Categories (for dropdowns) ────────────────────────────────────────────

export async function getCategories(): Promise<BudgetCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("budget_categories")
    .select("*")
    .order("order");
  if (error) throw error;
  return data ?? [];
}

export async function getCategoryGroups(): Promise<CategoryGroup[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("category_groups")
    .select("*")
    .order("order");
  if (error) throw error;
  return data ?? [];
}

// ── Budget page ────────────────────────────────────────────────────────────

/** Fetch budget data for a month, seeding missing monthly_budget rows from
 *  the category defaults so every category always has a monthly row. */
export async function getBudgetData(month: string): Promise<GroupWithCategories[]> {
  const supabase = await createClient();

  const [groupsRes, categoriesRes, monthlyRes] = await Promise.all([
    supabase.from("category_groups").select("*").order("order"),
    supabase.from("budget_categories").select("*").order("order"),
    supabase.from("monthly_budgets").select("*").eq("month", month),
  ]);

  if (groupsRes.error) throw groupsRes.error;
  if (categoriesRes.error) throw categoriesRes.error;
  if (monthlyRes.error) throw monthlyRes.error;

  const groups = groupsRes.data ?? [];
  const categories = categoriesRes.data ?? [];
  const monthlyBudgets = monthlyRes.data ?? [];

  // Build lookup: category_id → monthly_budget row
  const monthlyMap = new Map<string, MonthlyBudget>(
    monthlyBudgets.map((mb) => [mb.category_id, mb])
  );

  // Seed rows for categories that don't have a monthly entry yet
  const missing = categories.filter((cat) => !monthlyMap.has(cat.id));
  if (missing.length > 0) {
    const toInsert = missing.map((cat) => ({
      category_id: cat.id,
      month,
      budget_amount: cat.budget_amount,
      spent_amount: 0,
    }));

    const { data: inserted, error: insertError } = await supabase
      .from("monthly_budgets")
      .upsert(toInsert, { onConflict: "category_id,month" })
      .select();

    if (insertError) throw insertError;
    (inserted ?? []).forEach((mb: MonthlyBudget) => monthlyMap.set(mb.category_id, mb));
  }

  // Bucket categories by group
  const catsByGroup = new Map<string, CategoryWithMonthly[]>();
  categories.forEach((cat) => {
    const monthly = monthlyMap.get(cat.id) ?? {
      id: "",
      category_id: cat.id,
      month,
      budget_amount: cat.budget_amount,
      spent_amount: 0,
      notes: null,
    };
    if (!catsByGroup.has(cat.group_id)) catsByGroup.set(cat.group_id, []);
    catsByGroup.get(cat.group_id)!.push({ ...cat, monthly });
  });

  return groups.map((g) => ({ ...g, categories: catsByGroup.get(g.id) ?? [] }));
}

// ── Transactions page ──────────────────────────────────────────────────────

export async function getTransactions(month: string): Promise<TransactionWithCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*, category:budget_categories(id, name)")
    .eq("month", month)
    .order("date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as TransactionWithCategory[];
}

// ── Dashboard ──────────────────────────────────────────────────────────────

export async function getSummary(month: string): Promise<MonthlySummary> {
  const supabase = await createClient();

  const [groupsRes, monthlyRes, categoriesRes] = await Promise.all([
    supabase.from("category_groups").select("*").order("order"),
    supabase.from("monthly_budgets").select("*").eq("month", month),
    supabase.from("budget_categories").select("id, group_id"),
  ]);

  if (groupsRes.error) throw groupsRes.error;
  if (monthlyRes.error) throw monthlyRes.error;
  if (categoriesRes.error) throw categoriesRes.error;

  const groups = groupsRes.data ?? [];
  const monthlyBudgets = monthlyRes.data ?? [];
  const categories = categoriesRes.data ?? [];

  const catGroupMap = new Map<string, string>(
    categories.map((c) => [c.id, c.group_id])
  );

  const groupAgg = new Map<string, { total_budget: number; total_spent: number }>();
  monthlyBudgets.forEach((mb) => {
    const gid = catGroupMap.get(mb.category_id);
    if (!gid) return;
    if (!groupAgg.has(gid)) groupAgg.set(gid, { total_budget: 0, total_spent: 0 });
    const agg = groupAgg.get(gid)!;
    agg.total_budget += Number(mb.budget_amount);
    agg.total_spent += Number(mb.spent_amount);
  });

  const groupSummaries: GroupSummary[] = groups.map((g) => {
    const agg = groupAgg.get(g.id) ?? { total_budget: 0, total_spent: 0 };
    return { id: g.id, name: g.name, icon: g.icon, ...agg };
  });

  return {
    total_budget: groupSummaries.reduce((s, g) => s + g.total_budget, 0),
    total_spent: groupSummaries.reduce((s, g) => s + g.total_spent, 0),
    groups: groupSummaries,
  };
}

// ── Accounts page ──────────────────────────────────────────────────────────

export async function getAccounts(): Promise<Account[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}
