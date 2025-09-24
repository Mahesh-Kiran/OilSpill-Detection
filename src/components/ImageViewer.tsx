import React, { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';
import { useProcessingStore } from '../store/ProcessingStore';

export const ImageViewer: React.FC = () => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const osdViewer = useRef<OpenSeadragon.Viewer | null>(null);
  const imageUrl = useRef<string | null>(null);
  
  const { 
    currentFile, 
    layerVisibility, 
    predictionOpacity, 
    processingStatus 
  } = useProcessingStore();

  // Create object URL for uploaded file
  useEffect(() => {
    if (currentFile) {
      // Clean up previous URL
      if (imageUrl.current) {
        URL.revokeObjectURL(imageUrl.current);
      }
      // Create new URL for the uploaded file
      imageUrl.current = URL.createObjectURL(currentFile);
    }
    
    return () => {
      if (imageUrl.current) {
        URL.revokeObjectURL(imageUrl.current);
        imageUrl.current = null;
      }
    };
  }, [currentFile]);
  useEffect(() => {
    if (viewerRef.current && !osdViewer.current) {
      osdViewer.current = OpenSeadragon({
        element: viewerRef.current,
        prefixUrl: '/openseadragon-images/',
        showNavigator: true,
        navigatorPosition: 'TOP_RIGHT',
        showZoomControl: true,
        showHomeControl: true,
        showFullPageControl: true,
        zoomInButton: 'zoom-in-btn',
        zoomOutButton: 'zoom-out-btn',
        homeButton: 'home-btn',
        fullPageButton: 'fullpage-btn',
        animationTime: 0.3,
        springStiffness: 6.5,
        maxZoomPixelRatio: 4,
        minZoomLevel: 0.1,
        visibilityRatio: 0.1,
        constrainDuringPan: true,
        showSequenceControl: false,
      });
    }


    return () => {
      if (osdViewer.current) {
        osdViewer.current.destroy();
        osdViewer.current = null;
      }
    };
  }, []);

  // Load the uploaded image when file changes
  useEffect(() => {
    if (osdViewer.current && imageUrl.current) {
      try {
        // Clear existing images
        osdViewer.current.world.removeAll();
        
        // Load the uploaded image
        osdViewer.current.open({
          type: 'image',
          url: imageUrl.current
        });
      } catch (error) {
        console.error('Error loading uploaded image:', error);
      }
    }
  }, [currentFile, imageUrl.current]);
  useEffect(() => {
    if (osdViewer.current && processingStatus === 'completed') {
      // Add prediction layer when processing is complete
      if (layerVisibility.prediction) {
        try {
          // Remove existing prediction layers first
          while (osdViewer.current.world.getItemCount() > 1) {
            osdViewer.current.world.removeItem(osdViewer.current.world.getItemAt(1));
          }
          
          // In real implementation, this would load the prediction DZI tiles
          // For demo, we'll create a mock prediction overlay
          const canvas = document.createElement('canvas');
          canvas.width = 800;
          canvas.height = 600;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            // Create a mock oil spill pattern
            ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.fillRect(100, 100, 200, 150);
            ctx.fillRect(400, 200, 180, 120);
            ctx.fillRect(200, 350, 150, 100);
            
            const mockPredictionUrl = canvas.toDataURL();
            
            // Add prediction layer with opacity
            osdViewer.current.addTiledImage({
              tileSource: {
                type: 'image',
                url: mockPredictionUrl
              },
              opacity: predictionOpacity,
              compositeOperation: 'source-over'
            });
          }
        } catch (error) {
          console.log('Error adding prediction layer:', error);
        }
      } else {
        // Remove prediction layers
        while (osdViewer.current.world.getItemCount() > 1) {
          osdViewer.current.world.removeItem(osdViewer.current.world.getItemAt(1));
        }
      }
    }
  }, [layerVisibility.prediction, predictionOpacity, processingStatus]);

  if (!currentFile) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 text-gray-400">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-lg flex items-center justify-center">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-lg font-medium">No Image Loaded</p>
          <p className="text-sm">Upload a TIFF file to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative bg-black">
      <div ref={viewerRef} className="w-full h-full" />
      
      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 flex flex-col space-y-2">
        <button
          id="zoom-in-btn"
          className="w-10 h-10 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 text-white rounded-md flex items-center justify-center transition-all"
        >
          +
        </button>
        <button
          id="zoom-out-btn"
          className="w-10 h-10 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 text-white rounded-md flex items-center justify-center transition-all"
        >
          -
        </button>
        <button
          id="home-btn"
          className="w-10 h-10 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 text-white rounded-md flex items-center justify-center transition-all"
        >
          ⌂
        </button>
        <button
          id="fullpage-btn"
          className="w-10 h-10 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 text-white rounded-md flex items-center justify-center transition-all"
        >
          ⛶
        </button>
      </div>

      {/* Layer Status Indicator */}
      <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-90 rounded-lg p-3">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-white">Original</span>
          </div>
          {processingStatus === 'completed' && layerVisibility.prediction && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span className="text-white">Oil Spills ({Math.round(predictionOpacity * 100)}%)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};