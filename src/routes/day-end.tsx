import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDb } from "@/lib/workshop/db";
import { dayEndPath, formatDateDisplay } from "@/lib/workshop/fy";
import { nowISO, todayISO } from "@/lib/workshop/ids";
import { computeBill, formatINR, formatQty } from "@/lib/workshop/money";
import { downloadBlob } from "@/lib/workshop/pdf-invoice";
import { generateDayEndPdf } from "@/lib/workshop/pdf-dayend";
import { writeToBackupFolder } from "@/lib/workshop/fs-access";
import { reorderOf, stockStatus } from "@/lib/workshop/stock-engine";

export const Route = createFileRoute("/day-end")({ component: DayEndPage });

function DayEndPage() {
  const [date, setDate] = useState(todayISO());
  const settings = useLiveQuery(() => getDb().settings.get(1));
  const bills = useLiveQuery(() => getDb().bills.toArray()) ?? [];
  const items = useLiveQuery(() => getDb().stockItems.toArray()) ?? [];
  const movements = useLiveQuery(() => getDb().stockMovements.toArray()) ?? [];

  const printed = bills.filter((b) => b.status === "printed" && b.date === date);
  const saved = bills.filter((b) => b.status === "saved");
  const todaysMoves = movements.filter((m) => m.date === date);
  const byItem = new Map<string, { inQty: number; outQty: number }>();
  for (const m of todaysMoves) {
    const row = byItem.get(m.itemId) ?? { inQty: 0, outQty: 0 };
    if (m.type === "IN" || m.type === "VOID") row.inQty += m.qty;
    if (m.type === "OUT") row.outQty += m.qty;
    byItem.set(m.itemId, row);
  }
  const itemById = new Map(items.map((i) => [i.id, i]));
  const printedTotal = printed.reduce((sum, b) => {
    const { totals } = computeBill(b.lines, b.gstEnabled, b.gstMode);
    return sum + totals.grand;
  }, 0);

  async function persistPdf(): Promise<boolean> {
    if (!settings) return false;
    const blob = await generateDayEndPdf(date, settings);
    const path = dayEndPath(date);
    await getDb().files.put({
      id: path,
      path,
      mime: "application/pdf",
      blob,
      createdAt: nowISO(),
    });
    const wrote = await writeToBackupFolder(path.replace(/^\//, ""), blob);
    downloadBlob(blob, `${date}-day-end.pdf`);
    return wrote;
  }

  async function savePdf() {
    const wrote = await persistPdf();
    toast.success(wrote ? "Day-end PDF saved to folder and downloaded" : "Day-end PDF downloaded");
  }

  async function emailReport() {
    try {
      await persistPdf();
    } catch {
      toast.error("Could not write the PDF. Mail can still be opened.");
    }
    const to = settings?.dayEndEmail ?? "";
    const subject = encodeURIComponent(`Day-end ${date} — ${settings?.legalName ?? "Samriddhi Auto Works"}`);
    const body = encodeURIComponent(
      `Day-end report for ${date}.\nPrinted bills: ${printed.length}.\nSaved unprinted: ${saved.length}.\n\nThe PDF is kept in Workshop OS and Downloads. Attach it if the mail client cannot attach automatically.`,
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Day-end</h1>
          <p className="mt-1 text-sm text-muted">
            Printed work, open jobs, and stock movement for the day.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="grid gap-1">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <Button variant="outline" onClick={() => void savePdf()}>
            Save PDF
          </Button>
          <Button variant="outline" onClick={() => void emailReport()}>
            Email report
          </Button>
        </div>
      </header>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-semibold">Printed bills — {formatDateDisplay(date)}</h2>
        <ul className="mt-3 divide-y divide-border">
          {printed.length === 0 ? (
            <li className="py-4 text-sm text-muted">No printed bills this day.</li>
          ) : (
            printed.map((b) => {
              const { totals } = computeBill(b.lines, b.gstEnabled, b.gstMode);
              return (
                <li key={b.id} className="flex items-center justify-between py-2.5 text-sm">
                  <Link to="/bill/$billId" params={{ billId: b.id }} className="hover:text-primary">
                    <span className="font-mono">{b.invoiceNo}</span>
                    <span className="ml-2">{b.customerName}</span>
                    <span className="ml-2 text-muted">{b.vehicleNo}</span>
                  </Link>
                  <span className="tabular">{formatINR(totals.grand)}</span>
                </li>
              );
            })
          )}
        </ul>
        {printed.length > 0 ? (
          <p className="mt-2 text-right text-sm font-semibold tabular">
            Total {formatINR(printedTotal)}
          </p>
        ) : null}
      </section>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-semibold">Saved but unprinted</h2>
        <ul className="mt-3 divide-y divide-border">
          {saved.length === 0 ? (
            <li className="py-4 text-sm text-muted">All jobs are printed.</li>
          ) : (
            saved.map((b) => (
              <li key={b.id} className="flex items-center justify-between py-2.5 text-sm">
                <Link to="/bill/$billId" params={{ billId: b.id }} className="hover:text-primary">
                  {b.customerName}
                  <span className="ml-2 text-muted">{b.vehicleNo || "No vehicle"}</span>
                </Link>
                <span className="text-xs text-muted">{formatDateDisplay(b.date)}</span>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-semibold">Stock IN / OUT / closing</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="py-2">Item</th>
                <th>IN</th>
                <th>OUT</th>
                <th>Closing</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {byItem.size === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-muted">
                    No stock movement this day.
                  </td>
                </tr>
              ) : (
                [...byItem.entries()].map(([id, io]) => {
                  const item = itemById.get(id);
                  const st = item
                    ? stockStatus(item.qty, reorderOf(item, settings?.defaultReorderQty ?? 5))
                    : "ok";
                  return (
                    <tr key={id} className="border-t border-border">
                      <td className="py-2">
                        {item ? (
                          <Link to="/stock/$itemId" params={{ itemId: id }} className="hover:text-primary">
                            {item.displayName}
                          </Link>
                        ) : (
                          id
                        )}
                      </td>
                      <td className="tabular">{formatQty(io.inQty)}</td>
                      <td className="tabular">{formatQty(io.outQty)}</td>
                      <td className="tabular">{formatQty(item?.qty ?? 0)}</td>
                      <td>
                        <Badge variant={st === "ok" ? "ok" : st === "low" ? "low" : "critical"}>
                          {st}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
