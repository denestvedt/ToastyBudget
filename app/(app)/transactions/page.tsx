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

  const total = transactions.reduce((s, t) => s + Number(t.amount), 0);
  const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="eyebrow mb-0.5">{formatMonthLabel(month)}</p>
          <h1
            className="font-bold"
            style={{ fontSize: 22, letterSpacing: "-0.02em", color: "var(--text)" }}
          >
            Transactions
          </h1>
          {transactions.length > 0 && (
            <p style={{ fontSize: 12, color: "var(--text-mute)", marginTop: 2 }}>
              {transactions.length} this month · {fmt.format(total)} total
            </p>
          )}
        </div>
        <CsvImport />
      </div>

      <TransactionTable transactions={transactions} categories={categories} />
    </div>
  );
}
