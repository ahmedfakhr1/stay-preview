// stay. preview site: mobile menu, email sign-up, menu filters, toggles.
(function () {
  var burger = document.querySelector('.burger');
  var mnav = document.getElementById('mnav');
  function setMenu(open) {
    if (!burger || !mnav) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', open);
    mnav.hidden = !open;
  }
  if (burger && mnav) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.matchMedia('(min-width: 701px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  }

  // Email sign-up (preview only: nothing is stored until a backend is connected)
  document.querySelectorAll('.js-notify').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type=email]');
      var msg = form.parentNode.querySelector('.form-msg') || document.createElement('p');
      msg.className = 'form-msg';
      msg.setAttribute('role', 'status');
      if (!input.value || !input.checkValidity()) {
        msg.textContent = 'Please enter a valid email address.';
        msg.classList.add('err');
        input.focus();
      } else {
        msg.textContent = "You're on the list. We'll email you once, on opening day.";
        msg.classList.remove('err');
        form.reset();
      }
      form.insertAdjacentElement('afterend', msg);
    });
  });

  // Homepage menu preview: filter cards by category
  document.querySelectorAll('.js-filter').forEach(function (bar) {
    var cards = document.querySelectorAll('.card[data-cat]');
    bar.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip'); if (!chip) return;
      bar.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('on', c === chip); });
      var f = chip.dataset.f;
      cards.forEach(function (card) { card.hidden = f !== 'all' && card.dataset.cat !== f; });
    });
  });

  // Menu page: highlight the chip of the section in view
  var jump = document.querySelector('.js-jump');
  if (jump && 'IntersectionObserver' in window) {
    var chips = jump.querySelectorAll('.chip');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        chips.forEach(function (c) { c.classList.toggle('on', c.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    chips.forEach(function (c) { var t = document.querySelector(c.getAttribute('href')); if (t) io.observe(t); });
  }

  // Pick up / Dine in toggle
  document.querySelectorAll('.js-tog').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      g.querySelectorAll('button').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
    });
  });
})();
