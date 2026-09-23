# JMD Consulting — homepage concepts

Three homepage directions for **JMD Consulting**, an independent finance-systems
consultancy in Harrogate, North Yorkshire (founded 2000; CODA/Unit4 Financials®
and NetSuite® on MS SQL Server® or Oracle®).

Each concept is a hero plus one content section — enough to settle a visual
direction before a full site is built.

## Run it

```bash
python3 serve.py
```

Then open <http://localhost:8745>. Click `02` / `06` / `08` in the bar at the
bottom to move between concepts, or press the number keys.

## The concepts

| | Concept | Direction |
|---|---|---|
| 02 | **Montfort** | Near-monochrome cloud and slate blue, wide-tracked light caps. Snow-capped summit hero. |
| 06 | **Path for Growth** | Oswald + Lora, cream and tan, square corners. Harrogate hero under a left-to-right cream wash. |
| 08 | **Chalk** | Client-supplied. Spectral + Martian Mono, chalk blue, navy and ochre, with a first-load intro. |

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

Concept 06's founder block needs a real photograph of Jason Dodd; it currently
uses a monogram plate labelled as a placeholder.

## Notes

- `_archive/` holds dropped concepts and unused assets. Safe to delete.
- `PFG-TEMPLATE.md` records the measured template concept 06 reproduces.
- `PRODUCT.md` carries the product context and constraints.
- A full build should move to Astro, matching the sibling projects.
