---
name: SEO Optimization
description: SEO best practices and implementation for web pages. Use when optimizing HTML structure for search engines, adding meta tags, implementing structured data, improving Core Web Vitals, or ensuring proper heading hierarchy.
version: 1.0.0
---

# SEO Optimization for Web Design

## Overview

This skill provides SEO implementation patterns for HTML structure, meta tags, structured data, and performance optimization.

---

## HTML Structure for SEO

### Semantic HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Primary Meta Tags -->
  <title>Page Title - Brand Name | Primary Keyword</title>
  <meta name="title" content="Page Title - Brand Name | Primary Keyword">
  <meta name="description" content="Compelling description under 160 characters that includes target keywords and encourages clicks.">
  <meta name="keywords" content="keyword1, keyword2, keyword3">
  <meta name="author" content="Brand Name">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://example.com/page">
  <meta property="og:title" content="Page Title - Brand Name">
  <meta property="og:description" content="Compelling description for social sharing.">
  <meta property="og:image" content="https://example.com/og-image.jpg">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://example.com/page">
  <meta property="twitter:title" content="Page Title - Brand Name">
  <meta property="twitter:description" content="Compelling description for Twitter.">
  <meta property="twitter:image" content="https://example.com/twitter-image.jpg">

  <!-- Canonical URL -->
  <link rel="canonical" href="https://example.com/page">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- Preconnect to external domains -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>

<body>
  <header>
    <nav aria-label="Main navigation">
      <!-- Logo + Navigation -->
    </nav>
  </header>

  <main>
    <article>
      <h1>Primary Page Heading (Only One H1)</h1>

      <section>
        <h2>Section Heading</h2>
        <p>Content...</p>

        <h3>Subsection Heading</h3>
        <p>Content...</p>
      </section>
    </article>
  </main>

  <footer>
    <!-- Footer content -->
  </footer>
</body>
</html>
```

---

## Heading Hierarchy

### Rules
1. **Only ONE `<h1>`** per page (main topic)
2. **Don't skip levels** (h1 → h2 → h3, not h1 → h3)
3. **Use headings for structure**, not styling
4. **Include keywords** naturally in headings

### Example Structure
```
h1: Complete Guide to Web Design in 2024
├── h2: Why Web Design Matters
│   ├── h3: User Experience Impact
│   └── h3: Business Benefits
├── h2: Essential Design Principles
│   ├── h3: Visual Hierarchy
│   ├── h3: Color Theory
│   └── h3: Typography
└── h2: Tools and Technologies
    ├── h3: Design Tools
    └── h3: Development Frameworks
```

---

## Structured Data (JSON-LD)

### Organization
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://twitter.com/company",
    "https://linkedin.com/company/company",
    "https://github.com/company"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-xxx-xxx-xxxx",
    "contactType": "customer service"
  }
}
</script>
```

### Website with Search
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Site Name",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://example.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```

### Breadcrumb
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Products",
      "item": "https://example.com/products"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Product Name",
      "item": "https://example.com/products/product-name"
    }
  ]
}
</script>
```

### Article/Blog Post
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title Here",
  "description": "Brief article description",
  "image": "https://example.com/article-image.jpg",
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-20",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Site Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  }
}
</script>
```

### Product
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "image": "https://example.com/product.jpg",
  "description": "Product description",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "offers": {
    "@type": "Offer",
    "price": "99.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "24"
  }
}
</script>
```

---

## Image Optimization

### Best Practices

```html
<!-- Always include alt text -->
<img
  src="hero-image.webp"
  alt="Descriptive text about the image content"
  width="1200"
  height="630"
  loading="lazy"
>

<!-- Responsive images -->
<picture>
  <source
    media="(min-width: 1024px)"
    srcset="hero-large.webp 1x, hero-large@2x.webp 2x"
    type="image/webp"
  >
  <source
    media="(min-width: 640px)"
    srcset="hero-medium.webp"
    type="image/webp"
  >
  <img
    src="hero-small.jpg"
    alt="Hero image description"
    loading="lazy"
    decoding="async"
  >
</picture>

<!-- Above-the-fold images: eager loading -->
<img
  src="logo.svg"
  alt="Company Logo"
  loading="eager"
  fetchpriority="high"
>
```

### Image Checklist
- [ ] Use descriptive file names (`blue-running-shoes.webp` not `img001.webp`)
- [ ] Include alt text (describe content, not "image of...")
- [ ] Specify width and height (prevents layout shift)
- [ ] Use WebP format with JPEG fallback
- [ ] Lazy load below-the-fold images
- [ ] Compress images (aim for <100KB)

---

## Performance for SEO (Core Web Vitals)

### Critical CSS Inlining
```html
<head>
  <!-- Inline critical CSS for above-the-fold content -->
  <style>
    /* Only styles needed for initial render */
    body { margin: 0; font-family: system-ui, sans-serif; }
    .hero { min-height: 100vh; display: flex; align-items: center; }
    .nav { position: sticky; top: 0; background: white; }
  </style>

  <!-- Defer non-critical CSS -->
  <link rel="preload" href="/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/styles.css"></noscript>
</head>
```

### Font Loading
```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- Use font-display: swap -->
  <style>
    @font-face {
      font-family: 'Custom Font';
      src: url('/fonts/custom.woff2') format('woff2');
      font-display: swap;
    }
  </style>
</head>
```

### Script Loading
```html
<!-- Defer non-critical scripts -->
<script src="/analytics.js" defer></script>

<!-- Async for independent scripts -->
<script src="/widget.js" async></script>

<!-- Module scripts are deferred by default -->
<script type="module" src="/app.js"></script>
```

---

## Quick SEO Checklist

### Technical
- [ ] Valid HTML5 structure
- [ ] Mobile-responsive design
- [ ] HTTPS enabled
- [ ] Fast load time (<3s)
- [ ] No broken links
- [ ] XML sitemap
- [ ] robots.txt configured

### On-Page
- [ ] Unique, descriptive title (<60 chars)
- [ ] Meta description (<160 chars)
- [ ] One H1 tag with primary keyword
- [ ] Proper heading hierarchy
- [ ] Alt text on all images
- [ ] Internal linking
- [ ] Canonical URL set

### Structured Data
- [ ] Organization schema on homepage
- [ ] Breadcrumb schema
- [ ] Article schema for blog posts
- [ ] Product schema for e-commerce
- [ ] FAQ schema where applicable

### Performance
- [ ] Images optimized and lazy-loaded
- [ ] CSS/JS minified
- [ ] Critical CSS inlined
- [ ] Fonts optimized (display: swap)
- [ ] Caching headers configured

---

## React SEO with react-helmet

```jsx
import { Helmet } from 'react-helmet-async';

function SEO({ title, description, image, url }) {
  const siteTitle = 'Brand Name';
  const fullTitle = `${title} | ${siteTitle}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}

// Usage
<SEO
  title="About Us"
  description="Learn about our company and mission."
  image="https://example.com/about-og.jpg"
  url="https://example.com/about"
/>
```
