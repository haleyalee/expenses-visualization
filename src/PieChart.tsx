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
};

const PieChart = (props: { data: SpendingSummary["byCategory"] } ) => {
  const { data } = props;
  const [chartData, setChartData] = useState({
    labels: data.map((e) => e.label),
    datasets: [
      {
        data: data.map((e) => e.amt),
        ...chartSettings
      }
    ]
  });

  useEffect(() => {
    setChartData({
      labels: data.map((e) => e.label),
      datasets: [
        { 
          data: data.map((e) => e.amt),
          ...chartSettings
        }
      ]
    })
  }, [data]);

  const total = chartData.datasets[0].data.reduce((acc, value) => acc + value, 0);

  const options: ChartOptions<"doughnut"> = {
    plugins: {
      legend: {
        position: "left",
        labels: {
          filter: (item, context) => context.datasets[0].data[item.index ?? 0] !== 0,
          sort: (a, b) => (a.text > b.text) ? 1 : -1 
        }
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const title = context[0].label || "category";
            const percent = (context[0].parsed/total*100).toFixed(1);
            return `${title} (${percent}%)`;
          },
          label: (context) => {
            let value = context.raw as number;
            return ` ${toDollar(-1*value)}`;
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