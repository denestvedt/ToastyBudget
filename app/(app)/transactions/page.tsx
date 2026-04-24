import { getTransactions, getCategories } from "@/lib/queries";
import { getCurrentMonth, isValidMonth, formatMonthLabel } from "@/lib/month";
import TransactionTable from "@/components/transactions/TransactionTable";
import CsvImport from "@/components/transactions/CsvImport";

export const metadata = { title: "Transactions — ToastyBudget" };

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const rawMonth = (await searchParams).month;
  const month = isValidMonth(rawMonth ?? null) ? rawMonth! : getCurrentMonth();

  const [transactions, categories] = await Promise.all([
    getTransactions(month),
    getCategories(),
  ]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="mt-1 text-sm text-gray-500">{formatMonthLabel(month)}</p>
        </div>
        <CsvImport />
      </div>

      <TransactionTable transactions={transactions} categories={categories} />
    </div>
  );
}
