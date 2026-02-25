/**
 * Central SEO config and helpers for meta tags, canonical URLs, and JSON-LD.
 */

export const SEO_CONFIG = {
  siteName: 'Build Wealth Through Property',
  defaultTitle: 'Build Wealth Through Property | Property Investment Education',
  defaultDescription:
    'Learn how to build long-term wealth through property. Strategies, calculators, courses, and resources for UK property investors.',
  twitterHandle: '@BuildWealthProp',
  locale: 'en_GB',
  themeColor: '#b45309',
} as const;

/** Base URL for canonical and OG (no trailing slash). */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return (import.meta.env.VITE_BASE_URL as string) || 'https://buildwealththroughproperty.com';
}

/** Build full URL for a path (used in canonical, og:url). */
export function fullUrl(path: string): string {
  const base = getBaseUrl();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

/** Strip HTML and truncate for meta description. */
export function plainTextExcerpt(html: string, maxLen: number = 160): string {
  if (!html) return '';
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3).trim() + '...';
}

/** JSON-LD: Organization (site-wide). */
export function jsonLdOrganization() {
  const url = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONFIG.siteName,
    url,
    description: SEO_CONFIG.defaultDescription,
  };
}

/** JSON-LD: WebSite with search (for sitelinks search box potential). */
export function jsonLdWebSite() {
  const url = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONFIG.siteName,
    url,
    description: SEO_CONFIG.defaultDescription,
    publisher: { '@id': `${url}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${url}/blog?tag={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** JSON-LD: BlogPosting for a single article. */
export function jsonLdBlogPosting(opts: {
  title: string;
  description: string;
  url: string;
  image: string | null;
  datePublished: string;
  dateModified?: string;
  authorName: string;
}) {
  const script = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified || opts.datePublished,
    author: { '@type': 'Person', name: opts.authorName },
  };
  if (opts.image) (script as Record<string, unknown>).image = opts.image;
  return script;
}

/** JSON-LD: Course for course/education pages. */
export function jsonLdCourse(opts: {
  name: string;
  description: string;
  url: string;
  provider?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    provider: opts.provider ? { '@type': 'Organization', name: opts.provider } : undefined,
  };
}
