# RezSite — Shore to Shore | Claude production handoff

**Selected design:** RezSite Shore to Shore, logo Variation #2, final compact header.
**Review/development environment:** `https://deltaowleyes.ca/rezsite/`
**Future intended production domain:** `https://rezsite.com/` — do NOT deploy or alter DNS until the owner authorizes it.
**Current business model:** Web design for Indigenous businesses, with an affiliation to BAKEaWeb. The self-service Web Design Studio is in development. The social-network proposal is **on hold**.

## Current approved header wording

- Desktop (above 700 px): `WEB DESIGN • BUSINESS DIRECTORIES • COMMUNITY`
- Mobile (700 px and below): `WEB DESIGN • BUSINESS DIRECTORIES`
- Selected Variation #2 bridge, sunrise, river and RezSite wordmark preserved. The bridge illustration is optically matched in height to the wordmark, with most original vertical whitespace removed.
- Sticky compact header: about 82 px on desktop; 66–74 px on phones.

The header and footer use `assets/brand/rezsite-approved-bridge-equal-wordmark.svg` (a **self-contained SVG containing the approved WebP image**). This avoids any external logo request. `design-reference/` has the original selected raster artwork and trimmed high-resolution reconstruction. Text beneath the logo is real HTML/CSS, not tiny type embedded in a raster; use that method when modifying it.

## What is inside

- `index.html`: homepage, web design services, consultation CTA, BAKEaWeb affiliation, hosting-positioning and three directory entry points.
- `directory.html`: same branding; three accessible tabbed directories with search, geographic/category filters, provenance and verification status.
- `assets/site.css`, `assets/site.js`, `assets/directory.js`: source styling/navigation/directory implementation.
- `assets/brand/`: every brand SVG actually used by the live page layouts.
- `data/businesses-index.json`: **4,996** business records, complete source-index snapshot, excluding street-address field.
- `data/businesses-featured.json`: **48** priority featured records (a subset, *not* the complete directory).
- `data/churches.json`: **200** church records.
- `data/events.json`: **216** event records, including historical entries; browser defaults to upcoming entries.
- `data/source-manifest.json`: provenance, counts and source-data checksums.
- `qa/`: actual Chromium desktop/mobile screenshots and test metrics for final compact header.
- `scripts/`: source audit/reproducible browser QA and optional future upstream data refresh script.

## How to preview locally

From inside this directory run `python -m http.server 8000`, then browse to `http://localhost:8000/` and `http://localhost:8000/directory.html?type=businesses`. Don't rely on `file://` opening; browser security may block JSON fetches. JavaScript and page links are relative to the current site root and can be hosted at a subdirectory or at rezsite.com root.

## Production checklist for Claude — do not assume approvals

1. Use these files as the **source of truth**; do not substitute the old RezSite social-feed demo or rebrand BAKEaWeb as RezSite.
2. Preserve the logo, responsive descriptor wording, pine green / gold / blue palette, and BAKEaWeb affiliation.
3. Preserve **all 4,996 + 200 + 216 records**, the unverified labels and source links. Do not expose potentially residential street addresses; this snapshot intentionally strips dedicated address fields.
4. Site design consultations are currently routed to the provisional `deltaowleyes@gmail.com` inbox. Ask the owner for the production RezSite contact address before switching to rezsite.com.
5. The marketing copy mentions a proposed free lifetime hosting offer for BAKEaWeb-made sites. Confirm final terms, eligibility, support limits and legal language before advertising it as an unconditional binding offer.
6. Update production domain references, canonical/OG settings, DNS and hosting only when expressly authorized by the owner. This package does **not** contain credentials, paid APIs or payment functionality.
7. Verify GitHub Pages release on the test URL separately from GitHub source status. A merged PR is not evidence the custom-domain page is serving the current revision.
8. Re-run accessible mobile navigation, full business index loading, church/event filters, archive and listing provenance checks on the actual production host.
9. Respect the on-hold social network; do not add feed, authentication, messaging, groups or social marketplace without fresh approval.

## Final local browser acceptance

Actual Chromium passes at 320, 390, 500, 700, 768, 900, 1024, 1100, 1240 and 1440 px for homepage and directory (20 layout checks). No horizontal overflow, unreadable/wrapping header descriptor, broken selected logo, JS errors or excessive header heights in these tests. Full-data search, filtering, archive and mobile menu interactions also passed. Browser routing and cache/CDN publication must be separately verified on a normal host.

**No Claude execution or deployment to rezsite.com is included in this handoff.**
