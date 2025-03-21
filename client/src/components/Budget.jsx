import React, { useState, useEffect } from "react";
import httpClient from "../httpClient";

function Budget({ fetchExpenses, expenses, budget, fetchBudget }) {
  const [newBudget, setNewBudget] = useState("");
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [leftover, setLeftover] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const changeBudget = async (e) => {
    e.preventDefault();
    try {
      await httpClient.post("//localhost:8080/budget", { budget: newBudget });
      alert("Budget updated");
      setNewBudget("");
      setIsEditing(false);
      fetchBudget(); // Refresh the budget
      fetchExpenses(); // Recalculate remaining budget
    } catch (error) {
      alert("Failed to update budget");
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
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4 text-center">Manage Budget</h1>

      {isEditing || budget === 0 ? (
        <form className="space-y-4" onSubmit={changeBudget}>
          <div>
            <label htmlFor="budget-add" className="block text-sm font-medium text-gray-700">
              Budget
            </label>
            <input
              type="number"
              name="budget"
              value={newBudget}
              id="budget-add"
              onChange={(e) => setNewBudget(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your budget"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
          >
            Update Budget
          </button>
        </form>
      ) : (
        <div>
          <div className="mt-6 space-y-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Current Budget: <span className="text-green-700">${budget}</span>
            </h2>
            <h2 className="text-lg font-semibold text-gray-700">
              Remaining Budget: <span className="text-blue-700">${remainingBudget}</span>
            </h2>
            <h2 className="text-lg font-semibold text-gray-700">
              Leftover for this month: <span className="text-purple-700">${leftover}</span>
            </h2>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${(remainingBudget / budget) * 100}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition"
          >
            Edit Budget
          </button>
        </div>
      )}
    </div>
  );
}

export default Budget;