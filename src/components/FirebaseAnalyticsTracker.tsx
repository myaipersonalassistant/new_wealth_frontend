import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logPageView } from '@/lib/firebaseAnalytics';

/** Tracks page views in Firebase Analytics on every route change */
export default function FirebaseAnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const pagePath = location.pathname + location.search;
    const pageTitle = document.title;
    logPageView(pagePath, pageTitle);
  }, [location.pathname, location.search]);

  return null;
}
