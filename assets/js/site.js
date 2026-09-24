/* MindMed Tutors — behaviour shared by every page: nav, mobile menu, FAQ accordion,
   scroll reveals and the footer year. Page scripts call MM.reveal() with their own settings. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EASE = 'cubic-bezier(0.32,0.72,0,1)';

  /* Nav: soft shadow once the page scrolls (home only; sub-pages keep it on). */
  var nav = document.querySelector('[data-nav]');
  if (nav && nav.hasAttribute('data-nav-scroll')) {
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;';
    document.body.prepend(sentinel);
    new IntersectionObserver(function (e) {
      nav.classList.toggle('is-scrolled', !e[0].isIntersecting);
    }, { rootMargin: '-40px 0px 0px 0px' }).observe(sentinel);
  }

  /* Burger + full-screen sheet menu. */
  var burger = document.querySelector('[data-burger]');
  var sheet = document.querySelector('[data-sheet]');
  if (burger && sheet) {
    var setMenu = function (open) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      sheet.classList.toggle('is-open', open);
      sheet.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open) sheet.removeAttribute('inert'); else sheet.setAttribute('inert', '');
    };
    setMenu(false);
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 980) setMenu(false); });
  }

  /* FAQ accordion: one open at a time. */
  document.querySelectorAll('[data-faq]').forEach(function (list) {
    var rows = Array.prototype.slice.call(list.querySelectorAll('.faq-row'));
    rows.forEach(function (row) {
      var btn = row.querySelector('.faq-q');
      btn.addEventListener('click', function () {
        var opening = btn.getAttribute('aria-expanded') !== 'true';
        rows.forEach(function (r) {
          var b = r.querySelector('.faq-q');
          var on = opening && r === row;
          b.setAttribute('aria-expanded', on ? 'true' : 'false');
          r.querySelector('.faq-sign').textContent = on ? '−' : '+';
          r.querySelector('.faq-a').hidden = !on;
        });
      });
    });
  });

  /* Footer year. */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Scroll reveal.
     home:  800ms rise from 64px (or slide ±56px for data-rv="l"/"r") + 12px blur, 80ms sibling stagger.
     sub:   700ms rise from 40px, no blur. */
  function reveal(opts) {
    opts = opts || {};
    if (reduce) return;
    var home = opts.style === 'home';
    var ms = home ? 800 : 700;
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-rv]'));
    els.forEach(function (el) {
      el.style.transition = 'opacity ' + ms + 'ms ' + EASE + ', transform ' + ms + 'ms ' + EASE + (home ? ', filter ' + ms + 'ms ' + EASE : '');
      el.style.opacity = '0';
      if (home) {
        var dir = el.getAttribute('data-rv');
        el.style.filter = 'blur(12px)';
        el.style.transform = dir === 'l' ? 'translateX(-56px)' : dir === 'r' ? 'translateX(56px)' : 'translateY(64px)';
      } else {
        el.style.transform = 'translateY(40px)';
      }
    });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        if (home) {
          var sibs = Array.prototype.slice.call(el.parentNode.children).filter(function (n) { return n.hasAttribute && n.hasAttribute('data-rv'); });
          el.style.transitionDelay = (Math.min(Math.max(sibs.indexOf(el), 0), 5) * 80) + 'ms';
          el.style.filter = 'none';
        }
        el.style.opacity = '1';
        el.style.transform = 'none';
        setTimeout(function () {
          el.style.transition = ''; el.style.transitionDelay = ''; el.style.transform = ''; el.style.filter = '';
        }, home ? 1400 : 900);
        obs.unobserve(el);
      });
    }, home ? { threshold: 0.12, rootMargin: '0px 0px -60px 0px' } : { threshold: 0.1 });
    els.forEach(function (el) { obs.observe(el); });
  }

  window.MM = { reveal: reveal, reduce: reduce };
})();
