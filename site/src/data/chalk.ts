/* ═══════════════════════════════════════════════════════════════════
   Chalk — the full build of concept 08.

   Every factual line comes from `content.ts` (itself JMD's own copy from
   jmdconsulting.co.uk) or is quoted from CONTENT-SOURCE.md. Where a slot
   had nothing on the live site — page titles for the Notes, their
   standfirsts, image captions — the line is marked `bridging` and needs
   the client's approval before launch. No claim, figure, client or name
   is invented anywhere.

   Photographs are generated for review (Higgsfield, October 2026). None is
   presented as JMD's own office or staff; a live build wants licensed
   stock or a commissioned shoot.
   ═══════════════════════════════════════════════════════════════════ */

export const BASE = '/chalk';
export const IMG = '/assets/chalk';

/* The site's sections, in filing order. `n` is the filing number shown in
   the rail and the header strip. */
export const pages = [
  { slug: 'services', n: 1, label: 'Services', title: 'Solutions for your business' },
  { slug: 'systems',  n: 2, label: 'Systems',  title: 'We are implementation specialists' },
  { slug: 'reach',    n: 3, label: 'Reach',    title: 'Working with you' },
  { slug: 'evidence', n: 4, label: 'Evidence', title: 'Twenty-six years of delivery' },
  { slug: 'notes',    n: 5, label: 'Notes',    title: 'Develop. Innovate. Evolve.' },
  { slug: 'enquiry',  n: 6, label: 'Enquiry',  title: 'We take the time to listen.' },
] as const;

export type PageSlug = (typeof pages)[number]['slug'];

export const href = (slug = '') => (slug ? `${BASE}/${slug}/` : `${BASE}/`);

export function nextOf(slug: string) {
  const i = pages.findIndex((p) => p.slug === slug);
  return i > -1 && i < pages.length - 1 ? pages[i + 1] : null;
}

/* ── Notes: practice notes. Bodies are verbatim from the live site; the
   titles and standfirsts are bridging copy for approval. ── */
export const notes = [
  {
    slug: 'solution-services',
    title: 'What we mean by a Solution Service',
    standfirst: 'Clients want solutions, not reports. The idea the practice was formed around in 2000.',
    bridging: true,
    image: 'gen/notes-whiteboard.jpg',
    alt: 'Colleagues sketching a process flow on a whiteboard in a bright office.',
    body: [
      'Thank you for taking the time to visit our site and to see how we can help your organisation benefit from our services.',
      'Formed in 2000, our consultancy has provided services to a global client base. We believe that clients ultimately want solutions and not just reports after engaging the services of consultants. They want and should demand a service that goes one step further and provides a real solution to their problems. In short — ‘Solution Services’.',
      'With the experience that our team possess with a proven track record of solution delivery we ask you to take the time to check out the rest of our site. Once you have then feel free to contact us to learn how we can enhance your business systems and processes.',
    ],
    quote: 'We are committed to making sure that our clients receive more than just a good service. We aim to make sure that the service they receive delivers a solution. In short, a ‘Solution Service’.',
  },
  {
    slug: 'coda-unit4-since-1990',
    title: 'CODA / Unit4 Financials® since 1990',
    standfirst: 'Where the practice’s specialism comes from, and the systems it now reaches into.',
    bridging: true,
    image: 'gen/notes-ledger.jpg',
    alt: 'A printed ledger report with columns of figures beside a calculator.',
    body: [
      'We are CODA/Unit4 Financials® consultants providing consultancy and support since 1990. Our knowledge and experience is gained from providing real world consultancy whilst employed by CODA®, followed by providing Independent Consultancy since 2000 to circa 100 clients worldwide.',
      'We specialise in the delivery of consultancy services and systems integration solutions. With a key focus on accounting & finance systems such as CODA/Unit4 Financials® or more recently NetSuite®, linked with MS SQL Server® or Oracle®, we are able to deliver our clients strategic and functional solutions.',
      'Thanks to our knowledge and business partnerships we can deliver solutions using the latest technologies and ideas.',
    ],
    quote: 'With our proven experience we are well placed to provide a high quality service to our clients and at competitive rates.',
  },
  {
    slug: 'harrogate-and-beyond',
    title: 'From Harrogate, to wherever the system is',
    standfirst: 'A base at the gateway to the Dales, and a practice that travels — or connects remotely.',
    bridging: true,
    image: 'gen/notes-terrace.jpg',
    alt: 'A Georgian stone terrace behind a wide green lawn on a spring morning.',
    body: [
      'Based in Harrogate, North Yorkshire at the gateway to the Yorkshire Dales, we are a 20 minute drive from Leeds Bradford International Airport and 30 minutes from York railway station.',
      'We love our location. With easy road, rail and air routes that means we are able to visit clients all over the UK and internationally to Europe, USA & Canada and the Middle East.',
      'If you don’t wish to see us and are happy to make use of cloud based applications then we can connect remotely to your servers or desktop devices.',
    ],
    quote: 'We take the time to listen.',
  },
] as const;
