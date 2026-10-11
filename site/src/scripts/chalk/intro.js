/* ── First-load intro (six designs under review, html[data-intro]) ────────
   The gate in the layout's <head> decides whether it plays (the home page,
   once a session, never on an anchored visit, never under reduced motion)
   and which design. Review only: ?intro=<design> replays one, and the wheel
   at the foot of the home page picks between them.

   Shared by every design: the ghost is a copy of the hero's logo, so the
   two can never drift apart, and it lands exactly on the real one; any
   pointer, key, wheel or touch ends the intro at once; it can never cover
   the page for more than six seconds; a phone runs faster.

   draft      one pen writes the wordmark stroke after stroke, the nib lifting
              between letters; the figures ink in; the sheet lifts away. ~3.4s
   signature  the draft at a quicker pen, then "Since 2000" signed beneath
              before the sheet lifts. ~4s
   ledger     ruled ledger lines draw across; the grey figure comes from the
              left, the blue from the right, and they meet in balance. ~2.9s
   develop    a line drawing made from the hero photograph sweeps in while
              the logo is written, then develops into the photograph. ~2.5s
   typeset    the headline sets itself word by word at its true size and line
              breaks, glides into place, and the logo drops in above. ~3.1s
   blueprint  the page's own structure draws itself in hairlines, measured from
              the page, and the hero content drops into it. ~2.4s */
import { gsap } from 'gsap';

const root = document.documentElement;
const ov = document.getElementById('intro');
const NS = 'http://www.w3.org/2000/svg';

