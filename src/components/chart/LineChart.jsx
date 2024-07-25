import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const LineChart = () => {
  const data = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sales Value',
        data: [10000, 20000, 15000, 25000, 30000, 35000, 40000, 60000],
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        fill: true,
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
        title: { display: true, text: 'Value ($)' } 
      },
    },
  };

  return <Line data={data} options={options} height={400} />;
};

export default LineChart;
