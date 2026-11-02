import { DEFAULT_SETTINGS, drawDefaultLogo } from "./defaults";
import { getDb } from "./db";
import { financialYear } from "./fy";
import { formatInvoiceNo } from "./fy";
import { gstModeForCustomer } from "./money";
import { committedByItem } from "./stock-engine";
import { newId, nowISO, todayISO } from "./ids";
import type { Bill, BillLine, Customer, Settings, StockItem, StockMovement, Vehicle } from "./types";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return todayISO(d);
}

export async function seedIfEmpty(): Promise<void> {
  const db = getDb();
  const existing = await db.settings.get(1);
  if (existing) return;

  const logo = drawDefaultLogo();
  const settings: Settings = {
    ...DEFAULT_SETTINGS,
    logoDataUrl: logo,
    nextInvoiceNumber: 8,
  };

  const items: StockItem[] = [
    stock("st-of-kg", "Oil Filter", "OF-KG", "Bosch", "OF-4506", "Kiran Gears", 14, "pcs", 185, 320, "8421"),
    stock("st-of-mt", "Oil Filter", "OF-MT", "Mann", "W 712/75", "Mohan Traders", 3, "pcs", 210, 360, "8421"),
    stock("st-of-km", "Oil Filter", "OF-KM", "Fleetguard", "LF16035", "Krishna Motors", 0, "pcs", 160, 280, "8421"),
    stock("st-af", "Air Filter", "AF-01", "Bosch", "F026400221", "Kiran Gears", 8, "pcs", 240, 420, "8421"),
    stock("st-cf", "Cabin Filter", "CF-01", "Mann", "CUK 2939", "Mohan Traders", 6, "pcs", 310, 540, "8421"),
    stock("st-oil", "Engine Oil 5W-30", "EO-5W30", "Castrol", "MAGNATEC 4L", "Kiran Gears", 22, "ltr", 420, 680, "2710"),
    stock("st-cool", "Coolant", "CL-01", "Prestone", "PS-1L", "Mohan Traders", 11, "ltr", 95, 180, "3820"),
    stock("st-bp-f", "Brake Pad Front", "BP-F", "Brembo", "P 83 072", "Krishna Motors", 4, "set", 980, 1650, "8708"),
    stock("st-bp-r", "Brake Pad Rear", "BP-R", "Brembo", "P 83 073", "Krishna Motors", 5, "set", 860, 1480, "8708"),
    stock("st-sp", "Spark Plug", "SP-01", "NGK", "BKR6E", "Kiran Gears", 36, "pcs", 85, 160, "8511"),
    stock("st-wiper", "Wiper Blade", "WB-22", "Bosch", "AeroTwin 22", "Mohan Traders", 9, "pcs", 220, 390, "8512"),
    stock("st-batt", "Battery 12V 35Ah", "BAT-35", "Exide", "XP800", "Krishna Motors", 2, "pcs", 3850, 5200, "8507"),
    stock("st-clutch", "Clutch Plate", "CLP-01", "Valeo", "826222", "Kiran Gears", 3, "pcs", 1450, 2400, "8708"),
    stock("st-belt", "Timing Belt", "TB-01", "Gates", "TCK305", "Mohan Traders", 2, "pcs", 1180, 1980, "4010"),
    stock("st-plug-w", "Glow Plug", "GP-01", "Bosch", "0250203001", "Kiran Gears", 7, "pcs", 340, 560, "8511"),
  ];

  const customers: Customer[] = [
    {
      id: "cu-1",
      name: "Ankit Sharma",
      phone: "9810011122",
      address: "B-12, Rajouri Garden, New Delhi 110027",
      email: "ankit.sharma@email.com",
      gstin: "",
      createdAt: nowISO(),
    },
    {
      id: "cu-2",
      name: "Neha Gupta",
      phone: "9876543210",
      address: "14, Sector 15, Dwarka, New Delhi 110078",
      email: "neha.gupta@email.com",
      gstin: "",
      createdAt: nowISO(),
    },
    {
      id: "cu-3",
      name: "Capital Fleet Services",
      phone: "01143322110",
      address: "Okhla Phase II, New Delhi 110020",
      email: "accounts@capitalfleet.in",
      gstin: "07AADCC9988B1Z2",
      createdAt: nowISO(),
    },
    {
      id: "cu-4",
      name: "Rohit Mehra",
      phone: "9999900011",
      address: "House 8, Punjabi Bagh West, New Delhi 110026",
      email: "",
      gstin: "",
      createdAt: nowISO(),
    },
    {
      id: "cu-5",
      name: "Sana Qureshi",
      phone: "9821004455",
      address: "Jama Masjid Road, New Delhi 110006",
      email: "sana.q@email.com",
      gstin: "",
      createdAt: nowISO(),
    },
  ];

  const vehicles: Vehicle[] = [
    v("vh-1", "cu-1", "DL3CAB4412", "White", "2019-06-12", "Honda City 2019", 45280),
    v("vh-2", "cu-1", "DL8CAF2291", "Grey", "2022-01-20", "Honda Amaze 2022", 18440),
    v("vh-3", "cu-2", "DL4CAF7788", "Red", "2018-11-04", "Maruti Swift 2018", 61020),
    v("vh-4", "cu-3", "DL1LAA1002", "White", "2021-03-15", "Toyota Innova Crysta 2021", 88210),
    v("vh-5", "cu-3", "DL1LAA1003", "Silver", "2020-08-09", "Hyundai Creta 2020", 54110),
    v("vh-6", "cu-4", "DL9CAC3300", "Blue", "2016-02-28", "Hyundai i20 2016", 97400),
    v("vh-7", "cu-5", "DL2CAG8190", "Black", "2023-05-18", "Tata Nexon 2023", 12150),
  ];

  const t0 = todayISO();
  const t1 = daysAgo(1);
  const t3 = daysAgo(3);
  const t8 = daysAgo(8);

  const bills: Bill[] = [
    printedBill({
      id: "bl-1",
      seq: 1,
      date: t8,
      customer: customers[0]!,
      vehicle: vehicles[0]!,
      km: 44800,
      advisor: "Rajesh Kumar",
      mechanic: "Suresh Yadav",
      remarks: "First service after purchase of used filter lot.",
      settings,
      lines: [
        line("Oil Filter", "part", "st-of-kg", "pcs", 1, 320, 18, "8421"),
        line("Engine Oil 5W-30", "part", "st-oil", "ltr", 4, 680, 18, "2710"),
        line("Engine oil change", "labour", null, "job", 1, 450, 18, "998729"),
      ],
    }),
    printedBill({
      id: "bl-2",
      seq: 2,
      date: t3,
      customer: customers[2]!,
      vehicle: vehicles[3]!,
      km: 87900,
      advisor: "Amit Verma",
      mechanic: "Vikram Singh",
      remarks: "Fleet vehicle — brake noise reported.",
      settings,
      lines: [
        line("Brake Pad Front", "part", "st-bp-f", "set", 1, 1650, 18, "8708"),
        line("Brake Pad Rear", "part", "st-bp-r", "set", 1, 1480, 18, "8708"),
        line("Brake job + inspection", "labour", null, "job", 1, 1200, 18, "998729"),
      ],
    }),
    printedBill({
      id: "bl-3",
      seq: 3,
      date: t1,
      customer: customers[1]!,
      vehicle: vehicles[2]!,
      km: 60810,
      advisor: "Rajesh Kumar",
      mechanic: "Ravi Pal",
      remarks: "",
      settings,
      lines: [
        line("Air Filter", "part", "st-af", "pcs", 1, 420, 18, "8421"),
        line("Cabin Filter", "part", "st-cf", "pcs", 1, 540, 18, "8421"),
        line("AC service", "labour", null, "job", 1, 800, 18, "998729"),
      ],
    }),
    printedBill({
      id: "bl-4",
      seq: 4,
      date: t1,
      customer: customers[4]!,
      vehicle: vehicles[6]!,
      km: 11890,
      advisor: "Amit Verma",
      mechanic: "Suresh Yadav",
      remarks: "Pickup warranty check — no warranty claim.",
      settings,
      lines: [
        line("Spark Plug", "part", "st-sp", "pcs", 4, 160, 18, "8511"),
        line("Tune-up", "labour", null, "job", 1, 600, 18, "998729"),
      ],
    }),
    printedBill({
      id: "bl-5",
      seq: 5,
      date: t0,
      customer: customers[3]!,
      vehicle: vehicles[5]!,
      km: 97120,
      advisor: "Rajesh Kumar",
      mechanic: "Vikram Singh",
      remarks: "Customer waiting.",
      settings,
      paymentMode: "upi",
      amountReceived: 3186,
      lines: [
        line("Wiper Blade", "part", "st-wiper", "pcs", 2, 390, 18, "8512"),
        line("Coolant", "part", "st-cool", "ltr", 2, 180, 18, "3820"),
        line("Top-up and fitment", "labour", null, "job", 1, 250, 18, "998729"),
      ],
    }),
    printedBill({
      id: "bl-6",
      seq: 6,
      date: t0,
      customer: customers[2]!,
      vehicle: vehicles[4]!,
      km: 54000,
      advisor: "Amit Verma",
      mechanic: "Ravi Pal",
      remarks: "Outside part supplied by customer — no stock.",
      settings,
      paymentMode: "cash",
      amountReceived: 0,
      lines: [
        line("Wheel alignment sensor (outside)", "part", null, "pcs", 1, 2200, 18, ""),
        line("Diagnostic labour", "labour", null, "job", 1, 900, 18, "998729"),
      ],
    }),
    printedBill({
      id: "bl-7",
      seq: 7,
      date: t0,
      customer: customers[0]!,
      vehicle: vehicles[1]!,
      km: 18440,
      advisor: "Rajesh Kumar",
      mechanic: "Suresh Yadav",
      remarks: "",
      settings,
      paymentMode: "card",
      amountReceived: 1500,
      lines: [
        line("Oil Filter", "part", "st-of-mt", "pcs", 1, 360, 18, "8421"),
        line("Engine Oil 5W-30", "part", "st-oil", "ltr", 3.5, 680, 18, "2710"),
        line("Oil change", "labour", null, "job", 1, 450, 18, "998729"),
      ],
    }),
    savedBill({
      id: "bl-8",
      date: t0,
      customer: customers[1]!,
      vehicle: vehicles[2]!,
      km: 61020,
      advisor: "Amit Verma",
      mechanic: "Vikram Singh",
      remarks: "Waiting for clutch plate — confirm with Mohan Traders.",
      settings,
      lines: [
        line("Clutch Plate", "part", "st-clutch", "pcs", 1, 2400, 18, "8708"),
        line("Clutch overhaul", "labour", null, "job", 1, 1800, 18, "998729"),
      ],
    }),
    savedBill({
      id: "bl-9",
      date: t0,
      customer: customers[4]!,
      vehicle: vehicles[6]!,
      km: 12150,
      advisor: "Rajesh Kumar",
      mechanic: "Ravi Pal",
      remarks: "Customer may add battery.",
      settings,
      lines: [
        line("Battery 12V 35Ah", "part", "st-batt", "pcs", 1, 5200, 18, "8507"),
        line("Battery fitment", "labour", null, "job", 1, 300, 18, "998729"),
      ],
    }),
  ];

  const movements: StockMovement[] = [];
  for (const item of items) {
    if (item.qty > 0) {
      movements.push({
        id: newId(),
        itemId: item.id,
        type: "IN" as const,
        qty: item.qty + openingOut(item.id, bills),
        date: daysAgo(20),
        supplier: item.supplier,
        purchaseRate: item.purchaseAmt,
        billId: null,
        invoiceNo: null,
        purchaseRef: "OPN-001",
        reason: "Opening stock",
        createdAt: nowISO(),
      });
    } else {
      movements.push({
        id: newId(),
        itemId: item.id,
        type: "IN" as const,
        qty: openingOut(item.id, bills) || 2,
        date: daysAgo(20),
        supplier: item.supplier,
        purchaseRate: item.purchaseAmt,
        billId: null,
        invoiceNo: null,
        purchaseRef: "OPN-001",
        reason: "Opening stock",
        createdAt: nowISO(),
      });
    }
  }
  for (const bill of bills) {
    const committed = committedByItem(bill.lines);
    for (const [itemId, qty] of Object.entries(committed)) {
      movements.push({
        id: newId(),
        itemId,
        type: "OUT" as const,
        qty,
        date: bill.date,
        supplier: "",
        purchaseRate: null,
        billId: bill.id,
        invoiceNo: bill.invoiceNo,
        purchaseRef: "",
        reason: bill.status === "printed" ? `Invoice ${bill.invoiceNo}` : "Saved bill",
        createdAt: bill.updatedAt,
      });
    }
  }

  // Qty on items already reflects remaining stock (seed qty is on-hand now).
  await db.transaction(
    "rw",
    [db.settings, db.stockItems, db.stockMovements, db.customers, db.vehicles, db.bills],
    async () => {
      await db.settings.put(settings);
      await db.stockItems.bulkAdd(items);
      await db.stockMovements.bulkAdd(movements);
      await db.customers.bulkAdd(customers);
      await db.vehicles.bulkAdd(vehicles);
      await db.bills.bulkAdd(bills);
    },
  );
}

