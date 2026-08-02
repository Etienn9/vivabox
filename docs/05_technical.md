# Vivabox — Technical Architecture

## Overview

Clean, scalable, maintainable codebase supporting: marketing pages, product pages, checkout, and integration with the (separate) activation platform.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | React |
| Deployment | Vercel (or similar edge hosting) |

## Project Structure

```
src/
  app/          → pages & routes
  ui/           → low-level visual primitives (Button, Input, Badge, Container, Heading, Text)
  components/   → reusable composed UI (Header, Footer, Navbar, MobileMenu, Card, Carousel)
  sections/     → page sections (Hero, HowItWorks, Boxes, ExperiencesPreview, Moments, GiftIdeas, WhyVivabox, Companies, FAQ)
  features/     → business logic modules (cart, checkout, vivabox)
  data/         → static data (boxes, experiences, faq, testimonials)
  services/     → external integrations (payment providers, checkout APIs, analytics)
  utils/        → small reusable functions (formatPrice, slugify, validators)

public/
  images/ (boxes, experiences, hero) · videos/ · icons/
```

Routes example: `app/{cajas, experiencias, empresas, aliados, checkout}`

## Component Philosophy

Small · Reusable · Focused. Single responsibility per component; break up large ones. Design-system primitives (Button, Card, Input) implement the visual identity in `03_visual-identity.md`.

## Performance

- **Images:** WebP/AVIF, always set width/height, lazy-load below the fold.
- **Video:** 5–7s max, muted autoplay, loop, ~2MB max, non-blocking.
- **JS:** avoid heavy libraries; dynamic imports for carousels, video players, checkout modules.
- **Fonts:** Next.js font optimization, `swap` strategy.

## SEO & Accessibility

- Proper title tags, meta descriptions, semantic HTML, clean URLs.
- Alt text on all images; keyboard-navigable interactive elements; sufficient color contrast.

## Scalability

Architecture should flex for: additional cities, expanded experience catalog, loyalty programs, new product formats.

## Deployment

Edge-first hosting (Vercel), continuous deployment for rapid updates.

## Backend

- **Ventas (orders):** Supabase (PostgreSQL), table `ventas` — created/read/updated exclusively from Next.js API routes (`src/app/api/checkout/*`) via a service-role client (`src/services/supabase.ts`). RLS enabled with no public policies; the browser never talks to Supabase directly. Schema lives in `supabase/schema.sql`.
- **Boxes (product catalog):** stays static/local data (`src/data/boxes.ts`) — no need for a database table at this stage.

## Roadmap (post-MVP)

- Real payment provider (Wompi) instead of the current mock payment screen.
- Backend-validated promo codes / first-purchase benefit (currently mocked client-side).
