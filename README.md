# Frontend Mentor - Entertainment web app solution

This is a solution to the [Entertainment web app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/entertainment-web-app-J-UhgAW1X). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Navigate between Home, Movies, TV Series, and Bookmarked Shows pages
- Add/Remove bookmarks from all movies and TV series
- Search for relevant shows on all pages
- **Bonus**: Build this project as a full-stack application
- **Bonus**: Authentication flow with sign-up and login screens

### Screenshot

![](./screenshot.jpg)

### Links

- Solution URL: [https://github.com/soewaiyanag/entertainment-web-app](https://github.com/soewaiyanag/entertainment-web-app)
- Live Site URL: [Add live site URL here](https://your-live-site-url.com)

## My process

### Built with

- Mobile-first workflow
- Semantic HTML5 markup
- Flexbox and CSS Grid
- [Next.js 16](https://nextjs.org/) - React framework (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) - Client-side state management
- [Auth.js v5](https://authjs.dev/) - Authentication (credentials provider)
- [Prisma 7](https://www.prisma.io/) - ORM
- [Neon](https://neon.tech/) - Serverless PostgreSQL database
- [Vercel](https://vercel.com/) - Deployment

### What I learned

This project was a great opportunity to work with the Next.js App Router end-to-end. A few key things I picked up:

**Server Actions for mutations** — instead of building API routes, I used server actions directly for auth (login, signup, logout) and bookmark toggling. This keeps the data-fetching logic close to the UI with much less boilerplate.

**Optimistic UI with Zustand** — bookmarks update instantly in the UI via Zustand, while the server action persists to the database in the background. This makes the app feel snappy without waiting for a round-trip.

**Prisma 7 with Neon driver adapter** — Prisma 7 no longer accepts a connection URL directly in the schema. Instead it requires a driver adapter at runtime. For Neon serverless PostgreSQL the setup looks like:

```ts
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
```

**Inline SVGs for themeable icons** — the nav icons originally had a hardcoded fill colour in the SVG file. To support active/inactive colour states via Tailwind, I inlined the SVGs and switched to `fill="currentColor"` so the colour is driven by `text-red-500` / `text-white/50` on the parent.

### Continued development

- Add a live search debounce to avoid filtering on every keystroke
- Persist bookmarks for unauthenticated users in `localStorage`, then merge on login
- Add skeleton loaders while bookmarks are being hydrated from the database

### AI Collaboration

This project was built with the assistance of [Claude Code](https://claude.ai/claude-code) (Anthropic). Claude helped with architecture decisions, component structure, Auth.js v5 + Prisma 7 setup, and debugging — while I directed the overall approach, reviewed every change, and made the key decisions throughout.

## Author

- Frontend Mentor - [@soewaiyanag](https://www.frontendmentor.io/profile/soewaiyanag)
- GitHub - [@soewaiyanag](https://github.com/soewaiyanag)

## Acknowledgments

Challenge by [Frontend Mentor](https://www.frontendmentor.io/challenges/entertainment-web-app-J-UhgAW1X).