(function () {
  if (!ov) return;
  if (!root.classList.contains('intro-on')) { ov.setAttribute('hidden', ''); return; }

  const mode = root.dataset.intro || 'draft';
  const real = document.querySelector('.room__card .mk');
  const ghost = ov.querySelector('.intro__mk');
  const paper = ov.querySelector('.intro__paper');
  const layer = ov.querySelector('.intro__layer');
  const phone = innerWidth < 720;
  /* the pen's pace: 1.35 was chosen on review; a phone runs at 70% of that.
     The other designs keep their own clock, Q, a quarter quicker on a phone */
  const PACE = 1.35;
  const P = PACE * (phone ? 0.7 : 1);
  const Q = phone ? 0.75 : 1;
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' }, onComplete: finish });
  const inputs = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
  const cleanups = [];
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
    cleanups.forEach((f) => f());
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
  const fj = svg.querySelector('.lg-j'), fm = svg.querySelector('.lg-md'), word = svg.querySelector('.lg-word');

  /* ── shared moves ─────────────────────────────────────────────────── */

  /* the flight onto the real logo, measured when it starts (the hero below
     can still be settling, its headline font arriving, early on) */
  function flight(at, dur) {
    let m;
    const measure = () => {
      if (!m) { const a = ghost.getBoundingClientRect(), b = real.getBoundingClientRect();
        m = { x: b.left - a.left, y: b.top - a.top, s: b.width / a.width }; }
      return m;
    };
    tl.call(() => { m = null; }, null, Math.max(0, at - 0.001));
    tl.to(ghost, { x: () => measure().x, y: () => measure().y, scale: () => measure().s, duration: dur, ease: 'expo.inOut' }, at);
  }
  /* the sheet lifts away as the logo glides home */
  function liftAndLand(T, k = P) {
    tl.fromTo(paper, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.78 * k, ease: 'expo.inOut' }, T);
    flight(T - 0.04 * k, 0.86 * k);
    return T + 0.86 * k;
  }
  /* the ghost already in the hero's place, for designs that do not fly it */
  function seat(at) { flight(at, 0.001); }
  function figuresIn(at, k = P) {
    gsap.set([fj, fm], { opacity: 0, y: 46 });
    tl.to(fj, { opacity: 1, y: 0, duration: 0.75 * k }, at)
      .to(fm, { opacity: 1, y: 0, duration: 0.75 * k }, at + 0.15 * k);
  }
  function el(cls, parent = layer, tag = 'div') { const e = document.createElement(tag); e.className = cls; parent.appendChild(e); return e; }

  /* one pen writes the wordmark: strokes in reading order at a steady pace,
     the nib lifting between them so the motion never stops */
  function pen(S0, W) {
    const strokes = [];
    [...word.querySelectorAll('path')].forEach((p) => {
      p.getAttribute('d').split(/(?=M)/).filter(Boolean).forEach((d) => {
        const q = p.cloneNode(false); q.setAttribute('d', d); word.insertBefore(q, p); strokes.push({ el: q, d });
      });
      p.remove();
    });
    /* written the way a hand writes: zig-zags (M, N) from bottom-left,
       upright strokes from the top, the rest from the left; closed letters
       keep their own start. Backwards strokes run the dash the other way. */
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
      s.el.style.strokeDasharray = `${L} ${L}`;
      s.el.style.strokeDashoffset = rev ? -L : L;
    });
    strokes.sort((m, n) => m.left - n.left);
    const LIFT = 2.4, legs = [];
    let cost = 0, prev = null;
    strokes.forEach((s) => {
      if (prev) { const dist = Math.hypot(s.from.x - prev.x, s.from.y - prev.y) / LIFT;
        legs.push({ kind: 'travel', a: prev, b: s.from, c0: cost, c1: cost + dist }); cost += dist; }
      legs.push({ kind: 'write', s, c0: cost, c1: cost + s.L }); cost += s.L;
      prev = s.to;
    });
    const halo = document.createElementNS(NS, 'circle'), nib = document.createElementNS(NS, 'circle');
    halo.setAttribute('r', '30'); halo.setAttribute('fill', '#306AB3'); halo.setAttribute('opacity', '0');
    nib.setAttribute('r', '11'); nib.setAttribute('fill', '#306AB3'); nib.setAttribute('opacity', '0');
    svg.append(halo, nib);
    const place = (pt) => { for (const c of [halo, nib]) { c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); } };
    place(strokes[0].from);
    const state = { c: 0 };
    function render() {
      const c = state.c;
      for (const g of legs) if (g.kind === 'write') {
        const done = Math.min(g.s.L, Math.max(0, c - g.c0));
        g.s.el.style.strokeDashoffset = g.s.rev ? -(g.s.L - done) : g.s.L - done;
      }
      const g = legs.find((l) => c <= l.c1) || legs[legs.length - 1];
      if (g.kind === 'write') {
        const done = Math.min(g.s.L, Math.max(0, c - g.c0));
        place(g.s.el.getPointAtLength(g.s.rev ? g.s.L - done : done)); halo.setAttribute('r', '30');
      } else {
        const t = (c - g.c0) / Math.max(1e-6, g.c1 - g.c0);
        place({ x: g.a.x + (g.b.x - g.a.x) * t, y: g.a.y + (g.b.y - g.a.y) * t });
        halo.setAttribute('r', String(30 + 14 * Math.sin(Math.PI * t)));
      }
    }
    tl.to(nib, { attr: { opacity: 1 }, duration: 0.15, ease: 'none' }, Math.max(0, S0 - 0.06))
      .to(halo, { attr: { opacity: 0.14 }, duration: 0.15, ease: 'none' }, Math.max(0, S0 - 0.06))
      .to(state, { c: cost, duration: W, ease: 'none', onUpdate: render }, S0)
      .to([nib, halo], { attr: { opacity: 0 }, duration: 0.25, ease: 'none' }, S0 + W);
    return S0 + W;
  }

  /* ── the designs ──────────────────────────────────────────────────── */
  const designs = {
    draft() {
      const end = pen(0.12 * P, 1.45 * P);
      figuresIn(0.45 * P);
      liftAndLand(end + 0.14 * P);
    },

    signature() {
      const end = pen(0.12 * P, 1.1 * P);
      figuresIn(0.4 * P);
      /* "Since 2000", signed beneath: revealed left to right behind a nib */
      const stage = ov.querySelector('.intro__stage');
      const sig = el('intro__sig', stage);
      sig.innerHTML = '<span>Since 2000</span><i></i>';
      const nib = sig.querySelector('i');
      const S = end + 0.08 * P, D = 0.6 * P;
      tl.fromTo(sig, { clipPath: 'inset(-20% 100% -20% 0%)' }, { clipPath: 'inset(-20% 0% -20% 0%)', duration: D, ease: 'power1.inOut' }, S)
        .fromTo(nib, { left: '0%', opacity: 1 }, { left: '100%', duration: D, ease: 'power1.inOut' }, S)
        .to(nib, { opacity: 0, duration: 0.2, ease: 'none' }, S + D)
        .to(sig, { opacity: 0, y: -6, duration: 0.3 * P, ease: 'power2.in' }, S + D + 0.25 * P);
      liftAndLand(S + D + 0.25 * P);
    },

    ledger() {
      /* ruled paper: a line every 30px, a double rule at each margin */
      const rows = Math.ceil(innerHeight / 30), lines = [];
      for (let i = 1; i < rows; i++) { const l = el('intro__rule'); l.style.top = `${i * 30}px`; lines.push(l); }
      const margins = [0.1, 0.9].map((f) => { const m = el('intro__margin'); m.style.left = `${f * 100}%`; return m; });
      gsap.set(lines, { scaleX: 0 }); gsap.set(margins, { scaleY: 0 });
      tl.to(lines, { scaleX: 1, duration: 0.7 * Q, ease: 'expo.out', stagger: { amount: 0.5 * Q } }, 0.05)
        .to(margins, { scaleY: 1, duration: 0.8 * Q, ease: 'expo.out', stagger: 0.08 }, 0.15 * Q);
      /* the figures come in from either side and meet in balance */
      gsap.set(word, { opacity: 0, y: 30 });
      gsap.set(fj, { x: -1100, opacity: 0 }); gsap.set(fm, { x: 1100, opacity: 0 });
      tl.to([fj, fm], { x: 0, opacity: 1, duration: 1.05 * Q, ease: 'expo.out' }, 0.5 * Q)
        .to(word, { opacity: 1, y: 0, duration: 0.6 * Q, ease: 'expo.out' }, 1.3 * Q)
        .to([...lines, ...margins], { opacity: 0, duration: 0.45 * Q, ease: 'none' }, 1.85 * Q);
      liftAndLand(1.95 * Q, Q);
    },

    develop() {
      const img = document.querySelector('#hero-media .hero__img');
      const media = document.getElementById('hero-media');
      /* the drawing: edges found in the photograph itself, drawn over the
         hero's own box with the same crop, in the palette's blue */
      const cv = el('intro__develop', layer, 'canvas');
      let drawn = false;
      try { drawn = sketch(cv, img, media); } catch (e) { drawn = false; }
      if (drawn) tl.fromTo(cv, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1 * Q, ease: 'power2.inOut' }, 0.05);
      const end = pen(0.15 * Q, 1.0 * Q);
      figuresIn(0.35 * Q, Q);
      /* the photograph develops: the sheet and drawing fade as its tones
         come up from a pale, flat print */
      if (img) {
        gsap.set(img, { transition: 'none' });
        cleanups.push(() => gsap.set(img, { clearProps: 'filter,transition' }));
        tl.fromTo(img, { filter: 'contrast(.55) brightness(1.3) saturate(.25)' }, { filter: 'contrast(1) brightness(1) saturate(1)', duration: 1.1 * Q, ease: 'power2.inOut' }, end + 0.3 * Q);
      }
      /* the logo sets off first; the sheet clears a beat later, so the
         headline beneath only emerges once the logo is nearly home */
      flight(end + 0.05 * Q, 0.85 * Q);
      tl.to([paper, cv], { opacity: 0, duration: 0.8 * Q, ease: 'power2.inOut' }, end + 0.3 * Q);
    },

    typeset() {
      const h = document.querySelector('.torchwrap h1');
      root.classList.add('intro-typeset');
      cleanups.push(() => root.classList.remove('intro-typeset'));
      /* the headline, set at its true size and measure, centred */
      const r = h.getBoundingClientRect(), cs = getComputedStyle(h);
      const t = el('intro__type');
      t.innerHTML = h.innerHTML;
      for (const k of ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'color']) t.style[k] = cs[k];
      t.style.width = `${r.width}px`;
      t.style.left = `${(innerWidth - r.width) / 2}px`;
      t.style.top = `${(innerHeight - r.height) / 2}px`;
      /* words split on ordinary spaces only, so 'Since 2000' (joined by a
         non-breaking space in the headline) stays one unit and the lines
         break exactly where the headline's do */
      const words = [];
      (function wrap(node) {
        [...node.childNodes].forEach((ch) => {
          if (ch.nodeType !== 3) { wrap(ch); return; }
          const frag = document.createDocumentFragment();
          ch.textContent.split(/( +)/).forEach((part) => {
            if (!part) return;
            if (/^ +$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span'); w.className = 'w'; w.textContent = part;
            frag.appendChild(w); words.push(w);
          });
          node.replaceChild(frag, ch);
        });
      })(t);
      const split = { words };
      gsap.set(split.words, { opacity: 0, y: 14, filter: 'blur(4px)' });
      gsap.set(svg, { opacity: 0 });
      tl.to(split.words, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6 * Q, stagger: 0.11 * Q, ease: 'expo.out' }, 0.2 * Q);
      const T = 0.2 * Q + split.words.length * 0.11 * Q + 0.5 * Q;
      /* it glides into the hero's headline exactly */
      let m;
      tl.call(() => { m = null; }, null, T - 0.001)
        .to(t, { x: () => (m ||= measureTo(t, h)).x, y: () => (m ||= measureTo(t, h)).y, duration: 0.9 * Q, ease: 'expo.inOut' }, T);
      /* the logo drops into its place above. The drop moves the drawing
         inside the ghost, never the ghost itself, so the seat's measurement
         stays true */
      seat(T + 0.5 * Q);
      tl.fromTo(svg, { opacity: 0, yPercent: -8 }, { opacity: 1, yPercent: 0, duration: 0.6 * Q, ease: 'expo.out', immediateRender: false }, T + 0.55 * Q);
      tl.fromTo(paper, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.78 * Q, ease: 'expo.inOut' }, T + 0.9 * Q);
    },

    blueprint() {
      /* the page's real structure, measured: header edge, content columns,
         the hero's base, the rail's line */
      const hdr = document.querySelector('.filing').getBoundingClientRect();
      const hero = document.getElementById('hero').getBoundingClientRect();
      const copy = document.querySelector('.room').getBoundingClientRect();
      const rail = document.querySelector('.sn--dock');
      const lines = [];
      const H = (y) => { const l = el('intro__bp intro__bp--h'); l.style.top = `${y}px`; lines.push(l); return l; };
      const V = (x, y0 = 0, y1 = innerHeight) => { const l = el('intro__bp intro__bp--v'); Object.assign(l.style, { left: `${x}px`, top: `${y0}px`, height: `${y1 - y0}px` }); lines.push(l); return l; };
      H(hdr.bottom); H(Math.min(innerHeight - 2, hero.bottom));
      V(copy.left); V(copy.left + Math.min(copy.width, 620), hdr.bottom, hero.bottom);
      V(innerWidth - (innerWidth - copy.right));
      if (rail && getComputedStyle(rail).display !== 'none') { const rr = rail.getBoundingClientRect(); V(rr.right + 20, rr.top, rr.bottom); }
      lines.forEach((l) => gsap.set(l, l.classList.contains('intro__bp--h') ? { scaleX: 0 } : { scaleY: 0 }));
      tl.to(lines, { scaleX: 1, scaleY: 1, duration: 0.8 * Q, ease: 'expo.out', stagger: 0.09 * Q }, 0.1);
      /* the sheet clears and the hero's content drops into the grid */
      const parts = [...document.querySelectorAll('.torchwrap, .hero__acts')];
      gsap.set(parts, { opacity: 0, y: -16 });
      cleanups.push(() => gsap.set(parts, { clearProps: 'opacity,transform' }));
      seat(1.0 * Q);
      gsap.set(svg, { opacity: 0 });
      tl.to(paper, { opacity: 0, duration: 0.6 * Q, ease: 'power2.inOut' }, 1.05 * Q)
        .fromTo(svg, { opacity: 0, yPercent: -10 }, { opacity: 1, yPercent: 0, duration: 0.7 * Q, ease: 'expo.out', immediateRender: false }, 1.2 * Q)
        .to(parts, { opacity: 1, y: 0, duration: 0.7 * Q, stagger: 0.12 * Q, ease: 'expo.out' }, 1.32 * Q)
        .to(lines, { opacity: 0, duration: 0.5 * Q, ease: 'none' }, 1.9 * Q);
    },
  };

  function measureTo(a, b) { const r1 = a.getBoundingClientRect(), r2 = b.getBoundingClientRect(); return { x: r2.left - r1.left, y: r2.top - r1.top }; }

  /* edges of the photograph, drawn as a pale blue line drawing */
  function sketch(cv, img, box) {
    if (!img || !img.complete || !img.naturalWidth || !box) return false;
    const r = box.getBoundingClientRect();
    cv.width = Math.round(r.width); cv.height = Math.round(r.height);
    Object.assign(cv.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    /* the same cover crop and focal point as the photograph */
    const pos = getComputedStyle(img).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
    const W = 520, Hh = Math.round(W * r.height / r.width);
    const s = Math.max(W / img.naturalWidth, Hh / img.naturalHeight);
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    const off = document.createElement('canvas'); off.width = W; off.height = Hh;
    const ox = off.getContext('2d', { willReadFrequently: true });
    ox.drawImage(img, (W - dw) * (isNaN(pos[0]) ? 0.5 : pos[0]), (Hh - dh) * (isNaN(pos[1]) ? 0.5 : pos[1]), dw, dh);
    const src = ox.getImageData(0, 0, W, Hh).data, L = new Float32Array(W * Hh);
    for (let i = 0; i < W * Hh; i++) L[i] = 0.299 * src[i * 4] + 0.587 * src[i * 4 + 1] + 0.114 * src[i * 4 + 2];
    const out = ox.createImageData(W, Hh);
    for (let y = 1; y < Hh - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      const gx = -L[i - W - 1] - 2 * L[i - 1] - L[i + W - 1] + L[i - W + 1] + 2 * L[i + 1] + L[i + W + 1];
      const gy = -L[i - W - 1] - 2 * L[i - W] - L[i - W + 1] + L[i + W - 1] + 2 * L[i + W] + L[i + W + 1];
      const m = Math.min(1, Math.max(0, (Math.hypot(gx, gy) - 40) / 160));
      out.data[i * 4] = 43; out.data[i * 4 + 1] = 90; out.data[i * 4 + 2] = 160; out.data[i * 4 + 3] = m * 200;
    }
    ox.putImageData(out, 0, 0);
    const c = cv.getContext('2d');
    c.imageSmoothingQuality = 'high';
    c.drawImage(off, 0, 0, cv.width, cv.height);
    return true;
  }

  (designs[mode] || designs.draft)();
  tl.play();
})();
