import React, { useState, useEffect } from 'react';
import Income from '../components/Income';
import Budget from '../components/Budget';
import Expenses from '../components/Expenses';
import Savings from '../components/Savings';
import { PieChart, BarChart } from '../components/Charts';
import httpClient from '../httpClient';
import IncomePopup from '../components/IncomePopup';
import ExpensePopup from '../components/ExpensePopup';
import { useMediaQuery } from 'react-responsive';

function Money() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [savings, setSavings] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showIncomePopup, setShowIncomePopup] = useState(false);
  const [showExpensePopup, setShowExpensePopup] = useState(false);
  
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const fetchAllData = async () => {
    try {
      const [expensesRes, budgetRes, savingsRes, incomeRes] = await Promise.all([
        httpClient.get('https://me-manager.onrender.com/expenses'),
        httpClient.get('https://me-manager.onrender.com/budget'),
        httpClient.get('https://me-manager.onrender.com/save'),
        httpClient.get('https://me-manager.onrender.com/income')
      ]);

      setExpenses(expensesRes.data);
      setBudget(budgetRes.data.num);
      setSavings(savingsRes.data);
      
      // Here we process transactions
      const incomeTransactions = incomeRes.data.map(item => ({
        id: item.id,
        type: 'income',
        source: item.name,
        amount: item.amount,
        date: new Date(item.created_at).toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        })
      }));

      const expenseTransactions = expensesRes.data.map(item => ({
        id: item.id,
        type: 'expense',
        source: item.name,
        amount: -item.amount,
        date: new Date(item.created_at).toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        })
      }));

      setTransactions([...incomeTransactions, ...expenseTransactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5));
      
      // And we calculate the balance here, I know, too much right
      const totalIncome = incomeRes.data.reduce((sum, item) => sum + item.amount, 0);
      const totalExpenses = expensesRes.data.reduce((sum, item) => sum + item.amount, 0);
      setBalance(totalIncome - totalExpenses);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddIncome = async (data) => {
    try {
      await httpClient.post('//localhost:8080/income', {
        name: data.description,
        amount: parseFloat(data.amount)
      });
      fetchAllData();
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const handleAddExpense = async (data) => {
    try {
      await httpClient.post('https://me-manager.onrender.com/expenses', {
        name: data.description,
        amount: parseFloat(data.amount),
        category: 'General',
        month: new Date().toISOString().slice(0, 7) // YYYY-MM format, dont question it :)
      });
      fetchAllData();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Money Manager</h1>
        <span className="text-gray-600">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Time Period Tabs */}
      <div className="flex justify-around bg-white rounded-lg p-2 mb-6 shadow">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`py-2 px-4 ${activeTab === 'dashboard' ? 'font-bold text-black' : 'text-gray-500'}`}
        >
          DASHBOARD
        </button>
        <button 
          onClick={() => setActiveTab('monthly')} 
          className={`py-2 px-4 ${activeTab === 'monthly' ? 'font-bold text-black' : 'text-gray-500'}`}
        >
          MONTHLY
        </button>
        <button 
          onClick={() => setActiveTab('charts')} 
          className={`py-2 px-4 ${activeTab === 'charts' ? 'font-bold text-black' : 'text-gray-500'}`}
        >
          CHARTS
        </button>
      </div>

      {/* Balance Card */}
      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Balance</h2>
          <span className="text-gray-600">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-3xl font-bold">₹{balance.toLocaleString()}</p>
      </div>

      {activeTab === 'dashboard' && (
        <>
          {/* Main Components - Hidden on mobile when using popups, obviously dumb ass :) */}
          {!isMobile && (
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow">
                <Budget 
                  fetchExpenses={fetchAllData}
                  expenses={expenses}
                  budget={budget}
                  fetchBudget={fetchAllData}
                />
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <Income fetchExpenses={fetchAllData} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <Expenses fetchExpenses={fetchAllData} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <Savings fetchExpenses={fetchAllData} fetchSavings={fetchAllData} />
                </div>
              </div>
            </div>
          )}

          {/* Transactions */}
          <div className="bg-white rounded-lg p-4 shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div key={`${transaction.type}-${transaction.id}`} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{transaction.source}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                    <p className={`font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{Math.abs(transaction.amount).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No transactions yet</p>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'monthly' && (
        <MonthlySummary expenses={expenses} />
      )}

      {activeTab === 'charts' && (
        <div className="space-y-4">
          <PieChart expenses={expenses} />
          <BarChart expenses={expenses} />
        </div>
      )}

      {/* Mobile Action Buttons, best to cal lthem that, ain't i proffesional 😊 */}
      {isMobile && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-4 px-4">
          <button 
            onClick={() => setShowIncomePopup(true)}
            className="bg-black text-white py-3 px-6 rounded-full shadow-lg"
          >
            Income
          </button>
          <button 
            onClick={() => setShowExpensePopup(true)}
            className="bg-black text-white py-3 px-6 rounded-full shadow-lg"
          >
            Expense
          </button>
        </div>
      )}

      {/* Popups Poppin'*/}
      {showIncomePopup && (
        <IncomePopup 
          onClose={() => setShowIncomePopup(false)}
          onSubmit={handleAddIncome}
        />
      )}
      {showExpensePopup && (
        <ExpensePopup 
          onClose={() => setShowExpensePopup(false)}
          onSubmit={handleAddExpense}
        />
      )}
    </div>
  );
}

// Monthly Summary Component, not ready to implement it fully, am a bit lazy
const MonthlySummary = ({ expenses }) => {
  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.created_at).toLocaleString('default', { 
      month: 'short', 
      year: 'numeric' 
    });
    if (!acc[month]) {
      acc[month] = { income: 0, expenses: 0 };
    }
    acc[month].expenses += expense.amount;
    return acc;
  }, {});

  // Add income data (you would fetch this from your backend)
  // This is a placeholder, I'll replace with actuall data from database
  const monthlyIncome = {
    'Sep 2022': 16000,
    'Aug 2022': 11200,
    'Jul 2022': 15000
  };

  // Combine data, best off
  const combinedData = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    income: monthlyIncome[month] || 0,
    expense: data.expenses,
    balance: (monthlyIncome[month] || 0) - data.expenses
  }));

  return (
    <div className="bg-white rounded-lg p-4 shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Monthly Summary</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Month</th>
              <th className="text-right py-2">Income</th>
              <th className="text-right py-2">Expense</th>
              <th className="text-right py-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {combinedData.length > 0 ? (
              combinedData.map((data, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{data.month}</td>
                  <td className="text-right">₹{data.income.toLocaleString()}</td>
                  <td className="text-right">₹{data.expense.toLocaleString()}</td>
                  <td className={`text-right font-bold ${
                    data.balance >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    ₹{Math.abs(data.balance).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No monthly data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Money;