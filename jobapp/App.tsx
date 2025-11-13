import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Board } from './components/Board';
import { AddJobModal } from './components/AddJobModal';
import { FilterBar } from './components/FilterBar';
import { PlusIcon } from './components/icons/PlusIcon';
import { type Job, JobStatus, type Update, type FileImportPreview } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { GithubIcon } from './components/icons/GithubIcon';
import { XCircleIcon } from './components/icons/XCircleIcon';
import { DEMO_JOBS } from './data/demo-jobs';
import { EllipsisVerticalIcon } from './components/icons/EllipsisVerticalIcon';
import { ArrowDownOnSquareIcon } from './components/icons/ArrowDownOnSquareIcon';
import { UnarchiveIcon } from './components/icons/UnarchiveIcon';
import { ConfirmationModal } from './components/ConfirmationModal';
import { RemindersCarousel } from './components/RemindersCarousel';
import { JobOverviewModal } from './components/JobOverviewModal';
import { DropzoneOverlay } from './components/DropzoneOverlay';
import { ImportConfirmationModal } from './components/ImportConfirmationModal';
import { ImportStatusModal } from './components/ImportStatusModal';

const DATA_VERSION = 2;

export interface ImportActions {
  jobsToAdd: Job[];
  jobsToUpdate: Job[];
}

interface FileImportResult {
  fileName: string;
  status: 'imported' | 'failed';
  jobsAdded: number;
  jobsSkipped: number;
  jobsOverwritten: number;
  error?: string;
}

