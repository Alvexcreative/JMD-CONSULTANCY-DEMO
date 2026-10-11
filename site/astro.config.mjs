import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.jmdconsulting.co.uk',
  compressHTML: false,
  devToolbar: { enabled: false },
  /* the Chalk dev server (port 8750, CHALK_ROOT=1) opens straight onto the
     Chalk site; the comparison server on 4800 keeps the picker at its root */
  redirects: process.env.CHALK_ROOT ? { '/': '/chalk/', '/concepts/08-chalk': '/chalk/', '/concepts/08-chalk.html': '/chalk/' } : {},
  server: {
    // 4321 is the Alvex site, 4700 is the Valmoret demo — stay clear of both
    port: Number(process.env.PORT) || 4800,
    host: true,
  },
});
