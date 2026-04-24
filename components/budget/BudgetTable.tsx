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
    dimColor,
  }: {
    monthlyId: string;
    field: "budget" | "spent";
    value: number;
    dimColor?: boolean;
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
          className="mono w-28 rounded-input px-1.5 py-0.5 text-right"
          style={{
            border: "1px solid var(--accent)",
            background: "var(--bg)",
            color: "var(--text)",
            fontSize: 12.5,
            outline: "none",
          }}
          autoFocus
        />
      );
    }
    return (
      <button
        onClick={() => startEdit(monthlyId, field, value)}
        title="Click to edit"
        className="mono hover:underline decoration-dashed"
        style={{
          fontSize: 12.5,
          color: dimColor ? "var(--accent)" : "var(--text)",
        }}
      >
        <AmountDisplay amount={value} />
      </button>
    );
  }

  return (
    <div className="space-y-2">
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

      <div
        className="rounded-card overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th
                className="text-left py-2 px-4 font-normal eyebrow"
                style={{ paddingTop: 10, paddingBottom: 10 }}
              >
                Category
              </th>
              <th className="text-right py-2 px-3 font-normal eyebrow">Budgeted</th>
              <th className="text-right py-2 px-3 font-normal eyebrow">
                Spent
                <span className="ml-1 font-normal" style={{ opacity: 0.5 }}>/ Actual</span>
              </th>
              <th className="text-right py-2 px-4 font-normal eyebrow">Remaining</th>
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
                  <tr key={`gh-${group.id}`} style={{ background: "var(--surface-2)" }}>
                    <td
                      colSpan={4}
                      className="py-2 px-4 eyebrow"
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
                    const isWarning = !isOver && budget > 0 && remaining / budget < 0.1;

                    return (
                      <tr
                        key={cat.id}
                        style={{
                          borderBottom: "1px solid var(--border)",
                          background: isOver
                            ? "color-mix(in srgb, var(--bad) 5%, transparent)"
                            : "transparent",
                        }}
                      >
                        <td className="py-2 pl-6 pr-2" style={{ color: "var(--text)", fontSize: 12.5 }}>
                          {cat.name}
                          {cat.is_fixed && (
                            <span className="ml-1.5" style={{ fontSize: 10, color: "var(--text-mute)" }}>
                              fixed
                            </span>
                          )}
                          {cat.is_offledger && (
                            <span
                              className="ml-1.5 font-medium"
                              style={{ fontSize: 10, color: "var(--accent-2)" }}
                              title="Off-ledger: enter actual amount manually"
                            >
                              off-ledger
                            </span>
                          )}
                        </td>

                        <td className="py-2 pr-3 text-right">
                          <EditableCell monthlyId={monthly.id} field="budget" value={budget} />
                        </td>

                        <td className="py-2 pr-3 text-right">
                          {cat.is_offledger ? (
                            <EditableCell
                              monthlyId={monthly.id}
                              field="spent"
                              value={spent}
                              dimColor
                            />
                          ) : (
                            <span
                              className="mono"
                              style={{ fontSize: 12.5, color: "var(--text-dim)" }}
                            >
                              <AmountDisplay amount={spent} />
                            </span>
                          )}
                        </td>

                        <td className="py-2 pr-4 text-right">
                          <span
                            className="mono font-semibold"
                            style={{
                              fontSize: 12.5,
                              color: isOver
                                ? "var(--bad)"
                                : isWarning
                                ? "var(--warn)"
                                : "var(--good)",
                            }}
                          >
                            <AmountDisplay amount={remaining} />
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Group subtotal */}
                  <tr
                    key={`st-${group.id}`}
                    style={{
                      borderBottom: "2px solid var(--border)",
                      background: "var(--surface-2)",
                    }}
                  >
                    <td
                      className="py-1.5 pl-6 italic"
                      style={{ fontSize: 11, color: "var(--text-mute)" }}
                    >
                      Subtotal
                    </td>
                    <td className="py-1.5 pr-3 text-right mono" style={{ fontSize: 11, color: "var(--text-dim)" }}>
                      <AmountDisplay amount={groupBudget} />
                    </td>
                    <td className="py-1.5 pr-3 text-right mono" style={{ fontSize: 11, color: "var(--text-dim)" }}>
                      <AmountDisplay amount={groupSpent} />
                    </td>
                    <td
                      className="py-1.5 pr-4 text-right mono font-semibold"
                      style={{
                        fontSize: 11,
                        color: groupRemaining < 0 ? "var(--bad)" : "var(--good)",
                      }}
                    >
                      <AmountDisplay amount={groupRemaining} />
                    </td>
                  </tr>
                </>
              );
            })}

            {/* Grand total */}
            <tr style={{ borderTop: "2px solid var(--border)" }}>
              <td className="py-3 px-4 font-bold" style={{ fontSize: 13, color: "var(--text)" }}>
                Total
              </td>
              <td className="py-3 pr-3 text-right mono font-bold" style={{ fontSize: 13, color: "var(--text)" }}>
                <AmountDisplay amount={totalBudget} />
              </td>
              <td className="py-3 pr-3 text-right mono font-bold" style={{ fontSize: 13, color: "var(--text)" }}>
                <AmountDisplay amount={totalSpent} />
              </td>
              <td
                className="py-3 pr-4 text-right mono font-bold"
                style={{
                  fontSize: 13,
                  color: totalBudget - totalSpent < 0 ? "var(--bad)" : "var(--good)",
                }}
              >
                <AmountDisplay amount={totalBudget - totalSpent} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 11, color: "var(--text-mute)" }} className="mt-2">
        Click any budgeted amount to edit it.{" "}
        <span style={{ color: "var(--accent-2)" }}>Off-ledger</span> categories also let you edit
        the actual amount.
      </p>
    </div>
  );
}
