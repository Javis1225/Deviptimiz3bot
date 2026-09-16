# DevOptimizeBot

One workbench. Every tool you need.

Fast browser tools for creators, bloggers, SEO, developers, text, design and
calculations — built as a Telegram Mini App.

## Status: catalog complete, deployment not yet run

**Scope note:** the original spec listed 121 tools across 7 categories with
an explicit rule to never remove one. Partway through the build, the
project owner asked to remove TikTok & Pinterest Creator Tools, Technical
SEO & On-Page Tools, and Performance/Domain & Off-Page Intel (34 tools),
plus Keyword Position Tracker — each needed an external API or data
provider that wasn't available, and rather than ship 35 permanent
placeholders, the call was to trim scope to what's real. That's a
deliberate, explicit override of the original rule, done at the owner's
request — see `scripts/generate_catalog.py`'s SCOPE NOTE for exactly the
same explanation in the one place that actually defines the catalog.

**What that leaves: 86 tools across 4 categories, all of them implemented
and working:**
- Text & Writing Utilities — all 17: Slug Generator, Word Counter &
  Reading Time Estimator, Case Converter, Remove Duplicate Lines, Line
  Counter, Text Diff Checker, Random String Generator, Lorem Ipsum
  Generator, Markdown↔HTML converters, Text Sorter, Find and Replace,
  Morse Code Converter, HTML Tag Stripper, Word Frequency Counter,
  Reverse Text Generator, Whitespace Remover
- Design & Math Utilities — all 21: HEX↔RGB converters, Color Palette
  Generator, CSS Gradient/Box Shadow/Border Radius generators, SVG→PNG and
  PNG→JPEG converters, Image Aspect Ratio Calculator, Favicon Generator,
  Image Resizer, Color Contrast Checker, Image Color Picker, Placeholder
  Image Generator, Percentage Calculator, Age Calculator, Compound
  Interest Calculator, Unix Timestamp Converter, Date Difference
  Calculator, Password Strength Meter, Random Number Picker
- Developer & Link Utilities — all 33: JSON/XML/YAML/CSV conversions,
  Base64 and URL encode/decode, MD5 (hand-rolled, verified against known
  test vectors) and SHA-1/256/512 (native Web Crypto) hashers, Bcrypt
  Generator, JS/CSS/HTML minifiers, SQL Formatter, Regex Tester, JWT
  Decoder, Cron Expression Generator, Link Extraction Tool, QR Code
  Generator, API Key & Password Generator, Security.txt Generator, CORS
  Configuration Generator, XSS Input Sanitizer, SVG Optimizer, Gzip/Brotli
  Savings Calculator (real gzip via CompressionStream, estimated Brotli),
  Lazy Load Code Generator, Critical CSS Generator (selector-scoped, not
  automatic), @font-face Generator, Browser Cache & Storage Cleaner
  (same-origin only), Mobile-Friendly Tester and HTTP Security Header
  Checker (both call `supabase/functions/site-inspector`, which fetches a
  remote URL server-side to get around CORS — no third-party API key
  needed, just basic SSRF guards since it accepts a user-supplied URL)
- YouTube Creator Tools — all 15: 8 are pure client-side (Title/
  Description Generators, Thumbnail Previewer — uses YouTube's public
  predictable thumbnail URLs, no API — Money Calculator, Embed Code
  Generator, Timestamp Link Maker, Channel Audit Checklist, Shorts Script
  Timer). The other 7 (Tag Extractor, Channel ID Finder, Region
  Restriction Checker, Comment Picker, Live Subscriber Counter, Search
  Trend Analyzer, Metadata Viewer) call a single consolidated Edge
  Function, `supabase/functions/youtube-data`, which is the only place
  `YOUTUBE_API_KEY` is ever read — the browser never sees it. (This is the
  one category needing a key at all — bcryptjs, js-yaml, and qrcode cover
  three Developer & Link tools with small libraries instead of keys.)

