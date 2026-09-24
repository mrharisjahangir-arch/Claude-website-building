/* MindMed Tutors — Home page behaviour.
   Hero heartbeat + review drops, hero parallax (GSAP ScrollTrigger, scrub: true, native scroll —
   no smooth-scroll library), KMMS layered card stack, journey tabs, review hover stack, 2-step lead form. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isCoarse = function () { return window.matchMedia('(pointer: coarse)').matches; };

  MM.reveal({ style: 'home' });

  /* ---------------------------------------------------------------------------
     Pinned hero: when the hero is taller than the window, stick it at its bottom
     edge so the CTA, rating row and ECG line stay reachable. */
  var hero = document.getElementById('hero');
  function fitSticky() {
    if (!hero) return;
    var h = hero.offsetHeight, vh = window.innerHeight;
    hero.style.top = h > vh ? (vh - h) + 'px' : '0px';
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }
  fitSticky();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitSticky);
  window.addEventListener('resize', fitSticky);
  if (window.ResizeObserver && hero) new ResizeObserver(fitSticky).observe(hero);

  /* ---------------------------------------------------------------------------
     Hero heartbeat. Reviews drop bottom row first on both sides. Rows 1 and 2
     send a ripple along the flatline; the top row lands hardest and starts the pulse. */
  (function initEcg() {
    var btn = document.getElementById('heroBookBtn');
    var stacks = Array.prototype.slice.call(document.querySelectorAll('[data-rev-stack]'));
    var ecg = document.getElementById('heroEcg');
    var travel = document.getElementById('ecgTravel');
    var scaleG = document.getElementById('ecgScale');
    var wave = document.getElementById('ecgWave');
    var glow = document.getElementById('ecgGlow');
    var flat = document.getElementById('ecgFlat');
    var rip = document.getElementById('ecgRipple');
    var maskRect = document.getElementById('ecgMaskRect');
    if (!hero || !btn || stacks.length < 2 || !ecg || !travel || !scaleG || !maskRect) return;

    var BEAT = '#D93E7C', CYCLE = 2.8;
    var btnX = 0, stackXs = [0, 0], heroW = 0, alive = false, raf = null, t0 = 0, prevHead = null;
    var rgba = function (a) { return 'rgba(217,62,124,' + a + ')'; };
    var setHead = function (x) { maskRect.setAttribute('transform', 'translate(' + (x - 108) + ',0)'); };
    var relTop = function (el, anc) { var y = 0, n = el; while (n && n !== anc) { y += n.offsetTop; n = n.offsetParent; } return y; };
    var relLeft = function (el, anc) { var x = 0, n = el; while (n && n !== anc) { x += n.offsetLeft; n = n.offsetParent; } return x; };

    function layout() {
      var wide = window.innerWidth >= 1100;
      stacks.forEach(function (s) { s.style.height = 'auto'; });
      var btnMid = relTop(btn, hero) + btn.offsetHeight / 2;
      btnX = relLeft(btn, hero) + btn.offsetWidth / 2;
      var bottoms = stacks.map(function (s) { return relTop(s, hero) + s.scrollHeight; });
      var lineY;
      if (wide) {
        lineY = Math.max(btnMid, Math.max.apply(null, bottoms) + 10);
        stacks.forEach(function (s) { s.style.height = (lineY - 10 - relTop(s, hero)) + 'px'; });
      } else {
        lineY = Math.max.apply(null, bottoms) + 12;
      }
      stackXs = stacks.map(function (s) { return relLeft(s, hero) + s.offsetWidth / 2; });
      heroW = hero.clientWidth;
      var off = ((btnX - 274) % 600 + 600) % 600;
      travel.setAttribute('transform', 'translate(' + (off - 600) + ',0)');
      ecg.style.top = (lineY - 120) + 'px';
      if (!alive) setHead(-2000);
    }

    // Damped ripples spreading out from each impact along the flatline.
    var ripples = [], rRaf = null;
    function drawR(now) {
      for (var i = ripples.length - 1; i >= 0; i--) if (now - ripples[i].t0 > ripples[i].dur) ripples.splice(i, 1);
      if (!ripples.length || !rip) { if (rip) rip.setAttribute('d', ''); rRaf = null; return; }
      var lo = Infinity, hi = -Infinity, fade = 0;
      ripples.forEach(function (r) { var t = (now - r.t0) / r.dur, R = 40 + t * 720; lo = Math.min(lo, r.x - R); hi = Math.max(hi, r.x + R); fade = Math.max(fade, 1 - t); });
      lo = Math.max(0, lo); hi = Math.min(heroW || 1600, hi);
      var d = '';
      for (var x = lo; x <= hi; x += 4) {
        var y = 0;
        ripples.forEach(function (r) {
          var t = (now - r.t0) / r.dur, R = 40 + t * 720, dx = Math.abs(x - r.x);
          if (dx > R) return;
          var env = r.amp * Math.pow(1 - t, 2) * Math.exp(-dx / 300);
          y += env * Math.sin((R - dx) / 15) * Math.min(1, (R - dx) / 36);
        });
        d += (d ? 'L' : 'M') + x.toFixed(0) + ',' + (120 - y).toFixed(1);
      }
      rip.setAttribute('d', d);
      rip.style.opacity = Math.min(1, fade * 1.6).toFixed(2);
      rRaf = requestAnimationFrame(drawR);
    }
    function rippleAt(x, amp, dur) {
      ripples.push({ x: x, amp: amp, dur: dur, t0: performance.now() });
      if (!rRaf) rRaf = requestAnimationFrame(drawR);
    }

    function pulseButton() {
      btn.animate([
        { boxShadow: 'rgba(29,27,34,0.18) 0px 1px 4px 0px, 0 0 0 0px ' + rgba(0.5) },
        { boxShadow: 'rgba(29,27,34,0.18) 0px 1px 4px 0px, 0 0 0 10px ' + rgba(0.18), offset: 0.35 },
        { boxShadow: 'rgba(29,27,34,0.18) 0px 1px 4px 0px, 0 0 0 22px ' + rgba(0) }
      ], { duration: 620, easing: 'cubic-bezier(.2,.7,.3,1)' });
    }

    function revive() {
      alive = true;
      scaleG.animate([
        { transform: 'scaleY(0)' },
        { transform: 'scaleY(1.5)', offset: 0.3 },
        { transform: 'scaleY(0.9)', offset: 0.62 },
        { transform: 'scaleY(1)' }
      ], { duration: 1000, easing: 'cubic-bezier(.2,.8,.25,1)', fill: 'forwards' });
      scaleG.style.transform = 'scaleY(1)';
      if (flat) flat.animate([
        { stroke: BEAT, strokeWidth: 7, opacity: 1 },
        { stroke: BEAT, strokeWidth: 4, opacity: 1, offset: 0.25 },
        { stroke: '#DFD7CE', strokeWidth: 2.5, opacity: 0.5 }
      ], { duration: 900, easing: 'ease-out', fill: 'forwards' });
      if (wave) wave.animate([{ strokeWidth: 9, opacity: 1 }, { strokeWidth: 3.5, opacity: 1 }], { duration: 900, easing: 'ease-out' });
      if (glow) glow.animate([{ opacity: 0.85, strokeWidth: 26 }, { opacity: 0.22, strokeWidth: 14 }], { duration: 900, easing: 'ease-out' });
      t0 = performance.now();
      prevHead = null;
      var loop = function (now) {
        var sweep = CYCLE * 0.78;
        var cycle = Math.floor((now - t0) / 1000 / CYCLE);
        var startX = cycle === 0 ? stackXs[1] + 130 : (heroW || 1200) + 220;
        var ph = ((now - t0) / 1000) % CYCLE;
        var k = ph <= sweep ? ph / sweep : 1;
        var head = startX + (-1300 - startX) * k;
        setHead(head);
        if (prevHead != null && prevHead >= btnX && head < btnX) pulseButton();
        prevHead = head;
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    // After landing, cards lift and grow slightly on hover.
    function settle(el, anim) {
      var t = parseFloat(el.getAttribute('data-tilt')) || 0;
      var rest = 'rotate(' + t + 'deg)', shadow = 'rgba(107,75,168,0.10) 6px 4px 24px 0px';
      el.style.opacity = '1';
      el.style.transform = rest;
      if (anim) anim.cancel();
      el.style.transition = 'transform 380ms cubic-bezier(0.22,1.4,0.36,1), box-shadow 380ms ease';
      el.style.cursor = 'default';
      if (el._mmHover) return;
      el._mmHover = true;
      el.addEventListener('mouseenter', function () { el.style.transform = 'translateY(-8px) scale(1.05) rotate(0deg)'; el.style.boxShadow = 'rgba(107,75,168,0.24) 8px 16px 40px 0px'; el.style.zIndex = '5'; });
      el.addEventListener('mouseleave', function () { el.style.transform = rest; el.style.boxShadow = shadow; el.style.zIndex = ''; });
    }

    function drop(el, delay, hard) {
      var t = parseFloat(el.getAttribute('data-tilt')) || 0;
      var a;
      if (hard) {
        a = el.animate([
          { transform: 'translateY(-1250px) rotate(' + (t * 4) + 'deg) scaleY(1.06)', opacity: 0, offset: 0, easing: 'cubic-bezier(.7,0,.9,.4)' },
          { transform: 'translateY(0px) rotate(' + t + 'deg) scaleY(.88)', opacity: 1, offset: 0.62, easing: 'cubic-bezier(.2,0,.3,1)' },
          { transform: 'translateY(-44px) rotate(' + t + 'deg) scaleY(1.05)', opacity: 1, offset: 0.78, easing: 'cubic-bezier(.6,0,.35,1)' },
          { transform: 'translateY(0px) rotate(' + t + 'deg) scaleY(.96)', opacity: 1, offset: 0.9, easing: 'cubic-bezier(.3,0,.3,1)' },
          { transform: 'translateY(0px) rotate(' + t + 'deg) scaleY(1)', opacity: 1, offset: 1 }
        ], { duration: 780, delay: delay, fill: 'both' });
        a.onfinish = function () { settle(el, a); };
        return 484;
      }
      a = el.animate([
        { transform: 'translateY(-940px) rotate(' + (t * 3) + 'deg)', opacity: 0, offset: 0, easing: 'cubic-bezier(.55,0,.85,.35)' },
        { transform: 'translateY(0px) rotate(' + t + 'deg)', opacity: 1, offset: 0.68, easing: 'cubic-bezier(.25,0,.35,1)' },
        { transform: 'translateY(-22px) rotate(' + t + 'deg)', opacity: 1, offset: 0.84, easing: 'cubic-bezier(.6,0,.35,1)' },
        { transform: 'translateY(0px) rotate(' + t + 'deg)', opacity: 1, offset: 1 }
      ], { duration: 1050, delay: delay, fill: 'both' });
      a.onfinish = function () { settle(el, a); };
      return 714;
    }

    function play() {
      scaleG.style.transform = 'scaleY(0)';
      var cols = stacks.map(function (s) { return Array.prototype.slice.call(s.querySelectorAll('[data-card]')).reverse(); });
      var tiers = Math.max(cols[0].length, cols[1].length);
      for (var tier = 0; tier < tiers; tier++) {
        (function (tier) {
          var last = tier === tiers - 1;
          var base = 200 + tier * 520;
          cols.forEach(function (col, side) {
            var el = col[tier];
            if (!el) return;
            var delay = base + (last ? 0 : side * 150);
            var impact = drop(el, delay, last);
            var amp = last ? 34 : 7 + tier * 6;
            setTimeout(function () { rippleAt(stackXs[side], amp, last ? 1400 : 950); }, delay + impact);
          });
          if (last) setTimeout(revive, base + 484 + 60);
        })(tier);
      }
    }

    layout();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    window.addEventListener('resize', layout);

    if (reduce) {
      stacks.forEach(function (s) { s.querySelectorAll('[data-card]').forEach(function (c) { settle(c, null); }); });
      scaleG.style.transform = 'scaleY(1)';
      setHead(btnX || 400);
    } else {
      play();
    }
  })();

  /* ---------------------------------------------------------------------------
     GSAP-dependent: hero parallax + KMMS layered stack. GSAP loads deferred from CDN. */
  function whenGsap(cb) {
    if (window.gsap && window.ScrollTrigger) return cb();
    var tries = 0;
    var t = setInterval(function () {
      if (window.gsap && window.ScrollTrigger) { clearInterval(t); cb(); }
      else if (++tries > 125) clearInterval(t);
    }, 80);
  }

  whenGsap(function () {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);

    // Parallax: grid 12%, text 18%, review stacks 30%; hero dims and blurs as the panel slides over.
    // scrub: true = tracks the native scrollbar 1:1. No smoothing, no Lenis.
    if (!reduce && hero) {
      var tl = gsap.timeline({
        scrollTrigger: { start: 0, end: function () { return hero.offsetHeight; }, scrub: true, invalidateOnRefresh: true }
      });
      [['1', 12], ['2', 18], ['3', 30]].forEach(function (l) {
        var els = document.querySelectorAll('[data-parallax-layer="' + l[0] + '"]');
        if (els.length) tl.to(els, { yPercent: l[1], ease: 'none', duration: 1 }, 0);
      });
      tl.to(hero, { opacity: 0.32, filter: 'blur(3px)', ease: 'none', duration: 0.45 }, 0.55);
      ST.refresh();
    }

    // KMMS layered stack: cards pile in the centre with a tilt; hover (tap on touch) deals them out.
    var box = document.querySelector('[data-lstack]');
    var hint = document.querySelector('[data-lstack-hint]');
    if (hint) hint.textContent = isCoarse() ? 'Tap to spread the cards' : 'Hover to spread the cards';
    if (!box || reduce) return;
    var cards = Array.prototype.slice.call(box.children).filter(function (c) { return c.tagName === 'A'; });
    var rots = [-6, 5, -3, 8];
    var stacked = true;
    function stack() {
      stacked = true;
      cards.forEach(function (c, i) {
        gsap.to(c, {
          x: box.clientWidth / 2 - c.offsetWidth / 2 - c.offsetLeft,
          y: box.clientHeight / 2 - c.offsetHeight / 2 - c.offsetTop,
          rotate: rots[i % rots.length], zIndex: 100 - i, duration: 0.5, ease: 'power2.out', overwrite: true
        });
      });
    }
    function spread() {
      stacked = false;
      gsap.to(cards, { x: 0, y: 0, rotate: 0, zIndex: 1, duration: 0.6, ease: 'power3.out', stagger: { amount: 0.05, from: 'start' }, overwrite: true });
    }
    stack();
    box.addEventListener('mouseenter', function () { if (!isCoarse()) spread(); });
    box.addEventListener('mouseleave', function () { if (!isCoarse()) stack(); });
    box.addEventListener('click', function (e) {
      if (!isCoarse() || !stacked) return;
      e.preventDefault();
      spread();
      if (hint) hint.textContent = 'Tap a card to open it';
    }, true);
    box.addEventListener('focusin', function () { if (stacked) spread(); });
    box.addEventListener('focusout', function (e) { if (!box.contains(e.relatedTarget) && !isCoarse()) stack(); });
    window.addEventListener('resize', function () { if (stacked) stack(); });
  });

  /* ---------------------------------------------------------------------------
     Journey tabs (arrow keys move between tabs). */
  (function initTabs() {
    var list = document.querySelector('[data-tabs]');
    if (!list) return;
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function select(i, focus) {
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % tabs.length, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
      });
    });
  })();

  /* ---------------------------------------------------------------------------
     Reviews: hover stack on wide, fine-pointer screens (>= 900px); simple grid otherwise.
     Cards 280x340 overlap horizontally; the hovered card lifts, straightens and the rest push aside. */
  (function initReviewStack() {
    var stage = document.querySelector('[data-rev-stage]');
    if (!stage) return;
    var cards = Array.prototype.slice.call(stage.querySelectorAll('.rev-card'));
    var n = cards.length, CW = 280, LIFT = 30;
    var ROTS = [-8, 5, -3, 6, -4, 7, -5, 4, -6, 3, -2];
    var mode = null, active = null, overlap = 0, push = 0;

    function paint() {
      cards.forEach(function (c, i) {
        var x = i * overlap, y = 0, rot = ROTS[i % ROTS.length], z = i + 1, s = 1;
        var sh = '0 10px 30px -14px rgba(29,27,34,0.30)';
        if (active != null) {
          if (i < active) { x -= push; y -= 10; } else if (i > active) { x += push; y += 10; }
          if (i === active) { y = -LIFT; rot = 0; z = 999; s = 1.035; sh = '0 28px 56px -16px rgba(29,27,34,0.40)'; }
        }
        c.style.transition = i === active
          ? 'transform 500ms cubic-bezier(0.22,1.6,0.32,1), box-shadow 640ms cubic-bezier(0.22,1.6,0.32,1)'
          : active != null ? 'transform 500ms cubic-bezier(0.22,1,0.36,1), box-shadow 500ms ease'
          : 'transform 340ms cubic-bezier(0.4,0,0.2,1), box-shadow 270ms ease';
        c.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) rotate(' + rot + 'deg) scale(' + s + ')';
        c.style.zIndex = z;
        c.style.boxShadow = sh;
      });
    }

    function apply() {
      var vw = window.innerWidth;
      var want = vw >= 900 && !isCoarse() ? 'stack' : 'grid';
      if (want === 'stack') {
        var avail = Math.min(vw - 48, 1120);
        overlap = Math.max(60, Math.min(130, (avail - CW) / (n - 1)));
        push = Math.min(220, overlap * 1.9);
        stage.style.width = Math.round((n - 1) * overlap + CW) + 'px';
        stage.style.height = (340 + LIFT + 40) + 'px';
      }
      if (want !== mode) {
        mode = want;
        active = null;
        stage.classList.toggle('is-stack', mode === 'stack');
        stage.classList.toggle('is-grid', mode === 'grid');
        if (mode === 'grid') {
          stage.style.width = ''; stage.style.height = '';
          cards.forEach(function (c) { c.style.transition = ''; c.style.transform = ''; c.style.zIndex = ''; c.style.boxShadow = ''; });
        }
      }
      if (mode === 'stack') paint();
    }

    cards.forEach(function (c, i) {
      c.addEventListener('mouseenter', function () { if (mode === 'stack') { active = i; paint(); } });
      c.addEventListener('mouseleave', function () { if (mode === 'stack') { active = null; paint(); } });
    });
    apply();
    window.addEventListener('resize', apply);
  })();

  /* ---------------------------------------------------------------------------
     Lead form: step 1 pick what you need (Next disabled until one is picked),
     step 2 name + email, then success. */
  (function initForm() {
    var form = document.querySelector('[data-lead-form]');
    if (!form) return;

    /**
     * The single integration point for the enquiry form.
     * Point ENQUIRY_ENDPOINT at your own serverless function (Netlify / Vercel /
     * Cloudflare Worker / Formspree). That function holds any API key or mailbox
     * credentials and forwards the enquiry. Never put a key in this file: it is
     * public to every visitor. Until it is set the form says so honestly instead
     * of pretending to have sent anything.
     */
    var ENQUIRY_ENDPOINT = '';

    var picks = Array.prototype.slice.call(form.querySelectorAll('.pick'));
    var next = form.querySelector('[data-next]');
    var back = form.querySelector('[data-back]');
    var submitBtn = form.querySelector('[data-submit]');
    var step1 = form.querySelector('[data-step="1"]');
    var step2 = form.querySelector('[data-step="2"]');
    var stepNum = form.querySelector('[data-step-num]');
    var bar = form.querySelector('[data-step-bar]');
    var err = form.querySelector('[data-form-err]');
    var open = form.querySelector('[data-form-open]');
    var done = form.querySelector('[data-form-done]');
    var ERR_DEFAULT = err.textContent;

    function anyPicked() { return picks.some(function (p) { return p.getAttribute('aria-pressed') === 'true'; }); }
    function syncNext() { next.setAttribute('aria-disabled', anyPicked() ? 'false' : 'true'); }
    function goStep(s) {
      step1.hidden = s !== 1;
      step2.hidden = s !== 2;
      stepNum.textContent = s;
      bar.style.width = s === 1 ? '50%' : '100%';
      if (s === 2) form.querySelector('[data-step2-h]').focus();
    }
    function showErr(msg) { err.textContent = msg || ERR_DEFAULT; err.hidden = false; }

    picks.forEach(function (p) {
      p.addEventListener('click', function () {
        p.setAttribute('aria-pressed', p.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        syncNext();
      });
    });
    next.addEventListener('click', function () { if (anyPicked()) goStep(2); });
    back.addEventListener('click', function () { err.hidden = true; goStep(1); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      if (!name || !/^\S+@\S+\.\S+$/.test(email)) return showErr();
      err.hidden = true;
      var interests = picks.filter(function (p) { return p.getAttribute('aria-pressed') === 'true'; })
        .map(function (p) { return p.textContent.trim(); });

      if (!ENQUIRY_ENDPOINT) return showErr('The booking form is not connected yet. Please try again soon.');

      submitBtn.disabled = true;
      fetch(ENQUIRY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, interests: interests })
      }).then(function (res) {
        if (!res.ok) throw new Error();
        open.hidden = true;
        done.hidden = false;
        form.querySelector('[data-done-h]').focus();
      }).catch(function () {
        showErr('Something went wrong. Please try again.');
      }).then(function () { submitBtn.disabled = false; });
    });

    syncNext();
  })();
})();
