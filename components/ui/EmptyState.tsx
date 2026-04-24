import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="flex items-center justify-center rounded-[14px] mb-4 text-3xl"
        style={{
          width: 56,
          height: 56,
          background: "color-mix(in srgb, var(--accent) 12%, transparent)",
        }}
      >
        🍞
      </div>
      <p
        className="font-semibold"
        style={{ fontSize: 14, color: "var(--text)" }}
      >
        {title}
      </p>
      {description && (
        <p
          className="mt-1 max-w-xs"
          style={{ fontSize: 12, color: "var(--text-mute)" }}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