function stock(
  id: string,
  displayName: string,
  sku: string,
  brand: string,
  productCode: string,
  supplier: string,
  qty: number,
  unit: string,
  purchaseAmt: number,
  saleAmt: number,
  hsn: string,
  reorderQty: number | null = null,
): StockItem {
  return {
    id,
    displayName,
    sku,
    brand,
    productCode,
    supplier,
    qty,
    unit,
    purchaseAmt,
    saleAmt,
    reorderQty,
    hsn,
    archived: 0,
    createdAt: nowISO(),
  };
}

function v(
  id: string,
  customerId: string,
  vehicleNo: string,
  colour: string,
  registrationDate: string,
  modelYear: string,
  lastKm: number,
): Vehicle {
  return {
    id,
    customerId,
    vehicleNo,
    colour,
    registrationDate,
    modelYear,
    lastKm,
  };
}

function line(
  name: string,
  type: "part" | "labour",
  stockItemId: string | null,
  unit: string,
  qty: number,
  rate: number,
  gstPct: number,
  hsnSac: string,
): BillLine {
  return {
    id: newId(),
    name,
    type,
    stockItemId,
    hsnSac,
    qty,
    unit,
    rate,
    gstPct,
    stockOverride: false,
    stockOverrideReason: "",
  };
}

