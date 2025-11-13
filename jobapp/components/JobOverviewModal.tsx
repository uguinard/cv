import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { type Job, JobStatus, type Update } from '../types';
import { getCountryFlag } from '../utils/getCountryFlag';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { TagIcon } from './icons/TagIcon';
import { ArchiveIcon } from './icons/ArchiveIcon';
import { UnarchiveIcon } from './icons/UnarchiveIcon';
import { BellIcon } from './icons/BellIcon';
import { TrashIcon } from './icons/TrashIcon';
import { EditIcon } from './icons/EditIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XMarkIcon } from './icons/XMarkIcon';


interface JobOverviewModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDeleteRequest: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  addJobUpdate: (jobId: string, updateData: Omit<Update, 'id' | 'createdAt'>) => void;
  deleteJobUpdate: (jobId: string, updateId: string) => void;
  updateJobUpdate: (jobId: string, updateId: string, newUpdateData: Partial<Omit<Update, 'id' | 'createdAt'>>) => void;
}

const statusColorMap: { [key in JobStatus]: string } = {
    [JobStatus.WISHLIST]: 'bg-gray-500/20 text-gray-300',
    [JobStatus.APPLYING]: 'bg-blue-500/20 text-blue-300',
    [JobStatus.INTERVIEWING]: 'bg-yellow-500/20 text-yellow-300',
    [JobStatus.OFFER]: 'bg-green-500/20 text-green-300',
    [JobStatus.REJECTED]: 'bg-red-500/20 text-red-300',
    [JobStatus.ARCHIVED]: 'bg-indigo-500/20 text-indigo-300',
};


