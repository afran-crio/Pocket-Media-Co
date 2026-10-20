# Pocket Media Co. Website

A single-page static site for Pocket Media Co. It has no build step and no dependencies.

```
index.html   page content and copy
styles.css   all styling (brand colours and type at the top)
script.js    mobile menu, portfolio video playback, enquiry form
assets/img/  web-ready logo, lightning bolts and favicon
assets/work/ portfolio images and videos go here
```

To preview it locally, run `python3 -m http.server` in this folder and open http://localhost:8000.

## Before going live

1. **Add the portfolio (Made by Pocket).** The six tiles in `index.html` are placeholders. Use 3–6 real projects. Each one needs a reel or image in `assets/work/`, the brand name, the type of work, and one honest line about Pocket's role. The comment above the grid has copy-paste examples. Remove any tile you don't use.
2. **Connect the enquiry form.** Set `data-endpoint` (a form service URL such as Formspree) or `data-email` (opens the visitor's email app) on the `<form>`. Until then, a submitted form shows a "not connected yet" message.
3. **Hosting.** Upload the folder to any static host, such as Netlify, Vercel, Cloudflare Pages or GitHub Pages. The original brand files in the repo root aren't used by the page.
