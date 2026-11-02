import { useNavigate, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus, Printer, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  billToDraft,
  blankLine,
  cancelBill,
  emptyBillDraft,
  printBill,
  saveBill,
  type BillDraft,
} from "@/lib/workshop/actions";
import { getDb } from "@/lib/workshop/db";
import { downloadBlob } from "@/lib/workshop/pdf-invoice";
import { computeBill, defaultGstForType, formatINR, gstModeForCustomer } from "@/lib/workshop/money";
import { printedName } from "@/lib/workshop/print-name";
import type { Bill, BillLine, LineType, StockItem } from "@/lib/workshop/types";

export function BillEditor({ billId, initialPhone }: { billId?: string; initialPhone?: string }) {
  const navigate = useNavigate();
  const settings = useLiveQuery(() => getDb().settings.get(1));
  const stored = useLiveQuery(async (): Promise<Bill | undefined> => {
    if (!billId) return undefined;
    return await getDb().bills.get(billId);
  }, [billId]);
  const customers = useLiveQuery(() => getDb().customers.toArray()) ?? [];
  const vehicles = useLiveQuery(() => getDb().vehicles.toArray()) ?? [];
  const stock = useLiveQuery(() => getDb().stockItems.toArray()) ?? [];
  const [draft, setDraft] = useState<BillDraft | null>(() =>
    billId ? null : { ...emptyBillDraft(), phone: initialPhone ?? "" },
  );
  const [picker, setPicker] = useState(false);
  const [pickerFor, setPickerFor] = useState<string | null>(null);
  const [shortageOpen, setShortageOpen] = useState(false);
  const [shortageMsg, setShortageMsg] = useState("");
  const [shortageIds, setShortageIds] = useState<string[]>([]);
  const [composer, setComposer] = useState("");
  const [composerType, setComposerType] = useState<LineType>("part");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (billId && stored) setDraft(billToDraft(stored));
  }, [billId, stored]);

  useEffect(() => {
    if (!billId && initialPhone && draft?.phone === initialPhone && !draft.customerName && customers.length) {
      applyMatchFromPhone(initialPhone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot autofill from customer page
  }, [billId, initialPhone, customers, draft?.phone, draft?.customerName]);

  const locked = stored?.status === "printed";
  const gstOn = stored?.status === "printed" ? stored.gstEnabled : (settings?.gstEnabled ?? true);
  const gstMode = gstModeForCustomer(settings?.stateCode ?? "07", draft?.customerGstin ?? "");
  const computed = useMemo(
    () => computeBill(draft?.lines ?? [], gstOn, stored?.gstMode ?? gstMode),
    [draft?.lines, gstOn, stored?.gstMode, gstMode],
  );

  function patch(p: Partial<BillDraft>) {
    setDraft((d) => (d ? { ...d, ...p } : d));
  }

  function setLine(id: string, p: Partial<BillLine>) {
    setDraft((d) =>
      d ? { ...d, lines: d.lines.map((l) => (l.id === id ? { ...l, ...p } : l)) } : d,
    );
  }

  function applyMatchFromPhone(phone: string) {
    const c = customers.find((x) => x.phone.replace(/\s+/g, "") === phone.replace(/\s+/g, ""));
    if (!c) return;
    const vs = vehicles.filter((v) => v.customerId === c.id);
    const v = vs[0];
    patch({
      phone: c.phone,
      customerName: c.name,
      address: c.address,
      email: c.email,
      customerGstin: c.gstin,
      vehicleNo: v?.vehicleNo ?? draft?.vehicleNo ?? "",
      colour: v?.colour ?? draft?.colour ?? "",
      regDate: v?.registrationDate ?? draft?.regDate ?? "",
      modelYear: v?.modelYear ?? draft?.modelYear ?? "",
      currentKm: v?.lastKm ?? draft?.currentKm ?? null,
    });
  }

  function applyMatchFromVehicle(no: string) {
    const v = vehicles.find((x) => x.vehicleNo.toUpperCase() === no.trim().toUpperCase());
    if (!v) return;
    const c = customers.find((x) => x.id === v.customerId);
    patch({
      vehicleNo: v.vehicleNo,
      colour: v.colour,
      regDate: v.registrationDate,
      modelYear: v.modelYear,
      currentKm: v.lastKm,
      customerName: c?.name ?? draft?.customerName ?? "",
      phone: c?.phone ?? draft?.phone ?? "",
      address: c?.address ?? draft?.address ?? "",
      email: c?.email ?? draft?.email ?? "",
      customerGstin: c?.gstin ?? draft?.customerGstin ?? "",
    });
  }

  function addStockLine(item: StockItem, ontoId: string | null) {
    const line = blankLine({
      name: printedName(item.displayName),
      type: "part",
      stockItemId: item.id,
      hsnSac: item.hsn,
      qty: 1,
      unit: item.unit,
      rate: item.saleAmt,
      gstPct: settings ? defaultGstForType("part", settings) : 18,
    });
    setDraft((d) => {
      if (!d) return d;
      if (ontoId) {
        return { ...d, lines: d.lines.map((l) => (l.id === ontoId ? { ...line, id: l.id } : l)) };
      }
      return { ...d, lines: [...d.lines, line] };
    });
    setPicker(false);
  }

  function addTypedLine() {
    const name = composer.trim();
    if (!name || !settings) return;
    setDraft((d) => {
      if (!d) return d;
      return {
        ...d,
        lines: [
          ...d.lines,
          blankLine({
            name,
            type: composerType,
            stockItemId: null,
            unit: composerType === "labour" ? "job" : "pcs",
            gstPct: defaultGstForType(composerType, settings),
          }),
        ],
      };
    });
    setComposer("");
  }

  async function onSave(opts?: { allowShortage?: boolean }): Promise<Bill | null> {
    if (!draft) return null;
    setBusy(true);
    const payload: BillDraft = { ...draft, allowShortage: opts?.allowShortage ?? draft.allowShortage };
    const res = await saveBill(payload);
    setBusy(false);
    if (!res.ok) {
      if (res.shortages?.length) {
        setShortageIds(res.shortages.map((s) => s.itemId));
        setShortageMsg(
          res.shortages
            .map((s) => `${s.name}: need ${s.needed}, on hand ${s.onHand}`)
            .join(" · "),
        );
        setShortageOpen(true);
        return null;
      }
      toast.error(res.error);
      return null;
    }
    toast.success("Bill saved — stock updated");
    if (!billId) {
      await navigate({ to: "/bill/$billId", params: { billId: res.data } });
    }
    return (await getDb().bills.get(res.data)) ?? null;
  }

  async function onPrint() {
    if (!draft) return;
    let id = billId;
    if (!locked) {
      const saved = await onSave();
      if (!saved) return;
      id = saved.id;
    }
    if (!id) return;
    setBusy(true);
    const res = await printBill(id);
    setBusy(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    const file = await getDb().files.get(res.data.path);
    if (file) downloadBlob(file.blob, res.data.path.split("/").pop() ?? "invoice.pdf");
    toast.success(`Printed ${res.data.invoiceNo}`);
    await navigate({
      to: "/bill/$billId/print",
      params: { billId: id },
      search: { autoprint: true },
    });
  }

  if (!draft || !settings) {
    return <p className="text-sm text-muted">Loading bill…</p>;
  }

  const phoneHits = draft.phone.length >= 3
    ? customers.filter((c) => c.phone.includes(draft.phone.replace(/\s+/g, "")))
    : [];
  const vehHits = draft.vehicleNo.length >= 3
    ? vehicles.filter((v) => v.vehicleNo.toUpperCase().includes(draft.vehicleNo.toUpperCase()))
    : [];

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {locked ? stored?.invoiceNo : "Job / Bill"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {locked
              ? "Printed and locked. Stock was already deducted on save."
              : "Save deducts stock. Print assigns the next invoice number and does not deduct again."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!locked && stored?.status === "saved" ? (
            <Button variant="outline" onClick={() => setCancelOpen(true)}>
              Cancel bill
            </Button>
          ) : null}
          {!locked ? (
            <Button variant="secondary" disabled={busy} onClick={() => void onSave()}>
              <Save /> Save
            </Button>
          ) : null}
          <Button disabled={busy} onClick={() => void onPrint()}>
            <Printer /> Print
          </Button>
        </div>
      </header>

      {locked ? (
        <div className="rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          Locked invoice {stored?.invoiceNo}. Stock was deducted on save.{" "}
          <Link
            to="/bill/$billId/print"
            params={{ billId: stored!.id }}
            search={{ autoprint: false }}
            className="underline underline-offset-2"
          >
            Open print sheet
          </Link>
        </div>
      ) : null}

      <fieldset disabled={locked} className="space-y-5 disabled:opacity-80">
        <section className="grid gap-3 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:grid-cols-3">
          <Field label="Date">
            <Input type="date" value={draft.date} onChange={(e) => patch({ date: e.target.value })} />
          </Field>
          <Field label="Vehicle no">
            <Input
              value={draft.vehicleNo}
              onChange={(e) => patch({ vehicleNo: e.target.value.toUpperCase() })}
              onBlur={() => applyMatchFromVehicle(draft.vehicleNo)}
            />
            {vehHits.length > 0 && !locked ? (
              <Suggest
                items={vehHits.map((v) => ({
                  key: v.id,
                  title: v.vehicleNo,
                  meta: v.modelYear,
                }))}
                onPick={(key) => {
                  const v = vehicles.find((x) => x.id === key);
                  if (v) applyMatchFromVehicle(v.vehicleNo);
                }}
              />
            ) : null}
          </Field>
          <Field label="Phone *">
            <Input
              value={draft.phone}
              onChange={(e) => patch({ phone: e.target.value })}
              onBlur={() => applyMatchFromPhone(draft.phone)}
            />
            {phoneHits.length > 0 && !locked ? (
              <Suggest
                items={phoneHits.map((c) => ({
                  key: c.id,
                  title: c.name,
                  meta: c.phone,
                }))}
                onPick={(key) => {
                  const c = customers.find((x) => x.id === key);
                  if (c) applyMatchFromPhone(c.phone);
                }}
              />
            ) : null}
          </Field>
          <Field label="Customer name *">
            <Input value={draft.customerName} onChange={(e) => patch({ customerName: e.target.value })} />
          </Field>
          <Field label="Colour">
            <Input value={draft.colour} onChange={(e) => patch({ colour: e.target.value })} />
          </Field>
          <Field label="Model / year">
            <Input value={draft.modelYear} onChange={(e) => patch({ modelYear: e.target.value })} />
          </Field>
          <Field label="Reg date">
            <Input type="date" value={draft.regDate} onChange={(e) => patch({ regDate: e.target.value })} />
          </Field>
          <Field label="Current KM">
            <Input
              type="number"
              value={draft.currentKm ?? ""}
              onChange={(e) =>
                patch({ currentKm: e.target.value === "" ? null : Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Customer GSTIN">
            <Input
              value={draft.customerGstin}
              onChange={(e) => patch({ customerGstin: e.target.value.toUpperCase() })}
            />
          </Field>
          <Field label="Address" className="md:col-span-2">
            <Input value={draft.address} onChange={(e) => patch({ address: e.target.value })} />
          </Field>
          <Field label="Email">
            <Input value={draft.email} onChange={(e) => patch({ email: e.target.value })} />
          </Field>
          <Field label="Advisor">
            <Input
              list="advisors"
              value={draft.advisor}
              onChange={(e) => patch({ advisor: e.target.value })}
            />
            <datalist id="advisors">
              {settings.advisors.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </Field>
          <Field label="Mechanic">
            <Input
              list="mechanics"
              value={draft.mechanic}
              onChange={(e) => patch({ mechanic: e.target.value })}
            />
            <datalist id="mechanics">
              {settings.mechanics.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </Field>
          <Field label="Remarks" className="md:col-span-3">
            <Textarea value={draft.remarks} onChange={(e) => patch({ remarks: e.target.value })} />
          </Field>
        </section>

        <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Lines</h2>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setPickerFor(null);
                  setPicker(true);
                }}
              >
                <Plus /> Stock
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  patch({
                    lines: [
                      ...draft.lines,
                      blankLine({
                        gstPct: defaultGstForType("labour", settings),
                        type: "labour",
                        unit: "job",
                      }),
                    ],
                  })
                }
              >
                + Labour / outside
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="text-xs tracking-wide text-muted uppercase">
                <tr>
                  <th className="pb-2">Name</th>
                  <th>Type</th>
                  {gstOn ? <th>HSN/SAC</th> : null}
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Rate</th>
                  {gstOn ? <th>GST %</th> : null}
                  {gstOn ? <th>Tax</th> : null}
                  <th>Amount</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {draft.lines.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-muted">
                      Type a line below, or pick a stock lot. Typed lines that are not in stock are
                      labour or outside parts — no stock movement.
                    </td>
                  </tr>
                ) : (
                  computed.lines.map((line) => (
                    <tr key={line.id} className="border-t border-border align-top">
                      <td className="py-2 pr-2">
                        <div className="flex gap-1">
                          <Input
                            value={line.name}
                            onChange={(e) =>
                              setLine(line.id, {
                                name: e.target.value,
                                stockItemId: line.stockItemId,
                              })
                            }
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="shrink-0"
                            onClick={() => {
                              setPickerFor(line.id);
                              setPicker(true);
                            }}
                          >
                            <Plus />
                          </Button>
                        </div>
                        {line.stockItemId ? (
                          <p className="mt-1 text-xs text-muted">
                            Stock lot · printed name only
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-muted">Non-stock — no stock movement</p>
                        )}
                      </td>
                      <td className="py-2 pr-2">
                        <select
                          className="h-11 rounded-sm border border-border bg-surface px-2"
                          value={line.type}
                          onChange={(e) => {
                            const type = e.target.value as BillLine["type"];
                            setLine(line.id, {
                              type,
                              stockItemId: type === "labour" ? null : line.stockItemId,
                              gstPct: defaultGstForType(type, settings),
                            });
                          }}
                        >
                          <option value="part">Part</option>
                          <option value="labour">Labour</option>
                        </select>
                      </td>
                      {gstOn ? (
                        <td className="py-2 pr-2">
                          <Input
                            value={line.hsnSac}
                            onChange={(e) => setLine(line.id, { hsnSac: e.target.value })}
                          />
                        </td>
                      ) : null}
                      <td className="py-2 pr-2 w-24">
                        <Input
                          type="number"
                          min={0}
                          step="any"
                          value={line.qty}
                          onChange={(e) => setLine(line.id, { qty: Number(e.target.value) })}
                        />
                      </td>
                      <td className="py-2 pr-2 w-20">
                        <Input
                          value={line.unit}
                          onChange={(e) => setLine(line.id, { unit: e.target.value })}
                        />
                      </td>
                      <td className="py-2 pr-2 w-28">
                        <Input
                          type="number"
                          value={line.rate}
                          onChange={(e) => setLine(line.id, { rate: Number(e.target.value) })}
                        />
                      </td>
                      {gstOn ? (
                        <td className="py-2 pr-2 w-20">
                          <Input
                            type="number"
                            value={line.gstPct}
                            onChange={(e) => setLine(line.id, { gstPct: Number(e.target.value) })}
                          />
                        </td>
                      ) : null}
                      {gstOn ? (
                        <td className="py-2 pr-2 tabular text-muted">{formatINR(line.tax)}</td>
                      ) : null}
                      <td className="py-2 pr-2 tabular font-medium">
                        {formatINR(gstOn ? line.lineTotal : line.amount)}
                      </td>
                      <td className="py-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            patch({ lines: draft.lines.filter((l) => l.id !== line.id) })
                          }
                        >
                          <Trash2 />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!locked ? (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Input
                value={composer}
                onChange={(e) => setComposer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTypedLine();
                  }
                }}
                placeholder="Type any line — labour or outside part"
                className="sm:flex-1"
              />
              <select
                className="h-11 rounded-sm border border-border bg-surface px-2 text-sm"
                value={composerType}
                onChange={(e) => setComposerType(e.target.value as LineType)}
              >
                <option value="part">Part</option>
                <option value="labour">Labour</option>
              </select>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPickerFor(null);
                  setPicker(true);
                }}
              >
                <Plus /> Stock
              </Button>
              <Button type="button" variant="secondary" onClick={addTypedLine}>
                Add line
              </Button>
            </div>
          ) : null}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="grid gap-3 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:grid-cols-3">
            <Field label="Payment">
              <select
                className="h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm"
                value={draft.paymentMode}
                onChange={(e) => patch({ paymentMode: e.target.value as BillDraft["paymentMode"] })}
              >
                <option value="">None</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
            </Field>
            <Field label="Received">
              <Input
                type="number"
                value={draft.amountReceived}
                onChange={(e) => patch({ amountReceived: Number(e.target.value) })}
              />
            </Field>
            <Field label="Balance">
              <p className="flex h-11 items-center font-medium tabular">
                {formatINR(Math.max(0, computed.totals.grand - (draft.amountReceived || 0)))}
              </p>
            </Field>
          </div>
          <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
            <dl className="space-y-1 text-sm">
              <Row k="Taxable" v={formatINR(computed.totals.taxable)} />
              {gstOn && computed.totals.igst > 0 ? (
                <Row k="IGST" v={formatINR(computed.totals.igst)} />
              ) : null}
              {gstOn && computed.totals.cgst > 0 ? (
                <>
                  <Row k="CGST" v={formatINR(computed.totals.cgst)} />
                  <Row k="SGST" v={formatINR(computed.totals.sgst)} />
                </>
              ) : null}
              <Row k="Grand total" v={formatINR(computed.totals.grand)} strong />
            </dl>
            {gstOn ? (
              <p className="mt-2 text-xs text-muted">
                {gstMode === "inter" ? "IGST (inter-state)" : "CGST + SGST (Delhi / intra-state)"}
              </p>
            ) : (
              <p className="mt-2 text-xs text-muted">GST Tax Invoice is OFF in Settings.</p>
            )}
          </div>
        </section>
      </fieldset>

      <StockPicker
        open={picker}
        items={stock.filter((s) => !s.archived)}
        onOpenChange={setPicker}
        onPick={(item) => addStockLine(item, pickerFor)}
      />

      <AlertDialog open={shortageOpen} onOpenChange={setShortageOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Stock short</AlertDialogTitle>
            <AlertDialogDescription>
              {shortageMsg}. Save is blocked unless you override with a reason.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <label className="grid gap-1">
            <Label>Override reason</Label>
            <Input
              value={
                draft.lines.find((l) => l.stockItemId && shortageIds.includes(l.stockItemId))
                  ?.stockOverrideReason ?? ""
              }
              onChange={(e) =>
                patch({
                  lines: draft.lines.map((l) =>
                    l.stockItemId && shortageIds.includes(l.stockItemId)
                      ? { ...l, stockOverride: true, stockOverrideReason: e.target.value }
                      : l,
                  ),
                  allowShortage: true,
                })
              }
            />
          </label>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShortageOpen(false);
                void onSave({ allowShortage: true });
              }}
            >
              Save with override
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this unprinted bill?</AlertDialogTitle>
            <AlertDialogDescription>
              Stock deducted on save will be returned. The bill cannot be printed afterwards.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!billId) return;
                const res = await cancelBill(billId);
                if (!res.ok) toast.error(res.error);
                else {
                  toast.success("Bill cancelled, stock returned");
                  await navigate({ to: "/bills" });
                }
              }}
            >
              Cancel bill
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`relative grid gap-1 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </label>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? "pt-2 text-base font-semibold" : ""}`}>
      <dt className="text-muted">{k}</dt>
      <dd className="tabular">{v}</dd>
    </div>
  );
}

