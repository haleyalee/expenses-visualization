import React, { useEffect, useState } from 'react';
import Chart from "chart.js/auto";
import { CategoryScale, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { toDollar } from './helper';

Chart.register(CategoryScale);

const chartSettings = {
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
        data: data.byCategory.map((e) => e.amt),
        ...chartSettings
      }
    ]
  })

  useEffect(() => {
    setChartData({
      labels: data.byCategory.map((e) => e.label),
      datasets: [
        { 
          data: data.byCategory.map((e) => e.amt),
          ...chartSettings
        }
      ]
    })
  }, [data])

  const options:ChartOptions<"doughnut"> = {
    layout: {
      padding: 0
    },
    plugins: {
      legend: {
        position: "right",
        labels: {
          filter: (item, context) => {
            // removes unused categories from legend
            return context.datasets[0].data[item.index ?? 0] !== 0 
          },
          sort: (a, b) => {
            // sorts in alphabetical order
            return (a.text > b.text) ? 1 : -1;
          }
        }
      },
      tooltip: {
        displayColors: false,
        titleAlign: "center",
        bodyAlign: "center",
        padding: 8,
        callbacks: {
          title: (context) => {
            let title = context[0].label || "category";
            const total = context[0].dataset.data.reduce((a, b) => a+b);
            title += ` (${~~(context[0].parsed/total * 100)}%)`;
            return title;
          },
          label: (context) => {
            let label = context.dataset.label || '';
            label += toDollar(context.parsed);
            return label;
          }
        }
      }
    }
  }
  
  return (
    <Doughnut
      data={chartData}
      options={options}
    />
  )
}

export default PieChart;