/* ── Chalk: behaviour that every page shares ──────────────────────────────
   Carried over from the approved home page and extended for the full site.
   None of it is needed to read the page: without scripts the content is
   all there and the links all work. */

const root = document.documentElement;
const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

/* ── The copyright's closing year is always this year ── */
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

/* ── Reveals carried over from the home page (.reveal) ── */
(function () {
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px' });
  const fold = innerHeight * 0.92;
  document.querySelectorAll('.reveal').forEach((el) => {
    if (el.getBoundingClientRect().top > fold) { el.classList.add('pending'); io.observe(el); }
  });
})();

/* ── In-page links: scroll without writing a hash, keep keyboard focus ── */
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest && e.target.closest('a[href^="#"]');
  if (!a) return;
  const t = document.getElementById(a.getAttribute('href').slice(1));
  if (!t) return;
  e.preventDefault();
  t.scrollIntoView({ block: 'start' });
  if (e.detail === 0) { if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
});

/* ── Buttons: a sheen that follows the pointer ── */
document.querySelectorAll('.btn').forEach((b) => {
  b.addEventListener('pointermove', (e) => {
    const r = b.getBoundingClientRect();
    b.style.setProperty('--bx', ((e.clientX - r.left) / r.width * 100) + '%');
    b.style.setProperty('--by', ((e.clientY - r.top) / r.height * 100) + '%');
  });
});

/* ── Header: out of the way on the way down, back on the way up; and the
      reading-progress hairline across the top of the window ── */
