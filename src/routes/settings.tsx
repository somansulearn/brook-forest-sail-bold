import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getDb } from "@/lib/workshop/db";
import { DEFAULT_SETTINGS, drawDefaultLogo } from "@/lib/workshop/defaults";
import { pickBackupFolder } from "@/lib/workshop/fs-access";
import { saveSettings } from "@/lib/workshop/actions";
import type { Settings } from "@/lib/workshop/types";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const stored = useLiveQuery(() => getDb().settings.get(1));
  const [form, setForm] = useState<Settings>(DEFAULT_SETTINGS);
  const [advisorText, setAdvisorText] = useState("");
  const [mechanicText, setMechanicText] = useState("");

  useEffect(() => {
    if (stored) {
      setForm(stored);
      setAdvisorText(stored.advisors.join("\n"));
      setMechanicText(stored.mechanics.join("\n"));
    }
  }, [stored]);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSave() {
    const result = await saveSettings({
      ...form,
      advisors: advisorText.split("\n"),
      mechanics: mechanicText.split("\n"),
      nextInvoiceNumber: Number(form.nextInvoiceNumber),
      defaultGstParts: Number(form.defaultGstParts),
      defaultGstLabour: Number(form.defaultGstLabour),
      defaultReorderQty: Number(form.defaultReorderQty),
    });
    if (!result.ok) toast.error(result.error);
    else toast.success("Settings saved");
  }

  async function onLogo(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("logoDataUrl", String(reader.result ?? ""));
    reader.readAsDataURL(file);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Garage identity, GST invoice mode, numbering, and lists. Printed bills stay locked.
        </p>
      </header>

      <section className="space-y-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-semibold">Garage</h2>
        <Field label="Legal name">
          <Input value={form.legalName} onChange={(e) => set("legalName", e.target.value)} />
        </Field>
        <Field label="Address">
          <Textarea value={form.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phones">
            <Input value={form.phones} onChange={(e) => set("phones", e.target.value)} />
          </Field>
          <Field label="Email">
            <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="GSTIN">
            <Input value={form.gstin} onChange={(e) => set("gstin", e.target.value.toUpperCase())} />
          </Field>
          <Field label="State">
            <Input value={form.state} onChange={(e) => set("state", e.target.value)} />
          </Field>
          <Field label="State code">
            <Input value={form.stateCode} onChange={(e) => set("stateCode", e.target.value)} />
          </Field>
        </div>
        <Field label="Logo for printed sheet">
          <div className="flex items-center gap-4">
            {form.logoDataUrl ? (
              <img src={form.logoDataUrl} alt="Logo" className="size-16 rounded-full" />
            ) : null}
            <Input type="file" accept="image/*" onChange={(e) => void onLogo(e.target.files?.[0])} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => set("logoDataUrl", drawDefaultLogo())}
            >
              Reset mark
            </Button>
          </div>
        </Field>
      </section>

      <section className="space-y-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold">GST Tax Invoice</h2>
            <p className="text-sm text-muted">
              ON prints TAX INVOICE with HSN/SAC and tax breakup. OFF prints a plain bill.
            </p>
          </div>
          <Switch checked={form.gstEnabled} onCheckedChange={(v) => set("gstEnabled", v)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Default GST % parts">
            <Input
              type="number"
              value={form.defaultGstParts}
              onChange={(e) => set("defaultGstParts", Number(e.target.value))}
            />
          </Field>
          <Field label="Default GST % labour">
            <Input
              type="number"
              value={form.defaultGstLabour}
              onChange={(e) => set("defaultGstLabour", Number(e.target.value))}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-semibold">Invoice numbering</h2>
        <p className="text-sm text-muted">
          Next number is used on Print, then incremented. Paper bills already issued can skip ahead.
          Financial year series is 1 Apr–31 Mar.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Invoice prefix">
            <Input value={form.invoicePrefix} onChange={(e) => set("invoicePrefix", e.target.value)} />
          </Field>
          <Field label="Next invoice number">
            <Input
              type="number"
              min={1}
              value={form.nextInvoiceNumber}
              onChange={(e) => set("nextInvoiceNumber", Number(e.target.value))}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-semibold">Stock & day-end</h2>
        <Field label="Default reorder qty">
          <Input
            type="number"
            min={0}
            value={form.defaultReorderQty}
            onChange={(e) => set("defaultReorderQty", Number(e.target.value))}
          />
        </Field>
        <Field label="Day-end email">
          <Input
            type="email"
            value={form.dayEndEmail}
            onChange={(e) => set("dayEndEmail", e.target.value)}
          />
        </Field>
        <Field label="Backup folder (this computer)">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={form.backupFolderLabel}
              placeholder="C:\\Samriddhi\\backups"
              onChange={(e) => set("backupFolderLabel", e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const name = await pickBackupFolder();
                if (name) {
                  set("backupFolderLabel", name);
                  toast.success(`Folder “${name}” remembered`);
                } else {
                  toast.message("Folder picker is not available — backups download as a zip.");
                }
              }}
            >
              Choose folder
            </Button>
          </div>
        </Field>
        <p className="text-sm text-muted">
          Data lives on this computer.{" "}
          <Link to="/backup" className="text-primary underline-offset-2 hover:underline">
            Backup now
          </Link>{" "}
          downloads a zip of the ledger, invoices, and reports.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <Label>Advisor names</Label>
          <Textarea
            value={advisorText}
            onChange={(e) => setAdvisorText(e.target.value)}
            placeholder="One per line"
          />
        </div>
        <div className="space-y-2 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <Label>Mechanic names</Label>
          <Textarea
            value={mechanicText}
            onChange={(e) => setMechanicText(e.target.value)}
            placeholder="One per line"
          />
        </div>
      </section>

      <div className="flex justify-end">
        <Button onClick={() => void onSave()}>Save settings</Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
