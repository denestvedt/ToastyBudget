import { getSummary, getTransactions, getAccounts } from "@/lib/queries";
import { getCurrentMonth, isValidMonth } from "@/lib/month";
import SummaryCards from "@/components/dashboard/SummaryCards";
import BudgetCategoryCard from "@/components/dashboard/BudgetCategoryCard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";
import ThisWeekCard from "@/components/dashboard/ThisWeekCard";

export const metadata = { title: "Dashboard — ToastyBudget" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const rawMonth = (await searchParams).month;
  const month = isValidMonth(rawMonth ?? null) ? rawMonth! : getCurrentMonth();

  const [summary, transactions, accounts] = await Promise.all([
    getSummary(month),
    getTransactions(month),
    getAccounts(),
  ]);

  return (
    <div className="space-y-5">
      {/* Hero summary card */}
      <SummaryCards summary={summary} accounts={accounts} />

      {/* 2-column body */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">
        {/* Left: budget by category */}
        <BudgetCategoryCard groups={summary.groups} />

        {/* Right: this week + recent activity */}
        <div className="flex flex-col gap-5">
          <ThisWeekCard transactions={transactions} />
          <RecentActivityCard transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
