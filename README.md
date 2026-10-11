# JMD Consulting

The JMD Consulting website: the Chalk design, built as a ten-page Astro site in
`site/`.

```bash
cd site && npm install && npm run dev
```

Then open <http://localhost:8750>.

## Pages

Built to the scope of the Alvex "Sky Is The Limit" package: unlimited pages, a
bespoke system, scroll motion throughout, a branded loading screen, and a news
section.

| Page | Carries |
|---|---|
| Home `/` | Hero with the logo; services, systems, reach and evidence in brief, each leading on to its own page; the enquiry form |
| 1 Services | The four services as chapters beside a pinned numeral and progress spine; the practice's statement |
| 2 Systems | The integration diagram (finance systems → integration → databases); the systems ledger; the three claims |
| 3 Reach | Distance from Harrogate as rings; travel; the base |
| 4 Evidence | Odometer figures (1990, 2000, c.100, 4 regions); the track-record timeline; the held-open testimonial slots |
| 5 Notes | Three practice notes (`/notes/…`), bodies verbatim from the live site |
| 6 Enquiry | The enquiry form (demonstration only), contact details, finding the practice |

## Motion

GSAP 3.15 (ScrollTrigger, SplitText, MotionPath), in
`src/scripts/chalk/motion.js`:

- *Intro* — the "Struck" loading screen: the two figures of the logo close and
  meet, the wordmark prints, the logo flies into the hero. Home only, once a
  session (`sessionStorage`), never on an anchored visit.
- *Between pages* — native cross-document View Transitions: the header and the
  rail hold still, the old page lifts and softens away, the new one rises, and
  its heading sets itself line by line. Chrome, Edge and Safari 18.2+; other
  browsers simply navigate.
- *On scroll* — headings rise line by line from their own masks; photographs are
  uncovered by a rising mask and drift against the scroll; hairlines draw; the
  Services numeral and spine track the chapter; the statement inks in word by
  word; the systems diagram wires itself up and carries data packets; the reach
  rings expand from Harrogate; the figures wind up on odometers; the timeline
  draws and lights each year.
- *Feedback* — the docking rail's magnetic pull, button sheen, magnetic calls to
  action, underlines that draw, a reading-progress hairline, a header that steps
  aside on the way down.

Content is visible without scripts. Starting states only apply once a script has
armed them (split headings also carry a 2.5s CSS failsafe), loops pause off
screen, and `prefers-reduced-motion` gets a fully static site.

## The logo

The hero, header and footer carry the client's own logo
(`public/assets/chalk/jmd-logo.svg`, inlined by `src/components/chalk/Logo.astro`),
redrawn from the 307×125 JPEG on jmdconsulting.co.uk with its inks unchanged
(blue `#306AB3`, grey `#D0D0D0`) and no background. Every shape sits where the
JPEG has it, with clean edges: the heads are true circles; the figures' straight
edges are exactly straight, corners rebuilt where those edges meet; the wordmark
is monoline strokes along each letter's own centreline at the original's
measured weight (2.42px at source size), every letter on one cap height and one
baseline (94.31 and 112.56px), round letters overshooting by a uniform 0.2px.
The SVG keeps the logo's three parts as separate groups (grey figure, blue
figure, wordmark), which the intro assembles.

## Content

Facts and body copy come from `src/data/content.ts` and `src/data/chalk.ts`, both
JMD's own wording from the live site — see `CONTENT-SOURCE.md` for the full
inventory and the source typos that were corrected. No client names,
testimonials, metrics or addresses are invented.

A few headings, the Notes titles and standfirsts, and two section ledes had no
source; each is marked *bridging* in a comment beside it and needs the client's
approval.

**Positioning.** The site presents JMD as a practice, not an individual. The live
site names Jason Dodd as Managing Director and attributes its central quote to
him; at the client's direction the quote is kept verbatim but attributed to JMD
Consulting, and the copy is plural throughout — as JMD's own wording already is
("our consultancy", "our team", "we specialise"). No team size, offices or named
staff are claimed.

The enquiry forms validate, move focus to the first bad field and show a success
state, but **send nothing** — each is marked as a demonstration on the page.

## Photography

Eighteen images generated with Higgsfield (GPT Image 2.5, 1K, high) in
`public/assets/chalk/gen/`, two to three per page, plus the three earlier hero
images and a Harrogate view, all to one brief: daylight, chalk white, pale steel
and navy, candid, no text or logos. They are for review; none is presented as
JMD's own office or staff, and a live build wants licensed stock or a
commissioned shoot.

## Verified

- Ten pages build clean; zero broken internal links or images; one `h1`, a
  title, a description and a `main` landmark on every page.
- Every scroll scene ends in its final, fully visible state.
- No horizontal scroll at 375px or 1440px; every control at least 44px; no text
  below 12px.
- `prefers-reduced-motion` gives a static site.
