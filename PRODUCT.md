# PRODUCT.md — JMD Consulting

<!-- impeccable:product-schema 1 -->

## Platform

web

## What this project is

Five competing homepage concepts for **JMD Consulting**, built to choose a visual
direction before a full site is produced. Each concept is a hero plus one content
section (the three services). No other pages.

Content truth lives in `CONTENT-SOURCE.md`, scraped from the live site at
jmdconsulting.co.uk. Nothing on these pages may claim anything that file does not
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

**Persuade.** These are marketing homepages. The visitor should finish the hero
knowing what JMD does and finish the services section knowing it is credible.

## Visual authority

Three concepts remain, each pinned to a named reference and taking its
cues literally:

| Concept | Reference | World |
|---|---|---|
| 02 | Montfort | Near-monochrome white cloud, slate blue, wide-tracked light caps |
| 06 | Path for Growth | Oswald + Lora, cream and tan, square corners, Harrogate hero |
| 08 | Chalk | Supplied by the client — Spectral + Martian Mono, chalk blue, navy, ochre |

`09 Joe` also exists as a scratch page and is not a concept.

Concepts 01 (Son Daven), 03 (ERA), 04 (Yolkk), 05 (Immersive Garden) and
the 07 Harrogate image picker were reviewed and dropped; they are kept in
`_archive/` with their assets, along with the cloud plates from a rolling-cloud
intro for 02 that was built and then reverted.

**Decision (October 2026): the client has chosen concept 08, Chalk.** 02 and 06
stay in the repo for reference but are no longer in contention. 08's world —
Spectral + Martian Mono, chalk blue, navy, ochre accent — is now the visual
authority; a DESIGN.md should be written from it once the hero is settled.

Client feedback on 08: it reads too plain and simple; it should look like a
proper, established business site. The open work is a photographic hero:

- Subjects the client asked to see: city towers shot from street level looking
  up (one or several); a scenic view from inside an office; people working
  together in a business setting; a handshake.
- Keep it light — the image has to sit inside 08's existing chalk palette, not
  bring a new one.
- People in imagery support the "practice, not a person" positioning: the site
  should read as a firm with several staff. Imagery may show a team; copy still
  may not claim a team size or name staff.
- Hero imagery is generated for review. A live build wants licensed stock or a
  commissioned shoot, and no image may be presented as JMD's own office or
  staff.

## Copy rules

Headlines use JMD's existing taglines **verbatim** — MOVING BUSINESS FORWARD,
DEVELOP. INNOVATE. EVOLVE, WE ARE IMPLEMENTATION SPECIALISTS, Solution Services,
and the Jason Dodd quote. Service copy is verbatim from the live site. The three
source typos are corrected. No invented claims, clients, metrics or testimonials.

## Constraints

- Static HTML per concept, one file each, no build step. A persistent switcher bar
  moves between concepts in the same tab.
- One hero image per concept. Concept 08's hero is down to a shortlist of
  two: A1 (single tower, Editorial) and B3 (converging towers, Duotone), both
  with the handshake in Note 2, behind a review picker that comes out once
  one is chosen.
- Image 15 (a team reviewing charts around a screen) sits in Note 3, in three
  treatments under review, and is also earmarked for the section pages of
  the full site.
- Concept 06's phone hero is the one open decision: three styles (Full, Column,
  Band) ship behind a phone-only picker. Desktop is settled. The losing two and
  the picker come out once a style is chosen.
- Full motion: GSAP, scroll behaviour, authored intros. `prefers-reduced-motion`
  respected everywhere.
- Phone: no horizontal scroll at 320px, every control at least 44px, no text
  below 12px.
- The eventual full build will be Astro, matching the sibling projects.
