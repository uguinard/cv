import React, { useState, useMemo } from 'react';
import { Column } from './Column';
import { type Job, JobStatus } from '../types';
import { COLUMNS } from '../constants';
import { ContextMenu } from './ContextMenu';

interface BoardProps {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  onDeleteRequest: (id: string) => void;
  archiveJob: (id: string) => void;
  unarchiveJob: (id: string) => void;
  setEditingJob: (job: Job | null) => void;
  selectedStatus: JobStatus | 'All';
  changeJobStatus: (id: string, newStatus: JobStatus) => void;
  onViewRequest: (job: Job) => void;
}

export const Board: React.FC<BoardProps> = ({ 
  jobs, 
  setJobs, 
  onDeleteRequest, 
  archiveJob, 
  unarchiveJob, 
  setEditingJob, 
  selectedStatus, 
  changeJobStatus,
  onViewRequest,
}) => {
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, job: Job } | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<JobStatus | null>(null);


  const visibleColumns = useMemo(() => {
    if (selectedStatus === 'All') {
      return COLUMNS.filter(c => c.id !== JobStatus.ARCHIVED && c.id !== JobStatus.REJECTED);
    }
    return COLUMNS.filter(c => c.id === selectedStatus);
  }, [selectedStatus]);

  const gridLayout = useMemo(() => {
    const count = visibleColumns.length;
    switch (count) {
      case 1:
        return 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1 max-w-4xl mx-auto w-full';
      case 2:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-3';
      case 4:
         return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      case 5:
         return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5';
      default:
        return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6';
    }
  }, [visibleColumns]);


  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, jobId: string) => {
    setDraggedJobId(jobId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', jobId);
  };
  
  const handleDragEnd = () => {
    if (draggedJobId && dropTargetStatus) {
      const jobToUpdate = jobs.find(job => job.id === draggedJobId);
      if (jobToUpdate && jobToUpdate.status !== dropTargetStatus) {
        const updatedJobs = jobs.map(job =>
          job.id === draggedJobId ? { ...job, status: dropTargetStatus } : job
        );
        setJobs(updatedJobs);
      }
    }
    setDraggedJobId(null);
    setDropTargetStatus(null);
  }

  const handleDrop = (newStatus: JobStatus) => {
    if (!draggedJobId) return;
    setDropTargetStatus(newStatus);
  };
  
  const handleContextMenu = (e: React.MouseEvent, job: Job) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, job });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  }

  const isSingleColumnView = selectedStatus !== 'All';

  return (
    <>
      <div className={`grid ${gridLayout} gap-6 h-full`}>
        {visibleColumns.map(column => (
          <Column
            key={column.id}
            title={column.title}
            status={column.id}
            color={column.color}
            jobs={jobs.filter(job => job.status === column.id)}
            onDrop={handleDrop}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            onContextMenu={handleContextMenu}
            onViewRequest={onViewRequest}
          />
        ))}
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          job={contextMenu.job}
          onClose={closeContextMenu}
          onEdit={setEditingJob}
          onDeleteRequest={onDeleteRequest}
          onArchive={archiveJob}
          onUnarchive={unarchiveJob}
          onChangeStatus={changeJobStatus}
          isSingleColumnView={isSingleColumnView}
        />
      )}
    </>
  );
};