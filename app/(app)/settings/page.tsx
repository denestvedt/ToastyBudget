import { getCategoryGroups, getCategories } from "@/lib/queries";
import SettingsEditor from "@/components/settings/SettingsEditor";
import ThemeToggle from "@/components/ui/ThemeToggle";
import FontToggle from "@/components/ui/FontToggle";
import TextSizeToggle from "@/components/ui/TextSizeToggle";

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
      <div className="mb-8 max-w-md">
        <p className="eyebrow mb-2">Appearance</p>
        <div
          className="rounded-card divide-y"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* Theme */}
          <div className="p-4">
            <p className="font-semibold mb-2.5" style={{ fontSize: 13, color: "var(--text)" }}>
              Theme
            </p>
            <ThemeToggle />
          </div>

          {/* Font */}
          <div className="p-4" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="font-semibold mb-1" style={{ fontSize: 13, color: "var(--text)" }}>
              Font
            </p>
            <p className="mb-2.5" style={{ fontSize: 11, color: "var(--text-mute)" }}>
              Toasty Warm uses Inter — a clean, modern typeface designed for screens.
            </p>
            <FontToggle />
          </div>

          {/* Text size */}
          <div className="p-4" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="font-semibold mb-1" style={{ fontSize: 13, color: "var(--text)" }}>
              Text Size
            </p>
            <p className="mb-2.5" style={{ fontSize: 11, color: "var(--text-mute)" }}>
              Scales the entire interface. Default matches the Toasty Warm design spec.
            </p>
            <TextSizeToggle />
          </div>
        </div>
      </div>

      <SettingsEditor groups={groups} categories={categories} />
    </div>
  );
}
