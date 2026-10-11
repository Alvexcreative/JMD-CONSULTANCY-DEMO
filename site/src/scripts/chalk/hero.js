/* Home hero only: the torch that follows the cursor across the headline,
   the key light, and the cloud reflections in the glass. Carried over from the approved home page. */
(function(){
  var still = matchMedia('(prefers-reduced-motion:reduce)').matches;
  (function(){
    var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
    if(!fine || still) return;

    var hero = document.querySelector('.hero'),
        wrap = document.querySelector('.torchwrap');
    if(!hero || !wrap) return;

    var REST_X = 38, REST_Y = 44,
        ttx = REST_X, tty = REST_Y, tcx = REST_X, tcy = REST_Y,
        htx = 50, hty = 42, hcx = 50, hcy = 42, raf = 0;

    addEventListener('pointermove', function(e){
      var hr = hero.getBoundingClientRect();
      htx = (e.clientX - hr.left) / hr.width  * 100;
      hty = (e.clientY - hr.top)  / hr.height * 100;

      /* torch is measured against the headline, not the hero, so the
         highlight sits under the cursor rather than near it */
      var wr = wrap.getBoundingClientRect();
      ttx = (e.clientX - wr.left) / wr.width  * 100;
      tty = (e.clientY - wr.top)  / wr.height * 100;

    });

    document.addEventListener('pointerleave', rest);
    addEventListener('blur', rest);
    function rest(){ ttx = REST_X; tty = REST_Y; }

    function loop(){
      hcx += (htx - hcx) * 0.075; hcy += (hty - hcy) * 0.075;
      tcx += (ttx - tcx) * 0.14;  tcy += (tty - tcy) * 0.14;
      hero.style.setProperty('--mx', hcx.toFixed(2) + '%');
      hero.style.setProperty('--my', hcy.toFixed(2) + '%');
      wrap.style.setProperty('--tx', tcx.toFixed(2) + '%');
      wrap.style.setProperty('--ty', tcy.toFixed(2) + '%');
      raf = requestAnimationFrame(loop);
    }

    /* requestAnimationFrame is suspended entirely while the document is
       hidden — minimised, occluded, or on a background tab. start/stop are
       idempotent, and coming back forces a fresh frame rather than trusting
       the engine to resume a callback queued before the page was hidden. */
    function start(){ if(!raf) raf = requestAnimationFrame(loop); }
    function stop(){ if(raf){ cancelAnimationFrame(raf); raf = 0; } }
    function wake(){ stop(); start(); }

    document.addEventListener('visibilitychange', function(){
      if(document.hidden) stop(); else wake();
    });
    addEventListener('pageshow', wake);   /* bfcache restore */
    addEventListener('focus', wake);      /* window refocused without a visibility change */
    start();
  })();

})();

/* ── Cloud reflections in the hero glass ─────────────────────────────────
   A few soft clouds of different sizes drift slowly across the building's
   glass, with clear glass between them,
   as if the sky behind the camera were moving. Only the glass shows them:
   the mask is worked out from the photograph itself (the window grid is
   busy with fine detail, sky is smooth), so it follows whichever hero image
   is showing. The layer is screened, so it lifts the darker panes and has
   no effect on the white mullions or the pale sky.
   Runs at ~30fps at half resolution; pauses off screen, in a hidden tab,
   and never starts under prefers-reduced-motion. */
