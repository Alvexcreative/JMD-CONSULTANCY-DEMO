/* ── Chalk: behaviour that every page shares ──────────────────────────────
   Carried over from the approved home page and extended for the full site.
   None of it is needed to read the page: without scripts the content is
   all there and the links all work. */

const root = document.documentElement;
const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

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
  let lastY = scrollY, ticking = false;
  function frame() {
    ticking = false;
    const y = scrollY, max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    if (prog) prog.style.setProperty('--prog', Math.min(1, Math.max(0, y / max)).toFixed(4));
    root.classList.toggle('hdr-lift', y > 8);
    if (!still && !root.classList.contains('intro-on')) {
      const d = y - lastY;
      if (y < 140 || d < -6) root.classList.remove('hdr-off');
      else if (d > 6 && document.activeElement?.closest?.('.filing') == null) root.classList.add('hdr-off');
    }
    lastY = y;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  addEventListener('resize', frame);
  /* the strip is wider than a phone: bring the current page into view in it */
  const strip = document.querySelector('.contents'), cur = strip && strip.querySelector('[aria-current="page"]');
  if (cur && strip.scrollWidth > strip.clientWidth + 1) strip.scrollLeft = Math.max(0, cur.offsetLeft - (strip.clientWidth - cur.offsetWidth) / 2);
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
})();

/* ── Enquiry forms: validate on the way, confirm on send (demonstration:
      nothing leaves the page) ── */
document.querySelectorAll('form[data-enquiry]').forEach((form) => {
  function check(f) {
    const c = f.querySelector('input,select,textarea');
    const ok = c.checkValidity() && c.value.trim() !== '';
    f.setAttribute('data-invalid', ok ? 'false' : 'true');
    c.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (ok) c.removeAttribute('aria-describedby'); else c.setAttribute('aria-describedby', c.id + '-err');
    return ok;
  }
  form.querySelectorAll('[data-field]').forEach((f) => {
    const c = f.querySelector('input,select,textarea');
    c.addEventListener('blur', () => { if (c.value.trim() !== '' || f.getAttribute('data-invalid') === 'true') check(f); });
    c.addEventListener('input', () => { if (f.getAttribute('data-invalid') === 'true') check(f); });
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let bad = null;
    form.querySelectorAll('[data-field]').forEach((f) => { if (!check(f) && !bad) bad = f; });
    if (bad) { bad.querySelector('input,select,textarea').focus(); return; }
    form.setAttribute('data-sent', 'true');
    const sent = form.querySelector('.sent');
    if (sent) { sent.setAttribute('tabindex', '-1'); sent.focus({ preventScroll: true }); }
    form.dispatchEvent(new CustomEvent('enquiry:sent', { bubbles: true }));
  });
});
