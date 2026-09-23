# PRODUCT.md — JMD Consulting

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

Concepts 01 (Son Daven), 03 (ERA), 04 (Yolkk), 05 (Immersive Garden) and
the 07 Harrogate image picker were reviewed and dropped; they are kept in
`_archive/` with their assets.

No DESIGN.md: competing worlds is the point of the exercise. Whichever is
chosen becomes it.

## Copy rules

Headlines use JMD's existing taglines **verbatim** — MOVING BUSINESS FORWARD,
DEVELOP. INNOVATE. EVOLVE, WE ARE IMPLEMENTATION SPECIALISTS, Solution Services,
and the Jason Dodd quote. Service copy is verbatim from the live site. The three
source typos are corrected. No invented claims, clients, metrics or testimonials.

## Constraints

- Static HTML per concept, one file each, no build step. A persistent switcher bar
  moves between concepts in the same tab.
- One hero image per concept. The Land/Genre comparison was resolved and the
  switching machinery removed.
- Full motion: GSAP, scroll behaviour, authored intros. `prefers-reduced-motion`
  respected everywhere.
- Phone: no horizontal scroll at 320px, every control at least 44px, no text
  below 12px.
- The eventual full build will be Astro, matching the sibling projects.
