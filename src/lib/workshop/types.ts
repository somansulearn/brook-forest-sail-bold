export type GstMode = "off" | "intra" | "inter";

export type LineType = "part" | "labour";

export type BillStatus = "saved" | "printed" | "cancelled";

export type PaymentMode = "cash" | "upi" | "card" | "";

export type MovementType = "IN" | "OUT" | "ADJUST" | "VOID";

export type Settings = {
  id: 1;
  legalName: string;
  address: string;
  phones: string;
  email: string;
  gstin: string;
  state: string;
  stateCode: string;
  gstEnabled: boolean;
  invoicePrefix: string;
  nextInvoiceNumber: number;
  defaultGstParts: number;
  defaultGstLabour: number;
  defaultReorderQty: number;
  dayEndEmail: string;
  advisors: string[];
  mechanics: string[];
  logoDataUrl: string;
  backupFolderLabel: string;
};

export type StockItem = {
  id: string;
  displayName: string;
  sku: string;
  brand: string;
  productCode: string;
  supplier: string;
  qty: number;
  unit: string;
  purchaseAmt: number;
  saleAmt: number;
  reorderQty: number | null;
  hsn: string;
  archived: number;
  createdAt: string;
};

export type StockMovement = {
  id: string;
  itemId: string;
  type: MovementType;
  qty: number;
  date: string;
  supplier: string;
  purchaseRate: number | null;
  billId: string | null;
  invoiceNo: string | null;
  purchaseRef: string;
  reason: string;
  createdAt: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  gstin: string;
  createdAt: string;
};

export type Vehicle = {
  id: string;
  customerId: string;
  vehicleNo: string;
  colour: string;
  registrationDate: string;
  modelYear: string;
  lastKm: number | null;
};

export type BillLine = {
  id: string;
  name: string;
  type: LineType;
  stockItemId: string | null;
  hsnSac: string;
  qty: number;
  unit: string;
  rate: number;
  gstPct: number;
  stockOverride: boolean;
  stockOverrideReason: string;
};

export type Bill = {
  id: string;
  status: BillStatus;
  date: string;
  invoiceNo: string | null;
  invoiceSeq: number | null;
  fy: string | null;
  vehicleNo: string;
  colour: string;
  regDate: string;
  modelYear: string;
  currentKm: number | null;
  customerId: string | null;
  customerName: string;
  phone: string;
  address: string;
  email: string;
  customerGstin: string;
  advisor: string;
  mechanic: string;
  remarks: string;
  gstEnabled: boolean;
  placeOfSupplyState: string;
  placeOfSupplyCode: string;
  gstMode: GstMode;
  paymentMode: PaymentMode;
  amountReceived: number;
  lines: BillLine[];
  committedStock: Record<string, number>;
  createdAt: string;
  updatedAt: string;
  printedAt: string | null;
};

export type StoredFile = {
  id: string;
  path: string;
  mime: string;
  blob: Blob;
  createdAt: string;
};

export type LineComputed = BillLine & {
  amount: number;
  tax: number;
  lineTotal: number;
};

export type BillTotals = {
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  tax: number;
  grand: number;
};

export type StockStatus = "ok" | "low" | "critical";
