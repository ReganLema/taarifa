import { useState, useEffect } from 'react';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import Spinner from '../../ui/Spinner';
import { apolloClient } from '../../../lib/apollo';
import { GET_ALL_LOCATIONS } from '../../../graphql/queries/locations';

interface Location {
  id: string;
  name: string;
}

interface LocationSelectorProps {
  onLocationSelect: (location: string) => void;
  loading: boolean;
  disabled?: boolean;
}

const LocationSelector = ({ onLocationSelect, loading, disabled = false }: LocationSelectorProps) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoadingLocations(true);
    setError(null);
    
    try {
      const result = await apolloClient.query<{ locations: Location[] }>({
        query: GET_ALL_LOCATIONS,
        fetchPolicy: 'network-only', // Use network-only to avoid cache issues
      });
      
      console.log('Locations result:', result); // Debug log
      
      if (result?.data?.locations && Array.isArray(result.data.locations)) {
        // Create a new array copy before setting state (fixes frozen array issue)
        const locationsCopy = [...result.data.locations];
        setLocations(locationsCopy);
      } else {
        setError('No locations available');
      }
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      setError('Failed to load locations. Check if backend is running.');
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLocation(value);
  };

  // Create a new sorted array instead of sorting in place
  const sortedLocations = [...locations].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  const locationOptions = sortedLocations.map(loc => ({
    value: loc.name,
    label: loc.name,
  }));

  // Group cities by region for better UX
  const popularCities = ['Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 'Zanzibar'];
  const popularOptions = locationOptions.filter(opt => popularCities.includes(opt.value));
  const otherOptions = locationOptions.filter(opt => !popularCities.includes(opt.value));

  // Build options array
  const selectOptions = [];
  if (popularOptions.length > 0) {
    selectOptions.push(
      { value: '', label: '--- Popular Cities ---', disabled: true },
      ...popularOptions
    );
  }
  if (otherOptions.length > 0) {
    selectOptions.push(
      { value: '', label: '--- Other Cities ---', disabled: true },
      ...otherOptions
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {loadingLocations ? (
        <div className="flex flex-col items-center justify-center py-6">
          <Spinner size="md" />
          <p className="text-gray-500 mt-2 text-sm">Loading cities...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            type="button"
            onClick={fetchLocations}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <Select
            label="Select City"
            options={selectOptions}
            value={selectedLocation}
            onChange={handleLocationChange}
            placeholder="Choose a city in Tanzania"
            disabled={disabled || loading}
          />

          <Button
            type="submit"
            loading={loading}
            disabled={!selectedLocation || disabled}
            fullWidth
          >
            {loading ? 'Calculating...' : 'Calculate Affordability'}
          </Button>

          {locations.length > 0 && (
            <p className="text-xs text-gray-400 text-center">
              {locations.length} cities available
            </p>
          )}
        </>
      )}
    </form>
  );
};

export default LocationSelector;