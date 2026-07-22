# Vivabox — Technical Architecture

## Overview

This document describes the technical architecture of the Vivabox website.

The goal is to maintain a clean, scalable, and maintainable codebase.

The architecture must support:

- marketing pages
- product pages
- checkout
- integration with the activation platform

The website is primarily a marketing and e-commerce interface.

The activation platform is a separate system.

---

# Technology Stack

The website is built using modern web technologies focused on performance and scalability.

Recommended stack:

Frontend framework  
Next.js

Language  
TypeScript

Styling  
Tailwind CSS

Component architecture  
React components

Deployment  
Vercel or similar edge hosting platform

---

# Project Structure

The project follows a modular architecture.

Main structure:

src/

app/  
ui/  
components/  
sections/  
features/  
data/  
services/  
utils/

public/

images/  
videos/  
icons/

This structure separates visual components, business logic, and content data.

---

# Folder Roles

## app

Contains all pages and routes.

Example structure:

app/

page.tsx  
layout.tsx

cajas/  
experiencias/  
empresas/  
aliados/  
checkout/

This folder controls the routing of the application.

---

## ui

Contains low-level visual primitives.

Examples:

Button  
Input  
Badge  
Container  
Heading  
Text

These elements are reused across the entire website.

---

## components

Reusable UI components.

Examples:

Header  
Footer  
Navbar  
MobileMenu  
Card  
Carousel

These components combine UI primitives into more complex elements.

---

## sections

Page sections used to build full pages.

Examples:

Hero  
HowItWorks  
Boxes  
ExperiencesPreview  
Moments  
GiftIdeas  
WhyVivabox  
Companies  
FAQ

Pages are composed by assembling these sections.

---

## features

Contains business logic and functional modules.

Examples:

cart  
checkout  
vivabox

Each feature can include hooks, components, and logic specific to that feature.

---

## data

Contains static data used across the site.

Examples:

boxes  
experiences  
faq  
testimonials

Data should remain separate from UI components.

---

## services

Handles communication with external services.

Examples:

payment providers  
checkout APIs  
analytics

This folder centralizes API logic.

---

## utils

Contains utility functions.

Examples:

formatPrice  
slugify  
validators

Utilities should remain small and reusable.

---

# Media Structure

All static media files are stored in the public directory.

Structure:

public/

images/  
videos/  
icons/

Images should be organized by type:

images/boxes  
images/experiences  
images/hero

---

# Component Philosophy

Components should remain:

Small  
Reusable  
Focused

Each component should have a single responsibility.

Large components should be broken into smaller subcomponents.

---

# Design System Implementation

The design system defined in the brand documentation must be implemented through reusable UI primitives.

Examples:

Button component  
Card component  
Input component

These primitives ensure visual consistency across the website.

---

# Performance Rules

Website performance is critical.

The following rules should always be respected.

## Image optimization

Images must use modern formats when possible.

Recommended formats:

WebP  
AVIF

Images should always include width and height attributes to prevent layout shifts.

---

## Lazy loading

Images and heavy components should be lazy loaded when possible.

Only above-the-fold elements should load immediately.

---

## Video optimization

Videos must be short and compressed.

Guidelines:

Maximum length: 5–7 seconds  
Muted autoplay  
Loop enabled  
Maximum size: around 2 MB

Videos should not block page rendering.

---

## JavaScript optimization

Avoid heavy libraries.

Prefer lightweight solutions.

Use dynamic imports for large components such as:

carousels  
video players  
checkout modules

---

# Font Optimization

Fonts should be loaded efficiently to prevent rendering delays.

Recommended approach:

Use Next.js font optimization.

Fonts should load with the "swap" strategy to avoid invisible text during loading.

---

# SEO Foundations

Technical SEO must be respected.

Pages should include:

- proper title tags
- meta descriptions
- semantic HTML structure
- accessible navigation

URLs should remain clean and readable.

---

# Accessibility

The website must respect accessibility principles.

Examples:

Images must include alt text.

Interactive elements must be accessible via keyboard navigation.

Color contrast must remain sufficient for readability.

---

# Scalability

The architecture must allow future growth.

Possible future additions include:

- additional cities
- expanded experience catalogue
- loyalty programs
- new product formats

The codebase should remain flexible to support these future developments.

---

# Deployment

The website should be deployed using an edge-first hosting platform.

Recommended:

Vercel

Edge deployment improves:

- loading speed
- global performance
- caching efficiency

Continuous deployment should be enabled to allow rapid updates.