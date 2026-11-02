import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { financialYear, formatInvoiceNo, invoicePath } from "./fy.ts";
import { computeBill, gstModeForCustomer } from "./money.ts";
import { printedName } from "./print-name.ts";
import { committedByItem, findShortages, stockDiffs } from "./stock-engine.ts";
import type { BillLine, StockItem } from "./types.ts";

function line(partial: Partial<BillLine> & Pick<BillLine, "id" | "name">): BillLine {
  return {
    type: "part",
    stockItemId: null,
    hsnSac: "",
    qty: 1,
    unit: "pcs",
    rate: 100,
    gstPct: 18,
    stockOverride: false,
    stockOverrideReason: "",
    ...partial,
  };
}

function item(partial: Partial<StockItem> & Pick<StockItem, "id" | "displayName" | "qty">): StockItem {
  return {
    sku: partial.id,
    brand: "",
    productCode: "",
    supplier: "",
    unit: "pcs",
    purchaseAmt: 50,
    saleAmt: 100,
    reorderQty: null,
    hsn: "",
    archived: 0,
    createdAt: "",
    ...partial,
  };
}

describe("printedName", () => {
  it("keeps a plain display name", () => {
    assert.equal(printedName("Oil Filter"), "Oil Filter");
  });

  it("strips trailing SKU lot suffixes KG / MT / KM", () => {
    assert.equal(printedName("Oil Filter KG"), "Oil Filter");
    assert.equal(printedName("Oil Filter-MT"), "Oil Filter");
    assert.equal(printedName("Oil Filter / KM"), "Oil Filter");
    assert.equal(printedName("Oil Filter_KG"), "Oil Filter");
  });

  it("does not strip those letters inside a name", () => {
    assert.equal(printedName("KG Filter"), "KG Filter");
    assert.equal(printedName("Cabin Filter"), "Cabin Filter");
  });
});

describe("stock on save (diffs, not print)", () => {
  it("counts only stock part lines", () => {
    const committed = committedByItem([
      line({ id: "1", name: "Oil Filter", stockItemId: "st-of", qty: 2 }),
      line({ id: "2", name: "Oil change", type: "labour", qty: 1, rate: 450 }),
      line({ id: "3", name: "Outside sensor", type: "part", stockItemId: null, qty: 1 }),
    ]);
    assert.deepEqual(committed, { "st-of": 2 });
  });

  it("applies only quantity differences on re-save", () => {
    assert.deepEqual(stockDiffs({ a: 2 }, { a: 5 }), [{ itemId: "a", delta: 3 }]);
    assert.deepEqual(stockDiffs({ a: 2 }, { a: 2 }), []);
    assert.deepEqual(stockDiffs({ a: 2 }, {}), [{ itemId: "a", delta: -2 }]);
    assert.deepEqual(stockDiffs({}, { b: 1 }), [{ itemId: "b", delta: 1 }]);
  });

  it("blocks save when needed qty is above on-hand plus this bill's previous commit", () => {
    const itemsById = new Map([
      ["st-of", item({ id: "st-of", displayName: "Oil Filter", qty: 3 })],
    ]);
    const lines = [line({ id: "1", name: "Oil Filter", stockItemId: "st-of", qty: 5 })];
    const first = findShortages({ "st-of": 5 }, {}, itemsById, lines);
    assert.equal(first.length, 1);
    assert.equal(first[0]?.onHand, 3);

    const afterSaveOnHand3Prev2 = findShortages(
      { "st-of": 5 },
      { "st-of": 2 },
      itemsById,
      lines,
    );
    assert.equal(afterSaveOnHand3Prev2.length, 0);
  });

  it("lets an override skip the shortage block", () => {
    const itemsById = new Map([
      ["st-of", item({ id: "st-of", displayName: "Oil Filter", qty: 0 })],
    ]);
    const lines = [
      line({
        id: "1",
        name: "Oil Filter",
        stockItemId: "st-of",
        qty: 1,
        stockOverride: true,
        stockOverrideReason: "Customer waiting",
      }),
    ];
    assert.equal(findShortages({ "st-of": 1 }, {}, itemsById, lines).length, 0);
  });
});

describe("GST totals", () => {
  it("omits tax when GST Tax Invoice is OFF", () => {
    const { totals } = computeBill(
      [line({ id: "1", name: "Labour", type: "labour", qty: 1, rate: 100, gstPct: 18 })],
      false,
      "intra",
    );
    assert.equal(totals.tax, 0);
    assert.equal(totals.grand, 100);
  });

  it("splits CGST/SGST intra-state and uses IGST inter-state", () => {
    const lines = [line({ id: "1", name: "Part", stockItemId: "x", qty: 1, rate: 100, gstPct: 18 })];
    const intra = computeBill(lines, true, "intra").totals;
    assert.equal(intra.igst, 0);
    assert.equal(intra.cgst + intra.sgst, intra.tax);
    assert.equal(intra.grand, 118);

    const inter = computeBill(lines, true, "inter").totals;
    assert.equal(inter.igst, 18);
    assert.equal(inter.cgst, 0);
    assert.equal(gstModeForCustomer("07", "29AABCS1234A1Z5"), "inter");
    assert.equal(gstModeForCustomer("07", "07AABCS1234A1Z5"), "intra");
    assert.equal(gstModeForCustomer("07", ""), "intra");
  });
});

describe("invoice numbering", () => {
  it("uses FY 1 Apr–31 Mar and a settable sequence", () => {
    assert.equal(financialYear("2026-04-01"), "2026-27");
    assert.equal(financialYear("2026-03-31"), "2025-26");
    assert.equal(formatInvoiceNo("SAW/", 8), "SAW/0008");
    assert.equal(formatInvoiceNo("SAW", 1), "SAW/0001");
    assert.equal(invoicePath("2026-09-13", "SAW/", 8), "/invoices/2026-27/SAW-0008.pdf");
  });
});
