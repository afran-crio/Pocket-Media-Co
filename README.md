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

## Pricing

No prices appear on the public page. Packages, onboarding fees and add-on rates live in Pocket's internal quotation system; the site sells one offer (Social Media Management), with content creation mentioned in a single line, and one action ("Let's Talk Socials").

## Before going live

1. **Add the portfolio (Made by Pocket).** Until real work is ready, the section shows a "Fresh work dropping soon" panel. To launch it, add 3 real projects: put each reel or image in `assets/work/`, then follow the comment above the panel (delete the panel, uncomment the project grid, fill in the brand name and one honest line on Pocket's role).
2. **Connect the enquiry form.** Set `data-endpoint` (a form service URL such as Formspree) or `data-email` (opens the visitor's email app) on the `<form>`. Until then, a submitted form shows a "not connected yet" message; the "And it's in!" confirmation only appears when the endpoint answers OK. Fields sent: `name`, `brand`, `contact` (WhatsApp or email), `instagram`, `about` (optional). Budget and timing are qualified on the first call.
3. **Ecosystem logos.** Crio Connect and the 23 client logos are in. Kaun Creative, Off The Menu, Scene Here and Node Experiences currently show their names in type. Put the real files in `assets/logos/` (SVG, or WebP around 600px wide) and swap each name for the `<img>` shown in the comment next to it. Only add verified clients to `assets/logos/clients/`.
4. **Social preview image.** `assets/img/og-image.jpg` is what WhatsApp, Instagram and LinkedIn show when the link is shared. Once the domain is live, make the `og:image` URL in `index.html` absolute (for example `https://yourdomain/assets/img/og-image.jpg`), as some apps ignore relative ones.
5. **Analytics.** Paste in the Google Analytics, Plausible or Meta Pixel snippet. Button clicks (`data-track` names) and form sends (`generate_lead`) are reported to whichever one is installed. Until then nothing is tracked.
6. **Hosting.** Upload the folder to any static host, such as Netlify, Vercel, Cloudflare Pages or GitHub Pages. The original brand files in the repo root aren't used by the page.
