import React, { useState, useEffect } from 'react';
import Income from '../components/Income';
import Budget from '../components/Budget';
import Expenses from '../components/Expenses';
import Savings from '../components/Savings';
import { PieChart, BarChart } from '../components/Charts';
import httpClient from '../httpClient';
import { FaMoneyBillWave, FaChartPie, FaChartBar } from 'react-icons/fa';

function Money() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [savings, setSavings] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchExpenses = async () => {
    try {
      const response = await httpClient.get('//localhost:8080/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchBudget = async () => {
    try {
      const response = await httpClient.get('//localhost:8080/budget');
      setBudget(response.data.num);
    } catch (error) {
      console.error('Error fetching budget:', error);
    }
  };

  const fetchSavings = async () => {
    try {
      const response = await httpClient.get('//localhost:8080/save');
      setSavings(response.data);
    } catch (error) {
      console.error('Error fetching savings:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchBudget();
    fetchSavings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Navigation */}
      <nav className="flex justify-around items-center bg-black text-white p-4 mb-6 rounded-lg">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`flex items-center gap-2 ${activeTab === 'dashboard' ? 'text-white' : 'text-gray-400'}`}
        >
          <FaMoneyBillWave />
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('charts')} 
          className={`flex items-center gap-2 ${activeTab === 'charts' ? 'text-white' : 'text-gray-400'}`}
        >
          <FaChartPie />
          Charts
        </button>
      </nav>

      {activeTab === 'dashboard' ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <Income fetchExpenses={fetchExpenses} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <Budget
                fetchExpenses={fetchExpenses}
                expenses={expenses}
                budget={budget}
                fetchBudget={fetchBudget}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <Expenses fetchExpenses={fetchExpenses} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <Savings fetchExpenses={fetchExpenses} fetchSavings={fetchSavings} />
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaChartPie /> Expense Breakdown
          </h2>
          <PieChart expenses={expenses} />
          
          <h2 className="text-xl font-bold mt-6 mb-4 flex items-center gap-2">
            <FaChartBar /> Monthly Trends
          </h2>
          <BarChart expenses={expenses} />
        </div>
      )}
    </div>
  );
}

export default Money;