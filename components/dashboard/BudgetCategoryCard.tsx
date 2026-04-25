import Link from "next/link";
import { Wallet, Plus } from "lucide-react";
import type { GroupSummary } from "@/lib/types";
import ProgressBar from "@/components/ui/ProgressBar";
import AmountDisplay from "@/components/ui/AmountDisplay";

interface Props {
  groups: GroupSummary[];
}

export default function BudgetCategoryCard({ groups }: Props) {
  const activeGroups = groups.filter(
    (g) => g.total_budget > 0 || g.total_spent > 0
  );
  const onTrack = groups.filter(
    (g) => g.total_spent <= g.total_budget && g.total_budget > 0
  ).length;
  const over = groups.filter((g) => g.total_spent > g.total_budget).length;

  return (
    <div
      className="rounded-card overflow-hidden"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div
        className="flex items-center justify-between"
        style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <h3 className="font-bold" style={{ fontSize: "1.077rem", color: "var(--text)", letterSpacing: "-0.01em" }}>
            Budget by Category
          </h3>
          <p style={{ fontSize: "0.846rem", color: "var(--text-mute)", marginTop: 2 }}>
            {activeGroups.length === 0
              ? "Set up envelopes to track your spending"
              : `${over > 0 ? `${over} over · ` : ""}${onTrack} on track`}
          </p>
        </div>
        {activeGroups.length > 0 && (
          <Link
            href="/settings"
            className="transition-colors"
            style={{
              fontSize: "0.885rem",
              fontWeight: 600,
              color: "var(--text-dim)",
              padding: "5px 10px",
              border: "1px solid var(--border)",
              borderRadius: 7,
            }}
          >
            Manage
          </Link>
        )}
      </div>

      {activeGroups.length === 0 ? (
        <div
          className="flex flex-col items-center text-center"
          style={{ padding: "36px 24px", gap: 12 }}
        >
          <div
            className="flex items-center justify-center rounded-[8px]"
            style={{
              width: 44,
              height: 44,
              background: "color-mix(in srgb, var(--accent) 12%, var(--surface))",
              color: "var(--accent)",
            }}
          >
            <Wallet size={20} strokeWidth={1.75} />
          </div>
          <div>
            <p style={{ fontSize: "1.077rem", fontWeight: 700, color: "var(--text)" }}>
              No categories yet
            </p>
            <p style={{ fontSize: "0.923rem", color: "var(--text-dim)", marginTop: 4, maxWidth: 280 }}>
              Add a few category groups in Settings to start tracking how
              you&apos;re spending each month.
            </p>
          </div>
          <Link
            href="/settings"
            className="inline-flex items-center transition-[filter] duration-150"
            style={{
              gap: 6,
              padding: "8px 14px",
              fontSize: "0.962rem",
              fontWeight: 600,
              background: "var(--accent)",
              color: "var(--bg)",
              borderRadius: 7,
              marginTop: 4,
            }}
          >
            <Plus size={13} strokeWidth={2} />
            Add your first category
          </Link>
        </div>
      ) : (
        activeGroups.map((g, idx) => {
          const isOver = g.total_spent > g.total_budget;
          return (
            <div
              key={g.id}
              className="flex items-center"
              style={{
                gap: 12,
                padding: "10px 18px",
                borderBottom:
                  idx < activeGroups.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div
                className="flex items-center justify-center shrink-0 rounded-[7px] text-sm leading-none"
                style={{
                  width: 28,
                  height: 28,
                  background: isOver
                    ? "color-mix(in srgb, var(--bad) 15%, var(--surface))"
                    : "color-mix(in srgb, var(--accent) 13%, var(--surface))",
                  color: isOver ? "var(--bad)" : "var(--accent)",
                }}
              >
                {g.icon ?? "📦"}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between" style={{ marginBottom: 5 }}>
                  <span
                    className="font-semibold truncate"
                    style={{ fontSize: "0.962rem", color: "var(--text)" }}
                  >
                    {g.name}
                  </span>
                  <span
                    className="mono shrink-0"
                    style={{
                      fontSize: "0.885rem",
                      color: isOver ? "var(--bad)" : "var(--text)",
                      fontWeight: 600,
                      marginLeft: 8,
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
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
