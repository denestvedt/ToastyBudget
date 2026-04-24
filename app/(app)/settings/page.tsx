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
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <SettingsEditor groups={groups} categories={categories} />
    </div>
  );
}
