interface ProgressBarProps {
  value: number;
  max: number;
  height?: number;
  className?: string;
}

export default function ProgressBar({ value, max, height = 5, className = "" }: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const isOver = max > 0 && value > max;
  const isWarn = !isOver && max > 0 && (max - value) / max < 0.1;

  return (
    <div
      className={`w-full rounded-full overflow-hidden ${className}`}
      style={{ height, background: "var(--surface-2)" }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${pct}%`,
          background: isOver ? "var(--bad)" : isWarn ? "var(--warn)" : "var(--accent)",
          transition: "width 400ms cubic-bezier(0.2, 0.7, 0.3, 1)",
        }}
      />
    </div>
  );
}
