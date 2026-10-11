---
target: home page, mobile then laptop
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
timestamp: 2026-10-11T15-25-10Z
slug: site-src-pages-index-astro
---
# Critique: JMD Consulting home page (mobile 375×812, then laptop 1440×900 / 1280×800)

Method: dual-agent (A: design review · B: detector + browser evidence)

## Design Health Score
| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 2 | Rail shows "Home" through all four notes; never marks the note being read |
| 2 | Match system / real world | 2 | h1 never says finance, CODA or NetSuite; "Note 1" filing labels are a designer's metaphor |
| 3 | User control and freedom | 3 | Intro skippable; mobile scroll-snap + 100svh notes adds drag |
| 4 | Consistency and standards | 2 | "All four services" under three; ghost figures keep 40px browser margin |
| 5 | Error prevention | 3 | Good blur validation; demo status only revealed after sending |
| 6 | Recognition rather than recall | 3 | Mobile header hides "4 Enquiry" off-screen |
| 7 | Flexibility and efficiency | n/a | Persuade surface, no repeat tasks |
| 8 | Aesthetic and minimalist design | 2 | Logo ×3, labels repeat headings, empty evidence slots |
| 9 | Error recovery | 3 | Specific messages, focus to first bad field |
| 10 | Help and documentation | n/a | Phone/email beside form covers it |
| Total | | 20/32 | Acceptable (63%) |

## Design specificity
Visual layer authored (filing notes, chalk/Harrogate Blue, Spectral + Martian Mono, logo-built intro, "Tell us what the system is doing"). Content layer interchangeable (handshake/tower/team stock, numbered 3-service grid, dash claims). Product truth buried: h1 never names the systems; "CODA since 1990" only in footer; c.100 clients absent.
Detector: CLI 0 findings. Browser overlay mobile 6 / laptop 18; real: desktop functional text 10.2–11.4px (CTA 10.88px, scope tags 10.56px), footer legal 3.22:1, asterisks 4.10:1, desktop contact links 20–24px tall, hero JPEGs 310–614KB no srcset. False positives: torch gradient/occlusion (approved), cramped-padding on fixed-height btn, hidden .err all-caps, ghost stripes.

## Priority issues
- [P1] Mobile: sticky .note__ref (chalk.css:414, sticky at all widths, transparent) slides over content — Note 1 tags and "All four services", Note 2 claim, Note 4 h2; sits on "Working with you" in Note 3. Fix: static below 900px. — adapt
- [P1] First screen never says what JMD does; finance/CODA/NetSuite first named ~2,000–2,400px down. Fix: verbatim strapline or mono line of the four systems under the h1. — clarify
- [P1] Three "awaiting content" boxes immediately before the form; also inset 40px by figure default margin, infinite breathing animation. Fix: home shows the factual record (CODA since 1990, formed 2000, c.100 clients, four regions); keep held-open slots on /evidence/; margin:0. — distill, polish
- [P2] CTA label 10.88px laptop / 12px mobile, quieter than the 15px caps note under the form; mobile header strip hides "4 Enquiry". Fix: label ≥13–14px; Enquiry always visible on mobile. — typeset, layout
- [P2] Laptop rail: five 1.95rem links beside the h1 compete with it; compact rail lies over the Note 3 photo with poor contrast. Fix: quieter on hero, chalk backing over imagery. — quieter, layout

## Persona red flags
Jordan: h1 doesn't say finance systems; "All four services" under three; rail "Services" vs Note 1 "Solutions & Services".
Riley: labels overlap on mobile; ghost inset; no demo notice before send; "usually the same working day" unsourced; footer legal 3.2:1.
Casey: Enquiry off-screen in header; header hides on scroll-down; 7,438px page with snap gaps.
Finance director: multi-company/multi-currency proof is a 10.56px tag; since-1990 in footer only; handshake stock + empty testimonials read as a thin firm.

## Minor observations
Mobile: scope tags wrap with leading "·"; Regions/Formed values misaligned; enq__note caps reads as shouting; bottom third of hero bare photo. Laptop: h1 15ch forces "One family of / systems."; .quote--signed inset by figure margin; mono labels 11.44px; footer links 24px tall.

## Questions
1. Strongest true claim is CODA since 1990 — why does the hero lead with Since 2000?
2. Do three empty testimonial boxes earn a place on the home page?
3. "Every enquiry is read by a consultant… usually the same working day" isn't in CONTENT-SOURCE.md — client-approved?
