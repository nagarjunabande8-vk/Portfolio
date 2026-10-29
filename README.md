# Bande Nagarjuna – Portfolio

Plain HTML, CSS and JavaScript. No build step.

## Run it
Double-click `index.html`. (Fonts load from Google Fonts, so you need internet for the fonts to appear.)

## Files
- `index.html` – all text content and section structure
- `style.css` – colours (top of file, `:root`), fonts, layout, animations
- `script.js` – nav, ID card swing, skills table, projects, timeline
- `logos.js` – brand logo shapes for the skills table
- `images/hero.jpg` – photo in the hero
- `images/id-photo.jpg` – photo on the ID card

## Common edits
- **Replace photos:** overwrite the two files in `images/` (keep the same names).
- **Change text:** edit `index.html` (About, certificates, timeline, contact).
- **Skills:** edit the `SK` list in `script.js`. Each row is `[logo key, 2-letter symbol, name, family, where used]`.
- **Add a project:** add an object to `PROJECTS` in `script.js`. More than one project turns on the folding gallery. Add a `demo:'https://...'` field to show a "Live demo" button next to the GitHub button.
- **Colours:** change the variables in `:root` at the top of `style.css`. `--accent` and `--accent-2` control the subtle highlight colour.
- **Social preview image:** add `<meta property="og:image" content="https://YOUR-DOMAIN/images/hero.jpg">` to `index.html` once the site has a URL.
- **Links:** search `index.html` for `github.com`, `linkedin.com`, `leetcode.com`, `hackerrank.com`.

## Put it online
Upload the whole folder to Netlify Drop, GitHub Pages or Vercel.
