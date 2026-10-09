import { formatDate, formatRupiah, formatTypeLabel } from "@/app/lib/format";
import type { TransactionRow } from "@/app/lib/types";

function TypeBadge({ type }: { type: string }) {
  const isIncome = type === "INCOME";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        isIncome
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {formatTypeLabel(type)}
    </span>
  );
}

export function TransactionTable({
  transactions,
  emptyMessage = "Belum ada transaksi yang tercatat.",
}: {
  transactions: TransactionRow[];
  emptyMessage?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-5 py-3 font-semibold">Tanggal</th>
            <th className="px-5 py-3 font-semibold">Deskripsi</th>
            <th className="px-5 py-3 font-semibold">Kategori</th>
            <th className="px-5 py-3 font-semibold">Tipe</th>
            <th className="px-5 py-3 text-right font-semibold">Nominal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-5 py-12 text-center text-sm text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => {
              const isIncome = transaction.type === "INCOME";
              return (
                <tr
                  key={transaction.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {transaction.description}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                      {transaction.categoryName}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <TypeBadge type={transaction.type} />
                  </td>
                  <td
                    className={`whitespace-nowrap px-5 py-4 text-right font-semibold tabular-nums ${
                      isIncome ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {isIncome ? "+" : "-"} {formatRupiah(transaction.amount)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
