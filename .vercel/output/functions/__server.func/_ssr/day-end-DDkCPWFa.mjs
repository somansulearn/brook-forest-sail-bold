import { o as __toESM } from "../_runtime.mjs";
import { T as todayISO, g as formatQty, i as Button, l as computeBill, m as formatINR, p as formatDateDisplay, t as downloadBlob, u as dayEndPath, w as nowISO, x as getDb } from "./pdf-invoice-Do2ulir-.mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
import { t as autoTable } from "../_libs/jspdf-autotable.mjs";
import { n as writeToBackupFolder } from "./fs-access-Cws59sC1.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as reorderOf, n as Label, s as stockStatus, t as Input } from "./label-D5uVcG4K.mjs";
import { t as Badge } from "./badge-zYY-St_P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/day-end-DDkCPWFa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_jspdf_node_min = require_jspdf_node_min();
async function generateDayEndPdf(dateISO, settings) {
	const db = getDb();
	const bills = await db.bills.toArray();
	const printed = bills.filter((b) => b.status === "printed" && b.date === dateISO);
	const saved = bills.filter((b) => b.status === "saved");
	const movements = (await db.stockMovements.toArray()).filter((m) => m.date === dateISO);
	const items = await db.stockItems.toArray();
	const itemById = new Map(items.map((i) => [i.id, i]));
	const doc = new import_jspdf_node_min.jsPDF({
		unit: "mm",
		format: "a4"
	});
	const pageW = doc.internal.pageSize.getWidth();
	const margin = 14;
	let y = 16;
	doc.setFont("helvetica", "bold");
	doc.setFontSize(14);
	doc.setTextColor(30, 77, 74);
	doc.text("Day-end report", margin, y);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	doc.setTextColor(26, 24, 20);
	doc.text(settings.legalName, pageW - margin, y, { align: "right" });
	y += 6;
	doc.setFontSize(10);
	doc.text(formatDateDisplay(dateISO), margin, y);
	doc.setFontSize(8);
	doc.setTextColor(107, 100, 89);
	doc.text(`${printed.length} printed  ·  ${saved.length} saved unprinted`, pageW - margin, y, { align: "right" });
	y += 8;
	let printedTotal = 0;
	const printedRows = printed.map((b) => {
		const { totals } = computeBill(b.lines, b.gstEnabled, b.gstMode);
		printedTotal += totals.grand;
		return [
			b.invoiceNo ?? "",
			b.customerName,
			b.vehicleNo,
			b.gstEnabled ? "Tax invoice" : "Invoice",
			formatINR(totals.grand)
		];
	});
	doc.setFont("helvetica", "bold");
	doc.setFontSize(10);
	doc.setTextColor(30, 77, 74);
	doc.text("Today's printed bills", margin, y);
	y += 2;
	autoTable(doc, {
		startY: y,
		head: [[
			"Invoice",
			"Customer",
			"Vehicle",
			"Type",
			"Amount"
		]],
		body: printedRows.length ? printedRows : [[
			"—",
			"No printed bills today",
			"",
			"",
			""
		]],
		foot: printedRows.length ? [[
			"",
			"",
			"",
			"Total",
			formatINR(printedTotal)
		]] : void 0,
		margin: {
			left: margin,
			right: margin
		},
		theme: "plain",
		headStyles: {
			fillColor: [
				30,
				77,
				74
			],
			textColor: 255,
			fontSize: 8
		},
		styles: {
			fontSize: 8,
			textColor: [
				26,
				24,
				20
			]
		},
		footStyles: {
			fontStyle: "bold",
			fontSize: 8
		},
		columnStyles: { 4: { halign: "right" } }
	});
	y = (doc.lastAutoTable?.finalY ?? y) + 10;
	doc.setFont("helvetica", "bold");
	doc.setFontSize(10);
	doc.setTextColor(30, 77, 74);
	doc.text("Saved but unprinted", margin, y);
	y += 2;
	autoTable(doc, {
		startY: y,
		head: [[
			"Date",
			"Customer",
			"Vehicle",
			"Lines"
		]],
		body: saved.length ? saved.map((b) => [
			formatDateDisplay(b.date),
			b.customerName,
			b.vehicleNo,
			String(b.lines.length)
		]) : [[
			"—",
			"None",
			"",
			""
		]],
		margin: {
			left: margin,
			right: margin
		},
		theme: "plain",
		headStyles: {
			fillColor: [
				30,
				77,
				74
			],
			textColor: 255,
			fontSize: 8
		},
		styles: { fontSize: 8 }
	});
	y = (doc.lastAutoTable?.finalY ?? y) + 10;
	const byItem = /* @__PURE__ */ new Map();
	for (const m of movements) {
		const row = byItem.get(m.itemId) ?? {
			inQty: 0,
			outQty: 0
		};
		if (m.type === "IN" || m.type === "VOID") row.inQty += m.qty;
		if (m.type === "OUT") row.outQty += m.qty;
		if (m.type === "ADJUST") {
			if (m.reason.includes("+")) row.inQty += m.qty;
			else row.outQty += m.qty;
		}
		byItem.set(m.itemId, row);
	}
	const stockRows = [...byItem.entries()].map(([id, io]) => {
		const item = itemById.get(id);
		const status = item ? stockStatus(item.qty, reorderOf(item, settings.defaultReorderQty)) : "";
		return [
			item?.displayName ?? id,
			item?.sku ?? "",
			formatQty(io.inQty),
			formatQty(io.outQty),
			formatQty(item?.qty ?? 0),
			status
		];
	});
	doc.setFont("helvetica", "bold");
	doc.setFontSize(10);
	doc.setTextColor(30, 77, 74);
	doc.text("Today's stock movement (closing qty)", margin, y);
	y += 2;
	autoTable(doc, {
		startY: y,
		head: [[
			"Item",
			"SKU",
			"IN",
			"OUT",
			"Closing",
			"Status"
		]],
		body: stockRows.length ? stockRows : [[
			"—",
			"No movement today",
			"",
			"",
			"",
			""
		]],
		margin: {
			left: margin,
			right: margin
		},
		theme: "plain",
		headStyles: {
			fillColor: [
				30,
				77,
				74
			],
			textColor: 255,
			fontSize: 8
		},
		styles: { fontSize: 8 },
		columnStyles: {
			2: { halign: "right" },
			3: { halign: "right" },
			4: { halign: "right" }
		}
	});
	return doc.output("blob");
}
function DayEndPage() {
	const [date, setDate] = (0, import_react.useState)(todayISO());
	const settings = useLiveQuery(() => getDb().settings.get(1));
	const bills = useLiveQuery(() => getDb().bills.toArray()) ?? [];
	const items = useLiveQuery(() => getDb().stockItems.toArray()) ?? [];
	const movements = useLiveQuery(() => getDb().stockMovements.toArray()) ?? [];
	const printed = bills.filter((b) => b.status === "printed" && b.date === date);
	const saved = bills.filter((b) => b.status === "saved");
	const todaysMoves = movements.filter((m) => m.date === date);
	const byItem = /* @__PURE__ */ new Map();
	for (const m of todaysMoves) {
		const row = byItem.get(m.itemId) ?? {
			inQty: 0,
			outQty: 0
		};
		if (m.type === "IN" || m.type === "VOID") row.inQty += m.qty;
		if (m.type === "OUT") row.outQty += m.qty;
		byItem.set(m.itemId, row);
	}
	const itemById = new Map(items.map((i) => [i.id, i]));
	const printedTotal = printed.reduce((sum, b) => {
		const { totals } = computeBill(b.lines, b.gstEnabled, b.gstMode);
		return sum + totals.grand;
	}, 0);
	async function persistPdf() {
		if (!settings) return false;
		const blob = await generateDayEndPdf(date, settings);
		const path = dayEndPath(date);
		await getDb().files.put({
			id: path,
			path,
			mime: "application/pdf",
			blob,
			createdAt: nowISO()
		});
		const wrote = await writeToBackupFolder(path.replace(/^\//, ""), blob);
		downloadBlob(blob, `${date}-day-end.pdf`);
		return wrote;
	}
	async function savePdf() {
		const wrote = await persistPdf();
		toast.success(wrote ? "Day-end PDF saved to folder and downloaded" : "Day-end PDF downloaded");
	}
	async function emailReport() {
		try {
			await persistPdf();
		} catch {
			toast.error("Could not write the PDF. Mail can still be opened.");
		}
		const to = settings?.dayEndEmail ?? "";
		const subject = encodeURIComponent(`Day-end ${date} — ${settings?.legalName ?? "Samriddhi Auto Works"}`);
		const body = encodeURIComponent(`Day-end report for ${date}.\nPrinted bills: ${printed.length}.\nSaved unprinted: ${saved.length}.\n\nThe PDF is kept in Workshop OS and Downloads. Attach it if the mail client cannot attach automatically.`);
		window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold tracking-tight",
					children: "Day-end"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Printed work, open jobs, and stock movement for the day."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: date,
								onChange: (e) => setDate(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => void savePdf(),
							children: "Save PDF"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => void emailReport(),
							children: "Email report"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-sm font-semibold",
						children: ["Printed bills — ", formatDateDisplay(date)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-border",
						children: printed.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "py-4 text-sm text-muted",
							children: "No printed bills this day."
						}) : printed.map((b) => {
							const { totals } = computeBill(b.lines, b.gstEnabled, b.gstMode);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between py-2.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/bill/$billId",
									params: { billId: b.id },
									className: "hover:text-primary",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono",
											children: b.invoiceNo
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-2",
											children: b.customerName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-2 text-muted",
											children: b.vehicleNo
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular",
									children: formatINR(totals.grand)
								})]
							}, b.id);
						})
					}),
					printed.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-right text-sm font-semibold tabular",
						children: ["Total ", formatINR(printedTotal)]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Saved but unprinted"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-border",
					children: saved.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "py-4 text-sm text-muted",
						children: "All jobs are printed."
					}) : saved.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between py-2.5 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/bill/$billId",
							params: { billId: b.id },
							className: "hover:text-primary",
							children: [b.customerName, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 text-muted",
								children: b.vehicleNo || "No vehicle"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: formatDateDisplay(b.date)
						})]
					}, b.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Stock IN / OUT / closing"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[520px] text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-xs tracking-wide text-muted uppercase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2",
									children: "Item"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "IN" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "OUT" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Closing" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: byItem.size === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "py-4 text-muted",
							children: "No stock movement this day."
						}) }) : [...byItem.entries()].map(([id, io]) => {
							const item = itemById.get(id);
							const st = item ? stockStatus(item.qty, reorderOf(item, settings?.defaultReorderQty ?? 5)) : "ok";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2",
										children: item ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/stock/$itemId",
											params: { itemId: id },
											className: "hover:text-primary",
											children: item.displayName
										}) : id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "tabular",
										children: formatQty(io.inQty)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "tabular",
										children: formatQty(io.outQty)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "tabular",
										children: formatQty(item?.qty ?? 0)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: st === "ok" ? "ok" : st === "low" ? "low" : "critical",
										children: st
									}) })
								]
							}, id);
						}) })]
					})
				})]
			})
		]
	});
}
//#endregion
export { DayEndPage as component };
