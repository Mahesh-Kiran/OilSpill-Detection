import React from 'react';
import { MainInterface } from './components/MainInterface';
import { ProcessingProvider } from './store/ProcessingStore';

function App() {
  return (
    <ProcessingProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <MainInterface />
      </div>
    </ProcessingProvider>
  );
}

export default App;