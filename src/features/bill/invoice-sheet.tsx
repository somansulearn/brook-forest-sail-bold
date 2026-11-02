import { LogoMark } from "@/components/layout/logo";
import { formatDateDisplay } from "@/lib/workshop/fy";
import { amountInWords, computeBill, formatINR, formatQty } from "@/lib/workshop/money";
import { printedName } from "@/lib/workshop/print-name";
import type { Bill, Settings } from "@/lib/workshop/types";

export function InvoiceSheet({ bill, settings }: { bill: Bill; settings: Settings }) {
  const { lines, totals } = computeBill(bill.lines, bill.gstEnabled, bill.gstMode);
  const gstOn = bill.gstEnabled;
  const title = gstOn ? "TAX INVOICE" : "INVOICE";
  const bal = Math.max(0, totals.grand - (bill.amountReceived || 0));

  return (
    <article className="print-sheet mx-auto w-[210mm] max-w-full bg-white p-8 text-black shadow-[var(--shadow-border)]">
      <header className="flex items-start justify-between gap-4 border-b border-neutral-300 pb-4">
        <div className="flex gap-3">
          {settings.logoDataUrl ? (
            <img src={settings.logoDataUrl} alt="" className="size-14 rounded-full" />
          ) : (
            <LogoMark className="size-14" />
          )}
          <div>
            <h1 className="text-lg font-semibold tracking-tight">{settings.legalName}</h1>
            <p className="max-w-sm text-xs text-neutral-600">{settings.address}</p>
            <p className="text-xs text-neutral-600">Phone: {settings.phones}</p>
            {settings.email ? <p className="text-xs text-neutral-600">{settings.email}</p> : null}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold tracking-[0.14em] text-[#1e4d4a]">{title}</p>
          <p className="mt-1 font-mono text-sm">{bill.invoiceNo ?? "Unnumbered"}</p>
          <p className="text-xs">{formatDateDisplay(bill.date)}</p>
          {bill.fy ? <p className="text-xs text-neutral-600">FY {bill.fy}</p> : null}
        </div>
      </header>

      {gstOn ? (
        <p className="mt-3 text-xs text-neutral-600">
          GSTIN: {settings.gstin || "—"} · Place of supply: {bill.placeOfSupplyState} (
          {bill.placeOfSupplyCode}) · Tax payable on reverse charge: No
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="text-xs tracking-[0.14em] text-neutral-500 uppercase">Bill to</p>
          <p className="font-semibold">{bill.customerName}</p>
          {bill.address ? <p className="text-xs text-neutral-600">{bill.address}</p> : null}
          <p className="text-xs text-neutral-600">{bill.phone}</p>
          {bill.customerGstin ? (
            <p className="text-xs text-neutral-600">GSTIN: {bill.customerGstin}</p>
          ) : null}
        </div>
        <div>
          <p className="text-xs tracking-[0.14em] text-neutral-500 uppercase">Vehicle</p>
          <p className="font-mono font-semibold">{bill.vehicleNo || "—"}</p>
          <p className="text-xs text-neutral-600">
            {[bill.modelYear, bill.colour && `Colour ${bill.colour}`, bill.currentKm != null && `${bill.currentKm.toLocaleString("en-IN")} km`]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {bill.regDate ? (
            <p className="text-xs text-neutral-600">Reg {formatDateDisplay(bill.regDate)}</p>
          ) : null}
        </div>
      </div>

      {bill.remarks ? <p className="mt-3 text-xs">Remarks: {bill.remarks}</p> : null}

      <table className="mt-4 w-full text-left text-xs">
        <thead className="bg-[#1e4d4a] text-white">
          <tr>
            <th className="px-2 py-1.5 font-medium">#</th>
            <th className="px-2 py-1.5 font-medium">Description</th>
            {gstOn ? <th className="px-2 py-1.5 font-medium">HSN/SAC</th> : null}
            <th className="px-2 py-1.5 text-right font-medium">Qty</th>
            <th className="px-2 py-1.5 font-medium">Unit</th>
            <th className="px-2 py-1.5 text-right font-medium">Rate</th>
            {gstOn ? <th className="px-2 py-1.5 text-right font-medium">GST %</th> : null}
            {gstOn ? <th className="px-2 py-1.5 text-right font-medium">Tax</th> : null}
            <th className="px-2 py-1.5 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l, i) => (
            <tr key={l.id} className="border-b border-neutral-200">
              <td className="px-2 py-1.5">{i + 1}</td>
              <td className="px-2 py-1.5">
                {printedName(l.name)}
                {l.type === "labour" ? (
                  <span className="ml-1 text-neutral-500">(Labour)</span>
                ) : null}
              </td>
              {gstOn ? <td className="px-2 py-1.5">{l.hsnSac}</td> : null}
              <td className="px-2 py-1.5 text-right tabular">{formatQty(l.qty)}</td>
              <td className="px-2 py-1.5">{l.unit}</td>
              <td className="px-2 py-1.5 text-right tabular">{formatINR(l.rate)}</td>
              {gstOn ? <td className="px-2 py-1.5 text-right tabular">{l.gstPct}</td> : null}
              {gstOn ? <td className="px-2 py-1.5 text-right tabular">{formatINR(l.tax)}</td> : null}
              <td className="px-2 py-1.5 text-right tabular">{formatINR(gstOn ? l.lineTotal : l.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between gap-6">
        <p className="max-w-sm text-xs italic">INR {amountInWords(totals.grand)}</p>
        <dl className="min-w-48 text-xs">
          <div className="flex justify-between py-0.5">
            <dt>Taxable</dt>
            <dd className="tabular">{formatINR(totals.taxable)}</dd>
          </div>
          {gstOn && totals.igst > 0 ? (
            <div className="flex justify-between py-0.5">
              <dt>IGST</dt>
              <dd className="tabular">{formatINR(totals.igst)}</dd>
            </div>
          ) : null}
          {gstOn && totals.cgst > 0 ? (
            <>
              <div className="flex justify-between py-0.5">
                <dt>CGST</dt>
                <dd className="tabular">{formatINR(totals.cgst)}</dd>
              </div>
              <div className="flex justify-between py-0.5">
                <dt>SGST</dt>
                <dd className="tabular">{formatINR(totals.sgst)}</dd>
              </div>
            </>
          ) : null}
          <div className="mt-1 flex justify-between border-t border-neutral-300 pt-1 text-sm font-semibold">
            <dt>Grand total</dt>
            <dd className="tabular">Rs. {formatINR(totals.grand)}</dd>
          </div>
        </dl>
      </div>

      {bill.paymentMode ? (
        <p className="mt-3 text-xs text-neutral-600">
          Payment {bill.paymentMode.toUpperCase()} · Received Rs. {formatINR(bill.amountReceived || 0)} ·
          Balance Rs. {formatINR(bal)}
        </p>
      ) : null}

      <footer className="mt-10 flex items-end justify-between text-xs text-neutral-600">
        <div>
          {bill.advisor ? <p>Advisor: {bill.advisor}</p> : null}
          {bill.mechanic ? <p>Mechanic: {bill.mechanic}</p> : null}
        </div>
        <div className="w-40 border-t border-neutral-400 pt-1 text-right">Authorised signatory</div>
      </footer>
    </article>
  );
}
