import type { BillLine, BillTotals, GstMode, LineComputed, Settings } from "./types";

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatINR(n: number): string {
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatQty(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return n.toLocaleString("en-IN", { maximumFractionDigits: 3 });
}

export function profitPct(purchase: number, sale: number): number | null {
  if (purchase <= 0) return null;
  return round2(((sale - purchase) / purchase) * 100);
}

export function gstModeForCustomer(
  garageStateCode: string,
  customerGstin: string,
): GstMode {
  const code = customerGstin.trim().slice(0, 2);
  if (code && /^\d{2}$/.test(code) && code !== garageStateCode) return "inter";
  return "intra";
}

export function computeLine(line: BillLine, gstEnabled: boolean): LineComputed {
  const amount = round2(line.qty * line.rate);
  const tax = gstEnabled ? round2(amount * (line.gstPct / 100)) : 0;
  const lineTotal = gstEnabled ? round2(amount + tax) : amount;
  return { ...line, amount, tax, lineTotal };
}

export function computeBill(
  lines: BillLine[],
  gstEnabled: boolean,
  mode: GstMode,
): { lines: LineComputed[]; totals: BillTotals } {
  const computed = lines.map((l) => computeLine(l, gstEnabled));
  const taxable = round2(computed.reduce((s, l) => s + l.amount, 0));
  const tax = round2(computed.reduce((s, l) => s + l.tax, 0));
  if (!gstEnabled) {
    return {
      lines: computed,
      totals: { taxable, cgst: 0, sgst: 0, igst: 0, tax: 0, grand: taxable },
    };
  }
  if (mode === "inter") {
    return {
      lines: computed,
      totals: { taxable, cgst: 0, sgst: 0, igst: tax, tax, grand: round2(taxable + tax) },
    };
  }
  const half = round2(tax / 2);
  const other = round2(tax - half);
  return {
    lines: computed,
    totals: {
      taxable,
      cgst: half,
      sgst: other,
      igst: 0,
      tax,
      grand: round2(taxable + tax),
    },
  };
}

export function defaultGstForType(type: "part" | "labour", settings: Settings): number {
  return type === "labour" ? settings.defaultGstLabour : settings.defaultGstParts;
}

const ONES = [
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
  "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function chunkToWords(n: number): string {
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

function indianIntToWords(n: number): string {
  if (n === 0) return "Zero";
  const parts: string[] = [];
  const crore = Math.floor(n / 1_00_00_000);
  n %= 1_00_00_000;
  const lakh = Math.floor(n / 1_00_000);
  n %= 1_00_000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  if (crore) parts.push(`${chunkToWords(crore)} Crore`);
  if (lakh) parts.push(`${chunkToWords(lakh)} Lakh`);
  if (thousand) parts.push(`${chunkToWords(thousand)} Thousand`);
  if (n) parts.push(chunkToWords(n));
  return parts.join(" ");
}

export function amountInWords(amount: number): string {
  const abs = Math.abs(round2(amount));
  const rupees = Math.floor(abs);
  const paise = Math.round((abs - rupees) * 100);
  const rupeePart = `${indianIntToWords(rupees)} Rupee${rupees === 1 ? "" : "s"}`;
  if (paise === 0) return `${rupeePart} Only`;
  return `${rupeePart} and ${indianIntToWords(paise)} Paise Only`;
}
