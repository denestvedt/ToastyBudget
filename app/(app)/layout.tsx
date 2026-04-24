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
    <div className="flex h-screen overflow-hidden">
      <Suspense>
        <Sidebar />
      </Suspense>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b px-4 md:px-6">
          <span className="font-bold md:hidden">🍞 ToastyBudget</span>
          <div className="ml-auto">
            <Suspense>
              <MonthSelector />
            </Suspense>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 pb-20 md:p-6 md:pb-6">
          {children}
        </main>
      </div>

      <Suspense>
        <BottomTabBar />
      </Suspense>
    </div>
  );
}
