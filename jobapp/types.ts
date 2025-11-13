export enum JobStatus {
  WISHLIST = 'Wishlist',
  APPLYING = 'Applying',
  INTERVIEWING = 'Interviewing',
  OFFER = 'Offer',
  REJECTED = 'Rejected',
  ARCHIVED = 'Archived',
}

export interface Update {
  id: string;
  text: string;
  isReminder: boolean;
  createdAt: string; // ISO string
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  status: JobStatus;
  deadline?: string;
  url?: string;
  starting?: string;
  source?: string;
  description?: string;
  updates?: Update[];
}

export interface ImportJobPreview {
  jobData: Job;
  status: 'new' | 'duplicate' | 'invalid';
  existingJob?: Job;
  error?: string;
}

export interface FileImportPreview {
  fileName: string;
  jobPreviews: ImportJobPreview[];
}