import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { getToday, getSpendingSummary, getPreviousMonth, getNextMonth, getDateString } from './helper';
import PieChart from './PieChart';
import SpendingSummary from './SpendingSummary';
import SpendingDetailsTable from './SpendingDetailsTable';
import SkeletonLoader from './SkeletonLoader';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [displayedData, setDisplayedData] = useState<SpendingSummary | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>(getToday());
  const [pendingClicks, setPendingClicks] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  // Fetch data for the initially selected month
  useEffect(() => {
    setLoading(true);
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
          // Do not allow to navigate to disabled months
          return newMonth >= getToday() ? getToday() : newMonth;
        });
        setPendingClicks(0);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [pendingClicks]);

  const fetchMonthData = async (month) => {
    try {
      const response = await Axios.get(`http://localhost:8000/getExpenses?month=${month}`);
      const monthData = response.data.expenses[0]; // Assuming the server sends data as { expenses: [{...}] }
      setExpenses(monthData.expenses);
      if (monthData) {
        const analyzedData = getSpendingSummary(monthData);
        setDisplayedData(analyzedData);
      }
    } catch (err) {
      console.log(`Error fetching expense data for ${month}: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    setPendingClicks((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    setPendingClicks((prev) => prev + 1);
  };

  return (
    <>
      <div className="header">
        <h1>haley's expenses</h1>
        <p>*manually tracked in <a href="https://www.notion.com/">Notion</a>, visualized pretty here ☺︎</p>
      </div>
      
      <div className="nav">
        <button onClick={handlePreviousMonth} disabled={currentMonth <= "2024-01"}>previous month</button>
        <h2>{getDateString(displayedData?.date)}</h2>
        <button onClick={handleNextMonth} disabled={currentMonth >= getToday()}>next month</button>
      </div>

      { loading ? (
        <SkeletonLoader />
      ) : (
        displayedData && (
          <div className="dash">
            <div>
              <PieChart data={displayedData.byCategory} />
              <SpendingSummary data={displayedData} />
            </div>
            <SpendingDetailsTable expenses={expenses} />
          </div>
        )
      )}
    </>
  );
}

export default App;