export const metadata = { title: "Settings — ToastyBudget" };

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-4 text-gray-400">Coming soon.</p>
    </div>
  );
}
