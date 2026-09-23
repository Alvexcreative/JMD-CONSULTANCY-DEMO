/* If the page was never actually looked at while an intro was due to run
   (loaded in a background tab, restored session, hidden pane), rAF never
   fires and every JS-set initial state would stay stuck. Jump such a
   timeline straight to its end: the visitor missed the intro, so the
   correct thing to show them is the settled page, not a blank one. */
window.jmdSettle = function (tl) {
  if (!tl) return;
  if (document.visibilityState === 'hidden') { tl.progress(1); return; }
  var onHide = function () {
    if (document.visibilityState === 'hidden' && tl.progress() < 1) {
      tl.progress(1);
      document.removeEventListener('visibilitychange', onHide);
    }
  };
  document.addEventListener('visibilitychange', onHide);
};

/* Same argument for scroll-triggered reveals. Scrubbed tweens are left
   alone — at scroll zero, progress zero is their correct state. */
window.jmdSettleScroll = function () {
  if (document.visibilityState !== 'hidden' || !window.ScrollTrigger) return;
  setTimeout(function () {
    ScrollTrigger.getAll().forEach(function (st) {
      if (!st.vars.scrub && st.animation) st.animation.progress(1);
    });
  }, 60);
};

/* Concept switcher. Not part of any design language. */
(function () {
  var CONCEPTS = [
    { n: '02', slug: '02-montfort.html',      name: 'Montfort' },
    { n: '06', slug: '06-pathforgrowth.html', name: 'Path for Growth' },
    { n: '08', slug: '08-chalk.html',         name: 'Chalk' }
  ];

  function build() {
    var here = location.pathname.split('/').pop() || '02-montfort.html';

    var bar = document.createElement('nav');
    bar.className = 'rv-bar';
    bar.setAttribute('aria-label', 'Concept switcher');

    var nav = document.createElement('div');
    nav.className = 'rv-nav';

    CONCEPTS.forEach(function (c) {
      var a = document.createElement('a');
      a.className = 'rv-link';
      a.href = c.slug;
      if (c.slug === here) a.setAttribute('aria-current', 'page');
      a.innerHTML = '<span class="rv-num">' + c.n + '</span><span class="rv-name">' + c.name + '</span>';
      nav.appendChild(a);
    });
    bar.appendChild(nav);
    document.body.appendChild(bar);

    /* Type a concept's number to jump to it. */
    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      var i = CONCEPTS.findIndex(function (c) { return c.n === e.key.padStart(2, '0'); });
      if (i > -1) location.href = CONCEPTS[i].slug;
    });

    /* Tuck the bar away while scrolling so it never fights the design. */
    var timer, lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      if (Math.abs(window.scrollY - lastY) < 6) return;
      lastY = window.scrollY;
      bar.dataset.tucked = 'true';
      clearTimeout(timer);
      timer = setTimeout(function () { bar.dataset.tucked = 'false'; }, 900);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
