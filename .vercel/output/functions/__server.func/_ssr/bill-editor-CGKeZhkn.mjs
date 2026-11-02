import { o as __toESM } from "../_runtime.mjs";
import { _ as gstModeForCustomer, c as cn, d as defaultGstForType, i as Button, l as computeBill, m as formatINR, r as printedName, s as buttonVariants, t as downloadBlob, x as getDb } from "./pdf-invoice-Do2ulir-.mjs";
import { C as require_react, S as require_jsx_runtime, a as Overlay2, c as Title2, i as Description2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Label, t as Input } from "./label-D5uVcG4K.mjs";
import { a as billToDraft, d as printBill, f as saveBill, l as emptyBillDraft, o as blankLine, s as cancelBill, t as Textarea } from "./textarea-DRnCtecN.mjs";
import { c as Plus, i as Trash2, o as Save, s as Printer } from "../_libs/lucide-react.mjs";
import { f as Dialog, h as DialogTitle, m as DialogHeader, p as DialogContent } from "./router-6A73UUKC.mjs";
import { t as Badge } from "./badge-zYY-St_P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bill-editor-CGKeZhkn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
function AlertDialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
		className: cn("fixed inset-0 z-50 bg-fg/40", className),
		...props
	});
}
function AlertDialogContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		className: cn("fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-surface p-5 text-fg shadow-[var(--shadow-border)]", className),
		...props
	})] });
}
function AlertDialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1", className),
		...props
	});
}
function AlertDialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
		className: cn("text-lg font-semibold", className),
		...props
	});
}
function AlertDialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
		className: cn("text-sm text-muted", className),
		...props
	});
}
function AlertDialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
function AlertDialogAction({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
		className: cn(buttonVariants(), className),
		...props
	});
}
function AlertDialogCancel({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
		className: cn(buttonVariants({ variant: "outline" }), className),
		...props
	});
}
function BillEditor({ billId, initialPhone }) {
	const navigate = useNavigate();
	const settings = useLiveQuery(() => getDb().settings.get(1));
	const stored = useLiveQuery(async () => {
		if (!billId) return void 0;
		return await getDb().bills.get(billId);
	}, [billId]);
	const customers = useLiveQuery(() => getDb().customers.toArray()) ?? [];
	const vehicles = useLiveQuery(() => getDb().vehicles.toArray()) ?? [];
	const stock = useLiveQuery(() => getDb().stockItems.toArray()) ?? [];
	const [draft, setDraft] = (0, import_react.useState)(() => billId ? null : {
		...emptyBillDraft(),
		phone: initialPhone ?? ""
	});
	const [picker, setPicker] = (0, import_react.useState)(false);
	const [pickerFor, setPickerFor] = (0, import_react.useState)(null);
	const [shortageOpen, setShortageOpen] = (0, import_react.useState)(false);
	const [shortageMsg, setShortageMsg] = (0, import_react.useState)("");
	const [shortageIds, setShortageIds] = (0, import_react.useState)([]);
	const [composer, setComposer] = (0, import_react.useState)("");
	const [composerType, setComposerType] = (0, import_react.useState)("part");
	const [cancelOpen, setCancelOpen] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (billId && stored) setDraft(billToDraft(stored));
	}, [billId, stored]);
	(0, import_react.useEffect)(() => {
		if (!billId && initialPhone && draft?.phone === initialPhone && !draft.customerName && customers.length) applyMatchFromPhone(initialPhone);
	}, [
		billId,
		initialPhone,
		customers,
		draft?.phone,
		draft?.customerName
	]);
	const locked = stored?.status === "printed";
	const gstOn = stored?.status === "printed" ? stored.gstEnabled : settings?.gstEnabled ?? true;
	const gstMode = gstModeForCustomer(settings?.stateCode ?? "07", draft?.customerGstin ?? "");
	const computed = (0, import_react.useMemo)(() => computeBill(draft?.lines ?? [], gstOn, stored?.gstMode ?? gstMode), [
		draft?.lines,
		gstOn,
		stored?.gstMode,
		gstMode
	]);
	function patch(p) {
		setDraft((d) => d ? {
			...d,
			...p
		} : d);
	}
	function setLine(id, p) {
		setDraft((d) => d ? {
			...d,
			lines: d.lines.map((l) => l.id === id ? {
				...l,
				...p
			} : l)
		} : d);
	}
	function applyMatchFromPhone(phone) {
		const c = customers.find((x) => x.phone.replace(/\s+/g, "") === phone.replace(/\s+/g, ""));
		if (!c) return;
		const v = vehicles.filter((v) => v.customerId === c.id)[0];
		patch({
			phone: c.phone,
			customerName: c.name,
			address: c.address,
			email: c.email,
			customerGstin: c.gstin,
			vehicleNo: v?.vehicleNo ?? draft?.vehicleNo ?? "",
			colour: v?.colour ?? draft?.colour ?? "",
			regDate: v?.registrationDate ?? draft?.regDate ?? "",
			modelYear: v?.modelYear ?? draft?.modelYear ?? "",
			currentKm: v?.lastKm ?? draft?.currentKm ?? null
		});
	}
	function applyMatchFromVehicle(no) {
		const v = vehicles.find((x) => x.vehicleNo.toUpperCase() === no.trim().toUpperCase());
		if (!v) return;
		const c = customers.find((x) => x.id === v.customerId);
		patch({
			vehicleNo: v.vehicleNo,
			colour: v.colour,
			regDate: v.registrationDate,
			modelYear: v.modelYear,
			currentKm: v.lastKm,
			customerName: c?.name ?? draft?.customerName ?? "",
			phone: c?.phone ?? draft?.phone ?? "",
			address: c?.address ?? draft?.address ?? "",
			email: c?.email ?? draft?.email ?? "",
			customerGstin: c?.gstin ?? draft?.customerGstin ?? ""
		});
	}
	function addStockLine(item, ontoId) {
		const line = blankLine({
			name: printedName(item.displayName),
			type: "part",
			stockItemId: item.id,
			hsnSac: item.hsn,
			qty: 1,
			unit: item.unit,
			rate: item.saleAmt,
			gstPct: settings ? defaultGstForType("part", settings) : 18
		});
		setDraft((d) => {
			if (!d) return d;
			if (ontoId) return {
				...d,
				lines: d.lines.map((l) => l.id === ontoId ? {
					...line,
					id: l.id
				} : l)
			};
			return {
				...d,
				lines: [...d.lines, line]
			};
		});
		setPicker(false);
	}
	function addTypedLine() {
		const name = composer.trim();
		if (!name || !settings) return;
		setDraft((d) => {
			if (!d) return d;
			return {
				...d,
				lines: [...d.lines, blankLine({
					name,
					type: composerType,
					stockItemId: null,
					unit: composerType === "labour" ? "job" : "pcs",
					gstPct: defaultGstForType(composerType, settings)
				})]
			};
		});
		setComposer("");
	}
	async function onSave(opts) {
		if (!draft) return null;
		setBusy(true);
		const payload = {
			...draft,
			allowShortage: opts?.allowShortage ?? draft.allowShortage
		};
		const res = await saveBill(payload);
		setBusy(false);
		if (!res.ok) {
			if (res.shortages?.length) {
				setShortageIds(res.shortages.map((s) => s.itemId));
				setShortageMsg(res.shortages.map((s) => `${s.name}: need ${s.needed}, on hand ${s.onHand}`).join(" · "));
				setShortageOpen(true);
				return null;
			}
			toast.error(res.error);
			return null;
		}
		toast.success("Bill saved — stock updated");
		if (!billId) await navigate({
			to: "/bill/$billId",
			params: { billId: res.data }
		});
		return await getDb().bills.get(res.data) ?? null;
	}
	async function onPrint() {
		if (!draft) return;
		let id = billId;
		if (!locked) {
			const saved = await onSave();
			if (!saved) return;
			id = saved.id;
		}
		if (!id) return;
		setBusy(true);
		const res = await printBill(id);
		setBusy(false);
		if (!res.ok) {
			toast.error(res.error);
			return;
		}
		const file = await getDb().files.get(res.data.path);
		if (file) downloadBlob(file.blob, res.data.path.split("/").pop() ?? "invoice.pdf");
		toast.success(`Printed ${res.data.invoiceNo}`);
		await navigate({
			to: "/bill/$billId/print",
			params: { billId: id },
			search: { autoprint: true }
		});
	}
	if (!draft || !settings) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Loading bill…"
	});
	const phoneHits = draft.phone.length >= 3 ? customers.filter((c) => c.phone.includes(draft.phone.replace(/\s+/g, ""))) : [];
	const vehHits = draft.vehicleNo.length >= 3 ? vehicles.filter((v) => v.vehicleNo.toUpperCase().includes(draft.vehicleNo.toUpperCase())) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold tracking-tight",
					children: locked ? stored?.invoiceNo : "Job / Bill"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: locked ? "Printed and locked. Stock was already deducted on save." : "Save deducts stock. Print assigns the next invoice number and does not deduct again."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						!locked && stored?.status === "saved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setCancelOpen(true),
							children: "Cancel bill"
						}) : null,
						!locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							disabled: busy,
							onClick: () => void onSave(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {}), " Save"]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							disabled: busy,
							onClick: () => void onPrint(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {}), " Print"]
						})
					]
				})]
			}),
			locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary",
				children: [
					"Locked invoice ",
					stored?.invoiceNo,
					". Stock was deducted on save.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/bill/$billId/print",
						params: { billId: stored.id },
						search: { autoprint: false },
						className: "underline underline-offset-2",
						children: "Open print sheet"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				disabled: locked,
				className: "space-y-5 disabled:opacity-80",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-3 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Date",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: draft.date,
									onChange: (e) => patch({ date: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
								label: "Vehicle no",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.vehicleNo,
									onChange: (e) => patch({ vehicleNo: e.target.value.toUpperCase() }),
									onBlur: () => applyMatchFromVehicle(draft.vehicleNo)
								}), vehHits.length > 0 && !locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Suggest, {
									items: vehHits.map((v) => ({
										key: v.id,
										title: v.vehicleNo,
										meta: v.modelYear
									})),
									onPick: (key) => {
										const v = vehicles.find((x) => x.id === key);
										if (v) applyMatchFromVehicle(v.vehicleNo);
									}
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
								label: "Phone *",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.phone,
									onChange: (e) => patch({ phone: e.target.value }),
									onBlur: () => applyMatchFromPhone(draft.phone)
								}), phoneHits.length > 0 && !locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Suggest, {
									items: phoneHits.map((c) => ({
										key: c.id,
										title: c.name,
										meta: c.phone
									})),
									onPick: (key) => {
										const c = customers.find((x) => x.id === key);
										if (c) applyMatchFromPhone(c.phone);
									}
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Customer name *",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.customerName,
									onChange: (e) => patch({ customerName: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Colour",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.colour,
									onChange: (e) => patch({ colour: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Model / year",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.modelYear,
									onChange: (e) => patch({ modelYear: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Reg date",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: draft.regDate,
									onChange: (e) => patch({ regDate: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Current KM",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: draft.currentKm ?? "",
									onChange: (e) => patch({ currentKm: e.target.value === "" ? null : Number(e.target.value) })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Customer GSTIN",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.customerGstin,
									onChange: (e) => patch({ customerGstin: e.target.value.toUpperCase() })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Address",
								className: "md:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.address,
									onChange: (e) => patch({ address: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.email,
									onChange: (e) => patch({ email: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
								label: "Advisor",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									list: "advisors",
									value: draft.advisor,
									onChange: (e) => patch({ advisor: e.target.value })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
									id: "advisors",
									children: settings.advisors.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: n }, n))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
								label: "Mechanic",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									list: "mechanics",
									value: draft.mechanic,
									onChange: (e) => patch({ mechanic: e.target.value })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
									id: "mechanics",
									children: settings.mechanics.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: n }, n))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Remarks",
								className: "md:col-span-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: draft.remarks,
									onChange: (e) => patch({ remarks: e.target.value })
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-semibold",
									children: "Lines"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										variant: "outline",
										onClick: () => {
											setPickerFor(null);
											setPicker(true);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Stock"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "sm",
										variant: "outline",
										onClick: () => patch({ lines: [...draft.lines, blankLine({
											gstPct: defaultGstForType("labour", settings),
											type: "labour",
											unit: "job"
										})] }),
										children: "+ Labour / outside"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full min-w-[860px] text-left text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "text-xs tracking-wide text-muted uppercase",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-2",
												children: "Name"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
											gstOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "HSN/SAC" }) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Qty" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Unit" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Rate" }),
											gstOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "GST %" }) : null,
											gstOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Tax" }) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Amount" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: draft.lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 10,
										className: "py-8 text-center text-muted",
										children: "Type a line below, or pick a stock lot. Typed lines that are not in stock are labour or outside parts — no stock movement."
									}) }) : computed.lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border align-top",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "py-2 pr-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: line.name,
														onChange: (e) => setLine(line.id, {
															name: e.target.value,
															stockItemId: line.stockItemId
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														type: "button",
														size: "icon",
														variant: "outline",
														className: "shrink-0",
														onClick: () => {
															setPickerFor(line.id);
															setPicker(true);
														},
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
													})]
												}), line.stockItemId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-xs text-muted",
													children: "Stock lot · printed name only"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-xs text-muted",
													children: "Non-stock — no stock movement"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 pr-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "h-11 rounded-sm border border-border bg-surface px-2",
													value: line.type,
													onChange: (e) => {
														const type = e.target.value;
														setLine(line.id, {
															type,
															stockItemId: type === "labour" ? null : line.stockItemId,
															gstPct: defaultGstForType(type, settings)
														});
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "part",
														children: "Part"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "labour",
														children: "Labour"
													})]
												})
											}),
											gstOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 pr-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: line.hsnSac,
													onChange: (e) => setLine(line.id, { hsnSac: e.target.value })
												})
											}) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 pr-2 w-24",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													min: 0,
													step: "any",
													value: line.qty,
													onChange: (e) => setLine(line.id, { qty: Number(e.target.value) })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 pr-2 w-20",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: line.unit,
													onChange: (e) => setLine(line.id, { unit: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 pr-2 w-28",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													value: line.rate,
													onChange: (e) => setLine(line.id, { rate: Number(e.target.value) })
												})
											}),
											gstOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 pr-2 w-20",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													value: line.gstPct,
													onChange: (e) => setLine(line.id, { gstPct: Number(e.target.value) })
												})
											}) : null,
											gstOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 pr-2 tabular text-muted",
												children: formatINR(line.tax)
											}) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 pr-2 tabular font-medium",
												children: formatINR(gstOn ? line.lineTotal : line.amount)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													type: "button",
													size: "icon",
													variant: "ghost",
													onClick: () => patch({ lines: draft.lines.filter((l) => l.id !== line.id) }),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
												})
											})
										]
									}, line.id)) })]
								})
							}),
							!locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-col gap-2 sm:flex-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: composer,
										onChange: (e) => setComposer(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												addTypedLine();
											}
										},
										placeholder: "Type any line — labour or outside part",
										className: "sm:flex-1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "h-11 rounded-sm border border-border bg-surface px-2 text-sm",
										value: composerType,
										onChange: (e) => setComposerType(e.target.value),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "part",
											children: "Part"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "labour",
											children: "Labour"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "outline",
										onClick: () => {
											setPickerFor(null);
											setPicker(true);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Stock"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "secondary",
										onClick: addTypedLine,
										children: "Add line"
									})
								]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-4 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Payment",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm",
										value: draft.paymentMode,
										onChange: (e) => patch({ paymentMode: e.target.value }),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "None"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "cash",
												children: "Cash"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "upi",
												children: "UPI"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "card",
												children: "Card"
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Received",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: draft.amountReceived,
										onChange: (e) => patch({ amountReceived: Number(e.target.value) })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Balance",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "flex h-11 items-center font-medium tabular",
										children: formatINR(Math.max(0, computed.totals.grand - (draft.amountReceived || 0)))
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "space-y-1 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "Taxable",
										v: formatINR(computed.totals.taxable)
									}),
									gstOn && computed.totals.igst > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "IGST",
										v: formatINR(computed.totals.igst)
									}) : null,
									gstOn && computed.totals.cgst > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "CGST",
										v: formatINR(computed.totals.cgst)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "SGST",
										v: formatINR(computed.totals.sgst)
									})] }) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "Grand total",
										v: formatINR(computed.totals.grand),
										strong: true
									})
								]
							}), gstOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted",
								children: gstMode === "inter" ? "IGST (inter-state)" : "CGST + SGST (Delhi / intra-state)"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted",
								children: "GST Tax Invoice is OFF in Settings."
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockPicker, {
				open: picker,
				items: stock.filter((s) => !s.archived),
				onOpenChange: setPicker,
				onPick: (item) => addStockLine(item, pickerFor)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: shortageOpen,
				onOpenChange: setShortageOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Stock short" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [shortageMsg, ". Save is blocked unless you override with a reason."] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Override reason" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.lines.find((l) => l.stockItemId && shortageIds.includes(l.stockItemId))?.stockOverrideReason ?? "",
							onChange: (e) => patch({
								lines: draft.lines.map((l) => l.stockItemId && shortageIds.includes(l.stockItemId) ? {
									...l,
									stockOverride: true,
									stockOverrideReason: e.target.value
								} : l),
								allowShortage: true
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Back" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						onClick: () => {
							setShortageOpen(false);
							onSave({ allowShortage: true });
						},
						children: "Save with override"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: cancelOpen,
				onOpenChange: setCancelOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Cancel this unprinted bill?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Stock deducted on save will be returned. The bill cannot be printed afterwards." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Keep" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: async () => {
						if (!billId) return;
						const res = await cancelBill(billId);
						if (!res.ok) toast.error(res.error);
						else {
							toast.success("Bill cancelled, stock returned");
							await navigate({ to: "/bills" });
						}
					},
					children: "Cancel bill"
				})] })] })
			})
		]
	});
}
function Field({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: `relative grid gap-1 ${className ?? ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
function Row({ k, v, strong }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex justify-between ${strong ? "pt-2 text-base font-semibold" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "tabular",
			children: v
		})]
	});
}
function Suggest({ items, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "absolute top-full z-20 mt-1 w-full overflow-hidden rounded-md bg-surface shadow-[var(--shadow-border)]",
		children: items.slice(0, 5).map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-chip",
			onMouseDown: (e) => {
				e.preventDefault();
				onPick(it.key);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: it.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted",
				children: it.meta
			})]
		}) }, it.key))
	});
}
function StockPicker({ open, items, onOpenChange, onPick }) {
	const [q, setQ] = (0, import_react.useState)("");
	const filtered = items.filter((i) => `${i.displayName} ${i.sku} ${i.brand} ${i.supplier}`.toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[85dvh] overflow-y-auto sm:max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Pick stock lot" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search stock"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: filtered.slice(0, 40).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex w-full items-center justify-between py-3 text-left text-sm hover:bg-chip/60",
						onClick: () => onPick(i),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-medium",
							children: printedName(i.displayName)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-xs text-muted",
							children: [
								i.sku,
								" · ",
								i.brand,
								" · ",
								i.supplier
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular text-muted",
							children: [
								i.qty,
								" ",
								i.unit,
								i.qty <= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "critical",
									className: "ml-2",
									children: "0"
								}) : null
							]
						})]
					}) }, i.id))
				})
			]
		})
	});
}
//#endregion
export { BillEditor as t };