function printedBill(opts: {
  id: string;
  seq: number;
  date: string;
  customer: Customer;
  vehicle: Vehicle;
  km: number;
  advisor: string;
  mechanic: string;
  remarks: string;
  settings: Settings;
  lines: BillLine[];
  paymentMode?: Bill["paymentMode"];
  amountReceived?: number;
}): Bill {
  const gstMode = gstModeForCustomer(opts.settings.stateCode, opts.customer.gstin);
  const ts = `${opts.date}T10:30:00.000Z`;
  return {
    id: opts.id,
    status: "printed",
    date: opts.date,
    invoiceNo: formatInvoiceNo(opts.settings.invoicePrefix, opts.seq),
    invoiceSeq: opts.seq,
    fy: financialYear(opts.date),
    vehicleNo: opts.vehicle.vehicleNo,
    colour: opts.vehicle.colour,
    regDate: opts.vehicle.registrationDate,
    modelYear: opts.vehicle.modelYear,
    currentKm: opts.km,
    customerId: opts.customer.id,
    customerName: opts.customer.name,
    phone: opts.customer.phone,
    address: opts.customer.address,
    email: opts.customer.email,
    customerGstin: opts.customer.gstin,
    advisor: opts.advisor,
    mechanic: opts.mechanic,
    remarks: opts.remarks,
    gstEnabled: true,
    placeOfSupplyState: opts.settings.state,
    placeOfSupplyCode: opts.settings.stateCode,
    gstMode,
    paymentMode: opts.paymentMode ?? "cash",
    amountReceived: opts.amountReceived ?? 0,
    lines: opts.lines,
    committedStock: committedByItem(opts.lines),
    createdAt: ts,
    updatedAt: ts,
    printedAt: ts,
  };
}

