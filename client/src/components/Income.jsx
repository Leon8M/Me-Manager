import React, { useState } from 'react';
import httpClient from '../httpClient';

function Income() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [list, setList] = useState([]);

  const addIncome = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      await httpClient.post('//localhost:8080/income', {
        name,
        amount,
      });
      alert('Income added successfully');
      setName('');
      setAmount('');
    } catch (error) {
      console.error('Error adding income:', error);
      alert('Unable to add income');
    }
  };

  const listIncome = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await httpClient.get('//localhost:8080/income');
      console.log('Response data:', response.data);
      setList(response.data);
    } catch (error) {
      console.error('Error fetching income:', error);
      alert('Unable to list income');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4 text-center">Manage Income</h1>
      
      <form className="space-y-4">
        <div>
          <label htmlFor="income-name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={name}
            id="income-name"
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Income source (e.g., Salary)"
          />
        </div>

        <div>
          <label htmlFor="income-amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={amount}
            id="income-amount"
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter amount"
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={addIncome}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
          >
            Add Income
          </button>
          <button
            onClick={listIncome}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            List Income
          </button>
        </div>
      </form>

      <h2 className="mt-6 text-lg font-semibold text-gray-700">Income List</h2>
      <ul className="mt-4 space-y-2">
        {list.map((income) => (
          <li
            key={income.id}
            className="p-4 border rounded-md shadow-sm bg-gray-50 flex justify-between items-center"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">{income.name}</p>
              <p className="text-sm text-gray-600">${income.amount}</p>
            </div>
            <p className="text-sm font-bold text-green-700">Total: ${income.total}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Income;
