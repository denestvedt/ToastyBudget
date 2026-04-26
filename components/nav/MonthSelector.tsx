"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMonthParam, offsetMonth, formatMonthLabel } from "@/lib/month";

export default function MonthSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const month = getMonthParam(searchParams);

  function navigate(delta: -1 | 1) {
    const next = offsetMonth(month, delta);
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", next);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div
      className="flex items-center rounded-[7px] overflow-hidden"
      style={{ border: "1px solid var(--border)", background: "var(--bg)" }}
    >
      <button
        onClick={() => navigate(-1)}
        aria-label="Previous month"
        className="flex items-center justify-center transition-colors"
        style={{ padding: "5px 8px", color: "var(--text-dim)" }}
      >
        <ChevronLeft size={14} strokeWidth={1.75} />
      </button>
      <span
        className="mono text-center"
        style={{ fontSize: "0.923rem", fontWeight: 500, color: "var(--text)", minWidth: 120, padding: "0 4px" }}
      >
        {formatMonthLabel(month)}
      </span>
      <button
        onClick={() => navigate(1)}
        aria-label="Next month"
        className="flex items-center justify-center transition-colors"
        style={{ padding: "5px 8px", color: "var(--text-dim)" }}
      >
        <ChevronRight size={14} strokeWidth={1.75} />
      </button>
    </div>
  );
}
