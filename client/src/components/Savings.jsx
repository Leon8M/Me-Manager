import React, { useState } from 'react';
import httpClient from '../httpClient';

function Savings({ fetchExpenses }) {
  const [action, setAction] = useState('');
  const [amount, setAmount] = useState('');
  const [list, setList] = useState([]);

  const addSavings = async (e) => {
    e.preventDefault();
    try {
      const savingsAmount = parseInt(amount);

      // Step 1: Save the action & amount to savings database
      await httpClient.post('//localhost:8080/save', {
        action,
        amount: savingsAmount,
      });

      // Step 2: If the action is "Increment", also log it as an expense
      if (action === "Increment") {
        await httpClient.post('//localhost:8080/expenses', {
          name: "Savings",
          category: "Miscellaneous",
          amount: savingsAmount,
        });
        fetchExpenses(); // Refresh expenses list
      }

      alert('Savings updated successfully');
      setAction('');
      setAmount('');
    } catch (error) {
      console.error('Error adding savings:', error);
      alert('Unable to update savings');
    }
  };

  const listSavings = async (e) => {
    e.preventDefault();
    try {
      const response = await httpClient.get('//localhost:8080/save');
      setList(response.data);
    } catch (error) {
      console.error('Error fetching savings:', error);
      alert('Unable to list savings');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4 text-center">Track Savings</h1>

      <form className="space-y-4">
        <div>
          <label htmlFor="action_save" className="block text-sm font-medium text-gray-700">
            Action
          </label>
          <select
            name="action"
            id="action_save"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select one</option>
            <option value="Increment">Increment</option>
            <option value="Decrement">Decrement</option>
          </select>
        </div>

        <div>
          <label htmlFor="save-amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={amount}
            id="save-amount"
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter amount"
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={addSavings}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
          >
            Update Savings
          </button>
          <button
            onClick={listSavings}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            List Savings
          </button>
        </div>
      </form>

      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-700 mb-2">Savings List</h2>
        <ul className="space-y-3">
          {list.map((save) => (
            <li key={save.id} className="p-4 border rounded-md bg-gray-50 shadow-sm">
              <p className="text-sm font-medium text-gray-900">
                <span className="font-semibold">Action:</span> {save.action}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Amount:</span> ${save.amount}
              </p>
              {save.total && (
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Total:</span> ${save.total}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Savings;
