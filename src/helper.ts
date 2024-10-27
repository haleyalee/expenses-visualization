import { CATEGORY } from "./constants/expenses";

export const getToday = (): string => {
  const date = new Date();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  return `${year}-${month}`
}

export const toDollar = (amt: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);
};

const sumSpending = (exp: Expense[]): number => {
  const sum = exp.map((e) => e.amount).reduce((acc, curr) => acc + curr, 0);
  return +(sum.toFixed(2));
}

/* sumCategory
 * Helper function to compute the total sum of a specified category month
 * Parameters:
 *  databaseExp: Expense[]
 *  category:string         e.g. `groceries`
 *  Returns: number         e.g. -185.33
*/
const sumCategory = (databaseExp: Expense[], category: string): number => {
  const catExpArr:Expense[] = databaseExp.filter((e) => e.category === category);
  return sumSpending(catExpArr);
};

/* totalExpense
*  Helper function to compute total expenses of specified database month
*  Parameters:
*   databaseExp: Expense[]
*  Returns: number          e.g. -3400.0
*/
const totalExpense = (databaseExp: Expense[]): number => {
  const spendingArr = databaseExp.filter((e) => e.amount < 0);
  return sumSpending(spendingArr);
}

/* totalIncome
*  Helper function to compute total income of specified database month
*  Parameters:
*   databaseExp: Expense[]
*  Returns: number          e.g. 4300.0
*/
const totalIncome = (databaseExp: Expense[]): number => {
  const spendingArr = databaseExp.filter((e) => e.amount >= 0);
  return sumSpending(spendingArr);
}

/* netSpending
*  Helper function to compute total sum (expenses + income) of specified database month
*  Parameters:
*   databaseExp: Expense[]
*  Returns: number          e.g. 500.0
*/
const netSpending = (databaseExp: Expense[]): number => {
  return sumSpending(databaseExp);
}

export const getSpendingSummary = (month: MonthlyExpenses): SpendingSummary => {
  return {
    date: month.date,
    byCategory: [
      { label: CATEGORY.SHOPPING, amt: sumCategory(month.expenses, CATEGORY.SHOPPING) },
      { label: CATEGORY.EATOUT, amt: sumCategory(month.expenses, CATEGORY.EATOUT) },
      { label: CATEGORY.TRANSPORTATION, amt: sumCategory(month.expenses, CATEGORY.TRANSPORTATION) },
      { label: CATEGORY.GROCERIES, amt: sumCategory(month.expenses, CATEGORY.GROCERIES) },
      { label: CATEGORY.DRINKS, amt: sumCategory(month.expenses, CATEGORY.DRINKS) },
      { label: CATEGORY.ENTERTAINMENT, amt: sumCategory(month.expenses, CATEGORY.ENTERTAINMENT) },
      { label: CATEGORY.OTHER, amt: sumCategory(month.expenses, CATEGORY.OTHER) },
    ],
    totalExpense: { label: "Total Expenses", amt: toDollar(totalExpense(month.expenses)) },
    totalIncome: { label: "Total Income", amt: toDollar(totalIncome(month.expenses)) },
    netSpending: { label: "Net Spending", amt: toDollar(netSpending(month.expenses)) },
  }
}