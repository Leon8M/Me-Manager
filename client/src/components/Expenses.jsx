//Here we track all expenses by name and cost and date
import React, { useState } from 'react';
import httpClient from '../httpClient';

function Expenses() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setcartegory] = useState("");
  const [list, setList] = useState([]);

  const addExpense = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      await httpClient.post('//localhost:8080/expenses', {
        name,
        amount,
        category
      });
      alert('Expense added successfully');
      setName('');
      setAmount('');
      setcartegory('')
    } catch (error) {
      console.error('Error adding Expense:', error);
      alert('Unable to add Expense');
    }
  };

  const listExpenses = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await httpClient.get('//localhost:8080/expenses');
      console.log('Response data:', response.data);
      setList(response.data);
    } catch (error) {
      console.error('Error fetching Expenses:', error);
      alert('Unable to list expenses');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4 text-center">Track Expenses</h1>

      <form className="space-y-4">
        <div>
          <label
            htmlFor="expense-name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            value={name}
            id="expense-name"
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Expense name"
          />
        </div>

        <div>
          <label
            htmlFor="expense-amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={amount}
            id="expense-amount"
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Expense amount"
          />
        </div>

        <div>
          <label
            htmlFor="expenses"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            name="expenses"
            id="expenses"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Home">Home Essentials</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={addExpense}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
          >
            Add Expense
          </button>
          <button
            onClick={listExpenses}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            List Expenses
          </button>
        </div>
      </form>

      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-700 mb-2">Expense List</h2>
        <ul className="space-y-3">
          {list.map((expense) => (
            <li
              key={expense.id}
              className="p-4 border rounded-md bg-gray-50 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-900">
                <span className="font-semibold">Name:</span> {expense.name}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Amount:</span> ${expense.amount}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Category:</span>{" "}
                {expense.category}
              </p>
              {expense.total && (
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Total:</span> ${expense.total}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Expenses;
