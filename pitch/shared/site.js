'use strict';
(() => {
  const BASE = window.REZ_DATA || '';
  const toggle = document.querySelector('.nav-toggle'), nav = document.querySelector('#primary-nav');
  if (toggle && nav) {
    const close = () => { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open menu'); nav.classList.remove('open'); document.body.classList.remove('menu-open'); };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('open', open); document.body.classList.toggle('menu-open', open);
    });
    nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }
  if (document.querySelector('[data-record-total]')) {
    fetch(BASE + 'data/source-manifest.json', { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).then(d => {
      if (!d || !d.counts) return;
      for (const k of ['businesses', 'churches', 'events']) if (Number.isInteger(d.counts[k])) document.querySelectorAll('[data-record-total="' + k + '"]').forEach(el => { el.textContent = d.counts[k].toLocaleString('en-CA'); });
    }).catch(() => {});
  }
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
  // Request form: builds an email to RezSite (no data is stored on this site)
  document.querySelectorAll('form[data-request]').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form), name = String(f.get('business') || '').trim(), err = form.querySelector('[data-error]');
    if (!name) { if (err) { err.hidden = false; err.textContent = 'Enter your business name first.'; } form.querySelector('[name=business]').focus(); return; }
    if (err) err.hidden = true;
    const lines = ['Business: ' + name, 'Website: ' + (f.get('website') || 'none yet'), 'Phone: ' + (f.get('phone') || ''), '', 'Please make our 3 free designs.'];
    location.href = 'mailto:' + form.dataset.request + '?subject=' + encodeURIComponent('3 free designs for ' + name) + '&body=' + encodeURIComponent(lines.join('\n'));
  }));
  document.querySelectorAll('[data-dir-search]').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault(); const q = String(new FormData(form).get('q') || '').trim();
    location.href = 'directory.html?type=businesses' + (q ? '&q=' + encodeURIComponent(q) : '');
  }));
  // Gentle reveal on scroll (off for people who ask for less motion)
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('[data-reveal]').forEach(el => { el.classList.add('will-reveal'); io.observe(el); });
  }
})();
