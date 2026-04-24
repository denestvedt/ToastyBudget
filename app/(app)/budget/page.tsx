import { getBudgetData } from "@/lib/queries";
import { getCurrentMonth, isValidMonth, formatMonthLabel, offsetMonth } from "@/lib/month";
import BudgetTable from "@/components/budget/BudgetTable";
import CopyMonthButton from "@/components/budget/CopyMonthButton";
import EmptyState from "@/components/ui/EmptyState";

export const metadata = { title: "Budget — ToastyBudget" };

export default async function BudgetPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const rawMonth = (await searchParams).month;
  const month = isValidMonth(rawMonth ?? null) ? rawMonth! : getCurrentMonth();
  const prevMonth = offsetMonth(month, -1);
  const groups = await getBudgetData(month);

  return (
    <div>
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Budget</h1>
          <p className="mt-1 text-sm text-gray-500">{formatMonthLabel(month)}</p>
        </div>
        <CopyMonthButton fromMonth={prevMonth} toMonth={month} />
      </div>

      {groups.length === 0 ? (
        <EmptyState
          title="No budget categories yet"
          description="Go to Settings to create category groups and categories."
        />
      ) : (
        <BudgetTable groups={groups} />
      )}
    </div>
  );
}
