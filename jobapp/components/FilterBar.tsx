import React, { useMemo } from 'react';
import { Job, JobStatus } from '../types';
import { SearchIcon } from './icons/SearchIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStatus: JobStatus | 'All';
  setSelectedStatus: (status: JobStatus | 'All') => void;
  selectedCompany: string;
  setSelectedCompany: (company: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  allJobs: Job[];
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedCompany,
  setSelectedCompany,
  selectedLocation,
  setSelectedLocation,
  allJobs,
  onClearFilters,
}) => {
  const uniqueCompanies = useMemo(() => {
    const companies = new Set(allJobs.map(job => job.company).filter(Boolean));
    return Array.from(companies).sort();
  }, [allJobs]);

  const uniqueLocations = useMemo(() => {
    const locations = new Set(allJobs.map(job => job.location).filter(Boolean));
    return Array.from(locations).sort();
  }, [allJobs]);
  
  const hasActiveFilters = searchTerm || selectedStatus !== 'All' || selectedCompany !== 'All' || selectedLocation !== 'All';

  return (
    <div className="container mx-auto px-4 lg:px-6 py-4 border-b border-slate-700/50">
      <div className="flex flex-wrap items-end gap-4">
        {/* Search Input */}
        <div className="relative flex-grow min-w-0" style={{ minWidth: '200px' }}>
          <label htmlFor="search" className="block text-sm font-medium text-slate-400 mb-1">Search</label>
          <SearchIcon className="absolute left-3 top-9 h-5 w-5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            id="search"
            placeholder="Title, company, etc."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex-grow min-w-0" style={{ minWidth: '150px' }}>
          <label htmlFor="status-filter" className="block text-sm font-medium text-slate-400 mb-1">Status</label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as JobStatus | 'All')}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
          >
            <option value="All">All Active</option>
            {Object.values(JobStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Company Filter */}
        <div className="flex-grow min-w-0" style={{ minWidth: '150px' }}>
          <label htmlFor="company-filter" className="block text-sm font-medium text-slate-400 mb-1">Company</label>
          <select
            id="company-filter"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            disabled={uniqueCompanies.length === 0}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none disabled:opacity-50"
          >
            <option value="All">All Companies</option>
            {uniqueCompanies.map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="flex-grow min-w-0" style={{ minWidth: '150px' }}>
          <label htmlFor="location-filter" className="block text-sm font-medium text-slate-400 mb-1">Location</label>
          <select
            id="location-filter"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            disabled={uniqueLocations.length === 0}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none disabled:opacity-50"
          >
            <option value="All">All Locations</option>
            {uniqueLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-4">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white rounded-lg transition-colors h-[42px]"
              aria-label="Clear filters"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};