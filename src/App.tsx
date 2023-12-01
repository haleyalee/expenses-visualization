import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {CATEGORY} from './constants/expenses';
import { getSpendingSummary } from './helper';
import PieChart from './PieChart';
import { toDollar } from './helper';

function App() {
  const [database, setDatabase] = useState<IDatabase>({
    title: 'Expenses',
    expenses: []
  });

  const [data, setData] = useState<ISpendingSummary>({
    title: "Title",
    byCategory: [{label: "Category", amt: 0}],
    totalExpense: { label: "Total Expenses", amt: 0 },
    totalIncome: { label: "Total Income", amt: 0 },
    netSpending: { label: "Net Spending", amt: 0 },
    dayAvgSpending: { label: "Avg Spending Per Day", amt: 0 },
  })

  useEffect(() => {
    Axios.get('http://localhost:8000/getExpenses')
    .then(response => setDatabase(response.data))
    .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    setData(getSpendingSummary(database))
  }, [database]);

  return (
    <>
      <h1>My expenses</h1>
      {database && <>
        <h2>Expense Breakdown for {database.title}</h2>
        <div style={{display: 'flex', width: "50%", justifyContent: 'center', alignItems: 'center'}}>
          <PieChart data={data}/>
        </div>
        {/* <h3>Groceries total: { data.byCategory.filter((c) => c.label===CATEGORY.GROCERIES)[0].amt }</h3> */}
        <h3>Total expenses: { toDollar(data.totalExpense.amt) }</h3>
        <h3>Total income: { toDollar(data.totalIncome.amt) }</h3>
        <h3>Net spending: { toDollar(data.netSpending.amt) }</h3>
        <h3>Average spending: { toDollar(data.dayAvgSpending.amt) } /day</h3>
      </>}
    </>
  );
}

export default App;