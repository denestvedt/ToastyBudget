// Database type definitions matching the Supabase schema

export interface CategoryGroup {
  id: string;
  name: string;
  icon: string | null;
  order: number;
}

export interface BudgetCategory {
  id: string;
  group_id: string;
  name: string;
  budget_amount: number;
  is_fixed: boolean;
  is_offledger: boolean;
  notes: string | null;
  order: number;
}

export interface MonthlyBudget {
  id: string;
  category_id: string;
  /** Format: "YYYY-MM" e.g. "2026-04" */
  month: string;
  budget_amount: number;
  spent_amount: number;
  notes: string | null;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category_id: string | null;
  /** Format: "YYYY-MM" e.g. "2026-04" */
  month: string;
  notes: string | null;
  created_at: string;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  notes: string | null;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      category_groups: {
        Row: CategoryGroup;
        Insert: Omit<CategoryGroup, "order"> & { order?: number };
        Update: Partial<CategoryGroup>;
      };
      budget_categories: {
        Row: BudgetCategory;
        Insert: Omit<BudgetCategory, "budget_amount" | "is_fixed" | "is_offledger" | "order"> & {
          budget_amount?: number;
          is_fixed?: boolean;
          is_offledger?: boolean;
          order?: number;
        };
        Update: Partial<BudgetCategory>;
      };
      monthly_budgets: {
        Row: MonthlyBudget;
        Insert: Omit<MonthlyBudget, "id" | "budget_amount" | "spent_amount"> & {
          id?: string;
          budget_amount?: number;
          spent_amount?: number;
        };
        Update: Partial<MonthlyBudget>;
      };
      transactions: {
        Row: Transaction;
        Insert: Omit<Transaction, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Transaction>;
      };
      accounts: {
        Row: Account;
        Insert: Omit<Account, "id" | "updated_at"> & { id?: string; updated_at?: string };
        Update: Partial<Omit<Account, "id">>;
      };
    };
  };
};
