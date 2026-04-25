import type { TransactionWithCategory } from "@/lib/types";

interface Props {
  transactions: TransactionWithCategory[];
}

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function RecentActivityCard({ transactions }: Props) {
  const recent = transactions.slice(0, 4);

  return (
    <div
      className="rounded-card overflow-hidden"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div
        className="px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <h3 className="font-bold" style={{ fontSize: 13, color: "var(--text)" }}>
          Recent Activity
        </h3>
      </div>

      {recent.length === 0 ? (
        <p
          className="px-4 py-6 text-center"
          style={{ fontSize: 12, color: "var(--text-mute)" }}
        >
          No transactions this month
        </p>
      ) : (
        recent.map((tx, idx) => {
          const tileChar =
            tx.category?.name?.[0]?.toUpperCase() ??
            tx.description[0]?.toUpperCase() ??
            "?";
          const dateLabel = new Date(tx.date + "T12:00:00").toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric" }
          );
          const isIncome = tx.amount < 0;
          return (
            <div
              key={tx.id}
              className="px-4 py-2.5 flex items-center gap-3"
              style={{
                borderBottom:
                  idx < recent.length - 1
                    ? "1px solid var(--border)"
                    : "none",
              }}
            >
              {/* Icon tile */}
              <div
                className="flex items-center justify-center shrink-0 rounded-[6px] font-semibold"
                style={{
                  width: 28,
                  height: 28,
                  background: "color-mix(in srgb, var(--accent) 10%, var(--surface))",
                  fontSize: 11,
                  color: "var(--accent)",
                }}
              >
                {tileChar}
              </div>

              {/* Description + category */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold truncate"
                  style={{ fontSize: 12.5, color: "var(--text)" }}
                >
                  {tx.description}
                </p>
                {tx.category && (
                  <p className="eyebrow" style={{ marginTop: 1 }}>
                    {tx.category.name}
                  </p>
                )}
              </div>

              {/* Amount + date */}
              <div className="text-right shrink-0">
                <p
                  className="mono font-semibold"
                  style={{
                    fontSize: 12.5,
                    color: isIncome ? "var(--good)" : "var(--text)",
                  }}
                >
                  {isIncome ? "+" : ""}
                  {fmt.format(Math.abs(tx.amount))}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--text-mute)",
                    marginTop: 1,
                  }}
                >
                  {dateLabel}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
