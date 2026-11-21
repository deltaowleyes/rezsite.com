/* RezSite shared header: phone menu toggle. */
(function () {
  function init() {
    var b = document.querySelector('.rz-menu-btn'), nv = document.getElementById('rz-nav');
    if (!b || !nv) return;
    function set(o) { nv.classList.toggle('open', o); b.setAttribute('aria-expanded', String(o)); b.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); }
    b.addEventListener('click', function () { set(!nv.classList.contains('open')); });
    nv.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nv.classList.contains('open')) { set(false); b.focus(); } });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
