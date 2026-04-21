export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold">🍞 ToastyBudget</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Your CFO-style household budget tracker
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Dashboard · Budget · Transactions · Settings
        </p>
      </main>
    </div>
  );
}
