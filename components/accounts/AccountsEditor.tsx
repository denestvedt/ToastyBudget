"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Account } from "@/lib/types";
import { createAccount, updateAccount, deleteAccount } from "@/lib/actions";
import AmountDisplay from "@/components/ui/AmountDisplay";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface Props {
  accounts: Account[];
}

// The 4 account groups shown on the page.
const ACCOUNT_GROUPS = [
  {
    label: "Banking",
    types: ["checking", "savings"],
    description: "Checking and savings accounts",
    defaultType: "checking",
  },
  {
    label: "Credit Cards",
    types: ["credit"],
    description: "Credit card balances",
    defaultType: "credit",
  },
  {
    label: "Investments",
    types: ["investment"],
    description: "401k, IRA, brokerage, and other investment accounts",
    defaultType: "investment",
  },
  {
    label: "Cash & Other",
    types: ["cash", "other"],
    description: "Cash on hand and miscellaneous accounts",
    defaultType: "cash",
  },
] as const;

const ALL_TYPES = ["checking", "savings", "credit", "investment", "cash", "other"];

type AccountForm = {
  name: string;
  type: string;
  balance: string;
  notes: string;
};

function emptyForm(defaultType = "checking"): AccountForm {
  return { name: "", type: defaultType, balance: "0", notes: "" };
}

