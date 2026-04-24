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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">{formatMonthLabel(month)}</p>
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
