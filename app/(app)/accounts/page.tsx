import { getAccounts } from "@/lib/queries";
import AccountsEditor from "@/components/accounts/AccountsEditor";

export const metadata = { title: "Accounts — ToastyBudget" };

export default async function AccountsPage() {
  const accounts = await getAccounts();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Accounts</h1>
      <AccountsEditor accounts={accounts} />
    </div>
  );
}
