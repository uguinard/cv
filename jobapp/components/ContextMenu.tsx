import React, { useState, useRef, useLayoutEffect } from 'react';
import { type Job, JobStatus } from '../types';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ArchiveIcon } from './icons/ArchiveIcon';
import { UnarchiveIcon } from './icons/UnarchiveIcon';
import { SwitchIcon } from './icons/SwitchIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface ContextMenuProps {
  x: number;
  y: number;
  job: Job;
  onClose: () => void;
  onEdit: (job: Job) => void;
  onDeleteRequest: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onChangeStatus: (id: string, newStatus: JobStatus) => void;
  isSingleColumnView: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, job, onClose, onEdit, onDeleteRequest, onArchive, onUnarchive, onChangeStatus }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({ opacity: 0, top: y, left: x });
  const [statusMenuClass, setStatusMenuClass] = useState('left-full -top-2 ml-1');

  useLayoutEffect(() => {
    if (menuRef.current) {
      const menu = menuRef.current;
      const { innerWidth, innerHeight } = window;
      const menuRect = menu.getBoundingClientRect();

      let newY = y;
      let newX = x;

      // Adjust vertically if it overflows the bottom of the screen
      if (y + menuRect.height > innerHeight) {
        newY = y - menuRect.height;
      }

      // Adjust horizontally if it overflows the right of the screen
      if (x + menuRect.width > innerWidth) {
        newX = x - menuRect.width;
      }
      
      // Prevent menu from going off the top or left of the screen after adjustment
      if (newY < 0) newY = 5;
      if (newX < 0) newX = 5;

      // Determine submenu position
      const subMenuWidth = 192; // w-48 is 12rem = 192px
      if (newX + menuRect.width + subMenuWidth > innerWidth) {
        // Not enough space on the right, so open to the left
        setStatusMenuClass('right-full -top-2 mr-1');
      } else {
        // Default to opening on the right
        setStatusMenuClass('left-full -top-2 ml-1');
      }

      setMenuStyle({
        top: `${newY}px`,
        left: `${newX}px`,
        opacity: 1,
        transition: 'opacity 0.05s ease-in-out',
      });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [x, y, onClose]);

  const handleDeleteClick = () => {
    onDeleteRequest(job.id);
    onClose();
  };

  const handleEditClick = () => {
    onEdit(job);
    onClose();
  };
  
  const handleArchiveClick = () => {
    onArchive(job.id);
    onClose();
  }
  
  const handleUnarchiveClick = () => {
    onUnarchive(job.id);
    onClose();
  }

  const handleChangeStatus = (newStatus: JobStatus) => {
    onChangeStatus(job.id, newStatus);
    onClose();
  };
  
  return (
    <div
      ref={menuRef}
      style={menuStyle}
      className="fixed z-50 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl w-48 py-2"
    >
      <ul className="text-slate-200">
        <li>
          <button
            onClick={handleEditClick}
            className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-3 transition-colors"
          >
            <EditIcon className="h-5 w-5" />
            <span>Edit</span>
          </button>
        </li>
        
        <li onMouseEnter={() => setShowStatusMenu(true)} onMouseLeave={() => setShowStatusMenu(false)} className="relative">
          <button
            className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center justify-between gap-3 transition-colors"
          >
            <div className="flex items-center gap-3">
              <SwitchIcon className="h-5 w-5" />
              <span>Change Status</span>
            </div>
            <ChevronRightIcon className="h-4 w-4" />
          </button>
          {showStatusMenu && (
            <div className={`absolute bg-slate-800 border border-slate-600 rounded-lg shadow-2xl w-48 py-2 ${statusMenuClass}`}>
              <ul>
                {Object.values(JobStatus)
                  .filter(status => status !== job.status)
                  .map(status => (
                    <li key={status}>
                      <button
                        onClick={() => handleChangeStatus(status)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors"
                      >
                        {status}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </li>

        <div className="my-1 h-[1px] bg-slate-600/50"></div>

        {job.status === JobStatus.ARCHIVED ? (
          <li>
            <button
              onClick={handleUnarchiveClick}
              className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-3 transition-colors"
            >
              <UnarchiveIcon className="h-5 w-5" />
              <span>Unarchive</span>
            </button>
          </li>
        ) : (
          <li>
            <button
              onClick={handleArchiveClick}
              className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-3 transition-colors"
            >
              <ArchiveIcon className="h-5 w-5" />
              <span>Archive</span>
            </button>
          </li>
        )}
        <li>
          <button
            onClick={handleDeleteClick}
            className="w-full text-left px-4 py-2 hover:bg-slate-700 flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors"
          >
            <TrashIcon className="h-5 w-5" />
            <span>Delete</span>
          </button>
        </li>
      </ul>
    </div>
  );
};