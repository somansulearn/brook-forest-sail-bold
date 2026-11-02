import { o as __toESM } from "../_runtime.mjs";
import { t as Dexie } from "../_libs/dexie.mjs";
import { C as require_react, S as require_jsx_runtime, b as Slot } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
import { t as autoTable } from "../_libs/jspdf-autotable.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ids-CHL36CQo.js
var WorkshopDB = class extends Dexie {
	settings;
	stockItems;
	stockMovements;
	customers;
	vehicles;
	bills;
	files;
	constructor() {
		super("samriddhi-workshop-os");
		this.version(1).stores({
			settings: "id",
			stockItems: "id, sku, displayName, brand, supplier, archived",
			stockMovements: "id, itemId, type, date, billId, createdAt",
			customers: "id, phone, name",
			vehicles: "id, customerId, vehicleNo",
			bills: "id, status, date, invoiceNo, phone, vehicleNo, customerId, printedAt",
			files: "id, path, createdAt"
		});
	}
};
var _db = null;
function getDb() {
	if (typeof indexedDB === "undefined") throw new Error("IndexedDB is not available");
	if (!_db) _db = new WorkshopDB();
	return _db;
}
function isBrowserDb() {
	return typeof indexedDB !== "undefined";
}
function newId() {
	return crypto.randomUUID();
}
function todayISO(d = /* @__PURE__ */ new Date()) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function nowISO() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function padInvoice(n, width = 4) {
	return String(n).padStart(width, "0");
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/button-pGPHwJDh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
/** Indian financial year: 1 Apr – 31 Mar. Date is YYYY-MM-DD. */
function financialYear(dateISO) {
	const [yStr, mStr] = dateISO.split("-");
	const y = Number(yStr);
	const m = Number(mStr);
	if (!y || !m) {
		const now = /* @__PURE__ */ new Date();
		return financialYear(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`);
	}
	if (m >= 4) return `${y}-${String((y + 1) % 100).padStart(2, "0")}`;
	return `${y - 1}-${String(y % 100).padStart(2, "0")}`;
}
function formatInvoiceNo(prefix, seq) {
	return `${prefix.endsWith("/") ? prefix : `${prefix}/`}${padInvoice(seq)}`;
}
function invoiceFileName(prefix, seq) {
	return `${prefix.replace(/\/+$/, "") || "SAW"}-${padInvoice(seq)}.pdf`;
}
function invoicePath(dateISO, prefix, seq) {
	return `/invoices/${financialYear(dateISO)}/${invoiceFileName(prefix, seq)}`;
}
function dayEndPath(dateISO) {
	return `/reports/${dateISO}-day-end.pdf`;
}
function backupPath(timestamp) {
	return `/backups/${timestamp}.zip`;
}
function formatDateDisplay(dateISO) {
	if (!dateISO) return "";
	const [y, m, d] = dateISO.split("-").map(Number);
	if (!y || !m || !d) return dateISO;
	return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}
function round2(n) {
	return Math.round((n + Number.EPSILON) * 100) / 100;
}
function formatINR(n) {
	return n.toLocaleString("en-IN", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}
function formatQty(n) {
	if (Number.isInteger(n)) return String(n);
	return n.toLocaleString("en-IN", { maximumFractionDigits: 3 });
}
function profitPct(purchase, sale) {
	if (purchase <= 0) return null;
	return round2((sale - purchase) / purchase * 100);
}
function gstModeForCustomer(garageStateCode, customerGstin) {
	const code = customerGstin.trim().slice(0, 2);
	if (code && /^\d{2}$/.test(code) && code !== garageStateCode) return "inter";
	return "intra";
}
function computeLine(line, gstEnabled) {
	const amount = round2(line.qty * line.rate);
	const tax = gstEnabled ? round2(amount * (line.gstPct / 100)) : 0;
	const lineTotal = gstEnabled ? round2(amount + tax) : amount;
	return {
		...line,
		amount,
		tax,
		lineTotal
	};
}
function computeBill(lines, gstEnabled, mode) {
	const computed = lines.map((l) => computeLine(l, gstEnabled));
	const taxable = round2(computed.reduce((s, l) => s + l.amount, 0));
	const tax = round2(computed.reduce((s, l) => s + l.tax, 0));
	if (!gstEnabled) return {
		lines: computed,
		totals: {
			taxable,
			cgst: 0,
			sgst: 0,
			igst: 0,
			tax: 0,
			grand: taxable
		}
	};
	if (mode === "inter") return {
		lines: computed,
		totals: {
			taxable,
			cgst: 0,
			sgst: 0,
			igst: tax,
			tax,
			grand: round2(taxable + tax)
		}
	};
	const half = round2(tax / 2);
	return {
		lines: computed,
		totals: {
			taxable,
			cgst: half,
			sgst: round2(tax - half),
			igst: 0,
			tax,
			grand: round2(taxable + tax)
		}
	};
}
function defaultGstForType(type, settings) {
	return type === "labour" ? settings.defaultGstLabour : settings.defaultGstParts;
}
var ONES = [
	"",
	"One",
	"Two",
	"Three",
	"Four",
	"Five",
	"Six",
	"Seven",
	"Eight",
	"Nine",
	"Ten",
	"Eleven",
	"Twelve",
	"Thirteen",
	"Fourteen",
	"Fifteen",
	"Sixteen",
	"Seventeen",
	"Eighteen",
	"Nineteen"
];
var TENS = [
	"",
	"",
	"Twenty",
	"Thirty",
	"Forty",
	"Fifty",
	"Sixty",
	"Seventy",
	"Eighty",
	"Ninety"
];
function chunkToWords(n) {
	if (n === 0) return "";
	if (n < 20) return ONES[n] ?? "";
	if (n < 100) {
		const t = TENS[Math.floor(n / 10)] ?? "";
		const o = ONES[n % 10] ?? "";
		return o ? `${t} ${o}` : t;
	}
	const h = ONES[Math.floor(n / 100)] ?? "";
	const rest = chunkToWords(n % 100);
	return rest ? `${h} Hundred ${rest}` : `${h} Hundred`;
}
function indianIntToWords(n) {
	if (n === 0) return "Zero";
	const parts = [];
	const crore = Math.floor(n / 1e7);
	n %= 1e7;
	const lakh = Math.floor(n / 1e5);
	n %= 1e5;
	const thousand = Math.floor(n / 1e3);
	n %= 1e3;
	if (crore) parts.push(`${chunkToWords(crore)} Crore`);
	if (lakh) parts.push(`${chunkToWords(lakh)} Lakh`);
	if (thousand) parts.push(`${chunkToWords(thousand)} Thousand`);
	if (n) parts.push(chunkToWords(n));
	return parts.join(" ");
}
function amountInWords(amount) {
	const abs = Math.abs(round2(amount));
	const rupees = Math.floor(abs);
	const paise = Math.round((abs - rupees) * 100);
	const rupeePart = `${indianIntToWords(rupees)} Rupee${rupees === 1 ? "" : "s"}`;
	if (paise === 0) return `${rupeePart} Only`;
	return `${rupeePart} and ${indianIntToWords(paise)} Paise Only`;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-[opacity,transform,background-color,box-shadow] duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 min-h-11 px-4", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:bg-primary-hover shadow-[var(--shadow-border)]",
			secondary: "bg-surface text-fg shadow-[var(--shadow-border)] hover:bg-bg-elevated",
			outline: "border border-border bg-surface text-fg hover:bg-chip",
			ghost: "text-fg hover:bg-chip",
			danger: "bg-danger text-danger-fg hover:opacity-90",
			stamp: "border border-primary bg-transparent text-primary uppercase tracking-[0.12em] text-xs hover:bg-primary hover:text-primary-fg"
		},
		size: {
			default: "h-11",
			sm: "h-9 min-h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11 p-0"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/pdf-invoice-Do2ulir-.js
var import_jspdf_node_min = require_jspdf_node_min();
/** Printed bill name is the display name only — never SKU suffixes (MT, KG, KM). */
var SUFFIX = /(?:[\s\-_/]+(?:KG|MT|KM))+$/i;
function printedName(displayName) {
	return displayName.replace(SUFFIX, "").replace(/\s+/g, " ").trim();
}
var INK = [
	26,
	24,
	20
];
var TEAL = [
	30,
	77,
	74
];
var MUTED = [
	107,
	100,
	89
];
var RULE = [
	196,
	186,
	168
];
var PAPER = [
	255,
	252,
	247
];
async function generateInvoicePdf(bill, settings) {
	const doc = new import_jspdf_node_min.jsPDF({
		unit: "mm",
		format: "a4"
	});
	const pageW = doc.internal.pageSize.getWidth();
	const margin = 14;
	let y = 14;
	doc.setFillColor(...PAPER);
	doc.rect(0, 0, pageW, doc.internal.pageSize.getHeight(), "F");
	if (settings.logoDataUrl) try {
		doc.addImage(settings.logoDataUrl, "PNG", margin, y, 16, 16);
	} catch {}
	doc.setTextColor(...TEAL);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(15);
	doc.text(settings.legalName, margin + (settings.logoDataUrl ? 20 : 0), y + 6);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(8);
	doc.setTextColor(...MUTED);
	const leftMeta = [
		settings.address,
		`Phone: ${settings.phones}`,
		settings.email ? `Email: ${settings.email}` : ""
	].filter(Boolean);
	doc.text(leftMeta, margin + (settings.logoDataUrl ? 20 : 0), y + 11);
	const title = bill.gstEnabled ? "TAX INVOICE" : "INVOICE";
	doc.setFont("helvetica", "bold");
	doc.setFontSize(13);
	doc.setTextColor(...TEAL);
	doc.text(title, pageW - margin, y + 6, { align: "right" });
	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	doc.setTextColor(...INK);
	const invNo = bill.invoiceNo ?? "UNNUMBERED";
	doc.text(`Invoice No.  ${invNo}`, pageW - margin, y + 13, { align: "right" });
	doc.text(`Date  ${formatDateDisplay(bill.date)}`, pageW - margin, y + 18, { align: "right" });
	if (bill.fy) {
		doc.setFontSize(8);
		doc.setTextColor(...MUTED);
		doc.text(`FY ${bill.fy}`, pageW - margin, y + 23, { align: "right" });
	}
	y = 38;
	doc.setDrawColor(...RULE);
	doc.setLineWidth(.35);
	doc.line(margin, y, pageW - margin, y);
	y += 6;
	if (bill.gstEnabled) {
		doc.setFontSize(8);
		doc.setTextColor(...MUTED);
		doc.text(`GSTIN: ${settings.gstin || "—"}`, margin, y);
		doc.text(`Place of supply: ${bill.placeOfSupplyState} (${bill.placeOfSupplyCode})`, pageW / 2, y);
		y += 5;
		doc.text("Tax payable on reverse charge: No", margin, y);
		y += 6;
	}
	doc.setFont("helvetica", "bold");
	doc.setFontSize(8);
	doc.setTextColor(...TEAL);
	doc.text("BILL TO", margin, y);
	doc.text("VEHICLE", pageW / 2, y);
	y += 4.5;
	doc.setFont("helvetica", "bold");
	doc.setFontSize(10);
	doc.setTextColor(...INK);
	doc.text(bill.customerName || "—", margin, y);
	doc.text(bill.vehicleNo || "—", pageW / 2, y);
	y += 5;
	doc.setFont("helvetica", "normal");
	doc.setFontSize(8);
	doc.setTextColor(...MUTED);
	const billTo = [
		bill.address,
		bill.phone ? `Phone: ${bill.phone}` : "",
		bill.email ? `Email: ${bill.email}` : "",
		bill.customerGstin ? `GSTIN: ${bill.customerGstin}` : ""
	].filter(Boolean);
	const veh = [
		bill.modelYear,
		bill.colour ? `Colour: ${bill.colour}` : "",
		bill.regDate ? `Reg: ${formatDateDisplay(bill.regDate)}` : "",
		bill.currentKm != null ? `KM: ${bill.currentKm.toLocaleString("en-IN")}` : ""
	].filter(Boolean);
	doc.text(billTo.length ? billTo : ["—"], margin, y);
	doc.text(veh.length ? veh : ["—"], pageW / 2, y);
	y += Math.max(billTo.length, veh.length, 1) * 4 + 4;
	if (bill.remarks) {
		doc.setTextColor(...INK);
		doc.text(`Remarks: ${bill.remarks}`, margin, y);
		y += 6;
	}
	const { lines, totals } = computeBill(bill.lines, bill.gstEnabled, bill.gstMode);
	const gstOn = bill.gstEnabled;
	const head = gstOn ? [[
		"#",
		"Description",
		"HSN/SAC",
		"Qty",
		"Unit",
		"Rate",
		"GST %",
		"Tax",
		"Amount"
	]] : [[
		"#",
		"Description",
		"Qty",
		"Unit",
		"Rate",
		"Amount"
	]];
	const body = lines.map((l, i) => {
		const name = `${printedName(l.name)}${l.type === "labour" ? "  (Labour)" : ""}`;
		if (gstOn) return [
			String(i + 1),
			name,
			l.hsnSac || "",
			formatQty(l.qty),
			l.unit,
			formatINR(l.rate),
			String(l.gstPct),
			formatINR(l.tax),
			formatINR(l.lineTotal)
		];
		return [
			String(i + 1),
			name,
			formatQty(l.qty),
			l.unit,
			formatINR(l.rate),
			formatINR(l.amount)
		];
	});
	autoTable(doc, {
		startY: y,
		head,
		body,
		theme: "plain",
		margin: {
			left: margin,
			right: margin
		},
		styles: {
			font: "helvetica",
			fontSize: 8,
			textColor: [...INK],
			cellPadding: 1.6,
			overflow: "linebreak"
		},
		headStyles: {
			fillColor: [...TEAL],
			textColor: 255,
			fontStyle: "bold",
			fontSize: 7.5
		},
		columnStyles: gstOn ? {
			0: { cellWidth: 8 },
			3: { halign: "right" },
			5: { halign: "right" },
			6: { halign: "right" },
			7: { halign: "right" },
			8: { halign: "right" }
		} : {
			0: { cellWidth: 8 },
			2: { halign: "right" },
			4: { halign: "right" },
			5: { halign: "right" }
		},
		didParseCell: (data) => {
			if (data.section === "body" && data.row.index % 2 === 1) data.cell.styles.fillColor = [
				244,
				241,
				235
			];
		}
	});
	y = (doc.lastAutoTable?.finalY ?? y) + 8;
	const boxX = pageW - margin - 72;
	const rows = [["Taxable", formatINR(totals.taxable)]];
	if (gstOn && totals.igst > 0) rows.push(["IGST", formatINR(totals.igst)]);
	if (gstOn && totals.cgst > 0) {
		rows.push(["CGST", formatINR(totals.cgst)]);
		rows.push(["SGST", formatINR(totals.sgst)]);
	}
	rows.push(["Grand total", `Rs. ${formatINR(totals.grand)}`]);
	doc.setDrawColor(...RULE);
	doc.rect(boxX, y - 4, 72, rows.length * 6 + 4);
	rows.forEach(([label, val], i) => {
		const yy = y + i * 6;
		const last = i === rows.length - 1;
		doc.setFont("helvetica", last ? "bold" : "normal");
		doc.setFontSize(last ? 10 : 8);
		const color = last ? TEAL : INK;
		doc.setTextColor(color[0], color[1], color[2]);
		doc.text(label, boxX + 3, yy);
		doc.text(val, pageW - margin - 3, yy, { align: "right" });
	});
	const wordsY = y;
	doc.setFont("helvetica", "italic");
	doc.setFontSize(8);
	doc.setTextColor(...INK);
	const words = doc.splitTextToSize(`INR ${amountInWords(totals.grand)}`, 100);
	doc.text(words, margin, wordsY);
	y = Math.max(y + rows.length * 6 + 10, wordsY + words.length * 4 + 10);
	if (bill.paymentMode) {
		const bal = Math.max(0, totals.grand - (bill.amountReceived || 0));
		doc.setFont("helvetica", "normal");
		doc.setFontSize(8);
		doc.setTextColor(...MUTED);
		doc.text(`Payment: ${bill.paymentMode.toUpperCase()}   Received: Rs. ${formatINR(bill.amountReceived || 0)}   Balance: Rs. ${formatINR(bal)}`, margin, y);
		y += 8;
	}
	doc.setFont("helvetica", "normal");
	doc.setFontSize(8);
	doc.setTextColor(...MUTED);
	if (bill.advisor) doc.text(`Advisor: ${bill.advisor}`, margin, y);
	if (bill.mechanic) doc.text(`Mechanic: ${bill.mechanic}`, 84, y);
	y += 16;
	doc.setDrawColor(...RULE);
	doc.line(pageW - margin - 50, y, pageW - margin, y);
	doc.text("Authorised signatory", pageW - margin, y + 4, { align: "right" });
	y += 12;
	doc.setFontSize(7);
	doc.setTextColor(...MUTED);
	doc.text("This is a computer-generated invoice of Samriddhi Auto Works. Purchase rates are not shown.", margin, y);
	return doc.output("blob");
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
//#endregion
export { newId as C, isBrowserDb as S, todayISO as T, gstModeForCustomer as _, amountInWords as a, profitPct as b, cn as c, defaultGstForType as d, financialYear as f, formatQty as g, formatInvoiceNo as h, Button as i, computeBill as l, formatINR as m, generateInvoicePdf as n, backupPath as o, formatDateDisplay as p, printedName as r, buttonVariants as s, downloadBlob as t, dayEndPath as u, invoiceFileName as v, nowISO as w, getDb as x, invoicePath as y };
