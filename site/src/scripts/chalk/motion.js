/* ── Chalk: motion ─────────────────────────────────────────────────────────
   One easing family throughout (expo out for arrivals, sine for scrubbed
   travel), durations scaled to distance. Every effect explains something:
   a heading sets itself, a photograph is uncovered, a wire connects two
   systems, a ring measures distance, a line keeps time. Nothing loops
   unless it is on screen, and nothing runs under reduced motion: the page
   is complete without any of it. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

const root = document.documentElement;
const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
const EASE = 'expo.out';

if (!still) {
  gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);
  /* development only: lets a hidden browser (which pauses animation frames)
     be stepped by hand when checking the motion */
  if (import.meta.env.DEV) Object.assign(window, { gsap, ScrollTrigger });
  gsap.defaults({ ease: EASE, duration: 1.1 });
  const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  /* the intro owns the first seconds of a home visit: wait for it */
  const introDone = new Promise((res) => {
    if (!root.classList.contains('intro-on')) return res();
    const mo = new MutationObserver(() => { if (!root.classList.contains('intro-on')) { mo.disconnect(); res(); } });
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
    setTimeout(res, 6500);
  });
  ready.then(() => { splitAll(); scenes(); introDone.then(entrance); });
  addEventListener('load', () => ScrollTrigger.refresh());
  /* a sent enquiry shortens the page: everything below it is re-measured */
  document.addEventListener('enquiry:sent', () => setTimeout(() => ScrollTrigger.refresh(), 700));
}

/* ── headings: each line rises out of its own mask ──────────────────── */
function splitAll() {
  document.querySelectorAll('[data-split]').forEach((el) => {
    const s = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
      onSplit(self) {
        el.classList.add('is-split');
        if (el.closest('.phead')) { gsap.set(self.lines, { yPercent: 108 }); return; }
        return gsap.from(self.lines, { yPercent: 108, duration: 1.15, stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      } });
    el._split = s;
  });
}

/* ── the page head arrives as one sequence ──────────────────────────── */
function entrance() {
  const head = document.querySelector('.phead');
  if (!head) return;
  const tl = gsap.timeline({ defaults: { ease: EASE } });
  const img = head.querySelector('.hero__img');
  if (img) tl.fromTo(img, { scale: 1.06 }, { scale: 1, duration: 1.4, ease: 'power3.out' }, 0);
  const bar = head.querySelector('.phead__ref .bar');
  if (bar) tl.from(bar, { scaleX: 0, duration: 0.6 }, 0);
  tl.from(head.querySelectorAll('.phead__ref > :not(.bar)'), { opacity: 0, x: -6, duration: 0.5, stagger: 0.04 }, 0.02);
  const h = head.querySelector('[data-split]');
  if (h && h._split) tl.to(h._split.lines, { yPercent: 0, duration: 0.75, stagger: 0.05 }, 0.02);
  tl.from(head.querySelectorAll('.phead__lede, .phead__acts'), { opacity: 0, y: 10, duration: 0.6, stagger: 0.06 }, 0.12);
  /* afterwards the photograph drifts slower than the page */
  if (img) gsap.to(img, { yPercent: 9, ease: 'none', scrollTrigger: { trigger: head, start: 'top top', end: 'bottom top', scrub: true } });
}

function scenes() {
  rises(); photos(); bands(); rules(); ink(); chapters(); odometers(); signature(); timeline(); magnets(); homeHero();
}

/* ── groups that arrive together, in reading order ─────────────────── */
function rises() {
  document.querySelectorAll('[data-rise]').forEach((g) => {
    const kids = g.children.length ? [...g.children] : [g];
    gsap.from(kids, { opacity: 0, y: 26, duration: 1.1, stagger: 0.08, clearProps: 'opacity,transform',
      scrollTrigger: { trigger: g, start: 'top 86%', once: true } });
  });
}

/* ── photographs: uncovered by a rising mask, settling as they arrive,
      then drifting a touch against the scroll ─────────────────────── */
