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
  const [pendingClicks, setPendingClicks] = useState<number>(0);
  
  // Fetch data for the initially selected month
  useEffect(() => {
    fetchMonthData(currentMonth);
  }, [currentMonth]);

  // Debounce effect: Wait for the user to stop clicking
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pendingClicks !== 0) {
        setCurrentMonth((prevMonth) => {
          let newMonth = prevMonth;
          for (let i = 0; i < Math.abs(pendingClicks); i++) {
            newMonth = pendingClicks > 0 ? getNextMonth(newMonth) : getPreviousMonth(newMonth);
          }
          // do not allow to navigate to disabled months
          return newMonth >= getToday() ? getToday() : newMonth;
        });
        setPendingClicks(0);
      }
    }, 300);
    return () => clearTimeout(timer); // Cleanup timer on effect re-run
  }, [pendingClicks]);

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
    // const previousMonth = getPreviousMonth(currentMonth);
    // setCurrentMonth(previousMonth);
    setPendingClicks((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    // const nextMonth = getNextMonth(currentMonth);
    // setCurrentMonth(nextMonth);
    setPendingClicks((prev) => prev + 1);
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