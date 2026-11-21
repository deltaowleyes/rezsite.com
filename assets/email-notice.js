/* Email notice: a polite pop-up shown before any "email us" link opens the visitor's email app.
   Shared by rezsite.com, bakeaweb.com and tasteaweb.com (keep the copies the same).
   It explains the site is new and our reply may land in spam, then lets them continue, copy the address or cancel.
   Use: <script defer src="email-notice.js" data-accent="#004F45" data-accent-fg="#FFFFFF"></script>
   Only our own addresses trigger it (data-domains, default below); emails to businesses in a directory do not.
   Scripts that open email themselves call: window.emailNotice('mailto:…') (it opens email directly if this file is missing). */
(function () {
  if (window.emailNotice) return;
  var me = document.currentScript || document.querySelector('script[src*="email-notice.js"]');
  var d = (me && me.dataset) || {};
  var accent = d.accent || '#1F2A27', accentFg = d.accentFg || '#FFFFFF';
  var domains = (d.domains || 'rezsite.com,bakeaweb.com,tasteaweb.com').toLowerCase().split(/\s*,\s*/);

  function addressOf(href) {
    try { return decodeURIComponent(String(href).replace(/^mailto:/i, '').split('?')[0]).trim(); } catch (e) { return ''; }
  }
  function isOurs(href) {
    var a = addressOf(href).toLowerCase(), at = a.lastIndexOf('@');
    return at > 0 && domains.indexOf(a.slice(at + 1)) !== -1;
  }

  var css =
    '.enx{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(15,23,32,.55);font-family:inherit}' +
    '.enx[hidden]{display:none}' +
    '.enx-card{box-sizing:border-box;width:100%;max-width:440px;max-height:calc(100vh - 32px);overflow:auto;background:#fff;color:#1d2430;border-radius:16px;padding:24px 22px 20px;box-shadow:0 20px 60px rgba(0,0,0,.3);text-align:left;line-height:1.55}' +
    '.enx-card h2{margin:0 0 10px;font-size:20px;line-height:1.3;color:#1d2430;font-weight:700}' +
    '.enx-card p{margin:0 0 12px;font-size:15px}' +
    '.enx-addr{margin:4px 0 18px;padding:10px 12px;border-radius:10px;background:#f3f4f6;font-size:15px;word-break:break-all}' +
    '.enx-addr b{font-weight:700}' +
    '.enx-btns{display:flex;flex-wrap:wrap;gap:8px}' +
    '.enx-btns button{font:inherit;font-size:15px;font-weight:600;line-height:1.2;padding:11px 16px;border-radius:999px;cursor:pointer;border:1.5px solid #cfd4dc;background:#fff;color:#1d2430}' +
    '.enx-btns .enx-go{background:' + accent + ';border-color:' + accent + ';color:' + accentFg + '}' +
    '.enx-btns button:focus-visible{outline:3px solid ' + accent + ';outline-offset:2px}' +
    '.enx-note{display:block;min-height:1.2em;margin-top:10px;font-size:13px;color:#4b5563}' +
    '@media (max-width:420px){.enx-btns button{flex:1 1 100%}}';

  var wrap, addrEl, noteEl, goBtn, pending = '', lastFocus = null;

  function build() {
    if (wrap) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    wrap = document.createElement('div'); wrap.className = 'enx'; wrap.hidden = true;
    wrap.innerHTML =
      '<div class="enx-card" role="dialog" aria-modal="true" aria-labelledby="enxTitle" aria-describedby="enxBody">' +
        '<h2 id="enxTitle">Before you email us</h2>' +
        '<div id="enxBody">' +
          '<p>Thank you for getting in touch. Our website is new, and email providers are still verifying our address.</p>' +
          '<p>Because of this, our reply may arrive in your spam or junk folder. If you don’t see it in your inbox, please check there and mark it as “Not spam” so our future emails reach you.</p>' +
        '</div>' +
        '<div class="enx-addr">Our email: <b class="enx-a"></b></div>' +
        '<div class="enx-btns">' +
          '<button type="button" class="enx-go">Continue to email</button>' +
          '<button type="button" class="enx-copy">Copy address</button>' +
          '<button type="button" class="enx-cancel">Cancel</button>' +
        '</div>' +
        '<span class="enx-note" aria-live="polite"></span>' +
      '</div>';
    document.body.appendChild(wrap);
    addrEl = wrap.querySelector('.enx-a'); noteEl = wrap.querySelector('.enx-note'); goBtn = wrap.querySelector('.enx-go');
    goBtn.addEventListener('click', function () { var h = pending; close(); if (h) location.href = h; });
    wrap.querySelector('.enx-cancel').addEventListener('click', close);
    wrap.querySelector('.enx-copy').addEventListener('click', copy);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      var f = wrap.querySelectorAll('button'), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  function copy() {
    var a = addrEl.textContent;
    var done = function () { noteEl.textContent = 'Copied ' + a; };
    var fallback = function () {
      var t = document.createElement('textarea'); t.value = a; t.setAttribute('readonly', '');
      t.style.cssText = 'position:fixed;top:-1000px'; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done(); } catch (e) { noteEl.textContent = 'Please copy: ' + a; }
      document.body.removeChild(t);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(a).then(done, fallback); else fallback();
  }

  function open(href) {
    build();
    pending = href; addrEl.textContent = addressOf(href); noteEl.textContent = '';
    lastFocus = document.activeElement;
    wrap.hidden = false; document.documentElement.style.overflow = 'hidden';
    goBtn.focus();
  }
  function close() {
    if (!wrap || wrap.hidden) return;
    wrap.hidden = true; pending = ''; document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) {}
  }

  /* For scripts that open email themselves (e.g. a "claim your address" form). */
  window.emailNotice = function (href) {
    if (!isOurs(href) || !document.body) { location.href = href; return; }
    open(href);
  };

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    var a = e.target && e.target.closest ? e.target.closest('a[href^="mailto:" i]') : null;
    if (!a || !isOurs(a.getAttribute('href'))) return;
    e.preventDefault();
    open(a.getAttribute('href'));
  }, true);
})();
