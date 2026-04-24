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
    <div className="flex items-center gap-1">
      <button
        onClick={() => navigate(-1)}
        aria-label="Previous month"
        className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="w-36 text-center text-sm font-medium">
        {formatMonthLabel(month)}
      </span>
      <button
        onClick={() => navigate(1)}
        aria-label="Next month"
        className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
