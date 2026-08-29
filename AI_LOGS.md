# AI Activity Log

## Tool Used
Hermes Agent (Nous Research) with Claude model via Copilot provider

## Key Course Correction by Me

The AI spent significant time trying to manually wire up the Cloudflare Workers deployment — writing custom `wrangler.jsonc` configs with `"assets"` fields, creating hand-rolled `worker-entry.js` wrappers, trying different `createRequestHandler` imports (`react-router` vs `@react-router/cloudflare`), and debugging a chain of 404 → 500 → "Invalid context" → "Cannot read properties of undefined (reading 'bind')" errors across multiple deploy attempts.

After watching it go back and forth for a while, I stepped in and told it to just use the official scaffold command:

```
npm create cloudflare@latest -- my-react-router-app --framework=react-router
```

This generated the correct reference project in seconds. The AI then compared its broken config against the working template and found three things it had wrong:

1. **`assets` field in `wrangler.jsonc`** — the official template doesn't have one; `@cloudflare/vite-plugin` handles assets internally
2. **Missing `workers/app.ts` entry** — the official template has a thin `ExportedHandler` wrapper that the plugin bundles into the final worker
3. **Env access pattern** — should use `import { env } from "cloudflare:workers"` instead of passing context through loaders

The takeaway: when integrating with an opinionated framework plugin, start from the official template instead of trying to reverse-engineer the config from docs and error messages. The AI's general Cloudflare Workers knowledge was accurate but didn't match the specific integration contract that `@cloudflare/vite-plugin` expects.

## Session Timeline

### 1. Project Scaffolding
- Scaffolded React Router v7 project using `create-react-router` default template
- Manually converted to Cloudflare Workers target (default template doesn't include CF setup)
- Installed: `@cloudflare/vite-plugin`, `wrangler`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `jspdf`, `vitest`
- Removed: `@react-router/node`, `@react-router/serve` (Node.js-specific, not needed for Workers)

### 2. UI Components & Design System
- Created shadcn/ui-style components (Button, Input, Label) using CVA for variants
- Initially included `@radix-ui/react-slot` and `@radix-ui/react-label` — **removed** because they caused SSR bundling failures on Cloudflare Workers
- Applied Resend-style minimalistic design: neutral palette, generous whitespace, clean typography

### 3. Core Logic Implementation
- `destinations.ts`: 5 destinations (Bali, Coorg, Goa, Manali, Jaipur) with tagged activities
- `itinerary.ts`: Generation algorithm with interest filtering, round-robin distribution, anti-repetition, cost calculation
- `validation.ts`: Server-side validation for all wizard inputs
- `store.ts`: KV-backed persistence with in-memory dev fallback

### 4. Wizard UI (build.tsx)
- 5-step wizard with client-side step state and hidden form fields
- Steps: Trip Basics → Travelers & Rooms → Interests → Duration & Dates → Review & Generate
- Progress indicator, back/next navigation, sensible defaults
- Server action validates input, generates itinerary, stores in KV, redirects to result

### 5. Itinerary Display & PDF (itinerary.tsx)
- Day-by-day itinerary view with cost breakdown
- Client-side PDF generation using jsPDF (dynamically imported)
- PDF includes: cover section, trip details, day-by-day breakdown, cost summary

### 6. Tests
- 6 Vitest tests covering: interest filtering, no empty days, cost calculation, anti-repetition, validation accept/reject

## Bugs Encountered & Fixed

### Bug 1: jsPDF SSR Build Failure
- **What happened:** `npx react-router build` failed with `"." is not exported under conditions ["module-sync"...]` when jsPDF was imported in a server-side route
- **Root cause:** jsPDF's ESM exports are incompatible with Cloudflare Workers' SSR bundling
- **Fix:** Moved PDF generation to client-side with `import("jspdf")` dynamic import on button click

### Bug 2: Radix UI SSR Bundling
- **What happened:** Build failed with `failed to resolve import "@radix-ui/react-slot"`
- **Root cause:** Radix UI packages have SSR-incompatible module resolution for Workers
- **Fix:** Removed all Radix UI dependencies; wrote plain HTML components with CVA styling

### Bug 3: Context Undefined in Dev
- **What happened:** `TypeError: Cannot read properties of undefined (reading 'env')` when accessing `context.cloudflare.env.ITINERARIES`
- **Root cause:** `context.cloudflare` is undefined in `react-router dev` (only available in wrangler dev)
- **Fix:** Added try/catch fallback to in-memory Map store when KV is unavailable

### Bug 4: Production Deploy 404/500 (Major)
- **What happened:** Deployed worker returned 404, then after fixes returned 500 with various errors
- **Root cause:** Multiple issues:
  1. `"assets": { "directory": "./build/client" }` in wrangler.jsonc conflicted with `@cloudflare/vite-plugin`'s own asset handling
  2. `build/server/index.js` (React Router SSR build) has no `default export` with `fetch()` — wrangler fell back to "service-worker" format which failed on Node.js imports
  3. Using `createRequestHandler` from wrong package (`react-router` vs `@react-router/cloudflare`)
- **How found:** `wrangler tail --format json` showed the actual error messages
- **Fix:** Scaffolded official Cloudflare template via `npm create cloudflare -- --framework=react-router`, compared configs, and adopted the correct pattern:
  - Removed `assets` field from wrangler.jsonc (plugin handles it)
  - Added `workers/app.ts` with proper `ExportedHandler` pattern
  - Used `cloudflare:workers` module for env access
  - Set `main: "./workers/app.ts"` in wrangler.jsonc

### Bug 5: Dropbox Sync Conflicts
- **What happened:** `.react-router/types` directory caused ENOTEMPTY/ENOTDIR errors during dev server restarts
- **Root cause:** Dropbox syncing the generated types directory caused file conflicts
- **Fix:** `rm -rf .react-router` before restarting dev server; added to .gitignore

### Bug 6: Path Alias Resolution
- **What happened:** `Cannot find module '~/components/ui/button'` at runtime
- **Root cause:** Missing `tsconfigPaths` in vite.config.ts `resolve` option
- **Fix:** Added `resolve: { tsconfigPaths: true }` to vite config
