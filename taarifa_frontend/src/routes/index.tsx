import { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { routes, RouteConfig, getBreadcrumbs } from './routes';
import PrivateRoute from './PrivateRoute';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import Spinner from '../components/ui/Spinner';

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600">Loading page...</p>
    </div>
  </div>
);

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Update document title on route change
const DocumentTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const findRouteMeta = (routes: RouteConfig[], path: string): RouteConfig['meta'] => {
      for (const route of routes) {
        if (route.path === path) return route.meta;
        if (route.children) {
          const found = findRouteMeta(route.children, path);
          if (found) return found;
        }
      }
      return undefined;
    };

    const meta = findRouteMeta(routes, pathname);
    const baseTitle = 'Taarifa Salary Guide';
    
    if (meta?.title) {
      document.title = `${meta.title} - ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        meta?.description || 'Tanzania Salary Guide & Affordability Calculator'
      );
    }
  }, [pathname]);

  return null;
};

// Recursive function to render routes
const renderRoutes = (routeList: RouteConfig[], parentPath: string = '') => {
  return routeList.map((route) => {
    const fullPath = parentPath + (route.path || '');
    
    // Handle redirects
    if (route.redirect) {
      return (
        <Route
          key={fullPath || 'redirect'}
          path={fullPath}
          element={<Navigate to={route.redirect} replace />}
        />
      );
    }

    // Render route with or without children
    if (route.children) {
      return (
        <Route
          key={fullPath || 'layout'}
          path={fullPath}
          element={renderLayout(route)}
        >
          {renderRoutes(route.children, fullPath)}
        </Route>
      );
    }

    // Render individual route
    return (
      <Route
        key={fullPath || 'index'}
        path={fullPath}
        index={route.index}
        element={renderRouteElement(route)}
      />
    );
  });
};

// Choose layout wrapper based on route meta
const renderLayout = (route: RouteConfig) => {
  const layout = route.meta?.layout || 'main';

  switch (layout) {
    case 'auth':
      return <AuthLayout />;
    case 'none':
      return <></>;
    case 'main':
    default:
      return (
        <MainLayout
          showSidebar={route.meta?.showSidebar ?? false}
          showFooter={route.meta?.showFooter ?? true}
        />
      );
  }
};

// Render individual route element with guards
const renderRouteElement = (route: RouteConfig) => {
  if (!route.component) return null;

  const Component = route.component;
  const element = (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );

  // Wrap with PrivateRoute if authentication required
  if (route.meta?.requiresAuth) {
    return (
      <PrivateRoute
        requiredRoles={route.meta?.roles}
        redirectTo="/login"
      >
        {element}
      </PrivateRoute>
    );
  }

  return element;
};

// Main App Routes component
const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <DocumentTitle />
      <Routes>
        {renderRoutes(routes)}
      </Routes>
    </>
  );
};

export default AppRoutes;