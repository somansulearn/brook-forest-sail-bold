import { o as __toESM } from "../_runtime.mjs";
import { C as newId, S as isBrowserDb, T as todayISO, _ as gstModeForCustomer, c as cn, f as financialYear, h as formatInvoiceNo, i as Button, w as nowISO, x as getDb } from "./pdf-invoice-Do2ulir-.mjs";
import { C as require_react, S as require_jsx_runtime, d as DialogContent$1, f as DialogOverlay$1, l as Dialog$1, m as DialogTitle$1, p as DialogPortal$1, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as createRootRoute, b as useRouter, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as Label, r as committedByItem, t as Input } from "./label-D5uVcG4K.mjs";
import { c as drawDefaultLogo, i as archiveStockItem, n as DEFAULT_SETTINGS, t as Textarea } from "./textarea-DRnCtecN.mjs";
import { a as Search, r as TriangleAlert, t as X } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dialog-X6P-cQ-R.js
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-fg/40", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-surface p-5 text-fg shadow-[var(--shadow-border)]", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 rounded-sm p-2 text-muted hover:bg-chip hover:text-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("text-lg font-semibold tracking-tight", className),
		...props
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-6A73UUKC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-danger",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function LogoMark({ className = "size-10" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 64 64",
		className,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "32",
				r: "30",
				fill: "#1e4d4a"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "32",
				r: "26.5",
				fill: "#f4f1eb"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "32",
				r: "24",
				fill: "#1e4d4a"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "32",
				y: "36",
				textAnchor: "middle",
				fill: "#f4f1eb",
				fontFamily: "Segoe UI, IBM Plex Sans, sans-serif",
				fontSize: "15",
				fontWeight: "700",
				letterSpacing: "0.04em",
				children: "SAW"
			})
		]
	});
}
var NAV = [
	{
		to: "/",
		label: "Home",
		exact: true
	},
	{
		to: "/stock",
		label: "Stock"
	},
	{
		to: "/customers",
		label: "Customers"
	},
	{
		to: "/bill",
		label: "Bill"
	},
	{
		to: "/bills",
		label: "History"
	},
	{
		to: "/day-end",
		label: "Day-end"
	},
	{
		to: "/settings",
		label: "Settings"
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (pathname.includes("/print")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "no-print sticky top-0 z-40 border-b border-border bg-bg-elevated/95 backdrop-blur-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2.5 lg:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex min-h-11 shrink-0 items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "size-9" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden leading-tight sm:block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-semibold tracking-tight",
								children: "Samriddhi Auto Works"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[11px] tracking-[0.14em] text-muted uppercase",
								children: "Workshop OS"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex",
						children: NAV.map((item) => {
							const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.to,
								search: item.to === "/bill" ? { phone: void 0 } : void 0,
								className: cn("rounded-sm px-3 py-2 text-sm font-medium", active ? "bg-chip text-fg" : "text-muted hover:bg-chip/70 hover:text-fg"),
								children: item.label
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalSearch, {})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex gap-1 overflow-x-auto border-t border-border px-3 py-1.5 md:hidden",
				children: NAV.map((item) => {
					const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						className: cn("shrink-0 rounded-full px-3 py-2 text-xs font-medium", active ? "bg-primary text-primary-fg" : "bg-chip text-fg"),
						children: item.label
					}, item.to);
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-[1400px] px-4 py-6 lg:px-6 lg:py-8",
			children
		})]
	});
}
function GlobalSearch() {
	const [q, setQ] = (0, import_react.useState)("");
	const customers = useLiveQuery(() => getDb().customers.toArray()) ?? [];
	const vehicles = useLiveQuery(() => getDb().vehicles.toArray()) ?? [];
	const bills = useLiveQuery(() => getDb().bills.toArray()) ?? [];
	const hits = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase().replace(/\s+/g, "");
		if (needle.length < 2) return [];
		const out = [];
		for (const c of customers) if (c.phone.replace(/\s+/g, "").includes(needle) || c.name.toLowerCase().includes(q.trim().toLowerCase())) out.push({
			key: `c-${c.id}`,
			title: c.name,
			meta: c.phone,
			to: "/customers/$customerId",
			params: { customerId: c.id }
		});
		for (const v of vehicles) if (v.vehicleNo.toLowerCase().replace(/\s+/g, "").includes(needle)) out.push({
			key: `v-${v.id}`,
			title: v.vehicleNo,
			meta: v.modelYear,
			to: "/customers/$customerId",
			params: { customerId: v.customerId }
		});
		for (const b of bills) {
			const phone = b.phone.replace(/\s+/g, "");
			const veh = b.vehicleNo.toLowerCase().replace(/\s+/g, "");
			const inv = (b.invoiceNo ?? "").toLowerCase();
			if (phone.includes(needle) || veh.includes(needle) || inv.includes(needle)) out.push({
				key: `b-${b.id}`,
				title: b.invoiceNo ?? `Saved · ${b.customerName}`,
				meta: `${b.vehicleNo} · ${b.phone}`,
				to: "/bill/$billId",
				params: { billId: b.id }
			});
		}
		return out.slice(0, 8);
	}, [
		q,
		customers,
		vehicles,
		bills
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-40 sm:w-56 lg:w-72",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Phone or vehicle",
				className: "h-11 w-full rounded-sm border border-border bg-surface pr-3 pl-9 text-sm text-fg placeholder:text-subtle"
			}),
			hits.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "absolute top-full right-0 z-50 mt-1 w-72 overflow-hidden rounded-md bg-surface shadow-[var(--shadow-border)]",
				children: hits.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: h.to === "/customers/$customerId" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/customers/$customerId",
					params: { customerId: h.params.customerId },
					onClick: () => setQ(""),
					className: "block px-3 py-2.5 hover:bg-chip",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-medium",
						children: h.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs text-muted",
						children: h.meta
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/bill/$billId",
					params: { billId: h.params.billId },
					onClick: () => setQ(""),
					className: "block px-3 py-2.5 hover:bg-chip",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-medium",
						children: h.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs text-muted",
						children: h.meta
					})]
				}) }, h.key))
			})
		]
	});
}
function daysAgo(n) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() - n);
	return todayISO(d);
}
async function seedIfEmpty() {
	const db = getDb();
	if (await db.settings.get(1)) return;
	const logo = drawDefaultLogo();
	const settings = {
		...DEFAULT_SETTINGS,
		logoDataUrl: logo,
		nextInvoiceNumber: 8
	};
	const items = [
		stock("st-of-kg", "Oil Filter", "OF-KG", "Bosch", "OF-4506", "Kiran Gears", 14, "pcs", 185, 320, "8421"),
		stock("st-of-mt", "Oil Filter", "OF-MT", "Mann", "W 712/75", "Mohan Traders", 3, "pcs", 210, 360, "8421"),
		stock("st-of-km", "Oil Filter", "OF-KM", "Fleetguard", "LF16035", "Krishna Motors", 0, "pcs", 160, 280, "8421"),
		stock("st-af", "Air Filter", "AF-01", "Bosch", "F026400221", "Kiran Gears", 8, "pcs", 240, 420, "8421"),
		stock("st-cf", "Cabin Filter", "CF-01", "Mann", "CUK 2939", "Mohan Traders", 6, "pcs", 310, 540, "8421"),
		stock("st-oil", "Engine Oil 5W-30", "EO-5W30", "Castrol", "MAGNATEC 4L", "Kiran Gears", 22, "ltr", 420, 680, "2710"),
		stock("st-cool", "Coolant", "CL-01", "Prestone", "PS-1L", "Mohan Traders", 11, "ltr", 95, 180, "3820"),
		stock("st-bp-f", "Brake Pad Front", "BP-F", "Brembo", "P 83 072", "Krishna Motors", 4, "set", 980, 1650, "8708"),
		stock("st-bp-r", "Brake Pad Rear", "BP-R", "Brembo", "P 83 073", "Krishna Motors", 5, "set", 860, 1480, "8708"),
		stock("st-sp", "Spark Plug", "SP-01", "NGK", "BKR6E", "Kiran Gears", 36, "pcs", 85, 160, "8511"),
		stock("st-wiper", "Wiper Blade", "WB-22", "Bosch", "AeroTwin 22", "Mohan Traders", 9, "pcs", 220, 390, "8512"),
		stock("st-batt", "Battery 12V 35Ah", "BAT-35", "Exide", "XP800", "Krishna Motors", 2, "pcs", 3850, 5200, "8507"),
		stock("st-clutch", "Clutch Plate", "CLP-01", "Valeo", "826222", "Kiran Gears", 3, "pcs", 1450, 2400, "8708"),
		stock("st-belt", "Timing Belt", "TB-01", "Gates", "TCK305", "Mohan Traders", 2, "pcs", 1180, 1980, "4010"),
		stock("st-plug-w", "Glow Plug", "GP-01", "Bosch", "0250203001", "Kiran Gears", 7, "pcs", 340, 560, "8511")
	];
	const customers = [
		{
			id: "cu-1",
			name: "Ankit Sharma",
			phone: "9810011122",
			address: "B-12, Rajouri Garden, New Delhi 110027",
			email: "ankit.sharma@email.com",
			gstin: "",
			createdAt: nowISO()
		},
		{
			id: "cu-2",
			name: "Neha Gupta",
			phone: "9876543210",
			address: "14, Sector 15, Dwarka, New Delhi 110078",
			email: "neha.gupta@email.com",
			gstin: "",
			createdAt: nowISO()
		},
		{
			id: "cu-3",
			name: "Capital Fleet Services",
			phone: "01143322110",
			address: "Okhla Phase II, New Delhi 110020",
			email: "accounts@capitalfleet.in",
			gstin: "07AADCC9988B1Z2",
			createdAt: nowISO()
		},
		{
			id: "cu-4",
			name: "Rohit Mehra",
			phone: "9999900011",
			address: "House 8, Punjabi Bagh West, New Delhi 110026",
			email: "",
			gstin: "",
			createdAt: nowISO()
		},
		{
			id: "cu-5",
			name: "Sana Qureshi",
			phone: "9821004455",
			address: "Jama Masjid Road, New Delhi 110006",
			email: "sana.q@email.com",
			gstin: "",
			createdAt: nowISO()
		}
	];
	const vehicles = [
		v("vh-1", "cu-1", "DL3CAB4412", "White", "2019-06-12", "Honda City 2019", 45280),
		v("vh-2", "cu-1", "DL8CAF2291", "Grey", "2022-01-20", "Honda Amaze 2022", 18440),
		v("vh-3", "cu-2", "DL4CAF7788", "Red", "2018-11-04", "Maruti Swift 2018", 61020),
		v("vh-4", "cu-3", "DL1LAA1002", "White", "2021-03-15", "Toyota Innova Crysta 2021", 88210),
		v("vh-5", "cu-3", "DL1LAA1003", "Silver", "2020-08-09", "Hyundai Creta 2020", 54110),
		v("vh-6", "cu-4", "DL9CAC3300", "Blue", "2016-02-28", "Hyundai i20 2016", 97400),
		v("vh-7", "cu-5", "DL2CAG8190", "Black", "2023-05-18", "Tata Nexon 2023", 12150)
	];
	const t0 = todayISO();
	const t1 = daysAgo(1);
	const t3 = daysAgo(3);
	const bills = [
		printedBill({
			id: "bl-1",
			seq: 1,
			date: daysAgo(8),
			customer: customers[0],
			vehicle: vehicles[0],
			km: 44800,
			advisor: "Rajesh Kumar",
			mechanic: "Suresh Yadav",
			remarks: "First service after purchase of used filter lot.",
			settings,
			lines: [
				line("Oil Filter", "part", "st-of-kg", "pcs", 1, 320, 18, "8421"),
				line("Engine Oil 5W-30", "part", "st-oil", "ltr", 4, 680, 18, "2710"),
				line("Engine oil change", "labour", null, "job", 1, 450, 18, "998729")
			]
		}),
		printedBill({
			id: "bl-2",
			seq: 2,
			date: t3,
			customer: customers[2],
			vehicle: vehicles[3],
			km: 87900,
			advisor: "Amit Verma",
			mechanic: "Vikram Singh",
			remarks: "Fleet vehicle — brake noise reported.",
			settings,
			lines: [
				line("Brake Pad Front", "part", "st-bp-f", "set", 1, 1650, 18, "8708"),
				line("Brake Pad Rear", "part", "st-bp-r", "set", 1, 1480, 18, "8708"),
				line("Brake job + inspection", "labour", null, "job", 1, 1200, 18, "998729")
			]
		}),
		printedBill({
			id: "bl-3",
			seq: 3,
			date: t1,
			customer: customers[1],
			vehicle: vehicles[2],
			km: 60810,
			advisor: "Rajesh Kumar",
			mechanic: "Ravi Pal",
			remarks: "",
			settings,
			lines: [
				line("Air Filter", "part", "st-af", "pcs", 1, 420, 18, "8421"),
				line("Cabin Filter", "part", "st-cf", "pcs", 1, 540, 18, "8421"),
				line("AC service", "labour", null, "job", 1, 800, 18, "998729")
			]
		}),
		printedBill({
			id: "bl-4",
			seq: 4,
			date: t1,
			customer: customers[4],
			vehicle: vehicles[6],
			km: 11890,
			advisor: "Amit Verma",
			mechanic: "Suresh Yadav",
			remarks: "Pickup warranty check — no warranty claim.",
			settings,
			lines: [line("Spark Plug", "part", "st-sp", "pcs", 4, 160, 18, "8511"), line("Tune-up", "labour", null, "job", 1, 600, 18, "998729")]
		}),
		printedBill({
			id: "bl-5",
			seq: 5,
			date: t0,
			customer: customers[3],
			vehicle: vehicles[5],
			km: 97120,
			advisor: "Rajesh Kumar",
			mechanic: "Vikram Singh",
			remarks: "Customer waiting.",
			settings,
			paymentMode: "upi",
			amountReceived: 3186,
			lines: [
				line("Wiper Blade", "part", "st-wiper", "pcs", 2, 390, 18, "8512"),
				line("Coolant", "part", "st-cool", "ltr", 2, 180, 18, "3820"),
				line("Top-up and fitment", "labour", null, "job", 1, 250, 18, "998729")
			]
		}),
		printedBill({
			id: "bl-6",
			seq: 6,
			date: t0,
			customer: customers[2],
			vehicle: vehicles[4],
			km: 54e3,
			advisor: "Amit Verma",
			mechanic: "Ravi Pal",
			remarks: "Outside part supplied by customer — no stock.",
			settings,
			paymentMode: "cash",
			amountReceived: 0,
			lines: [line("Wheel alignment sensor (outside)", "part", null, "pcs", 1, 2200, 18, ""), line("Diagnostic labour", "labour", null, "job", 1, 900, 18, "998729")]
		}),
		printedBill({
			id: "bl-7",
			seq: 7,
			date: t0,
			customer: customers[0],
			vehicle: vehicles[1],
			km: 18440,
			advisor: "Rajesh Kumar",
			mechanic: "Suresh Yadav",
			remarks: "",
			settings,
			paymentMode: "card",
			amountReceived: 1500,
			lines: [
				line("Oil Filter", "part", "st-of-mt", "pcs", 1, 360, 18, "8421"),
				line("Engine Oil 5W-30", "part", "st-oil", "ltr", 3.5, 680, 18, "2710"),
				line("Oil change", "labour", null, "job", 1, 450, 18, "998729")
			]
		}),
		savedBill({
			id: "bl-8",
			date: t0,
			customer: customers[1],
			vehicle: vehicles[2],
			km: 61020,
			advisor: "Amit Verma",
			mechanic: "Vikram Singh",
			remarks: "Waiting for clutch plate — confirm with Mohan Traders.",
			settings,
			lines: [line("Clutch Plate", "part", "st-clutch", "pcs", 1, 2400, 18, "8708"), line("Clutch overhaul", "labour", null, "job", 1, 1800, 18, "998729")]
		}),
		savedBill({
			id: "bl-9",
			date: t0,
			customer: customers[4],
			vehicle: vehicles[6],
			km: 12150,
			advisor: "Rajesh Kumar",
			mechanic: "Ravi Pal",
			remarks: "Customer may add battery.",
			settings,
			lines: [line("Battery 12V 35Ah", "part", "st-batt", "pcs", 1, 5200, 18, "8507"), line("Battery fitment", "labour", null, "job", 1, 300, 18, "998729")]
		})
	];
	const movements = [];
	for (const item of items) if (item.qty > 0) movements.push({
		id: newId(),
		itemId: item.id,
		type: "IN",
		qty: item.qty + openingOut(item.id, bills),
		date: daysAgo(20),
		supplier: item.supplier,
		purchaseRate: item.purchaseAmt,
		billId: null,
		invoiceNo: null,
		purchaseRef: "OPN-001",
		reason: "Opening stock",
		createdAt: nowISO()
	});
	else movements.push({
		id: newId(),
		itemId: item.id,
		type: "IN",
		qty: openingOut(item.id, bills) || 2,
		date: daysAgo(20),
		supplier: item.supplier,
		purchaseRate: item.purchaseAmt,
		billId: null,
		invoiceNo: null,
		purchaseRef: "OPN-001",
		reason: "Opening stock",
		createdAt: nowISO()
	});
	for (const bill of bills) {
		const committed = committedByItem(bill.lines);
		for (const [itemId, qty] of Object.entries(committed)) movements.push({
			id: newId(),
			itemId,
			type: "OUT",
			qty,
			date: bill.date,
			supplier: "",
			purchaseRate: null,
			billId: bill.id,
			invoiceNo: bill.invoiceNo,
			purchaseRef: "",
			reason: bill.status === "printed" ? `Invoice ${bill.invoiceNo}` : "Saved bill",
			createdAt: bill.updatedAt
		});
	}
	await db.transaction("rw", [
		db.settings,
		db.stockItems,
		db.stockMovements,
		db.customers,
		db.vehicles,
		db.bills
	], async () => {
		await db.settings.put(settings);
		await db.stockItems.bulkAdd(items);
		await db.stockMovements.bulkAdd(movements);
		await db.customers.bulkAdd(customers);
		await db.vehicles.bulkAdd(vehicles);
		await db.bills.bulkAdd(bills);
	});
}
function stock(id, displayName, sku, brand, productCode, supplier, qty, unit, purchaseAmt, saleAmt, hsn, reorderQty = null) {
	return {
		id,
		displayName,
		sku,
		brand,
		productCode,
		supplier,
		qty,
		unit,
		purchaseAmt,
		saleAmt,
		reorderQty,
		hsn,
		archived: 0,
		createdAt: nowISO()
	};
}
function v(id, customerId, vehicleNo, colour, registrationDate, modelYear, lastKm) {
	return {
		id,
		customerId,
		vehicleNo,
		colour,
		registrationDate,
		modelYear,
		lastKm
	};
}
function line(name, type, stockItemId, unit, qty, rate, gstPct, hsnSac) {
	return {
		id: newId(),
		name,
		type,
		stockItemId,
		hsnSac,
		qty,
		unit,
		rate,
		gstPct,
		stockOverride: false,
		stockOverrideReason: ""
	};
}
function printedBill(opts) {
	const gstMode = gstModeForCustomer(opts.settings.stateCode, opts.customer.gstin);
	const ts = `${opts.date}T10:30:00.000Z`;
	return {
		id: opts.id,
		status: "printed",
		date: opts.date,
		invoiceNo: formatInvoiceNo(opts.settings.invoicePrefix, opts.seq),
		invoiceSeq: opts.seq,
		fy: financialYear(opts.date),
		vehicleNo: opts.vehicle.vehicleNo,
		colour: opts.vehicle.colour,
		regDate: opts.vehicle.registrationDate,
		modelYear: opts.vehicle.modelYear,
		currentKm: opts.km,
		customerId: opts.customer.id,
		customerName: opts.customer.name,
		phone: opts.customer.phone,
		address: opts.customer.address,
		email: opts.customer.email,
		customerGstin: opts.customer.gstin,
		advisor: opts.advisor,
		mechanic: opts.mechanic,
		remarks: opts.remarks,
		gstEnabled: true,
		placeOfSupplyState: opts.settings.state,
		placeOfSupplyCode: opts.settings.stateCode,
		gstMode,
		paymentMode: opts.paymentMode ?? "cash",
		amountReceived: opts.amountReceived ?? 0,
		lines: opts.lines,
		committedStock: committedByItem(opts.lines),
		createdAt: ts,
		updatedAt: ts,
		printedAt: ts
	};
}
function savedBill(opts) {
	const gstMode = gstModeForCustomer(opts.settings.stateCode, opts.customer.gstin);
	const ts = nowISO();
	return {
		id: opts.id,
		status: "saved",
		date: opts.date,
		invoiceNo: null,
		invoiceSeq: null,
		fy: null,
		vehicleNo: opts.vehicle.vehicleNo,
		colour: opts.vehicle.colour,
		regDate: opts.vehicle.registrationDate,
		modelYear: opts.vehicle.modelYear,
		currentKm: opts.km,
		customerId: opts.customer.id,
		customerName: opts.customer.name,
		phone: opts.customer.phone,
		address: opts.customer.address,
		email: opts.customer.email,
		customerGstin: opts.customer.gstin,
		advisor: opts.advisor,
		mechanic: opts.mechanic,
		remarks: opts.remarks,
		gstEnabled: true,
		placeOfSupplyState: opts.settings.state,
		placeOfSupplyCode: opts.settings.stateCode,
		gstMode,
		paymentMode: "",
		amountReceived: 0,
		lines: opts.lines,
		committedStock: committedByItem(opts.lines),
		createdAt: ts,
		updatedAt: ts,
		printedAt: null
	};
}
function openingOut(itemId, bills) {
	let n = 0;
	for (const b of bills) n += b.committedStock[itemId] ?? 0;
	return n;
}
var bootPromise = null;
function bootstrapWorkshop() {
	if (!isBrowserDb()) return Promise.resolve();
	if (!bootPromise) bootPromise = (async () => {
		await getDb().open();
		await seedIfEmpty();
		const settings = await getDb().settings.get(1);
		if (settings && !settings.logoDataUrl) {
			const logo = drawDefaultLogo();
			if (logo) await getDb().settings.update(1, { logoDataUrl: logo });
		}
		if (!await getDb().settings.get(1)) await getDb().settings.put({
			...DEFAULT_SETTINGS,
			logoDataUrl: drawDefaultLogo()
		});
	})();
	return bootPromise;
}
var WorkshopCtx = (0, import_react.createContext)({
	ready: false,
	error: null
});
if (typeof indexedDB !== "undefined") bootstrapWorkshop();
function WorkshopProvider({ children }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		bootstrapWorkshop().then(() => {
			if (!cancelled) setReady(true);
		}).catch((err) => {
			if (!cancelled) setError(err instanceof Error ? err.message : "Could not open workshop data.");
		});
		return () => {
			cancelled = true;
		};
	}, []);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-bg px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold",
				children: "Workshop data could not open"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: error
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkshopCtx.Provider, {
		value: {
			ready,
			error
		},
		children
	});
}
var styles_default = "/assets/styles-F7cUDfaN.css";
var APP_NAME = "Samriddhi Workshop OS";
var Route$14 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#1e4d4a"
			},
			{
				name: "description",
				content: "Offline workshop OS for Samriddhi Auto Works — stock, customers, and GST invoices."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: Root,
	notFoundComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl font-semibold",
			children: "Page not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "That screen is not in Workshop OS."
		})]
	})
});
function Root() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkshopProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "bottom-right",
				toastOptions: { className: "font-[inherit] text-sm" }
			})] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$13 = () => import("./routes-Cbjc3jjl.mjs");
