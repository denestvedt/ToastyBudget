"use client";

import { Suspense, useState, useEffect } from "react";
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
      className="flex h-14 items-center justify-between px-4 md:px-6 shrink-0"
      style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}
    >
      {/* Left: brand (mobile) or greeting (desktop) */}
      <div>
        <span
          className="font-bold md:hidden"
          style={{ color: "var(--text)", fontSize: 14, letterSpacing: "-0.02em" }}
        >
          🍞 ToastyBudget
        </span>
        <div className="hidden md:block">
          {dateStr && (
            <p className="eyebrow mb-0.5">{dateStr}</p>
          )}
          <p
            className="font-bold leading-none"
            style={{ fontSize: 15, letterSpacing: "-0.02em", color: "var(--text)" }}
          >
            {greeting}{firstName ? `, ${firstName}` : ""}
          </p>
        </div>
      </div>

      {/* Right: month selector */}
      <Suspense>
        <MonthSelector />
      </Suspense>
    </header>
  );
}
