import { getDb } from "./db";
import { DEFAULT_SETTINGS } from "./defaults";
import { financialYear, formatInvoiceNo, invoicePath } from "./fy";
import { newId, nowISO, todayISO } from "./ids";
import { gstModeForCustomer } from "./money";
import { generateInvoicePdf } from "./pdf-invoice";
import { committedByItem, findShortages, stockDiffs } from "./stock-engine";
import type {
  Bill,
  BillLine,
  Customer,
  PaymentMode,
  Settings,
  StockItem,
  Vehicle,
} from "./types";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; shortages?: ReturnType<typeof findShortages> };

export async function getSettings(): Promise<Settings> {
  const row = await getDb().settings.get(1);
  return row ?? DEFAULT_SETTINGS;
}

export async function saveSettings(patch: Partial<Settings>): Promise<ActionResult> {
  const db = getDb();
  const current = (await db.settings.get(1)) ?? { ...DEFAULT_SETTINGS };
  const next: Settings = { ...current, ...patch, id: 1 };
  if (next.nextInvoiceNumber < 1 || !Number.isFinite(next.nextInvoiceNumber)) {
    return { ok: false, error: "Next invoice number must be 1 or higher." };
  }
  next.advisors = (next.advisors ?? []).map((s) => s.trim()).filter(Boolean);
  next.mechanics = (next.mechanics ?? []).map((s) => s.trim()).filter(Boolean);
  await db.settings.put(next);
  return { ok: true, data: undefined };
}

export async function upsertStockItem(
  item: Omit<StockItem, "createdAt"> & { createdAt?: string },
): Promise<ActionResult<string>> {
  const db = getDb();
  const sku = item.sku.trim();
  if (!item.displayName.trim()) return { ok: false, error: "Display name is required." };
  if (!sku) return { ok: false, error: "SKU is required." };
  const clash = await db.stockItems.where("sku").equals(sku).first();
  if (clash && clash.id !== item.id) {
    return { ok: false, error: `SKU ${sku} already exists.` };
  }
  const existing = await db.stockItems.get(item.id);
  const row: StockItem = {
    ...item,
    displayName: item.displayName.trim(),
    sku,
    qty: existing ? existing.qty : item.qty,
    archived: item.archived ? 1 : 0,
    createdAt: existing?.createdAt ?? item.createdAt ?? nowISO(),
  };
  await db.transaction("rw", db.stockItems, db.stockMovements, async () => {
    await db.stockItems.put(row);
    if (!existing && item.qty > 0) {
      await db.stockMovements.add({
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
        createdAt: nowISO(),
      });
    }
  });
  return { ok: true, data: row.id };
}

export async function archiveStockItem(id: string): Promise<ActionResult> {
  const db = getDb();
  const item = await db.stockItems.get(id);
  if (!item) return { ok: false, error: "Item not found." };
  await db.stockItems.update(id, { archived: 1 });
  return { ok: true, data: undefined };
}

export async function inwardStock(input: {
  itemId: string;
  qty: number;
  date: string;
  supplier: string;
  purchaseRate: number;
  purchaseRef: string;
  updateItemRate: boolean;
}): Promise<ActionResult> {
  if (!(input.qty > 0)) return { ok: false, error: "Quantity must be greater than zero." };
  const db = getDb();
  const item = await db.stockItems.get(input.itemId);
  if (!item) return { ok: false, error: "Item not found." };
  await db.transaction("rw", db.stockItems, db.stockMovements, async () => {
    await db.stockItems.update(item.id, {
      qty: item.qty + input.qty,
      supplier: input.supplier.trim() || item.supplier,
      purchaseAmt: input.updateItemRate ? input.purchaseRate : item.purchaseAmt,
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
      createdAt: nowISO(),
    });
  });
  return { ok: true, data: undefined };
}

export async function adjustStock(input: {
  itemId: string;
  newQty: number;
  reason: string;
}): Promise<ActionResult> {
  const db = getDb();
  const item = await db.stockItems.get(input.itemId);
  if (!item) return { ok: false, error: "Item not found." };
  const delta = input.newQty - item.qty;
  if (delta === 0) return { ok: true, data: undefined };
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
      createdAt: nowISO(),
    });
  });
  return { ok: true, data: undefined };
}

