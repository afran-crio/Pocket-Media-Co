# Pocket Media Co. Website

A small static site for Pocket Media Co. (homepage, Foundation, Beyond the Feed). It has no build step and no dependencies.

```
index.html            homepage
foundation.html       Social Media Foundation: full journey, stages and pricing
beyond-the-feed.html  wider marketing picture and specialist support
styles.css            the single design system for all three pages
script.js             menu, reveals, story toggle, Foundation explorer, FAQ, enquiry form
assets/fonts/         Stupid Sans (TRIAL, buy the web licence before launch)
assets/img/           logo, bolts, favicon, cursor, link-preview image
assets/logos/         Crio Connect + 23 ecosystem client logos
assets/work/          Pocket project media goes here
```

To preview it locally, run `python3 -m http.server` in this folder and open http://localhost:8000.

## Structure

**Navigation:** About · What We Do · Work · Foundation (page) · Beyond the Feed (page) · Let's Talk.

**Homepage:** Hero → About (intro + "The internet has enough content" panel + expandable Crio / Kaun Creative story) → What we do → Made by Pocket → Foundation teaser → Who → Good to know → Contact.

**Foundation:** journey overview (Talk → Foundation → Monthly) → "Where are we starting from?" explorer → seven deck-style slides (review, communication foundation, pillars, mood board, content references, profile set-up, into the monthly plan) → pricing → CTA.

**Beyond the Feed:** specialist support, always separately scoped and never part of the retainer. Only describe a capability once a delivery relationship is in place.

**Design system:** sections blend with long colour gradients (set `--from` on a section to the colour above it). One heading size (`.h2`), one lead (`.lead`), one body (`.body`), one section-head pattern (`.head`).

## Pricing

Prices appear only on foundation.html: Foundation ₹25,000 one-time (waived with three months upfront), Pocket Social ₹60,000/month, Pocket Social Plus ₹80,000/month, all + GST, three-month minimum. Deliverable counts stay in the quotation.

## Before going live

1. **Add the selected work.** Until real work is ready, the section shows a "Fresh work dropping soon" panel. To launch it, put each reel or image in `assets/work/`, fill in the three project rows in `.showcase` (media, client, headline, one line on what Pocket delivered), remove its `hidden` attribute and delete the panel.
2. **Connect the enquiry form** (spam protection: hidden `_gotcha` honeypot plus a 3-second minimum before submit; also switch on the form service's own spam filter). Set `data-endpoint` (a form service URL such as Formspree) or `data-email` (opens the visitor's email app) on the `<form>`. Until then, a submitted form shows a "not connected yet" message; the "And it's in!" confirmation only appears when the endpoint answers OK. Fields sent: `name`, `business` (business / Instagram), `contact` (email or WhatsApp), `looking_for` ("Someone to handle our socials" or "Just some really good content"), `about` (optional). Budget, scope and timing are qualified on the first call.
3. **Ecosystem logos.** Crio Connect and the 23 client logos are in. Kaun Creative, Off The Menu, Scene Here and Node Experiences currently show their names in type. Put the real files in `assets/logos/` (SVG, or WebP around 600px wide) and swap each name for the `<img>` shown in the comment next to it. Only add verified clients to `assets/logos/clients/`.
4. **Social preview image.** `assets/img/og-image.jpg` is what WhatsApp, Instagram and LinkedIn show when the link is shared. Once the domain is live, make the `og:image` URL in `index.html` absolute (for example `https://yourdomain/assets/img/og-image.jpg`), as some apps ignore relative ones.
5. **Analytics.** Paste in the Google Analytics, Plausible or Meta Pixel snippet. Button clicks (`data-track` names) and form sends (`generate_lead`) are reported to whichever one is installed. Until then nothing is tracked.
6. **Hosting.** Upload the folder to any static host, such as Netlify, Vercel, Cloudflare Pages or GitHub Pages. The original brand files in the repo root aren't used by the page.
