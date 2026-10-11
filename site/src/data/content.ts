/* ═══════════════════════════════════════════════════════════════════
   The single source of truth for every word on both designs.

   Copy is JMD's own, from jmdconsulting.co.uk, with three source typos
   corrected. Where a slot had no equivalent on the live site the line is
   marked `bridging: true` and needs client approval before launch.

   JMD is presented as a practice, not an individual — no named director,
   no first-person singular. Their own site already writes in the plural
   ("our consultancy", "our team", "we specialise"), so this is their
   register, not an invention. Nothing about team size, offices or named
   staff appears anywhere.
   ═══════════════════════════════════════════════════════════════════ */

export const site = {
  name: 'JMD Consulting',
  strapline: 'Financial Systems & Integration Consulting Services',
  phone: '+44 (0) 1423 884000',
  phoneHref: 'tel:+441423884000',
  email: 'info@jmdconsulting.co.uk',
  web: 'www.jmdconsulting.co.uk',
  base: 'Harrogate, North Yorkshire',
  formed: 'January 2000',
  codaSince: '1990',
  clients: 'Circa 100 clients worldwide',
} as const;

export const nav = [
  { label: 'Home', href: '' },
  { label: 'Services', href: 'services' },
  { label: 'Systems', href: 'systems' },
  { label: 'About', href: 'about' },
  { label: 'Contact', href: 'contact' },
] as const;

/* Taglines, all verbatim from the live site */
export const taglines = {
  moving: 'Moving business forward',
  evolve: 'Develop. Innovate. Evolve.',
  solution: 'Implementing Solution Services',
  specialists: 'We are implementation specialists',
  working: 'Working with you',
  listen: 'We take the time to listen.',
} as const;

export const intro = {
  /* verbatim, homepage */
  welcome:
    'Formed in 2000, our consultancy has provided services to a global client base. We believe that clients ultimately want solutions and not just reports after engaging the services of consultants. They want and should demand a service that goes one step further.',
  /* verbatim, About */
  specialise:
    'We specialise in the delivery of consultancy services and systems integration solutions. With a key focus on accounting & finance systems such as CODA/Unit4 Financials® or more recently NetSuite®, linked with MS SQL Server® or Oracle®, we are able to deliver our clients strategic and functional solutions.',
} as const;

/* The practice's own statement. Verbatim; on the live site it is signed by
   the Managing Director, here it stands for the firm. */
export const statement =
  'We are committed to making sure that our clients receive more than just a good service. We aim to make sure that the service they receive, delivers a solution. In short, a ‘Solution Service’.';

export const storyline = [
  {
    title: 'The problem',
    body: 'Your finance system is holding the business back, and the last engagement left you with a report rather than a working answer.',
    bridging: true,
  },
  {
    title: 'The guide',
    body: 'We specialise in the delivery of consultancy services and systems integration solutions, with a key focus on accounting and finance systems.',
    bridging: false,
  },
  {
    title: 'The success',
    body: 'You run on finance systems that deliver strategic and functional solutions, with reporting your board can rely on.',
    bridging: true,
  },
] as const;

export const services = [
  {
    slug: 'project-management',
    n: '01',
    title: 'Project Management',
    body: 'Providing project management services to clients including project planning, resource management, risk analysis, and tracking and monitoring budgets.',
    points: ['Project planning', 'Resource management', 'Risk analysis', 'Budget tracking'],
  },
  {
    slug: 'systems-implementation',
    n: '02',
    title: 'Systems Implementation',
    body: 'Offering experience of ERP Implementations with a proven track record of delivering complex multi-currency, multi-company and multi-site ERP financial reporting systems.',
    points: ['ERP implementation', 'Multi-currency', 'Multi-company', 'Multi-site reporting'],
  },
  {
    slug: 'etl-business-intelligence',
    n: '03',
    title: 'ETL & Business Intelligence',
    body: 'Servicing clients in Europe, throughout the USA and Canada with business intelligence expertise, developing complex financial reports and KPIs. Migrating financial data from legacy systems, data analysis, development of SQL scripts and stored procedures.',
    points: ['Financial reports & KPIs', 'Legacy data migration', 'Data analysis', 'SQL & stored procedures'],
  },
  {
    slug: 'coda-unit4',
    n: '04',
    title: 'CODA / Unit4 Financials®',
    body: 'Consultancy and support since 1990. Knowledge and experience gained from providing real world consultancy whilst employed by CODA®, followed by independent consultancy since 2000 to circa 100 clients worldwide.',
    points: ['Implementation', 'Upgrade & migration', 'Reporting', 'Ongoing support'],
  },
] as const;

