# Design Guidelines — SIE Yosakoi Shop

## Brand Identity

**SIE Yosakoi Team 2026** — Vietnamese Yosakoi dance team selling Japanese cultural merchandise.
Tone: artisan, cultural, festive, clean. MA principle (negative space as design element).

---

## Color System

### CSS Custom Properties

```css
:root {
  /* Primary Palette */
  --color-indigo-deep:    #1B3A6B;   /* primary brand, headers, CTAs */
  --color-indigo-mid:     #2E5299;   /* hover states, secondary actions */
  --color-indigo-light:   #4A72C4;   /* links, focus rings */
  --color-indigo-wash:    #E8EEF8;   /* section backgrounds, card bg */

  /* Neutral */
  --color-offwhite:       #F8F6F2;   /* page background */
  --color-warm-white:     #FDFCFA;   /* card backgrounds */
  --color-charcoal:       #2C2C2C;   /* body text */
  --color-slate:          #5A5A5A;   /* secondary text */
  --color-mist:           #9A9A9A;   /* placeholder, disabled */
  --color-border:         #E2DDD6;   /* dividers, input borders */
  --color-border-strong:  #C5BFB6;   /* emphasized borders */

  /* Accent */
  --color-sakura:         #E8B4B8;   /* highlights, badges, accents */
  --color-sakura-deep:    #C9767D;   /* hover on sakura elements */
  --color-gold:           #C9A84C;   /* premium labels, batch status */
  --color-gold-light:     #F0DFA0;   /* gold backgrounds, tags */
  --color-sage:           #A5B4A0;   /* success, delivery, eco hints */
  --color-sage-deep:      #6B8066;   /* success text */

  /* Status */
  --color-success:        #2E7D32;
  --color-success-bg:     #E8F5E9;
  --color-warning:        #E65100;
  --color-warning-bg:     #FFF3E0;
  --color-error:          #C62828;
  --color-error-bg:       #FFEBEE;
  --color-info:           #1565C0;
  --color-info-bg:        #E3F2FD;

  /* Order/Payment Status */
  --status-pending:       #E65100;   /* awaiting payment */
  --status-verified:      #2E7D32;   /* payment confirmed */
  --status-confirmed:     #1565C0;   /* order confirmed */
  --status-shipping:      #6A1B9A;   /* in transit */
  --status-done:          #2E7D32;   /* delivered */
  --status-cancelled:     #757575;   /* cancelled */
}
```

### Color Usage Rules

| Context | Token |
|---|---|
| Page background | `--color-offwhite` |
| Card / form background | `--color-warm-white` |
| Primary button bg | `--color-indigo-deep` |
| Primary button hover | `--color-indigo-mid` |
| Destructive button | `--color-error` |
| Body text | `--color-charcoal` |
| Secondary text | `--color-slate` |
| Section headings | `--color-indigo-deep` |
| Borders / dividers | `--color-border` |
| Batch open badge | `--color-gold` on `--color-gold-light` |
| New / highlight badge | `--color-sakura-deep` on `--color-sakura` |

---

## Typography

### Font Stack

```css
@import url('https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;500;600;700;900&family=Noto+Sans+JP:wght@300;400;500;700&display=swap');

:root {
  --font-display:  'Zen Old Mincho', 'Noto Serif JP', serif;   /* hero, product names */
  --font-body:     'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif;
}
```

**Vietnamese support**: Both fonts support Latin Extended with Vietnamese diacriticals.
Fallback for Vietnamese body: system-ui, -apple-system for maximum compatibility.

### Type Scale

