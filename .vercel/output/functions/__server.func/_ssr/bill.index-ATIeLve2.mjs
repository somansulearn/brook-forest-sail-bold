import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { o as Route$5 } from "./router-6A73UUKC.mjs";
import { t as BillEditor } from "./bill-editor-CGKeZhkn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bill.index-ATIeLve2.js
var import_jsx_runtime = require_jsx_runtime();
function NewBillPage() {
	const { phone } = Route$5.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillEditor, { initialPhone: phone });
}
//#endregion
export { NewBillPage as component };
