import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.jmdconsulting.co.uk',
  compressHTML: false,
  devToolbar: { enabled: false },
  /* every internal link prefetches its page on hover or focus */
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  server: {
    port: Number(process.env.PORT) || 8750,
    host: true,
  },
});
