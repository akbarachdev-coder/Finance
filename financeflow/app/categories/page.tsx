import type { Metadata } from "next";
import { CategoryForm } from "@/app/categories/category-form";
import { seedDefaultCategories } from "@/app/actions";
import { getCategoriesWithCount } from "@/app/lib/data";
import { formatTypeLabel } from "@/app/lib/format";

export const metadata: Metadata = {
  title: "Kategori",
  description: "Kelola kategori pemasukan dan pengeluaran bisnis.",
};

function CategoryBadge({ type }: { type: string }) {
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

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCount();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Kategori
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {categories.length} kategori tersedia untuk pengelompokan transaksi.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5">
          <CategoryForm />

          {categories.length === 0 && (
            <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
              <p className="text-sm text-slate-600">
                Belum ada kategori sama sekali. Muat daftar kategori umum agar
                formulir transaksi siap dipakai.
              </p>
              <form action={seedDefaultCategories}>
                <button
                  type="submit"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Muat Kategori Default
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Daftar Kategori
                </h2>
                <p className="text-xs text-slate-500">
                  Jumlah transaksi yang menggunakan kategori tersebut.
                </p>
              </div>
            </div>

            {categories.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-400">
                Belum ada kategori. Tambahkan kategori pertama Anda.
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {category.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {category.transactionCount} transaksi
                      </p>
                    </div>
                    <CategoryBadge type={category.type} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
