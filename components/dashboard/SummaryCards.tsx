import type { MonthlySummary } from "@/lib/types";
import AmountDisplay from "@/components/ui/AmountDisplay";

interface Props {
  summary: MonthlySummary;
}

export default function SummaryCards({ summary }: Props) {
  const remaining = summary.total_budget - summary.total_spent;
  const pct =
    summary.total_budget > 0
      ? Math.min((summary.total_spent / summary.total_budget) * 100, 100)
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card
        label="Total Budgeted"
        value={<AmountDisplay amount={summary.total_budget} />}
        color="text-gray-900 dark:text-gray-100"
      />
      <Card
        label="Total Spent"
        value={<AmountDisplay amount={summary.total_spent} />}
        color={pct >= 100 ? "text-red-600" : pct >= 90 ? "text-orange-500" : "text-gray-900 dark:text-gray-100"}
        sub={`${pct.toFixed(0)}% of budget`}
      />
      <Card
        label="Remaining"
        value={<AmountDisplay amount={remaining} />}
        color={remaining < 0 ? "text-red-600" : "text-green-600 dark:text-green-400"}
      />
    </div>
  );
}

function Card({
  label,
  value,
  color,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  color: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border p-4 dark:border-gray-700">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${color}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}
