"use client";

import { useMemo } from "react";
import type { TransactionWithCategory } from "@/lib/types";

interface Props {
  transactions: TransactionWithCategory[];
}

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function ThisWeekCard({ transactions }: Props) {
  const days = useMemo(() => {
    const result: { date: string; label: string; isToday: boolean; total: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      result.push({
        date: dateStr,
        label: d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1),
        isToday: i === 0,
        total: 0,
      });
    }

    transactions.forEach((tx) => {
      const day = result.find((d) => d.date === tx.date);
      if (day && tx.amount > 0) day.total += Number(tx.amount);
    });

    return result;
  }, [transactions]);

  const weekTotal = days.reduce((s, d) => s + d.total, 0);
  const maxTotal = Math.max(...days.map((d) => d.total), 1);

  return (
    <div
      className="rounded-card p-4"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-bold" style={{ fontSize: 13, color: "var(--text)" }}>
          This Week
        </h3>
        {weekTotal > 0 && (
          <span className="mono" style={{ fontSize: 12, color: "var(--text-dim)" }}>
            {fmt.format(weekTotal)}
          </span>
        )}
      </div>

      {/* Bars */}
      <div className="flex items-end gap-1.5" style={{ height: 52 }}>
        {days.map(({ date, isToday, total }) => {
          const pct = total > 0 ? total / maxTotal : 0;
          const barH = Math.max(Math.round(pct * 44), total > 0 ? 4 : 2);
          return (
            <div
              key={date}
              className="flex-1 rounded-sm"
              style={{
                height: barH,
                background: isToday
                  ? "var(--accent)"
                  : total > 0
                  ? "color-mix(in srgb, var(--accent) 40%, var(--surface-2))"
                  : "var(--surface-2)",
                alignSelf: "flex-end",
                transition: "height 300ms var(--ease-soft)",
              }}
            />
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex gap-1.5 mt-1.5">
        {days.map(({ date, label, isToday }) => (
          <p
            key={date}
            className="flex-1 text-center font-medium"
            style={{
              fontSize: 9,
              color: isToday ? "var(--accent)" : "var(--text-mute)",
            }}
          >
            {label}
          </p>
        ))}
      </div>
    </div>
  );
}
