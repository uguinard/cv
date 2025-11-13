import React, { useState, useMemo, useRef } from 'react';
import { Card } from './Card';
import { type Job, JobStatus } from '../types';

interface ColumnProps {
  title: string;
  status: JobStatus;
  color: string;
  jobs: Job[];
  onDrop: (newStatus: JobStatus) => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, jobId: string) => void;
  handleDragEnd: () => void;
  onContextMenu: (e: React.MouseEvent, job: Job) => void;
  onViewRequest: (job: Job) => void;
}

export const Column: React.FC<ColumnProps> = ({
  title,
  status,
  color,
  jobs,
  onDrop,
  handleDragStart,
  handleDragEnd,
  onContextMenu,
  onViewRequest,
}) => {
  const [isActive, setIsActive] = useState(false);
  const dragCounter = useRef(0);

  const sortedJobs = useMemo(() => {
    if (status !== JobStatus.WISHLIST) {
      return jobs;
    }
    return [...jobs].sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [jobs, status]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Prevent column from highlighting when dragging files
    if (Array.from(e.dataTransfer.types).includes('Files')) {
      return;
    }
    dragCounter.current++;
    if (dragCounter.current === 1) {
      setIsActive(true);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Only show the 'move' cursor for card drags
    if (!Array.from(e.dataTransfer.types).includes('Files')) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (Array.from(e.dataTransfer.types).includes('Files')) {
      return;
    }
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Prevent column from handling file drops
    if (Array.from(e.dataTransfer.types).includes('Files')) {
      return;
    }
    dragCounter.current = 0;
    setIsActive(false);
    onDrop(status);
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-xl transition-all duration-300 flex flex-col ${isActive ? 'bg-slate-700/50 scale-105' : 'bg-slate-800/50'}`}
    >
      <div className={`p-4 font-bold text-lg text-slate-100 flex justify-between items-center rounded-t-xl border-b-4 ${color}`}>
        <span>{title}</span>
        <span className="text-sm font-normal bg-slate-700 text-slate-300 rounded-full px-2 py-0.5">
          {jobs.length}
        </span>
      </div>
      <div className="p-4 space-y-4 h-full overflow-y-auto">
        {sortedJobs.map(job => (
          <Card
            key={job.id}
            job={job}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            onContextMenu={onContextMenu}
            onViewRequest={onViewRequest}
          />
        ))}
        {jobs.length === 0 && !isActive && (
           <div className="text-center py-10 text-slate-500">
             <p>Drag cards here</p>
           </div>
        )}
        {isActive && (
            <div className="text-center py-10 text-cyan-400 border-2 border-dashed border-cyan-400 rounded-lg">
                <p>Drop to assign</p>
            </div>
        )}
      </div>
    </div>
  );
};