import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bill")({
  component: BillLayout,
});

function BillLayout() {
  return <Outlet />;
}
