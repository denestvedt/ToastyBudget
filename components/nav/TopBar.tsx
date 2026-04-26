"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus } from "lucide-react";
import MonthSelector from "./MonthSelector";

interface Props {
  userName?: string;
}

export default function TopBar({ userName }: Props) {
  const [greeting, setGreeting] = useState("Good morning");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    setGreeting(
      hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
    );
    setDateStr(
      now
        .toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
        .toUpperCase()
    );
  }, []);

  const firstName = userName?.split(" ")[0];

  return (
    <header
      className="flex items-center justify-between shrink-0"
      style={{
        height: 68,
        padding: "0 28px",
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
      }}
    >
      {/* Left: brand (mobile) or greeting (desktop) */}
      <div>
        <span
          className="font-bold md:hidden"
          style={{ color: "var(--text)", fontSize: "1.692rem", letterSpacing: "-0.02em" }}
        >
          ToastyBudget
        </span>
        <div className="hidden md:block">
          {dateStr && <p className="eyebrow" style={{ marginBottom: 3 }}>{dateStr}</p>}
          <p
            className="font-bold leading-none"
            style={{ fontSize: "1.692rem", letterSpacing: "-0.02em", color: "var(--text)" }}
          >
            {greeting}
            {firstName ? `, ${firstName}` : ""}
          </p>
        </div>
      </div>

      {/* Right: Search · Month · Add */}
      <div className="flex items-center" style={{ gap: 10 }}>
        {/* Search pill */}
        <button
          type="button"
          className="hidden md:flex items-center transition-colors"
          style={{
            gap: 6,
            padding: "7px 12px",
            border: "1px solid var(--border)",
            borderRadius: 8,
            background: "var(--surface)",
            color: "var(--text-mute)",
            fontSize: "0.885rem",
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          <Search size={13} strokeWidth={1.75} />
          <span>Search</span>
          <kbd
            className="mono"
            style={{
              fontSize: "0.769rem",
              padding: "1px 5px",
              border: "1px solid var(--border)",
              borderRadius: 4,
              background: "var(--bg)",
            }}
          >
            ⌘K
          </kbd>
        </button>

        <Suspense>
          <MonthSelector />
        </Suspense>

        {/* Primary Add transaction button */}
        <Link
          href="/transactions?new=1"
          className="hidden md:inline-flex items-center transition-[filter] duration-150"
          style={{
            gap: 6,
            padding: "7px 14px",
            fontSize: "0.962rem",
            fontWeight: 600,
            background: "var(--accent)",
            color: "var(--bg)",
            borderRadius: 7,
          }}
        >
          <Plus size={13} strokeWidth={2} />
          Add transaction
        </Link>
      </div>
    </header>
  );
}

