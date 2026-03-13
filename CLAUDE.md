# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow Orchestration
### 1. Plan Node Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity
Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One tack per subagent for focused execution
### 3. Self-Improvement Loop
- After ANY correction from the user: update "tasks/lessons.md" with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project
### 4. Verification
Before
Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness
### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it
### 6. Autonomous Bug Fizing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how
## Task Management
1. **Plan First**: Write plan to "tasks/todo.md" with checkable items
2. **Verify Plan**: Check in before starting implementation
**Track Progress**: Mark items complete as you go
**Explain Changes**: High-level summary at each step
**Document Results**: Add review section to
**Capture Lessons**: Update 'tasks/lessons. md after corrections
## Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimat Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

## Project Overview

Weather Wizard is a Next.js 15 roofing company website with area-specific landing pages for 23 locations across Kent. The site uses static site generation (SSG) to pre-render all area pages at build time for optimal SEO and performance.

**Production URL:** https://www.weatherwizardroofing.co.uk/

**Key Technologies:**
- Next.js 16 (App Router with TypeScript)
- Tailwind CSS (custom navy/teal/gold brand palette)
- shadcn/ui components
- Lucide React icons
- Replicate API for AI image generation (optional)

## Development Commands

```bash
# Development server (runs on http://localhost:3000)
cd weather-wizard-site
npm run dev

# Production build (generates static pages: 1 main + 23 area pages + system pages)
npm run build

# Start production server (after build)
npm start

# Lint the codebase
npm run lint
```

## Architecture & Key Concepts

### Area-Based Pages System

The core feature is **dynamic area-specific pages** for local SEO. The system:

1. **Source of Truth**: `areas.md` (root) - Simple list of 23 area names
2. **Data Layer**: `weather-wizard-site/lib/areas.ts` - Enriched area data with coordinates, postcodes, landmarks, and utilities
3. **Content Templates**: `weather-wizard-site/lib/content/area-content.ts` - Generates area-specific headlines and descriptions
4. **Dynamic Route**: `weather-wizard-site/app/[area]/page.tsx` - Template for all area pages using `generateStaticParams()`
5. **Area Components**: `weather-wizard-site/components/area/` - Reusable components that accept area data as props

**Static Generation Process:**
- At build time, Next.js calls `generateStaticParams()` in `app/[area]/page.tsx`
- This generates 23 static HTML pages (one per area in `areas.ts`)
- Each page has unique metadata, URLs like `/{area-slug}`, and area-specific content
- The main page (`/`) links to all area pages in the service areas section

### File Structure

```
weather-wizard-site/
├── app/
│   ├── [area]/page.tsx       - Dynamic route for all 23 area pages
│   ├── page.tsx              - Main landing page (Kent-wide)
│   ├── layout.tsx            - Root layout with metadata and structured data
│   └── globals.css           - Global styles with Tailwind directives
├── components/
│   ├── area/                 - Area-specific components
│   │   ├── area-hero.tsx
│   │   ├── area-trust-signals.tsx
│   │   ├── area-services.tsx
│   │   └── area-local-info.tsx
│   ├── hero-section.tsx
│   ├── services-section.tsx
│   ├── testimonials-section.tsx
│   ├── cta-section.tsx
│   ├── footer.tsx
│   ├── trust-signals.tsx
│   └── ui/                   - shadcn/ui components
├── lib/
│   ├── areas.ts              - Area data structure and utilities
│   ├── content/
│   │   └── area-content.ts   - Content template functions
│   ├── generate-images.ts    - AI image generation script (Replicate)
│   └── utils.ts              - Utility functions (cn helper)
└── public/
    ├── images/               - Generated service images
    └── weather-wizard-logo-no-bg.png
```

### Design System

**Brand Colors** (defined in `tailwind.config.ts`):
- Navy: `#1a2e42` - Primary brand color (header, sections, text)
- Gold: `#d4af37` - Accent color (CTAs, highlights, trust signals)
- Teal: `#5ba8a0` - Secondary accent (emergency badges, links)

**Typography:**
- Body: Inter (loaded via Next.js font optimization)
- Headers/Branding: Cinzel (Google Font, weight 700)

**Component Library:**
- Uses shadcn/ui components (Button, Separator, etc.)
- Located in `components/ui/`
- Styled with Tailwind using `class-variance-authority`

### SEO & Structured Data

Every page includes JSON-LD structured data:
- `LocalBusiness` schema with address and services
- `GeoCircle` with service radius
- `AggregateRating` (4.9 stars, 127 reviews)
- `OfferCatalog` listing all services

**Meta Tags:**
- Unique titles/descriptions per area
- OpenGraph tags for social sharing
- Keywords array for each area
- Robots directives for search engines

### Image Generation

`lib/generate-images.ts` uses Replicate API to generate service images:
- **Do not run in production** - this is a one-time setup script
- Generates 6 images: hero, roof-repairs, guttering, chimney, flat-roofing, fascias-soffits
- Images saved to `public/images/`
- Uses Google's "nano-banana-pro" model

### Deployment

