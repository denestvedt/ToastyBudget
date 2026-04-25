"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { NAV_LINKS } from "./NavLinks";
import { createClient } from "@/lib/supabase/client";
import { getMonthParam } from "@/lib/month";
import ToastMark from "@/components/ui/ToastMark";

interface Props {
  userEmail?: string;
  userName?: string;
  dailyPace?: number | null;
}

const paceFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function Sidebar({ userEmail, userName, dailyPace }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const month = getMonthParam(searchParams);

  function buildHref(href: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", month);
    return `${href}?${params.toString()}`;
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const displayName = userName || userEmail?.split("@")[0] || "User";
  const initials = userName
    ? userName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : userEmail
    ? userEmail[0].toUpperCase()
    : "?";

  return (
    <aside
      className="hidden md:flex flex-col transition-all duration-200"
      style={{
        width: collapsed ? 56 : 200,
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        padding: collapsed ? "20px 8px" : "20px 14px",
        flexShrink: 0,
      }}
    >
      {/* Logo row — gradient tile + ToastMark SVG */}
      <div className="flex items-center gap-2.5 mb-6">
        <div
          className="flex items-center justify-center shrink-0 rounded-lg"
          style={{
            width: 28,
            height: 28,
            background: "linear-gradient(135deg, var(--accent-2), var(--accent))",
          }}
        >
          <ToastMark size={18} color="#FFFCF5" glow="#C94F1A" />
        </div>
        {!collapsed && (
          <p
            className="font-bold leading-none truncate"
            style={{ fontSize: 14, letterSpacing: "-0.02em", color: "var(--text)" }}
          >
            ToastyBudget
          </p>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={buildHref(href)}
              className={`flex items-center rounded-[7px] transition-colors duration-150 ${
                collapsed ? "justify-center px-2 py-2" : "gap-2.5 px-3 py-2"
              } ${isActive ? "nav-active" : "nav-inactive"}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={15} strokeWidth={1.75} className="shrink-0" />
              {!collapsed && <span style={{ fontSize: 12.5 }}>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Daily Pace mini-card — uses cream bg (var(--bg)) so it pops off the surface sidebar */}
      {!collapsed && dailyPace != null && (
        <div
          className="rounded-card px-3 py-2.5 mb-3"
          style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
        >
          <p className="eyebrow mb-1">Daily Pace</p>
          <p
            className="mono font-bold leading-none"
            style={{
              fontSize: 18,
              color: dailyPace >= 0 ? "var(--good)" : "var(--bad)",
            }}
          >
            {paceFmt.format(Math.abs(dailyPace))}
            <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text-mute)" }}>
              /day
            </span>
          </p>
          <p style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 3 }}>
            {dailyPace >= 0 ? "remaining budget" : "over budget"}
          </p>
        </div>
      )}

      {/* User row + sign out + collapse */}
      <div
        className="flex flex-col gap-1 mt-4 pt-4"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 px-1 mb-1">
            <div
              className="flex items-center justify-center rounded-full shrink-0 font-semibold text-white"
              style={{
                width: 26,
                height: 26,
                background: "var(--accent-2)",
                fontSize: 10,
              }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p
                className="truncate font-semibold"
                style={{ fontSize: 11.5, color: "var(--text)", lineHeight: 1.2 }}
              >
                {displayName}
              </p>
              {userEmail && (
                <p
                  className="truncate"
                  style={{ fontSize: 10, color: "var(--text-mute)", lineHeight: 1.3 }}
                >
                  {userEmail}
                </p>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleSignOut}
          className={`flex items-center rounded-[7px] nav-inactive transition-colors ${
            collapsed ? "justify-center px-2 py-2" : "gap-2.5 px-3 py-2"
          }`}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut size={15} strokeWidth={1.75} className="shrink-0" />
          {!collapsed && <span style={{ fontSize: 12.5 }}>Sign Out</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center rounded-[7px] nav-inactive transition-colors ${
            collapsed ? "justify-center px-2 py-2" : "gap-2.5 px-3 py-2"
          }`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={15} strokeWidth={1.75} />
          ) : (
            <>
              <ChevronLeft size={15} strokeWidth={1.75} />
              <span style={{ fontSize: 12.5 }}>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
