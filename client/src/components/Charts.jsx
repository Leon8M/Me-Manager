import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';

export const PieChart = () => {
  const data = {
    labels: ['Food', 'Transport', 'Home', 'Miscellaneous'],
    datasets: [
      {
        data: [300, 50, 100, 50],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return <Pie data={data} />;
};

export const BarChart = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Expenses',
        backgroundColor: '#36A2EB',
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };

  return <Bar data={data} />;
};