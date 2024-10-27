import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { getToday, getSpendingSummary } from './helper';
import PieChart from './PieChart';

function App() {
  const [db, setDb] = useState<Database>({
    title: "2024",
    expenses: []
  });

  const [analyzedDb, setAnalyzedDb] = useState<SpendingSummary[]>(
    [{
      date: "YYYY-MM",
      byCategory: [{label: "Category", amt: 0}],
      totalExpense: { label: "Total Expenses", amt: "$0.00" },
      totalIncome: { label: "Total Income", amt: "$0.00" },
      netSpending: { label: "Net Spending", amt: "$0.00" },
    }]
  );

  const [displayedData, setDisplayedData] = useState<SpendingSummary>(
    {
      date: "YYYY-MM",
      byCategory: [{label: "Category", amt: 0}],
      totalExpense: { label: "Total Expenses", amt: "$0.00" },
      totalIncome: { label: "Total Income", amt: "$0.00" },
      netSpending: { label: "Net Spending", amt: "$0.00" },
    }
  );

  const today = getToday();
  const [date, setDate] = useState<string>(today);
  
  useEffect(() => {
    Axios.get("http://localhost:8000/getExpenses")
    .then(response => {
      // Get all expense data
      setDb(response.data);
      return response.data;
    })
    .then(db => { 
      // Analyze expense data by month
      const monthlyAnalysis = db.expenses?.map((month: MonthlyExpenses) => getSpendingSummary(month));
      setAnalyzedDb(monthlyAnalysis);
    })
    .catch(err => console.log(`Error fetching expense data: ${err}`));
  }, []);

  useEffect(() => {
    analyzedDb.forEach((month, idx) => {
      if (month.date === today) {
        setDisplayedData(analyzedDb[idx]);
      };
    });
  }, [today, analyzedDb, db]);

  return (
    <>
      <h1>My expenses</h1>
      {db && <>
        <h2>Expense Breakdown for {displayedData.date}</h2>
        <div style={{display: 'flex', width: "50%", justifyContent: 'center', alignItems: 'center'}}>
          <PieChart data={displayedData.byCategory}/>
        </div>
        <h3>Total expenses: { displayedData.totalExpense.amt }</h3>
        <h3>Total income: { displayedData.totalIncome.amt }</h3>
        <h3>Net spending: { displayedData.netSpending.amt }</h3>
      </>}
    </>
  );
}

export default App;