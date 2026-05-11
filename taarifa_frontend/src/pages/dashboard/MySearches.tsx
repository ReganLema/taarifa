import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';

interface SavedSearch {
  id: string;
  name: string;
  occupation: string;
  education: string;
  experience: string;
  date: string;
  results: number;
}

const MySearches = () => {
  const [searches, setSearches] = useState<SavedSearch[]>([
    {
      id: '1',
      name: 'Software Developer Mid',
      occupation: 'Software Developer',
      education: 'Bachelor',
      experience: 'Mid Level',
      date: '2024-01-15',
      results: 3,
    },
    {
      id: '2',
      name: 'Senior Accountant',
      occupation: 'Accountant',
      education: 'Master',
      experience: 'Senior Level',
      date: '2024-01-14',
      results: 2,
    },
    {
      id: '3',
      name: 'Teacher Entry',
      occupation: 'Secondary School Teacher',
      education: 'Bachelor',
      experience: 'Entry Level',
      date: '2024-01-12',
      results: 5,
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id: string) => {
    setSearches(prev => prev.filter(s => s.id !== id));
    toast.success('Search deleted');
  };

  const handleClearAll = () => {
    setSearches([]);
    toast.success('All searches cleared');
  };

  const filteredSearches = searches.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.occupation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-TZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Searches</h1>
          <p className="text-gray-600 mt-1">View and manage your saved salary searches</p>
        </div>
        {searches.length > 0 && (
          <Button onClick={handleClearAll} variant="danger" size="sm">
            Clear All
          </Button>
        )}
      </div>

      {/* Search Filter */}
      {searches.length > 0 && (
        <Card padding="sm">
          <Input
            placeholder="Search your saved searches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </Card>
      )}

      {/* Searches List */}
      {filteredSearches.length > 0 ? (
        <div className="space-y-4">
          {filteredSearches.map((search) => (
            <Card key={search.id} padding="md" className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{search.name}</h3>
                  
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Occupation:</span>
                      <span className="ml-1 font-medium">{search.occupation}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Education:</span>
                      <span className="ml-1 font-medium">{search.education}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Experience:</span>
                      <span className="ml-1 font-medium">{search.experience}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Results:</span>
                      <span className="ml-1 font-medium text-blue-600">{search.results}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Saved:</span>
                      <span className="ml-1 font-medium">{formatDate(search.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Link
                    to={`/salary?occupation=${encodeURIComponent(search.occupation)}&education=${encodeURIComponent(search.education)}&experience=${encodeURIComponent(search.experience)}`}
                  >
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(search.id)}
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No saved searches"
          description={searchTerm ? "No searches match your filter" : "Start searching salaries to save them here"}
          icon="🔍"
          action={
            searchTerm
              ? {
                  label: 'Clear Filter',
                  onClick: () => setSearchTerm(''),
                }
              : {
                  label: 'Search Salaries',
                  onClick: () => window.location.href = '/salary',
                }
          }
        />
      )}
    </div>
  );
};

export default MySearches;