# DevOptimizeBot

**One workbench. Every tool you need.**

Fast browser tools for creators, bloggers, SEO, developers, text, design and calculations.

A production-ready Telegram Mini App with 121 tools across 7 categories.

## Brand

- **Name**: DevOptimizeBot
- **Tagline**: One workbench. Every tool you need.
- **Colors**: Dark navy (`#0a0f1c`), white/light gray, yellow accent (`#facc15`)
- **Points**: DevOptimizeBot Points

Do **not** use the name "ToolBench" anywhere.

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | React 18, TypeScript, Vite, Tailwind CSS |
| UI           | Custom components (shadcn-style)    |
| Auth         | Telegram Web Apps SDK               |
| Backend      | Supabase (PostgreSQL + Edge Functions) |
| Deployment   | Vercel                              |
| Ads          | Monetag rewarded ads                |

## Project Structure

```
devoptimizebot/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── data/tools.ts          # Exact 121 tools + 7 categories
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ToolCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── tools/ToolPlaceholder.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── ToolPage.tsx
│   │   ├── Profile.tsx
│   │   └── AdminCatalogCheck.tsx
│   ├── hooks/useTelegram.ts
│   └── lib/
│       ├── supabase.ts
│       └── utils.ts
└── supabase/
    └── migrations/
        ├── 001_initial_schema.sql
        └── 002_seed_catalog.sql
```

## Getting Started

### 1. Install dependencies

```bash
cd devoptimizebot
npm install
```

### 2. Environment variables

Create `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run development server

```bash
npm run dev
```

Open http://localhost:5173

### 4. Catalog validation

Visit `/admin/catalog-check` to verify:

- Expected named tools: 121
- Actual named tools: 121
- Categories: 7
- No missing / duplicates / invalid slugs

## Features Implemented

- [x] Exact 121 tools + 7 categories catalog
- [x] Homepage with search + category filters
- [x] Tool detail pages with functional client-side demos
- [x] Telegram WebApp SDK integration (ready for production)
- [x] Profile page with DevOptimizeBot Points UI
- [x] Admin catalog validation page
- [x] Dark navy + yellow accent branding
- [x] Mobile-first responsive UI
- [x] Supabase schema (users, tools, points, rewards, etc.)
- [x] Secure points function (SECURITY DEFINER)

## Next Steps for Full Production

1. **Connect Supabase** – run migrations, seed all 121 tools from `src/data/tools.ts`
2. **Telegram Bot** – create bot via @BotFather, enable Mini App, set Web App URL
3. **Auth flow** – validate `initData` on backend, upsert users
4. **Monetag** – integrate rewarded ads, call Edge Function to award +1 point
5. **Edge Functions** – protect YouTube/SEO API keys, implement server-side tools
6. **Per-tool UIs** – expand `ToolPlaceholder` or create dedicated components for each of the 121 tools
7. **Vercel deploy** – connect repo, set env vars, deploy
8. **Admin dashboard** – extend beyond catalog-check

## Catalog Rule

The application ships with exactly **121 named tools**.  
Do not invent a 122nd tool. The validation page at `/admin/catalog-check` enforces this.

## License

Private / proprietary for DevOptimizeBot.

## Telegram auth + points

Edge Functions:

- `supabase/functions/telegram-auth` — validates `initData`, upserts `users`
- `supabase/functions/award-points` — verifies user, calls `add_points` RPC (+1), writes `reward_events` + `monetag_events`

Secrets (Supabase dashboard or CLI):

```
TELEGRAM_BOT_TOKEN
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

Frontend never updates `users.points` directly.

## Full tool seed

Run after schema:

```
supabase/migrations/003_seed_tools.sql
```

Inserts all 121 tools by exact name.
