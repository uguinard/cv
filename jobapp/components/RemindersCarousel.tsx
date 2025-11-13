import React, { useState, useEffect, useMemo } from 'react';
import { type Job, type Update } from '../types';
import { BellIcon } from './icons/BellIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface Reminder extends Update {
  jobId: string;
  jobTitle: string;
  jobCompany: string;
}

interface RemindersCarouselProps {
  jobs: Job[];
  onViewJob: (job: Job) => void;
}

export const RemindersCarousel: React.FC<RemindersCarouselProps> = ({ jobs, onViewJob }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reminders: Reminder[] = useMemo(() => {
    const allReminders: Reminder[] = [];
    jobs.forEach(job => {
      job.updates?.forEach(update => {
        if (update.isReminder) {
          allReminders.push({
            ...update,
            jobId: job.id,
            jobTitle: job.title,
            jobCompany: job.company,
          });
        }
      });
    });
    return allReminders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [jobs]);

  useEffect(() => {
    if (reminders.length > 1) {
      const timer = setTimeout(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % reminders.length);
      }, 7000); // Change slide every 7 seconds
      return () => clearTimeout(timer);
    }
  }, [currentIndex, reminders.length]);

  if (reminders.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + reminders.length) % reminders.length);
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % reminders.length);
  };

  const currentReminder = reminders[currentIndex];
  const parentJob = jobs.find(job => job.id === currentReminder.jobId);

  const handleViewJob = () => {
    if (parentJob) {
        onViewJob(parentJob);
    }
  }

  return (
    <div className="container mx-auto px-4 lg:px-6 py-4">
      <div className="bg-slate-800/50 border border-amber-500/30 rounded-lg p-4 flex items-center gap-4 relative shadow-lg shadow-amber-900/10">
        <BellIcon className="h-8 w-8 text-amber-400 flex-shrink-0" />
        <div className="flex-grow cursor-pointer" onClick={handleViewJob}>
          <p className="text-slate-100 font-medium">{currentReminder.text}</p>
          <p className="text-xs text-slate-400 mt-1">
            For: <span className="font-semibold text-slate-300">{currentReminder.jobTitle}</span> at <span className="font-semibold text-slate-300">{currentReminder.jobCompany}</span>
          </p>
        </div>
        {reminders.length > 1 && (
          <div className="flex items-center gap-2">
            <button onClick={goToPrevious} className="p-1 rounded-full bg-slate-700/50 hover:bg-slate-600 transition-colors" aria-label="Previous reminder">
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button onClick={goToNext} className="p-1 rounded-full bg-slate-700/50 hover:bg-slate-600 transition-colors" aria-label="Next reminder">
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};