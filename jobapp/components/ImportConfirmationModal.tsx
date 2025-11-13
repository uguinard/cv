import React, { useState, useMemo, useEffect } from 'react';
import { type Job, type FileImportPreview, type ImportJobPreview } from '../types';
import { type ImportActions } from '../App';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface ImportConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (actions: ImportActions) => void;
  previewData: FileImportPreview[];
}

const JobComparison: React.FC<{ imported: Job, existing: Job }> = ({ imported, existing }) => {
    const fields: (keyof Job)[] = ['title', 'company', 'location', 'status', 'deadline', 'starting', 'source', 'description'];
    
    const renderField = (field: keyof Job) => {
        // FIX: Handle non-renderable array values (like 'updates') to satisfy TypeScript's ReactNode type,
        // even though 'updates' is not in the `fields` array. This ensures type safety if it's added later.
        const formatValue = (value: any): string => {
            if (value === undefined || value === null || value === '') return 'Not set';
            if (Array.isArray(value)) return `[${value.length} updates]`;
            return String(value);
        }

        const importedValue = formatValue(imported[field]);
        const existingValue = formatValue(existing[field]);
        const isDifferent = importedValue !== existingValue;
        
        return (
            <div key={field} className="py-2">
                <p className="text-xs text-slate-500 capitalize">{field}</p>
                <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-slate-400 truncate">{existingValue}</p>
                    <p className={`text-sm ${isDifferent ? 'text-cyan-400' : 'text-slate-400'} truncate`}>{importedValue}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="mt-2 bg-slate-900/70 p-3 rounded-md border border-slate-700">
            <div className="grid grid-cols-2 gap-4 mb-2">
                <h4 className="font-semibold text-slate-300 text-sm">Existing Job</h4>
                <h4 className="font-semibold text-slate-300 text-sm">Imported Job</h4>
            </div>
            <div className="divide-y divide-slate-700/50">
                 {fields.map(field => renderField(field))}
            </div>
        </div>
    )
}


const JobPreviewItem: React.FC<{
    preview: ImportJobPreview;
    isSelected: boolean;
    onToggle: () => void;
}> = ({ preview, isSelected, onToggle }) => {
    const [isComparisonVisible, setIsComparisonVisible] = useState(false);

    if (preview.status === 'invalid') {
        return (
            <div className="flex items-start gap-3 bg-slate-800 p-3 rounded-lg">
                <XCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5"/>
                <div>
                    <p className="font-medium text-slate-400">Invalid Job Data</p>
                    <p className="text-sm text-red-400">{preview.error}</p>
                </div>
            </div>
        );
    }
    
    const { jobData, status, existingJob } = preview;

    return (
        <div className="bg-slate-800 p-3 rounded-lg">
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onToggle}
                    className="mt-1 h-5 w-5 rounded bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-600 focus:ring-2"
                    aria-label={status === 'new' ? `Import job: ${jobData.title}`: `Overwrite job: ${jobData.title}`}
                />
                <div className="flex-grow">
                    <p className="font-medium text-slate-200">{jobData.title} <span className="text-slate-400 font-normal">at {jobData.company}</span></p>
                    {status === 'new' && (
                        <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">New</span>
                    )}
                    {status === 'duplicate' && (
                         <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <ExclamationTriangleIcon className="h-3 w-3"/>
                                Potential Duplicate
                            </span>
                            <button onClick={() => setIsComparisonVisible(!isComparisonVisible)} className="text-xs text-cyan-400 hover:underline flex items-center">
                                {isComparisonVisible ? 'Hide' : 'Show'} Comparison <ChevronDownIcon className={`h-4 w-4 transition-transform ${isComparisonVisible ? 'rotate-180' : ''}`}/>
                            </button>
                         </div>
                    )}
                </div>
            </div>
            {isComparisonVisible && status === 'duplicate' && existingJob && (
                <JobComparison imported={jobData} existing={existingJob}/>
            )}
        </div>
    );
};

export const ImportConfirmationModal: React.FC<ImportConfirmationModalProps> = ({ isOpen, onClose, onConfirm, previewData }) => {
  const [selections, setSelections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
        const initialSelections: Record<string, boolean> = {};
        previewData.forEach(file => {
            file.jobPreviews.forEach(preview => {
                if (preview.status === 'new') {
                    initialSelections[preview.jobData.id] = true; // Select new jobs by default
                } else if (preview.status === 'duplicate') {
                    initialSelections[preview.jobData.id] = false; // Do not select duplicates by default
                }
            });
        });
        setSelections(initialSelections);
    }
  }, [isOpen, previewData]);
  
  const { totalNew, totalDuplicates, totalInvalid, totalSelected } = useMemo(() => {
    let totalNew = 0, totalDuplicates = 0, totalInvalid = 0, totalSelected = 0;
    previewData.forEach(file => {
        file.jobPreviews.forEach(preview => {
            if (preview.status === 'new') totalNew++;
            else if (preview.status === 'duplicate') totalDuplicates++;
            else totalInvalid++;
            
            if (selections[preview.jobData.id]) {
                totalSelected++;
            }
        });
    });
    return { totalNew, totalDuplicates, totalInvalid, totalSelected };
  }, [previewData, selections]);

  if (!isOpen) return null;

  const handleToggleSelection = (jobId: string) => {
    setSelections(prev => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  const handleConfirmClick = () => {
    const actions: ImportActions = { jobsToAdd: [], jobsToUpdate: [] };
    previewData.forEach(file => {
        file.jobPreviews.forEach(preview => {
            if (selections[preview.jobData.id]) {
                if (preview.status === 'new') {
                    actions.jobsToAdd.push(preview.jobData);
                } else if (preview.status === 'duplicate' && preview.existingJob) {
                    const updatedJob = { ...preview.existingJob, ...preview.jobData, id: preview.existingJob.id };
                    actions.jobsToUpdate.push(updatedJob);
                }
            }
        });
    });
    onConfirm(actions);
  };
  
  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const hasImportableJobs = totalNew + totalDuplicates > 0;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        className="bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl border border-slate-700 relative max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-start pb-4 border-b border-slate-700">
            <div>
                <h2 className="text-2xl font-bold text-slate-100">Import Preview</h2>
                <p className="text-slate-400 mt-1">
                    Found {totalNew} new, {totalDuplicates} potential duplicates, and {totalInvalid} invalid item(s).
                </p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300" aria-label="Close modal">
                <XCircleIcon className="h-6 w-6" />
            </button>
        </div>
        
        <div className="py-6 flex-grow overflow-y-auto pr-2 space-y-4">
            {previewData.map(file => (
                <div key={file.fileName}>
                    <h3 className="font-semibold text-slate-300 mb-2">{file.fileName}</h3>
                    <div className="space-y-2">
                        {file.jobPreviews.map(preview => (
                             <JobPreviewItem
                                key={preview.jobData.id || `invalid-${Math.random()}`}
                                preview={preview}
                                isSelected={!!selections[preview.jobData.id]}
                                onToggle={() => handleToggleSelection(preview.jobData.id)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="py-2 px-6 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmClick}
            disabled={!hasImportableJobs || totalSelected === 0}
            className="py-2 px-6 rounded-lg font-semibold text-white transition-colors bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {`Confirm Import (${totalSelected})`}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add necessary icons if they are not globally available
const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const ExclamationTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);