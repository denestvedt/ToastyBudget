"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { GroupWithCategories } from "@/lib/types";
import { updateMonthlyBudget } from "@/lib/actions";
import AmountDisplay from "@/components/ui/AmountDisplay";

interface Props {
  groups: GroupWithCategories[];
}

export default function BudgetTable({ groups }: Props) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const totalBudget = groups.reduce(
    (s, g) => s + g.categories.reduce((cs, c) => cs + Number(c.monthly.budget_amount), 0),
    0
  );
  const totalSpent = groups.reduce(
    (s, g) => s + g.categories.reduce((cs, c) => cs + Number(c.monthly.spent_amount), 0),
    0
  );

  function startEdit(monthlyId: string, currentAmount: number) {
    setEditingId(monthlyId);
    setEditValue(String(currentAmount));
  }

  function saveEdit(monthlyId: string) {
    const newAmount = parseFloat(editValue);
    setEditingId(null);
    if (isNaN(newAmount)) return;
    startTransition(async () => {
      try {
        await updateMonthlyBudget(monthlyId, newAmount);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to update budget");
      }
    });
  }

  const colClass = "py-2 text-right tabular-nums";

  return (
    <div className="space-y-2">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30">
          {error}
        </p>
      )}

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b text-xs text-gray-400">
            <th className="text-left py-2 font-normal">Category</th>
            <th className="text-right py-2 font-normal pr-2">Budgeted</th>
            <th className="text-right py-2 font-normal pr-2">Spent</th>
            <th className="text-right py-2 font-normal">Remaining</th>
          </tr>
        </thead>

        <tbody>
          {groups.map((group) => {
            const groupBudget = group.categories.reduce(
              (s, c) => s + Number(c.monthly.budget_amount),
              0
            );
            const groupSpent = group.categories.reduce(
              (s, c) => s + Number(c.monthly.spent_amount),
              0
            );
            const groupRemaining = groupBudget - groupSpent;

            return (
              <>
                {/* Group header */}
                <tr key={`gh-${group.id}`} className="bg-gray-50 dark:bg-gray-900/50">
                  <td
                    colSpan={4}
                    className="py-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {group.icon && <span className="mr-1">{group.icon}</span>}
                    {group.name}
                  </td>
                </tr>

                {/* Category rows */}
                {group.categories.map((cat) => {
                  const { monthly } = cat;
                  const budget = Number(monthly.budget_amount);
                  const spent = Number(monthly.spent_amount);
                  const remaining = budget - spent;
                  const isOver = remaining < 0;
                  const isWarning =
                    !isOver && budget > 0 && remaining / budget < 0.1;

                  return (
                    <tr
                      key={cat.id}
                      className={`border-b last:border-0 transition-colors ${
                        isOver
                          ? "bg-red-50/50 dark:bg-red-950/20"
                          : "hover:bg-gray-50/50 dark:hover:bg-gray-900/30"
                      }`}
                    >
                      <td className="py-2 pl-4 pr-2">
                        {cat.name}
                        {cat.is_fixed && (
                          <span className="ml-1.5 text-xs text-gray-400">fixed</span>
                        )}
                        {cat.is_offledger && (
                          <span className="ml-1.5 text-xs text-gray-400">off-ledger</span>
                        )}
                      </td>

                      {/* Editable budget cell */}
                      <td className="py-2 pr-2 text-right">
                        {editingId === monthly.id ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => saveEdit(monthly.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(monthly.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            className="w-28 rounded border border-orange-400 px-1.5 py-0.5 text-right text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 dark:bg-gray-800"
                            autoFocus
                          />
                        ) : (
                          <button
                            onClick={() => startEdit(monthly.id, budget)}
                            title="Click to edit"
                            className="tabular-nums hover:underline decoration-dashed"
                          >
                            <AmountDisplay amount={budget} />
                          </button>
                        )}
                      </td>

                      <td className={colClass + " pr-2"}>
                        <AmountDisplay amount={spent} />
                      </td>

                      <td
                        className={`${colClass} font-medium ${
                          isOver
                            ? "text-red-600"
                            : isWarning
                            ? "text-orange-500"
                            : "text-green-600 dark:text-green-400"
                        }`}
                      >
                        <AmountDisplay amount={remaining} />
                      </td>
                    </tr>
                  );
                })}

                {/* Group subtotal */}
                <tr
                  key={`st-${group.id}`}
                  className="border-b-2 bg-gray-100/60 dark:bg-gray-800/40 text-xs text-gray-500"
                >
                  <td className="py-1.5 pl-4 italic">Subtotal</td>
                  <td className="py-1.5 pr-2 text-right tabular-nums">
                    <AmountDisplay amount={groupBudget} />
                  </td>
                  <td className="py-1.5 pr-2 text-right tabular-nums">
                    <AmountDisplay amount={groupSpent} />
                  </td>
                  <td
                    className={`py-1.5 text-right tabular-nums font-semibold ${
                      groupRemaining < 0 ? "text-red-600" : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    <AmountDisplay amount={groupRemaining} />
                  </td>
                </tr>
              </>
            );
          })}

          {/* Grand total */}
          <tr className="border-t-2 font-bold text-sm">
            <td className="py-3">Total</td>
            <td className="py-3 pr-2 text-right tabular-nums">
              <AmountDisplay amount={totalBudget} />
            </td>
            <td className="py-3 pr-2 text-right tabular-nums">
              <AmountDisplay amount={totalSpent} />
            </td>
            <td
              className={`py-3 text-right tabular-nums ${
                totalBudget - totalSpent < 0
                  ? "text-red-600"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              <AmountDisplay amount={totalBudget - totalSpent} />
            </td>
          </tr>
        </tbody>
      </table>

      <p className="text-xs text-gray-400 mt-2">
        Click a budgeted amount to edit it for this month.
      </p>
    </div>
  );
}
