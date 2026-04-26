import type { MonthlySummary, Account } from "@/lib/types";

interface Props {
  summary: MonthlySummary;
  accounts?: Account[];
}

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const fmtNoCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function SummaryCards({ summary, accounts = [] }: Props) {
  const remaining = summary.total_budget - summary.total_spent;
  const pct =
    summary.total_budget > 0
      ? Math.min((summary.total_spent / summary.total_budget) * 100, 100)
      : 0;

  const liabilityTypes = ["credit", "credit_card", "loan", "mortgage"];
  const netWorth = accounts.reduce((sum, a) => {
    const isLiability = liabilityTypes.some((t) => a.type.toLowerCase().includes(t));
    return sum + (isLiability ? -Number(a.balance) : Number(a.balance));
  }, 0);
  const hasAccounts = accounts.length > 0;

  // Days remaining helper for sub-text
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysLeft = Math.max(daysInMonth - today.getDate() + 1, 1);
  const perDay = remaining > 0 ? Math.round(remaining / daysLeft) : 0;

  // Split hero number into dollars + cents for visual hierarchy
  const heroDollars = fmtNoCents.format(remaining);
  const heroCents = `.${String(Math.abs(Math.round((remaining % 1) * 100))).padStart(2, "0")}`;

  return (
    <div
      className="rounded-hero relative overflow-hidden text-[#FFFCF5]"
      style={{
        background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
        padding: "20px 24px",
      }}
    >
      {/* Subtle radial highlight for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.08,
          background:
            "radial-gradient(circle at 90% 20%, white 0%, transparent 40%)",
        }}
      />

      <div
        className="relative grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_1fr]"
        style={{ gap: 24, alignItems: "center" }}
      >
        {/* Col 1: Left to spend */}
        <div>
          <p
            className="eyebrow"
            style={{
              color: "rgba(255,252,245,0.85)",
              letterSpacing: "0.12em",
            }}
          >
            Left to Spend in {today.toLocaleString("en-US", { month: "long" })}
          </p>
          <p
            className="mono font-bold"
            style={{
              fontSize: "3.385rem",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginTop: 6,
            }}
          >
            {heroDollars}
            <span style={{ fontSize: "1.692rem", opacity: 0.7 }}>{heroCents}</span>
          </p>
          <p style={{ fontSize: "0.923rem", opacity: 0.9, marginTop: 6 }}>
            {daysLeft} days left
            {perDay > 0 ? ` · ~${fmtNoCents.format(perDay)}/day` : ""}
          </p>
        </div>

        {/* Col 2: Spent */}
        <div
          className="sm:border-l"
          style={{
            borderLeftColor: "rgba(255,252,245,0.2)",
            paddingLeft: 24,
          }}
        >
          <SpentCol spent={summary.total_spent} budget={summary.total_budget} pct={pct} />
        </div>

        {/* Col 3: Net worth */}
        <div
          className="sm:border-l"
          style={{
            borderLeftColor: "rgba(255,252,245,0.2)",
            paddingLeft: 24,
          }}
        >
          <NetWorthCol netWorth={netWorth} hasAccounts={hasAccounts} />
        </div>
      </div>
    </div>
  );
}

function SpentCol({ spent, budget, pct }: { spent: number; budget: number; pct: number }) {
  return (
    <>
      <p className="eyebrow" style={{ color: "rgba(255,252,245,0.75)" }}>
        Spent
      </p>
      <p
        className="mono font-bold leading-none"
        style={{ fontSize: "1.692rem", marginTop: 4 }}
      >
        {fmt.format(spent)}
      </p>
      <div
        className="rounded-full overflow-hidden"
        style={{
          height: 5,
          background: "rgba(255,252,245,0.2)",
          marginTop: 8,
        }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: "#FFFCF5",
            transition: "width 400ms cubic-bezier(0.2, 0.7, 0.3, 1)",
          }}
        />
      </div>
      <p style={{ fontSize: "0.808rem", opacity: 0.85, marginTop: 4 }}>
        {pct.toFixed(0)}% of {fmt.format(budget)} budget
      </p>
    </>
  );
}

function NetWorthCol({ netWorth, hasAccounts }: { netWorth: number; hasAccounts: boolean }) {
  return (
    <>
      <p className="eyebrow" style={{ color: "rgba(255,252,245,0.75)" }}>
        Net Worth
      </p>
      <p
        className="mono font-bold leading-none"
        style={{ fontSize: "1.692rem", marginTop: 4 }}
      >
        {hasAccounts ? fmt.format(netWorth) : "—"}
      </p>
      <p style={{ fontSize: "0.808rem", opacity: 0.85, marginTop: 6 }}>
        {hasAccounts ? "assets minus liabilities" : "add accounts to track"}
      </p>
    </>
  );
}
