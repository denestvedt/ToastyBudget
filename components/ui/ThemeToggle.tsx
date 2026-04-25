"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const TILES: { value: Theme; label: string }[] = [
  { value: "light",  label: "Light"  },
  { value: "dark",   label: "Dark"   },
  { value: "system", label: "System" },
];

function applyTheme(theme: Theme) {
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme | null) ?? "system";
    setTheme(stored);
    applyTheme(stored);
  }, []);

  // Re-apply when system preference changes while "system" is selected
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  function select(next: Theme) {
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  }

  return (
    <div className="flex rounded-card overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      {TILES.map(({ value, label }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            onClick={() => select(value)}
            className="flex-1 py-2 text-center font-semibold transition-colors"
            style={{
              fontSize: "0.923rem",
              background: active
                ? "color-mix(in srgb, var(--accent) 10%, var(--surface))"
                : "var(--surface)",
              color: active ? "var(--accent)" : "var(--text-dim)",
              border: "none",
              borderLeft: value !== "light" ? "1px solid var(--border)" : "none",
              outline: active ? "2px solid var(--accent)" : "none",
              outlineOffset: -2,
              cursor: "pointer",
            }}
            aria-pressed={active}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
