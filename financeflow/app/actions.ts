"use server";

import { revalidatePath, updateTag } from "next/cache";
import prisma from "@/app/lib/prisma";
import { FINANCE_CACHE_TAG } from "@/app/lib/data";
import type { ActionResult, TransactionType } from "@/app/lib/types";

const DEFAULT_CATEGORIES: { name: string; type: TransactionType }[] = [
  { name: "Penjualan", type: "INCOME" },
  { name: "Pendapatan Jasa", type: "INCOME" },
  { name: "Operasional", type: "EXPENSE" },
  { name: "Gaji", type: "EXPENSE" },
  { name: "Marketing", type: "EXPENSE" },
  { name: "Utilitas", type: "EXPENSE" },
];

function parseDateInput(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

async function ensureDefaultAccount() {
  const existing = await prisma.account.findFirst({
    orderBy: { id: "asc" },
  });
  if (existing) return existing;

  let user = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  if (!user) {
    user = await prisma.user.create({
      data: { name: "Admin Finance", email: "admin@financeflow.local" },
    });
  }

  return prisma.account.create({
    data: { userId: user.id, name: "Kas & Bank", type: "CASH", balance: 0 },
  });
}

function revalidateFinanceData() {
  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/categories");
  updateTag(FINANCE_CACHE_TAG);
}

export async function createTransaction(
  formData: FormData,
): Promise<ActionResult> {
  const description = String(formData.get("description") ?? "").trim();
  const amountRaw = String(formData.get("amount") ?? "").trim();
  const dateRaw = String(formData.get("date") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();

  if (!description) {
    return { ok: false, message: "Deskripsi wajib diisi." };
  }
  if (description.length > 200) {
    return { ok: false, message: "Deskripsi maksimal 200 karakter." };
  }

  const amount = Number(amountRaw);
  if (!amountRaw || !Number.isFinite(amount) || amount <= 0) {
    return { ok: false, message: "Nominal harus berupa angka lebih dari 0." };
  }
  if (amount > 1_000_000_000_000) {
    return { ok: false, message: "Nominal terlalu besar." };
  }

  const date = parseDateInput(dateRaw);
  if (!date) {
    return { ok: false, message: "Tanggal tidak valid." };
  }

  if (type !== "INCOME" && type !== "EXPENSE") {
    return { ok: false, message: "Tipe transaksi tidak valid." };
  }
  if (!categoryId) {
    return { ok: false, message: "Kategori wajib dipilih." };
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return { ok: false, message: "Kategori tidak ditemukan." };
    }

    const account = await ensureDefaultAccount();

    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          accountId: account.id,
          categoryId,
          amount,
          type,
          date,
          description,
        },
      }),
      prisma.account.update({
        where: { id: account.id },
        data:
          type === "INCOME"
            ? { balance: { increment: amount } }
            : { balance: { decrement: amount } },
      }),
    ]);
  } catch (error) {
    console.error("createTransaction failed:", error);
    return { ok: false, message: "Gagal menyimpan transaksi. Coba lagi." };
  }

  revalidateFinanceData();

  return { ok: true, message: "Transaksi berhasil disimpan." };
}

export async function createCategory(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim();

  if (!name) {
    return { ok: false, message: "Nama kategori wajib diisi." };
  }
  if (name.length > 50) {
    return { ok: false, message: "Nama kategori maksimal 50 karakter." };
  }
  if (type !== "INCOME" && type !== "EXPENSE") {
    return { ok: false, message: "Tipe kategori tidak valid." };
  }

  try {
    await prisma.category.create({ data: { name, type } });
  } catch (error) {
    console.error("createCategory failed:", error);
    return { ok: false, message: "Gagal menyimpan kategori. Coba lagi." };
  }

  revalidateFinanceData();

  return { ok: true, message: "Kategori berhasil ditambahkan." };
}

export async function seedDefaultCategories(): Promise<void> {
  try {
    const existing = await prisma.category.findMany({
      select: { name: true, type: true },
    });
    const known = new Set(existing.map((c) => `${c.type}:${c.name}`));

    const missing = DEFAULT_CATEGORIES.filter(
      (category) => !known.has(`${category.type}:${category.name}`),
    );

    if (missing.length > 0) {
      await prisma.category.createMany({ data: missing });
    }
  } catch (error) {
    console.error("seedDefaultCategories failed:", error);
    return;
  }

  revalidateFinanceData();
}
