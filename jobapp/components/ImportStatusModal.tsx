import React, { useMemo } from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface FileImportResult {
  fileName: string;
  status: 'imported' | 'failed';
  jobsAdded: number;
  jobsSkipped: number;
  jobsOverwritten: number;
  error?: string;
}

interface ImportStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  statusData: FileImportResult[];
}

export const ImportStatusModal: React.FC<ImportStatusModalProps> = ({ isOpen, onClose, statusData }) => {
    const { importedFiles, failedFiles, totalAdded, totalSkipped, totalOverwritten } = useMemo(() => {
        const importedFiles = statusData.filter(f => f.status === 'imported');
        const failedFiles = statusData.filter(f => f.status === 'failed');
        const totalAdded = importedFiles.reduce((sum, file) => sum + file.jobsAdded, 0);
        const totalOverwritten = importedFiles.reduce((sum, file) => sum + (file.jobsOverwritten || 0), 0);
        const totalSkipped = statusData.reduce((sum, file) => sum + file.jobsSkipped, 0);
        return { importedFiles, failedFiles, totalAdded, totalSkipped, totalOverwritten };
    }, [statusData]);

    if (!isOpen) return null;

    const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        className="bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-lg border border-slate-700 relative max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-start pb-4 border-b border-slate-700">
            <div>
                <h2 className="text-2xl font-bold text-slate-100">Import Complete</h2>
                <p className="text-slate-400 mt-1">
                    Added <span className="font-bold text-green-400">{totalAdded}</span> new,
                    overwrote <span className="font-bold text-cyan-400">{totalOverwritten}</span>,
                    and skipped <span className="font-bold text-yellow-400">{totalSkipped}</span> job(s).
                </p>
            </div>
        </div>
        
        <div className="py-6 flex-grow overflow-y-auto pr-2 space-y-6">
            {importedFiles.length > 0 && (
                <div>
                    <h3 className="font-semibold text-slate-300 mb-3">Successfully Processed Files:</h3>
                    <ul className="space-y-2">
                        {importedFiles.map(file => (
                            <li key={file.fileName} className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg">
                                <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0"/>
                                <div className="flex-grow">
                                    <p className="font-medium text-slate-200">{file.fileName}</p>
                                    <p className="text-sm text-slate-400">
                                        Added: <span className="font-semibold text-green-400">{file.jobsAdded}</span>, 
                                        Overwrote: <span className="font-semibold text-cyan-400">{file.jobsOverwritten || 0}</span>, 
                                        Skipped: <span className="font-semibold text-yellow-400">{file.jobsSkipped}</span>
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
             {failedFiles.length > 0 && (
                <div>
                    <h3 className="font-semibold text-red-400 mb-3">Failed Files:</h3>
                     <ul className="space-y-2">
                        {failedFiles.map(file => (
                            <li key={file.fileName} className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg">
                                <XCircleIcon className="h-6 w-6 text-red-500 flex-shrink-0"/>
                                <div className="flex-grow">
                                    <p className="font-medium text-slate-200">{file.fileName}</p>
                                    <p className="text-sm text-red-400">{file.error}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="py-2 px-6 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};