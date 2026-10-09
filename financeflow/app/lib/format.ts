const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatRupiah(value: number): string {
  return rupiahFormatter.format(value);
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

export function formatTypeLabel(type: string): string {
  return type === "INCOME" ? "Pemasukan" : "Pengeluaran";
}
