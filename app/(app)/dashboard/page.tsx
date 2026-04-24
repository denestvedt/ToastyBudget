import { getSummary } from "@/lib/queries";
import { getCurrentMonth, isValidMonth, formatMonthLabel } from "@/lib/month";
import SummaryCards from "@/components/dashboard/SummaryCards";
import SpendingChart from "@/components/dashboard/SpendingChart";
import EmptyState from "@/components/ui/EmptyState";

export const metadata = { title: "Dashboard — ToastyBudget" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const rawMonth = (await searchParams).month;
  const month = isValidMonth(rawMonth ?? null) ? rawMonth! : getCurrentMonth();
  const summary = await getSummary(month);

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow mb-0.5">{formatMonthLabel(month)}</p>
        <h1
          className="font-bold"
          style={{ fontSize: 22, letterSpacing: "-0.02em", color: "var(--text)" }}
        >
          Dashboard
        </h1>
      </div>

      <SummaryCards summary={summary} />

      {summary.groups.length === 0 ? (
        <EmptyState
          title="No budget data yet"
          description="Set up categories in Settings and add transactions to see your spending breakdown."
        />
      ) : (
        <SpendingChart groups={summary.groups} />
      )}
    </div>
  );
}
