export const metadata = { title: "Accounts — ToastyBudget" };

export default async function AccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-bold">Accounts</h1>
      <p className="mt-1 text-sm text-gray-500">{month ?? "Current month"}</p>
      <p className="mt-4 text-gray-400">Coming soon.</p>
    </div>
  );
}
