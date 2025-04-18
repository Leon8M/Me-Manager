import React, { useState } from 'react';

function IncomePopup({ onClose, onSubmit }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ 
      amount, 
      description 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">INCOME</h2>
          <button onClick={onClose} className="text-gray-500">×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="Enter Amount"
              required
              step="0.01"
              min="0"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="Enter Description"
              required
            />
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            Enter the amount you earned with description to help us keep track of your earnings.
          </p>
          
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-medium"
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
}

export default IncomePopup;