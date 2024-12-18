import React, { useEffect, useState } from 'react';
import { toDollar } from './helper';

const categories = ["income", "home", "groceries", "eating out", "drinking", "transportation", "entertainment", "shopping", "other"];

const SpendingDetailsTable = (props: { expenses: Expense[] } ) => {
  const {expenses} = props;

  const [filter, setFilter] = useState<Set<string>>(new Set());
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(expenses);

  // Filter expense data by categories selected
  useEffect(() => {
    if (filter.size > 0) {
      setFilteredExpenses(expenses.filter(exp => filter.has(exp.category)));
    } else {
      setFilteredExpenses(expenses);
    }
  }, [expenses, filter]);

  const categoryColor = (category: string) => {
    return category.replace(" ", "-");
  };

  const handleClick = (e) => {
    const category = e.target.value;
    const newFilter = new Set(filter);

    if (newFilter.has(category)) newFilter.delete(category);
    else newFilter.add(category);

    setFilter(newFilter);
  }

  return (
    <div id="spending-details" className="widget">
      <h3>spending details</h3>

      <div className="filter">
        {categories.map((c) => {
          const isSelected = filter.has(c);
          const pillColor = `--${categoryColor(c)}`;

          return (
            <button 
              key={c} 
              className={`category-pill ${isSelected ? "selected" : ""}`}
              style={{
                backgroundColor: isSelected? `var(${pillColor})` : "#E6E6E6",
              } as React.CSSProperties }
              value={c}
              onClick={(e) => handleClick(e)}
            >
              {c}
            </button>
          );
        })}
      </div>

      <table className="expense-table">
        <thead>
          <tr>
            <th>source</th>
            <th>category</th>
            <th>date</th>
            <th>amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses && filteredExpenses.map((e, idx) =>
            <tr key={idx}>
              <td>{e.name}</td>
              <td><span className={`category ${categoryColor(e.category)}`}>{e.category}</span></td>
              <td>{e.date}</td>
              <td>{toDollar(e.amount)}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default SpendingDetailsTable;