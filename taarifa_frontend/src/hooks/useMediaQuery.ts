import { useState, useEffect, useCallback } from 'react';

interface MediaQueryConfig {
  query: string;
  onChange?: (matches: boolean) => void;
}

/**
 * Hook to track a CSS media query
 * @param query - CSS media query string
 * @returns Whether the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    // Check if window is available (SSR safe)
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Update state initially
    setMatches(mediaQuery.matches);

    // Listener for changes
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } 
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
};

/**
 * Predefined breakpoints for common screen sizes
 */
export const useBreakpoints = () => {
  const isXs = useMediaQuery('(max-width: 639px)');
  const isSm = useMediaQuery('(min-width: 640px) and (max-width: 767px)');
  const isMd = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isLg = useMediaQuery('(min-width: 1024px) and (max-width: 1279px)');
  const isXl = useMediaQuery('(min-width: 1280px) and (max-width: 1535px)');
  const is2xl = useMediaQuery('(min-width: 1536px)');

  // Convenience breakpoints
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isLargeDesktop = useMediaQuery('(min-width: 1280px)');

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
  };
};

/**
 * System preferences hooks
 */
export const useSystemPreferences = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersLightMode = useMediaQuery('(prefers-color-scheme: light)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const prefersHighContrast = useMediaQuery('(prefers-contrast: high)');
  const prefersLessData = useMediaQuery('(prefers-reduced-data: reduce)');

  return {
    prefersDarkMode,
    prefersLightMode,
    prefersReducedMotion,
    prefersHighContrast,
    prefersLessData,
  };
};

/**
 * Orientation hook
 */
export const useOrientation = () => {
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const isLandscape = useMediaQuery('(orientation: landscape)');

  return {
    isPortrait,
    isLandscape,
    orientation: isPortrait ? 'portrait' : 'landscape',
  };
};

/**
 * Device type hook
 */
export const useDeviceType = () => {
  const isTouchDevice = useMediaQuery('(hover: none) and (pointer: coarse)');
  const isMouseDevice = useMediaQuery('(hover: hover) and (pointer: fine)');
  const isPrint = useMediaQuery('print');

  return {
    isTouchDevice,
    isMouseDevice,
    isPrint,
  };
};

// Usage examples:
/*
// Basic media query
const isMobile = useMediaQuery('(max-width: 767px)');
const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

// Using breakpoints
const MyComponent = () => {
  const { isMobile, isTablet, isDesktop } = useBreakpoints();
  
  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  );
};

// System preferences
const App = () => {
  const { prefersDarkMode, prefersReducedMotion } = useSystemPreferences();
  
  useEffect(() => {
    if (prefersReducedMotion) {
      // Disable animations
    }
  }, [prefersReducedMotion]);

  return (
    <div className={prefersDarkMode ? 'dark' : 'light'}>
      <Content />
    </div>
  );
};

// Responsive component
const ResponsiveComponent = () => {
  const { isMobile, isDesktop } = useBreakpoints();
  const { orientation } = useOrientation();
  
  const columns = isMobile ? 1 : isDesktop ? 3 : 2;
  
  return (
    <div>
      <p>Device: {isMobile ? 'Mobile' : 'Desktop'}</p>
      <p>Orientation: {orientation}</p>
      <Grid columns={columns}>
        <Item />
        <Item />
        <Item />
      </Grid>
    </div>
  );
};
*/