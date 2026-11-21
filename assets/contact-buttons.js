/* Floating contact buttons (Email + FAQ), shared by bakeaweb.com, rezsite.com and tasteaweb.com.
   Use: <script defer src="contact-buttons.js" data-email="leah@rezsite.com" data-subject="Question"
          data-faq="/faq.html" data-bg="#004F45" data-fg="#FFFFFF" data-ring="#B87333"></script>
   The buttons stay fixed at the bottom right while the page scrolls. */
(function () {
  if (window.__contactButtons) return; window.__contactButtons = 1;
  var me = document.currentScript || document.querySelector('script[src*="contact-buttons.js"]');
  var d = (me && me.dataset) || {};
  var email = d.email || 'leah@rezsite.com';
  var subject = d.subject || 'Question';
  var faq = d.faq || '/faq.html';
  var bg = d.bg || '#1F2A27', fg = d.fg || '#FFFFFF', ring = d.ring || '#FFFFFF';

  var css = '.cbx{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));z-index:9990;display:flex;flex-direction:column;gap:10px;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}' +
    '.cbx a{position:relative;display:grid;place-items:center;width:52px;height:52px;border-radius:50%;background:' + bg + ';color:' + fg + ';border:2px solid ' + ring + ';box-shadow:0 6px 18px rgba(0,0,0,.25);text-decoration:none;transition:transform .15s,box-shadow .15s}' +
    '.cbx a:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 10px 24px rgba(0,0,0,.3)}' +
    '.cbx a:focus-visible{outline:3px solid ' + ring + ';outline-offset:3px}' +
    '.cbx svg{width:24px;height:24px;display:block}' +
    '.cbx span{position:absolute;right:62px;top:50%;transform:translateY(-50%);background:#1F2A27;color:#fff;font-size:13px;font-weight:600;line-height:1;padding:8px 10px;border-radius:8px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .15s}' +
    '.cbx a:hover span,.cbx a:focus-visible span{opacity:1}' +
    '@media (max-width:600px){.cbx a{width:48px;height:48px}.cbx svg{width:22px;height:22px}}' +
    '@media print{.cbx{display:none}}';

  var mailIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>';
  var faqIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M9.3 9.2a2.8 2.8 0 0 1 5.4 1c0 1.9-2.7 2.5-2.7 4.1"/><circle cx="12" cy="17.4" r=".6" fill="currentColor"/></svg>';

  function mount() {
    if (document.querySelector('.cbx')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var box = document.createElement('nav');
    box.className = 'cbx'; box.setAttribute('aria-label', 'Contact us');
    box.innerHTML =
      '<a href="mailto:' + email + '?subject=' + encodeURIComponent(subject) + '" aria-label="Email us at ' + email + '">' + mailIcon + '<span>Email us</span></a>' +
      '<a href="' + faq + '" aria-label="Frequently asked questions">' + faqIcon + '<span>FAQ</span></a>';
    document.body.appendChild(box);
  }

  // FAQ sections drawn by JavaScript appear after the page loads: scroll to them once they exist.
  function scrollToHash() {
    var h = location.hash; if (!h || h.length < 2) return;
    var n = 0, t = setInterval(function () {
      var el = document.getElementById(h.slice(1));
      if (el) { clearInterval(t); el.scrollIntoView({ block: 'start' }); }
      else if (++n > 30) clearInterval(t);
    }, 150);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
  addEventListener('load', scrollToHash);
  addEventListener('hashchange', scrollToHash);
})();
