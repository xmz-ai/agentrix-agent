---
name: Web Design Patterns
description: Modern web layout patterns and component designs. Use when designing page layouts, creating UI components, or implementing common web design patterns like hero sections, navigation, cards, forms, and footers across HTML/CSS, Tailwind, or React.
version: 1.0.0
---

# Web Design Patterns

## Overview

This skill provides modern, production-ready design patterns for web layouts and components. All examples support pure HTML/CSS, Tailwind CSS, and React implementations.

---

## Layout Patterns

### 1. Hero Section

**Purpose**: First impression, key message, call-to-action

#### Pure HTML/CSS
```html
<section class="hero">
  <div class="hero-content">
    <h1>Welcome to Our Platform</h1>
    <p>Build something amazing today</p>
    <a href="#cta" class="btn-primary">Get Started</a>
  </div>
</section>

<style>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 2rem;
}

.hero h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  margin-bottom: 1rem;
}

.hero p {
  font-size: clamp(1rem, 2vw, 1.5rem);
  margin-bottom: 2rem;
  opacity: 0.9;
}

.btn-primary {
  display: inline-block;
  padding: 1rem 2rem;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}
</style>
```

#### Tailwind CSS
```html
<section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-center p-8">
  <div class="max-w-3xl">
    <h1 class="text-4xl md:text-6xl font-bold mb-4">Welcome to Our Platform</h1>
    <p class="text-lg md:text-xl mb-8 opacity-90">Build something amazing today</p>
    <a href="#cta" class="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-xl transition-all">
      Get Started
    </a>
  </div>
</section>
```

#### React + Tailwind
```jsx
function Hero({ title, subtitle, ctaText, ctaLink }) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-center p-8">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
        <p className="text-lg md:text-xl mb-8 opacity-90">{subtitle}</p>
        <a
          href={ctaLink}
          className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-xl transition-all"
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
}
```

---

### 2. Navigation Bar

**Purpose**: Site navigation, branding, actions

#### Tailwind CSS (Responsive)
```html
<nav class="bg-white shadow-sm sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <!-- Logo -->
      <div class="flex items-center">
        <a href="/" class="text-xl font-bold text-gray-900">Brand</a>
      </div>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center space-x-8">
        <a href="#" class="text-gray-600 hover:text-gray-900 transition">Features</a>
        <a href="#" class="text-gray-600 hover:text-gray-900 transition">Pricing</a>
        <a href="#" class="text-gray-600 hover:text-gray-900 transition">About</a>
        <a href="#" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Sign Up
        </a>
      </div>

      <!-- Mobile Menu Button -->
      <div class="md:hidden flex items-center">
        <button class="text-gray-600 hover:text-gray-900" id="mobile-menu-btn">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Menu -->
  <div class="md:hidden hidden" id="mobile-menu">
    <div class="px-2 pt-2 pb-3 space-y-1">
      <a href="#" class="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">Features</a>
      <a href="#" class="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">Pricing</a>
      <a href="#" class="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">About</a>
      <a href="#" class="block px-3 py-2 bg-indigo-600 text-white rounded">Sign Up</a>
    </div>
  </div>
</nav>
```

---

### 3. Card Grid

**Purpose**: Display multiple items (products, features, blog posts)

#### Tailwind CSS
```html
<section class="py-16 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold text-center mb-12">Our Features</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Card -->
      <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
        <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Lightning Fast</h3>
        <p class="text-gray-600">Optimized for speed and performance with cutting-edge technology.</p>
      </div>

      <!-- Repeat for more cards -->
    </div>
  </div>
</section>
```

#### React + Tailwind
```jsx
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function FeatureGrid({ features }) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### 4. Footer

**Purpose**: Site links, contact info, social media, legal

#### Tailwind CSS
```html
<footer class="bg-gray-900 text-gray-300">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- Brand -->
      <div class="col-span-1 md:col-span-2">
        <h3 class="text-xl font-bold text-white mb-4">Brand</h3>
        <p class="mb-4 max-w-md">Building the future of web experiences, one pixel at a time.</p>
        <div class="flex space-x-4">
          <a href="#" class="hover:text-white transition">Twitter</a>
          <a href="#" class="hover:text-white transition">GitHub</a>
          <a href="#" class="hover:text-white transition">LinkedIn</a>
        </div>
      </div>

      <!-- Links -->
      <div>
        <h4 class="text-white font-semibold mb-4">Product</h4>
        <ul class="space-y-2">
          <li><a href="#" class="hover:text-white transition">Features</a></li>
          <li><a href="#" class="hover:text-white transition">Pricing</a></li>
          <li><a href="#" class="hover:text-white transition">API</a></li>
        </ul>
      </div>

      <div>
        <h4 class="text-white font-semibold mb-4">Company</h4>
        <ul class="space-y-2">
          <li><a href="#" class="hover:text-white transition">About</a></li>
          <li><a href="#" class="hover:text-white transition">Blog</a></li>
          <li><a href="#" class="hover:text-white transition">Contact</a></li>
        </ul>
      </div>
    </div>

    <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
      <p>&copy; 2024 Brand. All rights reserved.</p>
    </div>
  </div>
</footer>
```

---

## Component Patterns

### Buttons

```html
<!-- Primary -->
<button class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium">
  Primary Button
</button>

<!-- Secondary -->
<button class="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition font-medium">
  Secondary Button
</button>

<!-- Ghost -->
<button class="px-6 py-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition font-medium">
  Ghost Button
</button>
```

### Form Input

```html
<div class="space-y-2">
  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
  <input
    type="email"
    id="email"
    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
    placeholder="you@example.com"
  />
</div>
```

### Alert/Banner

```html
<!-- Success -->
<div class="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
  <p class="font-medium">Success!</p>
  <p class="text-sm">Your changes have been saved.</p>
</div>

<!-- Error -->
<div class="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
  <p class="font-medium">Error</p>
  <p class="text-sm">Something went wrong. Please try again.</p>
</div>
```

---

## Quick Reference

| Pattern | Use For | Key Classes (Tailwind) |
|---------|---------|------------------------|
| Hero | Landing page header | `min-h-screen flex items-center justify-center` |
| Card | Content containers | `bg-white rounded-xl shadow-sm p-6` |
| Grid | Multiple items layout | `grid grid-cols-1 md:grid-cols-3 gap-8` |
| Container | Center content | `max-w-7xl mx-auto px-4` |
| Button Primary | Main actions | `bg-indigo-600 text-white rounded-lg` |
| Input | Form fields | `border rounded-lg focus:ring-2` |

---

## Best Practices

1. **Use CSS Custom Properties** for consistent theming
2. **Always include hover/focus states** for interactive elements
3. **Use `clamp()` for fluid typography**
4. **Prefer Flexbox for 1D layouts, Grid for 2D layouts**
5. **Add `transition` for smooth state changes**
6. **Use semantic HTML elements** (section, nav, main, article)
