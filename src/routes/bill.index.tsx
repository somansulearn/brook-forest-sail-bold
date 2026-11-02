import { createFileRoute } from "@tanstack/react-router";
import { BillEditor } from "@/features/bill/bill-editor";

export const Route = createFileRoute("/bill/")({
  validateSearch: (s: Record<string, unknown>) => ({
    phone: typeof s.phone === "string" ? s.phone : undefined,
  }),
  component: NewBillPage,
});

function NewBillPage() {
  const { phone } = Route.useSearch();
  return <BillEditor initialPhone={phone} />;
}
