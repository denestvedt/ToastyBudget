interface CategoryBadgeProps {
  name: string;
  className?: string;
}

export default function CategoryBadge({ name, className = "" }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2 py-0.5 text-xs font-medium ${className}`}
      style={{
        background: "color-mix(in srgb, var(--accent) 13%, transparent)",
        color: "var(--accent)",
      }}
    >
      {name}
    </span>
  );
}
