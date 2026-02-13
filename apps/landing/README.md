# Threadmark Landing Pages

Static landing pages for Threadmark, built with [Astro](https://astro.build) and deployed to [Netlify](https://www.netlify.com).

## Setup

From the repository root:

```sh
npm install
```

## Development

```sh
npm run dev --workspace=@threadmark/landing
```

The dev server starts at `http://localhost:4321`.

## Build

```sh
npm run build --workspace=@threadmark/landing
```

Output is written to `apps/landing/dist/`.

## Preview

Preview the production build locally:

```sh
npm run preview --workspace=@threadmark/landing
```

## Deployment

Deployed automatically to Netlify. Configuration is in `netlify.toml`.

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Forms:** Netlify Forms (no backend required)
