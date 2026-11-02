import { o as __toESM } from "../_runtime.mjs";
import { a as amountInWords, g as formatQty, i as Button, l as computeBill, m as formatINR, n as generateInvoicePdf, p as formatDateDisplay, r as printedName, t as downloadBlob, v as invoiceFileName, x as getDb } from "./pdf-invoice-Do2ulir-.mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { s as Printer } from "../_libs/lucide-react.mjs";
import { d as LogoMark, n as Route } from "./router-6A73UUKC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bill._billId.print-DoEKZCww.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InvoiceSheet({ bill, settings }) {
	const { lines, totals } = computeBill(bill.lines, bill.gstEnabled, bill.gstMode);
	const gstOn = bill.gstEnabled;
	const title = gstOn ? "TAX INVOICE" : "INVOICE";
	const bal = Math.max(0, totals.grand - (bill.amountReceived || 0));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "print-sheet mx-auto w-[210mm] max-w-full bg-white p-8 text-black shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-start justify-between gap-4 border-b border-neutral-300 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [settings.logoDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: settings.logoDataUrl,
						alt: "",
						className: "size-14 rounded-full"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "size-14" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-lg font-semibold tracking-tight",
							children: settings.legalName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-sm text-xs text-neutral-600",
							children: settings.address
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-neutral-600",
							children: ["Phone: ", settings.phones]
						}),
						settings.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-neutral-600",
							children: settings.email
						}) : null
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold tracking-[0.14em] text-[#1e4d4a]",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-sm",
							children: bill.invoiceNo ?? "Unnumbered"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs",
							children: formatDateDisplay(bill.date)
						}),
						bill.fy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-neutral-600",
							children: ["FY ", bill.fy]
						}) : null
					]
				})]
			}),
			gstOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-neutral-600",
				children: [
					"GSTIN: ",
					settings.gstin || "—",
					" · Place of supply: ",
					bill.placeOfSupplyState,
					" (",
					bill.placeOfSupplyCode,
					") · Tax payable on reverse charge: No"
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-6 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.14em] text-neutral-500 uppercase",
						children: "Bill to"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: bill.customerName
					}),
					bill.address ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-neutral-600",
						children: bill.address
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-neutral-600",
						children: bill.phone
					}),
					bill.customerGstin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-neutral-600",
						children: ["GSTIN: ", bill.customerGstin]
					}) : null
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.14em] text-neutral-500 uppercase",
						children: "Vehicle"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono font-semibold",
						children: bill.vehicleNo || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-neutral-600",
						children: [
							bill.modelYear,
							bill.colour && `Colour ${bill.colour}`,
							bill.currentKm != null && `${bill.currentKm.toLocaleString("en-IN")} km`
						].filter(Boolean).join(" · ")
					}),
					bill.regDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-neutral-600",
						children: ["Reg ", formatDateDisplay(bill.regDate)]
					}) : null
				] })]
			}),
			bill.remarks ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs",
				children: ["Remarks: ", bill.remarks]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "mt-4 w-full text-left text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-[#1e4d4a] text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 font-medium",
							children: "#"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 font-medium",
							children: "Description"
						}),
						gstOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 font-medium",
							children: "HSN/SAC"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 text-right font-medium",
							children: "Qty"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 font-medium",
							children: "Unit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 text-right font-medium",
							children: "Rate"
						}),
						gstOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 text-right font-medium",
							children: "GST %"
						}) : null,
						gstOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 text-right font-medium",
							children: "Tax"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-1.5 text-right font-medium",
							children: "Amount"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-neutral-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-1.5",
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-2 py-1.5",
							children: [printedName(l.name), l.type === "labour" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 text-neutral-500",
								children: "(Labour)"
							}) : null]
						}),
						gstOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-1.5",
							children: l.hsnSac
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-1.5 text-right tabular",
							children: formatQty(l.qty)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-1.5",
							children: l.unit
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-1.5 text-right tabular",
							children: formatINR(l.rate)
						}),
						gstOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-1.5 text-right tabular",
							children: l.gstPct
						}) : null,
						gstOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-1.5 text-right tabular",
							children: formatINR(l.tax)
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-1.5 text-right tabular",
							children: formatINR(gstOn ? l.lineTotal : l.amount)
						})
					]
				}, l.id)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex justify-between gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "max-w-sm text-xs italic",
					children: ["INR ", amountInWords(totals.grand)]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "min-w-48 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between py-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Taxable" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular",
								children: formatINR(totals.taxable)
							})]
						}),
						gstOn && totals.igst > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between py-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "IGST" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular",
								children: formatINR(totals.igst)
							})]
						}) : null,
						gstOn && totals.cgst > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between py-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "CGST" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular",
								children: formatINR(totals.cgst)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between py-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "SGST" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular",
								children: formatINR(totals.sgst)
							})]
						})] }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex justify-between border-t border-neutral-300 pt-1 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Grand total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "tabular",
								children: ["Rs. ", formatINR(totals.grand)]
							})]
						})
					]
				})]
			}),
			bill.paymentMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-neutral-600",
				children: [
					"Payment ",
					bill.paymentMode.toUpperCase(),
					" · Received Rs. ",
					formatINR(bill.amountReceived || 0),
					" · Balance Rs. ",
					formatINR(bal)
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "mt-10 flex items-end justify-between text-xs text-neutral-600",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [bill.advisor ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Advisor: ", bill.advisor] }) : null, bill.mechanic ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Mechanic: ", bill.mechanic] }) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-40 border-t border-neutral-400 pt-1 text-right",
					children: "Authorised signatory"
				})]
			})
		]
	});
}
function PrintPage() {
	const { billId } = Route.useParams();
	const { autoprint } = Route.useSearch();
	const bill = useLiveQuery(() => getDb().bills.get(billId), [billId]);
	const settings = useLiveQuery(() => getDb().settings.get(1));
	(0, import_react.useEffect)(() => {
		if (!autoprint || !bill || !settings) return;
		const t = window.setTimeout(() => window.print(), 350);
		return () => window.clearTimeout(t);
	}, [
		autoprint,
		bill,
		settings
	]);
	if (!bill || !settings) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-8 text-sm text-muted",
		children: "Loading print sheet…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg py-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "no-print mx-auto mb-4 flex max-w-[210mm] flex-wrap items-center justify-between gap-2 px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/bill/$billId",
				params: { billId },
				className: "text-sm text-muted hover:text-fg",
				children: "← Back to bill"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: async () => {
						const blob = await generateInvoicePdf(bill, settings);
						const name = bill.invoiceSeq ? invoiceFileName(settings.invoicePrefix, bill.invoiceSeq) : "invoice.pdf";
						downloadBlob(blob, name);
					},
					children: "Download PDF"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => window.print(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {}), " Print"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvoiceSheet, {
			bill,
			settings
		})]
	});
}
//#endregion
export { PrintPage as component };
