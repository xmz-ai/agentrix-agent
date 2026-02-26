# New Site

Start a new website project with guided setup wizard

## What This Command Does

Guides the user through creating a new website project from scratch, collecting requirements and generating the initial project structure.

## Steps

1. **Gather Project Information**
   Ask the user:
   - What is the website for? (business type, purpose)
   - What pages are needed? (home, about, contact, etc.)
   - Any specific design preferences? (colors, style, mood)

2. **Confirm Technology Stack**
   Based on user preference, confirm:
   - Pure HTML/CSS
   - Tailwind CSS
   - React + Tailwind

3. **Suggest Color Palette**
   Based on the business type and mood, suggest 2-3 color palette options using the color-theory skill knowledge.

4. **Create Project Structure**
   Generate the appropriate project structure based on the chosen technology stack:

   For Pure HTML/CSS:
   ```
   project-name/
   ├── index.html
   ├── css/
   │   └── styles.css
   ├── js/
   │   └── main.js
   └── images/
   ```

   For Tailwind CSS:
   ```
   project-name/
   ├── index.html
   ├── package.json (with Tailwind)
   ├── tailwind.config.js
   ├── src/
   │   └── input.css
   └── images/
   ```

   For React + Tailwind:
   ```
   project-name/
   ├── index.html
   ├── package.json
   ├── vite.config.js
   ├── tailwind.config.js
   ├── postcss.config.js
   ├── src/
   │   ├── main.jsx
   │   ├── App.jsx
   │   ├── index.css
   │   └── components/
   └── public/
   ```

5. **Generate Initial Code**
   Create the base HTML structure with:
   - SEO meta tags
   - Responsive viewport
   - Basic styling with chosen color palette
   - Placeholder sections for requested pages

6. **Provide Next Steps**
   Tell the user:
   - How to run/preview the site
   - What to customize first
   - Offer to create specific sections or components

## Output

A complete project structure with initial files, ready for the user to start customizing.
