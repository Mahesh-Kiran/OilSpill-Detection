import React, { useCallback } from 'react';
import { Upload, File, CheckCircle } from 'lucide-react';
import { useProcessingStore } from '../store/ProcessingStore';

export const FileUpload: React.FC = () => {
  const { uploadFile, uploadStatus, currentFile } = useProcessingStore();

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }, [uploadFile]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  }, [uploadFile]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white flex items-center">
        <Upload className="w-5 h-5 mr-2 text-blue-400" />
        File Upload
      </h2>
      
      <div 
        className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          accept=".tiff,.tif"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-300 mb-2">Drop TIFF file here or click to browse</p>
          <p className="text-xs text-gray-500">Supports files up to 1GB</p>
        </label>
      </div>

      {currentFile && (
        <div className="bg-gray-700 rounded-lg p-3 space-y-2">
          <div className="flex items-center text-sm">
            <File className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-white truncate">{currentFile.name}</span>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <span>{(currentFile.size / 1024 / 1024).toFixed(2)} MB</span>
            {uploadStatus === 'completed' && (
              <CheckCircle className="w-4 h-4 ml-2 text-green-400" />
            )}
          </div>
          {uploadStatus === 'uploading' && (
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};