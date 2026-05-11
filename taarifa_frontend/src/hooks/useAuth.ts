import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('auth_token'),
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setAuthState(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        // Verify token with your backend
        const user = await verifyToken(token);
        
        if (user) {
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } else {
          // Token is invalid
          localStorage.removeItem('auth_token');
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: 'Authentication failed',
        });
      }
    };

    checkAuth();
  }, []);

  // Verify token with backend
  const verifyToken = async (token: string): Promise<User | null> => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) return null;

      const data = await response.json();
      return data.user;
    } catch {
      return null;
    }
  };

  // Login
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Replace with your actual login API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const { user, token } = await response.json();

      // Store token
      localStorage.setItem('auth_token', token);

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: message,
      }));
      return false;
    }
  }, []);

  // Register
  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    // Basic validation
    if (data.password !== data.confirmPassword) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Passwords do not match',
      }));
      return false;
    }

    if (data.password.length < 8) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Password must be at least 8 characters',
      }));
      return false;
    }

    try {
      // Replace with your actual register API call
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const { user, token } = await response.json();

      // Store token
      localStorage.setItem('auth_token', token);

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: message,
      }));
      return false;
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
    navigate('/login');
  }, [navigate]);

  // Clear error
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((role: string): boolean => {
    return authState.user?.role === role;
  }, [authState.user]);

  // Update user profile
  const updateProfile = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const { user } = await response.json();
      
      setAuthState(prev => ({
        ...prev,
        user,
      }));

      return true;
    } catch (err) {
      setAuthState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Profile update failed',
      }));
      return false;
    }
  }, [authState.token]);

  return {
    ...authState,
    login,
    register,
    logout,
    clearError,
    hasRole,
    updateProfile,
  };
};