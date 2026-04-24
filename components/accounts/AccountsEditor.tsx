"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Account } from "@/lib/types";
import { createAccount, updateAccount, deleteAccount } from "@/lib/actions";
import AmountDisplay from "@/components/ui/AmountDisplay";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";

interface Props {
  accounts: Account[];
}

const ACCOUNT_TYPES = ["checking", "savings", "credit", "investment", "cash", "other"];

type AccountForm = {
  name: string;
  type: string;
  balance: string;
  notes: string;
};

const emptyForm = (): AccountForm => ({
  name: "",
  type: "checking",
  balance: "0",
  notes: "",
});

export default function AccountsEditor({ accounts }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
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
      setShowNew(false);
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

  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0);

  const inputClass =
    "rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800 w-full";
  const btnPrimary =
    "rounded-md bg-orange-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-orange-600 whitespace-nowrap";
  const btnSecondary =
    "rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 whitespace-nowrap";

  return (
    <div className="space-y-4 max-w-xl">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30">
          {error}
        </p>
      )}

      {/* Summary */}
      {accounts.length > 0 && (
        <div className="rounded-lg border p-4 dark:border-gray-700">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Net Worth
          </p>
          <p
            className={`mt-1 text-2xl font-bold tabular-nums ${
              totalBalance >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600"
            }`}
          >
            <AmountDisplay amount={totalBalance} />
          </p>
        </div>
      )}

      {/* Account list */}
      {accounts.length === 0 && !showNew ? (
        <EmptyState
          title="No accounts yet"
          description="Add accounts to track your balances and net worth."
          action={
            <button onClick={() => setShowNew(true)} className={btnPrimary}>
              + Add Account
            </button>
          }
        />
      ) : (
        <>
          <div className="divide-y rounded-lg border dark:border-gray-700 dark:divide-gray-700">
            {accounts.map((account) => (
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
                          {ACCOUNT_TYPES.map((t) => (
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
                        Number(account.balance) < 0 ? "text-red-500" : "text-gray-900 dark:text-gray-100"
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

          {/* New account form */}
          {showNew ? (
            <div className="rounded-lg border border-orange-300 p-4 space-y-2 dark:border-orange-700">
              <div className="flex flex-wrap gap-2">
                <div className="flex-1 min-w-[120px]">
                  <label className="text-xs text-gray-500">Name</label>
                  <input
                    className={inputClass}
                    value={newForm.name}
                    onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                    placeholder="e.g. Chase Checking"
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
                    {ACCOUNT_TYPES.map((t) => (
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
                    setShowNew(false);
                    setNewForm(emptyForm());
                  }}
                  className={btnSecondary}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowNew(true)} className={btnPrimary}>
              + Add Account
            </button>
          )}
        </>
      )}

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