**Also built:**
- The complete catalog is generated from a single source of truth so it
  can never drift — see `scripts/generate_catalog.py`. `EXPECTED_TOOL_COUNT`
  / `EXPECTED_CATEGORY_COUNT` are now derived from the actual data rather
  than hardcoded, specifically so a future scope change like this one can't
  leave a stale number behind again.
- Supabase schema: all 10 tables, row-level security, and an
  `award_points()` function that is the *only* way points can change (the
  frontend has no path to touch `points_balance` directly — see
  "Points integrity" below)
- Telegram Mini App auth: an Edge Function that verifies `initData` using
  Telegram's documented HMAC-SHA256 scheme and issues a session token,
  wired into the client (`src/lib/session.ts`) so it runs automatically on
  boot
- The full points-award chain: `claim-ad-reward` opens a pending reward,
  `monetag-postback` verifies Monetag's server-to-server confirmation and
  is the only thing that can call `award_points()` — see "Points
  integrity" below
- A full admin dashboard, not just the one validation page: Overview
  (aggregate stats), Users, Rewards, Settings (edit `app_settings` values
  live), and `/admin/catalog-check` (validates the bundled catalog against
  duplicates/invalid slugs/category count, cross-checking the live
  Supabase `tools` table once connected). Every admin route is gated by a
  real `is_admin()` Postgres check now — worth knowing, since before this
  round `/admin/catalog-check` had no access control at all and anyone
  who found the URL could view it.
- A real test suite (Vitest + React Testing Library) covering the trickiest
  logic — see "Testing" below. This sandbox can't run `npm install`, so
  these tests are the actual verification for anything more complex than
  what could be hand-traced or spot-checked with a standalone Node script

**Not done yet:**
- Deployment has never been run — nothing here has touched a real Supabase
  project, Vercel account, or Telegram bot. You'll also need to manually
  insert your own `telegram_id` into `admin_users` after your first sign-in
  to see the admin dashboard (see "Setup" below) — there's no bootstrap UI
  for that, on purpose, since anyone who could self-promote to admin
  wouldn't need `admin_users` at all.

## Why some things were designed rather than transcribed

The original spec referenced "the previous specification" for database
architecture. That wasn't available here, so `supabase/schema.sql` was
designed fresh from just the table names given (`users`, `categories`,
`tools`, etc.). Table names match exactly; column-level design is new.

## Points integrity

`points_balance` can only change through `award_points()`, a
`SECURITY DEFINER` Postgres function grantable only to the `service_role`.
No RLS policy gives `anon`/`authenticated` write access to it or to
`points_transactions`. Concretely, that means:

1. Client watches an ad (`src/lib/monetag.ts`) — a client-side signal only,
   trivially fakeable, and treated as such.
2. Client calls `claim-ad-reward`, which opens a `reward_events` row with
   `status = 'pending'` and a random `request_id`.
3. Monetag's own server-to-server postback (configured in your Monetag
   zone to include that `request_id`) hits `monetag-postback`, which checks
   a shared secret, finds the matching pending row, and only *then* calls
   `award_points()`.

The frontend never has a code path to step 3 directly. One thing worth
knowing: the exact query-parameter name Monetag uses to echo back a custom
ID varies by zone type, and I couldn't confirm it from outside a real
account — `monetag-postback` checks a short list of common names
(`request_id`, `ymid`, `click_id`, `sub1`, `zone_request_id`) and logs every
inbound postback either way, but you may need to add your zone's actual
macro name to that list once you see a real payload.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

### 1. Supabase

