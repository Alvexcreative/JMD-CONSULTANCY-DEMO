import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.jmdconsulting.co.uk',
  compressHTML: false,
  devToolbar: { enabled: false },
  /* addresses from before the site moved to the root keep working */
  redirects: {
    '/chalk': '/',
    '/chalk/services': '/services/',
    '/chalk/systems': '/systems/',
    '/chalk/reach': '/reach/',
    '/chalk/evidence': '/evidence/',
    '/chalk/notes': '/notes/',
    '/chalk/enquiry': '/enquiry/',
    '/chalk/notes/solution-services': '/notes/solution-services/',
    '/chalk/notes/coda-unit4-since-1990': '/notes/coda-unit4-since-1990/',
    '/chalk/notes/harrogate-and-beyond': '/notes/harrogate-and-beyond/',
    '/concepts/08-chalk.html': '/',
  },
  server: {
    // 4321 is the Alvex site, 4700 is the Valmoret demo — stay clear of both
    port: Number(process.env.PORT) || 8750,
    host: true,
  },
});
