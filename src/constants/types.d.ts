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
  byCategory: ({ label: string, amt: number })[]
  totalExpense: { label: string, amt: number },
  totalIncome: { label: string, amt: number },
  netSpending: { label: string, amt: number },
  dayAvgSpending: { label: string, amt: number },
}