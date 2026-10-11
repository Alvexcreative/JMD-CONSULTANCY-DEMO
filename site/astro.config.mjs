import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.jmdconsulting.co.uk',
  compressHTML: false,
  devToolbar: { enabled: false },
  server: {
    // 4321 is the Alvex site, 4700 is the Valmoret demo — stay clear of both
    port: Number(process.env.PORT) || 4800,
    host: true,
  },
});
