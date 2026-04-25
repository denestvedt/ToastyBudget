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
      <div className="mb-5">
        <h1
          className="font-bold"
          style={{ fontSize: "1.692rem", letterSpacing: "-0.02em", color: "var(--text)" }}
        >
          Accounts
        </h1>
        <p style={{ fontSize: "0.923rem", color: "var(--text-mute)", marginTop: 2 }}>
          Net worth · balances · tracking
        </p>
      </div>

      {setupNeeded ? (
        <div
          className="rounded-card p-4 max-w-xl"
          style={{
            border: "1px solid var(--warn)",
            background: "color-mix(in srgb, var(--warn) 8%, transparent)",
          }}
        >
          <p className="font-semibold" style={{ fontSize: "1rem", color: "var(--warn)" }}>
            Database setup required
          </p>
          <p className="mt-1" style={{ fontSize: "0.923rem", color: "var(--text-dim)" }}>
            Run migrations <code className="mono">002_accounts.sql</code> and{" "}
            <code className="mono">003_seed_defaults.sql</code> in your Supabase SQL editor.
          </p>
        </div>
      ) : (
        <AccountsEditor accounts={accounts} />
      )}
    </div>
  );
}
