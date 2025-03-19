import React from 'react';
import Income from '../components/Income';
import Budget from '../components/Budget';
import Expenses from '../components/Expenses';
import Savings from '../components/Savings';
import { PieChart, BarChart } from '../components/Charts'; // Add chart components

function Money() {
  return (
    <div className="sm:flex sm:flex-col sm:gap-4 p-4 md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 h-screen">
      <div className="flex flex-col justify-center items-center p-4 bg-gray-100 shadow-md rounded-md">
        <Income />
      </div>
      <div className="flex flex-col justify-center items-center p-4 bg-gray-100 shadow-md rounded-md">
        <Budget />
      </div>
      <div className="flex flex-col justify-center items-center p-4 bg-gray-100 shadow-md rounded-md">
        <Expenses />
      </div>
      <div className="flex flex-col justify-center items-center p-4 bg-gray-100 shadow-md rounded-md">
        <Savings />
      </div>
      <div className="col-span-2 p-4 bg-gray-100 shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">Expense Breakdown</h2>
        <PieChart />
      </div>
      <div className="col-span-2 p-4 bg-gray-100 shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">Monthly Trends</h2>
        <BarChart />
      </div>
    </div>
  );
}

export default Money;