import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getDb } from "./db";
import { formatDateDisplay } from "./fy";
import { computeBill, formatINR, formatQty } from "./money";
import { reorderOf, stockStatus } from "./stock-engine";
import type { Settings } from "./types";

export async function generateDayEndPdf(dateISO: string, settings: Settings): Promise<Blob> {
  const db = getDb();
  const bills = await db.bills.toArray();
  const printed = bills.filter((b) => b.status === "printed" && b.date === dateISO);
  const saved = bills.filter((b) => b.status === "saved");
  const movements = (await db.stockMovements.toArray()).filter((m) => m.date === dateISO);
  const items = await db.stockItems.toArray();
  const itemById = new Map(items.map((i) => [i.id, i]));

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 16;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(30, 77, 74);
  doc.text("Day-end report", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(26, 24, 20);
  doc.text(settings.legalName, pageW - margin, y, { align: "right" });
  y += 6;
  doc.setFontSize(10);
  doc.text(formatDateDisplay(dateISO), margin, y);
  doc.setFontSize(8);
  doc.setTextColor(107, 100, 89);
  doc.text(`${printed.length} printed  ·  ${saved.length} saved unprinted`, pageW - margin, y, {
    align: "right",
  });
  y += 8;

  let printedTotal = 0;
  const printedRows = printed.map((b) => {
    const { totals } = computeBill(b.lines, b.gstEnabled, b.gstMode);
    printedTotal += totals.grand;
    return [
      b.invoiceNo ?? "",
      b.customerName,
      b.vehicleNo,
      b.gstEnabled ? "Tax invoice" : "Invoice",
      formatINR(totals.grand),
    ];
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 77, 74);
  doc.text("Today's printed bills", margin, y);
  y += 2;

  autoTable(doc, {
    startY: y,
    head: [["Invoice", "Customer", "Vehicle", "Type", "Amount"]],
    body: printedRows.length ? printedRows : [["—", "No printed bills today", "", "", ""]],
    foot: printedRows.length ? [["", "", "", "Total", formatINR(printedTotal)]] : undefined,
    margin: { left: margin, right: margin },
    theme: "plain",
    headStyles: { fillColor: [30, 77, 74], textColor: 255, fontSize: 8 },
    styles: { fontSize: 8, textColor: [26, 24, 20] },
    footStyles: { fontStyle: "bold", fontSize: 8 },
    columnStyles: { 4: { halign: "right" } },
  });
  y = ((doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY ?? y) + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 77, 74);
  doc.text("Saved but unprinted", margin, y);
  y += 2;
  autoTable(doc, {
    startY: y,
    head: [["Date", "Customer", "Vehicle", "Lines"]],
    body: saved.length
      ? saved.map((b) => [formatDateDisplay(b.date), b.customerName, b.vehicleNo, String(b.lines.length)])
      : [["—", "None", "", ""]],
    margin: { left: margin, right: margin },
    theme: "plain",
    headStyles: { fillColor: [30, 77, 74], textColor: 255, fontSize: 8 },
    styles: { fontSize: 8 },
  });
  y = ((doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY ?? y) + 10;

  const byItem = new Map<string, { inQty: number; outQty: number }>();
  for (const m of movements) {
    const row = byItem.get(m.itemId) ?? { inQty: 0, outQty: 0 };
    if (m.type === "IN" || m.type === "VOID") row.inQty += m.qty;
    if (m.type === "OUT") row.outQty += m.qty;
    if (m.type === "ADJUST") {
      if (m.reason.includes("+")) row.inQty += m.qty;
      else row.outQty += m.qty;
    }
    byItem.set(m.itemId, row);
  }

  const stockRows = [...byItem.entries()].map(([id, io]) => {
    const item = itemById.get(id);
    const status = item
      ? stockStatus(item.qty, reorderOf(item, settings.defaultReorderQty))
      : "";
    return [
      item?.displayName ?? id,
      item?.sku ?? "",
      formatQty(io.inQty),
      formatQty(io.outQty),
      formatQty(item?.qty ?? 0),
      status,
    ];
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 77, 74);
  doc.text("Today's stock movement (closing qty)", margin, y);
  y += 2;
  autoTable(doc, {
    startY: y,
    head: [["Item", "SKU", "IN", "OUT", "Closing", "Status"]],
    body: stockRows.length ? stockRows : [["—", "No movement today", "", "", "", ""]],
    margin: { left: margin, right: margin },
    theme: "plain",
    headStyles: { fillColor: [30, 77, 74], textColor: 255, fontSize: 8 },
    styles: { fontSize: 8 },
    columnStyles: {
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
  });

  return doc.output("blob");
}
