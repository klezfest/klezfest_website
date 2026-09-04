# Klez Fest Midwest

Source for the [Klez Fest Midwest](https://klezfestmidwest.org) website — a static HTML/CSS/JS site with no build step or framework. Open any `.html` file directly in a browser, or serve the folder with any static file server, to preview it.

## Pages

| File | Page |
|---|---|
| `index.html` | Home / At-a-Glance |
| `program.html` | Full program, day by day |
| `lineup.html` | Lineup, grouped by performance |
| `artists.html` | Artist bios |
| `co-directors.html` | Co-Directors bios and Thank You / You Can Help |

Every page shares one header/nav and footer, and one stylesheet (`styles.css`).

## Structure

- `styles.css` — all site styling, including `@font-face` declarations and CSS custom properties (`--maroon`, `--gold`, `--red`, `--ink`, `--paper`) for the site's color palette.
- `header-scroll.js` — hides the header on scroll-down and reveals it on scroll-up; loaded with `defer` on every page.
- `images/` — photos, band/artist images, and site logos.
- `fonts/cooper-hewitt/` — the Cooper Hewitt webfont files (`.woff`) used site-wide, referenced by `styles.css`.
- `fonts/desertfolk-font/` — the Desert Folk webfont (`.ttf`) used for page headings (e.g. "Klez Fest Midwest," "Featuring: The Klezmatics," "2026 Lineup"), referenced by `styles.css`.

## Editing

There's no templating — shared markup (header, nav, footer) is duplicated across each HTML file, so a change to one (e.g. adding a nav link) needs to be repeated in all five pages.

## License

MIT — see `LICENSE`.
