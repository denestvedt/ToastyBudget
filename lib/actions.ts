"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ── Internal helper ────────────────────────────────────────────────────────

/** Recalculate monthly_budgets.spent_amount for one category+month pair by
 *  summing all matching transactions.  Creates the monthly_budget row if it
 *  doesn't exist yet (seeding budget_amount from the category default). */
async function recalculateSpent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  categoryId: string,
  month: string
) {
  const { data: txData, error: txError } = await supabase
    .from("transactions")
    .select("amount")
    .eq("category_id", categoryId)
    .eq("month", month);
  if (txError) throw new Error(txError.message);

  const spent = (txData ?? []).reduce((sum, tx) => sum + Number(tx.amount), 0);

  const { data: existing } = await supabase
    .from("monthly_budgets")
    .select("id")
    .eq("category_id", categoryId)
    .eq("month", month)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("monthly_budgets")
      .update({ spent_amount: spent })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { data: cat } = await supabase
      .from("budget_categories")
      .select("budget_amount")
      .eq("id", categoryId)
      .single();

    const { error } = await supabase.from("monthly_budgets").insert({
      category_id: categoryId,
      month,
      budget_amount: cat?.budget_amount ?? 0,
      spent_amount: spent,
    });
    if (error) throw new Error(error.message);
  }
}

// ── Budget actions ─────────────────────────────────────────────────────────

export async function updateMonthlyBudget(id: string, budget_amount: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("monthly_budgets")
    .update({ budget_amount })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function updateMonthlySpent(id: string, spent_amount: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("monthly_budgets")
    .update({ spent_amount })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function copyBudgetToMonth(fromMonth: string, toMonth: string) {
  const supabase = await createClient();

  const { data: source, error } = await supabase
    .from("monthly_budgets")
    .select("category_id, budget_amount")
    .eq("month", fromMonth);

  if (error) throw new Error(error.message);
  if (!source?.length) throw new Error(`No budget data found for ${fromMonth}`);

  const rows = source.map((mb) => ({
    category_id: mb.category_id,
    month: toMonth,
    budget_amount: mb.budget_amount,
    spent_amount: 0,
  }));

  const { error: upsertError } = await supabase
    .from("monthly_budgets")
    .upsert(rows, { onConflict: "category_id,month" });

  if (upsertError) throw new Error(upsertError.message);
  revalidatePath("/", "layout");
}

// ── Transaction actions ────────────────────────────────────────────────────

export async function importTransactions(
  rows: Array<{ date: string; description: string; amount: number; month: string }>
) {
  const supabase = await createClient();
  const { error } = await supabase.from("transactions").insert(rows);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function updateTransactionCategory(
  transactionId: string,
  newCategoryId: string | null
) {
  const supabase = await createClient();

  const { data: txData, error: txError } = await supabase
    .from("transactions")
    .select("category_id, month")
    .eq("id", transactionId)
    .single();
  if (txError) throw new Error(txError.message);

  const { error: updateError } = await supabase
    .from("transactions")
    .update({ category_id: newCategoryId })
    .eq("id", transactionId);
  if (updateError) throw new Error(updateError.message);

  const { category_id: oldCategoryId, month } = txData;
  if (oldCategoryId) await recalculateSpent(supabase, oldCategoryId, month);
  if (newCategoryId && newCategoryId !== oldCategoryId)
    await recalculateSpent(supabase, newCategoryId, month);

  revalidatePath("/", "layout");
}

export async function deleteTransaction(transactionId: string) {
  const supabase = await createClient();

  const { data: txData, error: txError } = await supabase
    .from("transactions")
    .select("category_id, month")
    .eq("id", transactionId)
    .single();
  if (txError) throw new Error(txError.message);

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transactionId);
  if (error) throw new Error(error.message);

  if (txData.category_id)
    await recalculateSpent(supabase, txData.category_id, txData.month);

  revalidatePath("/", "layout");
}

// ── Category group actions ─────────────────────────────────────────────────

export async function createCategoryGroup(data: {
  id: string;
  name: string;
  icon?: string;
  order: number;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("category_groups").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function updateCategoryGroup(
  id: string,
  data: { name?: string; icon?: string; order?: number }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("category_groups")
    .update(data)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function deleteCategoryGroup(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("category_groups")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

// ── Budget category actions ────────────────────────────────────────────────

export async function createBudgetCategory(data: {
  id: string;
  group_id: string;
  name: string;
  budget_amount?: number;
  is_fixed?: boolean;
  is_offledger?: boolean;
  order: number;
  notes?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("budget_categories").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function updateBudgetCategory(
  id: string,
  data: {
    name?: string;
    budget_amount?: number;
    is_fixed?: boolean;
    is_offledger?: boolean;
    order?: number;
    notes?: string;
  }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("budget_categories")
    .update(data)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function deleteBudgetCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("budget_categories")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

// ── Account actions ────────────────────────────────────────────────────────

export async function createAccount(data: {
  name: string;
  type: string;
  balance: number;
  notes?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("accounts").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/accounts");
}

export async function updateAccount(
  id: string,
  data: { name?: string; type?: string; balance?: number; notes?: string }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("accounts")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/accounts");
}

export async function deleteAccount(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("accounts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/accounts");
}
