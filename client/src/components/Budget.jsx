import React, { useState, useEffect } from "react";
import httpClient from "../httpClient";
import { FaEdit, FaWallet, FaPercentage } from 'react-icons/fa';

function Budget({ fetchExpenses, expenses, budget, fetchBudget }) {
  const [newBudget, setNewBudget] = useState("");
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [leftover, setLeftover] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const changeBudget = async (e) => {
    e.preventDefault();
    try {
      await httpClient.post("//localhost:8080/budget", { budget: newBudget });
      setNewBudget("");
      setIsEditing(false);
      fetchBudget();
      fetchExpenses();
    } catch (error) {
      console.error("Failed to update budget:", error);
    }
  };

  const calculateRemainingBudget = (budget, expenses) => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = budget - totalExpenses;
    setRemainingBudget(remaining >= 0 ? remaining : 0);
    setLeftover(remaining >= 0 ? remaining : 0);
  };

  useEffect(() => {
    calculateRemainingBudget(budget, expenses);
  }, [budget, expenses]);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <FaWallet /> Budget
      </h2>

      {isEditing || budget === 0 ? (
        <form onSubmit={changeBudget} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Budget
            </label>
            <input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter budget amount"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
          >
            Set Budget
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Current Budget</p>
              <p className="text-xl font-bold">${budget}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-black hover:text-gray-700 flex items-center gap-1"
            >
              <FaEdit /> Edit
            </button>
          </div>

          <div>
            <p className="text-sm text-gray-600">Remaining Budget</p>
            <p className="text-xl font-bold">${remainingBudget}</p>
          </div>

          <div className="flex items-center gap-2">
            <FaPercentage className="text-gray-600" />
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-black h-2.5 rounded-full"
                style={{ width: `${(remainingBudget / budget) * 100}%` }}
              ></div>
            </div>
          </div>

          {leftover > 0 && (
            <button
              onClick={async () => {
                try {
                  await httpClient.post("//localhost:8080/leftover", { leftover });
                  setLeftover(0);
                } catch (error) {
                  console.error("Failed to save leftover:", error);
                }
              }}
              className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
            >
              Save Leftover
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Budget;