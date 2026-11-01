/* LĐLSRVN v0.2 — header, menu, reveal, event tabs, spotlight, news rail, lightbox */
(function () {
  var d = document; d.documentElement.classList.add('js');
  var $ = function (s, c) { return (c || d).querySelector(s); }, $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  var header = $('.site-header');
  function onScroll() { header.classList.toggle('is-solid', window.scrollY > 8); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  var btn = $('#menuBtn');
  function setMenu(open) { d.body.classList.toggle('menu-open', open); btn.setAttribute('aria-expanded', open); btn.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu'); }
  if (btn) { btn.addEventListener('click', function () { setMenu(!d.body.classList.contains('menu-open')); }); $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); }); }

  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -6% 0px' });
    $$('.stack > section, .site-footer').forEach(function (el) { el.classList.add('rv'); if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('pre'); io.observe(el); } });
  }

  // event tabs
  $$('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      $$('.tab').forEach(function (x) { x.setAttribute('aria-selected', x === t); });
      var f = t.dataset.f;
      $$('#evList .ev').forEach(function (ev) { ev.hidden = !(f === 'all' || ev.dataset.s === f); });
    });
  });

  // spotlight (titles from the federation's "Nhân vật" column)
  var spots = [
    { tag: 'Chân dung', date: 'Chuyên mục Nhân vật', t: 'Người thắp lửa đam mê Lân – Sư – Rồng xứ Cao Nguyên', p: 'Những người âm thầm giữ nhịp trống, truyền nghề cho lớp trẻ và đưa phong trào Lân Sư Rồng đến với vùng cao nguyên.' },
    { tag: 'Chân dung', date: 'Chuyên mục Nhân vật', t: '“Bộ đôi” doanh nhân Ninh Bình lưu truyền tinh thần thượng võ', p: 'Câu chuyện về những người làm kinh tế vẫn dành tâm huyết cho võ thuật và nghệ thuật Lân Sư Rồng ở quê nhà.' },
    { tag: 'Lãnh đạo Liên đoàn', date: 'Nhiệm kỳ 2023 – 2028', t: 'Ông Phạm Quang Long, Chủ tịch Liên đoàn Lân Sư Rồng Việt Nam', p: 'Định hướng phát triển phong trào Lân Sư Rồng trong nhiệm kỳ đầu tiên của Liên đoàn.' }
  ];
  $$('.dots button').forEach(function (b) {
    b.addEventListener('click', function () {
      var s = spots[+b.dataset.i];
      $$('.dots button').forEach(function (x) { x.setAttribute('aria-current', x === b); });
      $('#spotTag').textContent = s.tag; $('#spotDate').textContent = s.date; $('#spotTitle').textContent = s.t; $('#spotText').textContent = s.p;
    });
  });

  // news rail
  var rail = $('#rail');
  function step(dir) { var card = $('.post', rail); rail.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: 'smooth' }); }
  if (rail) { $('#railPrev').addEventListener('click', function () { step(-1); }); $('#railNext').addEventListener('click', function () { step(1); }); }

  // lightbox
  var lb;
  function close() { if (lb) { lb.remove(); lb = null; } }
  $$('.gal .ph[tabindex]').forEach(function (f) {
    function open() {
      var img = $('img', f), cap = $('figcaption', f);
      lb = d.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
      lb.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure><button aria-label="Đóng">✕</button>';
      $('img', lb).src = img.src; $('img', lb).alt = img.alt; $('figcaption', lb).textContent = cap ? cap.textContent : '';
      lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'BUTTON') close(); });
      d.body.appendChild(lb); $('button', lb).focus();
    }
    f.addEventListener('click', open); f.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
  });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); if (btn) setMenu(false); } });
})();
