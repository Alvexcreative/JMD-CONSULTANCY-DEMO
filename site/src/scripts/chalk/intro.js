/* ── First-load intro: Draft or Aperture (under review) ──────────────────
   The gate in the layout's <head> decides whether it plays (home, once a
   session, never under reduced motion) and which one (html[data-intro]).
   The ghost is a copy of the hero's logo, so the two can never drift apart,
   and it lands exactly on the real one before the overlay goes.

   Draft     the wordmark is drawn stroke by stroke, the way it is built (a
             pen line along each letter), the two figures ink in, then the
             sheet lifts away as the logo glides into the hero. ~2.2s.
   Aperture  the logo holds still while a hairline tracks the hero
             photograph actually loading, then the sheet opens from the
             centre like an iris and the logo settles into place. ~1.2-2s.

   Any pointer, key, wheel or touch ends it at once; it can never cover the
   page for more than six seconds; on a phone it runs at 70% of the time. */
import { gsap } from 'gsap';

const root = document.documentElement;
const ov = document.getElementById('intro');

/* review only: mark the intro in use on the comparison switcher */
document.querySelectorAll('.introsw a').forEach((a) => a.setAttribute('aria-current', String(a.dataset.mode === root.dataset.intro)));

(function () {
  if (!ov) return;
  if (!root.classList.contains('intro-on')) { ov.setAttribute('hidden', ''); return; }

  const real = document.querySelector('.room__card .mk');
  const ghost = ov.querySelector('.intro__mk');
  const paper = ov.querySelector('.intro__paper');
  const mode = root.dataset.intro === 'aperture' ? 'aperture' : 'draft';
  const P = innerWidth < 720 ? 0.7 : 1;
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' }, onComplete: finish });
  const inputs = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
  let done = false, settling = false;
  /* development only: lets a hidden browser be stepped to a given moment */
  if (import.meta.env.DEV) window.__intro = tl;

  function finish() {
    if (done) return;
    done = true;
    tl.kill();
    root.classList.remove('intro-on');
    ov.setAttribute('hidden', '');
    inputs.forEach((t) => removeEventListener(t, finish, true));
    const img = document.querySelector('#hero-media .hero__img');
    /* skipped before the photograph began to settle: put it at rest at once */
    if (img && !settling) gsap.set(img, { clearProps: 'scale,transform,transition' });
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

  /* the flight onto the real logo: measured, not guessed */
  function flight(at, dur) {
    const a = ghost.getBoundingClientRect(), b = real.getBoundingClientRect();
    tl.to(ghost, { x: b.left - a.left, y: b.top - a.top, scale: b.width / a.width, duration: dur, ease: 'expo.inOut' }, at);
  }

  if (mode === 'draft') { draft(); tl.play(); } else aperture();

  /* ── Draft ───────────────────────────────────────────────────────────── */
  function draft() {
    const fj = svg.querySelector('.lg-j'), fm = svg.querySelector('.lg-md');
    /* each letter becomes its own stroke, in reading order */
    const word = svg.querySelector('.lg-word');
    const strokes = [];
    [...word.querySelectorAll('path')].forEach((p) => {
      const parts = p.getAttribute('d').split(/(?=M)/).filter(Boolean);
      parts.forEach((d) => {
        const q = p.cloneNode(false); q.setAttribute('d', d);
        word.insertBefore(q, p);
        strokes.push({ el: q, x: parseFloat(d.slice(1)) });
      });
      p.remove();
    });
    strokes.sort((m, n) => m.x - n.x);
    const els = strokes.map((s) => s.el);
    const lens = els.map((e) => e.getTotalLength());
    const maxL = Math.max(...lens);
    els.forEach((e, i) => { e.style.strokeDasharray = `${lens[i]} ${lens[i]}`; e.style.strokeDashoffset = lens[i]; });
    gsap.set([fj, fm], { opacity: 0, y: 46 });

    /* the pen: longer strokes take longer, letters overlap a little */
    els.forEach((e, i) => tl.to(e, { strokeDashoffset: 0, duration: (0.2 + 0.24 * lens[i] / maxL) * P, ease: 'power1.inOut' }, (0.15 + i * 0.062) * P));
    /* the figures ink in while the word is still being written */
    tl.to(fj, { opacity: 1, y: 0, duration: 0.75 * P }, 0.5 * P)
      .to(fm, { opacity: 1, y: 0, duration: 0.75 * P }, 0.64 * P);
    /* the sheet lifts away and the logo glides home at the same moment */
    const T = 1.42 * P;
    tl.fromTo(paper, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.78 * P, ease: 'expo.inOut' }, T);
    flight(T - 0.04 * P, 0.86 * P);
  }

  /* ── Aperture ────────────────────────────────────────────────────────── */
  function aperture() {
    const bar = ov.querySelector('.intro__bar i'), barWrap = ov.querySelector('.intro__bar');
    const ring = ov.querySelector('.intro__iris circle');
    const img = document.querySelector('#hero-media .hero__img');
    const R = Math.hypot(innerWidth, innerHeight) / 2 + 40;
    const MIN = 0.6 * P, MAX = 1.6 * P;
    const start = performance.now();
    /* the hairline creeps while the photograph loads, then completes */
    const creep = gsap.to(bar, { scaleX: 0.8, duration: MAX, ease: 'power2.out' });
    const loaded = new Promise((res) => {
      if (!img || (img.complete && img.naturalWidth)) return res();
      img.addEventListener('load', res, { once: true });
      img.addEventListener('error', res, { once: true });
    });
    const capped = Promise.race([loaded, new Promise((res) => setTimeout(res, MAX * 1000))]);
    capped.then(() => {
      if (done) return;
      const wait = Math.max(0, MIN - (performance.now() - start) / 1000);
      creep.kill();
      tl.to(bar, { scaleX: 1, duration: 0.32 * P, ease: 'power2.out' }, wait)
        .to(barWrap, { opacity: 0, duration: 0.25 * P, ease: 'none' }, wait + 0.3 * P);
      const T = wait + 0.34 * P;
      /* the iris: the sheet opens from the centre, a fine ring at its edge */
      /* power3, not expo: the opening is meant to be watched, not snapped */
      tl.fromTo(paper, { '--ap': '0px' }, { '--ap': `${R}px`, duration: 1.1 * P, ease: 'power3.inOut' }, T)
        .fromTo(ring, { attr: { r: 0 }, opacity: 0.9 }, { attr: { r: R }, opacity: 0, duration: 1.1 * P, ease: 'power3.inOut' }, T);
      /* the photograph's own CSS transition would fight the tween frame by frame */
      /* the photograph settles on its own clock, so the page is free the
         moment the iris is open rather than when the photograph comes to rest */
      if (img) {
        gsap.set(img, { transition: 'none', scale: 1.08 });
        tl.call(() => { settling = true; gsap.to(img, { scale: 1, duration: 1.5 * P, ease: 'power3.out', onComplete: () => gsap.set(img, { clearProps: 'scale,transform,transition' }) }); }, null, T);
      }
      flight(T + 0.12 * P, 0.95 * P);
      tl.play(0);
    });
  }
})();
