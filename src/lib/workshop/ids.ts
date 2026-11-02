export function newId(): string {
  return crypto.randomUUID();
}

export function todayISO(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function padInvoice(n: number, width = 4): string {
  return String(n).padStart(width, "0");
}
