import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {CATEGORY} from './constants/expenses';
import { getSpendingSummary } from './helper';
import PieChart from './PieChart';

function App() {
  const [database, setDatabase] = useState<IDatabase>({
    title: 'Expenses',
    expenses: []
  });

  const [data, setData] = useState<ISpendingSummary>({
    title: "Title",
    byCategory: [{label: "Category", amt: "Category Amt"}],
    totalExpense: { label: "Total Expenses", amt: "Total Expenses Amt" },
    totalIncome: { label: "Total Income", amt: "Total Income Amt" },
    netSpending: { label: "Net Spending", amt: "Net Spending Amt" },
    dayAvgSpending: { label: "Avg Spending Per Day", amt: "Avg Spending Per Day Amt" },
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
        <h2>{database.title}</h2>
        <div style={{display: 'flex', width: "50%", justifyContent: 'center', alignItems: 'center'}}>
          <PieChart data={data}/>
        </div>
        {/* <h3>Groceries total: { data.byCategory.filter((c) => c.label===CATEGORY.GROCERIES)[0].amt }</h3> */}
        <h3>Total expenses: { data.totalExpense.amt }</h3>
        <h3>Total income: { data.totalIncome.amt }</h3>
        <h3>Net spending: { data.netSpending.amt }</h3>
        <h3>Average spending: { data.dayAvgSpending.amt }</h3>
      </>}
    </>
  );
}

export default App;