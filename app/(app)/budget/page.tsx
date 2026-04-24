export const metadata = { title: "Budget — ToastyBudget" };

export default async function BudgetPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-bold">Budget</h1>
      <p className="mt-1 text-sm text-gray-500">{month ?? "Current month"}</p>
      <p className="mt-4 text-gray-400">Coming soon.</p>
    </div>
  );
}
