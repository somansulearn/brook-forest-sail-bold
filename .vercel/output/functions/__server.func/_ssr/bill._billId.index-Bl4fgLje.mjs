import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as Route$1 } from "./router-6A73UUKC.mjs";
import { t as BillEditor } from "./bill-editor-CGKeZhkn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bill._billId.index-Bl4fgLje.js
var import_jsx_runtime = require_jsx_runtime();
function EditBillPage() {
	const { billId } = Route$1.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillEditor, { billId });
}
//#endregion
export { EditBillPage as component };
