# JMD Consulting — homepage concepts

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
  04 Yolkk, 05 Immersive Garden, the 07 Harrogate picker, and the cloud plates
  from an intro that was tried and reverted). Safe to delete.
- `PFG-TEMPLATE.md` records the measured template concept 06 reproduces.
- `PRODUCT.md` carries the product context and constraints.
- A full build should move to Astro, matching the sibling projects.
