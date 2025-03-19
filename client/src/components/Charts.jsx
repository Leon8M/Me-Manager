import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement, // Required for pie/doughnut charts
  CategoryScale, // Required for bar charts
  LinearScale, // Required for bar charts
  BarElement, // Required for bar charts
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export const PieChart = () => {
  const data = {
    labels: ['Food', 'Transport', 'Home', 'Miscellaneous'],
    datasets: [
      {
        data: [300, 50, 100, 50], // Example data
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
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
        data: [65, 59, 80, 81, 56, 55, 40], // Example data
      },
    ],
  };

  return <Bar data={data} />;
};