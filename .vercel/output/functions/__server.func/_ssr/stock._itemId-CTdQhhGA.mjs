import { o as __toESM } from "../_runtime.mjs";
import { T as todayISO, b as profitPct, i as Button, m as formatINR, p as formatDateDisplay, x as getDb } from "./pdf-invoice-Do2ulir-.mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as reorderOf, n as Label, s as stockStatus, t as Input } from "./label-D5uVcG4K.mjs";
import { h as upsertStockItem, r as adjustStock, u as inwardStock } from "./textarea-DRnCtecN.mjs";
import { f as Dialog, h as DialogTitle, i as Route$2, m as DialogHeader, p as DialogContent, s as ItemDialog } from "./router-6A73UUKC.mjs";
import { t as Badge } from "./badge-zYY-St_P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stock._itemId-CTdQhhGA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ItemPage() {
	const { itemId } = Route$2.useParams();
	const item = useLiveQuery(() => getDb().stockItems.get(itemId), [itemId]);
	const settings = useLiveQuery(() => getDb().settings.get(1));
	const movements = useLiveQuery(() => getDb().stockMovements.where("itemId").equals(itemId).reverse().sortBy("createdAt"), [itemId]) ?? [];
	const [edit, setEdit] = (0, import_react.useState)(false);
	const [inward, setInward] = (0, import_react.useState)(false);
	const [adjust, setAdjust] = (0, import_react.useState)(false);
	if (!item) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Item not found."
	});
	const defaultReorder = settings?.defaultReorderQty ?? 5;
	const status = stockStatus(item.qty, reorderOf(item, defaultReorder));
	const profit = profitPct(item.purchaseAmt, item.saleAmt);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/stock",
				className: "text-sm text-muted hover:text-fg",
				children: "← Stock"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold tracking-tight",
					children: item.displayName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-mono text-sm text-muted",
					children: [
						item.sku,
						item.brand ? ` · ${item.brand}` : "",
						item.productCode ? ` · ${item.productCode}` : ""
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setEdit(true),
							children: "Edit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setAdjust(true),
							children: "Adjust"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setInward(true),
							children: "Inward"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-2 gap-3 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "On hand",
						value: `${item.qty} ${item.unit}`,
						danger: item.qty <= 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Sale",
						value: formatINR(item.saleAmt)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Purchase",
						value: formatINR(item.purchaseAmt)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Profit %",
						value: profit == null ? "—" : `${profit.toFixed(1)}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Supplier",
						value: item.supplier || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "HSN",
						value: item.hsn || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Reorder",
						value: item.reorderQty == null ? `${defaultReorder} (default)` : String(item.reorderQty)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs tracking-wide text-muted uppercase",
						children: "Status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: status === "ok" ? "ok" : status === "low" ? "low" : "critical",
							children: status === "ok" ? "OK" : status === "low" ? "Low" : "Critical"
						})
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Movement ledger"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[640px] text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-xs tracking-wide text-muted uppercase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Qty" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Ref" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Reason" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: movements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "py-6 text-muted",
							children: "No movement yet."
						}) }) : movements.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2",
									children: formatDateDisplay(m.date)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: m.type === "OUT" ? "low" : m.type === "VOID" ? "critical" : "ok",
									children: m.type
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "tabular",
									children: m.qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "font-mono text-xs",
									children: m.invoiceNo || m.purchaseRef || m.billId?.slice(0, 8) || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-muted",
									children: m.reason
								})
							]
						}, m.id)) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemDialog, {
				open: edit,
				item,
				onOpenChange: setEdit,
				onSave: async (row) => {
					const res = await upsertStockItem(row);
					if (!res.ok) toast.error(res.error);
					else {
						toast.success("Item saved");
						setEdit(false);
					}
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InwardDialog, {
				item,
				open: inward,
				onOpenChange: setInward
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdjustDialog, {
				item,
				open: adjust,
				onOpenChange: setAdjust
			})
		]
	});
}
function Stat({ label, value, danger }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs tracking-wide text-muted uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: `mt-1 text-sm font-medium ${danger ? "text-danger" : ""}`,
		children: value
	})] });
}
function InwardDialog({ item, open, onOpenChange }) {
	const [qty, setQty] = (0, import_react.useState)(1);
	const [date, setDate] = (0, import_react.useState)(todayISO());
	const [supplier, setSupplier] = (0, import_react.useState)(item.supplier);
	const [rate, setRate] = (0, import_react.useState)(item.purchaseAmt);
	const [ref, setRef] = (0, import_react.useState)("");
	const [update, setUpdate] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setQty(1);
		setDate(todayISO());
		setSupplier(item.supplier);
		setRate(item.purchaseAmt);
		setRef("");
		setUpdate(true);
	}, [
		open,
		item.id,
		item.supplier,
		item.purchaseAmt
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Inward" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-3",
			onSubmit: async (e) => {
				e.preventDefault();
				const res = await inwardStock({
					itemId: item.id,
					qty,
					date,
					supplier,
					purchaseRate: rate,
					purchaseRef: ref,
					updateItemRate: update
				});
				if (!res.ok) toast.error(res.error);
				else {
					toast.success("Stock added");
					onOpenChange(false);
				}
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Qty" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: .001,
						step: "any",
						value: qty,
						onChange: (e) => setQty(Number(e.target.value))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: date,
						onChange: (e) => setDate(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Supplier" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: supplier,
						onChange: (e) => setSupplier(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Purchase rate" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: rate,
						onChange: (e) => setRate(Number(e.target.value))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Purchase ref" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: ref,
						onChange: (e) => setRef(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: update,
						onChange: (e) => setUpdate(e.target.checked)
					}), "Update item purchase amount"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Add inward"
				})
			]
		})] })
	});
}
function AdjustDialog({ item, open, onOpenChange }) {
	const [qty, setQty] = (0, import_react.useState)(item.qty);
	const [reason, setReason] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setQty(item.qty);
		setReason("");
	}, [
		open,
		item.id,
		item.qty
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Adjust count" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-3",
			onSubmit: async (e) => {
				e.preventDefault();
				const res = await adjustStock({
					itemId: item.id,
					newQty: qty,
					reason
				});
				if (!res.ok) toast.error(res.error);
				else {
					toast.success("Adjusted");
					onOpenChange(false);
				}
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "New qty" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: qty,
						onChange: (e) => setQty(Number(e.target.value))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reason" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: reason,
						onChange: (e) => setReason(e.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Save adjust"
				})
			]
		})] })
	});
}
//#endregion
export { ItemPage as component };
