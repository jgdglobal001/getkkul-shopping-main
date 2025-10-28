# Repository Information

## Project Type
Next.js 15 (React) e-commerce application with TypeScript

## Framework & Dependencies
- **Framework**: Next.js 15+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **i18n**: react-i18next
- **Database**: Prisma (PostgreSQL)
- **Testing**: (To be determined based on existing test files)

## Target Test Framework
Playwright (for E2E tests)

## Key Files & Patterns
- **i18n Configuration**: `src/lib/i18n.ts`
- **Localization Files**: `src/locales/` (ko.json, ko-extended.json)
- **Component Patterns**:
  - Client components use "use client" directive
  - Server components are default
  - useTranslation hook must be used in client components only

## i18n Translation Structure
```
{
  "common": { ... },        // Shared UI translations
  "home": { ... },          // Homepage-specific translations  
  "offers": { ... },        // Offers page translations
  "categories": { ... },    // Category names and labels
  "footer": { ... },        // Footer content
  "product": { ... },       // Product-related text
  "cart": { ... },          // Cart UI text
  ...other namespaces...
}
```

## Recent i18n Conversions (Oct 2024)
- Added ~30+ new Korean translation keys
- Converted components:
  - SpecialOffersBanner.tsx (8+ strings)
  - OffersHero.tsx (6+ strings)
  - RoundedCategoriesCarousel.tsx (2 strings: header & description)
  - ProductSection.tsx (2 strings: "View More", empty state)
  - AddToCartButton.tsx (6 states: add, adding, added, out of stock, in cart, minimum quantity)
  - Category.tsx (special categories labels)
  - DynamicFeaturedCategories.tsx (error state)

## Development Server
- Start: `npm run dev` (runs on http://localhost:3000)
- Build: `npm run build`
- Production: `npm run start`

## Deployment
- Platform: Vercel (https://getkkul-shopping.vercel.app)
- Auto-deploys on git push to main

## Known Constraints
- Server components cannot use useTranslation hook
- i18n translations require Next.js rebuild to take full effect in production
- Korean language merges ko.json + ko-extended.json files via i18n config