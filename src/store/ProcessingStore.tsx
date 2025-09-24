import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface ProcessingLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface ProcessingState {
  currentFile: File | null;
  uploadStatus: 'idle' | 'uploading' | 'completed' | 'error';
  processingStatus: 'idle' | 'processing' | 'completed' | 'error';
  layerVisibility: {
    original: boolean;
    prediction: boolean;
  };
  predictionOpacity: number;
  logs: ProcessingLog[];
}

type ProcessingAction =
  | { type: 'SET_FILE'; payload: File }
  | { type: 'SET_UPLOAD_STATUS'; payload: ProcessingState['uploadStatus'] }
  | { type: 'SET_PROCESSING_STATUS'; payload: ProcessingState['processingStatus'] }
  | { type: 'TOGGLE_LAYER'; payload: 'original' | 'prediction' }
  | { type: 'SET_PREDICTION_OPACITY'; payload: number }
  | { type: 'ADD_LOG'; payload: Omit<ProcessingLog, 'id' | 'timestamp'> }
  | { type: 'CLEAR_LOGS' }
  | { type: 'RESET' };

const initialState: ProcessingState = {
  currentFile: null,
  uploadStatus: 'idle',
  processingStatus: 'idle',
  layerVisibility: {
    original: true,
    prediction: true,
  },
  predictionOpacity: 0.7,
  logs: [],
};

const processingReducer = (state: ProcessingState, action: ProcessingAction): ProcessingState => {
  switch (action.type) {
    case 'SET_FILE':
      return { ...state, currentFile: action.payload };
    case 'SET_UPLOAD_STATUS':
      return { ...state, uploadStatus: action.payload };
    case 'SET_PROCESSING_STATUS':
      return { ...state, processingStatus: action.payload };
    case 'TOGGLE_LAYER':
      return {
        ...state,
        layerVisibility: {
          ...state.layerVisibility,
          [action.payload]: !state.layerVisibility[action.payload],
        },
      };
    case 'SET_PREDICTION_OPACITY':
      return { ...state, predictionOpacity: action.payload };
    case 'ADD_LOG':
      return {
        ...state,
        logs: [
          ...state.logs,
          {
            ...action.payload,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toLocaleTimeString(),
          },
        ].slice(-50), // Keep only last 50 logs
      };
    case 'CLEAR_LOGS':
      return { ...state, logs: [] };
    case 'RESET':
      return {
        ...initialState,
        currentFile: state.currentFile, // Keep the file
      };
    default:
      return state;
  }
};

interface ProcessingContextType {
  state: ProcessingState;
  uploadFile: (file: File) => void;
  startProcessing: () => void;
  stopProcessing: () => void;
  resetProcessing: () => void;
  toggleLayer: (layer: 'original' | 'prediction') => void;
  setPredictionOpacity: (opacity: number) => void;
  addLog: (message: string, type?: ProcessingLog['type']) => void;
}

const ProcessingContext = createContext<ProcessingContextType | undefined>(undefined);

export const ProcessingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(processingReducer, initialState);

  const uploadFile = async (file: File) => {
    dispatch({ type: 'SET_FILE', payload: file });
    dispatch({ type: 'SET_UPLOAD_STATUS', payload: 'uploading' });
    dispatch({ type: 'ADD_LOG', payload: { message: `Starting upload: ${file.name}`, type: 'info' } });

    // Simulate upload process
    setTimeout(() => {
      dispatch({ type: 'SET_UPLOAD_STATUS', payload: 'completed' });
      dispatch({ type: 'ADD_LOG', payload: { message: 'File uploaded successfully', type: 'success' } });
      dispatch({ type: 'ADD_LOG', payload: { message: 'Ready for processing', type: 'info' } });
    }, 2000);
  };

  const startProcessing = async () => {
    if (!state.currentFile) return;

    dispatch({ type: 'SET_PROCESSING_STATUS', payload: 'processing' });
    dispatch({ type: 'ADD_LOG', payload: { message: 'Starting image analysis...', type: 'info' } });

    // Simulate processing workflow
    const steps = [
      { message: 'Initializing PyVips tiler...', delay: 1000 },
      { message: 'Creating DZI tiles from source image...', delay: 2000 },
      { message: 'Generated 1,256 tiles for processing', delay: 1500 },
      { message: 'Loading TransUNet segmentation model...', delay: 2000 },
      { message: 'Processing tile batch 1/42...', delay: 1500 },
      { message: 'Processing tile batch 15/42...', delay: 1500 },
      { message: 'Processing tile batch 30/42...', delay: 1500 },
      { message: 'Processing tile batch 42/42...', delay: 1500 },
      { message: 'Oil spill regions detected in 23 tiles', delay: 1000 },
      { message: 'Stitching prediction masks...', delay: 2000 },
      { message: 'Generating prediction DZI tiles...', delay: 1500 },
      { message: 'Analysis completed successfully!', delay: 1000 },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      if (state.processingStatus === 'processing') { // Check if not stopped
        dispatch({ type: 'ADD_LOG', payload: { message: step.message, type: 'info' } });
      } else {
        return;
      }
    }

    dispatch({ type: 'SET_PROCESSING_STATUS', payload: 'completed' });
    dispatch({ type: 'ADD_LOG', payload: { message: 'Oil spill detection complete. Results ready for visualization.', type: 'success' } });
  };

  const stopProcessing = () => {
    dispatch({ type: 'SET_PROCESSING_STATUS', payload: 'idle' });
    dispatch({ type: 'ADD_LOG', payload: { message: 'Processing stopped by user', type: 'warning' } });
  };

  const resetProcessing = () => {
    dispatch({ type: 'RESET' });
    dispatch({ type: 'ADD_LOG', payload: { message: 'System reset', type: 'info' } });
  };

  const toggleLayer = (layer: 'original' | 'prediction') => {
    dispatch({ type: 'TOGGLE_LAYER', payload: layer });
  };

  const setPredictionOpacity = (opacity: number) => {
    dispatch({ type: 'SET_PREDICTION_OPACITY', payload: opacity });
  };

  const addLog = (message: string, type: ProcessingLog['type'] = 'info') => {
    dispatch({ type: 'ADD_LOG', payload: { message, type } });
  };

  const contextValue: ProcessingContextType = {
    state,
    uploadFile,
    startProcessing,
    stopProcessing,
    resetProcessing,
    toggleLayer,
    setPredictionOpacity,
    addLog,
  };

  return (
    <ProcessingContext.Provider value={contextValue}>
      {children}
    </ProcessingContext.Provider>
  );
};

export const useProcessingStore = () => {
  const context = useContext(ProcessingContext);
  if (context === undefined) {
    throw new Error('useProcessingStore must be used within a ProcessingProvider');
  }
  
  // Destructure state for easier access
  const {
    currentFile,
    uploadStatus,
    processingStatus,
    layerVisibility,
    predictionOpacity,
    logs,
  } = context.state;

  return {
    currentFile,
    uploadStatus,
    processingStatus,
    layerVisibility,
    predictionOpacity,
    logs,
    ...context,
  };
};