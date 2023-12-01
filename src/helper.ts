import { CATEGORY } from "./constants/expenses";

const sumSpending = (exp:IExpense[]): number => {
  const sum = exp.map((e) => e.amount).reduce((acc, curr) => acc + curr, 0);
  return sum;
}

export const toDollar = (amt: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);
};

/* sumCategory
 * Helper function to compute the total sum of a specified category month
 * Parameters:
 *  databaseExp:IExpense[]
 *  category:string         e.g. `groceries`
 *  Returns: numbrt         e.g. -185.33
*/
const sumCategory = (databaseExp:IExpense[], category:string): number => {
  const catExpArr:IExpense[] = databaseExp.filter((e) => e.category.includes(category));
  return sumSpending(catExpArr);
};

/* totalExpense
*  Helper function to compute total expenses of specified database month
*  Parameters:
*   databaseExp:IExpense[]
*  Returns: number          e.g. -3400.0
*/
const totalExpense = (databaseExp:IExpense[]): number => {
  const spendingArr = databaseExp.filter((e) => e.amount < 0);
  return sumSpending(spendingArr);
}

/* totalIncome
*  Helper function to compute total income of specified database month
*  Parameters:
*   databaseExp:IExpense[]
*  Returns: number          e.g. 4300.0
*/
const totalIncome = (databaseExp:IExpense[]): number => {
  const spendingArr = databaseExp.filter((e) => e.amount >= 0);
  return sumSpending(spendingArr);
}

/* netSpending
*  Helper function to compute total sum (expenses + income) of specified database month
*  Parameters:
*   databaseExp:IExpense[]
*  Returns: number          e.g. 500.0
*/
const netSpending = (databaseExp:IExpense[]):number => {
  return sumSpending(databaseExp);
}

/* dayAvgSpending
*  Helper function to compute average spending per day of specified database month
*  Parameters:
*   databaseExp:IExpense[]
*  Returns: number          e.g. -50.0
*/
const dayAvgSpending = (database:IDatabase): number => {
  let days = 30;
  if (database.title.includes('February')) days = 28;
  else if (database.title.includes('January') ||
      database.title.includes('March') ||
      database.title.includes('May') ||
      database.title.includes('July') ||
      database.title.includes('August') ||
      database.title.includes('October') ||
      database.title.includes('December') 
  ) days = 31;

  const avg = totalExpense(database.expenses)/days;
  return avg;
}

export const getSpendingSummary = (database:IDatabase):ISpendingSummary => {
  return {
    title: database.title,
    byCategory: [
      { label: CATEGORY.SHOPPING, amt: sumCategory(database.expenses, CATEGORY.SHOPPING) },
      // { label: CATEGORY.WORK, amt: sumCategory(database.expenses, CATEGORY.WORK) },
      { label: CATEGORY.EATOUT, amt: sumCategory(database.expenses, CATEGORY.EATOUT) },
      { label: CATEGORY.TRAVEL, amt: sumCategory(database.expenses, CATEGORY.TRAVEL) },
      { label: CATEGORY.TRANSPORTATION, amt: sumCategory(database.expenses, CATEGORY.TRANSPORTATION) },
      { label: CATEGORY.GROCERIES, amt: sumCategory(database.expenses, CATEGORY.GROCERIES) },
      { label: CATEGORY.DRINKS, amt: sumCategory(database.expenses, CATEGORY.DRINKS) },
      { label: CATEGORY.ENTERTAINMENT, amt: sumCategory(database.expenses, CATEGORY.ENTERTAINMENT) },
      { label: CATEGORY.OTHER, amt: sumCategory(database.expenses, CATEGORY.OTHER) },
      { label: CATEGORY.COFFEETEA, amt: sumCategory(database.expenses, CATEGORY.COFFEETEA) },
      { label: CATEGORY.SUBSCRIPTION, amt: sumCategory(database.expenses, CATEGORY.SUBSCRIPTION) },
    ],
    totalExpense: { label: "Total Expenses", amt: totalExpense(database.expenses) },
    totalIncome: { label: "Total Income", amt: totalIncome(database.expenses) },
    netSpending: { label: "Net Spending", amt: netSpending(database.expenses) },
    dayAvgSpending: { label: "Average Spending Per Day", amt: dayAvgSpending(database) }
  }
}