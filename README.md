# JMD Consulting

Two things live here: the **full site build** in `site/`, and the original
**single-page concepts** in `concepts/` that it was chosen from.

## The site — `site/`

Five pages, built twice, from one shared set of content.

```bash
cd site && npm install && npm run dev
```

Then open <http://localhost:4800>. The root is a picker; the two builds are at
`/montfort/` and `/growth/`.

A switcher sits at the foot of every page and links to **the same page in the
other build** — Services to Services, Contact to Contact — so comparison is like
for like rather than dropping you back on a homepage. `V` flips between them. It
is review chrome, deliberately neutral, and comes out with
`src/components/VersionSwitch.astro` once a direction is chosen.

| Page | Carries |
|---|---|
| Home | Hero, the problem/guide/success framing, services summary, the practice's statement, credentials |
| Services | All four disciplines in full, with their capability lists |
| Systems | CODA/Unit4, NetSuite, SQL Server, Oracle, and the supporting notes |
| About | The practice, Harrogate and reach, credentials, the open testimonial slots |
| Contact | Enquiry form plus telephone, email, base and regions |

**Every word on both builds comes from `src/data/content.ts`.** That is deliberate:
the two designs cannot drift apart, and a copy change is made once. Lines with no
equivalent on the live site are flagged `bridging: true` in that file.

The enquiry form validates, moves focus to the first bad field and shows a success
state, but **sends nothing** — it is marked as a demonstration on the page itself.
Wiring it to a handler is a small change in `src/components/EnquiryForm.astro`.

### Verified

- 11 pages build clean; **zero broken internal links**.
- One `h1`, a title, a description and a `main` landmark on every page.
- No horizontal scroll at 375px or 1440px; every control at least 44px; no text
  below 12px; form inputs at 16px so iOS does not zoom on focus.
- Hero text contrast measured against the **real composited pixels** behind it,
  not the CSS background. Montfort: h1 9.91, lede 6.99, caps 7.71 on desktop;
  11.32 / 7.23 / 7.73 on a phone.
- Mobile nav opens and closes with correct `aria-expanded`; form blocks an empty
  submit, shows five field errors and moves focus.

## The concepts — `concepts/`

Single-page explorations, served separately:

```bash
python3 serve.py
```


Three homepage directions for **JMD Consulting**, an independent finance-systems
consultancy in Harrogate, North Yorkshire (founded 2000; CODA/Unit4 Financials®
and NetSuite® on MS SQL Server® or Oracle®).

Concepts 02 and 06 are now full single-page sites. Each carries all of concept
08's content (services with scope lists, Jason's statement, systems, Harrogate
and reach, held-open testimonial slots, the enquiry form, and the full footer)
in its own design language.

## Run it

```bash
python3 serve.py
```

Then open <http://localhost:8745>. Click the entries in the bar at the bottom to
move between pages, or press the matching number key.

## The concepts

| | Concept | Direction |
|---|---|---|
| 02 | **Montfort** | Near-monochrome cloud and slate blue, wide-tracked light caps. Snow-capped summit hero. |
| 06 | **Path for Growth** | Oswald + Lora, cream and tan, square corners. Harrogate hero under a left-to-right cream wash that clears at 84%. |
| 08 | **Chalk** | Client-supplied. Spectral + Martian Mono, chalk blue, navy and ochre, with a first-load intro. |

`09 Joe` is a scratch page, not a concept — a single name on a blank ground.

### Concept 06: phone hero is still undecided

Desktop is settled. On a phone the photograph has three switchable homes,
picked from a phone-only control at the top right or by pressing `M`:

- **Full** — the picture covers the whole background under a cream veil that
  eases off below the buttons.
- **Column** — the laptop axis kept: the wash clears a column on the right and
  the copy is held to a column of its own.
- **Band** — the picture sits below the words with nothing over it, with the
  credential strip pushed past the fold so the band lands inside the first screen.

All three are review scaffolding. Once one is chosen, the other two and the
picker should come out.

### Concept 08: hero shortlist

The client has chosen 08 and asked for it to look more like an established
business. Two hero treatments are shortlisted; step between them with the
picker (top right; above the switcher on a phone) or the ← → keys.
`?view=B3` opens on one.

| View | Hero image | Layout |
|---|---|---|
| **A1** | `hero-01` single glass tower | **Editorial**: full-bleed hero under a chalk veil; Note 2 opens on a wide framed photograph |
| **B3** | `hero-02` towers converging overhead | **Duotone**: both pictures re-printed in chalk and navy; Note 2 opens on a full-bleed band |

