import React, { useState, useEffect } from 'react';
import Income from '../components/Income';
import Budget from '../components/Budget';
import Expenses from '../components/Expenses';
import Savings from '../components/Savings';
import { PieChart, BarChart } from '../components/Charts';
import httpClient from '../httpClient';

function Money() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);

  // Fetch expenses and budget from the backend
  const fetchExpenses = async () => {
    try {
      const response = await httpClient.get('//localhost:8080/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      alert('Unable to fetch expenses');
    }
  };

  const fetchBudget = async () => {
    try {
      const response = await httpClient.get('//localhost:8080/budget');
      setBudget(response.data.num);
    } catch (error) {
      console.error('Error fetching budget:', error);
      alert('Unable to fetch budget');
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchExpenses();
    fetchBudget();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Money Manager</h1>

      {/* Income Component (Always Visible) */}
      <div className="mb-6">
        <Income fetchExpenses={fetchExpenses} />
      </div>

      {/* Budget Component */}
      <div className="mb-6">
        <Budget
          fetchExpenses={fetchExpenses}
          expenses={expenses}
          budget={budget}
          fetchBudget={fetchBudget}
        />
      </div>

      {/* Expenses and Savings Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Expenses fetchExpenses={fetchExpenses} />
        </div>
        <div>
          <Savings fetchExpenses={fetchExpenses} />
        </div>
      </div>

      {/* Charts */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Expense Breakdown</h2>
        <PieChart expenses={expenses} />
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Monthly Trends</h2>
        <BarChart expenses={expenses} />
      </div>
    </div>
  );
}

export default Money;