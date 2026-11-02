import { o as __toESM } from "../_runtime.mjs";
import { C as newId, b as profitPct, i as Button, m as formatINR, x as getDb } from "./pdf-invoice-Do2ulir-.mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as reorderOf, n as Label, s as stockStatus, t as Input } from "./label-D5uVcG4K.mjs";
import { h as upsertStockItem, i as archiveStockItem } from "./textarea-DRnCtecN.mjs";
import { c as Route$6, f as Dialog, h as DialogTitle, m as DialogHeader, p as DialogContent } from "./router-6A73UUKC.mjs";
import { t as Badge } from "./badge-zYY-St_P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stock-DSBQ2Nmv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StockPage() {
	const { filter, q: qParam } = Route$6.useSearch();
	const navigate = useNavigate({ from: "/stock" });
	const settings = useLiveQuery(() => getDb().settings.get(1));
	const items = useLiveQuery(() => getDb().stockItems.toArray()) ?? [];
	const [q, setQ] = (0, import_react.useState)(qParam ?? "");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const defaultReorder = settings?.defaultReorderQty ?? 5;
	const rows = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		return items.filter((i) => !i.archived).filter((i) => {
			if (!needle) return true;
			return [
				i.displayName,
				i.sku,
				i.brand,
				i.supplier,
				i.productCode
			].join(" ").toLowerCase().includes(needle);
		}).filter((i) => {
			if (filter !== "low") return true;
			return stockStatus(i.qty, reorderOf(i, defaultReorder)) !== "ok";
		});
	}, [
		items,
		q,
		filter,
		defaultReorder
	]);
	function startNew() {
		setEditing({
			id: newId(),
			displayName: "",
			sku: "",
			brand: "",
			productCode: "",
			supplier: "",
			qty: 0,
			unit: "pcs",
			purchaseAmt: 0,
			saleAmt: 0,
			reorderQty: null,
			hsn: "",
			archived: 0
		});
		setOpen(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold tracking-tight",
					children: "Stock"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Same part from different sellers or brands is a separate row."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: startNew,
					children: "Add item"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search name, brand, SKU, supplier",
					className: "sm:max-w-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: filter === "low" ? "default" : "outline",
					onClick: () => navigate({ search: { filter: filter === "low" ? void 0 : "low" } }),
					children: "Low stock"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[980px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-border text-xs tracking-wide text-muted uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
							"S.No",
							"Display name",
							"SKU",
							"Brand",
							"Product code",
							"Supplier",
							"Qty",
							"Unit",
							"Purchase",
							"Sale",
							"Profit %",
							"Reorder",
							"Status"
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: h
						}, h)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 13,
						className: "px-3 py-10 text-center text-muted",
						children: "No items match."
					}) }) : rows.map((item, i) => {
						const reorder = reorderOf(item, defaultReorder);
						const status = stockStatus(item.qty, reorder);
						const profit = profitPct(item.purchaseAmt, item.saleAmt);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/70 last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5 tabular text-muted",
									children: i + 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/stock/$itemId",
										params: { itemId: item.id },
										className: "font-medium hover:text-primary",
										children: item.displayName
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5 font-mono text-xs",
									children: item.sku
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5",
									children: item.brand
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5 font-mono text-xs",
									children: item.productCode
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5",
									children: item.supplier
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: `px-3 py-2.5 tabular ${status === "critical" ? "font-semibold text-danger" : ""}`,
									children: item.qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5",
									children: item.unit
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5 tabular",
									children: formatINR(item.purchaseAmt)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5 tabular",
									children: formatINR(item.saleAmt)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5 tabular",
									children: profit == null ? "—" : `${profit.toFixed(1)}%`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5 tabular text-muted",
									children: item.reorderQty == null ? `${defaultReorder}*` : item.reorderQty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: status === "ok" ? "ok" : status === "low" ? "low" : "critical",
										children: status === "ok" ? "OK" : status === "low" ? "Low" : "Critical"
									})
								})
							]
						}, item.id);
					}) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: [
					"* Reorder blank uses the Settings default (",
					defaultReorder,
					")."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemDialog, {
				open,
				item: editing,
				onOpenChange: setOpen,
				onSave: async (row) => {
					const res = await upsertStockItem(row);
					if (!res.ok) toast.error(res.error);
					else {
						toast.success("Item saved");
						setOpen(false);
					}
				}
			})
		]
	});
}
function ItemDialog({ open, item, onOpenChange, onSave }) {
	const [form, setForm] = (0, import_react.useState)(item);
	const [reorderBlank, setReorderBlank] = (0, import_react.useState)(item?.reorderQty == null);
	const persisted = Boolean(item?.createdAt);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setForm(item);
		setReorderBlank(item?.reorderQty == null);
	}, [open, item?.id]);
	function set(key, value) {
		setForm((f) => ({
			...f ?? {},
			[key]: value
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90dvh] overflow-y-auto sm:max-w-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: item?.displayName ? "Edit item" : "New stock item" }) }), form && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3 sm:grid-cols-2",
				onSubmit: (e) => {
					e.preventDefault();
					onSave({
						id: form.id ?? newId(),
						displayName: form.displayName ?? "",
						sku: form.sku ?? "",
						brand: form.brand ?? "",
						productCode: form.productCode ?? "",
						supplier: form.supplier ?? "",
						qty: Number(form.qty ?? 0),
						unit: form.unit ?? "pcs",
						purchaseAmt: Number(form.purchaseAmt ?? 0),
						saleAmt: Number(form.saleAmt ?? 0),
						reorderQty: reorderBlank ? null : Number(form.reorderQty ?? 0),
						hsn: form.hsn ?? "",
						archived: form.archived ?? 0
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1 sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Display name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.displayName ?? "",
							onChange: (e) => set("displayName", e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "SKU" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.sku ?? "",
							onChange: (e) => set("sku", e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.brand ?? "",
							onChange: (e) => set("brand", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Product code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.productCode ?? "",
							onChange: (e) => set("productCode", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Supplier" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.supplier ?? "",
							onChange: (e) => set("supplier", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: persisted ? "Qty on hand (use Inward / Adjust)" : "Opening qty" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: form.qty ?? 0,
							disabled: persisted,
							onChange: (e) => set("qty", Number(e.target.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Unit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.unit ?? "pcs",
							onChange: (e) => set("unit", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Purchase amt" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: form.purchaseAmt ?? 0,
							onChange: (e) => set("purchaseAmt", Number(e.target.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sale amt" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: form.saleAmt ?? 0,
							onChange: (e) => set("saleAmt", Number(e.target.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "HSN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.hsn ?? "",
							onChange: (e) => set("hsn", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reorder (blank = settings default)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: reorderBlank ? "" : form.reorderQty ?? "",
							placeholder: "Default",
							onChange: (e) => {
								if (e.target.value === "") {
									setReorderBlank(true);
									set("reorderQty", null);
								} else {
									setReorderBlank(false);
									set("reorderQty", Number(e.target.value));
								}
							}
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 sm:col-span-2",
						children: [persisted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: async () => {
								const res = await archiveStockItem(form.id);
								if (!res.ok) toast.error(res.error);
								else {
									toast.success("Archived");
									onOpenChange(false);
								}
							},
							children: "Archive"
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Save item"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { ItemDialog, StockPage as component };
