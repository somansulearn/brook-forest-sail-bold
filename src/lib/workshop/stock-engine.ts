import type { BillLine, StockItem } from "./types";

export function committedByItem(lines: BillLine[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const line of lines) {
    if (line.type !== "part" || !line.stockItemId) continue;
    if (!(line.qty > 0)) continue;
    out[line.stockItemId] = (out[line.stockItemId] ?? 0) + line.qty;
  }
  return out;
}

export type StockDelta = { itemId: string; delta: number };

/** Positive delta = additional OUT. Negative = return to stock. */
export function stockDiffs(
  prev: Record<string, number>,
  next: Record<string, number>,
): StockDelta[] {
  const ids = new Set([...Object.keys(prev), ...Object.keys(next)]);
  const diffs: StockDelta[] = [];
  for (const id of ids) {
    const delta = (next[id] ?? 0) - (prev[id] ?? 0);
    if (delta !== 0) diffs.push({ itemId: id, delta });
  }
  return diffs;
}

export function reorderOf(item: StockItem, defaultReorder: number): number {
  return item.reorderQty == null ? defaultReorder : item.reorderQty;
}

export function stockStatus(
  qty: number,
  reorder: number,
): "ok" | "low" | "critical" {
  if (qty <= 0) return "critical";
  if (qty <= reorder) return "low";
  return "ok";
}

export type Shortage = {
  itemId: string;
  name: string;
  needed: number;
  onHand: number;
};

/**
 * Available qty for this bill = on-hand + already committed on this bill
 * (on-hand already reflects the previous save).
 */
export function findShortages(
  nextCommitted: Record<string, number>,
  prevCommitted: Record<string, number>,
  itemsById: Map<string, StockItem>,
  lines: BillLine[],
): Shortage[] {
  const overridden = new Set(
    lines
      .filter((l) => l.stockOverride && l.stockItemId)
      .map((l) => l.stockItemId as string),
  );
  const shortages: Shortage[] = [];
  for (const [itemId, needed] of Object.entries(nextCommitted)) {
    if (overridden.has(itemId)) continue;
    const item = itemsById.get(itemId);
    if (!item) continue;
    const available = item.qty + (prevCommitted[itemId] ?? 0);
    if (needed > available + 1e-9) {
      shortages.push({
        itemId,
        name: item.displayName,
        needed,
        onHand: available,
      });
    }
  }
  return shortages;
}