function Suggest({
  items,
  onPick,
}: {
  items: { key: string; title: string; meta: string }[];
  onPick: (key: string) => void;
}) {
  return (
    <ul className="absolute top-full z-20 mt-1 w-full overflow-hidden rounded-md bg-surface shadow-[var(--shadow-border)]">
      {items.slice(0, 5).map((it) => (
        <li key={it.key}>
          <button
            type="button"
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-chip"
            onMouseDown={(e) => {
              e.preventDefault();
              onPick(it.key);
            }}
          >
            <span>{it.title}</span>
            <span className="text-xs text-muted">{it.meta}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function StockPicker({
  open,
  items,
  onOpenChange,
  onPick,
}: {
  open: boolean;
  items: StockItem[];
  onOpenChange: (v: boolean) => void;
  onPick: (item: StockItem) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = items.filter((i) =>
    `${i.displayName} ${i.sku} ${i.brand} ${i.supplier}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Pick stock lot</DialogTitle>
        </DialogHeader>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stock" />
        <ul className="divide-y divide-border">
          {filtered.slice(0, 40).map((i) => (
            <li key={i.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between py-3 text-left text-sm hover:bg-chip/60"
                onClick={() => onPick(i)}
              >
                <span>
                  <span className="block font-medium">{printedName(i.displayName)}</span>
                  <span className="font-mono text-xs text-muted">
                    {i.sku} · {i.brand} · {i.supplier}
                  </span>
                </span>
                <span className="tabular text-muted">
                  {i.qty} {i.unit}
                  {i.qty <= 0 ? (
                    <Badge variant="critical" className="ml-2">
                      0
                    </Badge>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

