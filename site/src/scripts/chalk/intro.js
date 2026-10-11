/* ── First-load intro: "Typeset" ─────────────────────────────────────────
   The gate in the layout's <head> decides whether it plays: the home page,
   once a session, never on an anchored visit, never under reduced motion.
   (?intro on the address replays it, for review.)

   The hero's headline is set on a clean chalk page at its true size and
   line breaks. Each line is written in left to right behind a soft-edged
   wipe, the next line starting as the one above finishes, at an even pace.
   The set headline then glides into its exact place on the hero, the logo
   drops in above it, and the chalk cover fades away to reveal the page.

   Any pointer, key, wheel or touch ends it at once; it ends six seconds
   after the setting begins (nine at the very most, if the font is slow);
   a phone runs a quarter quicker. */
import { gsap } from 'gsap';

const root = document.documentElement;
const ov = document.getElementById('intro');

(function () {
  if (!ov) return;
  if (!root.classList.contains('intro-on')) { ov.setAttribute('hidden', ''); return; }

  const real = document.querySelector('.room__card .mk');
  const h = document.querySelector('.torchwrap h1');
  const ghost = ov.querySelector('.intro__mk');
  const paper = ov.querySelector('.intro__paper');
  const layer = ov.querySelector('.intro__layer');
  const Q = innerWidth < 720 ? 0.75 : 1;
  const tl = gsap.timeline({ paused: true, onComplete: finish });
  const inputs = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
  let done = false;
  /* development only: lets a hidden browser be stepped to a given moment */
  if (import.meta.env.DEV) window.__intro = tl;

  function finish() {
    if (done) return;
    done = true;
    tl.kill();
    root.classList.remove('intro-on', 'intro-typeset');
    ov.setAttribute('hidden', '');
    inputs.forEach((t) => removeEventListener(t, finish, true));
  }
  if (!real || !h) { finish(); return; }
  inputs.forEach((t) => addEventListener(t, finish, true));
  setTimeout(finish, 9000);              /* absolute cap, whatever happens */
  if (scrollY) { const sb = root.style.scrollBehavior; root.style.scrollBehavior = 'auto'; scrollTo(0, 0); root.style.scrollBehavior = sb; }
  root.classList.add('intro-typeset');   /* the real headline waits underneath */

  /* the ghost logo: a copy of the hero's, ids renamed so they stay unique */
  const svg = real.cloneNode(true);
  svg.removeAttribute('role'); svg.setAttribute('aria-hidden', 'true');
  svg.querySelector('title')?.remove();
  svg.querySelectorAll('[id]').forEach((el) => {
    const was = el.id; el.id = `${was}-intro`;
    svg.querySelectorAll(`[clip-path="url(#${was})"]`).forEach((u) => u.setAttribute('clip-path', `url(#${el.id})`));
  });
  ghost.appendChild(svg);
  gsap.set(svg, { opacity: 0 });

  /* the headline can only be set once its face has arrived: measured in a
     fallback font it would break into different lines from the real one.
     The cover is already up, so the wait is invisible; it is capped. */
  const faces = document.fonts
    ? Promise.all(['300 1em Spectral', 'italic 300 1em Spectral'].map((f) => document.fonts.load(f))).then(() => document.fonts.ready)
    : Promise.resolve();
  Promise.race([faces, new Promise((res) => setTimeout(res, 2500))]).then(() => { if (!done) build(); });

  function build() {
  setTimeout(finish, 6000);              /* six seconds from the moment the setting begins */
  /* ── the headline, set at its true size and measure, centred ───────── */
  const r = h.getBoundingClientRect(), cs = getComputedStyle(h);
  const t = document.createElement('div');
  t.className = 'intro__type';
  t.innerHTML = h.innerHTML;
  for (const k of ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'color']) t.style[k] = cs[k];
  t.style.width = `${r.width}px`;
  t.style.left = `${(innerWidth - r.width) / 2}px`;
  t.style.top = `${(innerHeight - r.height) / 2}px`;
  layer.appendChild(t);

  /* find the lines exactly as the browser breaks them: split on ordinary
     spaces (so 'Since 2000', joined by a non-breaking space, stays one
     unit), note which words sit in the italic clause, read where each
     lands, then rebuild the headline as one block per line. The breaks are
     the browser's own, so the layout does not move. */
  const words = [];
  (function wrap(node, em) {
    [...node.childNodes].forEach((ch) => {
      if (ch.nodeType !== 3) { wrap(ch, em || ch.nodeName === 'EM'); return; }
      ch.textContent.split(/ +/).filter(Boolean).forEach((txt) => words.push({ txt, em }));
    });
  })(t, false);
  /* the italic clause stays one <em>, spaces and all: an italic space is a
     touch narrower than a roman one, enough to move a line break */
  const html = (list, mark) => {
    let out = '', open = false;
    list.forEach((w, i) => {
      if (w.em && !open) { out += (i ? ' ' : '') + '<em>'; open = true; }
      else if (!w.em && open) { out += '</em> '; open = false; }
      else if (i) out += ' ';
      out += mark ? `<span data-i="${w.i}">${w.txt}</span>` : w.txt;
    });
    return out + (open ? '</em>' : '');
  };
  words.forEach((w, i) => { w.i = i; });
  t.innerHTML = html(words, true);
  const rows = [];
  t.querySelectorAll('span').forEach((s) => {
    const top = Math.round(s.getBoundingClientRect().top);
    let row = rows.find((x) => Math.abs(x.top - top) < 4);
    if (!row) rows.push(row = { top, words: [] });
    row.words.push(words[+s.dataset.i]);
  });
  rows.sort((a, b) => a.top - b.top);
  t.innerHTML = '';
  const lines = rows.map((row) => {
    const line = document.createElement('div');
    line.className = 'intro__line';
    line.innerHTML = html(row.words, false);
    t.appendChild(line);
    return line;
  });

  /* ── the writing: a feathered wipe crosses each line, left to right ── */
  const widths = lines.map((l) => { const rg = document.createRange(); rg.selectNodeContents(l); return rg.getBoundingClientRect().width; });
  const maxW = Math.max(...widths);
  let at = 0.25 * Q;
  lines.forEach((line, i) => {
    const dur = (0.36 + 0.42 * widths[i] / maxW) * Q;     /* longer lines take longer: an even hand */
    gsap.set(line, { '--p': '-18%' });
    tl.to(line, { '--p': '100%', duration: dur, ease: 'sine.inOut' }, at);
    at += dur * 0.8;                                      /* the next line starts as this one finishes */
  });
  const written = at + 0.2 * Q;

  /* ── into place: the headline glides home, the logo drops in above ── */
  let m;
  tl.call(() => { m = null; }, null, written - 0.001)
    .to(t, {
      x: () => (m ||= offset(t, h)).x, y: () => (m ||= offset(t, h)).y,
      duration: 0.9 * Q, ease: 'expo.inOut',
    }, written);
  const seated = written + 0.5 * Q;
  let g;
  tl.call(() => { g = null; }, null, seated - 0.001)
    .to(ghost, {
      x: () => (g ||= place()).x, y: () => (g ||= place()).y, scale: () => (g ||= place()).s,
      duration: 0.001,
    }, seated)
    .fromTo(svg, { opacity: 0, yPercent: -8 }, { opacity: 1, yPercent: 0, duration: 0.7 * Q, ease: 'expo.out', immediateRender: false }, seated + 0.05);

  /* ── the reveal: the chalk cover fades away to the page beneath ───── */
  tl.to(paper, { opacity: 0, duration: 0.9 * Q, ease: 'power2.inOut' }, seated + 0.25 * Q);

  tl.play();
  }

  function offset(a, b) { const p = a.getBoundingClientRect(), q = b.getBoundingClientRect(); return { x: q.left - p.left, y: q.top - p.top }; }
  function place() { const p = ghost.getBoundingClientRect(), q = real.getBoundingClientRect(); return { x: q.left - p.left, y: q.top - p.top, s: q.width / p.width }; }
})();
