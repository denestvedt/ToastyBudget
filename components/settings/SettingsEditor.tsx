"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CategoryGroup, BudgetCategory } from "@/lib/types";
import {
  createCategoryGroup,
  updateCategoryGroup,
  deleteCategoryGroup,
  createBudgetCategory,
  updateBudgetCategory,
  deleteBudgetCategory,
} from "@/lib/actions";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";

interface Props {
  groups: CategoryGroup[];
  categories: BudgetCategory[];
}

type GroupForm = { name: string; icon: string };
type CategoryForm = {
  name: string;
  budget_amount: string;
  is_fixed: boolean;
  is_offledger: boolean;
  notes: string;
};

const emptyGroupForm = (): GroupForm => ({ name: "", icon: "" });
const emptyCatForm = (): CategoryForm => ({
  name: "",
  budget_amount: "0",
  is_fixed: false,
  is_offledger: false,
  notes: "",
});

function uniqueId(base: string): string {
  return `${base}-${crypto.randomUUID()}`;
}

export default function SettingsEditor({ groups, categories }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Group state
  const [newGroup, setNewGroup] = useState<GroupForm | null>(null);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [editGroupForm, setEditGroupForm] = useState<GroupForm>(emptyGroupForm());
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);

  // Category state
  const [newCatGroupId, setNewCatGroupId] = useState<string | null>(null);
  const [newCatForm, setNewCatForm] = useState<CategoryForm>(emptyCatForm());
  const [editCatId, setEditCatId] = useState<string | null>(null);
  const [editCatForm, setEditCatForm] = useState<CategoryForm>(emptyCatForm());
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);

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

  // ── Group handlers ────────────────────────────────────────────────────────

  function handleCreateGroup() {
    if (!newGroup || !newGroup.name.trim()) return;
    const maxOrder = groups.reduce((m, g) => Math.max(m, g.order), -1);
    run(async () => {
      await createCategoryGroup({
        id: uniqueId("group"),
        name: newGroup.name.trim(),
        icon: newGroup.icon.trim() || undefined,
        order: maxOrder + 1,
      });
      setNewGroup(null);
    });
  }

  function startEditGroup(g: CategoryGroup) {
    setEditGroupId(g.id);
    setEditGroupForm({ name: g.name, icon: g.icon ?? "" });
  }

  function handleUpdateGroup() {
    if (!editGroupId || !editGroupForm.name.trim()) return;
    run(async () => {
      await updateCategoryGroup(editGroupId, {
        name: editGroupForm.name.trim(),
        icon: editGroupForm.icon.trim() || undefined,
      });
      setEditGroupId(null);
    });
  }

  function handleDeleteGroup() {
    if (!deleteGroupId) return;
    run(async () => {
      await deleteCategoryGroup(deleteGroupId);
      setDeleteGroupId(null);
    });
  }

  function handleMoveGroup(id: string, dir: -1 | 1) {
    const idx = groups.findIndex((g) => g.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= groups.length) return;
    const a = groups[idx];
    const b = groups[swapIdx];
    run(async () => {
      await updateCategoryGroup(a.id, { order: b.order });
      await updateCategoryGroup(b.id, { order: a.order });
    });
  }

  // ── Category handlers ─────────────────────────────────────────────────────

  function handleCreateCategory(groupId: string) {
    if (!newCatForm.name.trim()) return;
    const maxOrder = categories
      .filter((c) => c.group_id === groupId)
      .reduce((m, c) => Math.max(m, c.order), -1);
    run(async () => {
      await createBudgetCategory({
        id: uniqueId("cat"),
        group_id: groupId,
        name: newCatForm.name.trim(),
        budget_amount: parseFloat(newCatForm.budget_amount) || 0,
        is_fixed: newCatForm.is_fixed,
        is_offledger: newCatForm.is_offledger,
        notes: newCatForm.notes.trim() || undefined,
        order: maxOrder + 1,
      });
      setNewCatGroupId(null);
      setNewCatForm(emptyCatForm());
    });
  }

  function startEditCat(c: BudgetCategory) {
    setEditCatId(c.id);
    setEditCatForm({
      name: c.name,
      budget_amount: String(c.budget_amount),
      is_fixed: c.is_fixed,
      is_offledger: c.is_offledger,
      notes: c.notes ?? "",
    });
  }

  function handleUpdateCategory() {
    if (!editCatId || !editCatForm.name.trim()) return;
    run(async () => {
      await updateBudgetCategory(editCatId, {
        name: editCatForm.name.trim(),
        budget_amount: parseFloat(editCatForm.budget_amount) || 0,
        is_fixed: editCatForm.is_fixed,
        is_offledger: editCatForm.is_offledger,
        notes: editCatForm.notes.trim() || undefined,
      });
      setEditCatId(null);
    });
  }

  function handleDeleteCategory() {
    if (!deleteCatId) return;
    run(async () => {
      await deleteBudgetCategory(deleteCatId);
      setDeleteCatId(null);
    });
  }

  function handleMoveCategory(id: string, groupId: string, dir: -1 | 1) {
    const inGroup = categories.filter((c) => c.group_id === groupId);
    const idx = inGroup.findIndex((c) => c.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= inGroup.length) return;
    const a = inGroup[idx];
    const b = inGroup[swapIdx];
    run(async () => {
      await updateBudgetCategory(a.id, { order: b.order });
      await updateBudgetCategory(b.id, { order: a.order });
    });
  }

  const inputClass =
    "rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800 w-full";
  const btnPrimary =
    "rounded-md bg-orange-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-orange-600 whitespace-nowrap";
  const btnSecondary =
    "rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 whitespace-nowrap";
  const btnDanger = "text-xs text-red-400 hover:text-red-600";

  return (
    <div className="space-y-8">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30">
          {error}
        </p>
      )}

      {/* ── Category Groups ─────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Category Groups</h2>
          {newGroup === null && (
            <button onClick={() => setNewGroup(emptyGroupForm())} className={btnPrimary}>
              + Add Group
            </button>
          )}
        </div>

        {/* New group form */}
        {newGroup && (
          <div className="mb-3 flex flex-wrap items-end gap-2 rounded-lg border border-orange-300 p-3 dark:border-orange-700">
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs text-gray-500">Name</label>
              <input
                className={inputClass}
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                placeholder="e.g. Housing"
                autoFocus
              />
            </div>
            <div className="w-20">
              <label className="text-xs text-gray-500">Icon (emoji)</label>
              <input
                className={inputClass}
                value={newGroup.icon}
                onChange={(e) => setNewGroup({ ...newGroup, icon: e.target.value })}
                placeholder="🏠"
              />
            </div>
            <button onClick={handleCreateGroup} className={btnPrimary}>
              Save
            </button>
            <button onClick={() => setNewGroup(null)} className={btnSecondary}>
              Cancel
            </button>
          </div>
        )}

        {groups.length === 0 && !newGroup && (
          <EmptyState
            title="No groups yet"
            description="Create a group to organize your budget categories."
          />
        )}

        <div className="space-y-6">
          {groups.map((group, gi) => {
            const cats = categories.filter((c) => c.group_id === group.id);
            const isEditingGroup = editGroupId === group.id;

            return (
              <div key={group.id} className="rounded-lg border dark:border-gray-700">
                {/* Group header */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900/50 rounded-t-lg border-b dark:border-gray-700">
                  {isEditingGroup ? (
                    <>
                      <input
                        className={inputClass + " w-12 flex-none"}
                        value={editGroupForm.icon}
                        onChange={(e) =>
                          setEditGroupForm({ ...editGroupForm, icon: e.target.value })
                        }
                        placeholder="🏠"
                      />
                      <input
                        className={inputClass + " flex-1"}
                        value={editGroupForm.name}
                        onChange={(e) =>
                          setEditGroupForm({ ...editGroupForm, name: e.target.value })
                        }
                        autoFocus
                      />
                      <button onClick={handleUpdateGroup} className={btnPrimary}>
                        Save
                      </button>
                      <button onClick={() => setEditGroupId(null)} className={btnSecondary}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold flex-1 text-sm">
                        {group.icon && <span className="mr-1">{group.icon}</span>}
                        {group.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveGroup(group.id, -1)}
                          disabled={gi === 0}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs px-1"
                          aria-label="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveGroup(group.id, 1)}
                          disabled={gi === groups.length - 1}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs px-1"
                          aria-label="Move down"
                        >
                          ↓
                        </button>
                        <button onClick={() => startEditGroup(group)} className={btnSecondary}>
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteGroupId(group.id)}
                          className={btnDanger}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Categories within group */}
                <div className="divide-y dark:divide-gray-700">
                  {cats.map((cat, ci) => {
                    const isEditingCat = editCatId === cat.id;
                    return (
                      <div key={cat.id} className="px-3 py-2">
                        {isEditingCat ? (
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              <div className="flex-1 min-w-[140px]">
                                <label className="text-xs text-gray-500">Name</label>
                                <input
                                  className={inputClass}
                                  value={editCatForm.name}
                                  onChange={(e) =>
                                    setEditCatForm({ ...editCatForm, name: e.target.value })
                                  }
                                  autoFocus
                                />
                              </div>
                              <div className="w-32">
                                <label className="text-xs text-gray-500">Default Budget ($)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className={inputClass}
                                  value={editCatForm.budget_amount}
                                  onChange={(e) =>
                                    setEditCatForm({
                                      ...editCatForm,
                                      budget_amount: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                              <label className="flex items-center gap-1.5">
                                <input
                                  type="checkbox"
                                  checked={editCatForm.is_fixed}
                                  onChange={(e) =>
                                    setEditCatForm({ ...editCatForm, is_fixed: e.target.checked })
                                  }
                                />
                                Fixed expense
                              </label>
                              <label className="flex items-center gap-1.5">
                                <input
                                  type="checkbox"
                                  checked={editCatForm.is_offledger}
                                  onChange={(e) =>
                                    setEditCatForm({
                                      ...editCatForm,
                                      is_offledger: e.target.checked,
                                    })
                                  }
                                />
                                Off-ledger
                              </label>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">Notes</label>
                              <input
                                className={inputClass}
                                value={editCatForm.notes}
                                onChange={(e) =>
                                  setEditCatForm({ ...editCatForm, notes: e.target.value })
                                }
                                placeholder="Optional notes"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button onClick={handleUpdateCategory} className={btnPrimary}>
                                Save
                              </button>
                              <button onClick={() => setEditCatId(null)} className={btnSecondary}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="flex-1 text-sm">{cat.name}</span>
                            <span className="text-xs text-gray-400 tabular-nums">
                              ${Number(cat.budget_amount).toFixed(2)}
                            </span>
                            {cat.is_fixed && (
                              <span className="text-xs text-gray-400">fixed</span>
                            )}
                            {cat.is_offledger && (
                              <span className="text-xs text-gray-400">off-ledger</span>
                            )}
                            <button
                              onClick={() => handleMoveCategory(cat.id, group.id, -1)}
                              disabled={ci === 0}
                              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs px-1"
                              aria-label="Move up"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => handleMoveCategory(cat.id, group.id, 1)}
                              disabled={ci === cats.length - 1}
                              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs px-1"
                              aria-label="Move down"
                            >
                              ↓
                            </button>
                            <button onClick={() => startEditCat(cat)} className={btnSecondary}>
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteCatId(cat.id)}
                              className={btnDanger}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* New category form */}
                  {newCatGroupId === group.id ? (
                    <div className="px-3 py-3 space-y-2 bg-orange-50/40 dark:bg-orange-950/10">
                      <div className="flex flex-wrap gap-2">
                        <div className="flex-1 min-w-[140px]">
                          <label className="text-xs text-gray-500">Name</label>
                          <input
                            className={inputClass}
                            value={newCatForm.name}
                            onChange={(e) =>
                              setNewCatForm({ ...newCatForm, name: e.target.value })
                            }
                            placeholder="e.g. Rent"
                            autoFocus
                          />
                        </div>
                        <div className="w-32">
                          <label className="text-xs text-gray-500">Default Budget ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className={inputClass}
                            value={newCatForm.budget_amount}
                            onChange={(e) =>
                              setNewCatForm({ ...newCatForm, budget_amount: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                        <label className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={newCatForm.is_fixed}
                            onChange={(e) =>
                              setNewCatForm({ ...newCatForm, is_fixed: e.target.checked })
                            }
                          />
                          Fixed expense
                        </label>
                        <label className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={newCatForm.is_offledger}
                            onChange={(e) =>
                              setNewCatForm({ ...newCatForm, is_offledger: e.target.checked })
                            }
                          />
                          Off-ledger
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleCreateCategory(group.id)} className={btnPrimary}>
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setNewCatGroupId(null);
                            setNewCatForm(emptyCatForm());
                          }}
                          className={btnSecondary}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="px-3 py-2">
                      <button
                        onClick={() => {
                          setNewCatGroupId(group.id);
                          setNewCatForm(emptyCatForm());
                        }}
                        className="text-xs text-orange-500 hover:text-orange-700 font-medium"
                      >
                        + Add Category
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={deleteGroupId !== null}
        title="Delete group?"
        description="This will also delete all categories and monthly budget data in this group. This action cannot be undone."
        confirmLabel="Delete Group"
        onConfirm={handleDeleteGroup}
        onCancel={() => setDeleteGroupId(null)}
      />
      <ConfirmDialog
        open={deleteCatId !== null}
        title="Delete category?"
        description="This will also delete monthly budget data and unlink transactions for this category."
        confirmLabel="Delete Category"
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeleteCatId(null)}
      />
    </div>
  );
}
