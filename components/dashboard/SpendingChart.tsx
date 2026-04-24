"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
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
    <div className="space-y-6">
      {/* Bar chart */}
      {chartData.length > 0 && (
        <div className="rounded-lg border p-4 dark:border-gray-700">
          <h3 className="text-sm font-semibold mb-4">Budget vs. Spent by Group</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => USD.format(v)} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value) => (typeof value === "number" ? USD.format(value) : value)}
                contentStyle={{ fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Budget" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Spent" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.isOver ? "#ef4444" : "#f97316"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Group progress list */}
      <div className="rounded-lg border dark:border-gray-700 divide-y dark:divide-gray-700">
        {groups.map((g) => {
          const remaining = g.total_budget - g.total_spent;
          const isOver = remaining < 0;
          return (
            <div key={g.id} className="px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  {g.icon && <span className="mr-1">{g.icon}</span>}
                  {g.name}
                </span>
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    isOver ? "text-red-600" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <AmountDisplay amount={g.total_spent} />
                  <span className="text-gray-400 font-normal">
                    {" / "}
                    <AmountDisplay amount={g.total_budget} />
                  </span>
                </span>
              </div>
              <ProgressBar value={g.total_spent} max={g.total_budget} />
              {isOver && (
                <p className="mt-0.5 text-xs text-red-500">
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
