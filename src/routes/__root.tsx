import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppShell } from "@/components/layout/app-shell";
import { WorkshopProvider } from "@/components/layout/workshop-provider";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

const APP_NAME = "Samriddhi Workshop OS";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#1e4d4a" },
      {
        name: "description",
        content: "Offline workshop OS for Samriddhi Auto Works — stock, customers, and GST invoices.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: Root,
  notFoundComponent: () => (
    <div className="py-24 text-center">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-muted">That screen is not in Workshop OS.</p>
    </div>
  ),
});

function Root() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <WorkshopProvider>
            <AppShell>
              <Outlet />
            </AppShell>
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: "font-[inherit] text-sm",
              }}
            />
          </WorkshopProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
