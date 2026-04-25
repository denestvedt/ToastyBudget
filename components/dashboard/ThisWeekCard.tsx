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
  const isEmpty = weekTotal === 0;

  return (
    <div
      className="rounded-card"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        padding: 20,
      }}
    >
      <div className="flex items-baseline justify-between" style={{ marginBottom: 14 }}>
        <h3 className="font-bold" style={{ fontSize: 13, color: "var(--text)" }}>
          This Week
        </h3>
        {!isEmpty && (
          <span className="mono" style={{ fontSize: 13, color: "var(--text-dim)" }}>
            {fmt.format(weekTotal)}
          </span>
        )}
      </div>

      {isEmpty ? (
        // Real empty state — dashed baseline + caption
        <div style={{ paddingTop: 14, paddingBottom: 6 }}>
          <div
            style={{
              borderTop: "1px dashed var(--border)",
              height: 0,
              marginBottom: 12,
            }}
          />
          <p
            className="text-center"
            style={{ fontSize: 12, color: "var(--text-mute)" }}
          >
            No spending this week yet.
          </p>
          <div className="flex" style={{ gap: 6, marginTop: 18 }}>
            {days.map(({ date, label, isToday }) => (
              <p
                key={date}
                className="flex-1 text-center font-medium"
                style={{
                  fontSize: 10,
                  color: isToday ? "var(--accent)" : "var(--text-mute)",
                }}
              >
                {label}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Bars */}
          <div className="flex items-end" style={{ gap: 5, height: 80 }}>
            {days.map(({ date, isToday, total }) => {
              const pct = total > 0 ? total / maxTotal : 0;
              const barH = total > 0 ? Math.max(Math.round(pct * 70), 6) : 4;
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
          <div className="flex" style={{ gap: 5, marginTop: 8 }}>
            {days.map(({ date, label, isToday }) => (
              <p
                key={date}
                className="flex-1 text-center font-medium"
                style={{
                  fontSize: 10,
                  color: isToday ? "var(--accent)" : "var(--text-mute)",
                }}
              >
                {label}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
