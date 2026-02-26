---
name: Color Theory
description: Color palette generation and color psychology for web design. Use when creating color schemes, suggesting brand colors, ensuring color accessibility, or explaining color choices. Includes tools for complementary, analogous, triadic, and split-complementary palettes.
version: 1.0.0
---

# Color Theory for Web Design

## Overview

This skill provides color theory knowledge for generating harmonious, accessible, and purposeful color palettes for web projects.

---

## Color Palette Types

### 1. Monochromatic
**One hue, multiple shades/tints**

Best for: Minimal designs, professional look, easy consistency

```css
:root {
  --color-50: #EEF2FF;
  --color-100: #E0E7FF;
  --color-200: #C7D2FE;
  --color-300: #A5B4FC;
  --color-400: #818CF8;
  --color-500: #6366F1;  /* Base */
  --color-600: #4F46E5;
  --color-700: #4338CA;
  --color-800: #3730A3;
  --color-900: #312E81;
}
```

### 2. Complementary
**Two colors opposite on the color wheel**

Best for: High contrast, bold designs, CTAs that pop

```css
:root {
  /* Blue + Orange */
  --primary: #3B82F6;
  --primary-light: #60A5FA;
  --primary-dark: #2563EB;

  --accent: #F97316;
  --accent-light: #FB923C;
  --accent-dark: #EA580C;
}
```

### 3. Analogous
**Three adjacent colors on the wheel**

Best for: Harmonious, natural feel, cohesive designs

```css
:root {
  /* Blue-Cyan-Teal */
  --primary: #3B82F6;    /* Blue */
  --secondary: #06B6D4;  /* Cyan */
  --tertiary: #14B8A6;   /* Teal */
}
```

### 4. Triadic
**Three colors evenly spaced (120°)**

Best for: Vibrant, playful, creative projects

```css
:root {
  /* Blue-Yellow-Red */
  --primary: #3B82F6;
  --secondary: #EAB308;
  --tertiary: #EF4444;
}
```

### 5. Split-Complementary
**One base + two adjacent to complement**

Best for: Dynamic but less tension than complementary

```css
:root {
  /* Blue + Yellow-Orange + Red-Orange */
  --primary: #3B82F6;
  --accent-1: #F59E0B;
  --accent-2: #F97316;
}
```

---

## Color Psychology

| Color | Emotion | Best For |
|-------|---------|----------|
| **Blue** | Trust, stability, calm | Finance, healthcare, tech |
| **Green** | Growth, nature, health | Eco, wellness, finance |
| **Red** | Energy, urgency, passion | Food, sales, entertainment |
| **Orange** | Friendly, confident, fun | Youth brands, CTAs |
| **Purple** | Luxury, creativity, wisdom | Beauty, creative, spiritual |
| **Yellow** | Optimism, warmth, caution | Children, food, warnings |
| **Black** | Elegance, power, sophistication | Luxury, fashion, tech |
| **White** | Clean, simple, pure | Minimal, healthcare, tech |

---

## Ready-to-Use Palettes

### Professional Blue
```css
:root {
  --primary: #2563EB;
  --primary-hover: #1D4ED8;
  --secondary: #64748B;
  --accent: #06B6D4;
  --background: #F8FAFC;
  --surface: #FFFFFF;
  --text: #0F172A;
  --text-muted: #64748B;
  --border: #E2E8F0;
  --success: #22C55E;
  --warning: #F59E0B;
  --error: #EF4444;
}
```

### Modern Dark
```css
:root {
  --primary: #8B5CF6;
  --primary-hover: #7C3AED;
  --secondary: #EC4899;
  --accent: #06B6D4;
  --background: #0F172A;
  --surface: #1E293B;
  --text: #F1F5F9;
  --text-muted: #94A3B8;
  --border: #334155;
  --success: #22C55E;
  --warning: #F59E0B;
  --error: #EF4444;
}
```

### Warm & Friendly
```css
:root {
  --primary: #F97316;
  --primary-hover: #EA580C;
  --secondary: #84CC16;
  --accent: #FBBF24;
  --background: #FFFBEB;
  --surface: #FFFFFF;
  --text: #292524;
  --text-muted: #78716C;
  --border: #E7E5E4;
  --success: #22C55E;
  --warning: #F59E0B;
  --error: #EF4444;
}
```

### Nature & Eco
```css
:root {
  --primary: #059669;
  --primary-hover: #047857;
  --secondary: #84CC16;
  --accent: #14B8A6;
  --background: #F0FDF4;
  --surface: #FFFFFF;
  --text: #14532D;
  --text-muted: #4D7C0F;
  --border: #D1FAE5;
  --success: #22C55E;
  --warning: #F59E0B;
  --error: #EF4444;
}
```

### Luxury & Elegant
```css
:root {
  --primary: #7C3AED;
  --primary-hover: #6D28D9;
  --secondary: #C026D3;
  --accent: #F59E0B;
  --background: #1C1917;
  --surface: #292524;
  --text: #FAFAF9;
  --text-muted: #A8A29E;
  --border: #44403C;
  --success: #22C55E;
  --warning: #F59E0B;
  --error: #EF4444;
}
```

---

## Accessibility Guidelines

### WCAG Contrast Requirements

| Level | Normal Text | Large Text |
|-------|-------------|------------|
| AA | 4.5:1 | 3:1 |
| AAA | 7:1 | 4.5:1 |

### Quick Contrast Check

```javascript
// Contrast ratio formula helper
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1, color2) {
  const l1 = getLuminance(...color1);
  const l2 = getLuminance(...color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Example: Check if text on background passes AA
// getContrastRatio([255, 255, 255], [37, 99, 235]) → 4.57:1 ✓
```

### Safe Color Combinations

**On White Background (#FFFFFF):**
- ✅ #1F2937 (Gray 800) - 12.6:1
- ✅ #374151 (Gray 700) - 8.6:1
- ✅ #1D4ED8 (Blue 700) - 6.2:1
- ⚠️ #3B82F6 (Blue 500) - 3.4:1 (large text only)

**On Dark Background (#0F172A):**
- ✅ #F8FAFC (Slate 50) - 16.4:1
- ✅ #E2E8F0 (Slate 200) - 12.8:1
- ✅ #94A3B8 (Slate 400) - 5.9:1

---

## Tailwind CSS Color Implementation

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        accent: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
        },
      },
    },
  },
}
```

Usage:
```html
<button class="bg-primary-600 hover:bg-primary-700 text-white">
  Click me
</button>

<span class="text-primary-500">Highlighted text</span>
```

---

## Color Selection Process

1. **Define brand personality** (professional, playful, luxurious?)
2. **Choose primary color** based on industry + emotion
3. **Select palette type** (monochromatic, complementary, etc.)
4. **Generate shades/tints** for primary (50-900 scale)
5. **Add semantic colors** (success, warning, error)
6. **Test accessibility** with contrast checker
7. **Create dark mode variant** if needed

---

## Quick Reference

| Need | Recommendation |
|------|----------------|
| High contrast CTA | Complementary accent on primary |
| Professional look | Monochromatic blues/grays |
| Friendly vibe | Warm oranges/yellows |
| Nature/eco | Greens + earth tones |
| Tech/modern | Blue + purple gradients |
| Luxury | Deep purples + gold accents |
