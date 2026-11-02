import { o as __toESM } from "../_runtime.mjs";
import { c as cn } from "./pdf-invoice-Do2ulir-.mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stock-engine-jIMloBP1.js
function committedByItem(lines) {
	const out = {};
	for (const line of lines) {
		if (line.type !== "part" || !line.stockItemId) continue;
		if (!(line.qty > 0)) continue;
		out[line.stockItemId] = (out[line.stockItemId] ?? 0) + line.qty;
	}
	return out;
}
/** Positive delta = additional OUT. Negative = return to stock. */
function stockDiffs(prev, next) {
	const ids = /* @__PURE__ */ new Set([...Object.keys(prev), ...Object.keys(next)]);
	const diffs = [];
	for (const id of ids) {
		const delta = (next[id] ?? 0) - (prev[id] ?? 0);
		if (delta !== 0) diffs.push({
			itemId: id,
			delta
		});
	}
	return diffs;
}
function reorderOf(item, defaultReorder) {
	return item.reorderQty == null ? defaultReorder : item.reorderQty;
}
function stockStatus(qty, reorder) {
	if (qty <= 0) return "critical";
	if (qty <= reorder) return "low";
	return "ok";
}
/**
* Available qty for this bill = on-hand + already committed on this bill
* (on-hand already reflects the previous save).
*/
function findShortages(nextCommitted, prevCommitted, itemsById, lines) {
	const overridden = new Set(lines.filter((l) => l.stockOverride && l.stockItemId).map((l) => l.stockItemId));
	const shortages = [];
	for (const [itemId, needed] of Object.entries(nextCommitted)) {
		if (overridden.has(itemId)) continue;
		const item = itemsById.get(itemId);
		if (!item) continue;
		const available = item.qty + (prevCommitted[itemId] ?? 0);
		if (needed > available + 1e-9) shortages.push({
			itemId,
			name: item.displayName,
			needed,
			onHand: available
		});
	}
	return shortages;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/label-D5uVcG4K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	className: cn("flex h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-subtle file:border-0 file:bg-transparent file:text-sm disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Input.displayName = "Input";
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("text-xs font-medium uppercase tracking-[0.08em] text-muted", className),
	...props
}));
Label.displayName = "Label";
//#endregion
export { reorderOf as a, findShortages as i, Label as n, stockDiffs as o, committedByItem as r, stockStatus as s, Input as t };
