import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Spinner from '../../ui/Spinner';

interface ExpenseBreakdown {
  amount: number;
  percent: number;
}

interface AffordabilityData {
  success: boolean;
  message?: string;
  location?: string;
  salary?: {
    min: number;
    max: number;
    average: number;
  };
  expenses?: {
    rent: ExpenseBreakdown;
    food: ExpenseBreakdown;
    transport: ExpenseBreakdown;
    utility: ExpenseBreakdown;
    total: ExpenseBreakdown;
  };
  savings?: {
    amount: number;
    percent: number;
    disposableIncome: number;
    emergencyFund: number;
  };
  affordabilityRating?: string;
  summary?: string;
}

interface AffordabilityResultsProps {
  data: AffordabilityData | null;
  loading: boolean;
  onReset?: () => void;
}

const AffordabilityResults = ({ data, loading, onReset }: AffordabilityResultsProps) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ').format(amount);
  };

  // Loading State
  if (loading) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner size="lg" />
          <p className="text-gray-500 mt-4 font-medium">Calculating affordability...</p>
          <p className="text-gray-400 text-sm mt-1">Analyzing cost of living data</p>
        </div>
      </Card>
    );
  }

  // Error State
  if (!data || !data.success) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-5xl mb-4">😕</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to Calculate
          </h3>
          <p className="text-gray-500 mb-6">
            {data?.message || 'We could not calculate affordability for this location'}
          </p>
          {onReset && (
            <Button onClick={onReset} variant="outline">
              Try Another City
            </Button>
          )}
        </div>
      </Card>
    );
  }

  // Success State
  const { location, salary, expenses, savings, affordabilityRating, summary } = data;

  // Determine rating color and icon
  const getRatingDetails = (rating: string) => {
    const ratings = {
      Excellent: {
        color: 'text-green-700',
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: '🌟',
        description: 'You can live comfortably and save significantly',
      },
      Good: {
        color: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: '👍',
        description: 'You can maintain a good standard of living',
      },
      Moderate: {
        color: 'text-yellow-700',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: '💡',
        description: 'Budget wisely to maintain savings',
      },
      Tight: {
        color: 'text-orange-700',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: '⚠️',
        description: 'Expenses are high relative to income',
      },
      Critical: {
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: '🚨',
        description: 'Expenses exceed your income',
      },
    };

    return ratings[rating as keyof typeof ratings] || {
      color: 'text-gray-700',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: '📊',
      description: 'Affordability analysis',
    };
  };

  const ratingDetails = getRatingDetails(affordabilityRating || '');

  // Expense items for display
  const expenseItems = [
    { key: 'rent', label: 'Rent', icon: '🏠' },
    { key: 'food', label: 'Food', icon: '🍽️' },
    { key: 'transport', label: 'Transport', icon: '🚌' },
    { key: 'utility', label: 'Utilities', icon: '💡' },
  ];

  return (
    <div className="space-y-6">
      {/* Location Header */}
      <Card className="text-center">
        <div className="mb-2 text-4xl">📍</div>
        <h2 className="text-2xl font-bold text-gray-900">{location}</h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">{summary}</p>
      </Card>

      {/* Affordability Rating */}
      <Card className={`${ratingDetails.bg} ${ratingDetails.border} border-2`}>
        <div className="text-center">
          <div className="text-4xl mb-3">{ratingDetails.icon}</div>
          <div className={`text-lg font-bold ${ratingDetails.color} mb-1`}>
            {affordabilityRating} Affordability
          </div>
          <p className="text-sm text-gray-600">{ratingDetails.description}</p>
        </div>
      </Card>

      {/* Salary & Savings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl mb-2">💰</div>
            <p className="text-sm text-gray-600 mb-1">Average Monthly Salary</p>
            <p className="text-2xl font-bold text-blue-600">
              {salary ? formatCurrency(salary.average) : 'N/A'}
            </p>
            {salary && (
              <p className="text-xs text-gray-400 mt-1">
                Range: {formatCurrency(salary.min)} - {formatCurrency(salary.max)}
              </p>
            )}
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-2xl mb-2">🏦</div>
            <p className="text-sm text-gray-600 mb-1">Monthly Savings</p>
            <p className="text-2xl font-bold text-green-600">
              {savings ? formatCurrency(savings.amount) : 'N/A'}
            </p>
            {savings && (
              <p className="text-xs text-gray-400 mt-1">
                {savings.percent}% of salary
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Expense Breakdown */}
      {expenses && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Monthly Expense Breakdown
          </h3>
          
          <div className="space-y-4">
            {expenseItems.map(({ key, label, icon }) => {
              const expense = expenses[key as keyof typeof expenses];
              if (!expense || key === 'total') return null;
              
              const percentage = salary ? (expense.amount / salary.average) * 100 : 0;
              
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {icon} {label}
                    </span>
                    <span className="text-sm text-gray-600">
                      {formatCurrency(expense.amount)}
                      <span className="text-xs text-gray-400 ml-1">
                        ({expense.percent}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        percentage > 40 ? 'bg-red-500' :
                        percentage > 25 ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Total Expenses */}
            {expenses.total && (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-gray-900">Total Expenses</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(expenses.total.amount)}
                    <span className="text-xs text-gray-500 ml-1">
                      ({expenses.total.percent}%)
                    </span>
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      expenses.total.percent > 100 ? 'bg-red-500' :
                      expenses.total.percent > 80 ? 'bg-orange-500' :
                      expenses.total.percent > 60 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(expenses.total.percent, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Savings Distribution */}
      {savings && savings.amount > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💡 Recommended Savings Distribution
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
              <div>
                <p className="font-medium text-gray-900">Disposable Income</p>
                <p className="text-sm text-gray-600">For daily expenses & leisure</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600">{formatCurrency(savings.disposableIncome)}</p>
                <p className="text-xs text-gray-500">70% of savings</p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-green-50 rounded-lg p-3">
              <div>
                <p className="font-medium text-gray-900">Emergency Fund</p>
                <p className="text-sm text-gray-600">Save for unexpected events</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">{formatCurrency(savings.emergencyFund)}</p>
                <p className="text-xs text-gray-500">30% of savings</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onReset && (
          <Button
            onClick={onReset}
            variant="outline"
            fullWidth
          >
            🏙️ Check Another City
          </Button>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center">
        * These calculations are estimates based on average salary data and cost of living surveys.
        Actual expenses may vary based on lifestyle and specific location.
      </p>
    </div>
  );
};

export default AffordabilityResults;