import { getAccounts } from "@/lib/queries";
import AccountsEditor from "@/components/accounts/AccountsEditor";
import type { Account } from "@/lib/types";

export const metadata = { title: "Accounts — ToastyBudget" };

export default async function AccountsPage() {
  let accounts: Account[] = [];
  let setupNeeded = false;

  try {
    accounts = await getAccounts();
  } catch {
    setupNeeded = true;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Accounts</h1>

      {setupNeeded ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20 max-w-xl">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
            Database setup required
          </p>
          <p className="mt-1 text-sm text-amber-700 dark:text-amber-500">
            Run migrations <code className="font-mono">002_accounts.sql</code> and{" "}
            <code className="font-mono">003_seed_defaults.sql</code> in your Supabase SQL
            editor to enable account tracking.
          </p>
        </div>
      ) : (
        <AccountsEditor accounts={accounts} />
      )}
    </div>
  );
}
