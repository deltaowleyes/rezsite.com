# RezSite

Free websites for First Nations, Métis and Inuit people, businesses and communities, at rezsite.com/pagename. Built with BAKE (https://bakeaweb.com).

This repository is served by GitHub Pages at https://rezsite.com (set by the CNAME file).

## Brand (Nov 2026 canoe / Woodland floral identity)

- Colours, type and shared components: `assets/brand/v2/rezsite-brand.css` (tokens at the top).
- Directory-page overrides: `assets/brand/v2/directory-brand.css`.
- Artwork (flat SVG redraws for web use): emblem, app icon/favicon, floral divider, beadwork strip, directory banners in `assets/brand/v2/`.
- Font: Montserrat (SIL Open Font License), self-hosted in `assets/home/fonts/`.

## Before every commit

Run `python3 scripts/stamp-assets.py`. It stamps every CSS/JS link with a fingerprint of the file, so visitors' browsers always load the newest version instead of an old saved copy (an old saved stylesheet once broke the live header).
