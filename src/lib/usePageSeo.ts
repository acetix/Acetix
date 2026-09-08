import { useEffect } from 'react';

const SITE = 'acetix.xyz';

/**
 * Minimal per-route SEO: keeps <title>, meta description, canonical URL
 * and the OG/Twitter URL+title tags in sync on every client-side
 * navigation, so crawlers and link previews see the right page.
 * (Seobility-style basics: unique title ≤ ~60 chars, description
 * ~150–160 chars, one canonical per URL.)
 */
export function usePageSeo(title: string, description: string, path: string) {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE}`;
    document.title = fullTitle;

    const url = `https://acetix.xyz${path}`;

    const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [title, description, path]);
}
