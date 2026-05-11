import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

interface DashboardStat {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: string;
}

interface RecentSearch {
  id: string;
  occupation: string;
  education: string;
  experience: string;
  date: string;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Simulate API call
    setTimeout(() => {
      setStats([
        { label: 'Total Searches', value: 156, change: '+12%', trend: 'up', icon: '🔍' },
        { label: 'Saved Salaries', value: 23, change: '+5%', trend: 'up', icon: '⭐' },
        { label: 'Cities Compared', value: 8, change: '+2', trend: 'up', icon: '🏙️' },
        { label: 'Profile Views', value: 342, change: '-3%', trend: 'down', icon: '👁️' },
      ]);

      setRecentSearches([
        { id: '1', occupation: 'Software Developer', education: 'Bachelor', experience: 'Mid Level', date: '2024-01-15' },
        { id: '2', occupation: 'Accountant', education: 'Master', experience: 'Senior Level', date: '2024-01-14' },
        { id: '3', occupation: 'Teacher', education: 'Bachelor', experience: 'Entry Level', date: '2024-01-12' },
      ]);

      setLoading(false);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-TZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back! 👋</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your account.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} padding="md" className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                {stat.change && (
                  <p className={`text-xs mt-1 ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? '↑' : '↓'} {stat.change} from last month
                  </p>
                )}
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/salary" className="block">
          <Card padding="md" hover className="h-full">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                💰
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Search Salaries</h3>
                <p className="text-sm text-gray-600">Find salary ranges for any occupation</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/affordability" className="block">
          <Card padding="md" hover className="h-full">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                🏠
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Check Affordability</h3>
                <p className="text-sm text-gray-600">Calculate living costs in different cities</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Searches */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Searches</h2>
          <Link to="/dashboard/my-searches" className="text-sm text-blue-600 hover:text-blue-700">
            View all
          </Link>
        </div>

        {recentSearches.length > 0 ? (
          <div className="space-y-3">
            {recentSearches.map((search) => (
              <div
                key={search.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{search.occupation}</p>
                  <p className="text-sm text-gray-500">
                    {search.education} • {search.experience}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{formatDate(search.date)}</p>
                  <button className="text-xs text-blue-600 hover:text-blue-700 mt-1">
                    View Results
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent searches</p>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;