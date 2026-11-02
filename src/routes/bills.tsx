import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDb } from "@/lib/workshop/db";
import { formatDateDisplay } from "@/lib/workshop/fy";
import { todayISO } from "@/lib/workshop/ids";
import { computeBill, formatINR } from "@/lib/workshop/money";

type Search = { status?: string; when?: string };

export const Route = createFileRoute("/bills")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    status: typeof s.status === "string" ? s.status : undefined,
    when: typeof s.when === "string" ? s.when : undefined,
  }),
  component: BillsPage,
});

function BillsPage() {
  const { status, when } = Route.useSearch();
  const bills = useLiveQuery(() => getDb().bills.toArray()) ?? [];
  const today = todayISO();

  const rows = useMemo(() => {
    return bills
      .filter((b) => b.status !== "cancelled" || status === "cancelled")
      .filter((b) => (status ? b.status === status : true))
      .filter((b) => (when === "today" ? b.date === today : true))
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.updatedAt.localeCompare(a.updatedAt)));
  }, [bills, status, when, today]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">History</h1>
          <p className="mt-1 text-sm text-muted">Saved jobs and printed invoices.</p>
        </div>
        <Button asChild>
          <Link to="/bill" search={{ phone: undefined }}>
            New bill
          </Link>
        </Button>
      </header>
      <div className="flex flex-wrap gap-2">
        <FilterChip to="/bills" search={{}} active={!status}>
          All
        </FilterChip>
        <FilterChip to="/bills" search={{ status: "saved" }} active={status === "saved"}>
          Saved
        </FilterChip>
        <FilterChip
          to="/bills"
          search={{ status: "printed" }}
          active={status === "printed" && when !== "today"}
        >
          Printed
        </FilterChip>
        <FilterChip
          to="/bills"
          search={{ status: "printed", when: "today" }}
          active={status === "printed" && when === "today"}
        >
          Printed today
        </FilterChip>
      </div>
      <div className="overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No bills in this view.
                </td>
              </tr>
            ) : (
              rows.map((b) => {
                const { totals } = computeBill(b.lines, b.gstEnabled, b.gstMode);
                return (
                  <tr key={b.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3">{formatDateDisplay(b.date)}</td>
                    <td className="px-4 py-3">
                      <Link to="/bill/$billId" params={{ billId: b.id }} className="hover:text-primary">
                        {b.status === "printed" ? (
                          <span className="font-mono">{b.invoiceNo}</span>
                        ) : (
                          <Badge>Saved</Badge>
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{b.customerName}</td>
                    <td className="px-4 py-3 font-mono text-xs">{b.vehicleNo}</td>
                    <td className="px-4 py-3 text-right tabular">{formatINR(totals.grand)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterChip({
  to,
  search,
  active,
  children,
}: {
  to: "/bills";
  search: Search;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      search={search}
      className={
        active
          ? "inline-flex min-h-11 items-center rounded-full bg-primary px-4 text-sm text-primary-fg"
          : "inline-flex min-h-11 items-center rounded-full bg-chip px-4 text-sm text-fg"
      }
    >
      {children}
    </Link>
  );
}
