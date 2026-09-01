# Avocado Digital — Business Card

**Sunil Chand · Director** · Front + back, single design.

## Files

| File | Page size | Use |
|---|---|---|
| `..._PRINT_crop-marks.pdf` | 102 × 67 mm | Trade / offset printers. Crop marks in the slug. |
| `..._bleed-only.pdf` | 96 × 61 mm | Online print portals (Vistaprint, Moo, Officeworks) that ask for "size + 3 mm bleed, no marks". |

Both are 2 pages — **page 1 = front, page 2 = back**.

## Geometry

- **Trim:** 90 × 55 mm (Australian standard)
- **Bleed:** 3 mm all round, artwork extends fully into it
- **Safe area:** all content sits 6.5 mm inside trim
- `TrimBox`, `BleedBox` and `ArtBox` are declared inside both PDFs, so prepress software reads the trim automatically.

## Card content

**Front** — wordmark, "Business technology solutions", Melbourne AU, name/title,
and the three contact lines.

**Back** — wordmark, the studio tagline, then an EzyBiz product block:
logo, "EzyBiz, the ultimate business phone for small business." and `ezybiz.ai`.

To make room for the EzyBiz block, the old "Established 2021 · Melbourne, AU"
line came off the back. Melbourne still appears on the front.

### EzyBiz logo

`ezybizlogo2.png` in the repo is **not** transparent — it has a solid white
background, so it would have printed as a white box on the black card. I knocked
the white out along the white→`#0084F0` axis (so the anti-aliased edges keep
clean alpha rather than a white fringe) and saved the result as
`ezybiz-logo-transparent.png` in this folder. Worth keeping — it is the version
you want on any dark background.

The logo prints in its own brand blue `#0084F0`. Say the word if you would rather
it were monochrome gold to sit quieter against the Avocado palette.

## Colour

| Role | Hex | Suggested CMYK |
|---|---|---|
| Background | `#0A0907` | **Rich black** — C60 M40 Y40 K100. Do *not* print as K100 alone; a 90 × 55 mm solid needs the support. |
| Gold | `#D4B16A` | C0 M17 Y50 K17 (or Pantone 465 C / 466 C) |
| Cream | `#F5ECD9` | C3 M6 Y14 K0 |
| Muted | `#B9AD94` | C6 M11 Y26 K10 |

Files are supplied in RGB. Ask the printer to convert to their profile
(AU sheetfed coated is usually **ISO Coated v2 / FOGRA39**), or say the word and
I'll regenerate in CMYK.

## Type

Fonts are **embedded as subsets** (all Type0 / CID TrueType — no Type3, no
missing-font risk).

The brand faces from avocadodigital.com.au — Cormorant Garamond, Manrope and
JetBrains Mono — are Google Fonts, and this environment had no network access to
fetch them. The cards use closely matched stand-ins:

| Site | Used here |
|---|---|
| Cormorant Garamond | TeX Gyre Pagella (Palatino) |
| Manrope | TeX Gyre Heros (Helvetica) |
| JetBrains Mono | DejaVu Sans Mono |

If you want the exact brand faces, drop the three font files into the folder and
I'll rebuild — the layout is parametric.

## Smallest type

The services line and the mono labels sit at 4.8–5.2 pt reversed out of black.
That is fine on digital or good offset, but if you are printing letterpress,
foil or on uncoated stock, tell me and I'll lift them a point.

## Stock suggestion

400–450 gsm uncoated or soft-touch laminate, dark stock or heavy rich-black
coverage. Gold is a natural candidate for **foil** if you ever want a premium
run — the wordmark is flat geometry, so a foil die is straightforward.
