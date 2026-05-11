import { useState } from 'react';
import OccupationAutocomplete from './OccupationAutocomplete';
import Button from '../../ui/Button';
import Select from '../../ui/Select';

interface SalaryFormData {
  occupation: string;
  education: string;
  experience: string;
}

interface SalaryFormProps {
  onSubmit: (data: SalaryFormData) => void;
  loading: boolean;
  initialValues?: Partial<SalaryFormData>;
}

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

const SalaryForm = ({ onSubmit, loading, initialValues }: SalaryFormProps) => {
  const [formData, setFormData] = useState<SalaryFormData>({
    occupation: initialValues?.occupation || '',
    education: initialValues?.education || '',
    experience: initialValues?.experience || '',
  });

  const [errors, setErrors] = useState<Partial<SalaryFormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<SalaryFormData> = {};
    
    if (!formData.occupation.trim()) {
      newErrors.occupation = 'Occupation is required';
    }
    if (!formData.education) {
      newErrors.education = 'Education level is required';
    }
    if (!formData.experience) {
      newErrors.experience = 'Experience level is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleOccupationChange = (value: string) => {
    setFormData(prev => ({ ...prev, occupation: value }));
    if (errors.occupation) {
      setErrors(prev => ({ ...prev, occupation: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Occupation Autocomplete */}
      <OccupationAutocomplete
        value={formData.occupation}
        onChange={handleOccupationChange}
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
          setFormData(prev => ({ ...prev, education: e.target.value }));
          if (errors.education) setErrors(prev => ({ ...prev, education: undefined }));
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
          setFormData(prev => ({ ...prev, experience: e.target.value }));
          if (errors.experience) setErrors(prev => ({ ...prev, experience: undefined }));
        }}
        placeholder="Select experience level"
        error={errors.experience}
        required
      />

      {/* Submit Button */}
      <Button
        type="submit"
        loading={loading}
        disabled={loading}
        fullWidth
      >
        {loading ? 'Searching...' : '🔍 Look Up Salary'}
      </Button>

      {/* Popular Searches */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-2">Popular searches:</p>
        <div className="flex flex-wrap gap-2">
          {[
            'Software Developer',
            'Accountant',
            'Teacher',
            'Nurse',
            'Data Scientist',
          ].map((job) => (
            <button
              key={job}
              type="button"
              onClick={() => handleOccupationChange(job)}
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors"
            >
              {job}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
};

export default SalaryForm;