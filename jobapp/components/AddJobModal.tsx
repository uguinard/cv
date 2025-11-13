import React, { useState, useEffect, useRef, useCallback } from 'react';
import { type Job } from '../types';
import { LOCATIONS } from '../data/locations';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: Omit<Job, 'id' | 'status'>) => void;
  existingJob?: Job;
  allJobs?: Job[];
}

type JobFormData = Omit<Job, 'id' | 'status'>;

const PREDEFINED_SOURCES = ['Linkedin', 'Indeed', 'TES', 'Schrole', 'Teacher Horizons', 'TodoELE', 'InfoJobs', 'GRC Fair'];

export const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose, onAddJob, existingJob }) => {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    deadline: '',
    url: '',
    starting: '',
    source: '',
    description: '',
  });

  const [initialState, setInitialState] = useState<JobFormData | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [sourceSuggestions, setSourceSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      const stateToSet = {
        title: existingJob?.title || '',
        company: existingJob?.company || '',
        location: existingJob?.location || '',
        deadline: existingJob?.deadline || '',
        url: existingJob?.url || '',
        starting: existingJob?.starting || '',
        source: existingJob?.source || '',
        description: existingJob?.description || '',
      };
      setFormData(stateToSet);
      setInitialState(stateToSet);
      setShowConfirm(false); // Reset confirmation on open
    }
  }, [existingJob, isOpen]);
  
  useEffect(() => {
    if (initialState) {
        setIsDirty(JSON.stringify(formData) !== JSON.stringify(initialState));
    }
  }, [formData, initialState]);

  const handleAttemptClose = useCallback(() => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  }, [isDirty, onClose]);
  
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleAttemptClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleAttemptClose]);


  if (!isOpen) return null;

  const handleFormChange = (field: keyof JobFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleAttemptClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company) return;
    onAddJob(formData);
    onClose();
  };
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleFormChange('location', value);
    if (value.length >= 3) {
      setLocationSuggestions(LOCATIONS.filter(loc => loc.toLowerCase().includes(value.toLowerCase())));
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleFormChange('source', value);
    if (value) {
      setSourceSuggestions(PREDEFINED_SOURCES.filter(s => s.toLowerCase().includes(value.toLowerCase())));
    } else {
      setSourceSuggestions([]);
    }
  };

  const handleSuggestionClick = (field: keyof JobFormData, value: string, suggestionSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    handleFormChange(field, value);
    suggestionSetter([]);
  };

  const handleBlur = (suggestionSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setTimeout(() => {
      suggestionSetter([]);
    }, 150);
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center"
      onMouseDown={handleBackdropMouseDown}
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-lg border border-slate-700 relative max-h-[90vh] overflow-y-auto"
      >
        {showConfirm && (
          <div className="absolute inset-0 bg-slate-800/90 backdrop-blur-sm flex flex-col justify-center items-center rounded-xl z-20 p-8 text-center">
            <h3 className="text-xl font-bold text-white">Discard Changes?</h3>
            <p className="text-slate-400 mt-2 mb-6">You have unsaved changes. Are you sure you want to discard them?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirm(false)}
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
        <h2 className="text-2xl font-bold mb-6 text-slate-100">{existingJob ? 'Edit Job' : 'Add New Job'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-400 mb-1">Job Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleFormChange('title', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-slate-400 mb-1">Company</label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={(e) => handleFormChange('company', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="location" className="block text-sm font-medium text-slate-400 mb-1">Location</label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={handleLocationChange}
              onBlur={() => handleBlur(setLocationSuggestions)}
              autoComplete="off"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
            />
            {locationSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-slate-600 border border-slate-500 rounded-md mt-1 max-h-40 overflow-y-auto">
                    {locationSuggestions.map((suggestion, index) => (
                        <li key={index} onMouseDown={() => handleSuggestionClick('location', suggestion, setLocationSuggestions)} className="px-3 py-2 cursor-pointer hover:bg-cyan-600 text-slate-100">
                           {suggestion}
                        </li>
                    ))}
                </ul>
            )}
          </div>
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-slate-400 mb-1">Application Deadline</label>
            <input
              type="date"
              id="deadline"
              value={formData.deadline}
              onChange={(e) => handleFormChange('deadline', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="starting" className="block text-sm font-medium text-slate-400 mb-1">Starting Date (Optional)</label>
            <input
              type="date"
              id="starting"
              value={formData.starting}
              onChange={(e) => handleFormChange('starting', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-slate-400 mb-1">Job Post URL (Optional)</label>
            <input
              type="text"
              id="url"
              value={formData.url}
              onChange={(e) => handleFormChange('url', e.target.value)}
              placeholder="e.g. company.com/careers/123"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
            />
          </div>
           <div className="relative">
            <label htmlFor="source" className="block text-sm font-medium text-slate-400 mb-1">Source</label>
            <input
              type="text"
              id="source"
              value={formData.source}
              onChange={handleSourceChange}
              onBlur={() => handleBlur(setSourceSuggestions)}
              placeholder="e.g. LinkedIn, Company Website"
              autoComplete="off"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
            />
             {sourceSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-slate-600 border border-slate-500 rounded-md mt-1 max-h-40 overflow-y-auto">
                    {sourceSuggestions.map((suggestion, index) => (
                        <li key={index} onMouseDown={() => handleSuggestionClick('source', suggestion, setSourceSuggestions)} className="px-3 py-2 cursor-pointer hover:bg-cyan-600 text-slate-100">
                           {suggestion}
                        </li>
                    ))}
                </ul>
            )}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-400 mb-1">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              rows={3}
              placeholder="Job responsibilities, notes, etc."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleAttemptClose}
              className="py-2 px-4 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold text-white transition-colors shadow-md"
            >
             {existingJob ? 'Save Changes' : 'Add Job'}
            </button>
          </div>
        </form>
        <button 
          onClick={handleAttemptClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};