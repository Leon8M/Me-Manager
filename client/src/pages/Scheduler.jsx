import React, { useState, useEffect } from 'react';

function Scheduler() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', time: '' });

  // Load tasks from localStorage or public/schedulerData.json
  useEffect(() => {
    const localData = localStorage.getItem('scheduler-tasks');
    if (localData) {
      setTasks(JSON.parse(localData));
    } else {
      fetch('/schedulerData.json')
        .then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.text();
        })
        .then(text => {
          const data = text ? JSON.parse(text) : [];
          setTasks(data);
          localStorage.setItem('scheduler-tasks', JSON.stringify(data));
        })
        .catch(err => {
          console.error("Failed to load scheduler data:", err);
          setTasks([]); // fallback to empty list
        });
    }
  }, []);

  // Store to localStorage
  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem('scheduler-tasks', JSON.stringify(updatedTasks));
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.time) {
      const updated = [...tasks, { ...newTask, id: Date.now() }];
      saveTasks(updated);
      setNewTask({ title: '', time: '' });
    }
  };

  const handleDeleteTask = (id) => {
    const updated = tasks.filter(t => t.id !== id);
    saveTasks(updated);
  };

  // Alarm logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      tasks.forEach(task => {
        const [taskHour, taskMinute] = task.time.split(':').map(Number);
        const taskMinutes = taskHour * 60 + taskMinute;

        if (taskMinutes - currentMinutes > 0 && taskMinutes - currentMinutes <= 10) {
          // Alert for tasks within 10 minutes
          if (!task.notified) {
            alert(`⏰ Upcoming task: "${task.title}" at ${task.time}`);
            task.notified = true;
            saveTasks([...tasks]); // update with notification flag
          }
        }
      });
    }, 60000); // check every minute

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Schedule for Today</h1>
      <p className="mb-6 text-gray-600">
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long', month: 'long', day: 'numeric'
        })}
      </p>

      {/* Add Task */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Add Task</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="time"
            value={newTask.time}
            onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
            className="border p-2 rounded w-full md:w-40"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Today's Tasks</h2>
        {tasks.length > 0 ? (
          <ul className="space-y-3">
            {tasks
              .sort((a, b) => a.time.localeCompare(b.time))
              .map(task => (
                <li key={task.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.time}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tasks scheduled yet.</p>
        )}
      </div>
    </div>
  );
}

export default Scheduler;
