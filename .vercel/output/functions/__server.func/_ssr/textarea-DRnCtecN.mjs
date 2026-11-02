import { o as __toESM } from "../_runtime.mjs";
import { C as newId, T as todayISO, _ as gstModeForCustomer, c as cn, f as financialYear, h as formatInvoiceNo, n as generateInvoicePdf, w as nowISO, x as getDb, y as invoicePath } from "./pdf-invoice-Do2ulir-.mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as findShortages, o as stockDiffs, r as committedByItem } from "./label-D5uVcG4K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/actions-B0M2J92Y.js
var DEFAULT_SETTINGS = {
	id: 1,
	legalName: "Samriddhi Auto Works",
	address: "Shop 14, Moti Nagar Industrial Area, New Delhi 110015",
	phones: "011-2541-8820, 98111-44567",
	email: "accounts@samriddhiautoworks.in",
	gstin: "07AABCS1234A1Z5",
	state: "Delhi",
	stateCode: "07",
	gstEnabled: true,
	invoicePrefix: "SAW/",
	nextInvoiceNumber: 1,
	defaultGstParts: 18,
	defaultGstLabour: 18,
	defaultReorderQty: 5,
	dayEndEmail: "accounts@samriddhiautoworks.in",
	advisors: ["Rajesh Kumar", "Amit Verma"],
	mechanics: [
		"Suresh Yadav",
		"Vikram Singh",
		"Ravi Pal"
	],
	logoDataUrl: "",
	backupFolderLabel: ""
};
function drawDefaultLogo() {
	if (typeof document === "undefined") return "";
	const canvas = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 256;
	const ctx = canvas.getContext("2d");
	if (!ctx) return "";
	ctx.clearRect(0, 0, 256, 256);
	ctx.beginPath();
	ctx.arc(128, 128, 118, 0, Math.PI * 2);
	ctx.fillStyle = "#1e4d4a";
	ctx.fill();
	ctx.beginPath();
	ctx.arc(128, 128, 108, 0, Math.PI * 2);
	ctx.fillStyle = "#f4f1eb";
	ctx.fill();
	ctx.beginPath();
	ctx.arc(128, 128, 98, 0, Math.PI * 2);
	ctx.fillStyle = "#1e4d4a";
	ctx.fill();
	ctx.fillStyle = "#f4f1eb";
	ctx.font = "700 54px 'IBM Plex Sans', 'Segoe UI', sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("SAW", 128, 118);
	ctx.font = "600 16px 'IBM Plex Sans', 'Segoe UI', sans-serif";
	ctx.letterSpacing = "0.18em";
	ctx.fillText("AUTO WORKS", 128, 162);
	return canvas.toDataURL("image/png");
}
async function getSettings() {
	return await getDb().settings.get(1) ?? DEFAULT_SETTINGS;
}
async function saveSettings(patch) {
	const db = getDb();
	const next = {
		...await db.settings.get(1) ?? { ...DEFAULT_SETTINGS },
		...patch,
		id: 1
	};
	if (next.nextInvoiceNumber < 1 || !Number.isFinite(next.nextInvoiceNumber)) return {
		ok: false,
		error: "Next invoice number must be 1 or higher."
	};
	next.advisors = (next.advisors ?? []).map((s) => s.trim()).filter(Boolean);
	next.mechanics = (next.mechanics ?? []).map((s) => s.trim()).filter(Boolean);
	await db.settings.put(next);
	return {
		ok: true,
		data: void 0
	};
}
async function upsertStockItem(item) {
	const db = getDb();
	const sku = item.sku.trim();
	if (!item.displayName.trim()) return {
		ok: false,
		error: "Display name is required."
	};
	if (!sku) return {
		ok: false,
		error: "SKU is required."
	};
	const clash = await db.stockItems.where("sku").equals(sku).first();
	if (clash && clash.id !== item.id) return {
		ok: false,
		error: `SKU ${sku} already exists.`
	};
	const existing = await db.stockItems.get(item.id);
	const row = {
		...item,
		displayName: item.displayName.trim(),
		sku,
		qty: existing ? existing.qty : item.qty,
		archived: item.archived ? 1 : 0,
		createdAt: existing?.createdAt ?? item.createdAt ?? nowISO()
	};
	await db.transaction("rw", db.stockItems, db.stockMovements, async () => {
		await db.stockItems.put(row);
		if (!existing && item.qty > 0) await db.stockMovements.add({
			id: newId(),
			itemId: row.id,
			type: "IN",
			qty: item.qty,
			date: todayISO(),
			supplier: item.supplier.trim(),
			purchaseRate: item.purchaseAmt,
			billId: null,
			invoiceNo: null,
			purchaseRef: "",
			reason: "Opening stock",
			createdAt: nowISO()
		});
	});
	return {
		ok: true,
		data: row.id
	};
}
async function archiveStockItem(id) {
	const db = getDb();
	if (!await db.stockItems.get(id)) return {
		ok: false,
		error: "Item not found."
	};
	await db.stockItems.update(id, { archived: 1 });
	return {
		ok: true,
		data: void 0
	};
}
async function inwardStock(input) {
	if (!(input.qty > 0)) return {
		ok: false,
		error: "Quantity must be greater than zero."
	};
	const db = getDb();
	const item = await db.stockItems.get(input.itemId);
	if (!item) return {
		ok: false,
		error: "Item not found."
	};
	await db.transaction("rw", db.stockItems, db.stockMovements, async () => {
		await db.stockItems.update(item.id, {
			qty: item.qty + input.qty,
			supplier: input.supplier.trim() || item.supplier,
			purchaseAmt: input.updateItemRate ? input.purchaseRate : item.purchaseAmt
		});
		await db.stockMovements.add({
			id: newId(),
			itemId: item.id,
			type: "IN",
			qty: input.qty,
			date: input.date || todayISO(),
			supplier: input.supplier.trim() || item.supplier,
			purchaseRate: input.purchaseRate,
			billId: null,
			invoiceNo: null,
			purchaseRef: input.purchaseRef.trim(),
			reason: "Inward",
			createdAt: nowISO()
		});
	});
	return {
		ok: true,
		data: void 0
	};
}
async function adjustStock(input) {
	const db = getDb();
	const item = await db.stockItems.get(input.itemId);
	if (!item) return {
		ok: false,
		error: "Item not found."
	};
	const delta = input.newQty - item.qty;
	if (delta === 0) return {
		ok: true,
		data: void 0
	};
	await db.transaction("rw", db.stockItems, db.stockMovements, async () => {
		await db.stockItems.update(item.id, { qty: input.newQty });
		await db.stockMovements.add({
			id: newId(),
			itemId: item.id,
			type: "ADJUST",
			qty: Math.abs(delta),
			date: todayISO(),
			supplier: "",
			purchaseRate: null,
			billId: null,
			invoiceNo: null,
			purchaseRef: "",
			reason: `${input.reason || "Count adjust"} (${delta > 0 ? "+" : ""}${delta})`,
			createdAt: nowISO()
		});
	});
	return {
		ok: true,
		data: void 0
	};
}
async function saveCustomer(customer, vehicles) {
	if (!customer.name.trim()) return {
		ok: false,
		error: "Name is required."
	};
	if (!customer.phone.trim()) return {
		ok: false,
		error: "Phone is required."
	};
	const db = getDb();
	const phone = customer.phone.replace(/\s+/g, "");
	const existingByPhone = await db.customers.where("phone").equals(phone).first();
	const id = existingByPhone && existingByPhone.id !== customer.id ? existingByPhone.id : customer.id;
	const row = {
		...customer,
		id,
		phone,
		name: customer.name.trim(),
		createdAt: (await db.customers.get(id))?.createdAt ?? customer.createdAt ?? nowISO()
	};
	await db.transaction("rw", db.customers, db.vehicles, async () => {
		await db.customers.put(row);
		const current = await db.vehicles.where("customerId").equals(id).toArray();
		const keep = new Set(vehicles.map((v) => v.id));
		for (const old of current) if (!keep.has(old.id)) await db.vehicles.delete(old.id);
		for (const veh of vehicles) {
			if (!veh.vehicleNo.trim()) continue;
			await db.vehicles.put({
				...veh,
				customerId: id,
				vehicleNo: veh.vehicleNo.trim().toUpperCase()
			});
		}
	});
	return {
		ok: true,
		data: id
	};
}
async function saveBill(draft) {
	if (!draft.customerName.trim()) return {
		ok: false,
		error: "Customer name is required."
	};
	if (!draft.phone.trim()) return {
		ok: false,
		error: "Phone is required."
	};
	const lines = draft.lines.map((l) => ({
		...l,
		name: l.name.trim()
	})).filter((l) => l.name);
	if (!lines.length) return {
		ok: false,
		error: "Add at least one line."
	};
	for (const line of lines) if (!(line.qty > 0)) return {
		ok: false,
		error: `Quantity must be greater than zero on “${line.name}”.`
	};
	const db = getDb();
	const settings = await getSettings();
	const existing = await db.bills.get(draft.id);
	if (existing?.status === "printed") return {
		ok: false,
		error: "Printed bills are locked."
	};
	if (existing?.status === "cancelled") return {
		ok: false,
		error: "This bill was cancelled."
	};
	const nextCommitted = committedByItem(lines);
	const prevCommitted = existing?.committedStock ?? {};
	const itemIds = Object.keys(nextCommitted);
	const items = await db.stockItems.bulkGet(itemIds);
	const itemsById = /* @__PURE__ */ new Map();
	itemIds.forEach((id, i) => {
		const it = items[i];
		if (it) itemsById.set(id, it);
	});
	const shortages = findShortages(nextCommitted, prevCommitted, itemsById, lines);
	if (shortages.length && !draft.allowShortage) return {
		ok: false,
		error: "Stock is short for one or more parts. Override with a reason to continue.",
		shortages
	};
	if (shortages.length && draft.allowShortage) {
		if (lines.some((l) => l.type === "part" && l.stockItemId && shortages.some((s) => s.itemId === l.stockItemId) && !l.stockOverrideReason.trim())) return {
			ok: false,
			error: "Give a reason for the stock override."
		};
	}
	const gstMode = gstModeForCustomer(settings.stateCode, draft.customerGstin);
	const diffs = stockDiffs(prevCommitted, nextCommitted);
	const ts = nowISO();
	const phone = draft.phone.replace(/\s+/g, "");
	try {
		return {
			ok: true,
			data: await db.transaction("rw", db.bills, db.stockItems, db.stockMovements, db.customers, db.vehicles, async () => {
				const { customerId } = await upsertCustomerVehicleFromBill(draft, phone);
				for (const { itemId, delta } of diffs) {
					const item = await db.stockItems.get(itemId);
					if (!item) continue;
					await db.stockItems.update(itemId, { qty: item.qty - delta });
					if (delta > 0) await db.stockMovements.add({
						id: newId(),
						itemId,
						type: "OUT",
						qty: delta,
						date: draft.date,
						supplier: "",
						purchaseRate: null,
						billId: draft.id,
						invoiceNo: existing?.invoiceNo ?? null,
						purchaseRef: "",
						reason: existing ? "Bill edit (additional)" : "Bill save",
						createdAt: ts
					});
					else await db.stockMovements.add({
						id: newId(),
						itemId,
						type: "IN",
						qty: -delta,
						date: draft.date,
						supplier: "",
						purchaseRate: null,
						billId: draft.id,
						invoiceNo: existing?.invoiceNo ?? null,
						purchaseRef: "",
						reason: "Bill edit (return)",
						createdAt: ts
					});
				}
				const bill = {
					id: draft.id,
					status: "saved",
					date: draft.date,
					invoiceNo: null,
					invoiceSeq: null,
					fy: null,
					vehicleNo: draft.vehicleNo.trim().toUpperCase(),
					colour: draft.colour.trim(),
					regDate: draft.regDate,
					modelYear: draft.modelYear.trim(),
					currentKm: draft.currentKm,
					customerId,
					customerName: draft.customerName.trim(),
					phone,
					address: draft.address.trim(),
					email: draft.email.trim(),
					customerGstin: draft.customerGstin.trim().toUpperCase(),
					advisor: draft.advisor.trim(),
					mechanic: draft.mechanic.trim(),
					remarks: draft.remarks.trim(),
					gstEnabled: settings.gstEnabled,
					placeOfSupplyState: settings.state,
					placeOfSupplyCode: settings.stateCode,
					gstMode,
					paymentMode: draft.paymentMode,
					amountReceived: draft.amountReceived || 0,
					lines,
					committedStock: nextCommitted,
					createdAt: existing?.createdAt ?? ts,
					updatedAt: ts,
					printedAt: null
				};
				await db.bills.put(bill);
				return bill.id;
			})
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Could not save bill."
		};
	}
}
async function upsertCustomerVehicleFromBill(draft, phone) {
	const db = getDb();
	const found = await db.customers.where("phone").equals(phone).first();
	const customerId = found?.id ?? newId();
	await db.customers.put({
		id: customerId,
		name: draft.customerName.trim(),
		phone,
		address: draft.address.trim(),
		email: draft.email.trim(),
		gstin: draft.customerGstin.trim().toUpperCase(),
		createdAt: found?.createdAt ?? nowISO()
	});
	const vNo = draft.vehicleNo.trim().toUpperCase();
	if (vNo) {
		const existingVeh = await db.vehicles.where("vehicleNo").equals(vNo).first() ?? await db.vehicles.where("customerId").equals(customerId).first();
		const vehId = existingVeh?.id ?? newId();
		const lastKm = draft.currentKm != null ? Math.max(draft.currentKm, existingVeh?.lastKm ?? 0) : existingVeh?.lastKm ?? null;
		await db.vehicles.put({
			id: vehId,
			customerId,
			vehicleNo: vNo,
			colour: draft.colour.trim() || existingVeh?.colour || "",
			registrationDate: draft.regDate || existingVeh?.registrationDate || "",
			modelYear: draft.modelYear.trim() || existingVeh?.modelYear || "",
			lastKm
		});
	}
	return { customerId };
}
async function cancelBill(billId) {
	const db = getDb();
	const bill = await db.bills.get(billId);
	if (!bill) return {
		ok: false,
		error: "Bill not found."
	};
	if (bill.status === "printed") return {
		ok: false,
		error: "Printed bills are locked."
	};
	if (bill.status === "cancelled") return {
		ok: true,
		data: void 0
	};
	const ts = nowISO();
	await db.transaction("rw", db.bills, db.stockItems, db.stockMovements, async () => {
		for (const [itemId, qty] of Object.entries(bill.committedStock)) {
			if (!(qty > 0)) continue;
			const item = await db.stockItems.get(itemId);
			if (item) await db.stockItems.update(itemId, { qty: item.qty + qty });
			await db.stockMovements.add({
				id: newId(),
				itemId,
				type: "VOID",
				qty,
				date: todayISO(),
				supplier: "",
				purchaseRate: null,
				billId: bill.id,
				invoiceNo: null,
				purchaseRef: "",
				reason: "Cancelled unprinted bill",
				createdAt: ts
			});
		}
		await db.bills.update(billId, {
			status: "cancelled",
			committedStock: {},
			updatedAt: ts
		});
	});
	return {
		ok: true,
		data: void 0
	};
}
async function printBill(billId) {
	const db = getDb();
	const bill = await db.bills.get(billId);
	if (!bill) return {
		ok: false,
		error: "Bill not found."
	};
	if (bill.status === "cancelled") return {
		ok: false,
		error: "Cancelled bills cannot be printed."
	};
	const settings = await getSettings();
	if (bill.status === "printed" && bill.invoiceNo && bill.invoiceSeq) {
		const path = invoicePath(bill.date, settings.invoicePrefix, bill.invoiceSeq);
		const blob = await generateInvoicePdf(bill, settings);
		await db.files.put({
			id: path,
			path,
			mime: "application/pdf",
			blob,
			createdAt: nowISO()
		});
		return {
			ok: true,
			data: {
				invoiceNo: bill.invoiceNo,
				path
			}
		};
	}
	if (bill.status !== "saved") return {
		ok: false,
		error: "Save the bill before printing."
	};
	const seq = settings.nextInvoiceNumber;
	const invoiceNo = formatInvoiceNo(settings.invoicePrefix, seq);
	const fy = financialYear(bill.date);
	const path = invoicePath(bill.date, settings.invoicePrefix, seq);
	const ts = nowISO();
	const locked = {
		...bill,
		status: "printed",
		invoiceNo,
		invoiceSeq: seq,
		fy,
		printedAt: ts,
		updatedAt: ts
	};
	const blob = await generateInvoicePdf(locked, settings);
	await db.transaction("rw", db.bills, db.settings, db.files, async () => {
		await db.bills.put(locked);
		await db.settings.update(1, { nextInvoiceNumber: seq + 1 });
		await db.files.put({
			id: path,
			path,
			mime: "application/pdf",
			blob,
			createdAt: ts
		});
	});
	return {
		ok: true,
		data: {
			invoiceNo,
			path
		}
	};
}
function emptyBillDraft() {
	return {
		id: newId(),
		date: todayISO(),
		vehicleNo: "",
		colour: "",
		regDate: "",
		modelYear: "",
		currentKm: null,
		customerName: "",
		phone: "",
		address: "",
		email: "",
		customerGstin: "",
		advisor: "",
		mechanic: "",
		remarks: "",
		paymentMode: "",
		amountReceived: 0,
		lines: [],
		allowShortage: false
	};
}
function billToDraft(bill) {
	return {
		id: bill.id,
		date: bill.date,
		vehicleNo: bill.vehicleNo,
		colour: bill.colour,
		regDate: bill.regDate,
		modelYear: bill.modelYear,
		currentKm: bill.currentKm,
		customerName: bill.customerName,
		phone: bill.phone,
		address: bill.address,
		email: bill.email,
		customerGstin: bill.customerGstin,
		advisor: bill.advisor,
		mechanic: bill.mechanic,
		remarks: bill.remarks,
		paymentMode: bill.paymentMode,
		amountReceived: bill.amountReceived,
		lines: bill.lines.map((l) => ({ ...l })),
		allowShortage: bill.lines.some((l) => l.stockOverride)
	};
}
function blankLine(partial) {
	return {
		id: newId(),
		name: "",
		type: "part",
		stockItemId: null,
		hsnSac: "",
		qty: 1,
		unit: "pcs",
		rate: 0,
		gstPct: 18,
		stockOverride: false,
		stockOverrideReason: "",
		...partial
	};
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/textarea-DRnCtecN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	className: cn("flex min-h-24 w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-subtle disabled:opacity-50", className),
	ref,
	...props
}));
Textarea.displayName = "Textarea";
//#endregion
export { billToDraft as a, drawDefaultLogo as c, printBill as d, saveBill as f, upsertStockItem as h, archiveStockItem as i, emptyBillDraft as l, saveSettings as m, DEFAULT_SETTINGS as n, blankLine as o, saveCustomer as p, adjustStock as r, cancelBill as s, Textarea as t, inwardStock as u };
