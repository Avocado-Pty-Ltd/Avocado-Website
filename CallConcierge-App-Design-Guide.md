# CallConcierge App Design Guide

A comprehensive design system for updating the CallConcierge mobile app to match the luxury brand identity.

---

## Brand Identity

**Brand Name:** CallConcierge by Krystal Voice
**Positioning:** Premium call concierge for discerning businesses
**Tone:** Luxury, sophisticated, white-glove service

---

## Color Palette

### Primary - Champagne Gold
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Gold Primary | `#c9a962` | 201, 169, 98 | Primary buttons, accents, icons |
| Gold Light | `#ddc88a` | 221, 200, 138 | Hover states, highlights |
| Gold Dark | `#a68a4e` | 166, 138, 78 | Pressed states, text links |
| Gold Deep | `#8a7340` | 138, 115, 64 | Active states |

### Secondary - Rose Gold
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Rose | `#d4a574` | 212, 165, 116 | Secondary accents, gradients |
| Rose Light | `#e2c4a8` | 226, 196, 168 | Soft highlights |
| Rose Dark | `#b88a5c` | 184, 138, 92 | Subtle accents |

### Backgrounds - Midnight Navy (Dark Mode)
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Midnight 950 | `#050810` | 5, 8, 16 | Deepest background |
| Midnight 900 | `#0a0f1a` | 10, 15, 26 | Primary dark background |
| Midnight 800 | `#141b2d` | 20, 27, 45 | Cards on dark bg |
| Midnight 700 | `#1e2940` | 30, 41, 64 | Elevated surfaces |
| Midnight 600 | `#2d3a52` | 45, 58, 82 | Borders, dividers |

### Backgrounds - Warm Ivory (Light Mode)
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Ivory 50 | `#faf8f5` | 250, 248, 245 | Primary light background |
| Ivory 100 | `#f5f2ed` | 245, 242, 237 | Secondary background |
| Ivory 200 | `#e8e4dc` | 232, 228, 220 | Borders, dividers |
| Ivory 300 | `#d4cfc4` | 212, 207, 196 | Disabled states |

### Text Colors
| Name | Hex | Usage |
|------|-----|-------|
| Text Dark | `#1a1a1a` | Primary headings |
| Text Primary | `#2d2d2d` | Body text (light mode) |
| Text Secondary | `#5a5a5a` | Secondary text |
| Text Muted | `#8a8a8a` | Placeholder, disabled |
| Text Cream | `#f5f2ed` | Body text (dark mode) |
| Text White | `#ffffff` | Text on dark/gold backgrounds |

### Status Colors (Suggested)
| Status | Hex | Usage |
|--------|-----|-------|
| Success | `#10b981` | Completed calls, confirmations |
| Warning | `#f59e0b` | Missed calls, alerts |
| Error | `#ef4444` | Errors, failed states |
| Info | `#c9a962` | Use gold for info states |

---

## Typography

### Font Families
```
Headlines: 'Cormorant Garamond', Georgia, serif
Body: 'Outfit', system-ui, sans-serif
```

**Google Fonts Import:**
```
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap
```

### Type Scale (Mobile)
| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| H1 (Screen Title) | Cormorant Garamond | 28-32px | 600 | 1.15 |
| H2 (Section Title) | Cormorant Garamond | 22-24px | 600 | 1.2 |
| H3 (Card Title) | Cormorant Garamond | 18-20px | 600 | 1.25 |
| Body Large | Outfit | 16px | 400 | 1.6 |
| Body | Outfit | 14px | 400 | 1.5 |
| Body Small | Outfit | 12px | 400 | 1.4 |
| Caption | Outfit | 11px | 400 | 1.3 |
| Button | Outfit | 14px | 500 | 1 |

### Letter Spacing
- Headlines: `-0.02em` (slightly tighter)
- Body: `0` (default)
- Buttons/Labels: `0.02em` (slightly looser)

---

## Gradients

### Gold Gradient (Primary CTA)
```css
linear-gradient(135deg, #c9a962 0%, #d4a574 50%, #c9a962 100%)
```

### Shimmer Effect (Loading/Highlight)
```css
linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.4), transparent)
```

### Dark Background Gradient
```css
linear-gradient(180deg, #0a0f1a 0%, #141b2d 100%)
```

---

## Shadows & Elevation

### Light Mode
| Level | Value | Usage |
|-------|-------|-------|
| Small | `0 2px 8px rgba(10, 15, 26, 0.08)` | Subtle cards |
| Medium | `0 4px 16px rgba(10, 15, 26, 0.12)` | Cards, dropdowns |
| Large | `0 8px 32px rgba(10, 15, 26, 0.16)` | Modals, popovers |
| XL | `0 16px 48px rgba(10, 15, 26, 0.2)` | Floating elements |
| Card | `0 2px 12px rgba(10, 15, 26, 0.06)` | List items |

### Gold Glow (Special)
```css
0 4px 24px rgba(201, 169, 98, 0.3)
```
Use for: Primary buttons hover, active states, premium features

---

## Glass/Blur Effects

```css
background: rgba(255, 255, 255, 0.9);
backdrop-filter: blur(20px);
border: 1px solid rgba(201, 169, 98, 0.2);
```

Use for: Navigation bars, floating headers, overlays

---

## Border Radius

