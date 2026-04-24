"use client";

import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) dialog.showModal();
    else dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      className="w-full max-w-sm rounded-card p-6 shadow-xl backdrop:bg-black/40"
      style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
    >
      <h2 className="font-semibold" style={{ fontSize: 15 }}>{title}</h2>
      {description && (
        <p className="mt-2" style={{ fontSize: 12, color: "var(--text-dim)" }}>{description}</p>
      )}
      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-button px-3 py-1.5 font-medium transition-colors"
          style={{
            fontSize: 12.5,
            border: "1px solid var(--border)",
            color: "var(--text)",
            background: "transparent",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-button px-3 py-1.5 font-medium text-white transition-colors"
          style={{ fontSize: 12.5, background: "var(--bad)" }}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