const App: React.FC = () => {
  const [jobs, setJobs] = useLocalStorage<Job[]>('jobs', DEMO_JOBS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [overviewJob, setOverviewJob] = useState<Job | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | 'All'>('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const [importPreview, setImportPreview] = useState<FileImportPreview[]>([]);
  const [importStatus, setImportStatus] = useState<FileImportResult[]>([]);
  const [isImportPreviewOpen, setIsImportPreviewOpen] = useState(false);
  const [isImportStatusOpen, setIsImportStatusOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);


  useEffect(() => {
    setIsClient(true);
  
    const migrateData = () => {
      const storedVersion = parseInt(window.localStorage.getItem('job-tracker-version') || '1', 10);
      
      if (storedVersion < DATA_VERSION) {
        console.log(`Migrating data from version ${storedVersion} to ${DATA_VERSION}`);
        
        const migratedJobs = jobs.map((job: any) => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          status: job.status,
          ...(job.deadline && { deadline: job.deadline }),
          ...(job.url && { url: job.url }),
          ...(job.starting && { starting: job.starting }),
          ...(job.source && { source: job.source }),
          ...(job.description && { description: job.description }),
          updates: job.updates || [],
        }));
        
        setJobs(migratedJobs);
        window.localStorage.setItem('job-tracker-version', String(DATA_VERSION));
        console.log("Data migration complete.");
      }
    };

    setTimeout(migrateData, 0);

  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
        setIsOptionsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Syncs the data in the overview modal with the main jobs list
  // whenever an update is made (e.g., adding a note, archiving).
  useEffect(() => {
    if (overviewJob) {
      const freshJobData = jobs.find(j => j.id === overviewJob.id);
      if (freshJobData) {
        // Prevent infinite loops by only updating if data is different
        if (JSON.stringify(freshJobData) !== JSON.stringify(overviewJob)) {
          setOverviewJob(freshJobData);
        }
      } else {
        // Job was deleted, so close the modal
        setOverviewJob(null);
      }
    }
  }, [jobs, overviewJob]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All');
    setSelectedCompany('All');
    setSelectedLocation('All');
  };

  const hasActiveFilters = searchTerm || selectedStatus !== 'All' || selectedCompany !== 'All' || selectedLocation !== 'All';

  const filteredJobs = useMemo(() => {
    if (!isClient) return [];
    
    let jobsToFilter = jobs;

    if (selectedStatus === 'All') {
      jobsToFilter = jobs.filter(job => job.status !== JobStatus.ARCHIVED && job.status !== JobStatus.REJECTED);
    } else {
      jobsToFilter = jobs.filter(job => job.status === selectedStatus);
    }

    return jobsToFilter.filter(job => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term) ||
        (job.description && job.description.toLowerCase().includes(term)) ||
        (job.source && job.source.toLowerCase().includes(term));

      const matchesCompany = selectedCompany === 'All' || job.company === selectedCompany;
      const matchesLocation = selectedLocation === 'All' || job.location === selectedLocation;

      return matchesSearch && matchesCompany && matchesLocation;
    });
  }, [jobs, searchTerm, selectedStatus, selectedCompany, selectedLocation, isClient]);

  const addJob = (job: Omit<Job, 'id' | 'status'>) => {
    const newJob: Job = {
      ...job,
      id: `job-${Date.now()}`,
      status: JobStatus.WISHLIST,
      updates: [],
    };
    setJobs([...jobs, newJob]);
  };
  
  const updateJob = (updatedJob: Job) => {
    setJobs(jobs.map(job => job.id === updatedJob.id ? updatedJob : job));
  };

  const addJobUpdate = (jobId: string, updateData: Omit<Update, 'id' | 'createdAt'>) => {
    const newUpdate: Update = {
      ...updateData,
      id: `update-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        const updatedUpdates = [newUpdate, ...(job.updates || [])];
        return { ...job, updates: updatedUpdates };
      }
      return job;
    }));
  };

  const updateJobUpdate = (jobId: string, updateId: string, newUpdateData: Partial<Omit<Update, 'id' | 'createdAt'>>) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        const updatedUpdates = (job.updates || []).map(update => {
          if (update.id === updateId) {
            return { ...update, ...newUpdateData };
          }
          return update;
        });
        return { ...job, updates: updatedUpdates };
      }
      return job;
    }));
  };

  const deleteJobUpdate = (jobId: string, updateId: string) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        const updatedUpdates = (job.updates || []).filter(update => update.id !== updateId);
        return { ...job, updates: updatedUpdates };
      }
      return job;
    }));
  };
  
  const archiveJob = (id: string) => {
    setJobs(jobs.map(job =>
      job.id === id ? { ...job, status: JobStatus.ARCHIVED } : job
    ));
  };
  
  const unarchiveJob = (id: string) => {
    setJobs(prevJobs => prevJobs.map(job =>
      job.id === id ? { ...job, status: JobStatus.WISHLIST } : job
    ));
    if (selectedStatus === JobStatus.ARCHIVED) {
        setSelectedStatus('All');
    }
  };

  const changeJobStatus = (id: string, newStatus: JobStatus) => {
    setJobs(prevJobs => 
      prevJobs.map(job =>
        job.id === id ? { ...job, status: newStatus } : job
      )
    );
  };

  const deleteJob = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const requestDeleteJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setJobToDelete(job);
    }
  };

  const handleConfirmDelete = () => {
    if (jobToDelete) {
      deleteJob(jobToDelete.id);
      setJobToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setJobToDelete(null);
  };

  const handleSaveJob = (jobData: Omit<Job, 'id' | 'status'>) => {
    if (editingJob) {
        updateJob({ ...editingJob, ...jobData });
    } else {
        addJob(jobData);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingJob(null);
  };
  
  const handleViewJob = (job: Job) => {
    setOverviewJob(job);
  };

  const handleExport = () => {
    setIsOptionsMenuOpen(false);
    if (jobs.length === 0) {
      alert("No job data to export.");
      return;
    }
    try {
      const jsonData = JSON.stringify(jobs, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      link.download = `job_tracker_backup_${date}.json`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data.");
    }
  };

  const handleImportClick = () => {
    setIsOptionsMenuOpen(false);
    fileInputRef.current?.click();
  };

  const processFiles = async (files: FileList) => {
    const jsonFiles = Array.from(files).filter(file => file.type === 'application/json' || file.name.endsWith('.json'));

    if (jsonFiles.length === 0) {
      alert("No JSON files found. Please select files with a .json extension.");
      return;
    }

    const readFileAsText = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
      });
    };

    const previews: FileImportPreview[] = [];
    const validStatuses = Object.values(JobStatus);

    for (const file of jsonFiles) {
        const filePreview: FileImportPreview = { fileName: file.name, jobPreviews: [] };
        try {
            const content = await readFileAsText(file);
            let parsedData = JSON.parse(content);
            const jobsFromFile = Array.isArray(parsedData) ? parsedData : [parsedData];

            if (jobsFromFile.length === 0) {
                filePreview.jobPreviews.push({ jobData: {} as Job, status: 'invalid', error: 'No job objects found in the file.' });
                previews.push(filePreview);
                continue;
            }

            for (const item of jobsFromFile) {
                if (typeof item === 'object' && item !== null && 'title' in item && 'company' in item) {
                    const importedJob: Job = {
                        id: item.id ? String(item.id) : `job-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                        title: String(item.title),
                        company: String(item.company),
                        location: String(item.location || ''),
                        status: validStatuses.includes(item.status as JobStatus) ? item.status : JobStatus.WISHLIST,
                        deadline: item.deadline ? String(item.deadline) : undefined,
                        url: item.url ? String(item.url) : undefined,
                        starting: item.starting ? String(item.starting) : undefined,
                        source: item.source ? String(item.source) : undefined,
                        description: item.description ? String(item.description) : undefined,
                        updates: Array.isArray(item.updates) ? item.updates : [],
                    };

                    const duplicateByUrl = importedJob.url
                      ? jobs.find(j => j.url && j.url.trim() && j.url.trim().replace(/\/$/, '') === importedJob.url!.trim().replace(/\/$/, ''))
                      : null;

                    if (duplicateByUrl) {
                        filePreview.jobPreviews.push({
                            jobData: importedJob,
                            status: 'duplicate',
                            existingJob: duplicateByUrl
                        });
                    } else {
                        filePreview.jobPreviews.push({
                            jobData: importedJob,
                            status: 'new'
                        });
                    }
                } else {
                    filePreview.jobPreviews.push({ jobData: item, status: 'invalid', error: 'Missing required fields (title, company).' });
                }
            }
        } catch (e) {
            filePreview.jobPreviews.push({
                jobData: {} as Job,
                status: 'invalid',
                error: e instanceof SyntaxError ? 'Invalid JSON format.' : 'Could not read file.',
            });
        }
        previews.push(filePreview);
    }
    
    if (previews.length > 0) {
        setImportPreview(previews);
        setIsImportPreviewOpen(true);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    if (event.target) event.target.value = '';
  };
  
  const handleConfirmImport = (actions: ImportActions) => {
    const { jobsToAdd, jobsToUpdate } = actions;

    const fileResultsMap: Map<string, { jobsAdded: number; jobsSkipped: number; jobsOverwritten: number }> = new Map();

    importPreview.forEach(file => {
      const fileStat = { jobsAdded: 0, jobsSkipped: 0, jobsOverwritten: 0 };
      file.jobPreviews.forEach(preview => {
        if (preview.status === 'new') {
          if (jobsToAdd.find(j => j.id === preview.jobData.id)) {
            fileStat.jobsAdded++;
          } else {
            fileStat.jobsSkipped++;
          }
        } else if (preview.status === 'duplicate' && preview.existingJob) {
          if (jobsToUpdate.find(j => j.id === preview.existingJob!.id)) {
            fileStat.jobsOverwritten++;
          } else {
            fileStat.jobsSkipped++;
          }
        } else { // invalid
          fileStat.jobsSkipped++;
        }
      });
      fileResultsMap.set(file.fileName, fileStat);
    });

    const finalResults: FileImportResult[] = [];
    for (const [fileName, stats] of fileResultsMap.entries()) {
      finalResults.push({ fileName, status: 'imported', ...stats });
    }

    setJobs(prevJobs => {
        let updatedJobs = [...prevJobs];

        jobsToUpdate.forEach(jobToUpdate => {
            updatedJobs = updatedJobs.map(job => job.id === jobToUpdate.id ? jobToUpdate : job);
        });

        const existingIds = new Set(updatedJobs.map(j => j.id));
        const newJobsToAdd = jobsToAdd.filter(j => !existingIds.has(j.id));
        
        return [...updatedJobs, ...newJobsToAdd];
    });
    
    setImportStatus(finalResults);
    setIsImportPreviewOpen(false);
    setIsImportStatusOpen(true);
  };

  const handleCancelImport = () => {
      setImportPreview([]);
      setIsImportPreviewOpen(false);
  };
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDraggingOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div 
      className="min-h-screen bg-slate-900 text-slate-50 flex flex-col relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <header className="p-4 bg-slate-950/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">Job Application Tracker</h1>
          </div>
          <div className="flex items-center gap-2">
              <a href="https://github.com/your-github/job-tracker" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors p-2 rounded-full hover:bg-slate-700">
                <GithubIcon className="h-6 w-6" />
            </a>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Job</span>
            </button>
            <div className="relative" ref={optionsMenuRef}>
              <button
                onClick={() => setIsOptionsMenuOpen(prev => !prev)}
                className="p-2 rounded-full hover:bg-slate-700 transition-colors"
                aria-label="More options"
              >
                <EllipsisVerticalIcon className="h-6 w-6" />
              </button>
              {isOptionsMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-20 py-1">
                  <button
                    onClick={handleImportClick}
                    className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-3 transition-colors"
                  >
                    <UnarchiveIcon className="h-5 w-5" /> 
                    <span>Import from File...</span>
                  </button>
                  <button
                    onClick={handleExport}
                    className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-3 transition-colors"
                  >
                    <ArrowDownOnSquareIcon className="h-5 w-5" />
                    <span>Export to File...</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <RemindersCarousel jobs={jobs} onViewJob={handleViewJob} />

      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        allJobs={jobs}
        onClearFilters={clearFilters}
      />

      <main className="flex-grow p-4 lg:p-6 overflow-x-auto">
        {filteredJobs.length > 0 || selectedStatus === JobStatus.ARCHIVED || selectedStatus === JobStatus.REJECTED ? (
            <Board 
              jobs={filteredJobs} 
              setJobs={setJobs} 
              onDeleteRequest={requestDeleteJob}
              archiveJob={archiveJob}
              unarchiveJob={unarchiveJob}
              setEditingJob={setEditingJob} 
              selectedStatus={selectedStatus}
              changeJobStatus={changeJobStatus}
              onViewRequest={handleViewJob}
            />
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 pt-16">
              <h2 className="text-2xl font-semibold">No Jobs Found</h2>
              {hasActiveFilters ? (
                <>
                  <p className="mt-2">Try adjusting your search or filter criteria.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
                  >
                    <XCircleIcon className="h-5 w-5" />
                    <span>Clear Filters</span>
                  </button>
                </>
              ) : (
                 <p className="mt-2">Click 'Add Job' to get started!</p>
              )}
            </div>
        )}
      </main>

      <AddJobModal
        isOpen={isModalOpen || !!editingJob}
        onClose={handleCloseModal}
        onAddJob={handleSaveJob}
        existingJob={editingJob ?? undefined}
        allJobs={jobs}
      />
      
      {overviewJob && (
        <JobOverviewModal
          job={overviewJob}
          isOpen={!!overviewJob}
          onClose={() => setOverviewJob(null)}
          onEdit={() => {
            setEditingJob(overviewJob);
            setOverviewJob(null);
          }}
          onDeleteRequest={requestDeleteJob}
          onArchive={archiveJob}
          onUnarchive={unarchiveJob}
          addJobUpdate={addJobUpdate}
          deleteJobUpdate={deleteJobUpdate}
          updateJobUpdate={updateJobUpdate}
        />
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json"
        className="hidden"
        multiple
      />
      
      <ImportConfirmationModal
        isOpen={isImportPreviewOpen}
        onClose={handleCancelImport}
        onConfirm={handleConfirmImport}
        previewData={importPreview}
      />

      <ImportStatusModal
        isOpen={isImportStatusOpen}
        onClose={() => setIsImportStatusOpen(false)}
        statusData={importStatus}
      />

      <ConfirmationModal
        isOpen={!!jobToDelete}
        title="Delete Job Application"
        message={`Are you sure you want to permanently delete the application for "${jobToDelete?.title}" at "${jobToDelete?.company}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
      
      {isDraggingOver && <DropzoneOverlay />}
    </div>
  );
};

export default App;