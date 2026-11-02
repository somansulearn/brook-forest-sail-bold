import type { Settings } from "./types";

export const DEFAULT_SETTINGS: Settings = {
  id: 1,
  legalName: "Samriddhi Auto Works",
  address: "Shop 14, Moti Nagar Industrial Area, New Delhi 110015",
  phones: "011-2541-8820, 98111-44567",
  email: "accounts@samriddhiautoworks.in",
  gstin: "07AABCS1234A1Z5",
  state: "Delhi",
  stateCode: "07",
  gstEnabled: true,
  invoicePrefix: "SAW/",
  nextInvoiceNumber: 1,
  defaultGstParts: 18,
  defaultGstLabour: 18,
  defaultReorderQty: 5,
  dayEndEmail: "accounts@samriddhiautoworks.in",
  advisors: ["Rajesh Kumar", "Amit Verma"],
  mechanics: ["Suresh Yadav", "Vikram Singh", "Ravi Pal"],
  logoDataUrl: "",
  backupFolderLabel: "",
};

export function drawDefaultLogo(): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.clearRect(0, 0, 256, 256);
  ctx.beginPath();
  ctx.arc(128, 128, 118, 0, Math.PI * 2);
  ctx.fillStyle = "#1e4d4a";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(128, 128, 108, 0, Math.PI * 2);
  ctx.fillStyle = "#f4f1eb";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(128, 128, 98, 0, Math.PI * 2);
  ctx.fillStyle = "#1e4d4a";
  ctx.fill();

  ctx.fillStyle = "#f4f1eb";
  ctx.font = "700 54px 'IBM Plex Sans', 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SAW", 128, 118);
  ctx.font = "600 16px 'IBM Plex Sans', 'Segoe UI', sans-serif";
  ctx.letterSpacing = "0.18em";
  ctx.fillText("AUTO WORKS", 128, 162);
  return canvas.toDataURL("image/png");
}
