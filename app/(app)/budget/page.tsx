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

  const totalCategories = groups.reduce((s, g) => s + g.categories.length, 0);

  return (
    <div>
      <div className="flex items-start justify-between mb-5 gap-4">
        <div>
          <p className="eyebrow mb-0.5">{formatMonthLabel(month)}</p>
          <h1
            className="font-bold"
            style={{ fontSize: "1.692rem", letterSpacing: "-0.02em", color: "var(--text)" }}
          >
            Budget
          </h1>
          {totalCategories > 0 && (
            <p style={{ fontSize: "0.923rem", color: "var(--text-mute)", marginTop: 2 }}>
              {groups.length} group{groups.length !== 1 ? "s" : ""} · {totalCategories} categories
            </p>
          )}
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
