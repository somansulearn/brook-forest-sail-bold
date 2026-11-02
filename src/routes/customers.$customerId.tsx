import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomerDialog } from "./customers";
import { saveCustomer } from "@/lib/workshop/actions";
import { getDb } from "@/lib/workshop/db";
import { formatDateDisplay } from "@/lib/workshop/fy";
import { computeBill, formatINR } from "@/lib/workshop/money";
import type { Bill } from "@/lib/workshop/types";

export const Route = createFileRoute("/customers/$customerId")({
  component: CustomerPage,
});

function CustomerPage() {
  const { customerId } = Route.useParams();
  const customer = useLiveQuery(() => getDb().customers.get(customerId), [customerId]);
  const vehicles =
    useLiveQuery(() => getDb().vehicles.where("customerId").equals(customerId).toArray(), [
      customerId,
    ]) ?? [];
  const bills =
    useLiveQuery(() => getDb().bills.where("customerId").equals(customerId).toArray(), [
      customerId,
    ]) ?? [];
  const [edit, setEdit] = useState(false);

  if (!customer) return <p className="text-muted">Customer not found.</p>;

  return (
    <div className="space-y-6">
      <Link to="/customers" className="text-sm text-muted hover:text-fg">
        ← Customers
      </Link>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{customer.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {customer.phone}
            {customer.gstin ? ` · ${customer.gstin}` : ""}
          </p>
          {customer.address ? <p className="text-sm text-muted">{customer.address}</p> : null}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEdit(true)}>
            Edit
          </Button>
          <Button asChild>
            <Link to="/bill" search={{ phone: customer.phone }}>
              New bill
            </Link>
          </Button>
        </div>
      </header>

      <section className="space-y-3">
        {vehicles.map((v) => {
          const vBills = bills.filter(
            (b) => b.vehicleNo === v.vehicleNo && b.status !== "cancelled",
          );
          return (
            <div key={v.id} className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-mono text-lg font-semibold">{v.vehicleNo}</h2>
                <p className="text-sm text-muted">
                  {[v.modelYear, v.colour, v.lastKm != null ? `${v.lastKm.toLocaleString("en-IN")} km` : ""]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              {v.registrationDate ? (
                <p className="mt-1 text-xs text-muted">Reg {formatDateDisplay(v.registrationDate)}</p>
              ) : null}
              <BillList bills={vBills} />
            </div>
          );
        })}
        {(() => {
          const loose = bills.filter(
            (b) =>
              b.status !== "cancelled" &&
              (!b.vehicleNo || !vehicles.some((v) => v.vehicleNo === b.vehicleNo)),
          );
          if (!loose.length) return null;
          return (
            <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
              <h2 className="text-sm font-semibold">Other jobs</h2>
              <BillList bills={loose} />
            </div>
          );
        })()}
      </section>

      <CustomerDialog
        open={edit}
        onOpenChange={setEdit}
        initial={customer}
        initialVehicles={vehicles}
        onSave={async (c, vs) => {
          const res = await saveCustomer(c, vs);
          if (!res.ok) toast.error(res.error);
          else {
            toast.success("Customer saved");
            setEdit(false);
          }
        }}
      />
    </div>
  );
}

function BillList({ bills }: { bills: Bill[] }) {
  if (bills.length === 0) {
    return <p className="mt-3 text-sm text-muted">No bills for this vehicle.</p>;
  }
  return (
    <ul className="mt-3 divide-y divide-border">
      {bills.map((b) => {
        const { totals } = computeBill(b.lines, b.gstEnabled, b.gstMode);
        return (
          <li key={b.id}>
            <Link
              to="/bill/$billId"
              params={{ billId: b.id }}
              className="flex items-center justify-between py-2.5 text-sm hover:text-primary"
            >
              <span>
                <Badge variant={b.status === "printed" ? "primary" : "default"}>
                  {b.status === "printed" ? b.invoiceNo : "Saved"}
                </Badge>
                <span className="ml-2">{formatDateDisplay(b.date)}</span>
              </span>
              <span className="tabular">{formatINR(totals.grand)}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
