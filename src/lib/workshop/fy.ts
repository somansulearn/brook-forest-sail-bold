import { padInvoice } from "./ids.ts";

/** Indian financial year: 1 Apr – 31 Mar. Date is YYYY-MM-DD. */
export function financialYear(dateISO: string): string {
  const [yStr, mStr] = dateISO.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  if (!y || !m) {
    const now = new Date();
    return financialYear(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`,
    );
  }
  if (m >= 4) {
    const next = String((y + 1) % 100).padStart(2, "0");
    return `${y}-${next}`;
  }
  const prev = y - 1;
  const thisYY = String(y % 100).padStart(2, "0");
  return `${prev}-${thisYY}`;
}

export function formatInvoiceNo(prefix: string, seq: number): string {
  const p = prefix.endsWith("/") ? prefix : `${prefix}/`;
  return `${p}${padInvoice(seq)}`;
}

export function invoiceFileName(prefix: string, seq: number): string {
  const raw = prefix.replace(/\/+$/, "") || "SAW";
  return `${raw}-${padInvoice(seq)}.pdf`;
}

export function invoicePath(dateISO: string, prefix: string, seq: number): string {
  return `/invoices/${financialYear(dateISO)}/${invoiceFileName(prefix, seq)}`;
}

export function dayEndPath(dateISO: string): string {
  return `/reports/${dateISO}-day-end.pdf`;
}

export function backupPath(timestamp: string): string {
  return `/backups/${timestamp}.zip`;
}

export function formatDateDisplay(dateISO: string): string {
  if (!dateISO) return "";
  const [y, m, d] = dateISO.split("-").map(Number);
  if (!y || !m || !d) return dateISO;
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
