# RezSite — Rugged Arrowhead Cursor v1.3, APPROVED HANDOFF

**Approved on November 21, 2026. Do not redesign.**

## Intent
Desktop: retain the previously approved rugged-stone arrowhead pointer and its 285ms shooting-on-click effect **unchanged**.

Mobile/tablet: **Spirit Trail v1.3 — LANDING EFFECT**, superseding the old v1.2 mobile movement direction. When a user taps a button/link:
1. The rugged arrowhead appears **105px BELOW the exact tap** (measured from its tip/hotspot).
2. Over **440ms**, the arrowhead travels **UP to the precise original tap coordinate**, with visible turquoise trailing particles behind it.
3. At landing, the arrowhead disappears and a small **copper ripple** plus turquoise/copper particles flashes **at the tap spot**, not above it.
4. Interaction remains native: do not delay, cancel or intercept the tapped button/link, and never block scrolling. This animation is decorative only.

**Do not use the older v1.2 mobile animation that started at the tap and ended 112px ABOVE it.**

## Files
- `arrowhead.svg` — immutable approved stone, faceting, chips and copper wraps
- `rezsite-cursor.js`, `rezsite-cursor.css` — original desktop implementation unchanged
- `demo.html` — original desktop live tester
- `rezsite-touch.js`, `rezsite-touch.css` — production-ready touch landing implementation
- `touch-demo.html` — actual runnable mobile + mouse-preview landing test

## Integration (plain JS)
Place the package files together under `/assets/rezsite/` and include:
```html
<link rel="stylesheet" href="/assets/rezsite/rezsite-cursor.css">
<link rel="stylesheet" href="/assets/rezsite/rezsite-touch.css">
<script type="module">
  import { installRezSiteCursor } from '/assets/rezsite/rezsite-cursor.js';
  import { installRezSiteTouchEffect } from '/assets/rezsite/rezsite-touch.js';
  const removeDesktop = installRezSiteCursor();
  const removeTouch = installRezSiteTouchEffect(); // v1.3 landing is the default
  // On SPA component/app unmount, call both teardown functions.
</script>
```
Frameworks: mount both once in a **client-side persistent app shell**; import CSS globally and tear down at app teardown. This is especially important when a tap triggers route navigation.

## Real-world requirements
- Only apply touch landing animation to `a`, `button`, `[role="button"]`, `[data-rez-touch]`. The demo explicitly uses `allowAnywhere:true` to test an empty surface; NEVER use that production default.
- Do not apply to form fields, text selection, normal scrolling or swipes. Animation starts after a confirmed tap: `pointerup` within **12px** and under **650ms**. `pointercancel` aborts it. No `preventDefault` and no forced waiting before navigation.
- Touch input is selected from **actual pointerType='touch'**, not just screen width; hybrid touchscreen laptops work. Stylus has no effect. Demo can opt into mouse testing with `testWithMouse:true`, production must leave false.
- Preserve native keyboard focus and standard actions. Every overlay uses `pointer-events:none` and fixed coordinates (`clientX/clientY`), and needs a high z-index.
- `prefers-reduced-motion` removes arrowhead travel/particles and uses a brief ripple.
- The arrowhead is 42px wide with its SVG tip aligned to `(clientX, clientY)` at arrival. Exact tip alignment matters; do not center the body over the tap.
- Avoid visual noise; one animation per confirmed tap. Limit active elements and clean up animations on unmount.
- Source SVG is trusted bundled app artwork; do not use unsanitized user-generated SVG. Keep a CSP-compatible delivery strategy (e.g. static trusted asset). No third-party dependencies.
- Actual navigation might unmount an overlay before its flight completes: mount the effect at the **persistent top-level app shell**, not inside a route component. Do not defer navigation to preserve decoration.
- Test on iOS Safari, Chrome Android, tablets, touchscreen laptops, desktop with mouse/trackpad, keyboard accessibility and reduced-motion settings.

## Running the test
From the directory containing these files:
```bash
python -m http.server 8000
```
Open `http://localhost:8000/touch-demo.html`; on another phone/tablet, use your computer's LAN address and allow the server through firewall. (ES-module imports and local SVG fetch require HTTP.)

## Acceptance criteria
- Touch tap coordinates: arrowhead visibly starts below tap, flies *toward* it, finishes with its tip exactly at tap, and copper ripple appears at that position.
- Particles follow behind rising arrowhead. Total flight ~440ms; no screen-jump, no incorrect offsets on scrolled pages.
- Tapping a link/button works normally; touch scroll and input fields remain unaffected.
- Desktop approved cursor artwork and shooting effect remain unchanged.
- Supply a working device preview and screenshots/video before deployment.
