import React from 'react';
import { Play, Square, RotateCcw, Cpu } from 'lucide-react';
import { useProcessingStore } from '../store/ProcessingStore';

export const ProcessingControls: React.FC = () => {
  const { 
    processingStatus, 
    startProcessing, 
    stopProcessing, 
    resetProcessing,
    currentFile 
  } = useProcessingStore();

  const isProcessing = processingStatus === 'processing';
  const canStart = currentFile && processingStatus === 'idle';

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white flex items-center">
        <Cpu className="w-5 h-5 mr-2 text-green-400" />
        Processing
      </h2>
      
      <div className="space-y-3">
        <button
          onClick={startProcessing}
          disabled={!canStart}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Analysis
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={stopProcessing}
            disabled={!isProcessing}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            <Square className="w-4 h-4 mr-1" />
            Stop
          </button>
          
          <button
            onClick={resetProcessing}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </button>
        </div>
      </div>

      {processingStatus !== 'idle' && (
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-white">Status:</span>
            <span className={`font-medium ${
              processingStatus === 'completed' ? 'text-green-400' :
              processingStatus === 'processing' ? 'text-blue-400' :
              processingStatus === 'error' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {processingStatus.charAt(0).toUpperCase() + processingStatus.slice(1)}
            </span>
          </div>
          
          {isProcessing && (
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse transition-all duration-300" style={{ width: '60%' }}></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};