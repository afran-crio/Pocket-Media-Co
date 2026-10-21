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

## Locked structure (work-first)

1. Hero: "Your socials? Sorted." (See Our Work first, Let's Talk Socials second)
2. Selected work (Made by Pocket): "Okay, enough talking." Large editorial project rows; hidden until real projects are added (see the comment in index.html)
3. What we do: "Social media is our thing." (one offer; standalone content is a one-line mention)
4. Philosophy: "The internet has enough content."
5. About: "A little about us." with "Got a business? Got socials? We should talk." folded in, and the expandable Crio / Kaun Creative story
6. Good to know (FAQs) + Contact: "Let's get your socials together."

One button label everywhere: "Let's Talk Socials". Work and "Beyond the Feed" pages wait until there are 3+ projects and the specialist-network content is defined.

## Pricing

No prices appear on the public page. Packages, onboarding fees and add-on rates live in Pocket's internal quotation system; the site sells one offer (done-for-you social media management), with standalone content mentioned in a single line, and one action ("Let's Talk Socials").

## Before going live

1. **Add the selected work.** Until real work is ready, the section shows a "Fresh work dropping soon" panel. To launch it, put each reel or image in `assets/work/`, fill in the three project rows in `.showcase` (media, client, headline, one line on what Pocket delivered), remove its `hidden` attribute and delete the panel.
2. **Connect the enquiry form.** Set `data-endpoint` (a form service URL such as Formspree) or `data-email` (opens the visitor's email app) on the `<form>`. Until then, a submitted form shows a "not connected yet" message; the "And it's in!" confirmation only appears when the endpoint answers OK. Fields sent: `name`, `business` (business / Instagram), `contact` (email or WhatsApp), `looking_for` ("Someone to handle our socials" or "Just some really good content"), `about` (optional). Budget, scope and timing are qualified on the first call.
3. **Ecosystem logos.** Crio Connect and the 23 client logos are in. Kaun Creative, Off The Menu, Scene Here and Node Experiences currently show their names in type. Put the real files in `assets/logos/` (SVG, or WebP around 600px wide) and swap each name for the `<img>` shown in the comment next to it. Only add verified clients to `assets/logos/clients/`.
4. **Social preview image.** `assets/img/og-image.jpg` is what WhatsApp, Instagram and LinkedIn show when the link is shared. Once the domain is live, make the `og:image` URL in `index.html` absolute (for example `https://yourdomain/assets/img/og-image.jpg`), as some apps ignore relative ones.
5. **Analytics.** Paste in the Google Analytics, Plausible or Meta Pixel snippet. Button clicks (`data-track` names) and form sends (`generate_lead`) are reported to whichever one is installed. Until then nothing is tracked.
6. **Hosting.** Upload the folder to any static host, such as Netlify, Vercel, Cloudflare Pages or GitHub Pages. The original brand files in the repo root aren't used by the page.
