import React, { useState } from 'react';
import httpClient from '../httpClient';
import { FaPlus, FaList, FaUtensils, FaCar, FaHome, FaRandom } from 'react-icons/fa';

function Expenses({ fetchExpenses }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState("");
  const [list, setList] = useState([]);

  const addExpense = async (e) => {
    e.preventDefault();
    try {
      await httpClient.post('//localhost:8080/expenses', {
        name,
        amount,
        category
      });
      setName('');
      setAmount('');
      setCategory('');
      fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const listExpenses = async (e) => {
    e.preventDefault();
    try {
      const response = await httpClient.get('//localhost:8080/expenses');
      setList(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Food': return <FaUtensils className="inline mr-1" />;
      case 'Transport': return <FaCar className="inline mr-1" />;
      case 'Home': return <FaHome className="inline mr-1" />;
      default: return <FaRandom className="inline mr-1" />;
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Track Expenses</h2>
      
      <form onSubmit={addExpense} className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Expense name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Amount"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Home">Home</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-black text-white py-2 px-4 rounded hover:bg-gray-800 flex items-center justify-center gap-2"
          >
            <FaPlus /> Add
          </button>
          <button
            onClick={listExpenses}
            className="flex-1 bg-gray-200 text-black py-2 px-4 rounded hover:bg-gray-300 flex items-center justify-center gap-2"
          >
            <FaList /> List
          </button>
        </div>
      </form>
      
      <div>
        <h3 className="font-medium mb-2">Recent Expenses</h3>
        <ul className="space-y-2">
          {list.slice(0, 3).map((expense) => (
            <li key={expense.id} className="p-3 border border-gray-200 rounded flex justify-between">
              <div>
                {getCategoryIcon(expense.category)}
                <span className="font-medium">{expense.name}</span>
              </div>
              <div className="text-gray-700">${expense.amount}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Expenses;