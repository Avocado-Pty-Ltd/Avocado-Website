# Avocado Digital — A1 Poster

Portrait, 594 × 841 mm. One page.

## Files

| File | Page size | Use |
|---|---|---|
| `..._PRINT_crop-marks.pdf` | 606 × 853 mm | Trade printer. 3 mm bleed + 3 mm slug with crop marks. |
| `..._bleed-only.pdf` | 600 × 847 mm | Online large-format portals that want "size + 3 mm bleed, no marks". |
| `..._PROOF.png` | — | Screen proof. |

`TrimBox` (594 × 841), `BleedBox` and `ArtBox` are declared inside both PDFs.
All fonts embed as Type0 / CID TrueType subsets — no Type3, no missing-font risk.

## Structure

1. **Masthead** — studio descriptor, established line
2. **Hero** — the wordmark at full content width (502 mm), then
   `BUSINESS TECHNOLOGY SOLUTIONS`, then the studio tagline
3. **A.01 – A.03** — the three practice areas, copy taken verbatim from
   `app.jsx` so the poster and the website say the same thing
4. **B.01 – B.04** — the four products, each with its own mark and one-liner
5. **Footer** — call to action, contact, ABN

## Artwork sources

| Element | Source | Resolution at print size |
|---|---|---|
| Avocado wordmark | `avocado-logo-wordmark.svg`, geometry transcribed | **Vector** |
| SocialReels mark | Rebuilt as vector from socialreels.ai's own CSS | **Vector** |
| EzyBiz | `ezybiz-logo-transparent.png` (the knocked-out version) | ~282 dpi |
| CallConcierge | `callconcierge-app-icon.png` | ~263 dpi |
| Claudette | `claudette-preview.png`, centre-cropped square | ~262 dpi |

Everything is at or above 250 dpi at final size, which is comfortable for a
poster. Nothing was upscaled.

### On the SocialReels mark

The logo you sent is a 386 px screenshot — the icon inside it is only 68 px
wide, far too small for A1. The live site builds the mark in CSS rather than
as an image, so I rebuilt it from the computed styles: cream `#F4EDE1` rounded
square (radius 10/34 of its size), a 110° repeating stripe band across the top
8/34, and an italic "R." at 18/34. It is now resolution-independent.

The one thing I could not match is the typeface — the site sets it in
**Fraunces**, a Google Font this environment cannot reach. See below.

### On the SocialReels reels

I originally used a frame from `socialreels-reel.mp4`. I dropped it in favour
of the logo — the frames are 540 × 960, which is only ~120 dpi at panel size,
and they show identifiable faces, which is a licensing question you would want
to answer before putting one on a printed poster.

## Type

Same substitutions as the business cards, for the same reason — the brand faces
are Google Fonts and this environment has no network access to fetch them.

| Intended | Used here |
|---|---|
| Cormorant Garamond | TeX Gyre Pagella (Palatino) |
| Manrope | TeX Gyre Heros (Helvetica) |
| JetBrains Mono | DejaVu Sans Mono |
| Fraunces (SocialReels "R.") | TeX Gyre Pagella Bold Italic |

Drop those four font files into the folder and I will rebuild — the layout is
parametric, so it is a one-minute job.

## Print notes

**Rich black is not optional at this size.** A 594 × 841 mm solid printed as
K100 alone will band and look grey-brown. Specify **C60 M40 Y40 K100**, or ask
the printer for their house rich black.

Files are RGB. Gold is `#D4B16A` (≈ C0 M17 Y50 K17, or Pantone 465 C). Ask the
printer to convert to their profile, or say the word and I will regenerate in
CMYK.

**Stock** — 200 gsm satin or matte for a wall poster. A matte laminate hides
handling marks on a dark solid; gloss will show every fingerprint.

**No QR code** is on the poster. If you want one pointing at the audit booking
form, tell me the URL and I will add it to the footer.
