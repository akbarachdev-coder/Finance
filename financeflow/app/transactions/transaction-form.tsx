"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { createTransaction } from "@/app/actions";
import type { CategoryOption, TransactionType } from "@/app/lib/types";

const TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: "EXPENSE", label: "Pengeluaran" },
  { value: "INCOME", label: "Pemasukan" },
];

const TYPE_STYLES: Record<TransactionType, string> = {
  EXPENSE:
    "peer-checked:border-red-600 peer-checked:bg-red-50 peer-checked:text-red-700",
  INCOME:
    "peer-checked:border-emerald-600 peer-checked:bg-emerald-50 peer-checked:text-emerald-700",
};

type FormMessage = { status: "success" | "error"; text: string } | null;

export function TransactionForm({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [message, setMessage] = useState<FormMessage>(null);
  const [pending, startTransition] = useTransition();

  const availableCategories = categories.filter(
    (category) => category.type === type,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setMessage(null);
      const result = await createTransaction(formData);
      setMessage({
        status: result.ok ? "success" : "error",
        text: result.message,
      });

      if (result.ok) {
        formRef.current?.reset();
        setType("EXPENSE");
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Transaksi Baru
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Isi detail transaksi pencatatan keuangan.
        </p>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-slate-700">
          Tipe Transaksi
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {TYPE_OPTIONS.map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input
                type="radio"
                name="type"
                value={option.value}
                checked={type === option.value}
                onChange={() => setType(option.value)}
                className="peer sr-only"
              />
              <span
                className={`block rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-600 transition-colors hover:border-slate-400 ${TYPE_STYLES[option.value]}`}
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-700"
        >
          Deskripsi
        </label>
        <input
          id="description"
          name="description"
          type="text"
          required
          maxLength={200}
          autoComplete="off"
          placeholder="Contoh: Invoice klien PT Maju Jaya"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-slate-700"
          >
            Nominal
          </label>
          <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-300 bg-white transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
            <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-500">
              Rp
            </span>
            <input
              id="amount"
              name="amount"
              type="number"
              min={1}
              step="any"
              required
              placeholder="0"
              className="w-full min-w-0 border-0 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-slate-700"
          >
            Tanggal
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="categoryId"
          className="block text-sm font-medium text-slate-700"
        >
          Kategori
        </label>
        <select
          key={type}
          id="categoryId"
          name="categoryId"
          required
          className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="" disabled>
            Pilih kategori
          </option>
          {availableCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {availableCategories.length === 0 && (
          <p className="text-xs text-slate-500">
            Belum ada kategori tipe ini.{" "}
            <Link
              href="/categories"
              className="font-medium text-blue-600 hover:underline"
            >
              Tambah kategori
            </Link>
          </p>
        )}
      </div>

      {message && (
        <p
          aria-live="polite"
          className={`rounded-lg px-3 py-2 text-sm ${
            message.status === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || availableCategories.length === 0}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {pending ? "Menyimpan..." : "Simpan Transaksi"}
      </button>
    </form>
  );
}
