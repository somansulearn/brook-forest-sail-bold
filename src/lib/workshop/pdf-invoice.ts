import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDateDisplay } from "./fy";
import { amountInWords, computeBill, formatINR, formatQty } from "./money";
import { printedName } from "./print-name";
import type { Bill, Settings } from "./types";

const INK = [26, 24, 20] as const;
const TEAL = [30, 77, 74] as const;
const MUTED = [107, 100, 89] as const;
const RULE = [196, 186, 168] as const;
const PAPER = [255, 252, 247] as const;

export async function generateInvoicePdf(bill: Bill, settings: Settings): Promise<Blob> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 14;

  doc.setFillColor(...PAPER);
  doc.rect(0, 0, pageW, doc.internal.pageSize.getHeight(), "F");

  if (settings.logoDataUrl) {
    try {
      doc.addImage(settings.logoDataUrl, "PNG", margin, y, 16, 16);
    } catch {
      /* logo optional */
    }
  }

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
    settings.email ? `Email: ${settings.email}` : "",
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
  doc.setLineWidth(0.35);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  if (bill.gstEnabled) {
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(`GSTIN: ${settings.gstin || "—"}`, margin, y);
    doc.text(
      `Place of supply: ${bill.placeOfSupplyState} (${bill.placeOfSupplyCode})`,
      pageW / 2,
      y,
    );
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
    bill.customerGstin ? `GSTIN: ${bill.customerGstin}` : "",
  ].filter(Boolean);
  const veh = [
    bill.modelYear,
    bill.colour ? `Colour: ${bill.colour}` : "",
    bill.regDate ? `Reg: ${formatDateDisplay(bill.regDate)}` : "",
    bill.currentKm != null ? `KM: ${bill.currentKm.toLocaleString("en-IN")}` : "",
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

  const head = gstOn
    ? [["#", "Description", "HSN/SAC", "Qty", "Unit", "Rate", "GST %", "Tax", "Amount"]]
    : [["#", "Description", "Qty", "Unit", "Rate", "Amount"]];

  const body = lines.map((l, i) => {
    const name = `${printedName(l.name)}${l.type === "labour" ? "  (Labour)" : ""}`;
    if (gstOn) {
      return [
        String(i + 1),
        name,
        l.hsnSac || "",
        formatQty(l.qty),
        l.unit,
        formatINR(l.rate),
        String(l.gstPct),
        formatINR(l.tax),
        formatINR(l.lineTotal),
      ];
    }
    return [
      String(i + 1),
      name,
      formatQty(l.qty),
      l.unit,
      formatINR(l.rate),
      formatINR(l.amount),
    ];
  });

  autoTable(doc, {
    startY: y,
    head,
    body,
    theme: "plain",
    margin: { left: margin, right: margin },
    styles: {
      font: "helvetica",
      fontSize: 8,
      textColor: [...INK],
      cellPadding: 1.6,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [...TEAL],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 7.5,
    },
    columnStyles: gstOn
      ? {
          0: { cellWidth: 8 },
          3: { halign: "right" },
          5: { halign: "right" },
          6: { halign: "right" },
          7: { halign: "right" },
          8: { halign: "right" },
        }
      : {
          0: { cellWidth: 8 },
          2: { halign: "right" },
          4: { halign: "right" },
          5: { halign: "right" },
        },
    didParseCell: (data) => {
      if (data.section === "body" && data.row.index % 2 === 1) {
        data.cell.styles.fillColor = [244, 241, 235];
      }
    },
  });

  y = ((doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY ?? y) + 8;

  const boxX = pageW - margin - 72;
  const rows: [string, string][] = [["Taxable", formatINR(totals.taxable)]];
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
    doc.text(
      `Payment: ${bill.paymentMode.toUpperCase()}   Received: Rs. ${formatINR(bill.amountReceived || 0)}   Balance: Rs. ${formatINR(bal)}`,
      margin,
      y,
    );
    y += 8;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  if (bill.advisor) doc.text(`Advisor: ${bill.advisor}`, margin, y);
  if (bill.mechanic) doc.text(`Mechanic: ${bill.mechanic}`, margin + 70, y);
  y += 16;
  doc.setDrawColor(...RULE);
  doc.line(pageW - margin - 50, y, pageW - margin, y);
  doc.text("Authorised signatory", pageW - margin, y + 4, { align: "right" });

  y += 12;
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text(
    "This is a computer-generated invoice of Samriddhi Auto Works. Purchase rates are not shown.",
    margin,
    y,
  );

  return doc.output("blob");
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
