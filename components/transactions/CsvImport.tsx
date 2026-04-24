"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { importTransactions } from "@/lib/actions";

interface ParsedRow {
  date: string;
  description: string;
  amount: number;
  month: string;
}

function parseCSV(text: string): string[][] {
  const lines = text.trim().split(/\r?\n/);
  return lines.map((line) => {
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') inQuotes = !inQuotes;
      else if (ch === "," && !inQuotes) {
        fields.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());
    return fields;
  });
}

function dateToMonth(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) throw new Error(`Invalid date: ${dateStr}`);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function isHeaderRow(row: string[]): boolean {
  const first = row[0]?.toLowerCase().trim() ?? "";
  return (
    first === "date" ||
    first === "transaction date" ||
    first === "posted date" ||
    first === "posting date" ||
    /^[a-z]/.test(first)
  );
}

export default function CsvImport() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<ParsedRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseError(null);
    setPreview([]);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const rows = parseCSV(text);
        if (rows.length === 0) throw new Error("File is empty");

        const dataRows = isHeaderRow(rows[0]) ? rows.slice(1) : rows;
        const parsed: ParsedRow[] = dataRows
          .filter((r) => r.length >= 3 && r.some((c) => c !== ""))
          .map((r, i) => {
            const date = r[0];
            const description = r[1];
            const amount = parseFloat(r[2].replace(/[$,]/g, ""));
            if (!date || !description) throw new Error(`Row ${i + 2}: missing date or description`);
            if (isNaN(amount)) throw new Error(`Row ${i + 2}: invalid amount "${r[2]}"`);
            const month = dateToMonth(date);
            return { date, description, amount, month };
          });

        if (parsed.length === 0) throw new Error("No valid rows found");
        setPreview(parsed);
      } catch (err) {
        setParseError(err instanceof Error ? err.message : "Parse error");
      }
    };
    reader.readAsText(file);
  }

  function handleImport() {
    startTransition(async () => {
      try {
        await importTransactions(preview);
        setOpen(false);
        setPreview([]);
        if (fileRef.current) fileRef.current.value = "";
        router.refresh();
      } catch (e) {
        setImportError(e instanceof Error ? e.message : "Import failed");
      }
    });
  }

  function handleClose() {
    setOpen(false);
    setPreview([]);
    setParseError(null);
    setImportError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-button transition-colors"
        style={{
          background: "var(--accent)",
          color: "var(--bg)",
          border: "none",
          fontSize: 12.5,
          fontWeight: 600,
          padding: "7px 14px",
          cursor: "pointer",
        }}
      >
        Import CSV
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div
            className="w-full max-w-lg rounded-card p-6 shadow-2xl"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold" style={{ fontSize: 15 }}>Import Transactions</h2>
              <button
                onClick={handleClose}
                style={{ color: "var(--text-mute)", background: "none", border: "none", cursor: "pointer", fontSize: 16 }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 12 }}>
              CSV format:{" "}
              <code
                className="mono"
                style={{
                  fontSize: 11,
                  background: "var(--surface-2)",
                  padding: "1px 5px",
                  borderRadius: 4,
                }}
              >
                date, description, amount
              </code>
              <br />
              A header row is detected and skipped automatically.
            </p>

            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFile}
              className="block w-full"
              style={{ fontSize: 12, color: "var(--text-dim)" }}
            />

            {parseError && (
              <p className="mt-3" style={{ fontSize: 12, color: "var(--bad)" }}>{parseError}</p>
            )}

            {preview.length > 0 && (
              <div className="mt-4">
                <p className="font-medium mb-2" style={{ fontSize: 12, color: "var(--text)" }}>
                  {preview.length} rows ready to import
                  {preview.length > 5 && " (showing first 5)"}
                </p>
                <div
                  className="overflow-x-auto rounded-input"
                  style={{ border: "1px solid var(--border)", fontSize: 11 }}
                >
                  <table className="w-full">
                    <thead style={{ background: "var(--surface-2)" }}>
                      <tr>
                        <th className="text-left px-2 py-1 font-semibold eyebrow">Date</th>
                        <th className="text-left px-2 py-1 font-semibold eyebrow">Description</th>
                        <th className="text-right px-2 py-1 font-semibold eyebrow">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.slice(0, 5).map((row, i) => (
                        <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                          <td className="px-2 py-1 mono whitespace-nowrap" style={{ color: "var(--text-dim)" }}>{row.date}</td>
                          <td className="px-2 py-1 truncate max-w-[180px]" style={{ color: "var(--text)" }}>{row.description}</td>
                          <td className="px-2 py-1 text-right mono" style={{ color: "var(--text)" }}>
                            {row.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {importError && (
              <p className="mt-3" style={{ fontSize: 12, color: "var(--bad)" }}>{importError}</p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={handleClose}
                className="rounded-button transition-colors"
                style={{
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text)",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "6px 14px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={preview.length === 0}
                className="rounded-button transition-colors"
                style={{
                  background: "var(--accent)",
                  color: "var(--bg)",
                  border: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "6px 14px",
                  cursor: preview.length === 0 ? "not-allowed" : "pointer",
                  opacity: preview.length === 0 ? 0.4 : 1,
                }}
              >
                Import {preview.length > 0 ? `${preview.length} rows` : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
