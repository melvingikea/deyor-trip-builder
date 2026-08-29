# Deyor Trip Builder

A guided "Build My Trip" wizard that collects travel preferences through a 5-step flow, generates a personalized day-by-day itinerary, and lets the user download it as a designed PDF.

**Live:** [deyor-trip-builder.melvingeorge-me.workers.dev](https://deyor-trip-builder.melvingeorge-me.workers.dev)

## Tech Stack

- **Frontend:** React 19, React Router v7 (framework mode, SSR), Tailwind CSS v4, shadcn/ui-style components
- **Backend:** Cloudflare Workers (via `@cloudflare/vite-plugin`), Workers KV for itinerary storage
- **PDF:** jsPDF (client-side, dynamically built from itinerary data)
- **Testing:** Vitest (6 tests covering itinerary logic + validation)

## Setup

```bash
# Install dependencies
npm install

# Generate Cloudflare types + React Router route types
npx wrangler types
npx react-router typegen

# Start dev server
npm run dev

# Run tests
npm test

# Build + deploy
npm run deploy
```

### KV Namespace

The app uses Cloudflare Workers KV to persist itineraries (7-day TTL). In dev mode, it falls back to an in-memory Map automatically.

To create your own KV namespace:

```bash
npx wrangler kv namespace create ITINERARIES
# Update the id in wrangler.jsonc
```

## Architecture

```
app/
├── lib/
│   ├── destinations.ts   # 3 destinations with tagged activities
│   ├── itinerary.ts      # Generation logic (interest filtering, round-robin, cost calc)
│   ├── validation.ts     # Server-side input validation
│   ├── store.ts          # KV-backed store with dev fallback
│   └── cn.ts             # Tailwind merge utility
├── components/ui/        # Button, Input, Label (shadcn-style, no Radix)
├── routes/
│   ├── home.tsx          # Landing page
│   ├── build.tsx         # 5-step wizard (client state + server action)
│   └── itinerary.tsx     # Day-by-day display + PDF download
workers/
└── app.ts                # Cloudflare Worker entry point
```

**Key design decisions:**

- **React Router actions/loaders** handle all server-side logic — no separate API layer. The wizard form submits to a server action that validates, generates the itinerary, stores it in KV, and redirects.
- **Client-side state for wizard steps** — steps are managed with `useState` to avoid unnecessary round-trips, while the final submit goes through the server action.
- **No Radix UI** — stripped to avoid SSR bundling issues on Cloudflare Workers. Components use CVA (class-variance-authority) for variant styling.
- **`cloudflare:workers` module** — env bindings (KV) accessed via the official `cloudflare:workers` import, with try/catch fallback for dev.

## Itinerary Logic

Activities are distributed across days using a real algorithm (not hardcoded):

1. Filter the destination's activities to match selected interests
2. Shuffle the filtered pool for variety on each generation
3. Use a **least-recently-used (LRU) approach**: each day picks the activities that were scheduled longest ago, so consecutive days always have different combinations
4. First and last days get lighter schedules (1-2 activities); middle days get 2-3
5. Cost: `(price per night × nights × rooms) + (per-activity cost × travelers)` — activity costs vary by interest type (adventure ₹2,500, culture ₹1,500, leisure ₹1,000, attractions ₹800)

## AI Tools Used

**Tool:** Hermes Agent (Nous Research) with Claude model

**Roughly how much was AI-generated:** ~85% of the code was AI-generated, with me directing architecture decisions, reviewing output, and fixing issues.

**A specific bug the AI introduced and how I fixed it:**

The AI initially set up the Cloudflare Workers deployment with `"assets": { "directory": "./build/client" }` in `wrangler.jsonc` alongside `@cloudflare/vite-plugin`. This caused the production deploy to return 404 — the wrangler config conflicted with the plugin's own asset handling. The server build at `build/server/index.js` also lacked a `default export` with a `fetch()` handler, causing wrangler to fall back to "service-worker" format which failed on Node.js imports.

**How I found it:** `wrangler tail` showed the actual error: `"Invalid context value provided to handleRequest"` and later `"Cannot read properties of undefined (reading 'bind')"`. The deploy logs also warned about missing default export.

**How I fixed it:** I scaffolded the official Cloudflare template via `npm create cloudflare -- --framework=react-router` and compared configs. The fix was: (1) remove the `assets` field from `wrangler.jsonc` entirely — the vite plugin handles assets, (2) add a `workers/app.ts` entry with the proper `ExportedHandler` pattern, (3) use `cloudflare:workers` module for env access instead of passing context through loaders. This is a case where the AI's general knowledge of Cloudflare Workers didn't match the specific integration pattern required by `@cloudflare/vite-plugin`.

## Assumptions

- **Currency:** All prices are in INR (₹), as the destinations are India/SE Asia focused
- **Activity cost:** Flat ₹1,500 per scheduled activity (simplified estimate)
- **No auth/database:** Itineraries are stored in KV with 7-day TTL, no user accounts
- **PDF is client-side:** jsPDF generates the PDF in the browser because its ESM exports are incompatible with Cloudflare Workers' SSR bundling
- **Flexible dates:** When "flexible" is checked, departure date is optional

## Production Considerations

1. **Authentication & authorization:** Add user accounts (Cloudflare Access or OAuth) so travelers can save, revisit, and share itineraries. Currently anyone with the itinerary URL can view it.

2. **Persistent database:** Replace KV (which has a 7-day TTL and eventual consistency) with Cloudflare D1 (SQLite) or an external Postgres database. This enables querying itineraries, analytics on popular destinations, and reliable data retention.

3. **Rate limiting & abuse prevention:** Add Cloudflare rate limiting rules to the `/build` action to prevent automated form spam. Add CSRF tokens to the form. Consider Turnstile (Cloudflare's CAPTCHA alternative) on the contact form.

4. **Error tracking & observability:** Integrate Sentry or Cloudflare's built-in `tail_consumers` for error monitoring. Add structured logging for itinerary generation failures. The `observability.enabled` flag is already set in wrangler.jsonc.

5. **CI/CD pipeline:** Set up GitHub Actions to run `npm test` + `npm run build` on PRs, and auto-deploy to Cloudflare on merge to main. Add preview deployments for branches.
