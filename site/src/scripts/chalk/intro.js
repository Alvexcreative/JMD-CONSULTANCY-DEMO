/* ── First-load intro: "Draft" ────────────────────────────────────────────
   The gate in the layout's <head> decides whether it plays: the home page,
   once a session, never on an anchored visit, never under reduced motion.
   (?intro on the address replays it, for review.)

   The wordmark is drawn stroke by stroke in reading order, the way it is
   built (a pen line along each letter); the grey and blue figures ink in
   while it is being written; then the chalk sheet lifts away as the logo
   glides onto the hero. The ghost is a copy of the hero's logo, so the two
   can never drift apart, and it lands exactly on the real one.

   About 3s on a desktop, 2.1s on a phone. Any pointer, key, wheel or touch
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
})();