export async function saveCustomer(
  customer: Omit<Customer, "createdAt"> & { createdAt?: string },
  vehicles: Omit<Vehicle, "customerId">[],
): Promise<ActionResult<string>> {
  if (!customer.name.trim()) return { ok: false, error: "Name is required." };
  if (!customer.phone.trim()) return { ok: false, error: "Phone is required." };
  const db = getDb();
  const phone = customer.phone.replace(/\s+/g, "");
  const existingByPhone = await db.customers.where("phone").equals(phone).first();
  const id = existingByPhone && existingByPhone.id !== customer.id ? existingByPhone.id : customer.id;
  const row: Customer = {
    ...customer,
    id,
    phone,
    name: customer.name.trim(),
    createdAt: (await db.customers.get(id))?.createdAt ?? customer.createdAt ?? nowISO(),
  };
  await db.transaction("rw", db.customers, db.vehicles, async () => {
    await db.customers.put(row);
    const current = await db.vehicles.where("customerId").equals(id).toArray();
    const keep = new Set(vehicles.map((v) => v.id));
    for (const old of current) {
      if (!keep.has(old.id)) await db.vehicles.delete(old.id);
    }
    for (const veh of vehicles) {
      if (!veh.vehicleNo.trim()) continue;
      await db.vehicles.put({
        ...veh,
        customerId: id,
        vehicleNo: veh.vehicleNo.trim().toUpperCase(),
      });
    }
  });
  return { ok: true, data: id };
}

export type BillDraft = {
  id: string;
  date: string;
  vehicleNo: string;
  colour: string;
  regDate: string;
  modelYear: string;
  currentKm: number | null;
  customerName: string;
  phone: string;
  address: string;
  email: string;
  customerGstin: string;
  advisor: string;
  mechanic: string;
  remarks: string;
  paymentMode: PaymentMode;
  amountReceived: number;
  lines: BillLine[];
  allowShortage: boolean;
};

export async function saveBill(draft: BillDraft): Promise<ActionResult<string>> {
  if (!draft.customerName.trim()) return { ok: false, error: "Customer name is required." };
  if (!draft.phone.trim()) return { ok: false, error: "Phone is required." };
  const lines = draft.lines
    .map((l) => ({ ...l, name: l.name.trim() }))
    .filter((l) => l.name);
  if (!lines.length) return { ok: false, error: "Add at least one line." };
  for (const line of lines) {
    if (!(line.qty > 0)) return { ok: false, error: `Quantity must be greater than zero on “${line.name}”.` };
  }

  const db = getDb();
  const settings = await getSettings();
  const existing = await db.bills.get(draft.id);
  if (existing?.status === "printed") {
    return { ok: false, error: "Printed bills are locked." };
  }
  if (existing?.status === "cancelled") {
    return { ok: false, error: "This bill was cancelled." };
  }

  const nextCommitted = committedByItem(lines);
  const prevCommitted = existing?.committedStock ?? {};
  const itemIds = Object.keys(nextCommitted);
  const items = await db.stockItems.bulkGet(itemIds);
  const itemsById = new Map<string, StockItem>();
  itemIds.forEach((id, i) => {
    const it = items[i];
    if (it) itemsById.set(id, it);
  });

  const shortages = findShortages(nextCommitted, prevCommitted, itemsById, lines);
  if (shortages.length && !draft.allowShortage) {
    return {
      ok: false,
      error: "Stock is short for one or more parts. Override with a reason to continue.",
      shortages,
    };
  }
  if (shortages.length && draft.allowShortage) {
    const missingReason = lines.some(
      (l) =>
        l.type === "part" &&
        l.stockItemId &&
        shortages.some((s) => s.itemId === l.stockItemId) &&
        !l.stockOverrideReason.trim(),
    );
    if (missingReason) {
      return { ok: false, error: "Give a reason for the stock override." };
    }
  }

  const gstMode = gstModeForCustomer(settings.stateCode, draft.customerGstin);
  const diffs = stockDiffs(prevCommitted, nextCommitted);
  const ts = nowISO();
  const phone = draft.phone.replace(/\s+/g, "");

  try {
    const billId = await db.transaction(
      "rw",
      db.bills,
      db.stockItems,
      db.stockMovements,
      db.customers,
      db.vehicles,
      async () => {
        const { customerId } = await upsertCustomerVehicleFromBill(draft, phone);

        for (const { itemId, delta } of diffs) {
          const item = await db.stockItems.get(itemId);
          if (!item) continue;
          await db.stockItems.update(itemId, { qty: item.qty - delta });
          if (delta > 0) {
            await db.stockMovements.add({
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
              createdAt: ts,
            });
          } else {
            await db.stockMovements.add({
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
              createdAt: ts,
            });
          }
        }

        const bill: Bill = {
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
          printedAt: null,
        };
        await db.bills.put(bill);
        return bill.id;
      },
    );
    return { ok: true, data: billId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not save bill." };
  }
}

async function upsertCustomerVehicleFromBill(
  draft: BillDraft,
  phone: string,
): Promise<{ customerId: string }> {
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
    createdAt: found?.createdAt ?? nowISO(),
  });
  const vNo = draft.vehicleNo.trim().toUpperCase();
  if (vNo) {
    const existingVeh =
      (await db.vehicles.where("vehicleNo").equals(vNo).first()) ??
      (await db.vehicles.where("customerId").equals(customerId).first());
    const vehId = existingVeh?.id ?? newId();
    const lastKm =
      draft.currentKm != null
        ? Math.max(draft.currentKm, existingVeh?.lastKm ?? 0)
        : existingVeh?.lastKm ?? null;
    await db.vehicles.put({
      id: vehId,
      customerId,
      vehicleNo: vNo,
      colour: draft.colour.trim() || existingVeh?.colour || "",
      registrationDate: draft.regDate || existingVeh?.registrationDate || "",
      modelYear: draft.modelYear.trim() || existingVeh?.modelYear || "",
      lastKm,
    });
  }
  return { customerId };
}

