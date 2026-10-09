import { cacheLife, cacheTag } from "next/cache";
import prisma from "@/app/lib/prisma";
import { formatMonthYear } from "@/app/lib/format";
import type {
  CategoryOption,
  CategoryWithCount,
  DashboardData,
  TransactionRow,
} from "@/app/lib/types";

export const FINANCE_CACHE_TAG = "finance";

type TransactionWithCategory = {
  id: string;
  date: Date;
  amount: number;
  type: string;
  description: string | null;
  category: { name: string };
};

function toTransactionRow(transaction: TransactionWithCategory): TransactionRow {
  return {
    id: transaction.id,
    date: transaction.date.toISOString(),
    description: transaction.description ?? "-",
    amount: transaction.amount,
    type: transaction.type,
    categoryName: transaction.category.name,
  };
}

function getCurrentMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 1),
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  "use cache";
  cacheLife("minutes");
  cacheTag(FINANCE_CACHE_TAG);

  const { start, end } = getCurrentMonthRange();

  const [accounts, income, expense, recent] = await Promise.all([
    prisma.account.aggregate({ _sum: { balance: true } }),
    prisma.transaction.aggregate({
      where: { type: "INCOME", date: { gte: start, lt: end } },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.transaction.aggregate({
      where: { type: "EXPENSE", date: { gte: start, lt: end } },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.transaction.findMany({
      take: 5,
      orderBy: [{ date: "desc" }, { id: "desc" }],
      include: { category: { select: { name: true } } },
    }),
  ]);

  return {
    totalBalance: accounts._sum.balance ?? 0,
    monthIncome: income._sum.amount ?? 0,
    monthExpense: expense._sum.amount ?? 0,
    incomeCount: income._count._all,
    expenseCount: expense._count._all,
    monthLabel: formatMonthYear(new Date()),
    recent: recent.map(toTransactionRow),
  };
}

export async function getTransactions(): Promise<TransactionRow[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(FINANCE_CACHE_TAG);

  const transactions = await prisma.transaction.findMany({
    orderBy: [{ date: "desc" }, { id: "desc" }],
    include: { category: { select: { name: true } } },
  });

  return transactions.map(toTransactionRow);
}

export async function getCategories(): Promise<CategoryOption[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(FINANCE_CACHE_TAG);

  const categories = await prisma.category.findMany({
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    type: category.type,
  }));
}

export async function getCategoriesWithCount(): Promise<CategoryWithCount[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(FINANCE_CACHE_TAG);

  const categories = await prisma.category.findMany({
    orderBy: [{ type: "asc" }, { name: "asc" }],
    include: { _count: { select: { transactions: true } } },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    type: category.type,
    transactionCount: category._count.transactions,
  }));
}