export const systems = {
  heading: 'Practised systems',
  kicker: 'Systems worked with in delivery',
  list: [
    { n: '01', name: 'CODA / Unit4 Financials®', note: 'Consultancy and support since 1990.' },
    { n: '02', name: 'NetSuite®', note: 'More recent focus alongside CODA/Unit4.' },
    { n: '03', name: 'Microsoft SQL Server®', note: 'Reporting, SQL scripts and stored procedures.' },
    { n: '04', name: 'Oracle®', note: 'Finance systems linked to Oracle databases.' },
  ],
  /* all verbatim */
  notes: [
    'We specialise in the delivery of consultancy services and systems integration solutions.',
    'Thanks to our knowledge and business partnerships we can deliver solutions using the latest technologies and ideas.',
    'With our proven experience we are well placed to provide a high quality service to our clients and at competitive rates.',
  ],
} as const;

export const reach = {
  heading: 'Harrogate is our base',
  body: 'Based in Harrogate in the North Yorkshire countryside, at the gateway to the Yorkshire Dales, we are a twenty minute drive from Leeds Bradford International Airport and thirty minutes from York railway station. We are able to travel to clients anywhere across the globe. If you don’t wish to see us and are happy to make use of cloud based applications then we can connect remotely to your servers or desktop devices.',
  facts: [
    { label: 'Regions', value: 'United Kingdom, Europe, USA & Canada, Middle East' },
    { label: 'Base', value: 'Harrogate, North Yorkshire' },
    { label: 'Formed', value: 'January 2000' },
  ],
} as const;

export const credentials = {
  heading: 'Twenty-six years of delivery',
  items: [
    { big: 'Since 1990', body: 'CODA / Unit4 Financials® consultancy and support, first inside CODA® and independently since 2000.' },
    { big: 'Circa 100 clients', body: 'Worldwide, across a broad range of vertical markets, since commencement in January 2000.' },
    { big: 'Four continents', body: 'Servicing clients throughout the UK, Europe, the USA and Canada, and the Middle East.' },
  ],
} as const;

export const evidence = {
  heading: 'Held open for the clients’ own words',
  body: 'This practice does not publish a client list it has not been given permission to publish, and does not write its own testimonials. Three slots sit here for the real ones.',
  slots: [
    { label: 'Slot 01 · Awaiting content', text: 'Client testimonial to be supplied' },
    { label: 'Slot 02 · Awaiting content', text: 'Client testimonial to be supplied' },
    { label: 'Slot 03 · Awaiting content', text: 'Case study to be supplied' },
  ],
} as const;

export const contact = {
  heading: 'Tell us what the system is doing',
  lede: 'The more precise you are about the system and the symptom, the more useful the first reply will be. Every enquiry is read by a consultant.',
  invitation: 'Tell us where the system is failing and we will tell you what it takes to fix it. We work on site across the UK and internationally, or connect remotely to your servers and desktop devices.',
  systems: ['CODA / Unit4 Financials', 'NetSuite', 'Another ERP', 'Not sure yet'],
  /* The form validates and shows a success state but sends nothing. */
  demoNotice: 'Demonstration only — this form is not yet wired to a mailbox.',
} as const;
