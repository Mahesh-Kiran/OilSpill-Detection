import React from 'react';
import { ImageViewer } from './ImageViewer';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainInterface: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1">
          <ImageViewer />
        </div>
      </div>
    </div>
  );
};