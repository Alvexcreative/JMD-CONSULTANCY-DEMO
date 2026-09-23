# Path for Growth — extracted template spec

Measured from the live DOM at pathforgrowth.com, 2026-09-22. This records the
**structure, type scale and layout system** so concept 06 can reproduce it
exactly with JMD's own content. No copy, logo, photography or asset from that
site is reused — the texture and imagery here are generated fresh.

## Tokens (their CSS custom properties, converted from HSL)

| Token | HSL | Hex |
|---|---|---|
| background | 55 100% 98% | `#FFFEF5` |
| foreground | 60 1% 20% | `#343432` |
| primary | 33 31% 45% | `#96764F` |
| primary-foreground | 55 100% 98% | `#FFFEF5` |
| muted | 33 10% 92% | `#EDEAE7` |
| muted-foreground | 33 5% 40% | `#6B6761` |
| border | 33 10% 85% | `#DDD9D5` |
| footer bg | — | `#343432` |
| **radius** | — | **`0px`** — square corners everywhere |

## Fonts

**Oswald** — all headings, always uppercase. **Lora** — all body copy, serif.
Only these two.

## Type scale (measured)

| Role | Font | Size / line-height | Weight | Tracking |
|---|---|---|---|---|
| h1 hero | Oswald | 72px / 68.4px (0.95) | 700 | −1.8px |
| h2 section | Oswald | 48px / 48px (1.0) | 700 | −1.2px |
| h2 minor | Oswald | 36px / 40px | 700 | −0.9px |
| h3 card | Oswald | 24px / 32px | 400 | +0.6px |
| hero lead | Lora | 24px / 39px (1.625) | 400 | normal |
| section lead | Lora | 20px / 32.5px | 400 | normal |
| body | Lora | 18px / 29.25px (1.625) | 400 | normal |
| eyebrow / role | Oswald | 18px / 28px | 400 | +0.45px |

Body copy colour is `#6B6761`, not the foreground.

## Buttons — radius 0, height 56px, padding 0 32px, Oswald 18px/500, +1.8px, uppercase

- **Primary:** bg `#96764F`, text `#FFFEF5`, 1px border `#DDD9D5`
- **Outline:** transparent, text `#96764F`, 1px border `#96764F`
- **On dark/tan:** bg `#FFFFFF`, text `#96764F`
- **Nav CTA (small):** 14px, +0.7px, padding 8px 24px, height 38px

## Layout

- Container `1280px` max, `16px` side padding
- Header height `80px`, logo left, links + CTA right
- Hero content constrained to `896px` (max-w-4xl), vertical rhythm 32px
- Every section below the hero: `96px` top and bottom padding
- Hero: `min-height: 810px` (90vh)

## Section order and treatment

| # | Section | Background | Structure |
|---|---|---|---|
| 0 | Hero | cream + topographic texture | left-aligned h1 (2 lines, 2nd in tan), lead, 2 buttons, then a centred logo/credential strip |

**Deviation in concept 06:** the hero now carries `harrogate-03.jpg` full-bleed beneath the template's cream wash. The wash is held at 0.90–0.98 across the type column and clears to the photograph on the right. On screens ≤860px the copy runs full width, so the photograph drops below it as a 44vh band rather than sitting behind it. The topographic texture is retained over the cream area.
| 1 | Problem / Guide / Success | cream | 3-col grid, `384px` columns, `48px` gap |
| 2 | Founder | **tan `#96764F`** | portrait left, name + role + pull-quote right, cream text |
| 3 | Choose Your Path | muted warm grey | h2 + lead, then 3-col grid, `32px` gap, 5 cards |
| 4 | Community CTA | **tan `#96764F`** | centred h2 + lead + white button |
| 5 | Testimonials | cream | h2 36px, quote set in uppercase |
| 6 | Footer | **dark `#343432`** | cream text |

The tan sections alternate against cream to pace the page — that alternation is
the template's main rhythmic device.

## Mapping to JMD (concept 06)

| Their slot | JMD content | Source |
|---|---|---|
| "Stop guessing. / Start growing." | "Moving business forward. / Develop. Innovate. Evolve." | both verbatim taglines |
| Hero lead | "Solution Services" positioning paragraph | verbatim |
| "Trusted by" client logos | platform strip: CODA/Unit4, NetSuite, MS SQL Server, Oracle | verbatim from About |
| Problem / Guide / Success | same three headings, JMD framing | see note below |
| Alex Judd, Founder & CEO + quote | Jason Dodd, Managing Director + his quote | verbatim |
| Choose Your Path (5 cards) | Our Services (4 cards: 3 services + CODA/Unit4) | verbatim |
| Community CTA | "Working with you" + contact | verbatim tagline |
| Testimonials | **replaced** — credentials strip | JMD has no testimonials |
| Footer | contact details, location | verbatim |

### Copy that is NOT on JMD's current site

Two slots in this template have no JMD equivalent and needed bridging lines,
both built from their own vocabulary. They are marked `<!-- BRIDGING COPY -->`
in the concept file and must be approved or replaced before any real build:

1. **The Problem / The Success** — JMD's site states the problem ("clients
   ultimately want solutions and not just reports") but never states an outcome.
2. **Testimonials** — the entire section is replaced with verifiable facts,
   because inventing client quotes is not an option.

A real photograph of Jason Dodd is also required for the founder slot; concept
06 uses a monogram plate in that position as a placeholder.
