import React, { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';
import { useProcessingStore } from '../store/ProcessingStore';

export const ImageViewer: React.FC = () => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const osdViewer = useRef<OpenSeadragon.Viewer | null>(null);
  
  const { 
    currentFile, 
    layerVisibility, 
    predictionOpacity, 
    processingStatus 
  } = useProcessingStore();

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

      // Add demo tile source for demonstration
      if (currentFile) {
        // In a real implementation, this would be the DZI endpoint from your backend
        // For demo purposes, we'll show a placeholder
        osdViewer.current.addHandler('open-failed', () => {
          console.log('Demo mode: Using placeholder image source');
        });

        // Mock DZI configuration - in real app this comes from backend
        const mockDziConfig = {
          Image: {
            xmlns: 'http://schemas.microsoft.com/deepzoom/2008',
            Url: '/mock-tiles/',
            Format: 'jpg',
            Overlap: '1',
            TileSize: '256',
            Size: {
              Height: '4000',
              Width: '6000'
            }
          }
        };

        try {
          osdViewer.current.open({
            type: 'legacy-image-pyramid',
            levels: [
              { url: 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg', width: 6000, height: 4000 }
            ]
          });
        } catch (error) {
          console.log('Using fallback image source');
        }
      }
    }

    return () => {
      if (osdViewer.current) {
        osdViewer.current.destroy();
        osdViewer.current = null;
      }
    };
  }, [currentFile]);

  useEffect(() => {
    if (osdViewer.current && processingStatus === 'completed') {
      // Add prediction layer when processing is complete
      if (layerVisibility.prediction) {
        // In real implementation, this would load the prediction DZI tiles
        console.log('Loading prediction layer with opacity:', predictionOpacity);
        
        // Mock adding a prediction overlay
        const predictionTileSource = {
          type: 'legacy-image-pyramid',
          levels: [
            { url: 'https://images.pexels.com/photos/62693/pexels-photo-62693.jpeg', width: 6000, height: 4000 }
          ]
        };
        
        try {
          // Remove existing prediction layers first
          while (osdViewer.current.world.getItemCount() > 1) {
            osdViewer.current.world.removeItem(osdViewer.current.world.getItemAt(1));
          }
          
          // Add prediction layer with opacity
          osdViewer.current.addTiledImage({
            tileSource: predictionTileSource,
            opacity: predictionOpacity,
            compositeOperation: 'multiply'
          });
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