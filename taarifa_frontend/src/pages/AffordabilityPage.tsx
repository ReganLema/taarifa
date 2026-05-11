import { useState } from 'react';
import { useSalaryLookup } from '../hooks/useSalary';
import { useAffordability } from '../hooks/useAffordability';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import ErrorMessage from '../components/ui/ErrorMessage';
import Spinner from '../components/ui/Spinner';
import OccupationAutocomplete from '../components/features/salary/OccupationAutocomplete';
import AffordabilityResults from '../components/features/affordability/AffordabilityResults';
import LocationSelector from '../components/features/affordability/LocationSelector';
import toast from 'react-hot-toast';
import type { SalaryRangeResult } from '../types/salary';

const educationOptions = [
  { value: 'Certificate', label: 'Certificate' },
  { value: 'Diploma', label: 'Diploma' },
  { value: 'Bachelor', label: 'Bachelor' },
  { value: 'Master', label: 'Master' },
  { value: 'PhD', label: 'PhD' },
];

const experienceOptions = [
  { value: 'Entry Level', label: 'Entry Level' },
  { value: 'Mid Level', label: 'Mid Level' },
  { value: 'Senior Level', label: 'Senior Level' },
];

const AffordabilityPage = () => {
  const { search, data: salaryData, loading: salaryLoading, error: salaryError } = useSalaryLookup();
  const { checkAffordability, data: affordabilityData, loading: affordabilityLoading } = useAffordability();
  
  const [step, setStep] = useState<'search' | 'results' | 'affordability'>('search');
  const [formData, setFormData] = useState({
    occupation: '',
    education: '',
    experience: '',
  });
  const [selectedSalary, setSelectedSalary] = useState<SalaryRangeResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Convert error to string for ErrorMessage component
  const errorMessage = salaryError instanceof Error 
    ? salaryError.message 
    : salaryError 
    ? String(salaryError) 
    : null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.occupation.trim()) {
      newErrors.occupation = 'Please select an occupation';
    }
    if (!formData.education) {
      newErrors.education = 'Please select education level';
    }
    if (!formData.experience) {
      newErrors.experience = 'Please select experience level';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalarySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const result = await search(formData);
      
      if (result?.data?.salaryRange?.success && result.data.salaryRange.data?.length) {
        setSelectedSalary(result.data.salaryRange.data[0]);
        setStep('results');
        toast.success('Salary data found! Select a city to check affordability.');
      } else {
        toast.error(result?.data?.salaryRange?.message || 'No results found. Try a different combination.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to search salary data';
      toast.error(message);
    }
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
      setStep('affordability');
      toast.success('Affordability calculated!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to calculate affordability';
      toast.error(message);
    }
  };

  const handleReset = () => {
    setStep('search');
    setFormData({ occupation: '', education: '', experience: '' });
    setSelectedSalary(null);
    setErrors({});
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const steps = [
    { key: 'search', label: 'Salary Info', number: 1 },
    { key: 'results', label: 'Review & City', number: 2 },
    { key: 'affordability', label: 'Affordability', number: 3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-teal-100 rounded-full mb-4">
            <span className="text-3xl">🏠</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Affordability Calculator
          </h1>
          <p className="mt-2 text-gray-600 max-w-md mx-auto">
            Find out if you can afford living in different Tanzanian cities based on your salary
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((s, index) => (
              <div key={s.key} className="flex items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                    step === s.key
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110'
                      : steps.findIndex(st => st.key === step) > index
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {steps.findIndex(st => st.key === step) > index ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      s.number
                    )}
                  </div>
                  <span className="mt-2 text-xs font-medium text-gray-500 hidden sm:block">
                    {s.label}
                  </span>
                </div>
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`w-16 sm:w-24 h-1 mx-2 rounded-full ${
                    steps.findIndex(st => st.key === step) > index
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Salary Search */}
        {step === 'search' && (
          <Card>
            <h2 className="text-xl font-semibold mb-1">Enter Your Salary Details</h2>
            <p className="text-sm text-gray-500 mb-6">
              Fill in your occupation details to find your estimated salary range
            </p>
            
            <form onSubmit={handleSalarySearch} className="space-y-5">
              {/* Occupation Autocomplete */}
              <OccupationAutocomplete
                value={formData.occupation}
                onChange={(value) => {
                  setFormData({ ...formData, occupation: value });
                  if (errors.occupation) setErrors(prev => ({ ...prev, occupation: '' }));
                }}
                error={errors.occupation}
                label="Occupation"
                placeholder="Start typing to search occupations..."
                required
              />

              {/* Education Level */}
              <Select
                label="Education Level"
                options={educationOptions}
                value={formData.education}
                onChange={(e) => {
                  setFormData({ ...formData, education: e.target.value });
                  if (errors.education) setErrors(prev => ({ ...prev, education: '' }));
                }}
                placeholder="Select education level"
                error={errors.education}
                required
              />

              {/* Experience Level */}
              <Select
                label="Experience Level"
                options={experienceOptions}
                value={formData.experience}
                onChange={(e) => {
                  setFormData({ ...formData, experience: e.target.value });
                  if (errors.experience) setErrors(prev => ({ ...prev, experience: '' }));
                }}
                placeholder="Select experience level"
                error={errors.experience}
                required
              />

              <Button type="submit" loading={salaryLoading} fullWidth>
                🔍 Find My Salary
              </Button>

              {/* Quick Examples */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2">Try an example:</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { occ: 'Software Developer', edu: 'Bachelor', exp: 'Mid Level' },
                    { occ: 'Accountant', edu: 'Bachelor', exp: 'Entry Level' },
                    { occ: 'Teacher', edu: 'Bachelor', exp: 'Mid Level' },
                    { occ: 'Data Scientist', edu: 'Master', exp: 'Mid Level' },
                  ].map((example) => (
                    <button
                      key={example.occ}
                      type="button"
                      onClick={() => {
                        setFormData({
                          occupation: example.occ,
                          education: example.edu,
                          experience: example.exp,
                        });
                        setErrors({});
                      }}
                      className="p-2 text-xs bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-left"
                    >
                      <div className="font-medium">{example.occ}</div>
                      <div className="text-gray-400">{example.edu} • {example.exp}</div>
                    </button>
                  ))}
                </div>
              </div>
            </form>

            {errorMessage && (
              <div className="mt-4">
                <ErrorMessage message={errorMessage} />
              </div>
            )}
          </Card>
        )}

        {/* Step 2: Review Salary & Select Location */}
        {step === 'results' && selectedSalary && (
          <div className="space-y-6 animate-fadeIn">
            {/* Salary Details Card */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Your Estimated Salary</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Based on your profile, here's your salary range
                  </p>
                </div>
                <Button onClick={handleReset} variant="ghost" size="sm">
                  ← Start Over
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Occupation</p>
                  <p className="font-semibold text-gray-900">{selectedSalary.occupation}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Education</p>
                  <p className="font-semibold text-gray-900">{selectedSalary.education}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Experience</p>
                  <p className="font-semibold text-gray-900">{selectedSalary.experience}</p>
                </div>
              </div>

              {/* Salary Range Visual */}
              <div className="bg-gradient-to-r from-blue-50 via-white to-green-50 rounded-xl p-6 mb-6 border border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="text-center flex-1">
                    <p className="text-sm text-gray-500 mb-1">Minimum</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(selectedSalary.minSalary)}
                    </p>
                  </div>
                  <div className="text-center flex-1 border-l border-r border-gray-200 px-4">
                    <p className="text-sm text-gray-500 mb-1">Average</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency((selectedSalary.minSalary + selectedSalary.maxSalary) / 2)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">per month</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-sm text-gray-500 mb-1">Maximum</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(selectedSalary.maxSalary)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location Selector */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-lg font-semibold mb-1">🏙️ Check Affordability</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Select a city to see if you can afford living there with this salary
                </p>
                <LocationSelector
                  onLocationSelect={handleLocationSelect}
                  loading={affordabilityLoading}
                />
              </div>
            </Card>
          </div>
        )}

        {/* Step 3: Affordability Results */}
        {step === 'affordability' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Affordability Analysis</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedSalary?.occupation} • {selectedSalary?.education} • {selectedSalary?.experience}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setStep('results')} variant="ghost" size="sm">
                  ← Change City
                </Button>
                <Button onClick={handleReset} variant="ghost" size="sm">
                  New Search
                </Button>
              </div>
            </div>

            <AffordabilityResults
              data={affordabilityData}
              loading={affordabilityLoading}
              onReset={handleReset}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AffordabilityPage;