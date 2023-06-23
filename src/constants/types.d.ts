// This file contains types for the database layer

interface IExpense {
  name: string,
  category: string[],
  date: string,
  amount: number
}

interface IDatabase {
  title: string,
  expenses: IExpense[]
}

interface ISpendingSummary {
  title: string,
  byCategory: ({ label: string, amt: string })[]
  totalExpense: { label: string, amt: string },
  totalIncome: { label: string, amt: string },
  netSpending: { label: string, amt: string },
  dayAvgSpending: { label: string, amt: string },
}