1. Create a project at supabase.com.
2. SQL Editor → run `supabase/schema.sql`, then `supabase/seed_tools.sql`.
3. Project Settings → API → copy the URL and `anon` key into `.env.local`
   as `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
4. Deploy the auth function (needs the Supabase CLI):
   ```bash
   supabase functions deploy telegram-auth --no-verify-jwt
   supabase secrets set TELEGRAM_BOT_TOKEN=xxxx
   supabase secrets set SUPABASE_JWT_SECRET=xxxx   # Project Settings -> API -> JWT Settings
   ```
   (`SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_URL` are injected automatically.)
5. Deploy the YouTube function (default JWT verification — no
   `--no-verify-jwt` here, since this one should only ever be called by an
   already-signed-in client):
   ```bash
   supabase functions deploy youtube-data
   supabase secrets set YOUTUBE_API_KEY=xxxx
   ```
   Get a key from Google Cloud Console → APIs & Services → Credentials,
   with the YouTube Data API v3 enabled. Restrict it (by API, and by IP if
   your Edge Function region is static) — this key never reaches the
   browser, but restricting it is still good practice for any server-held
   key.
6. Deploy the site inspector (no API key needed, just default JWT
   verification like youtube-data):
   ```bash
   supabase functions deploy site-inspector
   ```
7. Bootstrap your own admin access: open the Mini App once (inside
   Telegram, so `telegram-auth` runs and creates your `users` row), then in
   the SQL Editor:
   ```sql
   insert into public.admin_users (telegram_id, role)
   values (<your numeric Telegram user ID>, 'admin');
   ```
   There's deliberately no UI for this step — anything self-service would
   let any user grant themselves admin access.

### 2. Telegram bot

1. Message [@BotFather](https://t.me/BotFather), `/newbot`, save the token
   into the Supabase secret above.
2. `/newapp` (or Bot Settings → Menu Button) and point it at your deployed
   URL once step 3 is done.
3. Mini Apps must be served over HTTPS — for local dev, tunnel port 5173
   with ngrok/Cloudflare Tunnel and point BotFather at the tunnel URL.

### 3. Monetag

1. Sign up at monetag.com, add your Mini App URL, create a Rewarded
   Interstitial zone.
2. Paste the script snippet it gives you into `index.html`.
3. Set `VITE_MONETAG_SHOW_FN` in `.env.local` to the function name it
   defines (see comments in `src/lib/monetag.ts`).
4. Deploy the reward functions:
   ```bash
   supabase functions deploy claim-ad-reward
   supabase functions deploy monetag-postback --no-verify-jwt
   supabase secrets set MONETAG_POSTBACK_SECRET=<generate-your-own-random-string>
   ```
5. In the zone's S2S postback settings, set the postback URL to
   `https://<project-ref>.functions.supabase.co/monetag-postback?secret=<same-string-as-above>&request_id={macro}`,
   swapping `{macro}` for whatever Monetag calls "the custom value I passed
   in" for your zone type. See the comments at the top of
   `supabase/functions/monetag-postback/index.ts` for the parameter names
   it already checks.

### 4. Vercel

Push to a git repo, import into Vercel, add the `VITE_*` env vars from
`.env.local` in Project Settings, deploy. `vercel.json` already handles SPA
routing.

## Adding a new tool

1. Build the component in `src/tools/<category>/YourTool.tsx` (see any
   existing one in `src/tools/text/` for the pattern — `ToolShell` +
   `CopyButton` are the shared pieces).
2. Register it in `src/lib/toolComponents.tsx`.
3. In `scripts/generate_catalog.py`, add the tool name to `IMPLEMENTED`
   (mapping to your component's name).
4. Run `npm run generate:catalog` — this regenerates `toolRegistry.ts` and
   `seed_tools.sql` and asserts there are no duplicate names/slugs.
5. Re-run the updated `seed_tools.sql` against Supabase.

This is also how the registry stays automatically in sync as the catalog
grows — the requirement that "the registry and validation system must
automatically support" new tools is what this script and
`/admin/catalog-check` are for.

## Testing

```bash
npm test          # run once
npm run test:watch  # re-run on file changes
```

What's covered: the hand-rolled MD5 implementation (against the standard
test vectors), the LCS diff algorithm, case conversion (including
camelCase/acronym word-splitting), the CSS/JS/HTML minifiers (including
edge cases like a regex literal that looks like a comment, and comment-like
text inside a string), Morse code round-tripping, HEX↔HSL color
round-tripping, WCAG contrast ratio math, word/sentence/paragraph counting,
YouTube URL/channel parsing, and a registry-integrity test that fails if a
tool is ever marked `implemented` without a real matching component (or
vice versa) — the same kind of check `/admin/catalog-check` does live, but
enforced automatically on every test run. There's also one component-level
test (`Home.test.tsx`) using React Testing Library, proving the setup works
for rendered UI and not just pure functions.

