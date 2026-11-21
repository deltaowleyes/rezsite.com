/* RezSite arrowhead v1.3: desktop rugged cursor + touch landing effect. Loaded once per page.
   Import ?v= stamps are kept current by scripts/stamp-assets.py. */
import { installRezSiteCursor } from './rezsite-cursor.js?v=2499916a0d';
import { installRezSiteTouchEffect } from './rezsite-touch.js?v=82a47b4765';
const svgUrl = new URL('./arrowhead.svg?v=c58355ba75', import.meta.url).href;
installRezSiteCursor({ svgUrl });
installRezSiteTouchEffect({ svgUrl }); // production defaults: touch only, links/buttons only
