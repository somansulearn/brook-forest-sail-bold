import { T as todayISO, x as getDb } from "./pdf-invoice-Do2ulir-.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { a as reorderOf, s as stockStatus } from "./label-D5uVcG4K.mjs";
import { l as Package, n as Users, u as FileText } from "../_libs/lucide-react.mjs";
import { d as LogoMark } from "./router-6A73UUKC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cbjc3jjl.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const settings = useLiveQuery(() => getDb().settings.get(1));
	const items = useLiveQuery(() => getDb().stockItems.toArray()) ?? [];
	const bills = useLiveQuery(() => getDb().bills.toArray()) ?? [];
	const today = todayISO();
	const defaultReorder = settings?.defaultReorderQty ?? 5;
	const low = items.filter((i) => !i.archived).filter((i) => stockStatus(i.qty, reorderOf(i, defaultReorder)) !== "ok");
	const saved = bills.filter((b) => b.status === "saved");
	const printedToday = bills.filter((b) => b.status === "printed" && b.date === today);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-4",
					children: [settings?.logoDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: settings.logoDataUrl,
						alt: "",
						className: "size-16 rounded-full outline outline-1 -outline-offset-1 outline-fg/10"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "size-16" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-[0.18em] text-primary uppercase",
							children: "Local workshop ledger"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 text-3xl font-semibold tracking-tight",
							children: settings?.legalName ?? "Samriddhi Auto Works"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-xl text-sm text-muted",
							children: settings?.address
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/settings",
							className: "inline-flex min-h-11 items-center rounded-sm px-3 text-sm text-muted hover:text-fg",
							children: "Settings"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/day-end",
							className: "inline-flex min-h-11 items-center rounded-sm px-3 text-sm text-muted hover:text-fg",
							children: "Day-end"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/backup",
							className: "inline-flex min-h-11 items-center rounded-sm border border-border bg-surface px-4 text-sm font-medium shadow-[var(--shadow-border)]",
							children: "Backup now"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeTile, {
						to: "/stock",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, {}),
						title: "Stock",
						copy: "Parts, inward, ledger"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeTile, {
						to: "/customers",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {}),
						title: "Customers",
						copy: "Vehicles and job history"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeTile, {
						to: "/bill",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {}),
						title: "Bill",
						copy: "Job card and invoice",
						featured: true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						to: "/stock",
						search: { filter: "low" },
						label: "Low stock",
						value: low.length,
						tone: low.length ? "warn" : "ok"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						to: "/bills",
						search: { status: "saved" },
						label: "Open saved bills",
						value: saved.length,
						tone: saved.length ? "primary" : "ok"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						to: "/bills",
						search: {
							status: "printed",
							when: "today"
						},
						label: "Today's printed bills",
						value: printedToday.length,
						tone: "primary"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Needs attention"
					}), low.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "No low-stock parts."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-border",
						children: low.slice(0, 6).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between py-2.5 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/stock/$itemId",
								params: { itemId: i.id },
								className: "font-medium hover:text-primary",
								children: [i.displayName, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 font-mono text-xs text-muted",
									children: i.sku
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: i.qty <= 0 ? "tabular text-danger" : "tabular text-warn",
								children: [
									i.qty,
									" ",
									i.unit
								]
							})]
						}, i.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Open jobs"
					}), saved.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "No unprinted bills."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-border",
						children: saved.slice(0, 6).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between py-2.5 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/bill/$billId",
								params: { billId: b.id },
								className: "font-medium hover:text-primary",
								children: [b.customerName, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-xs text-muted",
									children: b.vehicleNo || "No vehicle"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted",
								children: [b.lines.length, " lines"]
							})]
						}, b.id))
					})]
				})]
			})
		]
	});
}
function HomeTile({ to, icon, title, copy, featured }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		search: to === "/bill" ? { phone: void 0 } : void 0,
		className: featured ? "flex min-h-32 flex-col justify-between rounded-xl bg-primary p-5 text-primary-fg shadow-[var(--shadow-border)]" : "flex min-h-32 flex-col justify-between rounded-xl bg-surface p-5 text-fg shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: featured ? "text-primary-fg/80 [&_svg]:size-6" : "text-primary [&_svg]:size-6",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-2xl font-semibold tracking-tight",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: featured ? "text-sm text-primary-fg/80" : "text-sm text-muted",
			children: copy
		})] })]
	});
}
function Chip({ to, search, label, value, tone }) {
	const color = tone === "warn" ? "text-warn" : tone === "ok" ? "text-ok" : "text-primary";
	if (to === "/stock") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/stock",
		search: {
			filter: search?.filter,
			q: search?.q
		},
		className: "inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `font-mono text-base font-semibold tabular ${color}`,
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: label
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/bills",
		search: {
			status: search?.status,
			when: search?.when
		},
		className: "inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `font-mono text-base font-semibold tabular ${color}`,
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: label
		})]
	});
}
//#endregion
export { Home as component };
