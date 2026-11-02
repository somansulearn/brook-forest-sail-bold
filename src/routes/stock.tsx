import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { archiveStockItem, upsertStockItem } from "@/lib/workshop/actions";
import { getDb } from "@/lib/workshop/db";
import { newId } from "@/lib/workshop/ids";
import { formatINR, profitPct } from "@/lib/workshop/money";
import { reorderOf, stockStatus } from "@/lib/workshop/stock-engine";
import type { StockItem } from "@/lib/workshop/types";

type Search = { filter?: string; q?: string };

export const Route = createFileRoute("/stock")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    filter: typeof s.filter === "string" ? s.filter : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  component: StockPage,
});

function StockPage() {
  const { filter, q: qParam } = Route.useSearch();
  const navigate = useNavigate({ from: "/stock" });
  const settings = useLiveQuery(() => getDb().settings.get(1));
  const items = useLiveQuery(() => getDb().stockItems.toArray()) ?? [];
  const [q, setQ] = useState(qParam ?? "");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<StockItem> | null>(null);
  const defaultReorder = settings?.defaultReorderQty ?? 5;

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items
      .filter((i) => !i.archived)
      .filter((i) => {
        if (!needle) return true;
        return [i.displayName, i.sku, i.brand, i.supplier, i.productCode]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      })
      .filter((i) => {
        if (filter !== "low") return true;
        return stockStatus(i.qty, reorderOf(i, defaultReorder)) !== "ok";
      });
  }, [items, q, filter, defaultReorder]);

  function startNew() {
    setEditing({
      id: newId(),
      displayName: "",
      sku: "",
      brand: "",
      productCode: "",
      supplier: "",
      qty: 0,
      unit: "pcs",
      purchaseAmt: 0,
      saleAmt: 0,
      reorderQty: null,
      hsn: "",
      archived: 0,
    });
    setOpen(true);
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Stock</h1>
          <p className="mt-1 text-sm text-muted">
            Same part from different sellers or brands is a separate row.
          </p>
        </div>
        <Button onClick={startNew}>Add item</Button>
      </header>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, brand, SKU, supplier"
          className="sm:max-w-sm"
        />
        <Button
          variant={filter === "low" ? "default" : "outline"}
          onClick={() =>
            navigate({
              search: { filter: filter === "low" ? undefined : "low" },
            })
          }
        >
          Low stock
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-border text-xs tracking-wide text-muted uppercase">
            <tr>
              {[
                "S.No",
                "Display name",
                "SKU",
                "Brand",
                "Product code",
                "Supplier",
                "Qty",
                "Unit",
                "Purchase",
                "Sale",
                "Profit %",
                "Reorder",
                "Status",
              ].map((h) => (
                <th key={h} className="px-3 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={13} className="px-3 py-10 text-center text-muted">
                  No items match.
                </td>
              </tr>
            ) : (
              rows.map((item, i) => {
                const reorder = reorderOf(item, defaultReorder);
                const status = stockStatus(item.qty, reorder);
                const profit = profitPct(item.purchaseAmt, item.saleAmt);
                return (
                  <tr key={item.id} className="border-b border-border/70 last:border-0">
                    <td className="px-3 py-2.5 tabular text-muted">{i + 1}</td>
                    <td className="px-3 py-2.5">
                      <Link
                        to="/stock/$itemId"
                        params={{ itemId: item.id }}
                        className="font-medium hover:text-primary"
                      >
                        {item.displayName}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs">{item.sku}</td>
                    <td className="px-3 py-2.5">{item.brand}</td>
                    <td className="px-3 py-2.5 font-mono text-xs">{item.productCode}</td>
                    <td className="px-3 py-2.5">{item.supplier}</td>
                    <td className={`px-3 py-2.5 tabular ${status === "critical" ? "font-semibold text-danger" : ""}`}>
                      {item.qty}
                    </td>
                    <td className="px-3 py-2.5">{item.unit}</td>
                    <td className="px-3 py-2.5 tabular">{formatINR(item.purchaseAmt)}</td>
                    <td className="px-3 py-2.5 tabular">{formatINR(item.saleAmt)}</td>
                    <td className="px-3 py-2.5 tabular">
                      {profit == null ? "—" : `${profit.toFixed(1)}%`}
                    </td>
                    <td className="px-3 py-2.5 tabular text-muted">
                      {item.reorderQty == null ? `${defaultReorder}*` : item.reorderQty}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge variant={status === "ok" ? "ok" : status === "low" ? "low" : "critical"}>
                        {status === "ok" ? "OK" : status === "low" ? "Low" : "Critical"}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted">* Reorder blank uses the Settings default ({defaultReorder}).</p>

      <ItemDialog
        open={open}
        item={editing}
        onOpenChange={setOpen}
        onSave={async (row) => {
          const res = await upsertStockItem(row);
          if (!res.ok) toast.error(res.error);
          else {
            toast.success("Item saved");
            setOpen(false);
          }
        }}
      />
    </div>
  );
}

export function ItemDialog({
  open,
  item,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  item: Partial<StockItem> | null;
  onOpenChange: (v: boolean) => void;
  onSave: (item: Omit<StockItem, "createdAt">) => Promise<void>;
}) {
  const [form, setForm] = useState(item);
  const [reorderBlank, setReorderBlank] = useState(item?.reorderQty == null);
  const persisted = Boolean(item?.createdAt);

  useEffect(() => {
    if (!open) return;
    setForm(item);
    setReorderBlank(item?.reorderQty == null);
  }, [open, item?.id]);

  function set<K extends keyof StockItem>(key: K, value: StockItem[K]) {
    setForm((f) => ({ ...(f ?? {}), [key]: value }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{item?.displayName ? "Edit item" : "New stock item"}</DialogTitle>
        </DialogHeader>
        {form && (
          <form
            className="grid gap-3 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              void onSave({
                id: form.id ?? newId(),
                displayName: form.displayName ?? "",
                sku: form.sku ?? "",
                brand: form.brand ?? "",
                productCode: form.productCode ?? "",
                supplier: form.supplier ?? "",
                qty: Number(form.qty ?? 0),
                unit: form.unit ?? "pcs",
                purchaseAmt: Number(form.purchaseAmt ?? 0),
                saleAmt: Number(form.saleAmt ?? 0),
                reorderQty: reorderBlank ? null : Number(form.reorderQty ?? 0),
                hsn: form.hsn ?? "",
                archived: form.archived ?? 0,
              });
            }}
          >
            <label className="grid gap-1 sm:col-span-2">
              <Label>Display name</Label>
              <Input
                value={form.displayName ?? ""}
                onChange={(e) => set("displayName", e.target.value)}
                required
              />
            </label>
            <label className="grid gap-1">
              <Label>SKU</Label>
              <Input value={form.sku ?? ""} onChange={(e) => set("sku", e.target.value)} required />
            </label>
            <label className="grid gap-1">
              <Label>Brand</Label>
              <Input value={form.brand ?? ""} onChange={(e) => set("brand", e.target.value)} />
            </label>
            <label className="grid gap-1">
              <Label>Product code</Label>
              <Input
                value={form.productCode ?? ""}
                onChange={(e) => set("productCode", e.target.value)}
              />
            </label>
            <label className="grid gap-1">
              <Label>Supplier</Label>
              <Input value={form.supplier ?? ""} onChange={(e) => set("supplier", e.target.value)} />
            </label>
            <label className="grid gap-1">
              <Label>{persisted ? "Qty on hand (use Inward / Adjust)" : "Opening qty"}</Label>
              <Input
                type="number"
                value={form.qty ?? 0}
                disabled={persisted}
                onChange={(e) => set("qty", Number(e.target.value))}
              />
            </label>
            <label className="grid gap-1">
              <Label>Unit</Label>
              <Input value={form.unit ?? "pcs"} onChange={(e) => set("unit", e.target.value)} />
            </label>
            <label className="grid gap-1">
              <Label>Purchase amt</Label>
              <Input
                type="number"
                value={form.purchaseAmt ?? 0}
                onChange={(e) => set("purchaseAmt", Number(e.target.value))}
              />
            </label>
            <label className="grid gap-1">
              <Label>Sale amt</Label>
              <Input
                type="number"
                value={form.saleAmt ?? 0}
                onChange={(e) => set("saleAmt", Number(e.target.value))}
              />
            </label>
            <label className="grid gap-1">
              <Label>HSN</Label>
              <Input value={form.hsn ?? ""} onChange={(e) => set("hsn", e.target.value)} />
            </label>
            <label className="grid gap-1">
              <Label>Reorder (blank = settings default)</Label>
              <Input
                type="number"
                value={reorderBlank ? "" : (form.reorderQty ?? "")}
                placeholder="Default"
                onChange={(e) => {
                  if (e.target.value === "") {
                    setReorderBlank(true);
                    set("reorderQty", null);
                  } else {
                    setReorderBlank(false);
                    set("reorderQty", Number(e.target.value));
                  }
                }}
              />
            </label>
            <div className="flex justify-end gap-2 sm:col-span-2">
              {persisted ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    const res = await archiveStockItem(form.id!);
                    if (!res.ok) toast.error(res.error);
                    else {
                      toast.success("Archived");
                      onOpenChange(false);
                    }
                  }}
                >
                  Archive
                </Button>
              ) : null}
              <Button type="submit">Save item</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
