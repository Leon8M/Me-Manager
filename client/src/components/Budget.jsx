import React, { useState, useEffect } from "react";
import httpClient from "../httpClient";

function Budget() {
  const [budget, setBudget] = useState("");
  const [currBudget, setCurrBudget] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [remainingBudget, setRemainingBudget] = useState("");
  const [leftover, setLeftover] = useState(0);

  const changeBudget = async (e) => {
    e.preventDefault();
    try {
      await httpClient.post("//localhost:8080/budget", { budget });
      alert("Budget updated");
      setBudget("");
      getBudget(); // Refresh the budget after update
    } catch (error) {
      alert("Failed to update budget");
    }
  };

  const getBudget = async () => {
    try {
      const response = await httpClient.get("//localhost:8080/budget");
      setCurrBudget(response.data.num);
      return response.data.num; // Return the budget value for further use
    } catch (error) {
      console.error("Error fetching budget:", error);
      alert("Unable to get budget");
      return 0; // Default to zero if fetching fails
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await httpClient.get("//localhost:8080/expenses");
      setExpenses(response.data);
      return response.data; // Return the expenses array for further use
    } catch (error) {
      console.error("Error fetching expenses:", error);
      alert("Unable to get expenses");
      return []; // Default to an empty array if fetching fails
    }
  };

  const calculateRemainingBudget = (budget, expenses) => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = budget - totalExpenses;
    setRemainingBudget(remaining >= 0 ? remaining : 0);
    setLeftover(remaining >= 0 ? remaining : 0);
  };

  const saveLeftover = async () => {
    try {
      await httpClient.post("//localhost:8080/leftover", { leftover });
      alert("Leftover saved successfully");
      setLeftover(0);
    } catch (error) {
      alert("Failed to save leftover");
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const budgetValue = await getBudget();
      const expensesList = await fetchExpenses();
      calculateRemainingBudget(budgetValue, expensesList);
    };

    initializeData(); // Fetch and calculate on component mount
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4 text-center">Manage Budget</h1>

      <form className="space-y-4">
        <div>
          <label htmlFor="budget-add" className="block text-sm font-medium text-gray-700">
            Budget
          </label>
          <input
            type="number"
            name="budget"
            value={budget}
            id="budget-add"
            onChange={(e) => setBudget(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your budget"
          />
        </div>

        <button
          onClick={changeBudget}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
        >
          Update Budget
        </button>
      </form>

      <div className="mt-6 space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">
          Current Budget: <span className="text-green-700">${currBudget}</span>
        </h2>
        <h2 className="text-lg font-semibold text-gray-700">
          Remaining Budget: <span className="text-blue-700">${remainingBudget}</span>
        </h2>
        <h2 className="text-lg font-semibold text-gray-700">
          Leftover for this month: <span className="text-purple-700">${leftover}</span>
        </h2>
      </div>

      {leftover > 0 && (
        <button
          onClick={saveLeftover}
          className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition"
        >
          Save Leftover
        </button>
      )}
    </div>
  );
}

export default Budget;
