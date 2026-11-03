# JB monogram — Julian Betancourt

Chosen mark: **3b "J inside B · dot outside"** — a heavy B with a J cut through it; the J's dot sits above the B.

## Palette (matches `src/styles/global.css`)
- Ink Black `#011627` (`--ink-black`)
- Hot Fuchsia `#FF3366` (`--hot-fuchsia`) — default dot color
- Light Sea Green `#2EC4B6` (`--sea-green`)
- Bright Snow `#F6F7F8` (`--bright-snow`)
- Blue Bell `#20A4F3` (`--blue-bell`)

## Folders
- `svg/jb-mark-*.svg` — transparent mark, vector. Name = `{B color}-{dot color}`.
  - `snow-fuchsia` → **primary on the site** (dark background)
  - `ink-fuchsia` → primary on light backgrounds (CV, print)
  - `snow-teal`, `ink-teal`, `blue-ink` → alternates; `black`, `white` → single-color
- `svg/jb-icon-*.svg` — mark on a rounded-square tile (ink, fuchsia, teal, blue, snow).
- `png/` — every transparent mark at 64, 128, 256, 512, 1024 px.
- `favicon/` — `favicon.svg`, `favicon-16/32/48.png`, `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `site.webmanifest`.
- `avatar/` — square 400/800 px, safe for circular crops (GitHub, LinkedIn, etc.).
- `cv/` — `jb-mark-cv.svg` (ink + fuchsia), `jb-mark-cv-600.png`, mono black PNG.
- `social/` — `og-image-1200x630.png`, `linkedin-banner-1584x396.png`.

## Integration notes for Claude Code (Astro site)
1. Copy `favicon/*` into `public/` (replaces the current checkmark `public/favicon.svg`).
2. In `src/layouts/Base.astro` `<head>`:
   ```html
   <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
   <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
   <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
   <link rel="manifest" href="/site.webmanifest" />
   <meta name="theme-color" content="#011627" />
   <meta property="og:image" content="/og-image-1200x630.png" />
   ```
3. Header `.brand`: inline `svg/jb-mark-snow-fuchsia.svg` (~28–32 px tall) before the name. Optionally swap `fill` values for `var(--bright-snow)` / `var(--hot-fuchsia)` so it follows the theme.
4. CV (`scripts/build-cv.mjs` / `public/cv`): use `cv/jb-mark-cv.svg` in the header, ~14–18 mm.

## Usage rules
- Clear space: at least the dot's diameter on every side.
- Minimum size: 16 px (favicon) / 8 mm in print.
- Don't stretch, outline, rotate, or recolor the B and dot to the same accent on a matching background.
