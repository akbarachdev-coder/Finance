"use client";

import { useRef, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { createCategory } from "@/app/actions";
import type { TransactionType } from "@/app/lib/types";

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

export function CategoryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [message, setMessage] = useState<FormMessage>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setMessage(null);
      const result = await createCategory(formData);
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
          Kategori Baru
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Kategori dipakai untuk mengelompokkan transaksi.
        </p>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="categoryName"
          className="block text-sm font-medium text-slate-700"
        >
          Nama Kategori
        </label>
        <input
          id="categoryName"
          name="name"
          type="text"
          required
          maxLength={50}
          autoComplete="off"
          placeholder="Contoh: Operasional"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-slate-700">
          Tipe Kategori
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
        disabled={pending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {pending ? "Menyimpan..." : "Simpan Kategori"}
      </button>
    </form>
  );
}
