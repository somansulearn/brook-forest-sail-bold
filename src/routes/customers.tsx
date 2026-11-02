import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveCustomer } from "@/lib/workshop/actions";
import { getDb } from "@/lib/workshop/db";
import { newId } from "@/lib/workshop/ids";
import type { Customer, Vehicle } from "@/lib/workshop/types";

export const Route = createFileRoute("/customers")({ component: CustomersPage });

function CustomersPage() {
  const customers = useLiveQuery(() => getDb().customers.toArray()) ?? [];
  const vehicles = useLiveQuery(() => getDb().vehicles.toArray()) ?? [];
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase().replace(/\s+/g, "");
    return customers
      .map((c) => ({
        ...c,
        vehicles: vehicles.filter((v) => v.customerId === c.id),
      }))
      .filter((c) => {
        if (!needle) return true;
        const hay = [c.name, c.phone, ...c.vehicles.map((v) => v.vehicleNo)]
          .join(" ")
          .toLowerCase()
          .replace(/\s+/g, "");
        return hay.includes(needle);
      });
  }, [customers, vehicles, q]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Customers</h1>
          <p className="mt-1 text-sm text-muted">Search by phone or vehicle number.</p>
        </div>
        <Button onClick={() => setOpen(true)}>New customer</Button>
      </header>
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Phone or vehicle no"
        className="max-w-sm"
      />
      <ul className="divide-y divide-border overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]">
        {rows.length === 0 ? (
          <li className="px-5 py-10 text-center text-sm text-muted">No customers match.</li>
        ) : (
          rows.map((c) => (
            <li key={c.id}>
              <Link
                to="/customers/$customerId"
                params={{ customerId: c.id }}
                className="flex flex-col gap-1 px-5 py-4 hover:bg-chip/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <span>
                  <span className="block font-medium">{c.name}</span>
                  <span className="text-sm text-muted">{c.phone}</span>
                </span>
                <span className="text-sm text-muted">
                  {c.vehicles.length
                    ? c.vehicles.map((v) => v.vehicleNo).join(" · ")
                    : "No vehicle"}
                </span>
              </Link>
            </li>
          ))
        )}
      </ul>
      <CustomerDialog
        open={open}
        onOpenChange={setOpen}
        onSave={async (c, vs) => {
          const res = await saveCustomer(c, vs);
          if (!res.ok) toast.error(res.error);
          else {
            toast.success("Customer saved");
            setOpen(false);
          }
        }}
      />
    </div>
  );
}

export function CustomerDialog({
  open,
  onOpenChange,
  initial,
  initialVehicles,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Customer;
  initialVehicles?: Vehicle[];
  onSave: (c: Omit<Customer, "createdAt">, vs: Omit<Vehicle, "customerId">[]) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [gstin, setGstin] = useState(initial?.gstin ?? "");
  const [vehicles, setVehicles] = useState<Omit<Vehicle, "customerId">[]>(
    initialVehicles?.length
      ? initialVehicles
      : [
          {
            id: newId(),
            vehicleNo: "",
            colour: "",
            registrationDate: "",
            modelYear: "",
            lastKm: null,
          },
        ],
  );

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setPhone(initial?.phone ?? "");
    setAddress(initial?.address ?? "");
    setEmail(initial?.email ?? "");
    setGstin(initial?.gstin ?? "");
    setVehicles(
      initialVehicles?.length
        ? initialVehicles
        : [
            {
              id: newId(),
              vehicleNo: "",
              colour: "",
              registrationDate: "",
              modelYear: "",
              lastKm: null,
            },
          ],
    );
  }, [open, initial?.id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit customer" : "New customer"}</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            void onSave(
              {
                id: initial?.id ?? newId(),
                name,
                phone,
                address,
                email,
                gstin: gstin.toUpperCase(),
              },
              vehicles,
            );
          }}
        >
          <label className="grid gap-1">
            <Label>Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="grid gap-1">
            <Label>Phone *</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </label>
          <label className="grid gap-1">
            <Label>Address</Label>
            <Textarea value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="grid gap-1">
              <Label>GSTIN</Label>
              <Input value={gstin} onChange={(e) => setGstin(e.target.value.toUpperCase())} />
            </label>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Vehicles</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  setVehicles((vs) => [
                    ...vs,
                    {
                      id: newId(),
                      vehicleNo: "",
                      colour: "",
                      registrationDate: "",
                      modelYear: "",
                      lastKm: null,
                    },
                  ])
                }
              >
                Add vehicle
              </Button>
            </div>
            {vehicles.map((v, i) => (
              <div key={v.id} className="grid gap-2 rounded-md bg-chip/60 p-3 sm:grid-cols-2">
                <Input
                  placeholder="Vehicle no *"
                  value={v.vehicleNo}
                  onChange={(e) =>
                    setVehicles((vs) =>
                      vs.map((x, j) => (j === i ? { ...x, vehicleNo: e.target.value } : x)),
                    )
                  }
                />
                <Input
                  placeholder="Colour"
                  value={v.colour}
                  onChange={(e) =>
                    setVehicles((vs) =>
                      vs.map((x, j) => (j === i ? { ...x, colour: e.target.value } : x)),
                    )
                  }
                />
                <Input
                  placeholder="Model / year"
                  value={v.modelYear}
                  onChange={(e) =>
                    setVehicles((vs) =>
                      vs.map((x, j) => (j === i ? { ...x, modelYear: e.target.value } : x)),
                    )
                  }
                />
                <Input
                  type="date"
                  value={v.registrationDate}
                  onChange={(e) =>
                    setVehicles((vs) =>
                      vs.map((x, j) =>
                        j === i ? { ...x, registrationDate: e.target.value } : x,
                      ),
                    )
                  }
                />
                <Input
                  type="number"
                  placeholder="Last KM"
                  value={v.lastKm ?? ""}
                  onChange={(e) =>
                    setVehicles((vs) =>
                      vs.map((x, j) =>
                        j === i
                          ? { ...x, lastKm: e.target.value === "" ? null : Number(e.target.value) }
                          : x,
                      ),
                    )
                  }
                />
              </div>
            ))}
          </div>
          <Button type="submit">Save customer</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