export const JobOverviewModal: React.FC<JobOverviewModalProps> = ({ 
    job, 
    isOpen, 
    onClose, 
    onEdit, 
    onDeleteRequest, 
    onArchive, 
    onUnarchive,
    addJobUpdate,
    deleteJobUpdate,
    updateJobUpdate,
}) => {
  const [newUpdateText, setNewUpdateText] = useState('');
  const [isReminder, setIsReminder] = useState(false);
  const [editingUpdateId, setEditingUpdateId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  
  const isUpdateFormDirty = newUpdateText.trim() !== '';

  const isUpdateEditDirty = useMemo(() => {
    if (!editingUpdateId) return false;
    const originalUpdate = job.updates?.find(u => u.id === editingUpdateId);
    if (!originalUpdate) return false;
    return originalUpdate.text.trim() !== editedText.trim();
  }, [editingUpdateId, editedText, job.updates]);


  const handleAttemptClose = useCallback(() => {
    if (isUpdateFormDirty || isUpdateEditDirty) {
        setShowConfirmClose(true);
    } else {
        onClose();
    }
  }, [isUpdateFormDirty, isUpdateEditDirty, onClose]);
  
  // Effect to reset local state when the modal opens or the job changes.
  useEffect(() => {
    if (isOpen) {
      setNewUpdateText('');
      setIsReminder(false);
      setEditingUpdateId(null);
      setEditedText('');
      setShowConfirmClose(false);
    }
  }, [isOpen, job.id]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (editingUpdateId && document.activeElement?.tagName === 'TEXTAREA') {
          // If editing a text area, escape should cancel that specific edit
          handleCancelEdit();
        } else {
          // Otherwise, attempt to close the whole modal
          handleAttemptClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleAttemptClose, editingUpdateId]);


  if (!isOpen) return null;
  
  const handleDelete = () => {
    onDeleteRequest(job.id);
    onClose();
  };

  const handleArchive = () => {
    onArchive(job.id);
    onClose();
  }
  
  const handleUnarchive = () => {
    onUnarchive(job.id);
    onClose();
  }

  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUpdateText.trim()) {
        addJobUpdate(job.id, { text: newUpdateText, isReminder });
        setNewUpdateText('');
        setIsReminder(false);
    }
  };
  
  const handleStartEdit = (update: Update) => {
    setEditingUpdateId(update.id);
    setEditedText(update.text);
  };

  const handleCancelEdit = () => {
    setEditingUpdateId(null);
    setEditedText('');
  };

  const handleSaveEdit = () => {
    if (editingUpdateId && editedText.trim()) {
      updateJobUpdate(job.id, editingUpdateId, { text: editedText.trim() });
    }
    handleCancelEdit();
  };

  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleAttemptClose();
    }
  };

  const formattedDeadline = job.deadline
    ? new Date(job.deadline).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
    : null;

  const formattedStartingDate = job.starting
    ? new Date(job.starting).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
    : null;

  const flag = getCountryFlag(job.location);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        className="bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl border border-slate-700 relative max-h-[90vh] flex flex-col"
      >
        {showConfirmClose && (
          <div className="absolute inset-0 bg-slate-800/90 backdrop-blur-sm flex flex-col justify-center items-center rounded-xl z-20 p-8 text-center">
            <h3 className="text-xl font-bold text-white">Discard Changes?</h3>
            <p className="text-slate-400 mt-2 mb-6">You have unsaved changes. Are you sure you want to discard them?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmClose(false)}
                className="py-2 px-6 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold text-white transition-colors"
              >
                Keep Editing
              </button>
              <button
                onClick={onClose}
                className="py-2 px-6 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-start pb-4 border-b border-slate-700">
          <div>
            <h2 className="text-3xl font-bold text-slate-100">{job.title}</h2>
            <p className="text-lg text-slate-400">{job.company}</p>
          </div>
          <button
            onClick={handleAttemptClose}
            className="text-slate-500 hover:text-slate-300"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="py-6 flex-grow overflow-y-auto pr-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formattedStartingDate && (
                    <div>
                        <h4 className="font-semibold text-slate-300 mb-2 flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-slate-500"/>Starting Date</h4>
                        <p className="text-slate-400">{formattedStartingDate}</p>
                    </div>
                )}
                {formattedDeadline && (
                    <div>
                        <h4 className="font-semibold text-slate-300 mb-2 flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-slate-500"/>Application Deadline</h4>
                        <p className="font-medium text-amber-400">{formattedDeadline}</p>
                    </div>
                )}

                {job.url && (
                    <div>
                        <h4 className="font-semibold text-slate-300 mb-2">Job URL</h4>
                        <a href={job.url.startsWith('http') ? job.url : `https://${job.url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 break-all">
                            <span>{job.url}</span>
                            <ExternalLinkIcon className="h-4 w-4 flex-shrink-0"/>
                        </a>
                    </div>
                )}
                {job.source && (
                    <div>
                        <h4 className="font-semibold text-slate-300 mb-2 flex items-center gap-2"><TagIcon className="h-4 w-4 text-slate-500"/>Source</h4>
                        <p className="text-slate-400">{job.source}</p>
                    </div>
                )}
                
                <div>
                    <h4 className="font-semibold text-slate-300 mb-2">Status</h4>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColorMap[job.status]}`}>{job.status}</span>
                </div>
                
                <div>
                    <h4 className="font-semibold text-slate-300 mb-2">Location</h4>
                    <p className="text-slate-400">{flag} {job.location}</p>
                </div>
            </div>

            {job.description && (
                <div>
                    <h4 className="font-semibold text-slate-300 mb-2">Description</h4>
                    <div className="bg-slate-900/50 p-4 rounded-md max-h-40 overflow-y-auto">
                        <p className="text-slate-400 whitespace-pre-wrap">{job.description}</p>
                    </div>
                </div>
            )}

            <div>
              <h4 className="font-semibold text-slate-300 mb-2">Updates & Reminders</h4>
              <div className="bg-slate-900/50 p-4 rounded-md">
                <form onSubmit={handleAddUpdate} className="space-y-3">
                  <textarea
                    value={newUpdateText}
                    onChange={(e) => setNewUpdateText(e.target.value)}
                    rows={2}
                    placeholder="Add an update or a to-do..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                  />
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isReminder}
                        onChange={(e) => setIsReminder(e.target.checked)}
                        className="rounded bg-slate-600 border-slate-500 text-cyan-500 focus:ring-cyan-600"
                      />
                      Set as reminder
                    </label>
                    <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-1 px-3 rounded-lg text-sm">
                      Add Update
                    </button>
                  </div>
                </form>
                {job.updates && job.updates.length > 0 && <hr className="border-slate-700 my-4" />}
                <div className="space-y-3 max-h-48 overflow-y-auto">
                    {job.updates?.map(update => (
                        <div key={update.id} className="flex justify-between items-start gap-3">
                             {editingUpdateId === update.id ? (
                                <textarea
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                    rows={2}
                                    className="w-full flex-grow bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-sm"
                                    autoFocus
                                />
                            ) : (
                                <div className="flex-grow">
                                    <p className="text-sm text-slate-300">{update.text}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <button
                                            onClick={() => updateJobUpdate(job.id, update.id, { isReminder: !update.isReminder })}
                                            title={update.isReminder ? 'Unset as reminder' : 'Set as reminder'}
                                            aria-label={update.isReminder ? 'Unset as reminder' : 'Set as reminder'}
                                            className="group p-1 -m-1 rounded-full hover:bg-slate-700/50 transition-colors"
                                        >
                                            <BellIcon className={`h-4 w-4 transition-colors ${update.isReminder ? 'text-amber-400' : 'text-slate-500 group-hover:text-amber-400'}`} />
                                        </button>
                                        <p className="text-xs text-slate-500">
                                        {new Date(update.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-1 flex-shrink-0">
                                {editingUpdateId === update.id ? (
                                <>
                                    <button onClick={handleSaveEdit} className="text-slate-400 hover:text-green-400 transition-colors p-1" aria-label="Save update">
                                        <CheckIcon className="h-5 w-5"/>
                                    </button>
                                    <button onClick={handleCancelEdit} className="text-slate-400 hover:text-slate-100 transition-colors p-1" aria-label="Cancel edit">
                                        <XMarkIcon className="h-5 w-5"/>
                                    </button>
                                </>
                                ) : (
                                <>
                                    <button onClick={() => handleStartEdit(update)} className="text-slate-500 hover:text-cyan-400 transition-colors p-1" aria-label="Edit update">
                                        <EditIcon className="h-4 w-4"/>
                                    </button>
                                    <button onClick={() => deleteJobUpdate(job.id, update.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1" aria-label="Delete update">
                                        <TrashIcon className="h-4 w-4"/>
                                    </button>
                                </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onEdit}
              className="py-2 px-4 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-semibold text-white transition-colors"
            >
              Edit
            </button>
            {job.status === JobStatus.ARCHIVED ? (
              <button
                  type="button"
                  onClick={handleUnarchive}
                  className="py-2 px-4 bg-teal-600 hover:bg-teal-700 rounded-lg font-semibold text-white transition-colors flex items-center gap-2"
              >
                  <UnarchiveIcon className="h-5 w-5" />
                  <span>Unarchive</span>
              </button>
            ) : (
              <button
                  type="button"
                  onClick={handleArchive}
                  className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white transition-colors flex items-center gap-2"
              >
                  <ArchiveIcon className="h-5 w-5" />
                  <span>Archive</span>
              </button>
            )}
             <button
              type="button"
              onClick={handleDelete}
              className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white transition-colors"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={handleAttemptClose}
              className="py-2 px-4 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold text-white transition-colors"
            >
              Close
            </button>
        </div>

      </div>
    </div>
  );
};