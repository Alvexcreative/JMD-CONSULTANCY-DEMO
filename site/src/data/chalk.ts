/* ═══════════════════════════════════════════════════════════════════
   Chalk — the JMD Consulting site.

   Every factual line comes from `content.ts` (itself JMD's own copy from
   jmdconsulting.co.uk) or is quoted from CONTENT-SOURCE.md. Where a slot
   had nothing on the live site, the line is marked `bridging` in a comment
   and needs the client's approval before launch. No claim, figure, client or name
   is invented anywhere.

   Photographs are generated for review (Higgsfield, October 2026). None is
   presented as JMD's own office or staff; a live build wants licensed
   stock or a commissioned shoot.
   ═══════════════════════════════════════════════════════════════════ */

export const BASE = '';
export const IMG = '/assets/chalk';

/* The site's sections, in filing order. `n` is the filing number shown in
   the rail and the header strip. */
export const pages = [
  { slug: 'services', n: 1, label: 'Services', title: 'Solutions for your business' },
  { slug: 'systems',  n: 2, label: 'Systems',  title: 'We are implementation specialists' },
  { slug: 'evidence', n: 3, label: 'Evidence', title: 'Delivering since 2000' },
  { slug: 'enquiry',  n: 4, label: 'Enquiry',  title: 'We take the time to listen.' },
] as const;

export type PageSlug = (typeof pages)[number]['slug'];

export const href = (slug = '') => (slug ? `${BASE}/${slug}/` : `${BASE}/`);

export function nextOf(slug: string) {
  const i = pages.findIndex((p) => p.slug === slug);
  return i > -1 && i < pages.length - 1 ? pages[i + 1] : null;
}
