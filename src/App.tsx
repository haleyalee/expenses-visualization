import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {CATEGORY} from './constants/expenses';
import { dayAvgSpending, netSpending, numToDollar, sumCategory, totalExpense, totalIncome } from './helper';

function App() {
  const [database, setDatabase] = useState<IDatabase|null>(null);

  useEffect(() => {
    Axios.get('http://localhost:8000/getExpenses')
    .then(response => setDatabase(response.data))
    .catch(err => console.log(err));
  }, []);

  return (
    <>
      <h1>My expenses</h1>

      {database && <>
        <h2>{database.title}</h2>
        <h3>Groceries total: { sumCategory(database.expenses, CATEGORY.GROCERIES)}</h3>
        <h3>Total expenses: { totalExpense(database.expenses) }</h3>
        <h3>Total income: { totalIncome(database.expenses) }</h3>
        <h3>Total spending: { netSpending(database.expenses) }</h3>
        <h3>Average spending: { dayAvgSpending(database) }</h3>
        {database.expenses.map((e,i) => 
          <div key={i}>
            <p>Name: {e.name} </p>
            <p>Category: {e.category}</p>
            <p>Date: {e.date}</p>
            <p>Amount: {numToDollar(e.amount)}</p>
          </div>
        )}
      </>}
    </>
  );
}

export default App;