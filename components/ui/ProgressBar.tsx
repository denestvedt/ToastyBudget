interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export default function ProgressBar({ value, max, className = "" }: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const isOver = max > 0 && value > max;

  return (
    <div className={`h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}>
      <div
        className={`h-full rounded-full transition-all ${
          isOver ? "bg-red-500" : "bg-orange-500"
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
