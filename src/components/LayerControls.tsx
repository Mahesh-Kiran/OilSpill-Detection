import React from 'react';
import { Layers, Eye, EyeOff } from 'lucide-react';
import { useProcessingStore } from '../store/ProcessingStore';

export const LayerControls: React.FC = () => {
  const { 
    layerVisibility, 
    predictionOpacity, 
    toggleLayer, 
    setPredictionOpacity,
    processingStatus 
  } = useProcessingStore();

  const hasPredictions = processingStatus === 'completed';

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white flex items-center">
        <Layers className="w-5 h-5 mr-2 text-purple-400" />
        Layer Controls
      </h2>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
            <span className="text-white text-sm">Original Image</span>
          </div>
          <button
            onClick={() => toggleLayer('original')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {layerVisibility.original ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
            <span className="text-white text-sm">Oil Spill Mask</span>
          </div>
          <button
            onClick={() => toggleLayer('prediction')}
            disabled={!hasPredictions}
            className="text-gray-400 hover:text-white disabled:text-gray-600 transition-colors"
          >
            {layerVisibility.prediction ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
        
        {hasPredictions && layerVisibility.prediction && (
          <div className="p-3 bg-gray-700 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">Mask Opacity</span>
              <span className="text-gray-400 text-xs">{Math.round(predictionOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={predictionOpacity}
              onChange={(e) => setPredictionOpacity(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Transparent</span>
              <span>Opaque</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};