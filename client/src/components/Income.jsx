import React, { useState } from 'react';
import httpClient from '../httpClient';
import { FaMoneyBillWave, FaPlus, FaList } from 'react-icons/fa';

function Income() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [list, setList] = useState([]);

  const addIncome = async (e) => {
    e.preventDefault();
    try {
      await httpClient.post('https://me-manager.onrender.com/income', {
        name,
        amount,
      });
      setName('');
      setAmount('');
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const listIncome = async (e) => {
    e.preventDefault();
    try {
      const response = await httpClient.get('https://me-manager.onrender.com/income');
      setList(response.data);
    } catch (error) {
      console.error('Error fetching income:', error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <FaMoneyBillWave /> Income
      </h2>
      
      <form onSubmit={addIncome} className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Income source"
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
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-black text-white py-2 px-4 rounded hover:bg-gray-800 flex items-center justify-center gap-2"
          >
            <FaPlus /> Add
          </button>
          <button
            onClick={listIncome}
            className="flex-1 bg-gray-200 text-black py-2 px-4 rounded hover:bg-gray-300 flex items-center justify-center gap-2"
          >
            <FaList /> List
          </button>
        </div>
      </form>
      
      <div>
        <h3 className="font-medium mb-2">Recent Income</h3>
        <ul className="space-y-2">
          {list.slice(0, 3).map((income) => (
            <li key={income.id} className="p-3 border border-gray-200 rounded flex justify-between">
              <span className="font-medium">{income.name}</span>
              <span className="text-gray-700">${income.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Income;