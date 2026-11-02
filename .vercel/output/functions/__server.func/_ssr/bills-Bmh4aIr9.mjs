import { o as __toESM } from "../_runtime.mjs";
import { T as todayISO, i as Button, l as computeBill, m as formatINR, p as formatDateDisplay, x as getDb } from "./pdf-invoice-Do2ulir-.mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { u as Route$10 } from "./router-6A73UUKC.mjs";
import { t as Badge } from "./badge-zYY-St_P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bills-Bmh4aIr9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BillsPage() {
	const { status, when } = Route$10.useSearch();
	const bills = useLiveQuery(() => getDb().bills.toArray()) ?? [];
	const today = todayISO();
	const rows = (0, import_react.useMemo)(() => {
		return bills.filter((b) => b.status !== "cancelled" || status === "cancelled").filter((b) => status ? b.status === status : true).filter((b) => when === "today" ? b.date === today : true).sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : b.updatedAt.localeCompare(a.updatedAt));
	}, [
		bills,
		status,
		when,
		today
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold tracking-tight",
					children: "History"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Saved jobs and printed invoices."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/bill",
						search: { phone: void 0 },
						children: "New bill"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
						to: "/bills",
						search: {},
						active: !status,
						children: "All"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
						to: "/bills",
						search: { status: "saved" },
						active: status === "saved",
						children: "Saved"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
						to: "/bills",
						search: { status: "printed" },
						active: status === "printed" && when !== "today",
						children: "Printed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
						to: "/bills",
						search: {
							status: "printed",
							when: "today"
						},
						active: status === "printed" && when === "today",
						children: "Printed today"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[640px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-border text-xs tracking-wide text-muted uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Invoice"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Customer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Vehicle"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Amount"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 5,
						className: "px-4 py-10 text-center text-muted",
						children: "No bills in this view."
					}) }) : rows.map((b) => {
						const { totals } = computeBill(b.lines, b.gstEnabled, b.gstMode);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/70 last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: formatDateDisplay(b.date)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/bill/$billId",
										params: { billId: b.id },
										className: "hover:text-primary",
										children: b.status === "printed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono",
											children: b.invoiceNo
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Saved" })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: b.customerName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono text-xs",
									children: b.vehicleNo
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right tabular",
									children: formatINR(totals.grand)
								})
							]
						}, b.id);
					}) })]
				})
			})
		]
	});
}
function FilterChip({ to, search, active, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		search,
		className: active ? "inline-flex min-h-11 items-center rounded-full bg-primary px-4 text-sm text-primary-fg" : "inline-flex min-h-11 items-center rounded-full bg-chip px-4 text-sm text-fg",
		children
	});
}
//#endregion
export { BillsPage as component };
