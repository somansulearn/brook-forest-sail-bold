import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bill/$billId")({
  component: BillIdLayout,
});

function BillIdLayout() {
  return <Outlet />;
}
