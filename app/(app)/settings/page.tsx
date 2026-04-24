import { getCategoryGroups, getCategories } from "@/lib/queries";
import SettingsEditor from "@/components/settings/SettingsEditor";

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
      <SettingsEditor groups={groups} categories={categories} />
    </div>
  );
}
