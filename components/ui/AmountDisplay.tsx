interface AmountDisplayProps {
  amount: number;
  className?: string;
}

export default function AmountDisplay({ amount, className = "" }: AmountDisplayProps) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
  return <span className={className}>{formatted}</span>;
}
