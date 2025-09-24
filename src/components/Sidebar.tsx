import React from 'react';
import { FileUpload } from './FileUpload';
import { ProcessingControls } from './ProcessingControls';
import { LayerControls } from './LayerControls';
import { ProcessingLogs } from './ProcessingLogs';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        <FileUpload />
        <ProcessingControls />
        <LayerControls />
        <ProcessingLogs />
      </div>
    </div>
  );
};