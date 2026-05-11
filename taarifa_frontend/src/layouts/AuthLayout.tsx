import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSystemPreferences } from '../hooks/useMediaQuery';

interface AuthLayoutProps {
  title?: string;
  subtitle?: string;
  showToggle?: boolean;
}

const AuthLayout = ({ 
  title = 'Welcome Back', 
  subtitle = 'Sign in to your account to continue',
  showToggle = true 
}: AuthLayoutProps) => {
  const location = useLocation();
  const { prefersDarkMode } = useSystemPreferences();
  const [currentYear] = useState(new Date().getFullYear());

  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 011-1h3a1 1 0 011 1v1a1 1 0 001-1V4zm0 0v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6a2 2 0 00-2 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Taarifa</span>
              <span className="text-xs text-gray-500 block -mt-1">Salary Guide</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center space-x-4">
            <Link
              to="/about"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
            <Link
              to="/help"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Help
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Branding for mobile */}
          <div className="sm:hidden text-center mb-8">
            <div className="inline-flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 011-1h3a1 1 0 011 1v1a1 1 0 001-1V4zm0 0v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6a2 2 0 00-2 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">Taarifa</span>
                <span className="text-xs text-gray-500 block -mt-1">Salary Guide</span>
              </div>
            </div>
          </div>

          {/* Auth Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
              <p className="text-gray-600 text-sm">
                {subtitle}
              </p>
            </div>

            {/* Auth Form */}
            <Outlet />

            {/* Toggle between Login/Register */}
            {showToggle && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {isLoginPage ? (
                    <>
                      Don't have an account?{' '}
                      <Link
                        to="/register"
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                      >
                        Sign up
                      </Link>
                    </>
                  ) : isRegisterPage ? (
                    <>
                      Already have an account?{' '}
                      <Link
                        to="/login"
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                      >
                        Sign in
                      </Link>
                    </>
                  ) : null}
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </button>

                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </button>

                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
            </p>
            <p className="text-xs text-gray-400 mt-3">
              © {currentYear} Taarifa. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="hidden lg:block fixed top-0 right-0 -z-10">
        <div className="relative">
          <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-blue-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute top-[200px] right-[-50px] w-[300px] h-[300px] bg-purple-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-[-100px] right-[0px] w-[500px] h-[500px] bg-pink-100 rounded-full opacity-10 blur-3xl" />
        </div>
      </div>

      <div className="hidden lg:block fixed bottom-0 left-0 -z-10">
        <div className="relative">
          <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-green-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-[100px] left-[0px] w-[300px] h-[300px] bg-blue-100 rounded-full opacity-20 blur-3xl" />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;