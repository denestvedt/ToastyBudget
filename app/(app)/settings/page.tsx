import { getCategoryGroups, getCategories } from "@/lib/queries";
import SettingsEditor from "@/components/settings/SettingsEditor";
import ThemeToggle from "@/components/ui/ThemeToggle";

export const metadata = { title: "Settings — ToastyBudget" };

export default async function SettingsPage() {
  const [groups, categories] = await Promise.all([
    getCategoryGroups(),
    getCategories(),
  ]);

  return (
    <div>
      <div className="mb-5">
        <h1
          className="font-bold"
          style={{ fontSize: 22, letterSpacing: "-0.02em", color: "var(--text)" }}
        >
          Settings
        </h1>
        <p style={{ fontSize: 12, color: "var(--text-mute)", marginTop: 2 }}>
          Category groups, budget defaults, and more
        </p>
      </div>

      {/* Appearance */}
      <div className="mb-8 max-w-sm">
        <p className="eyebrow mb-2">Appearance</p>
        <div
          className="rounded-card p-4"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold" style={{ fontSize: 13, color: "var(--text)" }}>
              Theme
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <SettingsEditor groups={groups} categories={categories} />
    </div>
  );
}
