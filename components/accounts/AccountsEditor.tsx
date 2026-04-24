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

type AccountForm = { name: string; type: string; balance: string; notes: string };

function emptyForm(defaultType = "checking"): AccountForm {
  return { name: "", type: defaultType, balance: "0", notes: "" };
}

export default function AccountsEditor({ accounts }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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
    setEditForm({ name: a.name, type: a.type, balance: String(a.balance), notes: a.notes ?? "" });
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

  const inputStyle = {
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-input)",
    color: "var(--text)",
    fontSize: 12.5,
    padding: "6px 10px",
    outline: "none",
    width: "100%",
  };

  const btnPrimary = {
    background: "var(--accent)",
    color: "var(--bg)",
    border: "none",
    borderRadius: "var(--r-button)",
    fontSize: 12,
    fontWeight: 600,
    padding: "5px 12px",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
  };

  const btnSecondary = {
    background: "transparent",
    color: "var(--text)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-button)",
    fontSize: 12,
    fontWeight: 600,
    padding: "5px 12px",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
  };

  return (
    <div className="space-y-6 max-w-xl">
      {error && (
        <p
          className="rounded-card px-3 py-2"
          style={{
            fontSize: 12,
            color: "var(--bad)",
            background: "color-mix(in srgb, var(--bad) 10%, transparent)",
          }}
        >
          {error}
        </p>
      )}

      {/* Net worth summary */}
      {accounts.length > 0 && (
        <div
          className="rounded-card p-4 grid grid-cols-3 gap-4 text-center"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {[
            { label: "Assets", value: totalAssets, color: "var(--good)" },
            { label: "Liabilities", value: totalLiabilities, color: "var(--bad)" },
            { label: "Net Worth", value: netWorth, color: netWorth >= 0 ? "var(--text)" : "var(--bad)" },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p className="eyebrow">{label}</p>
              <AmountDisplay
                amount={value}
                className="mt-1 font-bold block"
                style={{ fontSize: 18, color }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Account groups */}
      {ACCOUNT_GROUPS.map((group) => {
        const groupAccounts = accounts.filter((a) => group.types.includes(a.type as never));
        const groupTotal = groupAccounts.reduce((s, a) => s + Number(a.balance), 0);
        const isAddingHere = newGroupLabel === group.label;

        return (
          <div
            key={group.label}
            className="rounded-card overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            {/* Group header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                background: "var(--surface-2)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <p className="font-semibold" style={{ fontSize: 13, color: "var(--text)" }}>
                  {group.label}
                </p>
                <p style={{ fontSize: 11, color: "var(--text-mute)" }}>{group.description}</p>
              </div>
              {groupAccounts.length > 0 && (
                <AmountDisplay
                  amount={groupTotal}
                  className="font-semibold"
                  style={{ fontSize: 13, color: "var(--text)" }}
                />
              )}
            </div>

            {/* Account rows */}
            {groupAccounts.length > 0 && (
              <div style={{ background: "var(--surface)" }}>
                {groupAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="px-4 py-3"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    {editId === account.id ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <div className="flex-1 min-w-[120px]">
                            <label className="eyebrow block mb-1">Name</label>
                            <input
                              style={inputStyle}
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              autoFocus
                            />
                          </div>
                          <div className="w-32">
                            <label className="eyebrow block mb-1">Type</label>
                            <select
                              style={inputStyle}
                              value={editForm.type}
                              onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                            >
                              {ALL_TYPES.map((t) => (
                                <option key={t} value={t}>
                                  {t.charAt(0).toUpperCase() + t.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="w-32">
                            <label className="eyebrow block mb-1">Balance ($)</label>
                            <input
                              type="number"
                              step="0.01"
                              style={inputStyle}
                              value={editForm.balance}
                              onChange={(e) => setEditForm({ ...editForm, balance: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="eyebrow block mb-1">Notes</label>
                          <input
                            style={inputStyle}
                            value={editForm.notes}
                            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                            placeholder="Optional notes"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={handleUpdate} style={btnPrimary}>Save</button>
                          <button onClick={() => setEditId(null)} style={btnSecondary}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="font-medium" style={{ fontSize: 12.5, color: "var(--text)" }}>
                            {account.name}
                          </p>
                          <p className="capitalize" style={{ fontSize: 11, color: "var(--text-mute)" }}>
                            {account.type}
                          </p>
                        </div>
                        <AmountDisplay
                          amount={Number(account.balance)}
                          className="font-semibold"
                          style={{
                            fontSize: 13,
                            color: Number(account.balance) < 0 ? "var(--bad)" : "var(--text)",
                          }}
                        />
                        <button onClick={() => startEdit(account)} style={btnSecondary}>Edit</button>
                        <button
                          onClick={() => setDeleteId(account.id)}
                          style={{ fontSize: 12, color: "var(--bad)", cursor: "pointer", background: "none", border: "none" }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add form or button */}
            <div
              className="px-4 py-3"
              style={{ background: "var(--surface)", borderTop: groupAccounts.length > 0 ? "none" : undefined }}
            >
              {isAddingHere ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <div className="flex-1 min-w-[120px]">
                      <label className="eyebrow block mb-1">Name</label>
                      <input
                        style={inputStyle}
                        value={newForm.name}
                        onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                        placeholder={group.label === "Investments" ? "e.g. 401k, Roth IRA" : `e.g. ${group.label}`}
                        autoFocus
                      />
                    </div>
                    <div className="w-32">
                      <label className="eyebrow block mb-1">Type</label>
                      <select
                        style={inputStyle}
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
                      <label className="eyebrow block mb-1">Balance ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        style={inputStyle}
                        value={newForm.balance}
                        onChange={(e) => setNewForm({ ...newForm, balance: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="eyebrow block mb-1">Notes</label>
                    <input
                      style={inputStyle}
                      value={newForm.notes}
                      onChange={(e) => setNewForm({ ...newForm, notes: e.target.value })}
                      placeholder="Optional notes"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleCreate} style={btnPrimary}>Save</button>
                    <button
                      onClick={() => { setNewGroupLabel(null); setNewForm(emptyForm()); }}
                      style={btnSecondary}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setNewGroupLabel(group.label); setNewForm(emptyForm(group.defaultType)); }}
                  style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
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
