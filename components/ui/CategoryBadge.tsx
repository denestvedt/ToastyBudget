interface CategoryBadgeProps {
  name: string;
  className?: string;
}

export default function CategoryBadge({ name, className = "" }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 ${className}`}
    >
      {name}
    </span>
  );
}
