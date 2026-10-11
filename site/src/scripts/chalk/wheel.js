/* ── Review only: the intro picker wheel ──────────────────────────────────
   A drum of intro designs at the foot of the home page. It is a native
   scroll-snap list, so a trackpad, mouse wheel, finger or the arrow keys
   all turn it; each name is tilted on the drum by its distance from the
   centre slot. The centred design is the one Play replays; clicking a
   name replays that one straight away. */
const wheel = document.querySelector('.iwheel');
if (wheel) {
  const drum = wheel.querySelector('.iwheel__drum');
  const items = [...drum.querySelectorAll('li')];
  const play = wheel.querySelector('.iwheel__play');
  const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
  let current = -1;

  function turn() {
    const mid = drum.scrollTop + drum.clientHeight / 2;
    let best = 0, bestD = Infinity;
    items.forEach((li, i) => {
      const c = li.offsetTop + li.offsetHeight / 2, d = (c - mid) / li.offsetHeight;
      if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i; }
      const k = Math.max(-2.2, Math.min(2.2, d));
      li.style.transform = still ? '' : `rotateX(${(-k * 24).toFixed(2)}deg) scale(${(1 - Math.abs(k) * 0.07).toFixed(3)})`;
      li.style.opacity = String(Math.max(0.18, 1 - Math.abs(k) * 0.38).toFixed(3));
    });
    if (best !== current) {
      current = best;
      items.forEach((li, i) => li.setAttribute('aria-selected', String(i === best)));
      play.href = items[best].querySelector('a').getAttribute('href');
      play.setAttribute('aria-label', `Play the ${items[best].textContent.trim()} intro`);
    }
  }
  /* scroll events already arrive once a frame; six items are cheap to turn */
  drum.addEventListener('scroll', turn, { passive: true });

  /* open on the design last chosen */
  const mode = document.documentElement.dataset.intro;
  const start = Math.max(0, items.findIndex((li) => li.dataset.mode === mode));
  drum.scrollTop = items[start].offsetTop + items[start].offsetHeight / 2 - drum.clientHeight / 2;
  turn();

  /* the keyboard turns it a notch at a time; Enter plays the centred one */
  const notch = (dir) => {
    const i = Math.max(0, Math.min(items.length - 1, current + dir));
    drum.scrollTo({ top: items[i].offsetTop + items[i].offsetHeight / 2 - drum.clientHeight / 2, behavior: still ? 'auto' : 'smooth' });
  };
  drum.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); notch(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); notch(-1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); location.href = play.href; }
  });
}
