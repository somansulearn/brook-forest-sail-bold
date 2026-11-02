import { o as __toESM } from "../_runtime.mjs";
import { C as newId, i as Button, o as backupPath, p as formatDateDisplay, t as downloadBlob, w as nowISO, x as getDb } from "./pdf-invoice-Do2ulir-.mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as writeToBackupFolder } from "./fs-access-Cws59sC1.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_lib } from "../_libs/jszip+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/backup-nq3V_Cj5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
async function runBackup() {
	const db = getDb();
	const [settings, stockItems, stockMovements, customers, vehicles, bills, files] = await Promise.all([
		db.settings.toArray(),
		db.stockItems.toArray(),
		db.stockMovements.toArray(),
		db.customers.toArray(),
		db.vehicles.toArray(),
		db.bills.toArray(),
		db.files.toArray()
	]);
	const dump = {
		exportedAt: nowISO(),
		settings,
		stockItems,
		stockMovements,
		customers,
		vehicles,
		bills
	};
	const zip = new import_lib.default();
	zip.file("data/samriddhi.json", JSON.stringify(dump, null, 2));
	zip.file("README.txt", [
		"Samriddhi Workshop OS backup",
		`Exported: ${dump.exportedAt}`,
		"",
		"data/samriddhi.json is the source of truth (browser store export).",
		"invoices/ and reports/ hold generated PDFs.",
		"Restore is a v1 copy-keep: keep this zip next to the laptop."
	].join("\n"));
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
		createdAt: nowISO()
	});
	const usedFolder = await writeToBackupFolder(path.replace(/^\//, ""), blob);
	if (!usedFolder) downloadBlob(blob, `samriddhi-backup-${stamp}.zip`);
	return {
		path,
		usedFolder
	};
}
function BackupPage() {
	const files = useLiveQuery(() => getDb().files.toArray()) ?? [];
	const settings = useLiveQuery(() => getDb().settings.get(1));
	const [busy, setBusy] = (0, import_react.useState)(false);
	const sorted = [...files].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-semibold tracking-tight",
				children: "Backup"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Download a zip of the ledger, invoices, and day-end reports. Keep it on this laptop."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [
						settings?.backupFolderLabel ? `Remembered folder: ${settings.backupFolderLabel}` : "No folder chosen — the zip downloads to this computer.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/settings",
							className: "text-primary underline-offset-2 hover:underline",
							children: "Settings"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4",
					disabled: busy,
					onClick: async () => {
						setBusy(true);
						try {
							const res = await runBackup();
							toast.success(res.usedFolder ? "Backup written to the chosen folder" : "Backup zip downloaded");
						} catch (err) {
							toast.error(err instanceof Error ? err.message : "Backup failed");
						} finally {
							setBusy(false);
						}
					},
					children: busy ? "Preparing…" : "Backup now"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Stored files"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-border",
					children: sorted.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "py-4 text-sm text-muted",
						children: "No PDFs or zips yet. Print a bill or run backup."
					}) : sorted.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between py-2.5 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs",
							children: f.path
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-xs text-muted",
							children: formatDateDisplay(f.createdAt.slice(0, 10))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => downloadBlob(f.blob, f.path.split("/").pop() ?? "file"),
							children: "Download"
						})]
					}, f.id))
				})]
			})
		]
	});
}
//#endregion
export { BackupPage as component };
