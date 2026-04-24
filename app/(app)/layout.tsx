import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/nav/Sidebar";
import BottomTabBar from "@/components/nav/BottomTabBar";
import MonthSelector from "@/components/nav/MonthSelector";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      <Suspense>
        <Sidebar userEmail={user.email} />
      </Suspense>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header
          className="flex h-14 items-center justify-between px-4 md:px-6"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}
        >
          <span
            className="font-bold md:hidden"
            style={{ color: "var(--text)", fontSize: 14, letterSpacing: "-0.02em" }}
          >
            🍞 ToastyBudget
          </span>
          <div className="ml-auto">
            <Suspense>
              <MonthSelector />
            </Suspense>
          </div>
        </header>

        <main
          className="flex-1 overflow-auto p-4 pb-20 md:p-6 md:pb-6"
          style={{ background: "var(--bg)" }}
        >
          {children}
        </main>
      </div>

      <Suspense>
        <BottomTabBar />
      </Suspense>
    </div>
  );
}
