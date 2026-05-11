import { lazy, ComponentType, LazyExoticComponent } from 'react';

// Define route types
export interface RouteConfig {
  path: string;
  element?: React.ReactNode;
  // For lazy loading
  component?: LazyExoticComponent<ComponentType<any>>;
  // Nested routes
  children?: RouteConfig[];
  // Route metadata
  meta?: {
    title?: string;
    description?: string;
    requiresAuth?: boolean;
    roles?: string[];
    layout?: 'main' | 'auth' | 'none';
    showSidebar?: boolean;
    showFooter?: boolean;
    breadcrumb?: string;
    icon?: string;
  };
  // For redirects
  redirect?: string;
  // Index route
  index?: boolean;
}

// Lazy load pages for better performance
const Home = lazy(() => import('../pages/Home'));
const SalaryPage = lazy(() => import('../pages/SalaryPage'));
const SalaryResultsPage = lazy(() => import('../pages/SalaryResultsPage'));
const AffordabilityPage = lazy(() => import('../pages/AffordabilityPage'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Auth pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

// Dashboard pages
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Profile = lazy(() => import('../pages/dashboard/Profile'));
const Settings = lazy(() => import('../pages/dashboard/Settings'));
const MySearches = lazy(() => import('../pages/dashboard/MySearches'));

// Define all application routes
export const routes: RouteConfig[] = [
  // Public routes (Main layout without sidebar)
  {
    path: '/',
    meta: {
      layout: 'main',
      title: 'Home - Taarifa Salary Guide',
      description: 'Tanzania Salary Guide & Affordability Calculator',
      showSidebar: false,
      showFooter: true,
    },
    children: [
      {
          index: true,
          component: Home,
          meta: {
              title: 'Home',
              breadcrumb: 'Home',
          },
          path: ''
      },
      {
        path: 'salary',
        component: SalaryPage,
        meta: {
          title: 'Salary Lookup',
          description: 'Search and compare salaries across occupations',
          breadcrumb: 'Salary Lookup',
          icon: '💰',
        },
      },


      {
       path: 'salary/results',
       component: SalaryResultsPage,
       meta: {
        title: 'Salary Results',
        description: 'View salary comparison results',
        breadcrumb: 'Results',
  },
},


      {
        path: 'affordability',
        component: AffordabilityPage,
        meta: {
          title: 'Affordability Calculator',
          description: 'Check if you can afford living in different cities',
          breadcrumb: 'Affordability',
          icon: '🏠',
        },
      },
      {
        path: 'about',
        component: lazy(() => import('../pages/About')),
        meta: {
          title: 'About Us',
          breadcrumb: 'About',
        },
      },
      {
        path: 'contact',
        component: lazy(() => import('../pages/Contact')),
        meta: {
          title: 'Contact Us',
          breadcrumb: 'Contact',
        },
      },
      {
        path: 'faq',
        component: lazy(() => import('../pages/FAQ')),
        meta: {
          title: 'FAQ',
          breadcrumb: 'FAQ',
        },
      },
      {
        path: 'privacy',
        component: lazy(() => import('../pages/Privacy')),
        meta: {
          title: 'Privacy Policy',
          breadcrumb: 'Privacy',
        },
      },
      {
        path: 'terms',
        component: lazy(() => import('../pages/Terms')),
        meta: {
          title: 'Terms of Service',
          breadcrumb: 'Terms',
        },
      },
    ],
  },

  // Protected routes (Dashboard with sidebar)
  {
    path: '/dashboard',
    meta: {
      layout: 'main',
      requiresAuth: true,
      showSidebar: true,
      showFooter: false,
      title: 'Dashboard',
    },
    children: [
      {
          index: true,
          component: Dashboard,
          meta: {
              title: 'Dashboard',
              breadcrumb: 'Dashboard',
              icon: '📊',
          },
          path: ''
      },
      {
        path: 'profile',
        component: Profile,
        meta: {
          title: 'My Profile',
          breadcrumb: 'Profile',
          icon: '👤',
        },
      },
      {
        path: 'settings',
        component: Settings,
        meta: {
          title: 'Settings',
          breadcrumb: 'Settings',
          icon: '⚙️',
        },
      },
      {
        path: 'my-searches',
        component: MySearches,
        meta: {
          title: 'My Searches',
          breadcrumb: 'My Searches',
          icon: '🔍',
        },
      },
    ],
  },

  // Auth routes (Auth layout)
  {
    path: '/',
    meta: {
      layout: 'auth',
      showFooter: false,
    },
    children: [
      {
        path: 'login',
        component: Login,
        meta: {
          title: 'Sign In',
          description: 'Sign in to your account',
        },
      },
      {
        path: 'register',
        component: Register,
        meta: {
          title: 'Create Account',
          description: 'Create a new account',
        },
      },
      {
        path: 'forgot-password',
        component: ForgotPassword,
        meta: {
          title: 'Forgot Password',
          description: 'Reset your password',
        },
      },
      {
        path: 'reset-password',
        component: ResetPassword,
        meta: {
          title: 'Reset Password',
          description: 'Set a new password',
        },
      },
    ],
  },

  // 404 - Must be last
  {
    path: '*',
    component: NotFound,
    meta: {
      layout: 'main',
      title: '404 - Page Not Found',
      showSidebar: false,
      showFooter: false,
    },
  },
];

// Helper function to find route by path
export const findRouteByPath = (path: string): RouteConfig | undefined => {
  const searchRoutes = (routes: RouteConfig[]): RouteConfig | undefined => {
    for (const route of routes) {
      if (route.path === path) return route;
      if (route.children) {
        const found = searchRoutes(route.children);
        if (found) return found;
      }
    }
    return undefined;
  };
  return searchRoutes(routes);
};

// Helper function to get breadcrumbs
export const getBreadcrumbs = (pathname: string): Array<{ label: string; path?: string }> => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs: Array<{ label: string; path?: string }> = [
    { label: 'Home', path: '/' },
  ];

  let currentPath = '';
  for (const path of paths) {
    currentPath += `/${path}`;
    const route = findRouteByPath(currentPath);
    if (route?.meta?.breadcrumb) {
      breadcrumbs.push({
        label: route.meta.breadcrumb,
        path: currentPath,
      });
    }
  }

  return breadcrumbs;
};