```css
:root {
  --text-xs:    0.75rem;   /* 12px — labels, meta */
  --text-sm:    0.875rem;  /* 14px — secondary info, captions */
  --text-base:  1rem;      /* 16px — body text */
  --text-lg:    1.125rem;  /* 18px — lead text, card body */
  --text-xl:    1.25rem;   /* 20px — card titles, section labels */
  --text-2xl:   1.5rem;    /* 24px — section headings */
  --text-3xl:   1.875rem;  /* 30px — page titles */
  --text-4xl:   2.25rem;   /* 36px — hero subhead */
  --text-5xl:   3rem;      /* 48px — hero headline (display font) */
  --text-6xl:   3.75rem;   /* 60px — hero display (desktop only) */

  --leading-tight:   1.25;
  --leading-snug:    1.375;
  --leading-normal:  1.5;
  --leading-relaxed: 1.625;
  --leading-loose:   1.8;   /* Vietnamese body text: use 1.7–1.8 */

  --tracking-tighter: -0.04em;
  --tracking-tight:   -0.02em;
  --tracking-normal:   0;
  --tracking-wide:     0.05em;
  --tracking-wider:    0.1em;
  --tracking-widest:   0.2em;  /* japanese-style all-caps labels */
}
```

### Typography Rules

- **Hero/Display**: `Zen Old Mincho`, weight 700–900, `--tracking-tighter`
- **Section Headings (H2–H3)**: `Zen Old Mincho`, weight 600, `--color-indigo-deep`
- **Product Names**: `Zen Old Mincho`, weight 500, `--text-xl`–`--text-2xl`
- **Body / UI**: `Noto Sans JP`, weight 400, `--leading-relaxed`
- **Labels / Badges**: `Noto Sans JP`, weight 500–700, `--text-xs`–`--text-sm`
- **Price**: `Noto Sans JP`, weight 700, `--color-indigo-deep`
- **Vietnamese text**: always `--leading-loose` (1.7+) for diacritic clearance

---

## Spacing System

```css
:root {
  --space-1:   0.25rem;   /* 4px */
  --space-2:   0.5rem;    /* 8px */
  --space-3:   0.75rem;   /* 12px */
  --space-4:   1rem;      /* 16px */
  --space-5:   1.25rem;   /* 20px */
  --space-6:   1.5rem;    /* 24px */
  --space-8:   2rem;      /* 32px */
  --space-10:  2.5rem;    /* 40px */
  --space-12:  3rem;      /* 48px */
  --space-16:  4rem;      /* 64px */
  --space-20:  5rem;      /* 80px */
  --space-24:  6rem;      /* 96px */

  --container-sm:   480px;
  --container-md:   768px;
  --container-lg:   1024px;
  --container-xl:   1200px;

  --page-padding-x:      var(--space-4);   /* 16px mobile */
  --page-padding-x-md:   var(--space-6);   /* 24px tablet */
  --page-padding-x-lg:   var(--space-8);   /* 32px desktop */

  --section-gap:    var(--space-16);  /* between major sections */
  --card-padding:   var(--space-5) var(--space-6);
  --input-padding:  var(--space-3) var(--space-4);
}
```

---

## Border Radius

```css
:root {
  --radius-sm:   4px;    /* inputs, small tags */
  --radius-md:   8px;    /* cards, buttons */
  --radius-lg:   12px;   /* modals, large cards */
  --radius-xl:   16px;   /* hero cards, banners */
  --radius-full: 9999px; /* pills, avatars, circular badges */
}
```

---

## Shadow System

```css
:root {
  --shadow-xs:  0 1px 2px rgba(27,58,107,0.06);
  --shadow-sm:  0 2px 8px rgba(27,58,107,0.08);
  --shadow-md:  0 4px 16px rgba(27,58,107,0.10);
  --shadow-lg:  0 8px 32px rgba(27,58,107,0.12);
  --shadow-xl:  0 16px 48px rgba(27,58,107,0.15);
  --shadow-inset: inset 0 2px 4px rgba(27,58,107,0.06);
}
```

---

## Component Patterns

### Buttons

