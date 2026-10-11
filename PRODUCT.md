# PRODUCT.md — JMD Consulting

<!-- impeccable:product-schema 1 -->

## Platform

web

## What this project is

The JMD Consulting website, in the Chalk design: a five-page Astro site in
`site/` (Home, Services, Systems, Evidence, Enquiry), built to the scope of the
Alvex "Sky Is The Limit" package. It is the only JMD site: earlier concepts
and versions were removed in October 2026.

Content truth lives in `CONTENT-SOURCE.md`, scraped from the live site at
jmdconsulting.co.uk. Nothing on the site may claim anything that file does not
support.

## The business

Independent finance-systems consultancy. Founded January 2000 by Jason Dodd (MD),
based in Harrogate, North Yorkshire, working globally — UK, Europe, USA, Canada,
Middle East. Circa 100 clients worldwide.

Specialism: accounting and finance systems consultancy and systems integration —
CODA/Unit4 Financials® and NetSuite®, on MS SQL Server® or Oracle®. CODA/Unit4
consultancy experience dating to 1990.

Three services: Project Management · Systems Implementation · ETL & BI.

Positioning: clients want solutions, not reports. "Solution Services."

**Present JMD as a practice, not a person.** The live site names Jason Dodd as
Managing Director and signs its central quote with his name. The client has
asked that this be removed so the business reads as a firm with staff. Keep the
quote verbatim, attribute it to JMD Consulting, and write in the plural — which
their own copy already does ("our consultancy", "our team", "we specialise").
Do not invent team size, offices or named staff.

## Audience

Finance directors, financial controllers and IT leads at mid-to-large companies
running or replacing an ERP finance system. Sceptical, time-poor, risk-averse.
They are buying certainty of delivery, not novelty. Viewed on a desktop in an
office, in daylight.

## Mode

**Persuade.** A marketing site. The visitor should finish the first screen
knowing what JMD does, and finish any page knowing it is credible.

## Visual authority

**Chalk** — the client's chosen direction, and the only one in this project.
Spectral for reading, Martian Mono for filing marks, the Harrogate Blue palette
(chalk-blue surfaces anchored to the blue in the logo), hairline rules, each page
opening on a photograph under a chalk veil, and a docking rail of pages on the
right. The client's own logo, redrawn cleanly from the live site, sits on the
page with no plate.

Imagery: city towers from street level, colleagues working together, a
handshake, Harrogate and the Dales, all light enough to sit inside the chalk
palette. People in imagery support the "practice, not a person" positioning:
imagery may show a team; copy may not claim a team size or name staff. Images
are generated for review — a live build wants licensed stock or a commissioned
shoot, and no image may be presented as JMD's own office or staff.

## Copy rules

Headlines use JMD's existing taglines **verbatim** — MOVING BUSINESS FORWARD,
DEVELOP. INNOVATE. EVOLVE, WE ARE IMPLEMENTATION SPECIALISTS, Solution Services,
and the Jason Dodd quote. Service copy is verbatim from the live site. The three
source typos are corrected. No invented claims, clients, metrics or testimonials.

## Constraints

- Astro, matching the sibling Alvex projects. One shared content source
  (`site/src/data/content.ts`, `site/src/data/chalk.ts`).
- Full motion: GSAP, scroll-driven scenes, cross-page View Transitions, the
  branded intro once a session. Content visible without scripts;
  `prefers-reduced-motion` respected everywhere.
- Phone: no horizontal scroll at 320px, every control at least 44px, no text
  below 12px.