Both use `hero-08` (the handshake) in Note 2.

**Moving reflections.** Soft clouds of different sizes drift slowly across
the buildings' glass in either hero (the `hero-reflections` script). The
glass is found from the photograph itself — the window grid is textured,
the sky is smooth — so it follows whichever image is showing, and the
clouds are screened so they only lift the darker panes. A crossing takes
roughly 1.5–3 minutes. It pauses off screen and in a hidden tab, and does
not run at all under `prefers-reduced-motion`.

`hero-15` (a team reviewing charts around a screen) now sits in **Note 3**
(Reach), in two versions chosen independently of the hero. The picker's Note 3
entries jump straight to it; `?view=A1&n3=2` opens on a combination.

| Note 3 | Treatment |
|---|---|
| 1 ★ | **Portrait**: the copy keeps the left, the team stands beside it as a tall portrait |
| 2 | **Full bleed**: the picture fills the note from the copy's edge to the right of the page, dissolving into the paper on its left (on a phone it follows the copy) |

Under the B3 hero, the Note 3 picture is re-printed in duotone to match.

**Logo** — the hero, header and footer all carry the client's own logo
(`assets/jmd-logo.svg`), traced from the 307×125 JPEG on jmdconsulting.co.uk
with its inks unchanged (blue `#306AB3`, grey `#D0D0D0`) and no white
background, so it sits straight on the page in both colour schemes. The SVG
keeps the logo's three parts as separate groups (grey figure, blue figure,
wordmark), which the first-load intro assembles before flying the logo into
the hero. The original JPEG stays in `assets/` for the untouched
`08-chalk-original.html`.

**Note 2** (Systems) carries the handshake (`hero-08`) as paired with the
hero: a wide framed plate under A1, a full-bleed duotone band under B3.

Everything is in `assets/heroes/08-options/`. The other generated options
and the dropped layouts' images are in `_archive/heroes/08-options-dropped/`.

Once a hero is chosen: keep its image in the markup, set its `data-look` on
`<body>`, set `data-n3` and `data-mk` likewise, and delete the `hero-review` script, the
`.hp` styles and the options not taken.

## Positioning

The site presents JMD as a practice, not an individual. The live site names
Jason Dodd as Managing Director and attributes its central quote to him; that
framing has been **deliberately removed** at the client's direction so the
business reads as a firm with staff. The quote is kept verbatim but attributed
to JMD Consulting, and first-person singular ("tell me", "replies come from
Jason") is now plural throughout.

This is supported by JMD's own wording, which is already plural — "our
consultancy", "our team", "we specialise", "we are able to travel". No claim
about team size, offices or named staff has been invented.

## Content

All copy is JMD's own, taken from the live site — see `CONTENT-SOURCE.md` for the
full inventory and the three source typos that were corrected. Nothing is
invented: no client names, testimonials, metrics or addresses appear anywhere.

Two slots in concept 06 needed bridging copy where JMD's site has no equivalent.
Both are marked `<!-- BRIDGING COPY -->` and need client approval.

## Imagery

Hero and background images were generated, not photographed. They read as
Harrogate but are **not** documentary — no specific building is accurate. A live
build wants licensed stock or a commissioned photographer.

Concept 06's practice block uses a monogram plate over a room photograph. If a
real image is wanted there, it should show the team or the working environment
rather than an individual.

## Verified

- No horizontal scroll at 320px, 375px or 1440px.
- Every control at least 44×44px; no text below 12px.
- Text contrast measured against the real composited pixels behind it rather
  than the CSS background. The tightest figure anywhere is the tan display
  line at 3.94:1 against its 3:1 large-text bar — worth rechecking if the
  hero image is ever swapped for a brighter one.
- `prefers-reduced-motion` respected on every page that animates.

## Notes

- `_archive/` holds dropped concepts and unused assets (01 Son Daven, 03 ERA,
  04 Yolkk, 05 Immersive Garden, the 07 Harrogate picker, the cloud plates
  from an intro that was tried and reverted, and the hero images not
  shortlisted for 08). Safe to delete.
- `PFG-TEMPLATE.md` records the measured template concept 06 reproduces.
- `PRODUCT.md` carries the product context and constraints.
- A full build should move to Astro, matching the sibling projects.