```css
/* Primary */
.btn-primary {
  background: var(--color-indigo-deep);
  color: white;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-base);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  border: none;
  min-height: 48px;  /* touch target */
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}
.btn-primary:hover  { background: var(--color-indigo-mid); box-shadow: var(--shadow-md); }
.btn-primary:active { transform: translateY(1px); }
.btn-primary:focus  { outline: 2px solid var(--color-indigo-light); outline-offset: 2px; }

/* Secondary (outline) */
.btn-secondary {
  background: transparent;
  color: var(--color-indigo-deep);
  border: 2px solid var(--color-indigo-deep);
  /* same padding, radius, font as primary */
}
.btn-secondary:hover { background: var(--color-indigo-wash); }

/* Ghost */
.btn-ghost {
  background: transparent;
  color: var(--color-slate);
  border: 1px solid var(--color-border);
}
.btn-ghost:hover { background: var(--color-offwhite); border-color: var(--color-border-strong); }

/* Destructive */
.btn-danger {
  background: var(--color-error);
  color: white;
}

/* Full-width (mobile) */
.btn-full { width: 100%; display: block; text-align: center; }
```

### Cards

```css
.card {
  background: var(--color-warm-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

/* Product card */
.card-product .card-image { aspect-ratio: 4/3; object-fit: cover; }
.card-product .card-body  { padding: var(--space-4) var(--space-5); }
.card-product .card-price { font-size: var(--text-xl); font-weight: 700; color: var(--color-indigo-deep); }
```

