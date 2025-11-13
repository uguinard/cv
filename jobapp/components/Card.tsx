import React, { useState, useMemo } from 'react';
import { type Job, JobStatus } from '../types';
import { getCountryFlag } from '../utils/getCountryFlag';
import { BellIcon } from './icons/BellIcon';

interface CardProps {
  job: Job;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, jobId: string) => void;
  handleDragEnd: () => void;
  onContextMenu: (e: React.MouseEvent, job: Job) => void;
  onViewRequest: (job: Job) => void;
}

const getRemainingDays = (deadline?: string): number | null => {
    if (!deadline) return null;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const deadlineDate = new Date(deadline);
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

const formatRemainingDays = (days: number): string => {
  if (days < 0) return 'Overdue';
  return `(${days}) ➜]`;
}

const getRemainingDaysColor = (days: number): string => {
  if (days < 0) return 'text-slate-500';
  if (days <= 3) return 'text-red-400';
  if (days <= 7) return 'text-amber-400';
  return 'text-slate-400';
};


const getDeadlineIndicatorClass = (deadline?: string, status?: JobStatus): string => {
  if (!deadline || status !== JobStatus.WISHLIST) return 'border-slate-700';

  const remainingDays = getRemainingDays(deadline);

  if (remainingDays === null) return 'border-slate-700';
  if (remainingDays < 0) return 'opacity-60 border-slate-600';
  if (remainingDays <= 3) return 'border-red-500 shadow-lg shadow-red-500/20';
  if (remainingDays <= 7) return 'border-amber-400 shadow-lg shadow-amber-400/20';
  
  return 'border-slate-700';
};


export const Card: React.FC<CardProps> = ({ 
    job, 
    handleDragStart, 
    handleDragEnd, 
    onContextMenu,
    onViewRequest,
 }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const flag = getCountryFlag(job.location);
  const remainingDays = getRemainingDays(job.deadline);

  const latestReminder = useMemo(() => {
    if (!job.updates || job.updates.length === 0) return null;
    return job.updates.find(update => update.isReminder) || null;
  }, [job.updates]);
  
  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    handleDragStart(e, job.id);
  };

  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(false);
    handleDragEnd();
  }
  
  return (
    <>
      <div
        draggable="true"
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={() => onViewRequest(job)}
        onContextMenu={(e) => onContextMenu(e, job)}
        className={`relative bg-slate-800 rounded-lg shadow-md cursor-pointer active:cursor-grabbing transition-all duration-300 border hover:border-cyan-500 hover:shadow-cyan-500/10 flex flex-col ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'} ${getDeadlineIndicatorClass(job.deadline, job.status)}`}
      >
        <div className="p-4 flex-grow">
          {flag && (
              <div className="absolute top-3 right-3 text-right">
                  <span className="text-2xl" aria-label={job.location}>
                      {flag}
                  </span>
                  {job.status === JobStatus.WISHLIST && remainingDays !== null && (
                      <p className={`text-xs font-bold mt-1 ${getRemainingDaysColor(remainingDays)}`}>
                          {formatRemainingDays(remainingDays)}
                      </p>
                  )}
              </div>
          )}

          <div className="flex justify-between items-start">
              <div className="pr-16">
                  <h3 className="font-bold text-slate-100">{job.title}</h3>
                  <p className="text-sm text-slate-400">{job.company}</p>
                  <p className="text-xs text-slate-500 mt-1">
                      <span>{job.location}</span>
                  </p>
              </div>
          </div>
        </div>
         {latestReminder && (
          <div className="border-t border-slate-700 bg-slate-900/30 px-4 py-2 rounded-b-lg">
            <div className="flex items-start gap-2">
              <BellIcon className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-300 italic leading-snug">
                {latestReminder.text}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};