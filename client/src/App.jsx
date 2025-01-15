import React, { useState } from 'react';
import Money from './pages/Money';
// Import other components as they are created
//As an example Bud:
// import Tasks from './pages/Tasks';
// import Notes from './pages/Notes';

function App() {
  const [activeTab, setActiveTab] = useState('money'); // Default tab

  const renderContent = () => {
    switch (activeTab) {
      case 'money':
        return <Money />;
      // case 'tasks':
      //   return <Tasks />;
      // case 'notes':
      //   return <Notes />;
      default:
        return <Money />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navigation Tabs */}
      <nav className="flex justify-around items-center bg-gray-800 text-white p-4 shadow-md">
        <button
          onClick={() => setActiveTab('money')}
          className={`py-2 px-4 rounded ${
            activeTab === 'money' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          Money Manager
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`py-2 px-4 rounded ${
            activeTab === 'tasks' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          Tasks
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`py-2 px-4 rounded ${
            activeTab === 'notes' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          Notes
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
