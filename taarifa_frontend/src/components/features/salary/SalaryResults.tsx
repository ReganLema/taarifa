import { useState, useMemo } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import EmptyState from '../../ui/EmptyState';
import SalaryCard from './SalaryCard';
import type { SalaryRangeResult } from '../../../types/salary';

interface SalaryResultsProps {
  salaries: SalaryRangeResult[];
  onCheckAffordability: (salary: SalaryRangeResult) => void;
  loading?: boolean;
}

type SortOption = 'occupation' | 'minSalary' | 'maxSalary' | 'experience';
type SortDirection = 'asc' | 'desc';

const SalaryResults = ({ 
  salaries, 
  onCheckAffordability, 
  loading = false 
}: SalaryResultsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('occupation');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedSalary, setSelectedSalary] = useState<SalaryRangeResult | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterExperience, setFilterExperience] = useState<string>('all');
  const [filterEducation, setFilterEducation] = useState<string>('all');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get unique values for filters
  const experienceLevels = useMemo(() => 
    [...new Set(salaries.map(s => s.experience))].sort(),
    [salaries]
  );

  const educationLevels = useMemo(() => 
    [...new Set(salaries.map(s => s.education))].sort(),
    [salaries]
  );

  // Filter and sort salaries
  const filteredSalaries = useMemo(() => {
    let filtered = [...salaries];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        s => 
          s.occupation.toLowerCase().includes(term) ||
          s.education.toLowerCase().includes(term) ||
          s.experience.toLowerCase().includes(term)
      );
    }

    // Experience filter
    if (filterExperience !== 'all') {
      filtered = filtered.filter(s => s.experience === filterExperience);
    }

    // Education filter
    if (filterEducation !== 'all') {
      filtered = filtered.filter(s => s.education === filterEducation);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'occupation':
          comparison = a.occupation.localeCompare(b.occupation);
          break;
        case 'minSalary':
          comparison = a.minSalary - b.minSalary;
          break;
        case 'maxSalary':
          comparison = a.maxSalary - b.maxSalary;
          break;
        case 'experience':
          comparison = a.experience.localeCompare(b.experience);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [salaries, searchTerm, sortBy, sortDirection, filterExperience, filterEducation]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    if (filteredSalaries.length === 0) return null;

    const avgMin = filteredSalaries.reduce((sum, s) => sum + s.minSalary, 0) / filteredSalaries.length;
    const avgMax = filteredSalaries.reduce((sum, s) => sum + s.maxSalary, 0) / filteredSalaries.length;

    return {
      count: filteredSalaries.length,
      totalCount: salaries.length,
      avgMin,
      avgMax,
    };
  }, [filteredSalaries, salaries]);

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };

  const handleSelectSalary = (salary: SalaryRangeResult) => {
    setSelectedSalary(prev => 
      prev?.occupation === salary.occupation && 
      prev?.education === salary.education && 
      prev?.experience === salary.experience
        ? null 
        : salary
    );
  };

  const sortOptions = [
    { value: 'occupation', label: 'Occupation' },
    { value: 'minSalary', label: 'Minimum Salary' },
    { value: 'maxSalary', label: 'Maximum Salary' },
    { value: 'experience', label: 'Experience Level' },
  ];

  const experienceFilterOptions = [
    { value: 'all', label: 'All Experience Levels' },
    ...experienceLevels.map(level => ({ value: level, label: level })),
  ];

  const educationFilterOptions = [
    { value: 'all', label: 'All Education Levels' },
    ...educationLevels.map(level => ({ value: level, label: level })),
  ];

  return (
    <div className="space-y-4">
      {/* Header & Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Salary Results
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {salaries.length} salary {salaries.length === 1 ? 'match' : 'matches'} found
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode('grid')}
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
          >
            📱 Grid
          </Button>
          <Button
            onClick={() => setViewMode('list')}
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
          >
            📋 List
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card padding="sm">
        <div className="space-y-3">
          {/* Search Bar */}
          <Input
            placeholder="Search occupations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              options={experienceFilterOptions}
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value)}
              placeholder="Experience"
            />
            
            <Select
              options={educationFilterOptions}
              value={filterEducation}
              onChange={(e) => setFilterEducation(e.target.value)}
              placeholder="Education"
            />

            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e) => handleSort(e.target.value as SortOption)}
              placeholder="Sort by"
            />
          </div>

          {/* Sort Direction */}
          <div className="flex justify-end">
            <Button
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              variant="ghost"
              size="sm"
            >
              {sortDirection === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Statistics Summary */}
      {stats && filteredSalaries.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600">Results</p>
            <p className="text-lg font-bold text-blue-600">{stats.count}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600">Avg Min</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(stats.avgMin)}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600">Avg Max</p>
            <p className="text-lg font-bold text-purple-600">{formatCurrency(stats.avgMax)}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600">Selected</p>
            <p className="text-lg font-bold text-yellow-600">{selectedSalary ? '1' : '0'}</p>
          </div>
        </div>
      )}

      {/* Results Grid/List */}
      {filteredSalaries.length > 0 ? (
        <>
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
              : 'space-y-4'
          }>
            {filteredSalaries.map((salary, index) => (
              <SalaryCard
                key={`${salary.occupation}-${salary.education}-${salary.experience}-${index}`}
                salary={salary}
                onCheckAffordability={onCheckAffordability}
                isSelected={
                  selectedSalary?.occupation === salary.occupation &&
                  selectedSalary?.education === salary.education &&
                  selectedSalary?.experience === salary.experience
                }
              />
            ))}
          </div>

          {/* Bulk Action */}
          {selectedSalary && (
            <div className="sticky bottom-4 bg-white shadow-lg rounded-lg p-4 border-2 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{selectedSalary.occupation}</p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(selectedSalary.minSalary)} - {formatCurrency(selectedSalary.maxSalary)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedSalary(null)}
                    variant="ghost"
                    size="sm"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={() => onCheckAffordability(selectedSalary)}
                    variant="primary"
                    size="sm"
                  >
                    Check Affordability
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No results found"
          description={
            searchTerm || filterExperience !== 'all' || filterEducation !== 'all'
              ? "Try adjusting your search or filters"
              : "No salary data available for the selected criteria"
          }
          action={
            (searchTerm || filterExperience !== 'all' || filterEducation !== 'all')
              ? {
                  label: 'Clear Filters',
                  onClick: () => {
                    setSearchTerm('');
                    setFilterExperience('all');
                    setFilterEducation('all');
                  },
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default SalaryResults;