/* First-load intro, "Struck" — ported unchanged from concepts/08-chalk.html.
   The gate in the layout's <head> decides whether it plays (home, once a session). */

(function(){
  var root  = document.documentElement, ov = document.getElementById('intro');
  /* the gate at the top of the body decides whether this visit gets the intro */
  if(!ov || !root.classList.contains('intro-on')){ if(ov) ov.setAttribute('hidden',''); return; }
  /* the ghost is a copy of the hero's logo, so the two can never drift apart.
     Its parts are the logo's own: the grey figure, the blue figure, and the
     wordmark beneath them. */
  var real  = document.querySelector('.room__card .mk'),
      ghost = ov.querySelector('.intro__mk');
  if(real && !ghost.firstElementChild){
    var copy = real.cloneNode(true);
    copy.removeAttribute('role'); copy.setAttribute('aria-hidden', 'true');
    var t = copy.querySelector('title'); if(t) t.remove();
    /* ids must stay unique: the copy's clip path is renamed with its use */
    copy.querySelectorAll('[id]').forEach(function(el){
      var was = el.id; el.id = was + '-intro';
      copy.querySelectorAll('[clip-path="url(#' + was + ')"]').forEach(function(u){
        u.setAttribute('clip-path', 'url(#' + el.id + ')'); });
    });
    ghost.appendChild(copy);
  }
  var svg   = ghost.querySelector('svg'),
      deep  = svg && svg.querySelector('.lg-j'),
      face  = svg && svg.querySelector('.lg-md'),
      sub   = svg && svg.querySelector('.lg-word'),
      /* the choreography was written in a 392-unit-wide drawing; the logo's
         own units are scaled to match */
      K     = svg ? svg.viewBox.baseVal.width / 392 : 1,
      still = matchMedia('(prefers-reduced-motion:reduce)').matches,
      EASE  = 'cubic-bezier(.16,1,.3,1)',
      runs  = [], over = false;

  function anim(el, frames, ms, delay, ease, fill){
    var a = el.animate(frames, {duration:ms, delay:delay||0, easing:ease||EASE, fill:fill||'both'});
    runs.push(a); return a;
  }
  function end(){
    if(over) return; over = true;
    root.classList.remove('intro-on'); ov.setAttribute('hidden','');
    runs.forEach(function(a){ a.cancel(); });
    ['pointerdown','keydown','wheel','touchstart'].forEach(function(t){ removeEventListener(t, skip, true); });
  }
  /* anyone who acts during the intro gets the page at once */
  function skip(){ end(); }

  /* the flight: a FLIP onto the real mark, sampled rather than tweened so it
     can travel an arc. x decelerates hard, y eases in and out, so the mark
     moves across before it settles down — a hand setting something down,
     not a slide. filled forwards only: a backwards fill would pin the mark
     to its first frame through the delay and flatten anything before it. */
  function travel(ms, delay){
    var a = ghost.getBoundingClientRect(), b = real.getBoundingClientRect(),
        dx = b.left - a.left, dy = b.top - a.top, S = b.width / a.width, f = [];
    for(var k = 0; k <= 24; k++){
      var p = k / 24, ox = 1 - Math.pow(1 - p, 4), oy = p < .5 ? 2*p*p : 1 - Math.pow(-2*p + 2, 2) / 2;
      f.push({transform:'translate(' + (dx*ox).toFixed(2) + 'px,' + (dy*oy).toFixed(2) + 'px) scale('
             + (1 + (S - 1)*ox).toFixed(4) + ')'});
    }
    /* lifted while it moves: the shadow rises and settles back to nothing */
    anim(svg, [{filter:'drop-shadow(0 0 0 rgba(16,42,64,0))'},
               {filter:'drop-shadow(0 16px 18px rgba(16,42,64,.2))', offset:.35},
               {filter:'drop-shadow(0 0 0 rgba(16,42,64,0))'}], ms, delay, 'ease-in-out', 'forwards');
    return anim(ghost, f, ms, delay, 'linear', 'forwards');
  }

  function run(){
    setTimeout(end, 6000);                /* never leave the page covered */
    if(!real || !svg){ end(); return; }
    /* the intro always starts at the top. scroll restoration is off (see the
       gate), but a browser that still lands part-way down is put back first */
    if(scrollY){ var sb = root.style.scrollBehavior; root.style.scrollBehavior = 'auto';
      scrollTo(0, 0); root.style.scrollBehavior = sb; }
    ['pointerdown','keydown','wheel','touchstart'].forEach(function(t){ addEventListener(t, skip, true); });
    if(still){
      /* reduced motion: no travel at all. the mark is already in place and
         the cover simply dissolves off the page. */
      root.classList.remove('intro-on'); ghost.style.visibility = 'hidden';
      anim(ov, [{opacity:1},{opacity:0}], 420, 120, 'ease-out').finished.then(end, end);
      return;
    }

    /* On a phone the intro is the only thing between someone and the site,
       often on mobile data. Same choreography, about a third quicker. */
    var P = innerWidth < 720 ? .62 : 1;
    var sheet = ov.querySelector('.intro__paper'),
        MERGE = Math.round(1500 * P), START = Math.round(120 * P), HIT = START + MERGE;
    svg.style.transformOrigin = '50% 50%';
    /* the two figures come in from opposite corners and close on that
       diagonal, easing in and out so they are visibly closing right up to
       the moment their hands meet */
    /* they close with a little momentum left, so the press is caused by the
       meeting rather than starting from a standstill after it */
    var MERGE_EASE = 'cubic-bezier(.45,0,.38,.97)';
    function at(x, y){ return 'translate(' + (x*K).toFixed(1) + 'px,' + (y*K).toFixed(1) + 'px)'; }
    anim(deep, [{transform:at(-104,-58),opacity:0},
                {transform:at(-92,-51), opacity:.9,offset:.16},
                {transform:'none',opacity:1}], MERGE, START, MERGE_EASE);
    anim(face, [{transform:at(110,62),opacity:0},
                {transform:at(97,55),  opacity:.9,offset:.16},
                {transform:'none',opacity:1}], MERGE, START, MERGE_EASE);
    /* the wordmark is held back: it is what the strike prints */
    anim(sub,  [{opacity:0},{opacity:0}], 1, 0);

    /* the click: one damped spring, sampled, so the press, the rebound and
       the settle are a single continuous curve with no corners in it.
       displacement d(t) = e^(-z w t) sin(wd t), normalised to its first lobe:
       a 2.2% press at ~150ms, a barely-there rebound (~0.35%), settled by 820ms. */
    var SPRING = Math.round(820 * P), DEPTH = .022,
        W = 2 * Math.PI * 1.6, Z = .5, WD = W * Math.sqrt(1 - Z*Z), N = 40,
        raw = [], peak = 0, press = [];
    for(var k = 0; k <= N; k++){
      var t = k / N * SPRING / 1000, d = Math.exp(-Z*W*t) * Math.sin(WD*t);
      raw.push(d); if(d > peak) peak = d;
    }
    raw[N] = 0;
    raw.forEach(function(d, k){
      var n = d / peak;
      press.push({transform:'scale(' + (1 - DEPTH*n).toFixed(5) + ')', offset:k/N});
    });
    /* forwards only: a backwards fill would hold these at rest through their
       delay and flatten the merge animations underneath them */
    anim(svg,  press,  SPRING, HIT, 'linear', 'forwards');

    /* ...and what it prints: the wordmark comes up as the logo lifts */
    anim(sub,  [{opacity:0,transform:at(0,5)},{opacity:1,transform:'none'}], Math.round(680 * P), HIT + Math.round(300 * P));
    var LIFT = HIT + Math.round(1000 * P);
    anim(sheet, [{opacity:1},{opacity:0}], Math.round(720 * P), LIFT + 60, 'cubic-bezier(.4,0,.6,1)');
    travel(Math.round(860 * P), LIFT).finished.then(end, end);

  }

  if(document.fonts && document.fonts.ready) document.fonts.ready.then(run);
  else addEventListener('load', run);
})();