function photos() {
  const all = [...document.querySelectorAll('.ph[data-reveal]')];
  /* every photograph starts downloading once the page itself has loaded,
     rather than when the browser's lazy loading decides it is close: the
     first screen is not slowed, and nothing is still arriving as it is
     revealed */
  const fetchAll = () => all.forEach((ph) => { const img = ph.querySelector('img'); if (img.loading === 'lazy') img.loading = 'eager'; });
  if (document.readyState === 'complete') fetchAll(); else addEventListener('load', fetchAll, { once: true });

  all.forEach((ph) => {
    const img = ph.querySelector('img');
    const reveal = gsap.timeline({ paused: true })
      .to(ph, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.out' })
      .fromTo(img, { scale: 1.18 }, { scale: 1.06, duration: 1.6, ease: 'power3.out' }, 0);
    gsap.set(ph, { clipPath: 'inset(100% 0% 0% 0%)' });
    /* the reveal starts as the photograph's top edge enters the window; if
       its file has not arrived yet, it waits for it, so a blank frame is
       never what is uncovered */
    ScrollTrigger.create({ trigger: ph, start: 'top bottom', once: true, onEnter: () => {
      if (img.complete && img.naturalWidth) reveal.play();
      else { img.loading = 'eager'; img.addEventListener('load', () => reveal.play(), { once: true }); img.addEventListener('error', () => reveal.play(), { once: true }); }
    } });
    gsap.fromTo(img, { yPercent: -3 }, { yPercent: 3, ease: 'none',
      scrollTrigger: { trigger: ph, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}
function bands() {
  document.querySelectorAll('.band img').forEach((img) => {
    gsap.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* ── hairlines draw across in turn ─────────────────────────────────── */
function rules() {
  document.querySelectorAll('[data-rules]').forEach((list) => {
    gsap.fromTo(list.children, { '--sx': 0 }, { '--sx': 1, duration: 1.1, stagger: 0.09, ease: 'expo.inOut',
      scrollTrigger: { trigger: list, start: 'top 86%', once: true } });
  });
}

/* ── the statement inks in, word by word, as it is read ────────────── */
function ink() {
  document.querySelectorAll('.ink').forEach((q) => {
    const s = SplitText.create(q.querySelector('blockquote') || q, { type: 'words', wordsClass: 'w' });
    q.classList.add('armed');
    gsap.to(s.words, { '--wo': 1, stagger: 0.08, ease: 'none',
      scrollTrigger: { trigger: q, start: 'top 78%', end: 'bottom 48%', scrub: 0.6 } });
  });
}

/* ── Services: the numeral beside the chapters changes with the chapter,
      the spine fills with progress through them ───────────────────── */
function chapters() {
  const wrap = document.querySelector('.chaps');
  if (!wrap) return;
  const chs = [...wrap.querySelectorAll('.chap')];
  const num = wrap.querySelector('.chaps__num span'), lbl = wrap.querySelector('.chaps__lbl');
  const set = (i) => {
    if (num) num.style.transform = `translateY(${-i * 100 / chs.length}%)`;   /* % of the whole stack */
    if (lbl) lbl.textContent = chs[i].dataset.label || '';
  };
  chs.forEach((c, i) => ScrollTrigger.create({ trigger: c, start: 'top 55%', end: 'bottom 55%',
    onEnter: () => set(i), onEnterBack: () => set(i) }));
  const list = wrap.querySelector('.chaps__list');
  gsap.fromTo(wrap, { '--chap-p': 0 }, { '--chap-p': 1, ease: 'none',
    scrollTrigger: { trigger: list, start: 'top 55%', end: 'bottom 70%', scrub: true } });
}

/* ── figures wind up to their value, a digit column each ──────────── */
function odometers() {
  document.querySelectorAll('[data-odo]').forEach((el) => {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';
    el.classList.add('odo');
    const cols = [...text].map((ch, i) => {
      const d = document.createElement('span'); d.className = 'odo__d'; d.setAttribute('aria-hidden', 'true');
      if (!/\d/.test(ch)) { d.textContent = ch; el.appendChild(d); return null; }
      const strip = document.createElement('span'); strip.style.display = 'block';
      for (let k = 0; k <= 9; k++) { const n = document.createElement('i'); n.textContent = k; strip.appendChild(n); }
      d.appendChild(strip); el.appendChild(d);
      return { strip, v: +ch, i };
    }).filter(Boolean);
    cols.forEach((c) => gsap.set(c.strip, { yPercent: 0 }));
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      .add(cols.map((c, j) => gsap.to(c.strip, { yPercent: -c.v * 10, duration: 1.6 + (cols.length - j) * 0.18, ease: 'expo.out' })), 0);
  });
}

/* ── the footer: the wordmark is signed off by one pen ──────────────
      As the footer comes up, the figures ink in and one pen writes every
      stroke of the wordmark in reading order at a steady pace, lifting
      between letters so the hand never stops (the intro's earlier "Draft"
      writing, at footer scale). Once a page. The logo is complete until
      this arms it, and under reduced motion it is never armed. */
function signature() {
  document.querySelectorAll('[data-sign] svg').forEach((svg) => {
    const fj = svg.querySelector('.lg-j'), fm = svg.querySelector('.lg-md'), word = svg.querySelector('.lg-word');
    if (!word) return;
    /* each letter stroke becomes its own path, its clip kept */
    const strokes = [];
    [...word.querySelectorAll('path')].forEach((p) => {
      p.getAttribute('d').split(/(?=M)/).filter(Boolean).forEach((d) => {
        const q = p.cloneNode(false); q.setAttribute('d', d); word.insertBefore(q, p); strokes.push({ el: q, d });
      });
      p.remove();
    });
    /* which way a hand writes each stroke: zig-zags (M, N) from the bottom
       left, upright strokes from the top, the rest from the left; closed
       letters keep their own start. A backwards stroke is drawn from its
       far end by running the dash the other way. */
    strokes.forEach((s) => {
      const L = s.el.getTotalLength(), a = s.el.getPointAtLength(0), b = s.el.getPointAtLength(L);
      const closed = /Z\s*$/i.test(s.d), zig = !closed && /^M[^C]*$/.test(s.d) && (s.d.match(/L/g) || []).length >= 3;
      let rev = false;
      if (!closed) {
        if (zig) rev = b.y > a.y + 1 || (Math.abs(b.y - a.y) <= 1 && b.x < a.x);
        else if (Math.abs(b.y - a.y) > Math.abs(b.x - a.x)) rev = b.y < a.y;
        else rev = b.x < a.x;
      }
      Object.assign(s, { L, rev, from: rev ? b : a, to: rev ? a : b, left: s.el.getBBox().x });
    });
    strokes.sort((m, n) => m.left - n.left);
    /* the pen's journey: strokes at writing speed, the lifted pen crossing
       to the next start a little faster */
    const LIFT = 2.4, legs = [];
    let cost = 0, prev = null;
    strokes.forEach((s) => {
      if (prev) { const d = Math.hypot(s.from.x - prev.x, s.from.y - prev.y) / LIFT; legs.push({ write: false, a: prev, b: s.from, c0: cost, c1: cost + d }); cost += d; }
      legs.push({ write: true, s, c0: cost, c1: cost + s.L }); cost += s.L;
      prev = s.to;
    });
    /* the nib, sized in screen pixels whatever the logo's size */
    const NS = 'http://www.w3.org/2000/svg', upp = 2364 / Math.max(1, svg.getBoundingClientRect().width);
    const halo = document.createElementNS(NS, 'circle'), nib = document.createElementNS(NS, 'circle');
    for (const [c, r] of [[halo, 5.5], [nib, 1.9]]) { c.setAttribute('r', String(r * upp)); c.setAttribute('fill', '#306AB3'); c.setAttribute('opacity', '0'); }
    svg.append(halo, nib);
    const place = (pt) => { for (const c of [halo, nib]) { c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); } };
    const pen = { c: 0 };
    function render() {
      const c = pen.c;
      for (const g of legs) if (g.write) { const done = Math.min(g.s.L, Math.max(0, c - g.c0)); g.s.el.style.strokeDashoffset = g.s.rev ? -(g.s.L - done) : g.s.L - done; }
      const g = legs.find((l) => c <= l.c1) || legs[legs.length - 1];
      if (g.write) { const done = Math.min(g.s.L, Math.max(0, c - g.c0)); place(g.s.el.getPointAtLength(g.s.rev ? g.s.L - done : done)); halo.setAttribute('r', String(5.5 * upp)); }
      else { const t = (c - g.c0) / Math.max(1e-6, g.c1 - g.c0); place({ x: g.a.x + (g.b.x - g.a.x) * t, y: g.a.y + (g.b.y - g.a.y) * t });
        halo.setAttribute('r', String((5.5 + 2.5 * Math.sin(Math.PI * t)) * upp)); }   /* the pen lifts */
    }
    /* armed: the word unwritten, the figures waiting */
    strokes.forEach((s) => { s.el.style.strokeDasharray = `${s.L} ${s.L}`; s.el.style.strokeDashoffset = s.rev ? -s.L : s.L; });
    place(strokes[0].from);
    gsap.set([fj, fm], { opacity: 0, y: 46 });
    const W = 1.7;
    gsap.timeline({ paused: true, scrollTrigger: { trigger: svg, start: 'top 92%', once: true } })
      .to(fj, { opacity: 1, y: 0, duration: 0.8, ease: EASE }, 0)
      .to(fm, { opacity: 1, y: 0, duration: 0.8, ease: EASE }, 0.12)
      .to([nib, halo], { attr: { opacity: (i) => (i ? 0.16 : 1) }, duration: 0.2, ease: 'none' }, 0.22)
      .to(pen, { c: cost, duration: W, ease: 'none', onUpdate: render }, 0.3)
      .to([nib, halo], { attr: { opacity: 0 }, duration: 0.3, ease: 'none' }, 0.3 + W);
  });
}

/* ── Evidence: the timeline line draws down; each year lights as it is reached ── */
function timeline() {
  document.querySelectorAll('.tl').forEach((tlEl) => {
    tlEl.classList.add('armed');
    gsap.to(tlEl, { '--tl': 1, ease: 'none', scrollTrigger: { trigger: tlEl, start: 'top 70%', end: 'bottom 70%', scrub: true } });
    tlEl.querySelectorAll('li').forEach((li) => ScrollTrigger.create({ trigger: li, start: 'top 70%',
      onEnter: () => li.classList.add('on'), onLeaveBack: () => li.classList.remove('on') }));
  });
}

/* ── calls to action lean towards the pointer, a few pixels at most ── */
function magnets() {
  if (!fine) return;
  document.querySelectorAll('[data-magnetic]').forEach((b) => {
    const xTo = gsap.quickTo(b, 'x', { duration: 0.6, ease: 'power3.out' }), yTo = gsap.quickTo(b, 'y', { duration: 0.6, ease: 'power3.out' });
    b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.18); yTo((e.clientY - r.top - r.height / 2) * 0.28); });
    b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

/* ── home: the hero photograph drifts as the page scrolls away from it ── */
function homeHero() {
  const media = document.querySelector('.is-home #hero-media');
  if (!media) return;
  gsap.to(media, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: media.parentElement, start: 'top top', end: 'bottom top', scrub: true } });
}