(function () {
  const prog = document.querySelector('.progress');
  const hero = root.classList.contains('is-home') ? document.querySelector('.hero') : null;
  let lastY = scrollY, ticking = false, grace = -1;
  function frame() {
    ticking = false;
    const y = scrollY, max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    if (prog) prog.style.setProperty('--prog', Math.min(1, Math.max(0, y / max)).toFixed(4));
    root.classList.toggle('hdr-lift', y > 8);
    /* Home: the header stays out of the way until the hero has scrolled off,
       then slides in as the photograph leaves, even on the way down, and
       only steps aside again after a further stretch of reading */
    if (hero) {
      const over = y < hero.offsetTop + hero.offsetHeight - 72;
      if (!over && root.classList.contains('over-hero')) { root.classList.remove('hdr-off'); grace = y + 320; }
      root.classList.toggle('over-hero', over);
    }
    if (!still && !root.classList.contains('intro-on')) {
      const d = y - lastY;
      if (y < 140 || d < -6) root.classList.remove('hdr-off');
      else if (d > 6 && y > grace && document.activeElement?.closest?.('.filing') == null) root.classList.add('hdr-off');
    }
    lastY = y;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  addEventListener('resize', frame);
  /* where the strip is wider than the screen, its last item (Enquiry) is
     pinned at the right and the current page brought into view, centred in
     the part not covered by the pin */
  const strip = document.querySelector('.contents'), cur = strip && strip.querySelector('[aria-current="page"]');
  const over = () => strip && strip.classList.toggle('is-over', strip.scrollWidth > strip.clientWidth + 1);
  over(); addEventListener('resize', over);
  if (cur && strip.scrollWidth > strip.clientWidth + 1) {
    const pin = strip.querySelector('li:last-child');
    const room = strip.clientWidth - (pin && !pin.contains(cur) ? pin.offsetWidth : 0);
    const at = cur.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft;
    strip.scrollLeft = Math.max(0, at - (room - cur.offsetWidth) / 2);
  }
  frame();
})();

/* ── The rail: each option pulls left as the cursor is about to touch it,
      only the nearest one moves; past the page head it docks small ── */
(function () {
  const cfg = { pull: 20, pullDocked: 11, reach: 70, dockAt: 0.45 };
  const nav = document.querySelector('.sn');
  if (!nav) return;
  const hero = document.querySelector('[data-hero]');
  const items = [...nav.querySelectorAll('a')].map((a) => ({ li: a.closest('li'), el: a.querySelector('.pull'), link: a, focus: false, t: 0, c: 0, d: 0 }));
  let px = -1e5, py = -1e5, raf = 0;
  const maxPull = () => (root.classList.contains('past-hero') && cfg.pullDocked) ? cfg.pullDocked : cfg.pull;
  function targets() {
    const M = maxPull(); let best = -1, bestD = Infinity;
    items.forEach((it, i) => {
      const r = it.el.getBoundingClientRect(), L = r.left + it.c, R = r.right + it.c,
        dx = Math.max(L - px, 0, px - R), dy = Math.max(r.top - py, 0, py - r.bottom), d = Math.hypot(dx, dy);
      it.d = d; if (d < bestD) { bestD = d; best = i; }
    });
    items.forEach((it, i) => {
      if (it.focus) { it.t = M; return; }
      it.t = (i === best && it.d < cfg.reach) ? M * Math.pow(1 - it.d / cfg.reach, 1.6) : 0;
    });
  }
  function frame() {
    let moving = false; const M = maxPull() || 1;
    items.forEach((it) => {
      it.c += (it.t - it.c) * (it.t > it.c ? 0.2 : 0.3);
      if (Math.abs(it.t - it.c) < 0.03) it.c = it.t; else moving = true;
      it.li.style.setProperty('--p', it.c.toFixed(2));
      it.li.style.setProperty('--k', Math.min(1, it.c / M).toFixed(3));
    });
    raf = moving ? requestAnimationFrame(frame) : 0;
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  const release = () => { px = py = -1e5; targets(); kick(); };
  if (fine && !still) {
    addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; targets(); kick(); }, { passive: true });
    document.addEventListener('mouseleave', release);
    addEventListener('blur', release);
  }
  if (!still) items.forEach((it) => {
    it.link.addEventListener('focus', () => { it.focus = it.link.matches(':focus-visible'); targets(); kick(); });
    it.link.addEventListener('blur', () => { it.focus = false; targets(); kick(); });
  });
  let ticking = false;
  function onScroll() {
    ticking = false;
    const past = hero ? scrollY > hero.offsetTop + hero.offsetHeight * cfg.dockAt : scrollY > 120;
    root.classList.toggle('past-hero', past);
    if (px > -1e4) { targets(); kick(); }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* on Home, while a note is being read, the page it leads to is marked in
     the rail (Note 1 marks Services, the enquiry marks Enquiry...) */
  const notes = document.querySelectorAll('[data-rail]');
  if (notes.length) {
    const li = new Map(items.map((it) => [it.link.getAttribute('href').replace(/\//g, ''), it.li]));
    let cur = null;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { const k = e.target.dataset.rail; if (e.isIntersecting) cur = k; else if (cur === k) cur = null; });
      li.forEach((el, k) => el.classList.toggle('is-near', k === cur));
    }, { rootMargin: '-45% 0px -45% 0px' });
    notes.forEach((n) => io.observe(n));
  }
})();

/* ── The phone's permanent enquiry button steps aside only where the page
      already offers the same action in full: the closing invitation on an
      inner page, and the enquiry form at the foot of Home. ── */
(function () {
  const dock = document.querySelector('[data-dock]');
  if (!dock) return;
  const covers = [...document.querySelectorAll('.ask, .is-home #enquiry')];
  if (!covers.length) return;
  const seen = new Set();
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
    dock.classList.toggle('is-away', seen.size > 0);
  }, { threshold: 0.12 });
  covers.forEach((c) => io.observe(c));
})();

/* ── Enquiry forms: validate on the way, confirm on send (demonstration:
      nothing leaves the page). A field that becomes wrong has its message
      slide in; a send with wrong fields gives each of them a small shake.
      A good send turns the button into a tick, then the form gives way to
      the confirmation, line by line. Under reduced motion all of it is
      instant. ── */