### Badges / Status Tags

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  font-weight: 700;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}
.badge-open     { background: var(--color-gold-light);   color: #7A5F00; }
.badge-closed   { background: var(--color-border);        color: var(--color-slate); }
.badge-pending  { background: var(--color-warning-bg);    color: var(--color-warning); }
.badge-verified { background: var(--color-success-bg);    color: var(--color-success); }
.badge-new      { background: var(--color-sakura);        color: var(--color-sakura-deep); }
.badge-shipping { background: #EDE7F6;                    color: #6A1B9A; }
```

### Forms / Inputs

```css
.form-group { display: flex; flex-direction: column; gap: var(--space-2); }
.form-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-charcoal);
}
.form-label .required { color: var(--color-error); margin-left: 2px; }
.form-input {
  background: var(--color-warm-white);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-charcoal);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  min-height: 48px;
  width: 100%;
}
.form-input:focus {
  border-color: var(--color-indigo-light);
  box-shadow: 0 0 0 3px rgba(74,114,196,0.15);
  outline: none;
}
.form-input:invalid { border-color: var(--color-error); }
.form-hint { font-size: var(--text-xs); color: var(--color-slate); }
.form-error { font-size: var(--text-xs); color: var(--color-error); }
```

### Tables (Admin)

```css
.data-table { width: 100%; border-collapse: collapse; }
.data-table th {
  background: var(--color-offwhite);
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-slate);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  border-bottom: 2px solid var(--color-border);
}
.data-table td {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-charcoal);
  border-bottom: 1px solid var(--color-border);
  vertical-align: middle;
}
.data-table tr:hover td { background: var(--color-indigo-wash); }
```

### Stats Cards (Admin)

```css
.stat-card {
  background: var(--color-warm-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.stat-card .stat-label { font-size: var(--text-sm); color: var(--color-slate); font-weight: 500; }
.stat-card .stat-value { font-size: var(--text-3xl); font-weight: 700; color: var(--color-indigo-deep); }
.stat-card .stat-change { font-size: var(--text-xs); display: flex; align-items: center; gap: 4px; }
.stat-card .stat-icon { width: 40px; height: 40px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
```

---

## Layout Patterns

### Public Pages (max-width 768px content)

```
┌─────────────────────┐
│ Header (sticky)     │  height: 56px
├─────────────────────┤
│                     │
│  Content area       │  max-width: 768px, margin: 0 auto
│  px: 16px (mobile)  │  px: 24px (tablet)
│                     │
├─────────────────────┤
│ Footer              │
└─────────────────────┘
```

### Admin Pages (sidebar + content, max-width 1200px)

```
┌──────────┬──────────────────────────┐
│ Sidebar  │  Top bar                 │  sidebar: 240px fixed
│ 240px    ├──────────────────────────┤  top bar: 60px
│          │                          │
│  Nav     │  Content area            │
│  items   │  p: 24px–32px            │
│          │                          │
└──────────┴──────────────────────────┘
```

Mobile admin: sidebar collapses to hamburger + drawer.

---

## Japanese Pattern Usage

### Principles

- **MA (間)**: Use generous negative space — patterns should "breathe"
- Patterns are decorative, never informational — kept at low opacity (8–15%)
- Use as: section dividers, card backgrounds, hero overlays, footer texture

### Approved Motifs

| Motif | Use Case | Opacity |
|---|---|---|
| Seigaiha (overlapping waves) | Hero backgrounds, page headers | 8–10% |
| Asanoha (hemp leaf geometric) | Section dividers, card accents | 6–8% |
| Kumiko (interlocking squares) | Footer, admin sidebar | 6% |
| Kasuri (woven stripe) | Product card borders, CTA backgrounds | used as border only |
| Cloud swirls (kumo) | Tenugui product cards specifically | 12% |

### SVG Pattern Examples

```css
/* Wave pattern (seigaiha) as CSS background */
.pattern-seigaiha {
  background-image: url("data:image/svg+xml,...");
  background-size: 40px 40px;
  opacity: 0.08;
}

/* Apply as overlay */
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--pattern-seigaiha);
  opacity: 0.08;
  pointer-events: none;
}
```

### Pattern Rules

1. Never use patterns on text-heavy areas
2. Contrast ratio must remain WCAG AA after pattern overlay
3. Patterns inherit or harmonize with `--color-indigo-deep` tint
4. On mobile: reduce pattern opacity by 50% for performance
5. `prefers-reduced-motion`: keep patterns static, never animate

---

## Iconography

- Icon library: Inline SVG or Phosphor Icons (MIT licensed)
- Size: 16px (sm), 20px (default), 24px (lg), 32px (xl)
- Stroke width: 1.5–2px for line icons
- Color: inherit from text color — never hardcode icon colors

---

## Motion & Micro-interactions

```css
/* Standard easing */
--ease-standard:  cubic-bezier(0.4, 0, 0.2, 1);   /* general transitions */
--ease-decelerate: cubic-bezier(0, 0, 0.2, 1);    /* elements entering */
--ease-accelerate: cubic-bezier(0.4, 0, 1, 1);    /* elements leaving */

/* Durations */
--duration-fast:    150ms;   /* hover states */
--duration-normal:  250ms;   /* page transitions, cards */
--duration-slow:    400ms;   /* modals, drawers */

/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0.01ms !important; }
}
```

---

## Accessibility

- Min touch target: 44×44px (all interactive elements)
- Color contrast: WCAG 2.1 AA minimum (4.5:1 body, 3:1 large text)
- Focus rings: 2px solid `--color-indigo-light`, offset 2px
- All images: meaningful `alt` text in Vietnamese
- Form fields: always paired with `<label>` (never placeholder-only)
- Status badges: include text, never color-only communication
- Vietnamese screen reader: use `lang="vi"` on `<html>`

---

## Batch Status Indicator

The batch status component is a key UI element — used on landing and admin:

```
┌─────────────────────────────────┐
│  [●] ĐỢT BÁN 03 — ĐANG MỞ      │  background: gold-light
│  Kết thúc: 15/04/2026           │  border-left: 4px gold
│  Còn lại: 12 ngày               │
└─────────────────────────────────┘
```

- Open: gold border + gold-light background + pulsing dot
- Closed: mist border + offwhite background
- Draft: sage border + sage wash background

---

## Vietnamese Language Notes

- Use `font-feature-settings: "kern" 1, "liga" 1` for correct ligatures
- Line height: minimum 1.7 for body text with Vietnamese diacriticals
- Avoid ALL-CAPS for Vietnamese text (diacriticals become ambiguous)
- Uppercase only for: badge labels (Latin), product codes
- Test all fonts with: "Tên khách hàng", "Địa chỉ giao hàng", "Đặt hàng ngay"
