import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that resets the scroll position to the top of the page
 * whenever the route (pathname) changes.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset scroll position to top-left
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
