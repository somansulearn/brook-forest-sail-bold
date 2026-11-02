import { o as __toESM } from "../_runtime.mjs";
import { c as cn, i as Button, x as getDb } from "./pdf-invoice-Do2ulir-.mjs";
import { C as require_react, S as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as pickBackupFolder } from "./fs-access-Cws59sC1.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Label, t as Input } from "./label-D5uVcG4K.mjs";
import { c as drawDefaultLogo, m as saveSettings, n as DEFAULT_SETTINGS, t as Textarea } from "./textarea-DRnCtecN.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BNYJra32.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border border-border bg-chip transition-colors data-[state=checked]:bg-primary", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-1 rounded-full bg-surface shadow-[var(--shadow-border)] transition-transform data-[state=checked]:translate-x-6" })
	});
}
function SettingsPage() {
	const stored = useLiveQuery(() => getDb().settings.get(1));
	const [form, setForm] = (0, import_react.useState)(DEFAULT_SETTINGS);
	const [advisorText, setAdvisorText] = (0, import_react.useState)("");
	const [mechanicText, setMechanicText] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (stored) {
			setForm(stored);
			setAdvisorText(stored.advisors.join("\n"));
			setMechanicText(stored.mechanics.join("\n"));
		}
	}, [stored]);
	function set(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	async function onSave() {
		const result = await saveSettings({
			...form,
			advisors: advisorText.split("\n"),
			mechanics: mechanicText.split("\n"),
			nextInvoiceNumber: Number(form.nextInvoiceNumber),
			defaultGstParts: Number(form.defaultGstParts),
			defaultGstLabour: Number(form.defaultGstLabour),
			defaultReorderQty: Number(form.defaultReorderQty)
		});
		if (!result.ok) toast.error(result.error);
		else toast.success("Settings saved");
	}
	async function onLogo(file) {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => set("logoDataUrl", String(reader.result ?? ""));
		reader.readAsDataURL(file);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-semibold tracking-tight",
				children: "Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Garage identity, GST invoice mode, numbering, and lists. Printed bills stay locked."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Garage"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Legal name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.legalName,
							onChange: (e) => set("legalName", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Address",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: form.address,
							onChange: (e) => set("address", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phones",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.phones,
								onChange: (e) => set("phones", e.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.email,
								onChange: (e) => set("email", e.target.value)
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "GSTIN",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.gstin,
									onChange: (e) => set("gstin", e.target.value.toUpperCase())
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "State",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.state,
									onChange: (e) => set("state", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "State code",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.stateCode,
									onChange: (e) => set("stateCode", e.target.value)
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Logo for printed sheet",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [
								form.logoDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: form.logoDataUrl,
									alt: "Logo",
									className: "size-16 rounded-full"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "file",
									accept: "image/*",
									onChange: (e) => void onLogo(e.target.files?.[0])
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => set("logoDataUrl", drawDefaultLogo()),
									children: "Reset mark"
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "GST Tax Invoice"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "ON prints TAX INVOICE with HSN/SAC and tax breakup. OFF prints a plain bill."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: form.gstEnabled,
						onCheckedChange: (v) => set("gstEnabled", v)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Default GST % parts",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: form.defaultGstParts,
							onChange: (e) => set("defaultGstParts", Number(e.target.value))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Default GST % labour",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: form.defaultGstLabour,
							onChange: (e) => set("defaultGstLabour", Number(e.target.value))
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Invoice numbering"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Next number is used on Print, then incremented. Paper bills already issued can skip ahead. Financial year series is 1 Apr–31 Mar."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Invoice prefix",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.invoicePrefix,
								onChange: (e) => set("invoicePrefix", e.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Next invoice number",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 1,
								value: form.nextInvoiceNumber,
								onChange: (e) => set("nextInvoiceNumber", Number(e.target.value))
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Stock & day-end"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Default reorder qty",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							value: form.defaultReorderQty,
							onChange: (e) => set("defaultReorderQty", Number(e.target.value))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Day-end email",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: form.dayEndEmail,
							onChange: (e) => set("dayEndEmail", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Backup folder (this computer)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.backupFolderLabel,
								placeholder: "C:\\\\Samriddhi\\\\backups",
								onChange: (e) => set("backupFolderLabel", e.target.value)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: async () => {
									const name = await pickBackupFolder();
									if (name) {
										set("backupFolderLabel", name);
										toast.success(`Folder “${name}” remembered`);
									} else toast.message("Folder picker is not available — backups download as a zip.");
								},
								children: "Choose folder"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"Data lives on this computer.",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/backup",
								className: "text-primary underline-offset-2 hover:underline",
								children: "Backup now"
							}),
							" ",
							"downloads a zip of the ledger, invoices, and reports."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Advisor names" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: advisorText,
						onChange: (e) => setAdvisorText(e.target.value),
						placeholder: "One per line"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mechanic names" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: mechanicText,
						onChange: (e) => setMechanicText(e.target.value),
						placeholder: "One per line"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => void onSave(),
					children: "Save settings"
				})
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { SettingsPage as component };
