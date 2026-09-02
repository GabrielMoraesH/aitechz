type ProductCondition = "NEW" | "USED";
export const PRODUCT_CONDITION_LABELS: Record<ProductCondition, string> = { NEW: "Novo", USED: "Seminovo" };
const brlFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export function formatBRL(value: string): string { return brlFormatter.format(Number(value)); }
export function formatAdminDate(value: Date): string {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(value);
}
