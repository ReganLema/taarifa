import { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import type { SalaryRangeResult } from '../../../types/salary';

interface SalaryCardProps {
  salary: SalaryRangeResult;
  onCheckAffordability?: (salary: SalaryRangeResult) => void;
  isSelected?: boolean;
  showDetails?: boolean;
}

const SalaryCard = ({ 
  salary, 
  onCheckAffordability, 
  isSelected = false,
  showDetails = true 
}: SalaryCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const averageSalary = (salary.minSalary + salary.maxSalary) / 2;
  const range = salary.maxSalary - salary.minSalary;
  const rangePercent = ((range / salary.minSalary) * 100).toFixed(0);

  // Education level icons
  const getEducationIcon = (level: string): string => {
    const icons: Record<string, string> = {
      'Certificate': '📜',
      'Diploma': '📋',
      'Bachelor': '🎓',
      'Master': '🎓',
      'PhD': '🎓',
    };
    return icons[level] || '📚';
  };

  // Experience level colors
  const getExperienceColor = (level: string): string => {
    const colors: Record<string, string> = {
      'Entry Level': 'bg-green-100 text-green-800',
      'Mid Level': 'bg-blue-100 text-blue-800',
      'Senior Level': 'bg-purple-100 text-purple-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card 
      className={`transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02]' 
          : 'hover:shadow-lg hover:scale-[1.01]'
      }`}
      padding="md"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {salary.occupation}
            </h3>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {/* Education Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {getEducationIcon(salary.education)}
                {salary.education}
              </span>
              
              {/* Experience Badge */}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExperienceColor(salary.experience)}`}>
                💼 {salary.experience}
              </span>
            </div>
          </div>

          {/* Expand Button */}
          {showDetails && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={expanded ? 'Show less' : 'Show more'}
            >
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  expanded ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Salary Range Visualization */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Min</span>
            <span className="text-gray-500">Max</span>
          </div>
          
          <div className="relative pt-1">
            <div className="flex h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="flex flex-col justify-center bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-500"
                style={{ width: '100%' }}
              />
            </div>
            
            <div className="flex justify-between mt-1">
              <span className="text-sm font-semibold text-blue-600">
                {formatCurrency(salary.minSalary)}
              </span>
              <span className="text-sm font-semibold text-green-600">
                {formatCurrency(salary.maxSalary)}
              </span>
            </div>
          </div>
          
          {/* Average Salary */}
          <div className="text-center py-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Average Salary</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(averageSalary)}
            </p>
            <p className="text-xs text-gray-400">
              Range: ±{rangePercent}%
            </p>
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="space-y-3 pt-2 border-t border-gray-100 animate-fadeIn">
            {/* Salary Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-blue-50 rounded-lg p-2">
                <p className="text-xs text-gray-600">Monthly Min</p>
                <p className="text-sm font-bold text-blue-600">
                  {formatCurrency(salary.minSalary)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-600">Monthly Avg</p>
                <p className="text-sm font-bold text-gray-900">
                  {formatCurrency(averageSalary)}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-2">
                <p className="text-xs text-gray-600">Monthly Max</p>
                <p className="text-sm font-bold text-green-600">
                  {formatCurrency(salary.maxSalary)}
                </p>
              </div>
            </div>

            {/* Annual Salary */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Annual Salary Range</p>
                  <p className="text-xs text-gray-400">(12 months)</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-indigo-600">
                    {formatCurrency(salary.minSalary * 12)}
                  </p>
                  <p className="text-xs text-gray-500">to</p>
                  <p className="text-sm font-bold text-purple-600">
                    {formatCurrency(salary.maxSalary * 12)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-yellow-50 rounded p-2">
                <p className="text-xs text-gray-600">Daily Rate (Min)</p>
                <p className="text-sm font-semibold text-yellow-700">
                  {formatCurrency(salary.minSalary / 22)}
                </p>
              </div>
              <div className="bg-green-50 rounded p-2">
                <p className="text-xs text-gray-600">Hourly Rate (Min)</p>
                <p className="text-sm font-semibold text-green-700">
                  {formatCurrency(salary.minSalary / 176)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {onCheckAffordability && (
          <Button
            onClick={() => onCheckAffordability(salary)}
            variant={isSelected ? 'primary' : 'outline'}
            fullWidth
            className="mt-2"
          >
            {isSelected ? '✓ Selected' : '🏠 Check Affordability'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SalaryCard;