"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { TransactionWithCategory, BudgetCategory } from "@/lib/types";
import { updateTransactionCategory, deleteTransaction } from "@/lib/actions";
import AmountDisplay from "@/components/ui/AmountDisplay";
import CategoryBadge from "@/components/ui/CategoryBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";

type SortKey = "date" | "description" | "amount" | "category";
type SortDir = "asc" | "desc";

interface Props {
  transactions: TransactionWithCategory[];
  categories: BudgetCategory[];
}

export default function TransactionTable({ transactions, categories }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = [...transactions].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "date") cmp = a.date.localeCompare(b.date);
    else if (sortKey === "description")
      cmp = a.description.localeCompare(b.description);
    else if (sortKey === "amount") cmp = Number(a.amount) - Number(b.amount);
    else if (sortKey === "category")
      cmp = (a.category?.name ?? "").localeCompare(b.category?.name ?? "");
    return sortDir === "asc" ? cmp : -cmp;
  });

  function handleCategoryChange(txId: string, value: string) {
    const newCatId = value === "" ? null : value;
    startTransition(async () => {
      try {
        await updateTransactionCategory(txId, newCatId);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to update category");
      }
    });
  }

  async function handleDelete(txId: string) {
    setDeleteId(null);
    startTransition(async () => {
      try {
        await deleteTransaction(txId);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to delete transaction");
      }
    });
  }

  const uncategorized = transactions.filter((t) => !t.category_id).length;

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey !== col ? (
      <span className="ml-1 text-gray-300">↕</span>
    ) : sortDir === "asc" ? (
      <span className="ml-1">↑</span>
    ) : (
      <span className="ml-1">↓</span>
    );

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>{transactions.length} transactions</span>
        {uncategorized > 0 && (
          <span className="text-orange-500 font-medium">
            {uncategorized} uncategorized
          </span>
        )}
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions this month"
          description="Import a CSV file to get started."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr className="text-xs text-gray-500">
                <th
                  className="text-left py-2 px-3 font-medium cursor-pointer hover:text-gray-900 dark:hover:text-gray-100"
                  onClick={() => toggleSort("date")}
                >
                  Date <SortIcon col="date" />
                </th>
                <th
                  className="text-left py-2 px-3 font-medium cursor-pointer hover:text-gray-900 dark:hover:text-gray-100"
                  onClick={() => toggleSort("description")}
                >
                  Description <SortIcon col="description" />
                </th>
                <th
                  className="text-right py-2 px-3 font-medium cursor-pointer hover:text-gray-900 dark:hover:text-gray-100"
                  onClick={() => toggleSort("amount")}
                >
                  Amount <SortIcon col="amount" />
                </th>
                <th
                  className="text-left py-2 px-3 font-medium cursor-pointer hover:text-gray-900 dark:hover:text-gray-100"
                  onClick={() => toggleSort("category")}
                >
                  Category <SortIcon col="category" />
                </th>
                <th className="py-2 px-3" />
              </tr>
            </thead>

            <tbody>
              {sorted.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-t dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-900/30"
                >
                  <td className="py-2 px-3 text-gray-500 whitespace-nowrap">{tx.date}</td>
                  <td className="py-2 px-3 max-w-xs truncate">{tx.description}</td>
                  <td className="py-2 px-3 text-right tabular-nums font-medium">
                    <AmountDisplay
                      amount={Number(tx.amount)}
                      className={Number(tx.amount) < 0 ? "text-red-500" : ""}
                    />
                  </td>
                  <td className="py-2 px-3">
                    {tx.category ? (
                      <CategoryBadge name={tx.category.name} />
                    ) : null}
                    <select
                      value={tx.category_id ?? ""}
                      onChange={(e) => handleCategoryChange(tx.id, e.target.value)}
                      className={`mt-0.5 block w-full rounded border px-1.5 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800 ${
                        tx.category ? "hidden" : ""
                      }`}
                      aria-label="Assign category"
                    >
                      <option value="">— Assign category —</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {tx.category && (
                      <select
                        value={tx.category_id ?? ""}
                        onChange={(e) => handleCategoryChange(tx.id, e.target.value)}
                        className="mt-0.5 block w-full rounded border px-1.5 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800"
                        aria-label="Change category"
                      >
                        <option value="">— Remove category —</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => setDeleteId(tx.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      aria-label="Delete transaction"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete transaction?"
        description="This action cannot be undone. Spent amounts will be recalculated."
        confirmLabel="Delete"
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
