"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  income: {
    label: "Pemasukan",
    color: "#10b981",
  },
  expense: {
    label: "Pengeluaran",
    color: "#ef4444",
  },
} satisfies ChartConfig;

const chartData = [
  { month: "Jan", income: 3200000, expense: 2900000 },
  { month: "Feb", income: 3500000, expense: 3100000 },
  { month: "Mar", income: 4000000, expense: 3300000 },
  { month: "Apr", income: 3700000, expense: 3400000 },
  { month: "Mei", income: 4200000, expense: 3600000 },
  { month: "Jun", income: 4700000, expense: 3900000 },
];

export function IncomeExpenseChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="income" fill="var(--color-income)" radius={4} />
        <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
