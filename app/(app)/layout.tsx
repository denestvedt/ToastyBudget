import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getSummary } from "@/lib/queries";
import { getCurrentMonth } from "@/lib/month";
import Sidebar from "@/components/nav/Sidebar";
import BottomTabBar from "@/components/nav/BottomTabBar";
import TopBar from "@/components/nav/TopBar";

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

  const userName = user.user_metadata?.full_name as string | undefined;

  const summary = await getSummary(getCurrentMonth()).catch(() => null);
  let dailyPace: number | null = null;
  if (summary) {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysLeft = Math.max(daysInMonth - today.getDate() + 1, 1);
    dailyPace = (summary.total_budget - summary.total_spent) / daysLeft;
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      <Suspense>
        <Sidebar userEmail={user.email} userName={userName} dailyPace={dailyPace} />
      </Suspense>

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar userName={userName} />

        {/* Mobile = scroll. Desktop = fits viewport, individual cards manage their own overflow. */}
        <main
          className="flex-1 overflow-auto md:overflow-hidden p-4 pb-20"
          style={{ background: "var(--bg)", padding: undefined }}
        >
          <div className="md:h-full md:overflow-auto" style={{ padding: 0 }}>
            <div style={{ padding: 22 }}>{children}</div>
          </div>
        </main>
      </div>

      <Suspense>
        <BottomTabBar />
      </Suspense>
    </div>
  );
}
