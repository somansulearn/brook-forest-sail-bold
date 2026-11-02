import JSZip from "jszip";
import { getDb } from "./db";
import { backupPath } from "./fy";
import { newId, nowISO } from "./ids";
import { downloadBlob } from "./pdf-invoice";
import { writeToBackupFolder } from "./fs-access";

export async function runBackup(): Promise<{ path: string; usedFolder: boolean }> {
  const db = getDb();
  const [settings, stockItems, stockMovements, customers, vehicles, bills, files] =
    await Promise.all([
      db.settings.toArray(),
      db.stockItems.toArray(),
      db.stockMovements.toArray(),
      db.customers.toArray(),
      db.vehicles.toArray(),
      db.bills.toArray(),
      db.files.toArray(),
    ]);

  const dump = {
    exportedAt: nowISO(),
    settings,
    stockItems,
    stockMovements,
    customers,
    vehicles,
    bills,
  };

  const zip = new JSZip();
  zip.file("data/samriddhi.json", JSON.stringify(dump, null, 2));
  zip.file(
    "README.txt",
    [
      "Samriddhi Workshop OS backup",
      `Exported: ${dump.exportedAt}`,
      "",
      "data/samriddhi.json is the source of truth (browser store export).",
      "invoices/ and reports/ hold generated PDFs.",
      "Restore is a v1 copy-keep: keep this zip next to the laptop.",
    ].join("\n"),
  );

  for (const f of files) {
    const rel = f.path.replace(/^\//, "");
    zip.file(rel, f.blob);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const stamp = nowISO().replace(/[:.]/g, "-");
  const path = backupPath(stamp);
  await db.files.put({
    id: newId(),
    path,
    mime: "application/zip",
    blob,
    createdAt: nowISO(),
  });

  const usedFolder = await writeToBackupFolder(path.replace(/^\//, ""), blob);
  if (!usedFolder) {
    downloadBlob(blob, `samriddhi-backup-${stamp}.zip`);
  }
  return { path, usedFolder };
}
