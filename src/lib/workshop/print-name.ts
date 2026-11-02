/** Printed bill name is the display name only — never SKU suffixes (MT, KG, KM). */
const SUFFIX = /(?:[\s\-_/]+(?:KG|MT|KM))+$/i;

export function printedName(displayName: string): string {
  return displayName.replace(SUFFIX, "").replace(/\s+/g, " ").trim();
}
