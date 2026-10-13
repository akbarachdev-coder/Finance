import Link from "next/link";
import type { ReactNode } from "react";
import { TransactionTable } from "@/app/components/transaction-table";
import { IncomeExpenseChart } from "@/app/components/income-expense-chart";
import { getDashboardData } from "@/app/lib/data";
import { formatRupiah } from "@/app/lib/format";

function MetricCard({
  label,
  value,
  caption,
  accent,
  icon,
}: {
  label: string;
  value: string;
  caption: string;
  accent: "blue" | "green" | "red";
  icon: ReactNode;
}) {
  const accents = {
    blue: {
      wrapper: "text-blue-600 bg-blue-50 border-blue-100",
      value: "text-slate-900",
    },
    green: {
      wrapper: "text-emerald-600 bg-emerald-50 border-emerald-100",
      value: "text-emerald-600",
    },
    red: {
      wrapper: "text-red-600 bg-red-50 border-red-100",
      value: "text-red-600",
    },
  } as const;

  const tone = accents[accent];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className={`mt-2 text-3xl font-bold tabular-nums ${tone.value}`}>
            {value}
          </p>
        </div>
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-lg border ${tone.wrapper}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-3 text-xs text-slate-500">{caption}</p>
    </div>
  );
}

const walletIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <rect x="3" y="6" width="18" height="13" rx="2.5" />
    <path d="M3 10h18" />
    <circle cx="16.5" cy="14.5" r="1.3" />
  </svg>
);

const incomeIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="m4 16 5-5 4 4 6-6" />
    <path d="M14 9h5v5" />
  </svg>
);

const expenseIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="m4 8 5 5 4-4 6 6" />
    <path d="M14 14h5V9" />
  </svg>
);

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Dashboard Keuangan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ringkasan performa finansial bisnis Anda.
          </p>
        </div>
        <Link
          href="/transactions"
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <span aria-hidden="true">+</span> Tambah Transaksi
        </Link>
      </header>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <MetricCard
          label="Total Saldo Kas & Bank"
          value={formatRupiah(data.totalBalance)}
          caption="Akumulasi seluruh akun kas dan rekening bank"
          accent="blue"
          icon={walletIcon}
        />
        <MetricCard
          label="Total Pemasukan Bulan Ini"
          value={formatRupiah(data.monthIncome)}
          caption={`${data.monthLabel} • ${data.incomeCount} transaksi pemasukan`}
          accent="green"
          icon={incomeIcon}
        />
        <MetricCard
          label="Total Pengeluaran Bulan Ini"
          value={formatRupiah(data.monthExpense)}
          caption={`${data.monthLabel} • ${data.expenseCount} transaksi pengeluaran`}
          accent="red"
          icon={expenseIcon}
        />
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/60 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Transaksi Terbaru
            </h2>
            <p className="text-xs text-slate-500">
              5 transaksi dengan tanggal terakhir
            </p>
          </div>
          <Link
            href="/transactions"
            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            Lihat Semua
          </Link>
        </div>
        <TransactionTable
          transactions={data.recent}
          emptyMessage="Belum ada transaksi. Tambahkan transaksi pertama Anda."
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">
            Grafik Pemasukan & Pengeluaran
          </h2>
        </div>
        <IncomeExpenseChart />
      </section>
    </div>
  );
}