(function(){
  if(matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var media = document.getElementById('hero-media');
  if(!media || !window.HTMLCanvasElement) return;
  var veil = media.querySelector('.hero__veil');
  var cv = document.createElement('canvas');
  cv.className = 'hero__clouds'; cv.setAttribute('aria-hidden', 'true');
  media.insertBefore(cv, veil);
  var ctx = cv.getContext('2d');
  var RES = .5;                     /* the clouds are soft: half resolution is plenty */

  /* ── the mask ──────────────────────────────────────────────────────── */
  var masks = {};
  function blur(A, W, H, r){
    var B = new Float32Array(W*H), C = new Float32Array(W*H), x, y, s, n = 2*r + 1;
    for(y = 0; y < H; y++){ s = 0;
      for(x = -r; x <= r; x++) s += A[y*W + Math.min(W-1, Math.max(0, x))];
      for(x = 0; x < W; x++){ B[y*W+x] = s/n; s += A[y*W + Math.min(W-1, x+r+1)] - A[y*W + Math.max(0, x-r)]; } }
    for(x = 0; x < W; x++){ s = 0;
      for(y = -r; y <= r; y++) s += B[Math.min(H-1, Math.max(0, y))*W + x];
      for(y = 0; y < H; y++){ C[y*W+x] = s/n; s += B[Math.min(H-1, y+r+1)*W + x] - B[Math.max(0, y-r)*W + x]; } }
    return C;
  }
  function maskFor(img){
    var key = img.currentSrc || img.src;
    if(masks[key]) return masks[key];
    var W = 480, H = Math.round(W * img.naturalHeight / img.naturalWidth);
    var c = document.createElement('canvas'); c.width = W; c.height = H;
    var x = c.getContext('2d', {willReadFrequently:true});
    x.drawImage(img, 0, 0, W, H);
    var d = x.getImageData(0, 0, W, H).data, L = new Float32Array(W*H), G = new Float32Array(W*H), i, X, Y;
    for(i = 0; i < W*H; i++) L[i] = .299*d[i*4] + .587*d[i*4+1] + .114*d[i*4+2];
    for(Y = 1; Y < H-1; Y++) for(X = 1; X < W-1; X++){ i = Y*W + X;
      G[i] = Math.abs(L[i+1] - L[i-1]) + Math.abs(L[i+W] - L[i-W]); }
    /* texture -> glass; then close the holes left by large smooth panes
       and soften the edge so the reflection never ends on a hard line */
    var E = blur(G, W, H, 5), M = new Float32Array(W*H);
    for(i = 0; i < W*H; i++) M[i] = Math.max(0, Math.min(1, (E[i] - 6) / 10));
    M = blur(M, W, H, 9);
    var out = x.createImageData(W, H);
    for(i = 0; i < W*H; i++){
      var v = Math.max(0, Math.min(1, (M[i] - .22) / .4));
      out.data[i*4] = out.data[i*4+1] = out.data[i*4+2] = 255; out.data[i*4+3] = v * 255;
    }
    x.putImageData(out, 0, 0);
    return (masks[key] = c);
  }

  /* ── the clouds ────────────────────────────────────────────────────── */
  var seed = 20261008;
  function rnd(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  function puff(x, px, py, rx, ry, a, firm){
    x.save(); x.translate(px, py); x.scale(1, ry / rx);
    var g = x.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, 'rgba(255,255,255,' + a + ')');
    g.addColorStop(firm ? .62 : .45, 'rgba(255,255,255,' + (a * (firm ? .78 : .5)) + ')');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.beginPath(); x.arc(0, 0, rx, 0, Math.PI * 2); x.fill(); x.restore();
  }
  /* a cumulus: a soft body heaped on a flat base, a crown of small firm
     puffs along the top, and a cooler, darker underside so it has form */
  function cumulus(w){
    var h = w * .55, c = document.createElement('canvas'); c.width = w; c.height = h;
    var x = c.getContext('2d'), base = h * .76, i, t, env, r;
    var lean = .35 + .3 * rnd();                    /* where the cloud is tallest */
    function envelope(t){ return Math.pow(Math.max(0, Math.sin(Math.PI * Math.pow(t, lean / .5 * .5 + .25))), .8); }
    for(i = 0; i < 34; i++){
      t = rnd(); env = envelope(t); r = h * (.07 + .17 * env * (.6 + .4 * rnd()));
      puff(x, w * (.08 + .84 * t), base - env * h * .36 * (.55 + .45 * rnd()), r * 1.1, r, .2 + .22 * rnd());
    }
    for(i = 0; i < 30; i++){
      t = .1 + .8 * rnd(); env = envelope(t); r = h * (.05 + .07 * rnd());
      puff(x, w * (.08 + .84 * t), base - env * h * .48 * (.8 + .2 * rnd()), r * 1.15, r, .26 + .2 * rnd());
    }
    for(i = 0; i < 9; i++) puff(x, w * (.1 + .8 * rnd()), base, w * (.05 + .06 * rnd()), h * .045, .2);
    x.globalCompositeOperation = 'source-atop';
    var g = x.createLinearGradient(0, base - h * .34, 0, base + h * .06);
    g.addColorStop(0, 'rgba(160,180,200,0)'); g.addColorStop(1, 'rgba(118,142,166,.55)');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    return c;
  }
  /* a wisp: thin strands combed along a gentle curve, like high cloud */
  function wisp(w){
    var h = w * .2, c = document.createElement('canvas'); c.width = w; c.height = h;
    var x = c.getContext('2d'), bend = (rnd() - .5) * h * .9, strands = 3 + (rnd() * 3 | 0);
    for(var k = 0; k < strands; k++){
      var off = (rnd() - .5) * h * .4, len = .55 + .4 * rnd(), start = rnd() * (1 - len);
      for(var i = 0; i < 30; i++){
        var t = i / 29, u = start + len * t, px = w * (.04 + .92 * u);
        var py = h * .5 + off + Math.sin(u * Math.PI) * bend + (rnd() - .5) * h * .14;
        var a = Math.sin(t * Math.PI) * (.1 + .12 * rnd());
        puff(x, px, py, w * (.045 + .05 * rnd()), h * (.07 + .07 * rnd()), a);
      }
    }
    return c;
  }

  var clouds = [], W = 0, H = 0;
  function spawn(c, anywhere){
    var big = rnd();
    c.kind = big < .2 ? 'wisp' : 'cumulus';
    c.w = W * (c.kind === 'wisp' ? .3 + .25 * rnd() : .1 + .2 * big);
    c.img = c.kind === 'wisp' ? wisp(Math.max(60, c.w | 0)) : cumulus(Math.max(60, c.w | 0));
    c.h = c.img.height;
    c.y = H * (-.1 + 1.0 * rnd());
    c.x = anywhere ? -c.w + (W + c.w) * rnd() : -c.w - W * .1 * rnd();
    /* a crossing takes roughly 1.5-3 minutes; larger clouds move a touch faster */
    c.v = W / (95 + 80 * rnd()) * (.8 + .4 * (c.w / W));
    c.a = .45 + .35 * rnd();
    c.dy = (rnd() - .5) * c.v * .08;     /* a little drift, not a straight rail */
  }
  function size(){
    var r = media.getBoundingClientRect(), w = Math.max(2, Math.round(r.width * RES)), h = Math.max(2, Math.round(r.height * RES));
    if(w === cv.width && h === cv.height) return false;
    cv.width = w; cv.height = h; W = w; H = h;
    clouds = []; for(var i = 0; i < 5; i++){ var c = {}; spawn(c, true); clouds.push(c); }
    return true;
  }

  /* the mask is drawn with the same cover geometry as the photograph */
  function cover(img){
    var pos = getComputedStyle(img).objectPosition.split(' ');
    var fx = parseFloat(pos[0]) / 100, fy = parseFloat(pos[1] || '50%') / 100;
    var s = Math.max(W / img.naturalWidth, H / img.naturalHeight), dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    return [(W - dw) * (isNaN(fx) ? .5 : fx), (H - dh) * (isNaN(fy) ? .5 : fy), dw, dh];
  }

  var running = false, visible = true, last = 0, acc = 0, raf = 0, active = null;
  function frame(t){
    raf = 0;
    if(!running) return;
    var dt = last ? Math.min(.1, (t - last) / 1000) : 0; last = t; acc += dt;
    raf = requestAnimationFrame(frame);
    if(acc < 1/30) return;               /* ~30fps is plenty for clouds this slow */
    var step = acc; acc = 0;
    draw(step);
  }
  function draw(step){
    var img = media.querySelector('.hero__img.is-on');
    if(!img || !img.complete || !img.naturalWidth) return;
    if(img !== active){ active = img; cv.classList.add('is-live'); }
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);
    clouds.forEach(function(c){
      c.x += c.v * step; c.y += c.dy * step;
      if(c.x > W + 4) spawn(c, false);
      ctx.globalAlpha = c.a;
      ctx.drawImage(c.img, c.x, c.y, c.w, c.h);
    });
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'destination-in';
    var g = cover(img); ctx.drawImage(maskFor(img), g[0], g[1], g[2], g[3]);
  }
  /* inspection only: draw the layer as it would be `sec` seconds on, for
     checking in a browser that is not painting frames */
  cv.jmdPreview = function(sec){ size(); draw(sec || 0); };
  function update(){
    var go = visible && !document.hidden;
    if(go && !running){ running = true; last = 0; size(); raf = requestAnimationFrame(frame); }
    if(!go && running){ running = false; if(raf) cancelAnimationFrame(raf); raf = 0; }
  }
  new IntersectionObserver(function(es){ visible = es[0].isIntersecting; update(); }).observe(media);
  document.addEventListener('visibilitychange', update);
  addEventListener('resize', function(){ if(running) size(); });
  update();
})();

