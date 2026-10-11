/* ── First-load intro: "Typeset" ─────────────────────────────────────────
   The gate in the layout's <head> decides whether it plays: the home page,
   on every reload and every arrival from outside the site, but not on a
   move to Home from another page, an anchored visit, or reduced motion.
   (?intro on the address always plays it.)

   The hero's headline is set on a clean chalk page at its true size and
   line breaks. Each line is written in left to right behind a soft-edged
   wipe, the next line starting as the one above finishes, at an even pace.
   The headline is written where it sits beside the logo on the hero, the
   pair centred as one. When the writing is complete the logo comes up
   above it; then logo and headline move home together, and the chalk
   cover fades away to reveal the page.

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
  /* the logo and headline are composed as they are on the hero: the pair
     is centred as one group, so the headline is written where it belongs
     in that group and the logo's space is waiting above it */
  const L = real.getBoundingClientRect();
  const gl = Math.min(L.left, r.left), gt = Math.min(L.top, r.top);
  const gw = Math.max(L.right, r.right) - gl, gh = Math.max(L.bottom, r.bottom) - gt;
  const shift = { x: (innerWidth - gw) / 2 - gl, y: (innerHeight - gh) / 2 - gt };
  t.style.width = `${r.width}px`;
  t.style.left = `${r.left + shift.x}px`;
  t.style.top = `${r.top + shift.y}px`;
  /* the logo, seated above it at its hero size and spacing (the ghost's
     own resting box is centred, so it is moved from there) */
  const rest = ghost.getBoundingClientRect();
  gsap.set(ghost, { x: L.left + shift.x - rest.left, y: L.top + shift.y - rest.top, scale: L.width / rest.width });
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
  /* the pauses between stages were each trimmed by 0.1s on review */
  const written = at + 0.2 * Q - 0.1;

  /* ── the logo comes up above the finished headline ───────────────── */
  tl.fromTo(svg, { opacity: 0, yPercent: 14 }, { opacity: 1, yPercent: 0, duration: 0.75 * Q, ease: 'expo.out', immediateRender: false }, written - 0.15 * Q);

  /* ── the pair moves home together: one curve, one duration, each landing
     measured as the move begins ─────────────────────────────────────── */
  const go = written + 0.5 * Q;
  let m, g;
  tl.call(() => { m = null; g = null; }, null, go - 0.001)
    .to(t, {
      x: () => (m ||= offset(t, h)).x, y: () => (m ||= offset(t, h)).y,
      duration: 1.0 * Q, ease: 'expo.inOut',
    }, go)
    .to(ghost, {
      x: () => (g ||= home()).x, y: () => (g ||= home()).y, scale: () => (g ||= home()).s,
      duration: 1.0 * Q, ease: 'expo.inOut',
    }, go);

  /* ── the reveal: the chalk cover fades away as they arrive ─────────── */
  tl.to(paper, { opacity: 0, duration: 0.9 * Q, ease: 'power2.inOut' }, go + 0.45 * Q);

  tl.play();
  }

  function offset(a, b) { const p = a.getBoundingClientRect(), q = b.getBoundingClientRect(); return { x: q.left - p.left, y: q.top - p.top }; }
  /* where the ghost must be moved, from its own resting box, to sit on the
     real logo (measured now: the hero may have settled since) */
  function home() { const q = real.getBoundingClientRect(), p = restBox(); return { x: q.left - p.left, y: q.top - p.top, s: q.width / p.width }; }
  function restBox() { const keep = ghost.style.transform; ghost.style.transform = 'none'; const b = ghost.getBoundingClientRect(); ghost.style.transform = keep; return b; }
})();
