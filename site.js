(function () {
  'use strict';
  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* prints settle onto the page as they scroll in */
  var prints = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    prints.forEach(function (p) { io.observe(p); });
  } else {
    prints.forEach(function (p) { p.classList.add('in'); });
  }

  /* arabic switch shows a short note */
  var dlg = $('#ar');
  var lastBtn = null;
  $$('[data-ar]').forEach(function (b) {
    b.addEventListener('click', function () {
      lastBtn = b;
      if (dlg && dlg.showModal) { dlg.showModal(); } else if (dlg) { dlg.setAttribute('open', ''); }
      var ok = $('#ar-close'); if (ok) ok.focus();
    });
  });
  function closeAr() {
    if (!dlg) return;
    if (dlg.close) dlg.close(); else dlg.removeAttribute('open');
    if (lastBtn) lastBtn.focus();
  }
  var closeBtn = $('#ar-close');
  if (closeBtn) closeBtn.addEventListener('click', closeAr);
  if (dlg) dlg.addEventListener('click', function (e) { if (e.target === dlg) closeAr(); });

  /* the opening-day email list: stored on this device, then the thanks */
  var form = $('#notify-form'), input = $('#email'), msg = $('#email-msg'), thanks = $('#thanks'), again = $('#again');
  var okEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };
  function problem(v) {
    if (!v) return 'please add your email so we can write to you.';
    if (!okEmail(v)) return "that doesn't look like an email yet, check it once more.";
    return '';
  }
  function show(text) {
    if (!msg) return;
    msg.textContent = text;
    if (text) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }
  if (form && input) {
    input.addEventListener('blur', function () { if (input.value.trim()) show(problem(input.value.trim())); });
    input.addEventListener('input', function () { if (input.getAttribute('aria-invalid') === 'true') show(problem(input.value.trim())); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value.trim(), p = problem(v);
      show(p);
      if (p) { input.focus(); return; }
      try {
        var list = JSON.parse(localStorage.getItem('stay-notify') || '[]');
        if (list.indexOf(v) === -1) list.push(v);
        localStorage.setItem('stay-notify', JSON.stringify(list));
      } catch (err) { /* storage can be blocked, the thanks still shows */ }
      form.hidden = true; thanks.hidden = false;
      var h = $('.thanks__h'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    });
  }
  if (again) again.addEventListener('click', function () {
    thanks.hidden = true; form.hidden = false; form.reset(); show(''); input.focus();
  });

  /* small notify pill on phones once the hero is behind us, hidden over the form and the footer */
  var pill = $('#pill'), hero = $('#top'), notify = $('#notify'), foot = $('.foot');
  if (pill && 'IntersectionObserver' in window) {
    var state = { hero: true, notify: false, foot: false };
    var paint = function () {
      var on = !state.hero && !state.notify && !state.foot;
      pill.classList.toggle('on', on);
      pill.setAttribute('aria-hidden', on ? 'false' : 'true');
      pill.tabIndex = on ? 0 : -1;
    };
    var watch = function (el, key) {
      if (!el) return;
      new IntersectionObserver(function (en) { state[key] = en[0].isIntersecting; paint(); }, { threshold: 0.05 }).observe(el);
    };
    watch(hero, 'hero'); watch(notify, 'notify'); watch(foot, 'foot');
  }
})();