function savedBill(opts: {
  id: string;
  date: string;
  customer: Customer;
  vehicle: Vehicle;
  km: number;
  advisor: string;
  mechanic: string;
  remarks: string;
  settings: Settings;
  lines: BillLine[];
}): Bill {
  const gstMode = gstModeForCustomer(opts.settings.stateCode, opts.customer.gstin);
  const ts = nowISO();
  return {
    id: opts.id,
    status: "saved",
    date: opts.date,
    invoiceNo: null,
    invoiceSeq: null,
    fy: null,
    vehicleNo: opts.vehicle.vehicleNo,
    colour: opts.vehicle.colour,
    regDate: opts.vehicle.registrationDate,
    modelYear: opts.vehicle.modelYear,
    currentKm: opts.km,
    customerId: opts.customer.id,
    customerName: opts.customer.name,
    phone: opts.customer.phone,
    address: opts.customer.address,
    email: opts.customer.email,
    customerGstin: opts.customer.gstin,
    advisor: opts.advisor,
    mechanic: opts.mechanic,
    remarks: opts.remarks,
    gstEnabled: true,
    placeOfSupplyState: opts.settings.state,
    placeOfSupplyCode: opts.settings.stateCode,
    gstMode,
    paymentMode: "",
    amountReceived: 0,
    lines: opts.lines,
    committedStock: committedByItem(opts.lines),
    createdAt: ts,
    updatedAt: ts,
    printedAt: null,
  };
}

function openingOut(itemId: string, bills: Bill[]): number {
  let n = 0;
  for (const b of bills) n += b.committedStock[itemId] ?? 0;
  return n;
}
