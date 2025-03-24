import React, { useState } from 'react';
import { FiSave, FiPlus, FiMinus, FiList } from 'react-icons/fi';
import httpClient from '../httpClient';

function Savings({ fetchExpenses, fetchSavings }) {
  const [action, setAction] = useState('Increment');
  const [amount, setAmount] = useState('');
  const [savingsList, setSavingsList] = useState([]);

  const addSavings = async (e) => {
    e.preventDefault();
    try {
      const savingsAmount = parseInt(amount);

      // Save to savings database
      await httpClient.post('//localhost:8080/save', {
        action,
        amount: savingsAmount,
      });

      // If increment, also log as expense
      if (action === "Increment") {
        await httpClient.post('//localhost:8080/expenses', {
          name: "Savings Deposit",
          category: "Savings",
          amount: savingsAmount,
        });
      } else {
        // If decrement, log as negative expense
        await httpClient.post('//localhost:8080/expenses', {
          name: "Savings Withdrawal",
          category: "Savings",
          amount: -savingsAmount,
        });
      }

      fetchExpenses();
      fetchSavings();
      setAmount('');
      alert('Savings updated successfully');
    } catch (error) {
      console.error('Error updating savings:', error);
      alert('Failed to update savings');
    }
  };

  const listSavings = async () => {
    try {
      const response = await httpClient.get('//localhost:8080/save');
      setSavingsList(response.data);
    } catch (error) {
      console.error('Error fetching savings:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FiSave className="mr-2" /> Savings Tracker
      </h2>

      <form onSubmit={addSavings} className="space-y-4">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setAction('Increment')}
            className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${action === 'Increment' ? 'bg-black text-white' : 'bg-gray-200'}`}
          >
            <FiPlus className="mr-1" /> Deposit
          </button>
          <button
            type="button"
            onClick={() => setAction('Decrement')}
            className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${action === 'Decrement' ? 'bg-black text-white' : 'bg-gray-200'}`}
          >
            <FiMinus className="mr-1" /> Withdraw
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter amount"
            required
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition flex items-center justify-center"
          >
            {action === 'Increment' ? (
              <>
                <FiPlus className="mr-1" /> Add Savings
              </>
            ) : (
              <>
                <FiMinus className="mr-1" /> Withdraw Savings
              </>
            )}
          </button>
          <button
            type="button"
            onClick={listSavings}
            className="bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300 transition flex items-center justify-center"
          >
            <FiList className="mr-1" /> History
          </button>
        </div>
      </form>

      {savingsList.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Recent Transactions</h3>
          <div className="space-y-2">
            {savingsList.slice(0, 3).map((saving) => (
              <div key={saving.id} className="p-3 border-b border-gray-100 flex justify-between">
                <div className="flex items-center">
                  {saving.action === 'Increment' ? (
                    <FiPlus className="text-green-500 mr-2" />
                  ) : (
                    <FiMinus className="text-red-500 mr-2" />
                  )}
                  <span>{saving.action}</span>
                </div>
                <span className="font-medium">${saving.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Savings;