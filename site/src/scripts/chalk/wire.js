/* ── Systems: the integration diagram ─────────────────────────────────────
   The finance systems wire into the integration, and the integration into
   the databases. The paths are measured from the cards, so the diagram
   reflows at every width.

   On scroll the wiring draws itself and then carries packets while it is on
   screen (moved here from motion.js unchanged). Each card can also be
   selected, by hovering, by keyboard focus, or by a tap that holds it: its
   route through the integration is traced outward from it, a packet runs
   the route while it is held, the cards it does not reach step back, and its
   line from the live site is quoted beneath. A second tap, a tap elsewhere
   or Escape lets it go.

   Under reduced motion the wires are simply there and selection is instant;
   without scripts the cards are plain text. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
const NS = 'http://www.w3.org/2000/svg';
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
ready.then(() => document.querySelectorAll('.wire').forEach(diagram));

function diagram(w) {
  const svg = w.querySelector('.wire__svg');
  const tops = [...w.querySelectorAll('.wire__row--top .node')];
  const hub = w.querySelector('.wire__hub .node');
  const bots = [...w.querySelectorAll('.wire__row--bot .node')];
  const nodes = [...tops, hub, ...bots];
  const T = tops.length;
  const note = document.getElementById(w.getAttribute('aria-describedby'));
  const who = note && note.querySelector('.wire__who'), say = note && note.querySelector('.wire__say');
  const rest = note ? { who: who.textContent, say: say.textContent } : null;

  /* wire k runs top k → hub for k < T, and hub → bottom (k − T) after */
  let live = [], trace = [], packets = [], runners = [], drawn, loop, act, inView = false;
  const el = (name, cls) => { const e = document.createElementNS(NS, name); if (cls) e.setAttribute('class', cls); return e; };

  function build() {
    const R = w.getBoundingClientRect();
    const pt = (n, edge) => { const r = n.getBoundingClientRect();
      return [r.left - R.left + r.width / 2, edge === 'b' ? r.bottom - R.top : r.top - R.top]; };
    const curve = (a, b) => { const my = (a[1] + b[1]) / 2; return `M${a[0]} ${a[1]} C${a[0]} ${my} ${b[0]} ${my} ${b[0]} ${b[1]}`; };
    svg.setAttribute('viewBox', `0 0 ${R.width} ${R.height}`);
    svg.innerHTML = '';
    const ds = [...tops.map((t) => curve(pt(t, 'b'), pt(hub, 't'))), ...bots.map((b) => curve(pt(hub, 'b'), pt(b, 't')))];
    /* three layers per wire: the faint rule, the blue line the scroll draws,
       and the trace a selection draws over both */
    live = []; trace = [];
    ds.forEach((d) => {
      const base = el('path'); base.setAttribute('d', d); svg.appendChild(base);
      const l = el('path', 'live'); l.setAttribute('d', d); svg.appendChild(l); live.push(l);
    });
    ds.forEach((d) => { const t = el('path', 'trace'); t.setAttribute('d', d); svg.appendChild(t); trace.push(t); });
    packets = ds.map(() => { const c = el('circle'); c.setAttribute('r', '3.2'); c.style.opacity = 0; svg.appendChild(c); return c; });
    runners = ds.map(() => { const c = el('circle', 'run'); c.setAttribute('r', '4'); c.style.opacity = 0; svg.appendChild(c); return c; });
    trace.forEach((t) => { const L = t.getTotalLength(); t.style.strokeDasharray = `${L} ${L}`; t.style.strokeDashoffset = L; t.style.opacity = 0; });
  }

  /* ── on scroll: the wiring draws itself, then carries packets ─────── */
  function scroll() {
    if (drawn) { drawn.scrollTrigger && drawn.scrollTrigger.kill(); drawn.kill(); }
    if (loop) { loop.kill(); loop.st && loop.st.kill(); }
    if (still) return;
    live.forEach((p) => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
    /* the wiring completes while the whole diagram is still in view: it
       starts as the diagram comes up the screen and is finished by the
       time its top edge reaches the upper third */
    drawn = gsap.timeline({ scrollTrigger: { trigger: w, start: 'top 85%', end: 'top 30%', scrub: 0.6 } });
    drawn.add(() => tops.forEach((n) => n.classList.toggle('is-lit', drawn.scrollTrigger.direction > 0)), 0.02);
    live.slice(0, T).forEach((p, i) => drawn.to(p, { strokeDashoffset: 0, ease: 'none', duration: 1 }, i * 0.15));
    drawn.add(() => hub.classList.toggle('is-lit', drawn.scrollTrigger.direction > 0), 1.1);
    live.slice(T).forEach((p, i) => drawn.to(p, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 1.2 + i * 0.15));
    drawn.add(() => bots.forEach((n) => n.classList.toggle('is-lit', drawn.scrollTrigger.direction > 0)), 2.4);
    /* packets travel the finished wires, top to bottom, only on screen,
       and stand aside while a route is being traced */
    loop = gsap.timeline({ repeat: -1, paused: true });
    live.forEach((p, i) => {
      loop.fromTo(packets[i], { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, i * 0.45 + (i >= T ? 0.9 : 0))
        .to(packets[i], { motionPath: { path: p, align: p, alignOrigin: [0.5, 0.5] }, duration: 1.6, ease: 'sine.inOut' }, '<')
        .to(packets[i], { opacity: 0, duration: 0.25, ease: 'none' }, '>-0.25');
    });
    loop.st = ScrollTrigger.create({ trigger: w, start: 'top 30%', end: 'bottom top',
      onToggle: (st) => { inView = st.isActive; ambient(); } });
  }
  function ambient() {
    if (!loop) return;
    if (inView && !cur) loop.play();
    else { loop.pause(); packets.forEach((c) => { c.style.opacity = 0; }); }
  }

  /* ── selection: the route outward from the chosen card ─────────────── */
  /* each leg is a wire, the way it is run (rev: against its drawn
     direction), and its stage (0 leaves the card, 1 carries on beyond the
     integration) */
  function route(n) {
    const i = tops.indexOf(n), j = bots.indexOf(n);
    if (i > -1) return [{ k: i, rev: false, st: 0 }, ...bots.map((_, b) => ({ k: T + b, rev: false, st: 1 }))];
    if (j > -1) return [{ k: T + j, rev: true, st: 0 }, ...tops.map((_, t) => ({ k: t, rev: true, st: 1 }))];
    return [...tops.map((_, t) => ({ k: t, rev: true, st: 0 })), ...bots.map((_, b) => ({ k: T + b, rev: false, st: 0 }))];
  }
  const ends = (k) => (k < T ? [tops[k], hub] : [hub, bots[k - T]]);

  let cur = null;
  function show(n) {
    cur = n;
    if (act) act.kill();
    trace.forEach((t) => { gsap.killTweensOf(t); t.style.opacity = 0; t.style.strokeDashoffset = t.getTotalLength(); });
    runners.forEach((c) => { gsap.killTweensOf(c); c.style.opacity = 0; });
    w.classList.toggle('is-tracing', !!n);
    nodes.forEach((x) => x.classList.remove('is-on', 'is-sel'));
    ambient();
    if (note) {
      who.textContent = n ? n.querySelector('b').textContent : rest.who;
      say.textContent = n ? n.dataset.note : rest.say;
      if (!still) gsap.fromTo([who, say], { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out', overwrite: true });
    }
    if (!n) return;
    const legs = route(n);
    n.classList.add('is-sel');
    legs.forEach((g) => ends(g.k).forEach((x) => x.classList.add('is-on')));
    if (still) { legs.forEach((g) => { trace[g.k].style.opacity = 1; trace[g.k].style.strokeDashoffset = 0; }); return; }

    /* the trace draws out from the card, stage by stage */
    const D = 0.42;
    act = gsap.timeline();
    legs.forEach((g) => {
      const t = trace[g.k], L = t.getTotalLength();
      act.set(t, { opacity: 1, strokeDashoffset: g.rev ? -L : L }, 0)
        .to(t, { strokeDashoffset: 0, duration: D, ease: 'power2.inOut' }, g.st * D * 0.85);
    });
    /* then a packet runs the route, again and again, while it is held */
    const run = gsap.timeline({ repeat: -1, repeatDelay: 0.35 });
    const RUN = 0.85, two = legs.some((x) => x.st);   /* a two-stage route runs as one movement */
    legs.forEach((g) => {
      const c = runners[g.k], p = trace[g.k], at = g.st * RUN;
      run.fromTo(c, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'none' }, at)
        .to(c, { motionPath: { path: p, align: p, alignOrigin: [0.5, 0.5], start: g.rev ? 1 : 0, end: g.rev ? 0 : 1 },
          duration: RUN, ease: !two ? 'sine.inOut' : g.st ? 'sine.out' : 'sine.in' }, at)
        .to(c, { opacity: 0, duration: 0.14, ease: 'none' }, at + RUN - 0.14);
    });
    act.add(run, D * 1.7);
  }

  /* hover, keyboard focus and a held tap all select; the strongest wins */
  let hover = null, focus = null, pin = null, leave = 0;
  function update() {
    const n = hover || focus || pin;
    nodes.forEach((x) => x.setAttribute('aria-pressed', String(x === pin)));
    if (n !== cur) show(n);
  }
  nodes.forEach((n) => {
    if (fine) {
      n.addEventListener('pointerenter', () => { clearTimeout(leave); hover = n; update(); });
      /* a short grace, so passing between cards does not flash the rest state */
      n.addEventListener('pointerleave', () => { hover = null; clearTimeout(leave); leave = setTimeout(update, 160); });
    }
    n.addEventListener('focus', () => { focus = n.matches(':focus-visible') ? n : null; update(); });
    n.addEventListener('blur', () => { if (focus === n) focus = null; update(); });
    n.addEventListener('click', () => { pin = pin === n ? null : n; if (!fine) hover = null; update(); });
  });
  document.addEventListener('pointerdown', (e) => { if (pin && !w.contains(e.target)) { pin = null; update(); } });
  w.addEventListener('keydown', (e) => { if (e.key === 'Escape' && (pin || focus)) { pin = null; focus = null; update(); } });

  build(); scroll();
  let t;
  addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { const n = cur; cur = null; build(); scroll(); show(n); ScrollTrigger.refresh(); }, 180); });
}
