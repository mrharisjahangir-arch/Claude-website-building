/* MindMed Tutors — medical school finder.
   Loads data/schools.json (51 schools, 2027 entry), then search, filter, sort, expand
   details and compare up to 4 schools side by side. Row elements are built once and
   reordered / hidden on each change so focus and open state survive filtering. */
(function () {
  'use strict';

  MM.reveal();

  var FIELDS = [
    ['UCAT required', 'ucat'], ['UCAT cut-off (2026 entry)', 'cutoff'], ['How UCAT is used', 'ucatUse'], ['SJT', 'sjt'],
    ['A-level offer', 'alevel'], ['Contextual offer', 'context'], ['Chemistry needed', 'chem'], ['Biology needed', 'bio'],
    ['Predicted grades', 'predicted'], ['GCSEs', 'gcse'], ['How GCSEs are used', 'gcseUse'], ['Personal statement', 'ps'],
    ['A-level resits', 'resits'], ['Interview', 'interview'], ['International', 'intl'], ['Course', 'course']
  ];
  var TICK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>';
  var CHEV = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D1B22" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  var state = { q: '', nation: 'All', iv: 'All', noChem: false, noPred: false, hideGrad: false, sort: 'az', cmp: [] };
  var schools = [];
  var rowsEl = document.querySelector('[data-rows]');
  var countEl = document.querySelector('[data-count]');
  var emptyEl = document.querySelector('[data-empty]');
  var qEl = document.querySelector('[data-q]');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function short(t, n) {
    t = t || '—';
    return t.length > n ? t.slice(0, n - 1).replace(/[\s,;·(]+$/, '') + '…' : t;
  }
  // First current-scale (1500–2700) cut-off number; ignores old /3600 scores.
  function cutNum(s) {
    var c = s.cutoff || '';
    var m = c.match(/\b(1[5-9]\d\d|2[0-6]\d\d|2700)\b/);
    return m && !/\/3600/.test(c.slice(0, c.indexOf(m[0]) + 10)) ? +m[0] : null;
  }
  var isGrad = function (s) { return /GRADUATE ENTRY ONLY/i.test(s.course); };
  var isKmms = function (s) { return /Kent & Medway/.test(s.name); };

  function buildRow(s, i) {
    var el = document.createElement('article');
    el.className = 'school' + (isKmms(s) ? ' is-kmms' : '');
    var cut = cutNum(s);
    var id = 'd-' + i;
    el.innerHTML =
      '<div class="row-main">' +
        '<button type="button" class="cmp-box" aria-pressed="false" aria-label="Compare ' + esc(s.name) + '">' + TICK + '</button>' +
        '<div style="min-width:0;"><h3>' + esc(s.name) + '</h3><p class="meta">' + esc(s.nation) + ' · ' + esc(short(s.course, 34)) + '</p></div>' +
        '<div class="cell"><span class="lbl">UCAT cut-off</span><span class="val' + (cut ? '' : ' none') + '">' + esc(short(s.cutoff, 60)) + '</span></div>' +
        '<div class="cell"><span class="lbl">A-levels</span><span class="val">' + esc(short(s.alevel, 40)) + '</span></div>' +
        '<div class="cell"><span class="iv iv-' + esc(s.ivType || 'Other') + '">' + esc(s.ivType || '—') + '</span></div>' +
        '<button type="button" class="chev" aria-expanded="false" aria-controls="' + id + '" aria-label="Show details for ' + esc(s.name) + '">' + CHEV + '</button>' +
      '</div>' +
      '<dl class="details" id="' + id + '" hidden></dl>';

    var box = el.querySelector('.cmp-box');
    var chev = el.querySelector('.chev');
    var det = el.querySelector('.details');

    chev.addEventListener('click', function () {
      var open = chev.getAttribute('aria-expanded') !== 'true';
      if (open && !det.childElementCount) {
        det.innerHTML = FIELDS.filter(function (f) { return s[f[1]]; }).map(function (f) {
          return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(s[f[1]]) + '</dd></div>';
        }).join('') + (isKmms(s) ? '<a class="kmms-link" href="../kmms/">Full KMMS guide <span aria-hidden="true">&rarr;</span></a>' : '');
      }
      det.hidden = !open;
      chev.setAttribute('aria-expanded', open ? 'true' : 'false');
      chev.setAttribute('aria-label', (open ? 'Hide' : 'Show') + ' details for ' + s.name);
    });

    box.addEventListener('click', function () {
      var k = state.cmp.indexOf(s.name);
      if (k >= 0) state.cmp.splice(k, 1);
      else { state.cmp.push(s.name); if (state.cmp.length > 4) state.cmp.shift(); }
      renderCompare();
    });

    s._el = el; s._box = box;
    return el;
  }

  function renderList() {
    var q = state.q.trim().toLowerCase();
    var list = schools.filter(function (s) {
      return (!q || s.name.toLowerCase().indexOf(q) >= 0) &&
        (state.nation === 'All' || s.nation === state.nation) &&
        (state.iv === 'All' || s.ivType === state.iv) &&
        (!state.noChem || s.chem === 'No' || s.chem === 'Either') &&
        (!state.noPred || /^no/i.test(s.predicted) || /threshold|screen/i.test(s.predicted)) &&
        (!state.hideGrad || !isGrad(s));
    });
    if (state.sort !== 'az') {
      list = list.slice().sort(function (a, b) {
        var x = cutNum(a), y = cutNum(b);
        if (x == null && y == null) return a.name.localeCompare(b.name);
        if (x == null) return 1;
        if (y == null) return -1;
        return state.sort === 'low' ? x - y : y - x;
      });
    }
    var shown = {};
    list.forEach(function (s) { shown[s.name] = true; s._el.hidden = false; rowsEl.appendChild(s._el); });
    schools.forEach(function (s) { if (!shown[s.name]) s._el.hidden = true; });
    countEl.textContent = list.length + ' of ' + schools.length + ' schools';
    emptyEl.hidden = !(schools.length && !list.length);
  }

  function renderCompare() {
    var picked = state.cmp.map(function (n) { return schools.filter(function (s) { return s.name === n; })[0]; }).filter(Boolean);
    schools.forEach(function (s) {
      var on = state.cmp.indexOf(s.name) >= 0;
      s._box.setAttribute('aria-pressed', on ? 'true' : 'false');
      s._el.classList.toggle('is-picked', on);
    });

    var bar = document.querySelector('[data-cmp-bar]');
    bar.hidden = !picked.length;
    document.querySelector('[data-cmp-label]').textContent = picked.length + (picked.length === 1 ? ' school picked' : ' schools picked') + ' (max 4)';

    var sec = document.querySelector('[data-compare]');
    sec.hidden = !picked.length;
    if (!picked.length) return;
    var grid = document.querySelector('[data-cmp-grid]');
    grid.style.gridTemplateColumns = '160px repeat(' + picked.length + ', minmax(200px,1fr))';
    grid.style.minWidth = (160 + picked.length * 212) + 'px';
    var html = '<div></div>' + picked.map(function (s) { return '<div class="cmp-head">' + esc(s.name) + '</div>'; }).join('');
    FIELDS.forEach(function (f) {
      html += '<div class="cmp-key">' + esc(f[0]) + '</div>' + picked.map(function (s) { return '<div class="cmp-val">' + esc(s[f[1]] || '—') + '</div>'; }).join('');
    });
    grid.innerHTML = html;
  }

  // Filters
  document.querySelectorAll('[data-group]').forEach(function (g) {
    var key = g.getAttribute('data-group');
    var btns = Array.prototype.slice.call(g.querySelectorAll('button'));
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        state[key] = b.getAttribute('data-val');
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        renderList();
      });
    });
  });
  document.querySelectorAll('[data-toggle]').forEach(function (b) {
    var key = b.getAttribute('data-toggle');
    b.addEventListener('click', function () {
      state[key] = !state[key];
      b.setAttribute('aria-pressed', state[key] ? 'true' : 'false');
      renderList();
    });
  });
  document.querySelector('[data-sort]').addEventListener('change', function (e) { state.sort = e.target.value; renderList(); });
  qEl.addEventListener('input', function () { state.q = qEl.value; renderList(); });
  document.querySelector('[data-search-form]').addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('finder').scrollIntoView({ behavior: MM.reduce ? 'auto' : 'smooth' });
  });
  document.querySelector('[data-clear]').addEventListener('click', function () { state.cmp = []; renderCompare(); });

  fetch('../data/schools.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      schools = data;
      document.querySelector('[data-total]').textContent = schools.length;
      document.querySelector('[data-mmi]').textContent = schools.filter(function (s) { return s.ivType === 'MMI'; }).length;
      schools.forEach(buildRow);
      renderList();
    })
    .catch(function () {
      rowsEl.innerHTML = '<p style="text-align:center; color:#5C5661;">Could not load the school list. Please refresh the page.</p>';
    });
})();
