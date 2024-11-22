import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { getToday, getSpendingSummary, getPreviousMonth, getNextMonth, getDateString } from './helper';
import PieChart from './PieChart';
import SpendingSummary from './SpendingSummary';
import SpendingDetailsTable from './SpendingDetailsTable';

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
      // TODO: Figure out whether this displays allllll of the expense data (see September)
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
            {/* TODO: debounce button to only call API on x number of clicks */}
            <button onClick={handlePreviousMonth} disabled={currentMonth <= "2024-01"}>previous month</button>
            <h2>{getDateString(displayedData.date)}</h2>
            <button onClick={handleNextMonth} disabled={currentMonth >= getToday()}>next month</button>
          </div>

          <div className="dash">
            <div>
              {/* Pie Chart */}
              <PieChart data={displayedData.byCategory} />

              {/* Spending Summary */}
              <SpendingSummary data={displayedData} />
            </div>

            {/* Spending details */}
            <SpendingDetailsTable expenses={expenses} />
          </div>
        </>
          
      }
    </>
  );
}

export default App;