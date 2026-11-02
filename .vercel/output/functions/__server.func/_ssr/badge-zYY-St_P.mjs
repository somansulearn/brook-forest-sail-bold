import { c as cn } from "./pdf-invoice-Do2ulir-.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-zYY-St_P.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "border-border bg-chip text-fg",
		ok: "border-ok/30 bg-ok/10 text-ok",
		low: "border-warn/30 bg-warn/10 text-warn",
		critical: "border-danger/30 bg-danger/10 text-danger",
		primary: "border-primary/30 bg-primary/10 text-primary"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Badge as t };
