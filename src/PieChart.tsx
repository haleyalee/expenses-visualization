import React, { useEffect, useState } from 'react';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { dollarToNum } from './helper';

Chart.register(CategoryScale);

const chartSettings = {
  label: "-$",
  borderWidth: 1,
  borderColor: [
    "rgba(55,53,47,   1)",
    "rgba(155,154,151,1)",
    "rgba(100,71,58,  1)",
    "rgba(217,115,13, 1)",
    "rgba(223,171,1,  1)",
    "rgba(15,123,108, 1)",
    "rgba(11,110,153, 1)",
    "rgba(105,64,165, 1)",
    "rgba(173,26,114, 1)",
    "rgba(224,62,62,  1)",
  ],
  backgroundColor: [
    "rgba(55,53,47,   0.3)",
    "rgba(155,154,151,0.3)",
    "rgba(100,71,58,  0.3)",
    "rgba(217,115,13, 0.3)",
    "rgba(223,171,1,  0.3)",
    "rgba(15,123,108, 0.3)",
    "rgba(11,110,153, 0.3)",
    "rgba(105,64,165, 0.3)",
    "rgba(173,26,114, 0.3)",
    "rgba(224,62,62,  0.3)",
  ]
}

const PieChart = (props: { data:ISpendingSummary } ) => {
  const { data } = props;
  const [chartData, setChartData] = useState({
    labels: data.byCategory.map((e) => e.label),
    datasets: [
      {
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
          data: data.byCategory.map((e) => dollarToNum(e.amt)),
          ...chartSettings
        }
      ]
    })
  }, [data])
  
  return (
    <Doughnut
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