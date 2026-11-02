import { o as __toESM } from "../_runtime.mjs";
import { i as Button, l as computeBill, m as formatINR, p as formatDateDisplay, x as getDb } from "./pdf-invoice-Do2ulir-.mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { p as saveCustomer } from "./textarea-DRnCtecN.mjs";
import { a as Route$3, l as CustomerDialog } from "./router-6A73UUKC.mjs";
import { t as Badge } from "./badge-zYY-St_P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers._customerId-DKute7P5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomerPage() {
	const { customerId } = Route$3.useParams();
	const customer = useLiveQuery(() => getDb().customers.get(customerId), [customerId]);
	const vehicles = useLiveQuery(() => getDb().vehicles.where("customerId").equals(customerId).toArray(), [customerId]) ?? [];
	const bills = useLiveQuery(() => getDb().bills.where("customerId").equals(customerId).toArray(), [customerId]) ?? [];
	const [edit, setEdit] = (0, import_react.useState)(false);
	if (!customer) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Customer not found."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/customers",
				className: "text-sm text-muted hover:text-fg",
				children: "← Customers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-semibold tracking-tight",
						children: customer.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [customer.phone, customer.gstin ? ` · ${customer.gstin}` : ""]
					}),
					customer.address ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: customer.address
					}) : null
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setEdit(true),
						children: "Edit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/bill",
							search: { phone: customer.phone },
							children: "New bill"
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [vehicles.map((v) => {
					const vBills = bills.filter((b) => b.vehicleNo === v.vehicleNo && b.status !== "cancelled");
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-mono text-lg font-semibold",
									children: v.vehicleNo
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: [
										v.modelYear,
										v.colour,
										v.lastKm != null ? `${v.lastKm.toLocaleString("en-IN")} km` : ""
									].filter(Boolean).join(" · ")
								})]
							}),
							v.registrationDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: ["Reg ", formatDateDisplay(v.registrationDate)]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillList, { bills: vBills })
						]
					}, v.id);
				}), (() => {
					const loose = bills.filter((b) => b.status !== "cancelled" && (!b.vehicleNo || !vehicles.some((v) => v.vehicleNo === b.vehicleNo)));
					if (!loose.length) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Other jobs"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillList, { bills: loose })]
					});
				})()]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerDialog, {
				open: edit,
				onOpenChange: setEdit,
				initial: customer,
				initialVehicles: vehicles,
				onSave: async (c, vs) => {
					const res = await saveCustomer(c, vs);
					if (!res.ok) toast.error(res.error);
					else {
						toast.success("Customer saved");
						setEdit(false);
					}
				}
			})
		]
	});
}
function BillList({ bills }) {
	if (bills.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-3 text-sm text-muted",
		children: "No bills for this vehicle."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-3 divide-y divide-border",
		children: bills.map((b) => {
			const { totals } = computeBill(b.lines, b.gstEnabled, b.gstMode);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/bill/$billId",
				params: { billId: b.id },
				className: "flex items-center justify-between py-2.5 text-sm hover:text-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: b.status === "printed" ? "primary" : "default",
					children: b.status === "printed" ? b.invoiceNo : "Saved"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-2",
					children: formatDateDisplay(b.date)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular",
					children: formatINR(totals.grand)
				})]
			}) }, b.id);
		})
	});
}
//#endregion
export { CustomerPage as component };