export async function cancelBill(billId: string): Promise<ActionResult> {
  const db = getDb();
  const bill = await db.bills.get(billId);
  if (!bill) return { ok: false, error: "Bill not found." };
  if (bill.status === "printed") return { ok: false, error: "Printed bills are locked." };
  if (bill.status === "cancelled") return { ok: true, data: undefined };
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
        createdAt: ts,
      });
    }
    await db.bills.update(billId, {
      status: "cancelled",
      committedStock: {},
      updatedAt: ts,
    });
  });
  return { ok: true, data: undefined };
}

export async function printBill(billId: string): Promise<ActionResult<{ invoiceNo: string; path: string }>> {
  const db = getDb();
  const bill = await db.bills.get(billId);
  if (!bill) return { ok: false, error: "Bill not found." };
  if (bill.status === "cancelled") return { ok: false, error: "Cancelled bills cannot be printed." };

  const settings = await getSettings();

  if (bill.status === "printed" && bill.invoiceNo && bill.invoiceSeq) {
    const path = invoicePath(bill.date, settings.invoicePrefix, bill.invoiceSeq);
    const blob = await generateInvoicePdf(bill, settings);
    await db.files.put({
      id: path,
      path,
      mime: "application/pdf",
      blob,
      createdAt: nowISO(),
    });
    return { ok: true, data: { invoiceNo: bill.invoiceNo, path } };
  }

  if (bill.status !== "saved") {
    return { ok: false, error: "Save the bill before printing." };
  }

  const seq = settings.nextInvoiceNumber;
  const invoiceNo = formatInvoiceNo(settings.invoicePrefix, seq);
  const fy = financialYear(bill.date);
  const path = invoicePath(bill.date, settings.invoicePrefix, seq);
  const ts = nowISO();

  const locked: Bill = {
    ...bill,
    status: "printed",
    invoiceNo,
    invoiceSeq: seq,
    fy,
    printedAt: ts,
    updatedAt: ts,
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
      createdAt: ts,
    });
  });

  return { ok: true, data: { invoiceNo, path } };
}

export function emptyBillDraft(): BillDraft {
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
    allowShortage: false,
  };
}

export function billToDraft(bill: Bill): BillDraft {
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
    allowShortage: bill.lines.some((l) => l.stockOverride),
  };
}

export function blankLine(partial?: Partial<BillLine>): BillLine {
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
    ...partial,
  };
}
