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
    else if (sortKey === "description") cmp = a.description.localeCompare(b.description);
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
      <span className="ml-1" style={{ color: "var(--border)" }}>↕</span>
    ) : sortDir === "asc" ? (
      <span className="ml-1">↑</span>
    ) : (
      <span className="ml-1">↓</span>
    );

  const thStyle = {
    fontSize: 11,
    fontWeight: 600,
    color: "var(--text-mute)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    cursor: "pointer",
  };

  const selectStyle = {
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-input)",
    color: "var(--text)",
    fontSize: 11,
    padding: "2px 6px",
    outline: "none",
    width: "100%",
  };

  return (
    <div className="space-y-3">
      {error && (
        <p
          className="rounded-card px-3 py-2"
          style={{
            fontSize: 12,
            color: "var(--bad)",
            background: "color-mix(in srgb, var(--bad) 10%, transparent)",
          }}
        >
          {error}
        </p>
      )}

      <div className="flex items-center gap-4" style={{ fontSize: 12, color: "var(--text-dim)" }}>
        <span className="mono">{transactions.length} transactions</span>
        {uncategorized > 0 && (
          <span className="font-semibold" style={{ color: "var(--warn)" }}>
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
        <div
          className="overflow-x-auto rounded-card"
          style={{ border: "1px solid var(--border)" }}
        >
          <table className="w-full text-sm border-collapse">
            <thead style={{ background: "var(--surface-2)" }}>
              <tr>
                <th
                  className="text-left py-2 px-3"
                  style={thStyle}
                  onClick={() => toggleSort("date")}
                >
                  Date <SortIcon col="date" />
                </th>
                <th
                  className="text-left py-2 px-3"
                  style={thStyle}
                  onClick={() => toggleSort("description")}
                >
                  Merchant <SortIcon col="description" />
                </th>
                <th
                  className="text-right py-2 px-3"
                  style={thStyle}
                  onClick={() => toggleSort("amount")}
                >
                  Amount <SortIcon col="amount" />
                </th>
                <th
                  className="text-left py-2 px-3"
                  style={thStyle}
                  onClick={() => toggleSort("category")}
                >
                  Category <SortIcon col="category" />
                </th>
                <th className="py-2 px-3" />
              </tr>
            </thead>

            <tbody>
              {sorted.map((tx, idx) => (
                <tr
                  key={tx.id}
                  style={{
                    borderTop: "1px solid var(--border)",
                    background: "var(--surface)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--surface)";
                  }}
                >
                  <td
                    className="py-2 px-3 mono whitespace-nowrap"
                    style={{ fontSize: 11, color: "var(--text-mute)" }}
                  >
                    {tx.date}
                  </td>
                  <td
                    className="py-2 px-3 max-w-xs truncate"
                    style={{ fontSize: 12.5, color: "var(--text)" }}
                  >
                    {tx.description}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <AmountDisplay
                      amount={Number(tx.amount)}
                      className="font-semibold"
                      style={{
                        fontSize: 12.5,
                        color: Number(tx.amount) < 0 ? "var(--text)" : "var(--good)",
                      }}
                    />
                  </td>
                  <td className="py-2 px-3">
                    {tx.category && <CategoryBadge name={tx.category.name} />}
                    <select
                      value={tx.category_id ?? ""}
                      onChange={(e) => handleCategoryChange(tx.id, e.target.value)}
                      style={{ ...selectStyle, display: tx.category ? "none" : "block", marginTop: 2 }}
                      aria-label="Assign category"
                    >
                      <option value="">— Assign category —</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {tx.category && (
                      <select
                        value={tx.category_id ?? ""}
                        onChange={(e) => handleCategoryChange(tx.id, e.target.value)}
                        style={{ ...selectStyle, marginTop: 2 }}
                        aria-label="Change category"
                      >
                        <option value="">— Remove category —</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => setDeleteId(tx.id)}
                      className="transition-colors"
                      style={{ color: "var(--border)", fontSize: 14 }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--bad)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--border)"; }}
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
