import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useSalaryLookup } from '../hooks/useSalary';
import { useAffordability } from '../hooks/useAffordability';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import SalaryResults from '../components/features/salary/SalaryResults';
import AffordabilityResults from '../components/features/affordability/AffordabilityResults';
import LocationSelector from '../components/features/affordability/LocationSelector';
import toast from 'react-hot-toast';
import type { SalaryRangeResult } from '../types/salary';

const SalaryResultsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { search, data: salaryData, loading: salaryLoading, error: salaryError } = useSalaryLookup();
  const { checkAffordability, data: affordabilityData, loading: affordabilityLoading } = useAffordability();
  
  const [showAffordability, setShowAffordability] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<SalaryRangeResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Get search params from URL
  const occupation = searchParams.get('occupation') || '';
  const education = searchParams.get('education') || '';
  const experience = searchParams.get('experience') || '';

  // Auto-search when page loads with params
  useEffect(() => {
    if (occupation && education && experience) {
      performSearch();
    }
  }, [occupation, education, experience]);

  const performSearch = async () => {
    if (!occupation || !education || !experience) return;
    
    try {
      await search({ occupation, education, experience });
      setHasSearched(true);
    } catch (err) {
      console.error('Search failed:', err);
      setHasSearched(true);
    }
  };

  const handleSearchAgain = () => {
    navigate('/salary');
  };

  const handleAffordabilityCheck = (salary: SalaryRangeResult) => {
    setSelectedSalary(salary);
    setShowAffordability(true);
    // Scroll to affordability section
    setTimeout(() => {
      document.getElementById('affordability-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const handleLocationSelect = async (location: string) => {
    if (!selectedSalary) return;
    
    try {
      await checkAffordability({
        occupation: selectedSalary.occupation,
        education: selectedSalary.education,
        experience: selectedSalary.experience,
        location,
      });
      toast.success('Affordability calculated!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to calculate affordability';
      toast.error(message);
    }
  };

  const errorMessage = salaryError instanceof Error 
    ? salaryError.message 
    : salaryError 
    ? String(salaryError) 
    : null;

  // Show loading state while searching
  if (salaryLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Searching salary data...</p>
          <p className="text-sm text-gray-400 mt-1">
            {occupation} • {education} • {experience}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Salary Results
              </h1>
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <span className="font-medium">{occupation}</span>
                <span>•</span>
                <span>{education}</span>
                <span>•</span>
                <span>{experience}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/salary">
                <Button variant="outline" size="sm">
                  ← New Search
                </Button>
              </Link>
              {salaryData?.data && salaryData.data.length > 0 && (
                <Link to="/affordability">
                  <Button variant="primary" size="sm">
                    🏠 Affordability Check
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Breadcrumb */}
          <nav className="flex text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-700">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/salary" className="hover:text-gray-700">Salary Lookup</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Results</span>
          </nav>
        </div>

        {/* Error State */}
        {errorMessage && (
          <div className="mb-6">
            <ErrorMessage
              message={errorMessage}
              onRetry={performSearch}
            />
          </div>
        )}

        {/* Results or Empty */}
        {hasSearched && (!salaryData?.data || salaryData.data.length === 0) && !errorMessage && (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find salary data for <strong>{occupation}</strong> with{' '}
              <strong>{education}</strong> and <strong>{experience}</strong> experience.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/salary">
                <Button variant="primary">Try Different Search</Button>
              </Link>
            </div>
          </Card>
        )}

        {salaryData?.data && salaryData.data.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Results Column */}
            <div className="lg:col-span-2 space-y-6">
              <SalaryResults
                salaries={salaryData.data}
                onCheckAffordability={handleAffordabilityCheck}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Salary Stats */}
              <Card>
                <h3 className="font-semibold text-gray-900 mb-3">Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Results Found</span>
                    <span className="font-bold text-blue-600">{salaryData.data.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Salary Range</span>
                    <span className="font-bold text-green-600">
                      {new Intl.NumberFormat('en-TZ', {
                        style: 'currency',
                        currency: 'TZS',
                        minimumFractionDigits: 0,
                      }).format(
                        salaryData.data.reduce((min, s) => Math.min(min, s.minSalary), Infinity)
                      )} - {new Intl.NumberFormat('en-TZ', {
                        style: 'currency',
                        currency: 'TZS',
                        minimumFractionDigits: 0,
                      }).format(
                        salaryData.data.reduce((max, s) => Math.max(max, s.maxSalary), 0)
                      )}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Affordability Check */}
              {showAffordability && selectedSalary && (
                <div id="affordability-section">
                  <Card>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      🏠 Affordability Check
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Checking for: <strong>{selectedSalary.occupation}</strong>
                    </p>
                    <LocationSelector
                      onLocationSelect={handleLocationSelect}
                      loading={affordabilityLoading}
                    />
                  </Card>

                  {affordabilityData && (
                    <div className="mt-4">
                      <AffordabilityResults
                        data={affordabilityData}
                        loading={affordabilityLoading}
                        onReset={() => setShowAffordability(false)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Related Occupations */}
              <Card>
                <h3 className="font-semibold text-gray-900 mb-3">Related Searches</h3>
                <div className="space-y-2">
                  {[
                    'Senior ' + occupation,
                    'Junior ' + occupation,
                    occupation + ' Manager',
                    'Lead ' + occupation,
                  ].filter(Boolean).map((related) => (
                    <button
                      key={related}
                      onClick={() => navigate(`/salary/results?occupation=${encodeURIComponent(related)}&education=${education}&experience=${experience}`)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                    >
                      {related}
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryResultsPage;