/* ── First-load intro: "Draft" ────────────────────────────────────────────
   The gate in the layout's <head> decides whether it plays: the home page,
   once a session, never on an anchored visit, never under reduced motion.
   (?intro on the address replays it, for review.)

   The wordmark is written by one pen, stroke after stroke in reading order
   at a steady hand's pace, the nib lifting between letters so the motion
   never stops; the grey and blue figures ink in while it is being written; then the chalk sheet lifts away as the logo
   glides onto the hero. The ghost is a copy of the hero's logo, so the two
   can never drift apart, and it lands exactly on the real one.

   About 3.4s on a desktop, 2.4s on a phone. Any pointer, key, wheel or touch
   ends it at once, and it can never cover the page for more than six
   seconds. */
import { gsap } from 'gsap';

const root = document.documentElement;
const ov = document.getElementById('intro');

(function () {
  if (!ov) return;
  if (!root.classList.contains('intro-on')) { ov.setAttribute('hidden', ''); return; }

  const real = document.querySelector('.room__card .mk');
  const ghost = ov.querySelector('.intro__mk');
  const paper = ov.querySelector('.intro__paper');
  /* pace: every timing below is multiplied by P. 1.35 was chosen on review
     (slower than the first cut); a phone runs at 70% of that */
  const PACE = 1.35;
  const P = PACE * (innerWidth < 720 ? 0.7 : 1);
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' }, onComplete: finish });
  const inputs = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
  let done = false;
  /* development only: lets a hidden browser be stepped to a given moment */
  if (import.meta.env.DEV) window.__intro = tl;

  function finish() {
    if (done) return;
    done = true;
    tl.kill();
    root.classList.remove('intro-on');
    ov.setAttribute('hidden', '');
    inputs.forEach((t) => removeEventListener(t, finish, true));
  }
  if (!real) { finish(); return; }
  inputs.forEach((t) => addEventListener(t, finish, true));
  setTimeout(finish, 6000);
  if (scrollY) { const sb = root.style.scrollBehavior; root.style.scrollBehavior = 'auto'; scrollTo(0, 0); root.style.scrollBehavior = sb; }

  /* the ghost: a copy of the hero logo, ids renamed so they stay unique */
  const svg = real.cloneNode(true);
  svg.removeAttribute('role'); svg.setAttribute('aria-hidden', 'true');
  svg.querySelector('title')?.remove();
  svg.querySelectorAll('[id]').forEach((el) => {
    const was = el.id; el.id = `${was}-intro`;
    svg.querySelectorAll(`[clip-path="url(#${was})"]`).forEach((u) => u.setAttribute('clip-path', `url(#${el.id})`));
  });
  ghost.appendChild(svg);

  /* the flight onto the real logo: measured at the moment it starts, not
     when the intro begins, because the hero below can still be settling
     (its headline font arriving) during the first seconds */
  function flight(at, dur) {
    let m;
    const measure = () => {
      if (!m) { const a = ghost.getBoundingClientRect(), b = real.getBoundingClientRect();
        m = { x: b.left - a.left, y: b.top - a.top, s: b.width / a.width }; }
      return m;
    };
    tl.call(() => { m = null; }, null, at - 0.001);
    tl.to(ghost, { x: () => measure().x, y: () => measure().y, scale: () => measure().s, duration: dur, ease: 'expo.inOut' }, at);
  }

  draft();
  tl.play();

  /* ── Draft ───────────────────────────────────────────────────────────── */
  function draft() {
    const fj = svg.querySelector('.lg-j'), fm = svg.querySelector('.lg-md');
    const word = svg.querySelector('.lg-word');
    const NS = 'http://www.w3.org/2000/svg';

    /* each letter stroke becomes its own path */
    const strokes = [];
    [...word.querySelectorAll('path')].forEach((p) => {
      p.getAttribute('d').split(/(?=M)/).filter(Boolean).forEach((d) => {
        const q = p.cloneNode(false); q.setAttribute('d', d);
        word.insertBefore(q, p);
        strokes.push({ el: q, d });
      });
      p.remove();
    });

    /* which way a hand writes each stroke. Zig-zag letters (M, N) start
       bottom-left; mostly vertical strokes start at the top; the rest
       start at the left. Closed letters (D, O) keep their own start. A
       stroke written backwards is drawn from its far end, which needs no
       change to its geometry: the dash simply runs the other way. */
    strokes.forEach((s) => {
      const L = s.el.getTotalLength(), a = s.el.getPointAtLength(0), b = s.el.getPointAtLength(L);
      const closed = /Z\s*$/i.test(s.d), zig = !closed && /^M[^C]*$/.test(s.d) && (s.d.match(/L/g) || []).length >= 3;
      let rev = false;
      if (!closed) {
        if (zig) rev = b.y > a.y + 1 || (Math.abs(b.y - a.y) <= 1 && b.x < a.x);
        else if (Math.abs(b.y - a.y) > Math.abs(b.x - a.x)) rev = b.y < a.y;
        else rev = b.x < a.x;
      }
      const box = s.el.getBBox();
      Object.assign(s, { L, rev, from: rev ? b : a, to: rev ? a : b, left: box.x });
      s.el.style.strokeDasharray = `${L} ${L}`;
      s.el.style.strokeDashoffset = rev ? -L : L;
    });
    /* reading order: left to right by where each stroke sits */
    strokes.sort((m, n) => m.left - n.left);

    /* the pen's journey: each stroke at writing speed, and between strokes
       the lifted pen crossing to the next start a little faster, so the
       hand never stops — one continuous line of motion */
    const LIFT = 2.4;
    const legs = [];
    let cost = 0, prev = null;
    strokes.forEach((s) => {
      if (prev) { const dist = Math.hypot(s.from.x - prev.x, s.from.y - prev.y) / LIFT;
        legs.push({ kind: 'travel', a: prev, b: s.from, c0: cost, c1: cost + dist }); cost += dist; }
      legs.push({ kind: 'write', s, c0: cost, c1: cost + s.L }); cost += s.L;
      prev = s.to;
    });

    /* the nib: a point of ink with a soft halo, riding the end of the line */
    const halo = document.createElementNS(NS, 'circle'), nib = document.createElementNS(NS, 'circle');
    halo.setAttribute('r', '30'); halo.setAttribute('fill', '#306AB3'); halo.setAttribute('opacity', '0');
    nib.setAttribute('r', '11'); nib.setAttribute('fill', '#306AB3'); nib.setAttribute('opacity', '0');
    svg.append(halo, nib);
    const place = (pt) => { for (const c of [halo, nib]) { c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); } };
    place(strokes[0].from);

    const pen = { c: 0 };
    function render() {
      const c = pen.c;
      for (const g of legs) {
        if (g.kind !== 'write') continue;
        const { s } = g, done = Math.min(s.L, Math.max(0, c - g.c0));
        s.el.style.strokeDashoffset = s.rev ? -(s.L - done) : s.L - done;
      }
      const g = legs.find((l) => c <= l.c1) || legs[legs.length - 1];
      if (g.kind === 'write') {
        const done = Math.min(g.s.L, Math.max(0, c - g.c0));
        place(g.s.el.getPointAtLength(g.s.rev ? g.s.L - done : done));
        halo.setAttribute('r', '30');
      } else {
        const t = (c - g.c0) / Math.max(1e-6, g.c1 - g.c0);
        place({ x: g.a.x + (g.b.x - g.a.x) * t, y: g.a.y + (g.b.y - g.a.y) * t });
        halo.setAttribute('r', String(30 + 14 * Math.sin(Math.PI * t)));   /* the pen lifts */
      }
    }

    gsap.set([fj, fm], { opacity: 0, y: 46 });
    const S0 = 0.12 * P, W = 1.45 * P;
    tl.to(nib, { attr: { opacity: 1 }, duration: 0.2 * P, ease: 'none' }, S0 - 0.08 * P)
      .to(halo, { attr: { opacity: 0.14 }, duration: 0.2 * P, ease: 'none' }, S0 - 0.08 * P)
      .to(pen, { c: cost, duration: W, ease: 'none', onUpdate: render }, S0)
      .to([nib, halo], { attr: { opacity: 0 }, duration: 0.25 * P, ease: 'none' }, S0 + W);
    /* the figures ink in while the word is being written */
    tl.to(fj, { opacity: 1, y: 0, duration: 0.75 * P }, 0.45 * P)
      .to(fm, { opacity: 1, y: 0, duration: 0.75 * P }, 0.6 * P);
    /* a breath once the pen lifts, then the sheet lifts away and the logo
       glides home at the same moment */
    const T = S0 + W + 0.14 * P;
    tl.fromTo(paper, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.78 * P, ease: 'expo.inOut' }, T);
    flight(T - 0.04 * P, 0.86 * P);
  }
})();
