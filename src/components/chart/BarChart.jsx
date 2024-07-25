import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChart = () => {
  const data = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Total Orders',
        data: [30, 25, 35, 20, 25, 30],
        backgroundColor: '#fa8c16',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { 
        type: 'category',
        title: { display: true, text: 'Months' } 
      },
      y: { 
        title: { display: true, text: 'Orders' } 
      },
    },
  };

  return <Bar data={data} options={options} height={400} />;
};

export default BarChart;
