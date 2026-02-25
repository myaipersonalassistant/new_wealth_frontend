import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { fullUrl, SEO_CONFIG } from '@/lib/seo';

export interface SEOProps {
  /** Page title (appended with " | Site Name" if not already containing it) */
  title?: string;
  /** Meta description (defaults to site description) */
  description?: string;
  /** OG/Twitter image URL (absolute preferred) */
  image?: string | null;
  /** Canonical URL path (e.g. "/blog/my-post"); defaults to current pathname */
  canonicalPath?: string;
  /** If true, add noindex,nofollow */
  noIndex?: boolean;
  /** JSON-LD script object(s) - will be stringified and injected */
  jsonLd?: object | object[];
  /** OG type (default "website"; use "article" for blog posts) */
  ogType?: 'website' | 'article';
  /** Article published time (ISO string) for article type */
  publishedTime?: string;
  /** Article modified time (ISO string) */
  modifiedTime?: string;
}

function ensureTitle(title: string): string {
  const site = SEO_CONFIG.siteName;
  if (!title) return SEO_CONFIG.defaultTitle;
  if (title.includes('|')) return title;
  return `${title} | ${site}`;
}

function absoluteImage(src: string | null | undefined): string | null {
  if (!src) return null;
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return src.startsWith('/') ? `${origin}${src}` : `${origin}/${src}`;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  canonicalPath,
  noIndex = false,
  jsonLd,
  ogType = 'website',
  publishedTime,
  modifiedTime,
}) => {
  const location = useLocation();
  const path = canonicalPath ?? location.pathname + location.search;
  const canonical = fullUrl(path.split('?')[0]);
  const finalTitle = ensureTitle(title ?? '');
  const finalDesc = description ?? SEO_CONFIG.defaultDescription;
  const finalImage = absoluteImage(image) || fullUrl('/og.jpg');

  useEffect(() => {
    document.title = finalTitle;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', finalDesc);
    setMeta('og:title', finalTitle, true);
    setMeta('og:description', finalDesc, true);
    setMeta('og:type', ogType, true);
    setMeta('og:url', canonical, true);
    setMeta('og:image', finalImage, true);
    setMeta('og:site_name', SEO_CONFIG.siteName, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', finalTitle);
    setMeta('twitter:description', finalDesc);
    setMeta('twitter:image', finalImage);
    if (SEO_CONFIG.twitterHandle) setMeta('twitter:site', SEO_CONFIG.twitterHandle);
    if (ogType === 'article' && publishedTime) setMeta('article:published_time', publishedTime, true);
    if (ogType === 'article' && modifiedTime) setMeta('article:modified_time', modifiedTime, true);

    if (noIndex) {
      setMeta('robots', 'noindex,nofollow');
    } else {
      const robots = document.querySelector('meta[name="robots"]');
      if (robots) robots.remove();
    }

    let linkCanonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = canonical;
  }, [finalTitle, finalDesc, finalImage, canonical, noIndex, ogType, publishedTime, modifiedTime]);

  const scripts = useMemo(() => {
    if (!jsonLd) return null;
    const list = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    return list.map((obj, i) => ({
      key: `jsonld-${i}`,
      content: JSON.stringify(obj),
    }));
  }, [jsonLd]);

  useEffect(() => {
    if (!scripts) return;
    const ids = scripts.map((s) => s.key);
    ids.forEach((id) => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    });
    scripts.forEach(({ key, content }) => {
      const script = document.createElement('script');
      script.id = key;
      script.type = 'application/ld+json';
      script.textContent = content;
      document.head.appendChild(script);
    });
    return () => {
      ids.forEach((id) => document.getElementById(id)?.remove());
    };
  }, [scripts]);

  return null;
};

export default SEO;
