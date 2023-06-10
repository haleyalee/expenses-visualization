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