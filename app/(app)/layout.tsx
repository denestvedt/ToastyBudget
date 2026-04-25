import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
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

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      <Suspense>
        <Sidebar userEmail={user.email} userName={userName} />
      </Suspense>

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar userName={userName} />

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
