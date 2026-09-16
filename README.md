# hiking-passport-website

The website for Hiking Passport, built with [Astro](https://astro.build) and deployed to GitHub Pages.
It is set up the same way as lillyseay-website.

The hero is the app's passport canvas, ported from `PassportSilhouetteCanvasView.swift` to a web
canvas in `src/scripts/passport.ts`. Themes, the sky clock, stamps, the trail, milestone signs and
the camp all follow the Swift code, so when the scene changes in the app, port the change here too.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```

## Where things live

- `src/data/site.ts`: every word on the page, and the hikes and milestones drawn in the hero
- `src/scripts/passport.ts`: the passport scene renderer
- `src/components/PassportHero.astro`: the hero, its stamp and sign buttons, and the theme dock
- `public/`: fonts (National Park), decor sprites, buddy art, theme icons and screenshots, copied
  from the iOS repo's asset catalog

## Deploy

Deployment is automatic. `.github/workflows/deploy.yml` builds and publishes the
site on every push to `main`.

One-time setup on GitHub:

1. Create a repository and push this project to its `main` branch.
2. In the repo go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Add the custom domain from `public/CNAME` and point its DNS at GitHub Pages.
4. Push (or run the workflow from the **Actions** tab). The site URL appears in the
   workflow summary.

Always prefix internal links and asset paths with `import.meta.env.BASE_URL` (see `src/layouts/Layout.astro`)
so links work if the site is ever served from a subpath.
