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
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t bg-white pb-safe dark:bg-gray-950 md:hidden">
      {NAV_LINKS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={buildHref(href)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
              isActive
                ? "text-orange-600 dark:text-orange-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