export default function AccountsEditor({ accounts }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // new account: keyed by group label so each group can have its own form open
  const [newGroupLabel, setNewGroupLabel] = useState<string | null>(null);
  const [newForm, setNewForm] = useState<AccountForm>(emptyForm());

  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<AccountForm>(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function run(fn: () => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred");
      }
    });
  }

  function handleCreate() {
    if (!newForm.name.trim()) return;
    run(async () => {
      await createAccount({
        name: newForm.name.trim(),
        type: newForm.type,
        balance: parseFloat(newForm.balance) || 0,
        notes: newForm.notes.trim() || undefined,
      });
      setNewGroupLabel(null);
      setNewForm(emptyForm());
    });
  }

  function startEdit(a: Account) {
    setEditId(a.id);
    setEditForm({
      name: a.name,
      type: a.type,
      balance: String(a.balance),
      notes: a.notes ?? "",
    });
  }

  function handleUpdate() {
    if (!editId || !editForm.name.trim()) return;
    run(async () => {
      await updateAccount(editId, {
        name: editForm.name.trim(),
        type: editForm.type,
        balance: parseFloat(editForm.balance) || 0,
        notes: editForm.notes.trim() || undefined,
      });
      setEditId(null);
    });
  }

  function handleDelete() {
    if (!deleteId) return;
    run(async () => {
      await deleteAccount(deleteId);
      setDeleteId(null);
    });
  }

  const totalAssets = accounts
    .filter((a) => a.type !== "credit")
    .reduce((s, a) => s + Number(a.balance), 0);
  const totalLiabilities = accounts
    .filter((a) => a.type === "credit")
    .reduce((s, a) => s + Number(a.balance), 0);
  const netWorth = totalAssets - totalLiabilities;

  const inputClass =
    "rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800 w-full";
  const btnPrimary =
    "rounded-md bg-orange-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-orange-600 whitespace-nowrap";
  const btnSecondary =
    "rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 whitespace-nowrap";

  return (
    <div className="space-y-6 max-w-xl">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30">
          {error}
        </p>
      )}

      {/* Net worth summary */}
      {accounts.length > 0 && (
        <div className="rounded-lg border p-4 dark:border-gray-700 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Assets</p>
            <p className="mt-1 text-lg font-bold text-green-600 dark:text-green-400 tabular-nums">
              <AmountDisplay amount={totalAssets} />
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Liabilities</p>
            <p className="mt-1 text-lg font-bold text-red-500 tabular-nums">
              <AmountDisplay amount={totalLiabilities} />
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Net Worth</p>
            <p
              className={`mt-1 text-lg font-bold tabular-nums ${
                netWorth >= 0
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-red-600"
              }`}
            >
              <AmountDisplay amount={netWorth} />
            </p>
          </div>
        </div>
      )}

      {/* 4 account groups */}
      {ACCOUNT_GROUPS.map((group) => {
        const groupAccounts = accounts.filter((a) => group.types.includes(a.type as never));
        const groupTotal = groupAccounts.reduce((s, a) => s + Number(a.balance), 0);
        const isAddingHere = newGroupLabel === group.label;

        return (
          <div key={group.label} className="rounded-lg border dark:border-gray-700">
            {/* Group header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-t-lg border-b dark:border-gray-700">
              <div>
                <p className="text-sm font-semibold">{group.label}</p>
                <p className="text-xs text-gray-400">{group.description}</p>
              </div>
              {groupAccounts.length > 0 && (
                <p className="text-sm font-semibold tabular-nums text-gray-700 dark:text-gray-300">
                  <AmountDisplay amount={groupTotal} />
                </p>
              )}
            </div>

            {/* Account rows */}
            {groupAccounts.length > 0 && (
              <div className="divide-y dark:divide-gray-700">
                {groupAccounts.map((account) => (
                  <div key={account.id} className="px-4 py-3">
                    {editId === account.id ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <div className="flex-1 min-w-[120px]">
                            <label className="text-xs text-gray-500">Name</label>
                            <input
                              className={inputClass}
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({ ...editForm, name: e.target.value })
                              }
                              autoFocus
                            />
                          </div>
                          <div className="w-32">
                            <label className="text-xs text-gray-500">Type</label>
                            <select
                              className={inputClass}
                              value={editForm.type}
                              onChange={(e) =>
                                setEditForm({ ...editForm, type: e.target.value })
                              }
                            >
                              {ALL_TYPES.map((t) => (
                                <option key={t} value={t}>
                                  {t.charAt(0).toUpperCase() + t.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="w-32">
                            <label className="text-xs text-gray-500">Balance ($)</label>
                            <input
                              type="number"
                              step="0.01"
                              className={inputClass}
                              value={editForm.balance}
                              onChange={(e) =>
                                setEditForm({ ...editForm, balance: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Notes</label>
                          <input
                            className={inputClass}
                            value={editForm.notes}
                            onChange={(e) =>
                              setEditForm({ ...editForm, notes: e.target.value })
                            }
                            placeholder="Optional notes"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={handleUpdate} className={btnPrimary}>
                            Save
                          </button>
                          <button onClick={() => setEditId(null)} className={btnSecondary}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{account.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{account.type}</p>
                        </div>
                        <p
                          className={`tabular-nums font-semibold text-sm ${
                            Number(account.balance) < 0
                              ? "text-red-500"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          <AmountDisplay amount={Number(account.balance)} />
                        </p>
                        <button onClick={() => startEdit(account)} className={btnSecondary}>
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(account.id)}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add account form or button */}
            <div className="px-4 py-3 border-t dark:border-gray-700">
              {isAddingHere ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <div className="flex-1 min-w-[120px]">
                      <label className="text-xs text-gray-500">Name</label>
                      <input
                        className={inputClass}
                        value={newForm.name}
                        onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                        placeholder={
                          group.label === "Investments"
                            ? "e.g. 401k, Roth IRA"
                            : `e.g. ${group.label}`
                        }
                        autoFocus
                      />
                    </div>
                    <div className="w-32">
                      <label className="text-xs text-gray-500">Type</label>
                      <select
                        className={inputClass}
                        value={newForm.type}
                        onChange={(e) => setNewForm({ ...newForm, type: e.target.value })}
                      >
                        {group.types.map((t) => (
                          <option key={t} value={t}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-32">
                      <label className="text-xs text-gray-500">Balance ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        className={inputClass}
                        value={newForm.balance}
                        onChange={(e) => setNewForm({ ...newForm, balance: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Notes</label>
                    <input
                      className={inputClass}
                      value={newForm.notes}
                      onChange={(e) => setNewForm({ ...newForm, notes: e.target.value })}
                      placeholder="Optional notes"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleCreate} className={btnPrimary}>
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setNewGroupLabel(null);
                        setNewForm(emptyForm());
                      }}
                      className={btnSecondary}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setNewGroupLabel(group.label);
                    setNewForm(emptyForm(group.defaultType));
                  }}
                  className="text-xs text-orange-500 hover:text-orange-700 font-medium"
                >
                  + Add {group.label} account
                </button>
              )}
            </div>
          </div>
        );
      })}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete account?"
        description="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
