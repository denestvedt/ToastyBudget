"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { copyBudgetToMonth } from "@/lib/actions";
import { formatMonthLabel } from "@/lib/month";

interface Props {
  fromMonth: string;
  toMonth: string;
}

export default function CopyMonthButton({ fromMonth, toMonth }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    setError(null);
    setCopied(false);
    startTransition(async () => {
      try {
        await copyBudgetToMonth(fromMonth, toMonth);
        setCopied(true);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to copy budget");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleCopy}
        className="rounded-button whitespace-nowrap transition-colors"
        style={{
          border: "1px solid var(--border)",
          background: "transparent",
          color: "var(--text)",
          fontSize: 12,
          fontWeight: 600,
          padding: "6px 14px",
          cursor: "pointer",
        }}
        title={`Copy budget amounts from ${formatMonthLabel(fromMonth)} into this month`}
      >
        Copy from {formatMonthLabel(fromMonth)}
      </button>
      {copied && (
        <p style={{ fontSize: 11, color: "var(--good)" }}>Budget amounts copied.</p>
      )}
      {error && <p style={{ fontSize: 11, color: "var(--bad)" }}>{error}</p>}
    </div>
  );
}