document.querySelectorAll('form[data-enquiry]').forEach((form) => {
  const motion = !still && typeof form.animate === 'function';
  const EASE = 'cubic-bezier(.16,1,.3,1)', SWAY = 'cubic-bezier(.65,0,.35,1)';
  let busy = false;
  function check(f) {
    const c = f.querySelector('input,select,textarea');
    const ok = c.checkValidity() && c.value.trim() !== '';
    const was = f.getAttribute('data-invalid') === 'true';
    f.setAttribute('data-invalid', ok ? 'false' : 'true');
    c.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (ok) c.removeAttribute('aria-describedby'); else c.setAttribute('aria-describedby', c.id + '-err');
    if (!ok && !was && motion) f.querySelector('.err')?.animate([{ opacity: 0, transform: 'translateY(-5px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: EASE });
    return ok;
  }
  form.querySelectorAll('[data-field]').forEach((f) => {
    const c = f.querySelector('input,select,textarea');
    c.addEventListener('blur', () => { if (c.value.trim() !== '' || f.getAttribute('data-invalid') === 'true') check(f); });
    c.addEventListener('input', () => { if (f.getAttribute('data-invalid') === 'true') check(f); });
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (busy) return;
    const bad = [...form.querySelectorAll('[data-field]')].filter((f) => !check(f));
    if (bad.length) {
      if (motion) bad.forEach((f) => f.querySelector('input,select,textarea').animate(
        [{ transform: 'none' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(1.5px)' }, { transform: 'none' }],
        { duration: 420, easing: 'ease-out' }));
      bad[0].querySelector('input,select,textarea').focus();
      return;
    }
    busy = true;
    (motion ? sending() : Promise.resolve()).then(sent);
  });

  /* the button closes to a circle and a tick is drawn in it */
  async function sending() {
    const btn = form.querySelector('.btn--send');
    if (!btn) return;
    const lbl = btn.querySelector('.btn__l'), tick = btn.querySelector('.btn__tick');
    const w = btn.offsetWidth, h = btn.offsetHeight;
    btn.setAttribute('aria-disabled', 'true');
    btn.classList.add('is-sending');
    btn.style.justifySelf = Math.abs(w - form.clientWidth) < 2 ? 'center' : 'start';   /* full width on a phone: close to the middle */
    lbl.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(10px)' }], { duration: 220, easing: 'ease-in', fill: 'forwards' });
    await btn.animate([{ width: `${w}px`, borderRadius: '2px' }, { width: `${h}px`, borderRadius: `${h / 2}px` }],
      { duration: 560, delay: 140, easing: SWAY, fill: 'forwards' }).finished;
    tick.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, fill: 'forwards' });
    await tick.querySelector('path').animate([{ strokeDashoffset: 20 }, { strokeDashoffset: 0 }], { duration: 440, easing: SWAY, fill: 'forwards' }).finished;
    await new Promise((r) => setTimeout(r, 380));
    /* the form steps away */
    const rest = [...form.children].filter((c) => !c.classList.contains('sent'));
    await Promise.all(rest.map((c, i) => c.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-6px)' }],
      { duration: 280, delay: i * 30, easing: 'ease-in', fill: 'forwards' }).finished));
  }

  /* the confirmation takes the form's place, line by line */
  function sent() {
    const h0 = form.offsetHeight;
    form.setAttribute('data-sent', 'true');
    form.dispatchEvent(new CustomEvent('enquiry:sent', { bubbles: true }));
    const box = form.querySelector('.sent');
    if (!box) return;
    box.setAttribute('tabindex', '-1');
    if (motion) {
      const h1 = form.offsetHeight;
      form.animate([{ height: `${h0}px` }, { height: `${h1}px` }], { duration: 520, easing: SWAY });
      box.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 260, easing: EASE, fill: 'backwards' });
      box.querySelector('.tick')?.animate([{ strokeDashoffset: 20 }, { strokeDashoffset: 0 }], { duration: 480, delay: 480, easing: SWAY, fill: 'backwards' });
      box.querySelectorAll('p > *').forEach((l, i) => l.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
        { duration: 620, delay: 520 + i * 120, easing: EASE, fill: 'backwards' }));
    }
    /* once the form has closed up, make sure the confirmation is in view and
       clear of the sticky header (its scroll-margin allows for it) */
    box.focus({ preventScroll: true });
    /* a smooth scroll started while the form is still closing up is cut
       short, so it waits for every animation in the form to finish */
    Promise.all(form.getAnimations ? form.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => {})) : []).then(() => {
      /* the header's height, not where it is now: it may be stepped aside,
         and the scroll back up brings it back over the box */
      const r = box.getBoundingClientRect(), hdr = document.querySelector('.filing')?.offsetHeight || 0;
      if (r.top < hdr + 12 || r.bottom > innerHeight) scrollTo({ top: r.top + scrollY - hdr - 16, behavior: motion ? 'smooth' : 'auto' });
    });
  }
});
