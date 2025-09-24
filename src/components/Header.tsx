import React from 'react';
import { Satellite, Layers } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Satellite className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold text-white">Oil Spill Detection System</h1>
            <p className="text-sm text-gray-400">Satellite Image Analysis Platform</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Layers className="w-4 h-4" />
          <span>TransUNet Segmentation</span>
        </div>
      </div>
    </header>
  );
};