import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { FileText, Package, Users } from "lucide-react";
import { LogoMark } from "@/components/layout/logo";
import { getDb } from "@/lib/workshop/db";
import { todayISO } from "@/lib/workshop/ids";
import { reorderOf, stockStatus } from "@/lib/workshop/stock-engine";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const settings = useLiveQuery(() => getDb().settings.get(1));
  const items = useLiveQuery(() => getDb().stockItems.toArray()) ?? [];
  const bills = useLiveQuery(() => getDb().bills.toArray()) ?? [];
  const today = todayISO();
  const defaultReorder = settings?.defaultReorderQty ?? 5;

  const liveItems = items.filter((i) => !i.archived);
  const low = liveItems.filter((i) => stockStatus(i.qty, reorderOf(i, defaultReorder)) !== "ok");
  const saved = bills.filter((b) => b.status === "saved");
  const printedToday = bills.filter((b) => b.status === "printed" && b.date === today);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-4">
          {settings?.logoDataUrl ? (
            <img
              src={settings.logoDataUrl}
              alt=""
              className="size-16 rounded-full outline outline-1 -outline-offset-1 outline-fg/10"
            />
          ) : (
            <LogoMark className="size-16" />
          )}
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
              Local workshop ledger
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {settings?.legalName ?? "Samriddhi Auto Works"}
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted">{settings?.address}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/settings"
            className="inline-flex min-h-11 items-center rounded-sm px-3 text-sm text-muted hover:text-fg"
          >
            Settings
          </Link>
          <Link
            to="/day-end"
            className="inline-flex min-h-11 items-center rounded-sm px-3 text-sm text-muted hover:text-fg"
          >
            Day-end
          </Link>
          <Link
            to="/backup"
            className="inline-flex min-h-11 items-center rounded-sm border border-border bg-surface px-4 text-sm font-medium shadow-[var(--shadow-border)]"
          >
            Backup now
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <HomeTile to="/stock" icon={<Package />} title="Stock" copy="Parts, inward, ledger" />
        <HomeTile to="/customers" icon={<Users />} title="Customers" copy="Vehicles and job history" />
        <HomeTile to="/bill" icon={<FileText />} title="Bill" copy="Job card and invoice" featured />
      </section>

      <section className="flex flex-wrap gap-2">
        <Chip to="/stock" search={{ filter: "low" }} label="Low stock" value={low.length} tone={low.length ? "warn" : "ok"} />
        <Chip to="/bills" search={{ status: "saved" }} label="Open saved bills" value={saved.length} tone={saved.length ? "primary" : "ok"} />
        <Chip
          to="/bills"
          search={{ status: "printed", when: "today" }}
          label="Today's printed bills"
          value={printedToday.length}
          tone="primary"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-semibold">Needs attention</h2>
          {low.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No low-stock parts.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {low.slice(0, 6).map((i) => (
                <li key={i.id} className="flex items-center justify-between py-2.5 text-sm">
                  <Link to="/stock/$itemId" params={{ itemId: i.id }} className="font-medium hover:text-primary">
                    {i.displayName}
                    <span className="ml-2 font-mono text-xs text-muted">{i.sku}</span>
                  </Link>
                  <span className={i.qty <= 0 ? "tabular text-danger" : "tabular text-warn"}>
                    {i.qty} {i.unit}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <h2 className="text-sm font-semibold">Open jobs</h2>
          {saved.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No unprinted bills.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {saved.slice(0, 6).map((b) => (
                <li key={b.id} className="flex items-center justify-between py-2.5 text-sm">
                  <Link to="/bill/$billId" params={{ billId: b.id }} className="font-medium hover:text-primary">
                    {b.customerName}
                    <span className="ml-2 text-xs text-muted">{b.vehicleNo || "No vehicle"}</span>
                  </Link>
                  <span className="text-xs text-muted">{b.lines.length} lines</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function HomeTile({
  to,
  icon,
  title,
  copy,
  featured,
}: {
  to: "/stock" | "/customers" | "/bill";
  icon: React.ReactNode;
  title: string;
  copy: string;
  featured?: boolean;
}) {
  return (
    <Link
      to={to}
      search={to === "/bill" ? { phone: undefined } : undefined}
      className={
        featured
          ? "flex min-h-32 flex-col justify-between rounded-xl bg-primary p-5 text-primary-fg shadow-[var(--shadow-border)]"
          : "flex min-h-32 flex-col justify-between rounded-xl bg-surface p-5 text-fg shadow-[var(--shadow-border)]"
      }
    >
      <span className={featured ? "text-primary-fg/80 [&_svg]:size-6" : "text-primary [&_svg]:size-6"}>
        {icon}
      </span>
      <span>
        <span className="block text-2xl font-semibold tracking-tight">{title}</span>
        <span className={featured ? "text-sm text-primary-fg/80" : "text-sm text-muted"}>{copy}</span>
      </span>
    </Link>
  );
}

function Chip({
  to,
  search,
  label,
  value,
  tone,
}: {
  to: "/stock" | "/bills";
  search?: { filter?: string; q?: string; status?: string; when?: string };
  label: string;
  value: number;
  tone: "ok" | "warn" | "primary";
}) {
  const color =
    tone === "warn" ? "text-warn" : tone === "ok" ? "text-ok" : "text-primary";
  if (to === "/stock") {
    return (
      <Link
        to="/stock"
        search={{ filter: search?.filter, q: search?.q }}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm shadow-[var(--shadow-border)]"
      >
        <span className={`font-mono text-base font-semibold tabular ${color}`}>{value}</span>
        <span className="text-muted">{label}</span>
      </Link>
    );
  }
  return (
    <Link
      to="/bills"
      search={{ status: search?.status, when: search?.when }}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm shadow-[var(--shadow-border)]"
    >
      <span className={`font-mono text-base font-semibold tabular ${color}`}>{value}</span>
      <span className="text-muted">{label}</span>
    </Link>
  );
}
