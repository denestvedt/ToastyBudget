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

  const [newGroup, setNewGroup] = useState<GroupForm | null>(null);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [editGroupForm, setEditGroupForm] = useState<GroupForm>(emptyGroupForm());
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);

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

  const btnDanger = {
    fontSize: 12,
    color: "var(--bad)",
    background: "none",
    border: "none",
    cursor: "pointer",
  };

  return (
    <div className="space-y-8">
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

      {/* Category Groups */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold" style={{ fontSize: 15, color: "var(--text)" }}>
            Category Groups
          </h2>
          {newGroup === null && (
            <button onClick={() => setNewGroup(emptyGroupForm())} style={btnPrimary}>
              + Add Group
            </button>
          )}
        </div>

        {newGroup && (
          <div
            className="mb-3 flex flex-wrap items-end gap-2 rounded-card p-3"
            style={{ border: "1px solid var(--accent)", background: "var(--surface)" }}
          >
            <div className="flex-1 min-w-[140px]">
              <label className="eyebrow block mb-1">Name</label>
              <input
                style={inputStyle}
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                placeholder="e.g. Housing"
                autoFocus
              />
            </div>
            <div className="w-20">
              <label className="eyebrow block mb-1">Icon (emoji)</label>
              <input
                style={inputStyle}
                value={newGroup.icon}
                onChange={(e) => setNewGroup({ ...newGroup, icon: e.target.value })}
                placeholder="🏠"
              />
            </div>
            <button onClick={handleCreateGroup} style={btnPrimary}>Save</button>
            <button onClick={() => setNewGroup(null)} style={btnSecondary}>Cancel</button>
          </div>
        )}

        {groups.length === 0 && !newGroup && (
          <EmptyState
            title="No groups yet"
            description="Create a group to organize your budget categories."
          />
        )}

        <div className="space-y-5">
          {groups.map((group, gi) => {
            const cats = categories.filter((c) => c.group_id === group.id);
            const isEditingGroup = editGroupId === group.id;

            return (
              <div
                key={group.id}
                className="rounded-card overflow-hidden"
                style={{ border: "1px solid var(--border)" }}
              >
                {/* Group header */}
                <div
                  className="flex items-center gap-2 px-3 py-2"
                  style={{
                    background: "var(--surface-2)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {isEditingGroup ? (
                    <>
                      <input
                        style={{ ...inputStyle, width: 48 }}
                        value={editGroupForm.icon}
                        onChange={(e) => setEditGroupForm({ ...editGroupForm, icon: e.target.value })}
                        placeholder="🏠"
                      />
                      <input
                        style={{ ...inputStyle, flex: 1 }}
                        value={editGroupForm.name}
                        onChange={(e) => setEditGroupForm({ ...editGroupForm, name: e.target.value })}
                        autoFocus
                      />
                      <button onClick={handleUpdateGroup} style={btnPrimary}>Save</button>
                      <button onClick={() => setEditGroupId(null)} style={btnSecondary}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold flex-1" style={{ fontSize: 13, color: "var(--text)" }}>
                        {group.icon && <span className="mr-1">{group.icon}</span>}
                        {group.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveGroup(group.id, -1)}
                          disabled={gi === 0}
                          style={{ ...btnDanger, opacity: gi === 0 ? 0.3 : 1 }}
                          aria-label="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveGroup(group.id, 1)}
                          disabled={gi === groups.length - 1}
                          style={{ ...btnDanger, opacity: gi === groups.length - 1 ? 0.3 : 1 }}
                          aria-label="Move down"
                        >
                          ↓
                        </button>
                        <button onClick={() => startEditGroup(group)} style={btnSecondary}>Edit</button>
                        <button onClick={() => setDeleteGroupId(group.id)} style={btnDanger}>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Categories */}
                <div style={{ background: "var(--surface)" }}>
                  {cats.map((cat, ci) => {
                    const isEditingCat = editCatId === cat.id;
                    return (
                      <div
                        key={cat.id}
                        className="px-3 py-2"
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        {isEditingCat ? (
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              <div className="flex-1 min-w-[140px]">
                                <label className="eyebrow block mb-1">Name</label>
                                <input
                                  style={inputStyle}
                                  value={editCatForm.name}
                                  onChange={(e) => setEditCatForm({ ...editCatForm, name: e.target.value })}
                                  autoFocus
                                />
                              </div>
                              <div className="w-32">
                                <label className="eyebrow block mb-1">Default Budget ($)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  style={inputStyle}
                                  value={editCatForm.budget_amount}
                                  onChange={(e) => setEditCatForm({ ...editCatForm, budget_amount: e.target.value })}
                                />
                              </div>
                            </div>
                            <div
                              className="flex flex-wrap gap-4"
                              style={{ fontSize: 12, color: "var(--text-dim)" }}
                            >
                              <label className="flex items-center gap-1.5">
                                <input
                                  type="checkbox"
                                  checked={editCatForm.is_fixed}
                                  onChange={(e) => setEditCatForm({ ...editCatForm, is_fixed: e.target.checked })}
                                />
                                Fixed expense
                              </label>
                              <label className="flex items-center gap-1.5">
                                <input
                                  type="checkbox"
                                  checked={editCatForm.is_offledger}
                                  onChange={(e) => setEditCatForm({ ...editCatForm, is_offledger: e.target.checked })}
                                />
                                Off-ledger
                              </label>
                            </div>
                            <div>
                              <label className="eyebrow block mb-1">Notes</label>
                              <input
                                style={inputStyle}
                                value={editCatForm.notes}
                                onChange={(e) => setEditCatForm({ ...editCatForm, notes: e.target.value })}
                                placeholder="Optional notes"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button onClick={handleUpdateCategory} style={btnPrimary}>Save</button>
                              <button onClick={() => setEditCatId(null)} style={btnSecondary}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="flex-1" style={{ fontSize: 12.5, color: "var(--text)" }}>
                              {cat.name}
                            </span>
                            <span className="mono" style={{ fontSize: 11, color: "var(--text-mute)" }}>
                              ${Number(cat.budget_amount).toFixed(2)}
                            </span>
                            {cat.is_fixed && (
                              <span style={{ fontSize: 10, color: "var(--text-mute)" }}>fixed</span>
                            )}
                            {cat.is_offledger && (
                              <span style={{ fontSize: 10, color: "var(--text-mute)" }}>off-ledger</span>
                            )}
                            <button
                              onClick={() => handleMoveCategory(cat.id, group.id, -1)}
                              disabled={ci === 0}
                              style={{ ...btnDanger, opacity: ci === 0 ? 0.3 : 1 }}
                              aria-label="Move up"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => handleMoveCategory(cat.id, group.id, 1)}
                              disabled={ci === cats.length - 1}
                              style={{ ...btnDanger, opacity: ci === cats.length - 1 ? 0.3 : 1 }}
                              aria-label="Move down"
                            >
                              ↓
                            </button>
                            <button onClick={() => startEditCat(cat)} style={btnSecondary}>Edit</button>
                            <button onClick={() => setDeleteCatId(cat.id)} style={btnDanger}>Delete</button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* New category form */}
                  {newCatGroupId === group.id ? (
                    <div
                      className="px-3 py-3 space-y-2"
                      style={{
                        background: "color-mix(in srgb, var(--accent) 5%, transparent)",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <div className="flex flex-wrap gap-2">
                        <div className="flex-1 min-w-[140px]">
                          <label className="eyebrow block mb-1">Name</label>
                          <input
                            style={inputStyle}
                            value={newCatForm.name}
                            onChange={(e) => setNewCatForm({ ...newCatForm, name: e.target.value })}
                            placeholder="e.g. Rent"
                            autoFocus
                          />
                        </div>
                        <div className="w-32">
                          <label className="eyebrow block mb-1">Default Budget ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            style={inputStyle}
                            value={newCatForm.budget_amount}
                            onChange={(e) => setNewCatForm({ ...newCatForm, budget_amount: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4" style={{ fontSize: 12, color: "var(--text-dim)" }}>
                        <label className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={newCatForm.is_fixed}
                            onChange={(e) => setNewCatForm({ ...newCatForm, is_fixed: e.target.checked })}
                          />
                          Fixed expense
                        </label>
                        <label className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={newCatForm.is_offledger}
                            onChange={(e) => setNewCatForm({ ...newCatForm, is_offledger: e.target.checked })}
                          />
                          Off-ledger
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleCreateCategory(group.id)} style={btnPrimary}>Save</button>
                        <button
                          onClick={() => { setNewCatGroupId(null); setNewCatForm(emptyCatForm()); }}
                          style={btnSecondary}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="px-3 py-2">
                      <button
                        onClick={() => { setNewCatGroupId(group.id); setNewCatForm(emptyCatForm()); }}
                        style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
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
