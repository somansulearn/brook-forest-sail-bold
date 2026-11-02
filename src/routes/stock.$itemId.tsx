import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ItemDialog } from "./stock";
import { adjustStock, inwardStock, upsertStockItem } from "@/lib/workshop/actions";
import { getDb } from "@/lib/workshop/db";
import { todayISO } from "@/lib/workshop/ids";
import { formatINR, profitPct } from "@/lib/workshop/money";
import { formatDateDisplay } from "@/lib/workshop/fy";
import { reorderOf, stockStatus } from "@/lib/workshop/stock-engine";

export const Route = createFileRoute("/stock/$itemId")({ component: ItemPage });

function ItemPage() {
  const { itemId } = Route.useParams();
  const item = useLiveQuery(() => getDb().stockItems.get(itemId), [itemId]);
  const settings = useLiveQuery(() => getDb().settings.get(1));
  const movements =
    useLiveQuery(
      () => getDb().stockMovements.where("itemId").equals(itemId).reverse().sortBy("createdAt"),
      [itemId],
    ) ?? [];
  const [edit, setEdit] = useState(false);
  const [inward, setInward] = useState(false);
  const [adjust, setAdjust] = useState(false);

  if (!item) {
    return <p className="text-muted">Item not found.</p>;
  }

  const defaultReorder = settings?.defaultReorderQty ?? 5;
  const status = stockStatus(item.qty, reorderOf(item, defaultReorder));
  const profit = profitPct(item.purchaseAmt, item.saleAmt);

  return (
    <div className="space-y-6">
      <Link to="/stock" className="text-sm text-muted hover:text-fg">
        ← Stock
      </Link>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{item.displayName}</h1>
          <p className="mt-1 font-mono text-sm text-muted">
            {item.sku}
            {item.brand ? ` · ${item.brand}` : ""}
            {item.productCode ? ` · ${item.productCode}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setEdit(true)}>
            Edit
          </Button>
          <Button variant="outline" onClick={() => setAdjust(true)}>
            Adjust
          </Button>
          <Button onClick={() => setInward(true)}>Inward</Button>
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-3 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:grid-cols-4">
        <Stat label="On hand" value={`${item.qty} ${item.unit}`} danger={item.qty <= 0} />
        <Stat label="Sale" value={formatINR(item.saleAmt)} />
        <Stat label="Purchase" value={formatINR(item.purchaseAmt)} />
        <Stat label="Profit %" value={profit == null ? "—" : `${profit.toFixed(1)}%`} />
        <Stat label="Supplier" value={item.supplier || "—"} />
        <Stat label="HSN" value={item.hsn || "—"} />
        <Stat
          label="Reorder"
          value={item.reorderQty == null ? `${defaultReorder} (default)` : String(item.reorderQty)}
        />
        <div>
          <dt className="text-xs tracking-wide text-muted uppercase">Status</dt>
          <dd className="mt-1">
            <Badge variant={status === "ok" ? "ok" : status === "low" ? "low" : "critical"}>
              {status === "ok" ? "OK" : status === "low" ? "Low" : "Critical"}
            </Badge>
          </dd>
        </div>
      </dl>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-semibold">Movement ledger</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="py-2">Date</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Ref</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-muted">
                    No movement yet.
                  </td>
                </tr>
              ) : (
                movements.map((m) => (
                  <tr key={m.id} className="border-t border-border">
                    <td className="py-2">{formatDateDisplay(m.date)}</td>
                    <td>
                      <Badge
                        variant={
                          m.type === "OUT" ? "low" : m.type === "VOID" ? "critical" : "ok"
                        }
                      >
                        {m.type}
                      </Badge>
                    </td>
                    <td className="tabular">{m.qty}</td>
                    <td className="font-mono text-xs">
                      {m.invoiceNo || m.purchaseRef || m.billId?.slice(0, 8) || "—"}
                    </td>
                    <td className="text-muted">{m.reason}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ItemDialog
        open={edit}
        item={item}
        onOpenChange={setEdit}
        onSave={async (row) => {
          const res = await upsertStockItem(row);
          if (!res.ok) toast.error(res.error);
          else {
            toast.success("Item saved");
            setEdit(false);
          }
        }}
      />

      <InwardDialog item={item} open={inward} onOpenChange={setInward} />
      <AdjustDialog item={item} open={adjust} onOpenChange={setAdjust} />
    </div>
  );
}

function Stat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div>
      <dt className="text-xs tracking-wide text-muted uppercase">{label}</dt>
      <dd className={`mt-1 text-sm font-medium ${danger ? "text-danger" : ""}`}>{value}</dd>
    </div>
  );
}

function InwardDialog({
  item,
  open,
  onOpenChange,
}: {
  item: { id: string; supplier: string; purchaseAmt: number };
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [qty, setQty] = useState(1);
  const [date, setDate] = useState(todayISO());
  const [supplier, setSupplier] = useState(item.supplier);
  const [rate, setRate] = useState(item.purchaseAmt);
  const [ref, setRef] = useState("");
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    if (!open) return;
    setQty(1);
    setDate(todayISO());
    setSupplier(item.supplier);
    setRate(item.purchaseAmt);
    setRef("");
    setUpdate(true);
  }, [open, item.id, item.supplier, item.purchaseAmt]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inward</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await inwardStock({
              itemId: item.id,
              qty,
              date,
              supplier,
              purchaseRate: rate,
              purchaseRef: ref,
              updateItemRate: update,
            });
            if (!res.ok) toast.error(res.error);
            else {
              toast.success("Stock added");
              onOpenChange(false);
            }
          }}
        >
          <label className="grid gap-1">
            <Label>Qty</Label>
            <Input type="number" min={0.001} step="any" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          </label>
          <label className="grid gap-1">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="grid gap-1">
            <Label>Supplier</Label>
            <Input value={supplier} onChange={(e) => setSupplier(e.target.value)} />
          </label>
          <label className="grid gap-1">
            <Label>Purchase rate</Label>
            <Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
          </label>
          <label className="grid gap-1">
            <Label>Purchase ref</Label>
            <Input value={ref} onChange={(e) => setRef(e.target.value)} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={update} onChange={(e) => setUpdate(e.target.checked)} />
            Update item purchase amount
          </label>
          <Button type="submit">Add inward</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdjustDialog({
  item,
  open,
  onOpenChange,
}: {
  item: { id: string; qty: number };
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [qty, setQty] = useState(item.qty);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) return;
    setQty(item.qty);
    setReason("");
  }, [open, item.id, item.qty]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust count</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await adjustStock({ itemId: item.id, newQty: qty, reason });
            if (!res.ok) toast.error(res.error);
            else {
              toast.success("Adjusted");
              onOpenChange(false);
            }
          }}
        >
          <label className="grid gap-1">
            <Label>New qty</Label>
            <Input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          </label>
          <label className="grid gap-1">
            <Label>Reason</Label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} required />
          </label>
          <Button type="submit">Save adjust</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