| Element | Radius |
|---------|--------|
| Buttons | 6-8px |
| Cards | 12-16px |
| Input fields | 8px |
| Chips/Tags | 100px (pill) |
| Avatars | 50% (circle) |
| Modals | 16-20px |

---

## Component Styles

### Primary Button
```css
background: linear-gradient(135deg, #c9a962 0%, #d4a574 50%, #c9a962 100%);
color: #0a0f1a;
font-family: 'Outfit', sans-serif;
font-size: 14px;
font-weight: 500;
padding: 12px 24px;
border-radius: 6px;
border: none;
box-shadow: 0 2px 8px rgba(10, 15, 26, 0.08);

/* Pressed/Active */
box-shadow: 0 4px 24px rgba(201, 169, 98, 0.3);
transform: translateY(-1px);
```

### Secondary Button
```css
background: transparent;
color: #c9a962;
border: 1.5px solid #c9a962;
padding: 12px 24px;
border-radius: 6px;

/* Pressed */
background: rgba(201, 169, 98, 0.1);
```

### Card (Light Mode)
```css
background: #ffffff;
border-radius: 12px;
padding: 16px;
box-shadow: 0 2px 12px rgba(10, 15, 26, 0.06);
border: 1px solid #e8e4dc;
```

### Card (Dark Mode)
```css
background: #141b2d;
border-radius: 12px;
padding: 16px;
border: 1px solid #2d3a52;
```

### List Item
```css
background: #ffffff;
padding: 16px;
border-bottom: 1px solid #e8e4dc;

/* Active/Selected */
background: #faf8f5;
border-left: 3px solid #c9a962;
```

### Input Field
```css
background: #ffffff;
border: 1.5px solid #e8e4dc;
border-radius: 8px;
padding: 12px 16px;
font-family: 'Outfit', sans-serif;
font-size: 14px;
color: #2d2d2d;

/* Focus */
border-color: #c9a962;
box-shadow: 0 0 0 3px rgba(201, 169, 98, 0.15);
```

### Tab Bar / Navigation
```css
background: rgba(250, 248, 245, 0.95);
backdrop-filter: blur(20px);
border-top: 1px solid #e8e4dc;

/* Active Tab Icon */
color: #c9a962;

/* Inactive Tab Icon */
color: #8a8a8a;
```

---

## Iconography

### Style Guidelines
- **Weight:** 1.5-2px stroke
- **Style:** Rounded line icons (not filled)
- **Active Color:** `#c9a962` (Gold Primary)
- **Inactive Color:** `#8a8a8a` (Text Muted)

### Recommended Icon Set
- Lucide Icons (https://lucide.dev)
- Phosphor Icons (https://phosphoricons.com)
- Heroicons (https://heroicons.com)

---

## Animation & Transitions

### Duration
| Type | Duration | Easing |
|------|----------|--------|
| Fast (hover, tap) | 150ms | ease |
| Base (most transitions) | 250ms | ease |
| Smooth (page transitions) | 400ms | cubic-bezier(0.4, 0, 0.2, 1) |

### Micro-interactions
- Button press: Scale down to 0.98, then back
- Card tap: Subtle lift with shadow increase
- Tab switch: Smooth slide with fade
- Pull to refresh: Gold spinner/indicator

---

## Dark Mode Considerations

The app screenshots show a light theme. For dark mode:

| Light Mode | Dark Mode |
|------------|-----------|
| `#faf8f5` (Ivory 50) | `#0a0f1a` (Midnight 900) |
| `#ffffff` (White cards) | `#141b2d` (Midnight 800) |
| `#2d2d2d` (Text Primary) | `#f5f2ed` (Text Cream) |
| `#e8e4dc` (Borders) | `#2d3a52` (Midnight 600) |

Gold accent colors remain the same in both modes.

---

## Spacing Scale

```
4px  - xs (tight spacing)
8px  - sm (icon gaps)
12px - md (element padding)
16px - lg (card padding, list spacing)
24px - xl (section spacing)
32px - 2xl (large gaps)
48px - 3xl (section margins)
```

---

## Logo Usage

| Context | File |
|---------|------|
| Light backgrounds | `call-concierge-black.png` |
| Dark backgrounds | `call-concierge-white.png` |
| App icon/Favicon | `callconcierge-favicon.svg` |

---

## Sample Color Application

### Home Screen
- Background: Ivory 50 (`#faf8f5`)
- Cards: White with Ivory 200 border
- Stats icons: Gold Primary (`#c9a962`)
- Activity list: White cards with subtle shadow

### Call History
- Incoming call icon: Green (`#10b981`)
- Outgoing call icon: Gold Primary (`#c9a962`)
- Missed call icon: Warning (`#f59e0b`)

### Messages
- Sent indicator: Gold Primary (`#c9a962`)
- Received indicator: Midnight 600 (`#2d3a52`)
- Unread badge: Gold with white text

### Contacts
- Avatar background: Gold Light (`#ddc88a`)
- Avatar text: Midnight 900 (`#0a0f1a`)
- Contact name: Text Dark (`#1a1a1a`)
- Phone number: Text Secondary (`#5a5a5a`)

---

## Quick Reference - Key Colors

```
Primary Gold:     #c9a962
Dark Background:  #0a0f1a
Light Background: #faf8f5
Text Dark:        #1a1a1a
Text Light:       #f5f2ed
Border Light:     #e8e4dc
Border Dark:      #2d3a52
```

---

*Document created for CallConcierge by Krystal app redesign*
