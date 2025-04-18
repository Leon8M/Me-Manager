import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export const PieChart = ({ expenses }) => {
  const data = {
    labels: expenses.map((expense) => expense.category),
    datasets: [
      {
        data: expenses.map((expense) => expense.amount),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
      <div style={{ height: '250px' }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export const BarChart = ({ expenses }) => {
  // Group expenses by month for the bar chart
  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.created_at).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += expense.amount;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Monthly Expenses',
        backgroundColor: '#36A2EB',
        data: Object.values(monthlyData),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
      <div style={{ height: '250px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};