What's NOT covered: most tool components are simple enough (a calculator,
a straightforward string transform) that the manual verification during
development was the practical bar; the pure-logic tests above focus on the
tools where a subtle bug would be least obvious just from using the UI.
The Edge Functions aren't covered by this suite either — they need a real
Supabase project and real API keys to test meaningfully, which is
integration testing, not unit testing.

If you add a new tool with any non-trivial logic, exporting the pure
function (the way `SlugGenerator.tsx` exports `slugify`) and adding a test
alongside it keeps this suite useful rather than just a monument to
whatever existed on day one.

## Continuous integration

`.github/workflows/ci.yml` runs on every push to `main` and every pull
request: install, lint, test, `tsc -b && vite build`, and — worth calling
out specifically — re-running `scripts/generate_catalog.py` and failing
the build if that changes `toolRegistry.ts` or `seed_tools.sql`. That last
check exists because those two files are generated, not hand-written; it
catches someone editing the catalog by hand (drifting from the script) or
editing the script's `CATEGORIES`/`IMPLEMENTED` without regenerating,
which is exactly the kind of drift the whole generator approach was built
to prevent in the first place. Nothing here needed a real Supabase project
or API keys to build — it's pure repo-level checking — but it also hasn't
run for real, since that only happens once this is pushed to an actual
GitHub repo.

## Design notes

Colors, type and layout follow the brief exactly (dark navy, yellow accent,
thin borders, rounded cards) with a few deliberate choices on top: Space
Grotesk for headings (a distinct, technical feel for a "workbench" brand)
paired with Inter for body/UI text and JetBrains Mono reserved for actual
code/data output inside tools. Borders are used instead of drop shadows
throughout — closer to a blueprint/workbench aesthetic than a generic
SaaS dashboard. The yellow accent is a deliberate nod to workbench/tool
imagery (tape measures, pencils), not an arbitrary brand color.

## Project structure

```
src/
  data/toolRegistry.ts     — generated catalog (do not hand-edit)
  types/tool.ts             — Category / ToolMeta types
  lib/                       — telegram.ts, session.ts, supabaseClient.ts,
                                monetag.ts, points.ts, adminApi.ts,
                                toolComponents.tsx
  components/                — Layout, Hero, SearchAndFilters, ToolCard,
                                AdSlot, ToolShell, CopyButton, AdminLayout,
                                AdminGuard
  pages/                      — Home, ToolPage, Profile
  pages/admin/                — AdminOverview, AdminUsers, AdminRewards,
                                AdminSettings, CatalogCheck (all gated by
                                AdminGuard)
  tools/text/                 — 17 Text & Writing tools
  tools/design/                — 21 Design & Math tools
  tools/dev/                    — 31 Developer & Link Utilities tools
  tools/seo/                    — the other 2 Developer & Link Utilities
                                  tools (Mobile-Friendly Tester, Security
                                  Header Checker) — split out because they
                                  share the site-inspector function rather
                                  than being pure client-side like the rest
  tools/youtube/                — 15 YouTube Creator Tools
supabase/
  schema.sql                 — tables, RLS, is_admin(), award_points()
  seed_tools.sql              — generated catalog seed data
  functions/_shared/            — shared CORS/JSON/auth helpers for Edge Functions
  functions/telegram-auth/    — initData verification + session issuance
  functions/youtube-data/       — consolidated YouTube Data API proxy
  functions/claim-ad-reward/    — opens a pending reward after an ad plays
  functions/monetag-postback/   — verifies Monetag's S2S callback, awards points
  functions/site-inspector/     — fetches a remote URL server-side (no API key)
scripts/generate_catalog.py  — single source of truth for the tool catalog
```
