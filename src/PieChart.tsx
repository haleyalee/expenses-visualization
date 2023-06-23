import React, { useEffect, useState } from 'react';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Pie } from "react-chartjs-2";
import { dollarToNum } from './helper';

Chart.register(CategoryScale);

const chartSettings = {
  borderColor: "#CCCCCC",
  borderWidth: 1,
  backgroundColor: [
    "#EBECED",
    "#E9E5E3",
    "#FAEBDD",
    "#FBF3DB",
    "#DDEDEA",
    "#F4DFEB",
    "#FBE4E4"
  ]
}

const PieChart = (props: { data:ISpendingSummary } ) => {
  const { data } = props;
  const [chartData, setChartData] = useState({
    labels: data.byCategory.map((e) => e.label),
    datasets: [
      {
        label: "-$",
        data: data.byCategory.map((e) => dollarToNum(e.amt)),
        ...chartSettings
      }
    ]
  })

  useEffect(() => {
    setChartData({
      labels: data.byCategory.map((e) => e.label),
      datasets: [
        { 
          label: "-$",
          data: data.byCategory.map((e) => dollarToNum(e.amt)),
          ...chartSettings
        }
      ]
    })
  }, [data])
  
  return (
    <Pie
      data={chartData}
      options={{
        plugins: {
          title: {
            display: true,
            text: `Expense Breakdown for ${data.title}`
          }
        }
      }}
    />
  )
}

export default PieChart