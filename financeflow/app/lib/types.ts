export type TransactionType = "INCOME" | "EXPENSE";

export type CategoryOption = {
  id: string;
  name: string;
  type: string;
};

export type CategoryWithCount = CategoryOption & {
  transactionCount: number;
};

export type TransactionRow = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  categoryName: string;
};

export type DashboardData = {
  totalBalance: number;
  monthIncome: number;
  monthExpense: number;
  incomeCount: number;
  expenseCount: number;
  monthLabel: string;
  recent: TransactionRow[];
};

export type ActionResult = {
  ok: boolean;
  message: string;
};
