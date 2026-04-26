"use client";

import { useEffect, useState } from "react";

type Font = "toasty" | "system";

const TILES: { value: Font; label: string; sub: string }[] = [
  { value: "toasty", label: "Toasty Warm", sub: "Trebuchet / Inter" },
  { value: "system", label: "System",      sub: "OS default" },
];

function applyFont(font: Font) {
  if (font === "toasty") {
    document.documentElement.setAttribute("data-font", "toasty");
  } else {
    document.documentElement.removeAttribute("data-font");
  }
}

export default function FontToggle() {
  const [font, setFont] = useState<Font>("toasty");

  useEffect(() => {
    const stored = (localStorage.getItem("font") as Font | null) ?? "toasty";
    setFont(stored);
    applyFont(stored);
  }, []);

  function select(next: Font) {
    setFont(next);
    if (next === "system") {
      localStorage.removeItem("font");
    } else {
      localStorage.setItem("font", next);
    }
    applyFont(next);
  }

  return (
    <div className="flex rounded-card overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      {TILES.map(({ value, label, sub }) => {
        const active = font === value;
        return (
          <button
            key={value}
            onClick={() => select(value)}
            className="flex-1 py-2.5 px-3 text-center transition-colors"
            style={{
              background: active
                ? "color-mix(in srgb, var(--accent) 10%, var(--surface))"
                : "var(--surface)",
              border: "none",
              borderLeft: value !== "toasty" ? "1px solid var(--border)" : "none",
              outline: active ? "2px solid var(--accent)" : "none",
              outlineOffset: -2,
              cursor: "pointer",
            }}
            aria-pressed={active}
          >
            <p className="font-semibold" style={{ fontSize: "0.923rem", color: active ? "var(--accent)" : "var(--text)" }}>
              {label}
            </p>
            <p style={{ fontSize: "0.769rem", color: "var(--text-mute)", marginTop: 1 }}>{sub}</p>
          </button>
        );
      })}
    </div>
  );
}
