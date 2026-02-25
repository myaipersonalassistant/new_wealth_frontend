import React from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '@/components/SEO';
import { SEO_CONFIG, jsonLdOrganization, jsonLdWebSite } from '@/lib/seo';

/** Default title and description per path (for routes that don't set their own SEO). */
const ROUTE_DEFAULTS: Record<string, { title: string; description: string }> = {
  '/': {
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
  },
  '/start': {
    title: 'Start Your Journey',
    description: 'Begin building wealth through property. Free resources and next steps for new investors.',
  },
  '/thanks': {
    title: 'Thank You',
    description: 'Thanks for your interest. Check your email and start your property wealth journey.',
  },
  '/course': {
    title: 'Property Investing Course',
    description: 'Structured course for beginner property investors. Learn the fundamentals and take action.',
  },
  '/masterclass': {
    title: 'Property Masterclass',
    description: 'Deep-dive masterclass on property investment strategies and execution.',
  },
  '/calculator': {
    title: 'Property Investment Calculator',
    description: 'Calculate yields, cash flow, and returns for UK property investments.',
  },
  '/dashboard': {
    title: 'Your Dashboard',
    description: 'Access your courses, resources, and progress in one place.',
  },
  '/admin': {
    title: 'Admin',
    description: 'Admin dashboard.',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your data.',
  },
  '/terms': {
    title: 'Terms of Use',
    description: 'Terms and conditions for using Build Wealth Through Property.',
  },
  '/refund': {
    title: 'Refund Policy',
    description: 'Our refund and cancellation policy for purchases.',
  },
  '/blog': {
    title: 'Blog',
    description: 'Property investment tips, strategies, and insights. Articles for UK investors.',
  },
  '/foundation': {
    title: 'Foundation Edition',
    description: 'The Foundation Edition – your first step into property wealth building.',
  },
  '/seminar': {
    title: 'Live Seminar',
    description: 'Join our live property investment seminar. Dates and booking.',
  },
  '/seminar-purchase': {
    title: 'Book Seminar',
    description: 'Secure your place at our property investment seminar.',
  },
  '/payment-success': {
    title: 'Payment Successful',
    description: 'Your payment was successful. Thank you.',
  },
  '/payment-cancel': {
    title: 'Payment Cancelled',
    description: 'Your payment was cancelled. You can try again when ready.',
  },
  '/book-purchase': {
    title: 'Get the Book',
    description: 'Order the book: Build Wealth Through Property. Practical guide for investors.',
  },
  '/auth': {
    title: 'Sign In',
    description: 'Sign in or create an account to access your dashboard and resources.',
  },
  '/reviews': {
    title: 'Reviews',
    description: 'What readers and students say about Build Wealth Through Property.',
  },
};

function getPathDefaults(pathname: string): { title: string; description: string } | null {
  if (ROUTE_DEFAULTS[pathname]) return ROUTE_DEFAULTS[pathname];
  if (pathname.startsWith('/blog/')) return null;
  return null;
}

/**
 * Sets default SEO per route. Renders first so page-level <SEO /> can override.
 * Home page gets WebSite + Organization JSON-LD.
 */
const RouteSEO: React.FC = () => {
  const { pathname } = useLocation();
  const defaults = getPathDefaults(pathname);
  if (!defaults) return null;

  const isHome = pathname === '/';
  return (
    <SEO
      title={defaults.title}
      description={defaults.description}
      jsonLd={isHome ? [jsonLdOrganization(), jsonLdWebSite()] : undefined}
    />
  );
};

export default RouteSEO;
