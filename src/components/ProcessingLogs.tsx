import React from 'react';
import { Terminal, Info, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useProcessingStore } from '../store/ProcessingStore';

export const ProcessingLogs: React.FC = () => {
  const { logs } = useProcessingStore();

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white flex items-center">
        <Terminal className="w-5 h-5 mr-2 text-green-400" />
        Processing Logs
      </h2>
      
      <div className="bg-gray-900 rounded-lg p-3 h-48 overflow-y-auto border border-gray-700">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-sm">No logs available</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start space-x-2 text-xs">
                {getLogIcon(log.type)}
                <div className="flex-1">
                  <span className="text-gray-400">{log.timestamp}</span>
                  <p className="text-gray-300 mt-1">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};