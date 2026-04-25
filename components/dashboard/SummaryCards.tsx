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

function formatHero(amount: number): { dollars: string; cents: string } {
  const abs = Math.abs(amount);
  const dollars = fmtNoCents.format(amount < 0 ? -abs : amount < 0 ? -abs : amount);
  const cents = String(Math.round((abs % 1) * 100)).padStart(2, "0");
  return { dollars, cents };
}

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

  const { dollars: heroDollars } = formatHero(remaining);

  return (
    <div
      className="rounded-hero p-5 text-[#FFFCF5]"
      style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3">
        {/* Col 1: Left to spend */}
        <div className="sm:pr-6">
          <p className="eyebrow" style={{ color: "rgba(255,252,245,0.75)" }}>
            Left to Spend
          </p>
          <p
            className="mono mt-1 font-bold leading-none"
            style={{ fontSize: 44, letterSpacing: "-0.02em" }}
          >
            {heroDollars}
          </p>
          <p className="mt-2" style={{ fontSize: 11, opacity: 0.7 }}>
            {summary.groups.length} category group{summary.groups.length !== 1 ? "s" : ""} · this month
          </p>
        </div>

        {/* Col 2: Spent */}
        <div className="mt-5 sm:mt-0">
          <div
            className="hidden sm:block h-full"
            style={{ borderLeft: "1px solid rgba(255,252,245,0.2)", paddingLeft: 24 }}
          >
            <SpentCol spent={summary.total_spent} budget={summary.total_budget} pct={pct} />
          </div>
          <div className="sm:hidden">
            <SpentCol spent={summary.total_spent} budget={summary.total_budget} pct={pct} />
          </div>
        </div>

        {/* Col 3: Net Worth (or Total Budget if no accounts) */}
        <div className="mt-5 sm:mt-0">
          <div
            className="hidden sm:block"
            style={{ borderLeft: "1px solid rgba(255,252,245,0.2)", paddingLeft: 24 }}
          >
            {hasAccounts ? (
              <NetWorthCol netWorth={netWorth} />
            ) : (
              <BudgetCol budget={summary.total_budget} />
            )}
          </div>
          <div className="sm:hidden">
            {hasAccounts ? (
              <NetWorthCol netWorth={netWorth} />
            ) : (
              <BudgetCol budget={summary.total_budget} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpentCol({ spent, budget, pct }: { spent: number; budget: number; pct: number }) {
  return (
    <>
      <p className="eyebrow" style={{ color: "rgba(255,252,245,0.75)" }}>Spent</p>
      <p className="mono mt-1 font-bold leading-none" style={{ fontSize: 22 }}>
        {fmt.format(spent)}
      </p>
      <div
        className="mt-2 rounded-full overflow-hidden"
        style={{ height: 5, background: "rgba(255,252,245,0.25)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: "rgba(255,252,245,0.75)",
            transition: "width 400ms cubic-bezier(0.2, 0.7, 0.3, 1)",
          }}
        />
      </div>
      <p className="mt-1" style={{ fontSize: 11, opacity: 0.7 }}>
        {pct.toFixed(0)}% of {fmt.format(budget)} budget
      </p>
    </>
  );
}

function BudgetCol({ budget }: { budget: number }) {
  return (
    <>
      <p className="eyebrow" style={{ color: "rgba(255,252,245,0.75)" }}>Total Budget</p>
      <p className="mono mt-1 font-bold leading-none" style={{ fontSize: 22 }}>
        {fmt.format(budget)}
      </p>
      <p className="mt-2" style={{ fontSize: 11, opacity: 0.7 }}>monthly envelope</p>
    </>
  );
}

function NetWorthCol({ netWorth }: { netWorth: number }) {
  return (
    <>
      <p className="eyebrow" style={{ color: "rgba(255,252,245,0.75)" }}>Net Worth</p>
      <p
        className="mono mt-1 font-bold leading-none"
        style={{ fontSize: 22 }}
      >
        {fmt.format(netWorth)}
      </p>
      <p className="mt-2" style={{ fontSize: 11, opacity: 0.7 }}>
        assets minus liabilities
      </p>
    </>
  );
}
