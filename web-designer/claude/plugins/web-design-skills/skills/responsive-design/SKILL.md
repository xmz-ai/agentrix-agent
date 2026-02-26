---
name: Responsive Design
description: Responsive web design patterns and breakpoint strategies. Use when implementing mobile-first layouts, setting up media queries, creating fluid typography, or designing adaptive components that work across all screen sizes.
version: 1.0.0
---

# Responsive Design Patterns

## Overview

This skill provides responsive design patterns for building websites that work seamlessly across all devices, from mobile phones to large desktop screens.

---

## Mobile-First Approach

### Philosophy
1. **Start with mobile** - Design for smallest screen first
2. **Progressively enhance** - Add complexity for larger screens
3. **Content priority** - Most important content visible first
4. **Performance first** - Mobile users often have slower connections

### Base CSS Structure
```css
/* Mobile First: Default styles for mobile */
.container {
  width: 100%;
  padding: 1rem;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Tablet: 640px and up */
@media (min-width: 640px) {
  .container {
    padding: 1.5rem;
  }

  .grid {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .grid > * {
    flex: 1 1 calc(50% - 0.5rem);
  }
}

/* Desktop: 1024px and up */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .grid > * {
    flex: 1 1 calc(33.333% - 0.67rem);
  }
}
```

---

## Breakpoint System

### Standard Breakpoints

| Name | Min Width | Typical Devices |
|------|-----------|-----------------|
| `xs` | 0 | Small phones |
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large monitors |

### CSS Custom Properties Setup
```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Usage */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Tailwind CSS Breakpoints
```html
<!-- Mobile first: classes apply to all, prefixed classes apply at that breakpoint and up -->
<div class="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <!-- Cards -->
</div>

<div class="hidden md:block">
  Only visible on tablet and up
</div>

<div class="md:hidden">
  Only visible on mobile
</div>
```

---

## Fluid Typography

### CSS clamp() Function
```css
/* Fluid heading: 24px on mobile → 48px on desktop */
h1 {
  font-size: clamp(1.5rem, 4vw + 1rem, 3rem);
  line-height: 1.2;
}

/* Fluid body text: 16px → 18px */
body {
  font-size: clamp(1rem, 0.5vw + 0.875rem, 1.125rem);
  line-height: 1.6;
}

/* Complete fluid type scale */
:root {
  --text-xs: clamp(0.75rem, 0.5vw + 0.625rem, 0.875rem);
  --text-sm: clamp(0.875rem, 0.5vw + 0.75rem, 1rem);
  --text-base: clamp(1rem, 0.5vw + 0.875rem, 1.125rem);
  --text-lg: clamp(1.125rem, 1vw + 0.875rem, 1.25rem);
  --text-xl: clamp(1.25rem, 1.5vw + 0.875rem, 1.5rem);
  --text-2xl: clamp(1.5rem, 2vw + 1rem, 2rem);
  --text-3xl: clamp(1.875rem, 3vw + 1rem, 2.5rem);
  --text-4xl: clamp(2.25rem, 4vw + 1rem, 3rem);
  --text-5xl: clamp(3rem, 5vw + 1rem, 4rem);
}
```

### Tailwind Fluid Typography Plugin
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        'fluid-sm': 'clamp(0.875rem, 0.5vw + 0.75rem, 1rem)',
        'fluid-base': 'clamp(1rem, 0.5vw + 0.875rem, 1.125rem)',
        'fluid-lg': 'clamp(1.25rem, 1vw + 1rem, 1.5rem)',
        'fluid-xl': 'clamp(1.5rem, 2vw + 1rem, 2rem)',
        'fluid-2xl': 'clamp(2rem, 3vw + 1rem, 3rem)',
        'fluid-3xl': 'clamp(2.5rem, 4vw + 1rem, 4rem)',
      },
    },
  },
}
```

---

## Responsive Layout Patterns

### 1. Responsive Container
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}
@media (min-width: 768px) {
  .container { max-width: 768px; }
}
@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}
@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
```

Tailwind:
```html
<div class="container mx-auto px-4">
  Content
</div>
```

### 2. Responsive Grid
```css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 1.5rem;
}
```

Tailwind:
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
  <div>Card 4</div>
</div>
```

### 3. Sidebar Layout
```css
.sidebar-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .sidebar-layout {
    grid-template-columns: 250px 1fr;
  }
}

/* Sidebar on right */
@media (min-width: 1024px) {
  .sidebar-layout--right {
    grid-template-columns: 1fr 300px;
  }
}
```

### 4. Holy Grail Layout
```css
.holy-grail {
  display: grid;
  grid-template-areas:
    "header"
    "main"
    "footer";
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

@media (min-width: 1024px) {
  .holy-grail {
    grid-template-areas:
      "header header header"
      "nav main aside"
      "footer footer footer";
    grid-template-columns: 200px 1fr 200px;
  }
}

.header { grid-area: header; }
.nav { grid-area: nav; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

---

## Responsive Navigation

### Mobile Hamburger Menu
```html
<nav class="navbar">
  <div class="navbar-brand">
    <a href="/">Logo</a>
    <button class="navbar-toggle" aria-label="Toggle navigation">
      <span class="hamburger"></span>
    </button>
  </div>

  <div class="navbar-menu">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Services</a>
    <a href="#">Contact</a>
  </div>
