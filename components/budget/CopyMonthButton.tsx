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
        className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 whitespace-nowrap"
        title={`Copy budget amounts from ${formatMonthLabel(fromMonth)} into this month`}
      >
        Copy from {formatMonthLabel(fromMonth)}
      </button>
      {copied && (
        <p className="text-xs text-green-600 dark:text-green-400">Budget amounts copied.</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
