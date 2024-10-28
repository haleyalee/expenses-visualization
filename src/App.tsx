import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { getToday, getSpendingSummary, getPreviousMonth, getNextMonth, getDateString, toDollar } from './helper';
import PieChart from './PieChart';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [analyzedDb, setAnalyzedDb] = useState<SpendingSummary[]>([]);
  const [displayedData, setDisplayedData] = useState<SpendingSummary | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>(getToday());
  
  // Fetch data for the initially selected month
  useEffect(() => {
    fetchMonthData(currentMonth);
  }, [currentMonth]);

  const fetchMonthData = async (month) => {
    try {
      const response = await Axios.get(`http://localhost:8000/getExpenses?month=${month}`);
      const monthData = response.data.expenses[0]; // Assuming the server sends data as { expenses: [{...}] }
      setExpenses(monthData.expenses);
      if (monthData) {
        const analyzedData = getSpendingSummary(monthData);
        setDisplayedData(analyzedData);
        // Keep track of all loaded months
        setAnalyzedDb((prev) => [...prev.filter(data => data.date !== month), analyzedData]);
      }
    } catch (err) {
      console.log(`Error fetching expense data for ${month}: ${err}`);
    }
  };

  const handlePreviousMonth = () => {
    const previousMonth = getPreviousMonth(currentMonth);
    setCurrentMonth(previousMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = getNextMonth(currentMonth);
    setCurrentMonth(nextMonth);
  };

  return (
    <>
      <div className="header">
        <h1>haley's expenses</h1>
        <p>*manually tracked in <a href="https://www.notion.com/">Notion</a>, visualized pretty here ☺︎</p>
      </div>

      {displayedData && <>
          {/* Month Navigation */}
          <div className="nav">
            <button onClick={handlePreviousMonth} disabled={currentMonth <= "2024-01"}>previous month</button>
            <h2>{getDateString(displayedData.date)}</h2>
            <button onClick={handleNextMonth} disabled={currentMonth >= getToday()}>next month</button>
          </div>

          <div className="dash">
            <div>
              {/* Pie Chart */}
              <div className="widget pie-chart">
                <PieChart data={displayedData.byCategory} />
              </div>

              {/* Spending Summary */}
              <div className="widget spending-summary">
                <h3>spending summary</h3>
                <table>
                  <tr>
                    <td>total expenses</td>
                    <td>{displayedData.totalExpense.amt}</td>
                  </tr>
                  <tr>
                    <td>total income</td>
                    <td>{displayedData.totalIncome.amt}</td>
                  </tr>
                  <tr>
                    <td>net spending</td>
                    <td>{displayedData.netSpending.amt}</td>
                  </tr>
                </table>
              </div>
            </div>

            {/* Spending details */}
            <div className="widget spending-details">
              <h3>spending details</h3>
              <table className="expense-table">
                <thead>
                  <th>source</th>
                  <th>category</th>
                  <th>date</th>
                  <th>amount</th>
                </thead>
                {expenses && expenses.map((e, idx) =>
                  <tr key={idx}>
                    <td>{e.name}</td>
                    <td><span className={e.category.replace(" ", "-")}>{e.category}</span></td>
                    <td>{e.date}</td>
                    <td>{toDollar(e.amount)}</td>
                  </tr>
                )}
              </table>
            </div>
          </div>
        </>
          
      }
    </>
  );
}

export default App;