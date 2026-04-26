// Composite types shared between server (queries) and client (component props)

import type { BudgetCategory, CategoryGroup, MonthlyBudget, Transaction, Account } from "@/lib/database.types";

export type { BudgetCategory, CategoryGroup, MonthlyBudget, Transaction, Account };

// Budget page
export type CategoryWithMonthly = BudgetCategory & {
  monthly: MonthlyBudget;
};

export type GroupWithCategories = CategoryGroup & {
  categories: CategoryWithMonthly[];
};

// Transactions page
export type TransactionWithCategory = Transaction & {
  category: { id: string; name: string } | null;
};

// Dashboard
export type GroupSummary = {
  id: string;
  name: string;
  icon: string | null;
  total_budget: number;
  total_spent: number;
};

export type MonthlySummary = {
  total_budget: number;
  total_spent: number;
  groups: GroupSummary[];
};