var Route$13 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./backup-nq3V_Cj5.mjs");
var Route$12 = createFileRoute("/backup")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./bill-gyEZwI_l.mjs");
var Route$11 = createFileRoute("/bill")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./bills-Bmh4aIr9.mjs");
var Route$10 = createFileRoute("/bills")({
	validateSearch: (s) => ({
		status: typeof s.status === "string" ? s.status : void 0,
		when: typeof s.when === "string" ? s.when : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./customers-BI08mUkN.mjs");
var Route$9 = createFileRoute("/customers")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
function CustomerDialog({ open, onOpenChange, initial, initialVehicles, onSave }) {
	const [name, setName] = (0, import_react.useState)(initial?.name ?? "");
	const [phone, setPhone] = (0, import_react.useState)(initial?.phone ?? "");
	const [address, setAddress] = (0, import_react.useState)(initial?.address ?? "");
	const [email, setEmail] = (0, import_react.useState)(initial?.email ?? "");
	const [gstin, setGstin] = (0, import_react.useState)(initial?.gstin ?? "");
	const [vehicles, setVehicles] = (0, import_react.useState)(initialVehicles?.length ? initialVehicles : [{
		id: newId(),
		vehicleNo: "",
		colour: "",
		registrationDate: "",
		modelYear: "",
		lastKm: null
	}]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setName(initial?.name ?? "");
		setPhone(initial?.phone ?? "");
		setAddress(initial?.address ?? "");
		setEmail(initial?.email ?? "");
		setGstin(initial?.gstin ?? "");
		setVehicles(initialVehicles?.length ? initialVehicles : [{
			id: newId(),
			vehicleNo: "",
			colour: "",
			registrationDate: "",
			modelYear: "",
			lastKm: null
		}]);
	}, [open, initial?.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90dvh] overflow-y-auto sm:max-w-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: initial ? "Edit customer" : "New customer" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3",
				onSubmit: (e) => {
					e.preventDefault();
					onSave({
						id: initial?.id ?? newId(),
						name,
						phone,
						address,
						email,
						gstin: gstin.toUpperCase()
					}, vehicles);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: address,
							onChange: (e) => setAddress(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: email,
								onChange: (e) => setEmail(e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "GSTIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: gstin,
								onChange: (e) => setGstin(e.target.value.toUpperCase())
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Vehicles" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: "outline",
								onClick: () => setVehicles((vs) => [...vs, {
									id: newId(),
									vehicleNo: "",
									colour: "",
									registrationDate: "",
									modelYear: "",
									lastKm: null
								}]),
								children: "Add vehicle"
							})]
						}), vehicles.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 rounded-md bg-chip/60 p-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Vehicle no *",
									value: v.vehicleNo,
									onChange: (e) => setVehicles((vs) => vs.map((x, j) => j === i ? {
										...x,
										vehicleNo: e.target.value
									} : x))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Colour",
									value: v.colour,
									onChange: (e) => setVehicles((vs) => vs.map((x, j) => j === i ? {
										...x,
										colour: e.target.value
									} : x))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Model / year",
									value: v.modelYear,
									onChange: (e) => setVehicles((vs) => vs.map((x, j) => j === i ? {
										...x,
										modelYear: e.target.value
									} : x))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: v.registrationDate,
									onChange: (e) => setVehicles((vs) => vs.map((x, j) => j === i ? {
										...x,
										registrationDate: e.target.value
									} : x))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									placeholder: "Last KM",
									value: v.lastKm ?? "",
									onChange: (e) => setVehicles((vs) => vs.map((x, j) => j === i ? {
										...x,
										lastKm: e.target.value === "" ? null : Number(e.target.value)
									} : x))
								})
							]
						}, v.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Save customer"
					})
				]
			})]
		})
	});
}
var $$splitComponentImporter$8 = () => import("./day-end-DDkCPWFa.mjs");
var Route$8 = createFileRoute("/day-end")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./settings-BNYJra32.mjs");
var Route$7 = createFileRoute("/settings")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./stock-DSBQ2Nmv.mjs");
var Route$6 = createFileRoute("/stock")({
	validateSearch: (s) => ({
		filter: typeof s.filter === "string" ? s.filter : void 0,
		q: typeof s.q === "string" ? s.q : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
function ItemDialog({ open, item, onOpenChange, onSave }) {
	const [form, setForm] = (0, import_react.useState)(item);
	const [reorderBlank, setReorderBlank] = (0, import_react.useState)(item?.reorderQty == null);
	const persisted = Boolean(item?.createdAt);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setForm(item);
		setReorderBlank(item?.reorderQty == null);
	}, [open, item?.id]);
	function set(key, value) {
		setForm((f) => ({
			...f ?? {},
			[key]: value
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90dvh] overflow-y-auto sm:max-w-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: item?.displayName ? "Edit item" : "New stock item" }) }), form && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3 sm:grid-cols-2",
				onSubmit: (e) => {
					e.preventDefault();
					onSave({
						id: form.id ?? newId(),
						displayName: form.displayName ?? "",
						sku: form.sku ?? "",
						brand: form.brand ?? "",
						productCode: form.productCode ?? "",
						supplier: form.supplier ?? "",
						qty: Number(form.qty ?? 0),
						unit: form.unit ?? "pcs",
						purchaseAmt: Number(form.purchaseAmt ?? 0),
						saleAmt: Number(form.saleAmt ?? 0),
						reorderQty: reorderBlank ? null : Number(form.reorderQty ?? 0),
						hsn: form.hsn ?? "",
						archived: form.archived ?? 0
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1 sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Display name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.displayName ?? "",
							onChange: (e) => set("displayName", e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "SKU" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.sku ?? "",
							onChange: (e) => set("sku", e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.brand ?? "",
							onChange: (e) => set("brand", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Product code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.productCode ?? "",
							onChange: (e) => set("productCode", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Supplier" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.supplier ?? "",
							onChange: (e) => set("supplier", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: persisted ? "Qty on hand (use Inward / Adjust)" : "Opening qty" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: form.qty ?? 0,
							disabled: persisted,
							onChange: (e) => set("qty", Number(e.target.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Unit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.unit ?? "pcs",
							onChange: (e) => set("unit", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Purchase amt" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: form.purchaseAmt ?? 0,
							onChange: (e) => set("purchaseAmt", Number(e.target.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sale amt" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: form.saleAmt ?? 0,
							onChange: (e) => set("saleAmt", Number(e.target.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "HSN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.hsn ?? "",
							onChange: (e) => set("hsn", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reorder (blank = settings default)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: reorderBlank ? "" : form.reorderQty ?? "",
							placeholder: "Default",
							onChange: (e) => {
								if (e.target.value === "") {
									setReorderBlank(true);
									set("reorderQty", null);
								} else {
									setReorderBlank(false);
									set("reorderQty", Number(e.target.value));
								}
							}
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 sm:col-span-2",
						children: [persisted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: async () => {
								const res = await archiveStockItem(form.id);
								if (!res.ok) toast.error(res.error);
								else {
									toast.success("Archived");
									onOpenChange(false);
								}
							},
							children: "Archive"
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Save item"
						})]
					})
				]
			})]
		})
	});
}
var $$splitComponentImporter$5 = () => import("./bill.index-ATIeLve2.mjs");
var Route$5 = createFileRoute("/bill/")({
	validateSearch: (s) => ({ phone: typeof s.phone === "string" ? s.phone : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./bill._billId-B-2y37u_.mjs");
var Route$4 = createFileRoute("/bill/$billId")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./customers._customerId-DKute7P5.mjs");
var Route$3 = createFileRoute("/customers/$customerId")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./stock._itemId-CTdQhhGA.mjs");
var Route$2 = createFileRoute("/stock/$itemId")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./bill._billId.index-Bl4fgLje.mjs");
var Route$1 = createFileRoute("/bill/$billId/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./bill._billId.print-DoEKZCww.mjs");
var Route = createFileRoute("/bill/$billId/print")({
	validateSearch: (s) => ({ autoprint: s.autoprint === true || s.autoprint === "1" || s.autoprint === "true" }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var BackupRoute = Route$12.update({
	id: "/backup",
	path: "/backup",
	getParentRoute: () => Route$14
});
var BillRoute = Route$11.update({
	id: "/bill",
	path: "/bill",
	getParentRoute: () => Route$14
});
var BillsRoute = Route$10.update({
	id: "/bills",
	path: "/bills",
	getParentRoute: () => Route$14
});
var CustomersRoute = Route$9.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => Route$14
});
var DayEndRoute = Route$8.update({
	id: "/day-end",
	path: "/day-end",
	getParentRoute: () => Route$14
});
var SettingsRoute = Route$7.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$14
});
var StockRoute = Route$6.update({
	id: "/stock",
	path: "/stock",
	getParentRoute: () => Route$14
});
var BillIndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => BillRoute
});
var BillBillIdRoute = Route$4.update({
	id: "/$billId",
	path: "/$billId",
	getParentRoute: () => BillRoute
});
var CustomersCustomerIdRoute = Route$3.update({
	id: "/$customerId",
	path: "/$customerId",
	getParentRoute: () => CustomersRoute
});
var StockItemIdRoute = Route$2.update({
	id: "/$itemId",
	path: "/$itemId",
	getParentRoute: () => StockRoute
});
var BillBillIdIndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => BillBillIdRoute
});
var BillBillIdRouteChildren = {
	BillBillIdPrintRoute: Route.update({
		id: "/print",
		path: "/print",
		getParentRoute: () => BillBillIdRoute
	}),
	BillBillIdIndexRoute
};
var BillRouteChildren = {
	BillBillIdRoute: BillBillIdRoute._addFileChildren(BillBillIdRouteChildren),
	BillIndexRoute
};
var BillRouteWithChildren = BillRoute._addFileChildren(BillRouteChildren);
var CustomersRouteChildren = { CustomersCustomerIdRoute };
var CustomersRouteWithChildren = CustomersRoute._addFileChildren(CustomersRouteChildren);
var StockRouteChildren = { StockItemIdRoute };
var rootRouteChildren = {
	IndexRoute,
	BackupRoute,
	BillRoute: BillRouteWithChildren,
	BillsRoute,
	CustomersRoute: CustomersRouteWithChildren,
	DayEndRoute,
	SettingsRoute,
	StockRoute: StockRoute._addFileChildren(StockRouteChildren)
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Route$3 as a, Route$6 as c, LogoMark as d, Dialog as f, DialogTitle as h, Route$2 as i, CustomerDialog as l, DialogHeader as m, Route as n, Route$5 as o, DialogContent as p, Route$1 as r, ItemDialog as s, router_exports as t, Route$10 as u };
