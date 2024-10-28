import React from 'react';

const SpendingSummary = (props: { data: SpendingSummary } ) => {

  const {data} = props;
  return (
    <div id="spending-summary" className="widget">
      <h3>spending summary</h3>
      <table>
        <tbody>
          <tr>
            <td>total expenses</td>
            <td>{data.totalExpense.amt}</td>
          </tr>
          <tr>
            <td>total income</td>
            <td>{data.totalIncome.amt}</td>
          </tr>
          <tr>
            <td>net spending</td>
            <td>{data.netSpending.amt}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default SpendingSummary;