</nav>

<style>
.navbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.navbar-toggle {
  display: block;
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background: currentColor;
  position: relative;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background: currentColor;
  left: 0;
}

.hamburger::before { top: -8px; }
.hamburger::after { top: 8px; }

.navbar-menu {
  display: none;
  width: 100%;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
}

.navbar-menu.is-active {
  display: flex;
}

@media (min-width: 768px) {
  .navbar-toggle {
    display: none;
  }

  .navbar-menu {
    display: flex;
    width: auto;
    flex-direction: row;
    gap: 2rem;
    padding-top: 0;
  }
}
</style>
```

Tailwind Version:
```html
<nav class="flex flex-wrap items-center justify-between p-4">
  <div class="flex items-center justify-between w-full md:w-auto">
    <a href="/" class="text-xl font-bold">Logo</a>
    <button class="md:hidden" id="menu-toggle">
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
  </div>

  <div class="hidden w-full md:flex md:w-auto md:items-center" id="menu">
    <div class="flex flex-col md:flex-row md:gap-8 gap-4 pt-4 md:pt-0">
      <a href="#" class="hover:text-indigo-600">Home</a>
      <a href="#" class="hover:text-indigo-600">About</a>
      <a href="#" class="hover:text-indigo-600">Services</a>
      <a href="#" class="hover:text-indigo-600">Contact</a>
    </div>
  </div>
</nav>
```

---

## Responsive Images

### srcset and sizes
```html
<img
  src="image-800.jpg"
  srcset="
    image-400.jpg 400w,
    image-800.jpg 800w,
    image-1200.jpg 1200w,
    image-1600.jpg 1600w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
  alt="Responsive image"
  loading="lazy"
>
```

### Art Direction with Picture
```html
<picture>
  <!-- Square crop for mobile -->
  <source
    media="(max-width: 639px)"
    srcset="hero-mobile.webp"
  >
  <!-- Wide crop for tablet -->
  <source
    media="(max-width: 1023px)"
    srcset="hero-tablet.webp"
  >
  <!-- Full image for desktop -->
  <img
    src="hero-desktop.jpg"
    alt="Hero image"
    class="w-full h-auto"
  >
</picture>
```

### CSS Background Image
```css
.hero {
  background-image: url('hero-mobile.jpg');
  background-size: cover;
  background-position: center;
}

@media (min-width: 768px) {
  .hero {
    background-image: url('hero-tablet.jpg');
  }
}

@media (min-width: 1024px) {
  .hero {
    background-image: url('hero-desktop.jpg');
  }
}

/* High DPI screens */
@media (min-resolution: 2dppx) {
  .hero {
    background-image: url('hero-desktop@2x.jpg');
  }
}
```

---

## Responsive Spacing

### CSS Custom Properties
```css
:root {
  --space-xs: clamp(0.25rem, 0.5vw, 0.5rem);
  --space-sm: clamp(0.5rem, 1vw, 0.75rem);
  --space-md: clamp(1rem, 2vw, 1.5rem);
  --space-lg: clamp(1.5rem, 3vw, 2.5rem);
  --space-xl: clamp(2rem, 4vw, 4rem);
  --space-2xl: clamp(3rem, 6vw, 6rem);
}

section {
  padding: var(--space-xl) var(--space-md);
}

.card {
  padding: var(--space-md);
  margin-bottom: var(--space-lg);
}
```

---

## Testing Checklist

### Viewport Testing
- [ ] 320px (small mobile)
- [ ] 375px (iPhone)
- [ ] 414px (large mobile)
- [ ] 640px (small tablet)
- [ ] 768px (tablet)
- [ ] 1024px (laptop)
- [ ] 1280px (desktop)
- [ ] 1536px+ (large monitor)

### Feature Testing
- [ ] Touch targets ≥ 44px
- [ ] No horizontal scroll
- [ ] Text readable without zoom
- [ ] Images scale properly
- [ ] Navigation works on all sizes
- [ ] Forms usable on mobile
- [ ] Modals/popups work on mobile

---

## Quick Reference

| Need | CSS Solution | Tailwind |
|------|--------------|----------|
| Hide on mobile | `@media (min-width: 768px)` | `hidden md:block` |
| Show only on mobile | `@media (max-width: 767px)` | `md:hidden` |
| Stack to row | `flex-direction: column → row` | `flex-col md:flex-row` |
| Responsive grid | `grid-template-columns` + media queries | `grid-cols-1 md:grid-cols-3` |
| Fluid text | `clamp(min, preferred, max)` | Custom fontSize in config |
| Responsive padding | CSS custom properties + clamp | `p-4 md:p-8 lg:p-12` |
