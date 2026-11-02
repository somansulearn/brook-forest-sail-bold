import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { Printer } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InvoiceSheet } from "@/features/bill/invoice-sheet";
import { getDb } from "@/lib/workshop/db";
import { downloadBlob } from "@/lib/workshop/pdf-invoice";
import { generateInvoicePdf } from "@/lib/workshop/pdf-invoice";
import { invoiceFileName } from "@/lib/workshop/fy";

export const Route = createFileRoute("/bill/$billId/print")({
  validateSearch: (s: Record<string, unknown>): { autoprint: boolean } => ({
    autoprint: s.autoprint === true || s.autoprint === "1" || s.autoprint === "true",
  }),
  component: PrintPage,
});

function PrintPage() {
  const { billId } = Route.useParams();
  const { autoprint } = Route.useSearch();
  const bill = useLiveQuery(() => getDb().bills.get(billId), [billId]);
  const settings = useLiveQuery(() => getDb().settings.get(1));

  useEffect(() => {
    if (!autoprint || !bill || !settings) return;
    const t = window.setTimeout(() => window.print(), 350);
    return () => window.clearTimeout(t);
  }, [autoprint, bill, settings]);

  if (!bill || !settings) {
    return <p className="p-8 text-sm text-muted">Loading print sheet…</p>;
  }

  return (
    <div className="min-h-dvh bg-bg py-6">
      <div className="no-print mx-auto mb-4 flex max-w-[210mm] flex-wrap items-center justify-between gap-2 px-4">
        <Link to="/bill/$billId" params={{ billId }} className="text-sm text-muted hover:text-fg">
          ← Back to bill
        </Link>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              const blob = await generateInvoicePdf(bill, settings);
              const name = bill.invoiceSeq
                ? invoiceFileName(settings.invoicePrefix, bill.invoiceSeq)
                : "invoice.pdf";
              downloadBlob(blob, name);
            }}
          >
            Download PDF
          </Button>
          <Button onClick={() => window.print()}>
            <Printer /> Print
          </Button>
        </div>
      </div>
      <InvoiceSheet bill={bill} settings={settings} />
    </div>
  );
}
