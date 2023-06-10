import React, { useEffect, useState } from 'react';
import Axios from 'axios';

interface IExpense {
  name: string,
  category: string[],
  date: string,
  amount: number
}

interface IDatabase {
  title: string,
  expenses: IExpense[]
}

function App() {
  const [database, setDatabase] = useState<IDatabase|null>(null);

  useEffect(() => {
    Axios.get('http://localhost:8000/getExpenses')
    .then(response => setDatabase(response.data))
    .catch(err => console.log(err));
  }, []);

  const numToDollar = (amt: number): string => {
    let dollar = ''
    if (amt < 0) {
      let a = amt * -1;
      dollar += '-$' + a?.toFixed(2)
    }
    else dollar += '$' + amt?.toFixed(2);

    return dollar;
  };
  
  return (
    <>
      <h1>My expenses</h1>
      {database && <>
        <h2>{database.title}</h2>
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