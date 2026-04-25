"use client";

import { useEffect, useState } from "react";

type TextSize = "compact" | "default" | "comfortable" | "large";

const TILES: { value: TextSize; label: string; sub: string }[] = [
  { value: "compact",     label: "Compact",     sub: "85%" },
  { value: "default",     label: "Default",     sub: "100%" },
  { value: "comfortable", label: "Comfortable", sub: "115%" },
  { value: "large",       label: "Large",       sub: "130%" },
];

function applyTextSize(size: TextSize) {
  if (size === "default") {
    document.documentElement.removeAttribute("data-text-size");
  } else {
    document.documentElement.setAttribute("data-text-size", size);
  }
}

export default function TextSizeToggle() {
  const [size, setSize] = useState<TextSize>("default");

  useEffect(() => {
    const stored = (localStorage.getItem("text-size") as TextSize | null) ?? "default";
    setSize(stored);
    applyTextSize(stored);
  }, []);

  function select(next: TextSize) {
    setSize(next);
    if (next === "default") {
      localStorage.removeItem("text-size");
    } else {
      localStorage.setItem("text-size", next);
    }
    applyTextSize(next);
  }

  return (
    <div className="flex rounded-card overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      {TILES.map(({ value, label, sub }) => {
        const active = size === value;
        return (
          <button
            key={value}
            onClick={() => select(value)}
            className="flex-1 py-2.5 px-1 text-center transition-colors"
            style={{
              background: active
                ? "color-mix(in srgb, var(--accent) 10%, var(--surface))"
                : "var(--surface)",
              border: "none",
              borderLeft: value !== "compact" ? "1px solid var(--border)" : "none",
              outline: active ? "2px solid var(--accent)" : "none",
              outlineOffset: -2,
              cursor: "pointer",
            }}
            aria-pressed={active}
          >
            <p className="font-semibold" style={{ fontSize: 12, color: active ? "var(--accent)" : "var(--text)" }}>
              {label}
            </p>
            <p className="mono" style={{ fontSize: 10, color: "var(--text-mute)", marginTop: 1 }}>{sub}</p>
          </button>
        );
      })}
    </div>
  );
}
