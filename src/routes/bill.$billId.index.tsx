import { createFileRoute } from "@tanstack/react-router";
import { BillEditor } from "@/features/bill/bill-editor";

export const Route = createFileRoute("/bill/$billId/")({
  component: EditBillPage,
});

function EditBillPage() {
  const { billId } = Route.useParams();
  return <BillEditor billId={billId} />;
}
