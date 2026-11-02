import { o as __toESM } from "../_runtime.mjs";
import { C as newId, i as Button, x as getDb } from "./pdf-invoice-Do2ulir-.mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Label, t as Input } from "./label-D5uVcG4K.mjs";
import { p as saveCustomer, t as Textarea } from "./textarea-DRnCtecN.mjs";
import { f as Dialog, h as DialogTitle, m as DialogHeader, p as DialogContent } from "./router-6A73UUKC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers-BI08mUkN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomersPage() {
	const customers = useLiveQuery(() => getDb().customers.toArray()) ?? [];
	const vehicles = useLiveQuery(() => getDb().vehicles.toArray()) ?? [];
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const rows = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase().replace(/\s+/g, "");
		return customers.map((c) => ({
			...c,
			vehicles: vehicles.filter((v) => v.customerId === c.id)
		})).filter((c) => {
			if (!needle) return true;
			return [
				c.name,
				c.phone,
				...c.vehicles.map((v) => v.vehicleNo)
			].join(" ").toLowerCase().replace(/\s+/g, "").includes(needle);
		});
	}, [
		customers,
		vehicles,
		q
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold tracking-tight",
					children: "Customers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Search by phone or vehicle number."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setOpen(true),
					children: "New customer"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Phone or vehicle no",
				className: "max-w-sm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]",
				children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-5 py-10 text-center text-sm text-muted",
					children: "No customers match."
				}) : rows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/customers/$customerId",
					params: { customerId: c.id },
					className: "flex flex-col gap-1 px-5 py-4 hover:bg-chip/60 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-medium",
						children: c.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: c.phone
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: c.vehicles.length ? c.vehicles.map((v) => v.vehicleNo).join(" · ") : "No vehicle"
					})]
				}) }, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerDialog, {
				open,
				onOpenChange: setOpen,
				onSave: async (c, vs) => {
					const res = await saveCustomer(c, vs);
					if (!res.ok) toast.error(res.error);
					else {
						toast.success("Customer saved");
						setOpen(false);
					}
				}
			})
		]
	});
}
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
//#endregion
export { CustomerDialog, CustomersPage as component };
