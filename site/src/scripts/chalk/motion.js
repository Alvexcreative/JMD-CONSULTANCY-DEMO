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
  rises(); photos(); bands(); rules(); ink(); chapters(); wires(); odometers(); timeline(); magnets(); homeHero();
}

/* ── groups that arrive together, in reading order ─────────────────── */
function rises() {
  document.querySelectorAll('[data-rise]').forEach((g) => {
    const kids = g.children.length ? [...g.children] : [g];
    gsap.from(kids, { opacity: 0, y: 26, duration: 1.1, stagger: 0.08,
      scrollTrigger: { trigger: g, start: 'top 86%', once: true } });
  });
}

/* ── photographs: uncovered by a rising mask, settling as they arrive,
      then drifting a touch against the scroll ─────────────────────── */
function photos() {
  document.querySelectorAll('.ph[data-reveal]').forEach((ph) => {
    const img = ph.querySelector('img');
    gsap.timeline({ scrollTrigger: { trigger: ph, start: 'top 88%', once: true } })
      .fromTo(ph, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' })
      .fromTo(img, { scale: 1.22 }, { scale: 1.06, duration: 2, ease: 'power3.out' }, 0);
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

/* ── Systems: the finance systems wire into the integration, and the
      integration into the databases. Paths are measured from the cards,
      drawn with the scroll, and carry packets while on screen. ─────── */
function wires() {
  document.querySelectorAll('.wire').forEach((w) => {
    const svg = w.querySelector('.wire__svg');
    const tops = [...w.querySelectorAll('.wire__row--top .node')];
    const hub = w.querySelector('.wire__hub .node');
    const bots = [...w.querySelectorAll('.wire__row--bot .node')];
    let paths = [], packets = [], tl, loop;
    function build() {
      const R = w.getBoundingClientRect();
      const pt = (el, edge) => { const r = el.getBoundingClientRect();
        return [r.left - R.left + r.width / 2, edge === 'b' ? r.bottom - R.top : r.top - R.top]; };
      const curve = (a, b) => { const my = (a[1] + b[1]) / 2; return `M${a[0]} ${a[1]} C${a[0]} ${my} ${b[0]} ${my} ${b[0]} ${b[1]}`; };
      svg.setAttribute('viewBox', `0 0 ${R.width} ${R.height}`);
      svg.innerHTML = '';
      const ds = [...tops.map((t) => curve(pt(t, 'b'), pt(hub, 't'))), ...bots.map((b) => curve(pt(hub, 'b'), pt(b, 't')))];
      paths = ds.map((d) => { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); svg.appendChild(p);
        const live = p.cloneNode(); live.classList.add('live'); svg.appendChild(live); return live; });
      packets = paths.map(() => { const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('r', '3.2'); c.style.opacity = 0; svg.appendChild(c); return c; });
    }
    function animate() {
      if (tl) { tl.scrollTrigger && tl.scrollTrigger.kill(); tl.kill(); }
      if (loop) loop.kill();
      paths.forEach((p) => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
      /* the wiring completes while the whole diagram is still in view: it
         starts as the diagram comes up the screen and is finished by the
         time its top edge reaches the upper third */
      tl = gsap.timeline({ scrollTrigger: { trigger: w, start: 'top 85%', end: 'top 30%', scrub: 0.6 } });
      tl.add(() => tops.forEach((n) => n.classList.toggle('is-lit', tl.scrollTrigger.direction > 0)), 0.02);
      paths.slice(0, tops.length).forEach((p, i) => tl.to(p, { strokeDashoffset: 0, ease: 'none', duration: 1 }, i * 0.15));
      tl.add(() => hub.classList.toggle('is-lit', tl.scrollTrigger.direction > 0), 1.1);
      paths.slice(tops.length).forEach((p, i) => tl.to(p, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 1.2 + i * 0.15));
      tl.add(() => bots.forEach((n) => n.classList.toggle('is-lit', tl.scrollTrigger.direction > 0)), 2.4);
      /* packets travel the finished wires, top to bottom, only on screen */
      loop = gsap.timeline({ repeat: -1, paused: true });
      paths.forEach((p, i) => {
        loop.fromTo(packets[i], { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, i * 0.45 + (i >= tops.length ? 0.9 : 0))
          .to(packets[i], { motionPath: { path: p, align: p, alignOrigin: [0.5, 0.5] }, duration: 1.6, ease: 'sine.inOut' }, '<')
          .to(packets[i], { opacity: 0, duration: 0.25, ease: 'none' }, '>-0.25');
      });
      ScrollTrigger.create({ trigger: w, start: 'top 30%', end: 'bottom top',
        onToggle: (st) => (st.isActive ? loop.play() : loop.pause()) });
    }
    build(); animate();
    let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { build(); animate(); ScrollTrigger.refresh(); }, 180); });
  });
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
