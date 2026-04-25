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
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <h3 className="font-bold" style={{ fontSize: 13, color: "var(--text)" }}>
          Budget by Category
        </h3>
        <span className="eyebrow">
          {over > 0 ? `${over} over · ` : ""}
          {onTrack} on track
        </span>
      </div>

      {activeGroups.length === 0 ? (
        <p
          className="px-4 py-6 text-center"
          style={{ fontSize: 12, color: "var(--text-mute)" }}
        >
          No budget set up yet — add categories in Settings.
        </p>
      ) : (
        activeGroups.map((g, idx) => {
          const isOver = g.total_spent > g.total_budget;
          return (
            <div
              key={g.id}
              className="px-4 py-3 flex items-center gap-3"
              style={{
                borderBottom:
                  idx < activeGroups.length - 1
                    ? "1px solid var(--border)"
                    : "none",
              }}
            >
              {/* Icon tile */}
              <div
                className="flex items-center justify-center shrink-0 rounded-[6px] text-sm leading-none"
                style={{
                  width: 28,
                  height: 28,
                  background: isOver
                    ? "color-mix(in srgb, var(--bad) 15%, var(--surface))"
                    : "color-mix(in srgb, var(--accent) 12%, var(--surface))",
                }}
              >
                {g.icon ?? "📦"}
              </div>

              {/* Name + bar + amounts */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <span
                    className="font-semibold truncate"
                    style={{ fontSize: 12.5, color: "var(--text)" }}
                  >
                    {g.name}
                  </span>
                  <span
                    className="mono shrink-0 ml-2"
                    style={{
                      fontSize: 11.5,
                      color: isOver ? "var(--bad)" : "var(--text-dim)",
                    }}
                  >
                    <AmountDisplay amount={g.total_spent} />
                    <span style={{ color: "var(--text-mute)", fontWeight: 400 }}>
                      {" / "}
                      <AmountDisplay amount={g.total_budget} />
                    </span>
                  </span>
                </div>
                <ProgressBar value={g.total_spent} max={g.total_budget} height={4} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
