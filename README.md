# Dr. Rehab Mohamed Hassan — Medical Executive Portfolio

A production-ready, fully responsive, framework-free (vanilla HTML5/CSS3/JS)
multi-page portfolio website.

## Structure

```
dr-rehab-portfolio/
├── index.html          Hero, stat counters, clinic feature, service preview
├── about.html           Biography, career timeline, executive roles, degrees
├── services.html        Physical therapy / nutrition / hospital management audits
├── certificates.html    18 filterable certificate cards + detail modal
├── contact.html         Booking form, clinic links, location placeholder
└── assets/
    ├── css/style.css     Design tokens + all component & responsive styles
    ├── js/script.js       Nav drawer, counters, filters, modal, form validation
    └── images/            SVG logo seal, badges and portrait placeholder
```

## Deploy to GitHub Pages (no build step)

1. Create a new GitHub repository (e.g. `dr-rehab-portfolio`).
2. Push this folder's contents to the repository root (or to a `docs/` folder).
3. In the repo, go to **Settings → Pages**, set the source branch to `main`
   (root, or `/docs`), and save.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

No `npm install`, bundler, or server is required — every page loads
`assets/css/style.css` and `assets/js/script.js` directly.

## Notes for the clinic team

- **Photos:** `assets/images/avatar-placeholder.svg` is a placeholder.
  Replace the `<img>` sources in `index.html` and `about.html` with a real
  photograph (e.g. `assets/images/dr-rehab.jpg`) when available.
- **Booking form:** `contact.html` validates input in the browser but has no
  backend, so it cannot send email itself. After submitting, visitors are
  guided to finish the booking over the clinic's Facebook Page/Group. To wire
  it to a real inbox later, point the form at a form backend (e.g. Formspree)
  or a serverless endpoint and post the same field names.
- **Map:** the contact page uses a styled placeholder plus a Google Maps
  search link. Swap in a real embedded map (Google Maps iframe or Leaflet)
  once exact coordinates are available.
- **Colors/fonts:** all tokens live at the top of `assets/css/style.css`
  under `:root` — change once, apply everywhere.
