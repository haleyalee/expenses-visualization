const sumSpending = (exp:IExpense[]) => {
  const sum = exp.map((e) => e.amount).reduce((acc, curr) => acc + curr, 0);
  return sum;
}

const dollarToNum = (dollar: string): number => {
  let amt = 0;
  if (dollar.includes('-')) amt = parseFloat(dollar.slice(2));
  else amt = parseFloat(dollar.slice(1));
  return amt;
}

/* numToDollar
 * Helper function to format numbers into US currency
 * Parameters:
 *  amt:number              e.g. -11.5
 * Returns: string          e.g. `-$11.50`
*/
export const numToDollar = (amt: number): string => {
  let dollar = ''
  if (amt < 0) {
    let a = amt * -1;
    dollar += '-$' + a?.toFixed(2)
  }
  else dollar += '$' + amt?.toFixed(2);
  return dollar;
};

/* sumCategory
 * Helper function to compute the total sum of a specified category month
 * Parameters:
 *  databaseExp:IExpense[]
 *  category:string         e.g. `groceries`
 * Returns: string          e.g. `-$185.33`
*/
export const sumCategory = (databaseExp:IExpense[], category:string): string => {
  const catExpArr:IExpense[] = databaseExp.filter((e) => e.category.includes(category));
  return numToDollar(sumSpending(catExpArr));
};

/* totalExpense
*  Helper function to compute total expenses of specified database month
*  Parameters:
*   databaseExp:IExpense[]
*  Returns: string          e.g. `-$3400.00`
*/
export const totalExpense = (databaseExp:IExpense[]): string => {
  const spendingArr = databaseExp.filter((e) => e.amount < 0);
  return numToDollar(sumSpending(spendingArr));
}

/* totalIncome
*  Helper function to compute total income of specified database month
*  Parameters:
*   databaseExp:IExpense[]
*  Returns: string          e.g. `$4300.00`
*/
export const totalIncome = (databaseExp:IExpense[]): string => {
  const spendingArr = databaseExp.filter((e) => e.amount >= 0);
  return numToDollar(sumSpending(spendingArr));
}

/* netSpending
*  Helper function to compute total sum (expenses + income) of specified database month
*  Parameters:
*   databaseExp:IExpense[]
*  Returns: string          e.g. `$500.00`
*/
export const netSpending = (databaseExp:IExpense[]):string => {
  return numToDollar(sumSpending(databaseExp));
}

/* dayAvgSpending
*  Helper function to compute average spending per day of specified database month
*  Parameters:
*   databaseExp:IExpense[]
*  Returns: string          e.g. `-$50/day`
*/
export const dayAvgSpending = (database:IDatabase): string => {
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

  const avg = dollarToNum(totalExpense(database.expenses))/days;
  return numToDollar(avg) + '/day';
}