- **Hosting:** Vercel (auto-deploys from `main` branch)
- **Production URL:** https://www.weatherwizardroofing.co.uk/
- **Git remote:** `https://github.com/LaneConsultancy/weather-wizard.git`

### Google Ads Campaign Management

Scripts in `weather-wizard-site/scripts/`:

```bash
# OAuth & connection
npm run get-google-ads-token        # Browser OAuth flow for refresh token

# Campaign diagnostics
npm run ads-check                   # 14-day campaign performance overview
npm run ads-deep-check              # Ad groups, approvals, keywords, quality scores

# Search term analysis
npm run ads-search-terms            # Top search terms, ad approvals, impression share

# Offline conversion imports (also automated via CF Worker cron)
npm run import-conversions          # Tally form submissions → Google Ads click conversions
npm run import-call-conversions     # Phone clicks matched to Twilio calls → click conversions
```

**Required environment variables** (in `weather-wizard-site/.env.local`):
- `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_DEVELOPER_TOKEN`
- `GOOGLE_ADS_CUSTOMER_ID` (6652965980), `GOOGLE_ADS_LOGIN_CUSTOMER_ID` (5151905694 — MCC)
- `GOOGLE_ADS_REFRESH_TOKEN`
- `GOOGLE_ADS_OFFLINE_CALL_CONVERSION_ACTION` (type UPLOAD_CALLS for Twilio)
- `GOOGLE_ADS_TALLY_CLICK_CONVERSION_ACTION` (type UPLOAD_CLICKS for forms + phone clicks)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- `TALLY_API_KEY`
- `WHATCONVERTS_API_TOKEN`, `WHATCONVERTS_API_SECRET`

### Offline Conversion Tracking

Google Consent Mode v2 blocks ~90% of conversion tracking (cookie banner defaults to denied). To give smart bidding real conversion data, offline conversions are imported:

**Tally form submissions (gclid-based):**
- Tally hidden fields capture `gclid` from URL params (`url_passthrough: true`)
- Forms: `VL5e5l` (landing page), `npqGpV` (original quote)
- Script: `scripts/import-tally-conversions.ts` — value £50/lead

**Phone call conversions (gclid-based):**
- `lib/gclid-store.ts` captures gclid from URL into sessionStorage on page load
- `components/phone-link.tsx` sends gclid via `sendBeacon` to CF Worker on phone click
- CF Worker stores click in KV, then matches to Twilio call logs by timing (within 5 min)
- Script: `scripts/import-call-conversions.ts` — value £75/call

**Cloudflare Worker: `ww-conversion-importer`**
- URL: `https://ww-conversion-importer.georgejlane.workers.dev`
- Cron: every 6 hours (`0 */6 * * *`)
- Handles both Tally and phone call conversion imports automatically
- KV namespaces: `WW_PHONE_CLICKS` (click storage), `WW_CONVERSION_DEDUP` (dedup)
- `POST /phone-click` — stores phone click events with gclids
- `GET /status` — last cron run summary

**Note:** The `google-ads-api` npm package (gRPC) works for uploads from local scripts. The CF Worker uses the Google Ads REST API v22 instead (gRPC unavailable in Workers). REST supports `uploadClickConversions` but NOT `uploadCallConversions` (returns 501).

## Working with Areas

### Adding a New Area

1. Add area name to `areas.md`
2. Add area object to `areasData` array in `lib/areas.ts` with:
   - slug (lowercase, hyphenated)
   - name, displayName, county
   - coordinates (lat/lng)
   - postcodes array
   - nearbyAreas array
   - localLandmarks (optional)
   - population (optional)
3. Run `npm run build` - new area page will be generated automatically

### Modifying Area Content

Area-specific content is generated by functions in `lib/content/area-content.ts`:
- `getAreaHeroContent()` - Hero headline and subheadline
- `getAreaTrustSignals()` - Statistics (homes protected, reviews, etc.)
- `getAreaServiceDescription()` - Service area text
- `getAreaSEOKeywords()` - Keywords for metadata

### Area Components

Components in `components/area/` accept `Area` interface from `lib/areas.ts`:
- They mirror main page components but with area-specific customization
- Use same styling and layout for consistency
- CTAs and headlines reference the specific area name

## Key Implementation Details

### Static Generation

The site uses Next.js App Router's static generation:
```typescript
// In app/[area]/page.tsx
export async function generateStaticParams() {
  return getAllAreaSlugs().map((slug) => ({ area: slug }));
}
```

This pre-renders all 23 area pages at build time, resulting in:
- Fast page loads (static HTML)
- Excellent SEO (fully rendered content)
- No server-side rendering needed
- Build output: ~114 kB First Load JS per page

### Route Structure

- `/` - Main landing page (Kent-wide services)
- `/[area]` - Dynamic area pages (e.g., `/dartford`, `/maidstone`)
- Area slugs are URL-safe (lowercase, hyphenated)
- Main page links to area pages in service areas section

## Development Notes

- **Credentials**: All API keys/secrets are in `.env.local` (gitignored). Never commit credentials.
- **Phone Number**: Business number is `0800 316 2922` (Twilio tracking number: `+448003162922`)
- Pages are statically generated at build time. No server-side API routes (phone clicks go to the CF Worker directly).
