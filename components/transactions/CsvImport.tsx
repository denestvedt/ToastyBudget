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
  const first = row[0]?.toLowerCase() ?? "";
  return (
    first === "date" ||
    first === "transaction date" ||
    first === "posted date" ||
    isNaN(new Date(row[0]).getTime())
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
        className="rounded-md bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600"
      >
        Import CSV
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Import Transactions</h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-3">
              CSV format: <code className="font-mono text-xs bg-gray-100 px-1 rounded dark:bg-gray-800">date, description, amount</code>
              <br />
              A header row is detected and skipped automatically.
            </p>

            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFile}
              className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-orange-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-orange-700 hover:file:bg-orange-100"
            />

            {parseError && (
              <p className="mt-3 text-sm text-red-600">{parseError}</p>
            )}

            {preview.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">
                  {preview.length} rows ready to import
                  {preview.length > 5 && " (showing first 5)"}
                </p>
                <div className="overflow-x-auto rounded border dark:border-gray-700 text-xs">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="text-left px-2 py-1 font-medium">Date</th>
                        <th className="text-left px-2 py-1 font-medium">Description</th>
                        <th className="text-right px-2 py-1 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.slice(0, 5).map((row, i) => (
                        <tr key={i} className="border-t dark:border-gray-700">
                          <td className="px-2 py-1 whitespace-nowrap">{row.date}</td>
                          <td className="px-2 py-1 truncate max-w-[180px]">{row.description}</td>
                          <td className="px-2 py-1 text-right tabular-nums">
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
              <p className="mt-3 text-sm text-red-600">{importError}</p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={handleClose}
                className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={preview.length === 0}
                className="rounded-md bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-40"
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
