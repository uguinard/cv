import React from 'react';
import { UploadIcon } from './icons/UploadIcon';

export const DropzoneOverlay: React.FC = () => {
  return (
    <div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex flex-col justify-center items-center pointer-events-none"
    >
      <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-slate-600 rounded-3xl text-center text-slate-300">
        <UploadIcon className="h-24 w-24 text-cyan-400 mb-6" />
        <h2 className="text-3xl font-bold tracking-tight">Drop your files here</h2>
        <p className="text-slate-400 mt-2">Import job applications by dropping JSON files.</p>
      </div>
    </div>
  );
};