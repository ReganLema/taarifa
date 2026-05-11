import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSalaryLookup } from '../hooks/useSalary';
import Card from '../components/ui/Card';
import ErrorMessage from '../components/ui/ErrorMessage';
import SalaryForm from '../components/features/salary/SalaryForm';
import toast from 'react-hot-toast';

const SalaryPage = () => {
  const navigate = useNavigate();
  const { search, loading: salaryLoading, error: salaryError } = useSalaryLookup();
  const [formValues, setFormValues] = useState<{
    occupation: string;
    education: string;
    experience: string;
  } | null>(null);

  const handleSalarySearch = async (values: { 
    occupation: string; 
    education: string; 
    experience: string;
  }) => {
    try {
      const result = await search(values);
      
      if (result?.data?.salaryRange?.success && result.data.salaryRange.data?.length) {
        const count = result.data.salaryRange.data.length;
        toast.success(`Found ${count} salary match${count !== 1 ? 'es' : ''}`);
        
        // Navigate to results page with search params
        const params = new URLSearchParams({
          occupation: values.occupation,
          education: values.education,
          experience: values.experience,
        });
        navigate(`/salary/results?${params.toString()}`);
      } else {
        toast.error(result?.data?.salaryRange?.message || 'No results found');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to search salary data';
      toast.error(message);
    }
  };

  const handleRetry = () => {
    if (formValues) {
      handleSalarySearch(formValues);
    }
  };

  const errorMessage = salaryError instanceof Error 
    ? salaryError.message 
    : salaryError 
    ? String(salaryError) 
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <span className="text-3xl">💰</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Salary Lookup
          </h1>
          <p className="mt-2 text-gray-600 max-w-md mx-auto">
            Find salary ranges for any occupation in Tanzania. 
            Compare across education levels and experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="md:col-span-2">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Search Salary Data</h2>
              <SalaryForm 
                onSubmit={handleSalarySearch} 
                loading={salaryLoading}
              />
            </Card>

            {errorMessage && (
              <div className="mt-4">
                <ErrorMessage
                  message={errorMessage}
                  onRetry={handleRetry}
                />
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4">
            {/* Quick Stats */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Occupations</span>
                  <span className="font-medium text-blue-600">200+</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Cities</span>
                  <span className="font-medium text-green-600">22</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Education Levels</span>
                  <span className="font-medium text-purple-600">5</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Experience Levels</span>
                  <span className="font-medium text-orange-600">3</span>
                </div>
              </div>
            </Card>

            {/* Popular Searches */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Popular Searches</h3>
              <div className="space-y-2">
                {[
                  'Software Developer',
                  'Accountant', 
                  'Teacher',
                  'Nurse',
                  'Engineer',
                ].map((job) => (
                  <button
                    key={job}
                    onClick={() => handleSalarySearch({
                      occupation: job,
                      education: 'Bachelor',
                      experience: 'Mid Level',
                    })}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                  >
                    {job}
                  </button>
                ))}
              </div>
            </Card>

            {/* Tips */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Be specific with occupation names for better results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Try different education/experience combinations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Check affordability after viewing salary results</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryPage;