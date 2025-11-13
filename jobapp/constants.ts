
import { JobStatus } from './types';

interface ColumnConfig {
  id: JobStatus;
  title: string;
  color: string;
}

export const COLUMNS: ColumnConfig[] = [
  { id: JobStatus.WISHLIST, title: 'Wishlist', color: 'bg-gray-500/10 border-gray-500/50' },
  { id: JobStatus.APPLYING, title: 'Applying', color: 'bg-blue-500/10 border-blue-500/50' },
  { id: JobStatus.INTERVIEWING, title: 'Interviewing', color: 'bg-yellow-500/10 border-yellow-500/50' },
  { id: JobStatus.OFFER, title: 'Offer', color: 'bg-green-500/10 border-green-500/50' },
  { id: JobStatus.REJECTED, title: 'Rejected', color: 'bg-red-500/10 border-red-500/50' },
  { id: JobStatus.ARCHIVED, title: 'Archived', color: 'bg-indigo-500/10 border-indigo-500/50' },
];