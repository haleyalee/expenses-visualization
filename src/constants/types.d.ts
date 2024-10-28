// This file contains types for the database layer

interface Expense {
  name: string,
  category: string,
  date: string,
  amount: number
}

interface MonthlyExpenses {
  date: string,
  expenses: Expense[];
}

interface Database {
  title: string,
  expenses: MonthlyExpenses
}

interface SpendingSummary {
  date: string,
  byCategory: ({ label: string, amt: number })[]
  totalExpense: { label: string, amt: string },
  totalIncome: { label: string, amt: string },
  netSpending: { label: string, amt: string },
}