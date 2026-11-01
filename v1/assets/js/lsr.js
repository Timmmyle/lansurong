/* LĐLSRVN — interactions (header, menu, reveal, gallery filter, lightbox) */
(function () {
  var d = document, root = d.documentElement;
  root.classList.add('js');
  // fallback to local images if a remote photo fails
  function fb(img) { var f = img.getAttribute('data-fallback'); if (f && img.src.indexOf(f) < 0) { img.src = f; } }
  d.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () { fb(img); });
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) fb(img);
  });

  // header: transparent over hero, solid after scroll
  var header = d.querySelector('.site-header');
  var hero = d.querySelector('.hero');
  function onScroll() {
    var limit = hero ? hero.offsetHeight - 120 : 10;
    header.classList.toggle('is-solid', window.scrollY > Math.min(limit, 80) );
  }
  if (!hero) header.classList.add('is-solid');
  else { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); }

  // mobile menu
  var btn = d.getElementById('menuBtn');
  if (btn) {
    btn.addEventListener('click', function () {
      var open = d.body.classList.toggle('menu-open');
      btn.setAttribute('aria-expanded', open);
      btn.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    });
    d.querySelectorAll('#nav a').forEach(function (a) {
      a.addEventListener('click', function () { d.body.classList.remove('menu-open'); btn.setAttribute('aria-expanded', false); });
    });
  }

  // reveal: only elements below the first screen start hidden
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    d.querySelectorAll('.rv').forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('pre'); io.observe(el); }
    });
  }

  // gallery filter
  d.querySelectorAll('.gal-tab').forEach(function (t) {
    t.addEventListener('click', function () {
      d.querySelectorAll('.gal-tab').forEach(function (x) { x.setAttribute('aria-pressed', x === t); });
      var f = t.dataset.f;
      d.querySelectorAll('#masonry > [data-k]').forEach(function (el) { el.hidden = !(f === 'all' || el.dataset.k === f); });
    });
  });

  // lightbox
  var lb;
  d.querySelectorAll('.tile').forEach(function (t) {
    t.tabIndex = 0;
    function open() {
      var img = t.querySelector('img'), cap = t.querySelector('figcaption b');
      lb = d.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
      lb.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure><button aria-label="Đóng">✕</button>';
      lb.querySelector('img').src = img.src; lb.querySelector('img').alt = img.alt;
      lb.querySelector('figcaption').textContent = cap ? cap.textContent : '';
      lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'BUTTON') close(); });
      d.body.appendChild(lb); lb.querySelector('button').focus();
    }
    t.addEventListener('click', open);
    t.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
  });
  function close() { if (lb) { lb.remove(); lb = null; } }
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
