# Seeds for Country

A single-page marketing website for **Seeds for Country**, a not-for-profit social enterprise concept. It sells curated packs of Australian native seeds supplied by Aboriginal-owned nurseries, where about half of every pack flows back to Aboriginal people and Country, as a fair payment to the nursery and a donation to Aboriginal-led, on-Country restoration.

This is a university showcase demonstration. Partnerships, prices, images and the species list are not confirmed, and the site says so honestly throughout.

---

## What it is

- A polished, responsive, single-page site with seven sections: Home, About, Why buy from us, The packs and finder, Our give-back, Who we work with, and Get involved.
- An interactive, location-based native species finder, seeded with a draft Sydney dataset, with filtering, an honest draft banner and curated pack suggestions.
- A separate primary-research interview guide for talking to real potential customers.

No backend, no build step, no framework, no real payments. Plain HTML, CSS and vanilla JavaScript.

---

## How to run it

You have two options.

**Option 1, just open it.** Double click `index.html`, or open it in your browser. Everything works from the file directly.

**Option 2, run a tiny local server** (recommended, closest to a real deploy):

```bash
cd seeds-for-country
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser. Any simple static server works, this just uses Python, which is already on most machines.

---

## File map

```
seeds-for-country/
├── index.html                 The whole single-page site
├── css/
│   └── styles.css             Design tokens, layout, responsive rules, focus states
├── js/
│   ├── main.js                Sticky nav, smooth scroll, scroll reveals, form handlers
│   └── finder.js              Region selection, animated filtering, pack suggestions
├── data/
│   └── regions.js             Region and species data (Sydney draft + other cities)
├── assets/
│   └── images/                SVG placeholder images + a swap guide (README.txt)
├── research/
│   └── interview-script.md    Primary-research interview guide
└── README.md                  This file
```

---

## Brand lock

These are fixed. Please do not drift from them.

**Fonts**

- **Fraunces**, headings only.
- **Inter**, body text, subheadings, buttons and everything else.

**Colours, exactly four, with fixed roles**

| Colour | Hex | Role |
| --- | --- | --- |
| Eucalypt green | `#2F5D45` | Primary surfaces and headings |
| Warm sand | `#E4D5C3` | Soft backgrounds |
| Clay | `#C2855B` | Secondary blocks and cards |
| Wattle honey | `#E6A532` | Accent, used sparingly, only for buttons and the give-back highlight |

Neutrals (white, a warm off-white and a near-black ink for text) are used for page background and readability only. They are not a fifth brand colour. Honey buttons use a near-black label so the text passes WCAG AA contrast.

---

## Cultural rules

These are non-negotiable and are built into the site.

- No Aboriginal visual styles, including no dot-painting motifs.
- No use of the Aboriginal flag colours (black, red, yellow) to signal connection. The palette stays earthy and natural.
- No invented or displayed Aboriginal language, artwork or cultural content.
- Where cultural or community content would belong, there is a clearly labelled placeholder noting it must be created by, and credited to, an Aboriginal partner. We left those spaces open on purpose.

---

## The verification rule, important

A website is **not** a botanical authority. Every species in `data/regions.js` defaults to:

```
verificationStatus: "unverified, to be checked"
```

The finder only ever shows a **verified** badge on an entry whose status is exactly `verified`. Everything else is shown as a draft. No species may be marked verified until a real person confirms it against an authoritative source. The how-to for flipping an entry to verified is documented at the top of `data/regions.js`.

---

## Must replace or verify before any real use

Treat this whole list as outstanding. Nothing below is confirmed.

1. **The species list.** The 33 Sydney entries were checked by the team against PlantNET (Royal Botanic Garden Sydney) on 2026-06-23 and are marked verified. Creeping Boobialla was removed in that pass because PlantNET does not list it for the Central Coast subdivision that covers Sydney. Crimson Bottlebrush is recorded under its accepted name *Melaleuca citrina* with the familiar synonym *Callistemon citrinus* shown. Still to do: confirm each PlantNET link opens the right species, and build out Brisbane, Melbourne and Adelaide, which remain placeholders only and stay unverified until a person checks them.
2. **Partner names and details.** Every partner reference is a labelled placeholder. Only name a partner once an agreement is in place. Any words about a partner or their community must be written by them.
3. **Real figures.** The give-back share (about half) is a target, not a confirmed split. All prices are indicative "from" figures, not real prices, and there is no checkout. Publish the real split and real prices only once they are locked in.
4. **Real images.** Each image shows a clearly labelled SVG placeholder until a real photo is added. To add photos, just drop properly licensed `.jpg` files (e.g. from Pexels or Pixabay) into `assets/images/` with the names `hero.jpg`, `about.jpg`, `nursery.jpg`, `restoration.jpg` and `product.jpg`. They appear automatically and the placeholder chip disappears, no code change needed. See `assets/images/README.txt` for the full guide. Update the alt text to match each new photo, and for the two partner photos, have the Aboriginal partner supply and credit the image.
5. **Any cultural content.** Anything cultural, including language, artwork or Caring for Country learning material, must be created by, and credited to, an Aboriginal partner. Do not fill those placeholders in-house.
6. **Contact details.** The email address and contact form are placeholders. The form is client-side only and does not send anything. Wire up a real inbox and form handler before launch.

---

## Accessibility and standards notes

- Semantic landmarks, a skip-to-content link, sensible heading order and visible focus states throughout.
- Full keyboard support, including the region selector, the postcode field, the filter chips and the contact form.
- Colour contrast aims for WCAG AA. Honey buttons use a near-black label to clear the AA threshold.
- Scroll reveal animations respect `prefers-reduced-motion` and are disabled when a visitor asks for reduced motion.
- Australian English spelling throughout, and no em dashes in any visible copy.
