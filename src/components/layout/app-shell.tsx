import { Link, useRouterState } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { LogoMark } from "./logo";
import { getDb } from "@/lib/workshop/db";
import { cn } from "@/lib/utils";

const NAV: { to: "/" | "/stock" | "/customers" | "/bill" | "/bills" | "/day-end" | "/settings"; label: string; exact?: boolean }[] = [
  { to: "/", label: "Home", exact: true },
  { to: "/stock", label: "Stock" },
  { to: "/customers", label: "Customers" },
  { to: "/bill", label: "Bill" },
  { to: "/bills", label: "History" },
  { to: "/day-end", label: "Day-end" },
  { to: "/settings", label: "Settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPrint = pathname.includes("/print");
  if (isPrint) return <>{children}</>;

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="no-print sticky top-0 z-40 border-b border-border bg-bg-elevated/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2.5 lg:px-6">
          <Link to="/" className="flex min-h-11 shrink-0 items-center gap-2.5">
            <LogoMark className="size-9" />
            <span className="hidden leading-tight sm:block">
              <span className="block text-sm font-semibold tracking-tight">
                Samriddhi Auto Works
              </span>
              <span className="block text-[11px] tracking-[0.14em] text-muted uppercase">
                Workshop OS
              </span>
            </span>
          </Link>
          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  search={item.to === "/bill" ? { phone: undefined } : undefined}
                  className={cn(
                    "rounded-sm px-3 py-2 text-sm font-medium",
                    active ? "bg-chip text-fg" : "text-muted hover:bg-chip/70 hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <GlobalSearch />
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-border px-3 py-1.5 md:hidden">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "shrink-0 rounded-full px-3 py-2 text-xs font-medium",
                  active ? "bg-primary text-primary-fg" : "bg-chip text-fg",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-[1400px] px-4 py-6 lg:px-6 lg:py-8">{children}</main>
    </div>
  );
}

function GlobalSearch() {
  const [q, setQ] = useState("");
  const customers = useLiveQuery(() => getDb().customers.toArray()) ?? [];
  const vehicles = useLiveQuery(() => getDb().vehicles.toArray()) ?? [];
  const bills = useLiveQuery(() => getDb().bills.toArray()) ?? [];

  const hits = useMemo(() => {
    const needle = q.trim().toLowerCase().replace(/\s+/g, "");
    if (needle.length < 2) return [];
    const out: {
      key: string;
      title: string;
      meta: string;
      to: "/customers/$customerId" | "/bill/$billId";
      params: { customerId: string } | { billId: string };
    }[] = [];
    for (const c of customers) {
      if (
        c.phone.replace(/\s+/g, "").includes(needle) ||
        c.name.toLowerCase().includes(q.trim().toLowerCase())
      ) {
        out.push({
          key: `c-${c.id}`,
          title: c.name,
          meta: c.phone,
          to: "/customers/$customerId",
          params: { customerId: c.id },
        });
      }
    }
    for (const v of vehicles) {
      if (v.vehicleNo.toLowerCase().replace(/\s+/g, "").includes(needle)) {
        out.push({
          key: `v-${v.id}`,
          title: v.vehicleNo,
          meta: v.modelYear,
          to: "/customers/$customerId",
          params: { customerId: v.customerId },
        });
      }
    }
    for (const b of bills) {
      const phone = b.phone.replace(/\s+/g, "");
      const veh = b.vehicleNo.toLowerCase().replace(/\s+/g, "");
      const inv = (b.invoiceNo ?? "").toLowerCase();
      if (phone.includes(needle) || veh.includes(needle) || inv.includes(needle)) {
        out.push({
          key: `b-${b.id}`,
          title: b.invoiceNo ?? `Saved · ${b.customerName}`,
          meta: `${b.vehicleNo} · ${b.phone}`,
          to: "/bill/$billId",
          params: { billId: b.id },
        });
      }
    }
    return out.slice(0, 8);
  }, [q, customers, vehicles, bills]);

  return (
    <div className="relative w-40 sm:w-56 lg:w-72">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Phone or vehicle"
        className="h-11 w-full rounded-sm border border-border bg-surface pr-3 pl-9 text-sm text-fg placeholder:text-subtle"
      />
      {hits.length > 0 && (
        <ul className="absolute top-full right-0 z-50 mt-1 w-72 overflow-hidden rounded-md bg-surface shadow-[var(--shadow-border)]">
          {hits.map((h) => (
            <li key={h.key}>
              {h.to === "/customers/$customerId" ? (
                <Link
                  to="/customers/$customerId"
                  params={{ customerId: (h.params as { customerId: string }).customerId }}
                  onClick={() => setQ("")}
                  className="block px-3 py-2.5 hover:bg-chip"
                >
                  <span className="block text-sm font-medium">{h.title}</span>
                  <span className="block text-xs text-muted">{h.meta}</span>
                </Link>
              ) : (
                <Link
                  to="/bill/$billId"
                  params={{ billId: (h.params as { billId: string }).billId }}
                  onClick={() => setQ("")}
                  className="block px-3 py-2.5 hover:bg-chip"
                >
                  <span className="block text-sm font-medium">{h.title}</span>
                  <span className="block text-xs text-muted">{h.meta}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
