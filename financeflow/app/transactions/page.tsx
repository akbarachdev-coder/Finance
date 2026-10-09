import type { Metadata } from "next";
import { TransactionTable } from "@/app/components/transaction-table";
import { TransactionForm } from "@/app/transactions/transaction-form";
import { getCategories, getTransactions } from "@/app/lib/data";

export const metadata: Metadata = {
  title: "Transaksi",
  description: "Daftar seluruh transaksi pemasukan dan pengeluaran bisnis.",
};

export default async function TransactionsPage() {
  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Transaksi
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {transactions.length} transaksi tercatat •{" "}
          {categories.length} kategori tersedia
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <TransactionForm categories={categories} />
          </div>
        </div>

        <div className="min-w-0 lg:col-span-2">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/60 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Daftar Transaksi
              </h2>
              <p className="text-xs text-slate-500">
                Pengeluaran ditandai merah, pemasukan ditandai hijau.
              </p>
            </div>
            <TransactionTable
              transactions={transactions}
              emptyMessage="Belum ada transaksi. Isi formulir di samping untuk memulai."
            />
          </section>
        </div>
      </div>
    </div>
  );
}
