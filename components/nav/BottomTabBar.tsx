"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { NAV_LINKS } from "./NavLinks";
import { getMonthParam } from "@/lib/month";

export default function BottomTabBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const month = getMonthParam(searchParams);

  function buildHref(href: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", month);
    return `${href}?${params.toString()}`;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex pb-safe md:hidden"
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--surface)",
      }}
    >
      {NAV_LINKS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={buildHref(href)}
            className="flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors"
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: isActive ? "var(--accent)" : "var(--text-dim)",
            }}
          >
            <Icon size={18} strokeWidth={1.75} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
