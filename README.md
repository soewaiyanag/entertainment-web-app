# Frontend Mentor - Entertainment Web App

A full-stack solution to the [Entertainment Web App challenge](https://www.frontendmentor.io/challenges/entertainment-web-app-J-UhgAW1X) on Frontend Mentor, taken beyond the original brief: instead of the static mock dataset, the app is backed by real movie and TV data from [The Movie Database (TMDb)](https://www.themoviedb.org/) API, with authentication, per-user bookmarks, and a detail page for every title.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [Features](#features)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Working with an AI assistant](#working-with-an-ai-assistant)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Navigate between Home, Movies, TV Series, and Bookmarked Shows pages
- Add/remove bookmarks from all movies and TV series
- Search for relevant shows on all pages
- **Bonus**: Build this project as a full-stack application
- **Bonus**: Authentication flow with sign-up and login screens

### Screenshot

![](./screenshot.jpg)

### Links

- Solution URL: [https://github.com/soewaiyanag/entertainment-web-app](https://github.com/soewaiyanag/entertainment-web-app)
- Live Site URL: [https://entertainment-web-app-soewaiyanag.vercel.app/](https://entertainment-web-app-soewaiyanag.vercel.app/)

## Features

Beyond the base challenge requirements, this build includes:

- **Live movie and TV data** from the TMDb API — trending titles, popular movies/TV series, and full-text search — in place of the original static JSON fixture
- **Title detail pages** with a full hero backdrop, cast, genres, rating, and runtime/season count
- **Authentication** (email/password via Auth.js) with per-user bookmarks persisted in Postgres
- **Load More pagination** on the Movies and TV Series pages
- A responsive, accessible UI matching the Frontend Mentor design across mobile, tablet, and desktop

## My process

### Built with

**Frontend**

- Next.js 16 (App Router, Server Components & Server Actions)
- TypeScript
- Tailwind CSS v4
- Zustand for optimistic client-side state
- Mobile-first, semantic HTML5, Flexbox and CSS Grid

**Backend & data**

- [Auth.js v5](https://authjs.dev/) — authentication (credentials provider)
- [Prisma 7](https://www.prisma.io/) with the Neon serverless driver adapter
- [Neon](https://neon.tech/) — serverless PostgreSQL
- [TMDb API](https://www.themoviedb.org/documentation/api) — movie and TV data source

**Deployment**

- [Vercel](https://vercel.com/)

### What I learned

**Server Actions for mutations** — instead of building API routes, I used server actions directly for auth (login, signup, logout), bookmark toggling, and search. This keeps data-fetching logic close to the UI with much less boilerplate.

**A composite slug avoided a schema migration** — TMDb identifies titles by a numeric ID, but movie and TV IDs live in separate namespaces (the same number can be both a movie and a show). Rather than add a `mediaType` column to the bookmarks table, bookmarks store a `"movie-<id>"` / `"tv-<id>"` slug, keeping lookups unambiguous with no migration required.

**The Next.js client Router Cache can serve genuinely stale data** — the persistent nav's Bookmarks link gets auto-prefetched as soon as any page loads, capturing an empty "no bookmarks yet" snapshot before the user bookmarks anything. Clicking the link later served that stale snapshot instead of a fresh navigation. Fixed by disabling `staleTimes` for dynamic routes — a good reminder that "it re-rendered correctly on refresh" doesn't rule out a caching bug.

**`object-fit` fights flexbox stretch** — a poster image using `object-contain` inside a fixed-aspect-ratio box looked fine in isolation, but broke once that box sat in a `flex-row` next to a taller sibling: flexbox's default `align-items: stretch` overrode the box's intended height, and the "centered" image ended up pinned to one edge. Confirmed with a real screenshot rather than trusting the markup, then removed the layout that caused it.

**Prisma 7 with the Neon driver adapter** — Prisma 7 no longer accepts a connection URL directly in the schema; it requires a driver adapter at runtime:

```ts
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
```

**Inline SVGs for themeable icons** — the nav icons originally had a hardcoded fill colour in the SVG file. To support active/inactive colour states via Tailwind, I inlined the SVGs and switched to `fill="currentColor"`, so colour is driven by `text-red-500` / `text-white/50` on the parent.

### Continued development

- A genre-based recommendation system: capture preferred genres at sign-up, weight them further by bookmark activity, and surface results via TMDb's discover/similar endpoints
- Pagination for search results (currently single-page; Movies/TV Series browsing already supports Load More)
- Persist bookmarks for unauthenticated visitors in `localStorage`, then merge on login
- An in-app TMDb attribution notice, as required by their [terms of use](https://www.themoviedb.org/documentation/api/terms-of-use)

### Working with an AI assistant

Parts of this project were built with the help of an AI assistant (Claude Code), while I directed the architecture, product decisions, and review.

## Author

- Frontend Mentor - [@soewaiyanag](https://www.frontendmentor.io/profile/soewaiyanag)
- GitHub - [@soewaiyanag](https://github.com/soewaiyanag)

## Acknowledgments

Challenge by [Frontend Mentor](https://www.frontendmentor.io/challenges/entertainment-web-app-J-UhgAW1X). Movie and TV data provided by [TMDb](https://www.themoviedb.org/) — this product uses the TMDb API but is not endorsed or certified by TMDb.
