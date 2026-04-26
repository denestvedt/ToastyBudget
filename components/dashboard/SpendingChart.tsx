"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { GroupSummary } from "@/lib/types";
import AmountDisplay from "@/components/ui/AmountDisplay";
import ProgressBar from "@/components/ui/ProgressBar";

interface Props {
  groups: GroupSummary[];
}

const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function SpendingChart({ groups }: Props) {
  const chartData = groups
    .filter((g) => g.total_budget > 0 || g.total_spent > 0)
    .map((g) => ({
      name: g.name,
      Budget: Number(g.total_budget.toFixed(2)),
      Spent: Number(g.total_spent.toFixed(2)),
      isOver: g.total_spent > g.total_budget,
    }));

  return (
    <div className="space-y-5">
      {/* Bar chart */}
      {chartData.length > 0 && (
        <div
          className="rounded-card p-4"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h3 className="font-bold mb-4" style={{ fontSize: "1.077rem", color: "var(--text)" }}>
            Budget vs. Spent by Group
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: "0.846rem", fill: "var(--text-mute)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => USD.format(v)}
                tick={{ fontSize: "0.846rem", fill: "var(--text-mute)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => (typeof value === "number" ? USD.format(value) : value)}
                contentStyle={{
                  fontSize: "0.923rem",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--text)",
                }}
              />
              <Bar dataKey="Budget" fill="var(--surface-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Spent" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.isOver ? "var(--bad)" : "var(--accent)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Group progress list */}
      <div
        className="rounded-card overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h3 className="font-bold" style={{ fontSize: "1.077rem", color: "var(--text)" }}>
            Budget by Category
          </h3>
          <span className="eyebrow">
            {groups.filter(g => g.total_spent > g.total_budget).length} over ·{" "}
            {groups.filter(g => g.total_spent <= g.total_budget && g.total_budget > 0).length} on track
          </span>
        </div>

        {groups.map((g, idx) => {
          const remaining = g.total_budget - g.total_spent;
          const isOver = remaining < 0;
          return (
            <div
              key={g.id}
              className="px-4 py-3"
              style={{
                borderBottom: idx < groups.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold" style={{ fontSize: "0.962rem", color: "var(--text)" }}>
                  {g.icon && <span className="mr-1">{g.icon}</span>}
                  {g.name}
                </span>
                <span
                  className="mono font-semibold"
                  style={{
                    fontSize: "0.962rem",
                    color: isOver ? "var(--bad)" : "var(--text)",
                  }}
                >
                  <AmountDisplay amount={g.total_spent} />
                  <span style={{ color: "var(--text-mute)", fontWeight: 400 }}>
                    {" / "}
                    <AmountDisplay amount={g.total_budget} />
                  </span>
                </span>
              </div>
              <ProgressBar value={g.total_spent} max={g.total_budget} height={5} />
              {isOver && (
                <p className="mt-1" style={{ fontSize: "0.846rem", color: "var(--bad)" }}>
                  Over by <AmountDisplay amount={-remaining} />
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
