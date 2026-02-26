# Palette

Generate color palette suggestions for web design

## What This Command Does

Creates harmonious, accessible color palettes based on user requirements or a base color.

## Steps

1. **Understand Requirements**
   Ask the user:
   - Do you have a specific color in mind? (hex code or color name)
   - What is the mood/feeling? (professional, playful, elegant, etc.)
   - What industry/purpose? (tech, healthcare, food, etc.)

2. **Generate Palettes**
   Based on inputs, create 3 different palette options:

   For each palette, provide:
   - Primary color (main brand color)
   - Secondary color (supporting color)
   - Accent color (for CTAs, highlights)
   - Background color
   - Text color
   - Muted text color
   - Border color
   - Success, warning, error colors

3. **Show Visual Preview**
   For each palette, output:
   ```
   Palette 1: [Name/Description]
   ────────────────────────────
   Primary:    #XXXXXX  ████████
   Secondary:  #XXXXXX  ████████
   Accent:     #XXXXXX  ████████
   Background: #XXXXXX  ████████
   Text:       #XXXXXX  ████████
   ```

4. **Provide CSS Variables**
   Output ready-to-use CSS:
   ```css
   :root {
     --color-primary: #XXXXXX;
     --color-secondary: #XXXXXX;
     /* ... */
   }
   ```

5. **Provide Tailwind Config**
   If using Tailwind, output config:
   ```javascript
   // tailwind.config.js colors
   colors: {
     primary: { ... },
     secondary: { ... },
   }
   ```

6. **Accessibility Check**
   Verify and report:
   - Text on background contrast ratio
   - Primary button accessibility
   - Link visibility

## Output

3 color palette options with:
- Visual representation
- CSS custom properties
- Tailwind config (if applicable)
- Accessibility report for each

Let the user choose their preferred palette or request adjustments.
