import { getBudgetData } from "@/lib/queries";
import { getCurrentMonth, isValidMonth, formatMonthLabel } from "@/lib/month";
import BudgetTable from "@/components/budget/BudgetTable";
import EmptyState from "@/components/ui/EmptyState";

export const metadata = { title: "Budget — ToastyBudget" };

export default async function BudgetPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const rawMonth = (await searchParams).month;
  const month = isValidMonth(rawMonth ?? null) ? rawMonth! : getCurrentMonth();
  const groups = await getBudgetData(month);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Budget</h1>
        <p className="mt-1 text-sm text-gray-500">{formatMonthLabel(month)}</p>
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
