import type { CSSProperties } from "react";

interface AmountDisplayProps {
  amount: number;
  className?: string;
  style?: CSSProperties;
}

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function AmountDisplay({ amount, className = "", style }: AmountDisplayProps) {
  return (
    <span className={`mono ${className}`} style={style}>
      {fmt.format(amount)}
    </span>
  );
}
