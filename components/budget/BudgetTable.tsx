"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { GroupWithCategories } from "@/lib/types";
import { updateMonthlyBudget, updateMonthlySpent } from "@/lib/actions";
import AmountDisplay from "@/components/ui/AmountDisplay";

interface Props {
  groups: GroupWithCategories[];
}

type EditTarget = { id: string; field: "budget" | "spent" };

export default function BudgetTable({ groups }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<EditTarget | null>(null);
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

  function startEdit(id: string, field: "budget" | "spent", current: number) {
    setEditing({ id, field });
    setEditValue(String(current));
  }

  function saveEdit(monthlyId: string, field: "budget" | "spent") {
    const newAmount = parseFloat(editValue);
    setEditing(null);
    if (isNaN(newAmount)) return;
    startTransition(async () => {
      try {
        if (field === "budget") {
          await updateMonthlyBudget(monthlyId, newAmount);
        } else {
          await updateMonthlySpent(monthlyId, newAmount);
        }
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to update");
      }
    });
  }

  function EditableCell({
    monthlyId,
    field,
    value,
    className,
  }: {
    monthlyId: string;
    field: "budget" | "spent";
    value: number;
    className?: string;
  }) {
    const isEditing = editing?.id === monthlyId && editing?.field === field;
    if (isEditing) {
      return (
        <input
          type="number"
          step="0.01"
          min="0"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => saveEdit(monthlyId, field)}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit(monthlyId, field);
            if (e.key === "Escape") setEditing(null);
          }}
          className="w-28 rounded border border-orange-400 px-1.5 py-0.5 text-right text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 dark:bg-gray-800"
          autoFocus
        />
      );
    }
    return (
      <button
        onClick={() => startEdit(monthlyId, field, value)}
        title="Click to edit"
        className={`tabular-nums hover:underline decoration-dashed ${className ?? ""}`}
      >
        <AmountDisplay amount={value} />
      </button>
    );
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
            <th className="text-right py-2 font-normal pr-2">
              Spent
              <span className="ml-1 text-gray-300 font-normal">/ Actual</span>
            </th>
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
                        <span>{cat.name}</span>
                        {cat.is_fixed && (
                          <span className="ml-1.5 text-xs text-gray-400">fixed</span>
                        )}
                        {cat.is_offledger && (
                          <span
                            className="ml-1.5 text-xs text-blue-500 font-medium"
                            title="Off-ledger: enter actual amount manually, not tracked via CSV"
                          >
                            off-ledger
                          </span>
                        )}
                      </td>

                      {/* Budgeted — always editable */}
                      <td className="py-2 pr-2 text-right">
                        <EditableCell
                          monthlyId={monthly.id}
                          field="budget"
                          value={budget}
                        />
                      </td>

                      {/* Spent / Actual — editable only for off-ledger categories */}
                      <td className="py-2 pr-2 text-right">
                        {cat.is_offledger ? (
                          <EditableCell
                            monthlyId={monthly.id}
                            field="spent"
                            value={spent}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        ) : (
                          <span className="tabular-nums text-gray-700 dark:text-gray-300">
                            <AmountDisplay amount={spent} />
                          </span>
                        )}
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
        Click any budgeted amount to edit it.{" "}
        <span className="text-blue-400">Off-ledger</span> categories also let you edit the
        actual amount — useful for 401k contributions and other investments not tracked by CSV.
      </p>
    </div>
  );
}
