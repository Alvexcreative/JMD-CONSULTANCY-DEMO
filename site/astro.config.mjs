import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.jmdconsulting.co.uk',
  compressHTML: false,
  devToolbar: { enabled: false },
  /* every internal link prefetches its page on hover or focus */
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  /* addresses from before the site moved to the root keep working */
  redirects: {
    '/chalk': '/',
    '/chalk/services': '/services/',
    '/chalk/systems': '/systems/',
    '/chalk/evidence': '/evidence/',
    '/chalk/enquiry': '/enquiry/',
    '/concepts/08-chalk.html': '/',
    /* Reach and Notes were removed in October 2026 */
    '/reach': '/',
    '/notes': '/',
    '/notes/solution-services': '/',
    '/notes/coda-unit4-since-1990': '/',
    '/notes/harrogate-and-beyond': '/',
    '/chalk/reach': '/',
    '/chalk/notes': '/',
  },
  server: {
    // 4321 is the Alvex site, 4700 is the Valmoret demo — stay clear of both
    port: Number(process.env.PORT) || 8750,
    host: true,
  },
});
