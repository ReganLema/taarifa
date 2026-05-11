import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Error Code */}
        <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
        
        {/* Icon */}
        <div className="text-6xl mb-8">🔍</div>
        
        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Suggestions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Here are some helpful links:
          </h2>
          <div className="space-y-3">
            <Link
              to="/"
              className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
            >
              <span className="font-medium text-blue-700">🏠 Home</span>
              <p className="text-sm text-blue-600 mt-1">Return to the homepage</p>
            </Link>
            <Link
              to="/salary"
              className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
            >
              <span className="font-medium text-green-700">💰 Salary Lookup</span>
              <p className="text-sm text-green-600 mt-1">Search for salary information</p>
            </Link>
            <Link
              to="/affordability"
              className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
            >
              <span className="font-medium text-purple-700">🏠 Affordability Check</span>
              <p className="text-sm text-purple-600 mt-1">Calculate living costs</p>
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary">
              Go to Homepage
            </Button>
          </Link>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
          >
            ← Go Back
          </Button>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-gray-500">
          If you believe this is an error, please{' '}
          <a href="/contact" className="text-blue-600 hover:text-blue-500">
            contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;