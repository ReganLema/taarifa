import { useState, useEffect } from 'react';
import Card from '../../ui/Card';  // Default import
import Select from '../../ui/Select';  // Default import
import Button from '../../ui/Button';  // Default import
import Spinner from '../../ui/Spinner';  // Default import
import { apolloClient } from '../../../lib/apollo';
import { GET_ALL_LOCATIONS } from '../../../graphql/queries/locations';

interface AffordabilityCalculatorProps {
  onLocationSelect: (location: string) => void;
  loading: boolean;
  data: any;
}

interface Location {
  id: string;
  name: string;
}

const AffordabilityCalculator = ({ onLocationSelect, loading, data }: AffordabilityCalculatorProps) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loadingLocations, setLoadingLocations] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const result = await apolloClient.query<{ locations: Location[] }>({
        query: GET_ALL_LOCATIONS,
        fetchPolicy: 'cache-first',
      });
      
      if (result.data?.locations) {
        setLocations(result.data.locations);
      }
    } catch (err) {
      console.error('Failed to fetch locations:', err);
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

  const locationOptions = locations.map(loc => ({
    value: loc.name,
    label: loc.name,
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-xl font-semibold mb-4">🏠 Affordability Check</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Select City"
            options={locationOptions}
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            placeholder={loadingLocations ? 'Loading locations...' : 'Choose a city'}
            disabled={loadingLocations}
          />
          
          <Button
            type="submit"
            loading={loading}
            disabled={!selectedLocation}
            fullWidth
          >
            Calculate Affordability
          </Button>
        </form>
      </Card>

      {loading && (
        <Card>
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
          <p className="text-center text-gray-500 mt-2">Calculating affordability...</p>
        </Card>
      )}

      {data && data.success && (
        <Card>
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">{data.location}</h3>
              <p className="text-sm text-gray-600 mt-1">{data.summary}</p>
            </div>

            {/* Affordability Rating */}
            <div className={`rounded-lg p-3 text-center ${
              data.affordabilityRating === 'Excellent' ? 'bg-green-100' :
              data.affordabilityRating === 'Good' ? 'bg-blue-100' :
              data.affordabilityRating === 'Moderate' ? 'bg-yellow-100' :
              'bg-orange-100'
            }`}>
              <p className="font-semibold">
                Affordability: <span className={`font-bold ${
                  data.affordabilityRating === 'Excellent' ? 'text-green-700' :
                  data.affordabilityRating === 'Good' ? 'text-blue-700' :
                  'text-orange-700'
                }`}>{data.affordabilityRating}</span>
              </p>
            </div>

            {/* Salary & Savings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-600">Avg Salary</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(data.salary?.average)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-600">Savings</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(data.savings?.amount)}
                </p>
              </div>
            </div>

            {/* Expense Breakdown */}
            {data.expenses && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Monthly Expenses</h4>
                {Object.entries(data.expenses).map(([key, value]: [string, any]) => {
                  if (key === 'total' || !value?.amount) return null;
                  return (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">{key}</span>
                      <span className="font-medium">
                        {formatCurrency(value.amount)}
                        <span className="text-gray-400 ml-1">({value.percent}%)</span>
                      </span>
                    </div>
                  );
                })}
                
                {data.expenses.total && (
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Expenses</span>
                    <span>{formatCurrency(data.expenses.total.amount)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {data && !data.success && (
        <Card>
          <div className="text-center py-4">
            <p className="text-red-600">{data.message || 'Failed to calculate affordability'}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AffordabilityCalculator;