import React, { useState } from 'react';
import Header from './components/Header';
import Money from './pages/Money';
import Schedule from './pages/Scheduler';
import Notes from './pages/Notes';

function App() {
  const [activeTab, setActiveTab] = useState('money');

  const renderContent = () => {
    switch (activeTab) {
      case 'money':
        return <Money />;
      case 'schedule':
        return <Schedule />;
      case 'notes':
        return <Notes />;
      default:
        return <Money />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header />

      {/* Nav Tabs */}
      <nav className="flex flex-col md:flex-row justify-around items-center bg-gray-900 text-white p-3 gap-2 md:gap-0">
        <button
          onClick={() => setActiveTab('money')}
          className={`py-2 px-4 rounded w-full md:w-auto transition-all ${
            activeTab === 'money' ? 'bg-white text-black' : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          Money Manager
        </button>
        
        <button
          onClick={() => setActiveTab('notes')}
          className={`py-2 px-4 rounded w-full md:w-auto transition-all ${
            activeTab === 'notes' ? 'bg-white text-black' : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          Notes
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`py-2 px-4 rounded w-full md:w-auto transition-all ${
            activeTab === 'schedule' ? 'bg-white text-black' : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          Schedule
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-grow overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
