import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { runBackup } from "@/lib/workshop/backup";
import { getDb } from "@/lib/workshop/db";
import { downloadBlob } from "@/lib/workshop/pdf-invoice";
import { formatDateDisplay } from "@/lib/workshop/fy";

export const Route = createFileRoute("/backup")({ component: BackupPage });

function BackupPage() {
  const files = useLiveQuery(() => getDb().files.toArray()) ?? [];
  const settings = useLiveQuery(() => getDb().settings.get(1));
  const [busy, setBusy] = useState(false);

  const sorted = [...files].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Backup</h1>
        <p className="mt-1 text-sm text-muted">
          Download a zip of the ledger, invoices, and day-end reports. Keep it on this laptop.
        </p>
      </header>
      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <p className="text-sm">
          {settings?.backupFolderLabel
            ? `Remembered folder: ${settings.backupFolderLabel}`
            : "No folder chosen — the zip downloads to this computer."}{" "}
          <Link to="/settings" className="text-primary underline-offset-2 hover:underline">
            Settings
          </Link>
        </p>
        <Button
          className="mt-4"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const res = await runBackup();
              toast.success(
                res.usedFolder
                  ? "Backup written to the chosen folder"
                  : "Backup zip downloaded",
              );
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Backup failed");
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Preparing…" : "Backup now"}
        </Button>
      </section>
      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-semibold">Stored files</h2>
        <ul className="mt-3 divide-y divide-border">
          {sorted.length === 0 ? (
            <li className="py-4 text-sm text-muted">No PDFs or zips yet. Print a bill or run backup.</li>
          ) : (
            sorted.map((f) => (
              <li key={f.id} className="flex items-center justify-between py-2.5 text-sm">
                <span>
                  <span className="font-mono text-xs">{f.path}</span>
                  <span className="ml-2 text-xs text-muted">
                    {formatDateDisplay(f.createdAt.slice(0, 10))}
                  </span>
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadBlob(f.blob, f.path.split("/").pop() ?? "file")}
                >
                  Download
                </Button>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
