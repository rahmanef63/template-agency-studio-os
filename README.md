<div align="center">

# Agency Studio OS

**A 100% headless agency / studio website you fully own.**
Clone it to your own Vercel + Convex, sign in, and run the whole studio —
portfolio, services, process, clients, leads, journal, newsletter — from one
admin dashboard. No code required.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rahmanef63/template-agency-studio-os)

![Next.js 16](https://img.shields.io/badge/Next.js-16-black)
![React 19](https://img.shields.io/badge/React-19-149eca)
![Convex](https://img.shields.io/badge/Convex-realtime-orange)
![Tailwind 4](https://img.shields.io/badge/Tailwind-4-38bdf8)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

[**Live demo**](https://agency-studio-os.vercel.app)

</div>

---

## What is this?

A **clone-to-own** website template for a creative agency or studio. Deploy it to
**your** infrastructure and you get a full marketing site whose content lives in
**your** Convex database — managed entirely from the admin panel. The frontend is
stateless, so updates never touch your data.

- 🎨 **For visitors** — a fast, SEO-ready public site: portfolio, services, process, journal, team, contact.
- 🛠️ **For you** — an admin dashboard to edit everything (and an AI assistant), with zero coding.
- 🔒 **Yours** — your repo, your Vercel, your Convex. No vendor lock-in.

## ✨ Features

- **Headless studio CMS on Convex** — projects/case-studies, services, process
  steps, clients, leads, journal articles, team, comments, subscribers &
  newsletters. Realtime, edited from `/dashboard/admin`.
- **Page & landing builder** — drag-to-reorder blocks (Hero, FeatureGrid,
  Pricing, Stats, FAQ, CTA, Logos, Newsletter, Collection) rendered from data;
  custom pages addressed by slug.
- **Built-in AI assistant** — a public chat FAB wired to Claude via the AI SDK,
  plus an admin AI-config panel (model, tone, temperature, system prompt). The
  action is key-guarded: with no `ANTHROPIC_API_KEY` it degrades gracefully.
- **Zero-touch setup** — deploy → open `/dashboard/admin` → claim owner →
  one-click sample content. No env editing, no terminal. Auth keys auto-provision
  at build.
- **Onboarding wizard + branding from the dashboard** — site name, tagline,
  contact, logo, **favicon**, brand colour, theme preset, light/dark/system. All
  stored in Convex and applied across the site at runtime.
- **One-button image picker** — gallery · upload · paste-URL · curated Unsplash
  (live Unsplash search when `UNSPLASH_ACCESS_KEY` is set).
- **Secure admin** — keyless first-owner claim, then signup gates behind an
  optional invite key (`ADMIN_SIGNUP_KEY`) or auto-admin from env
  (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
- **Admin operations panel** — users & roles, audit log, webhooks, integrations,
  API keys, and analytics (charts via Recharts).
- **`/setup` health page** — a plain-language checklist of what's done and what's
  left, each step linking to its fix. No log-reading.
- **In-app updates** — admin sees current vs upstream version and rebuilds in one
  click (via a Vercel deploy hook).
- **Backup & restore** — export / re-import all your content as JSON, no terminal.
- **Real roles** — owner / admin / editor / viewer, derived over the auth table
  and surfaced in the dashboard.
- **Production Next.js** — SSR metadata, true HTTP 404s, error/loading
  boundaries, a splash loader until data is ready.
- **Demo / clone stages** — a "Deploy your own" ribbon shows on the demo only.
- **Tested clones** — `npm run smoke` checks a clone can deploy (local, no CI cost).

## 🚀 Quick start (non-coder)

1. Click **[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https://github.com/rahmanef63/template-agency-studio-os)** → connect GitHub → add the **Convex** integration → Deploy.
2. Open `https://your-site.vercel.app/admin` (redirects to `/dashboard/admin`) → register the first account (= owner).
3. In the dashboard, run the onboarding wizard and seed sample content. Done.

## 💻 Local development

```bash
npm install --legacy-peer-deps
cp .env.example .env.local        # set NEXT_PUBLIC_CONVEX_URL
npx convex dev --once             # generates convex/_generated
npm run dev                       # http://localhost:3000
```

## 🔐 Environment — two places

Variables live in **two** dashboards. The Deploy/clone button only fills the Vercel
ones; set the Convex ones in the Convex dashboard (or let the build do it).

| Variable | Where | Required | Purpose |
|----------|-------|----------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Vercel | ✅ | Convex deployment URL (`.convex.cloud`) |
| `CONVEX_DEPLOY_KEY` | Vercel | ✅ | deploys functions + schema at build — needs `deploy` + `env:view` + `env:write` (or full access) |
| `JWT_PRIVATE_KEY` / `JWKS` / `SITE_URL` | Convex | ✅ | login signing — **auto-set at build** by `scripts/setup-auth.mjs` (or `npx @convex-dev/auth`) |
| `ADMIN_SIGNUP_KEY` | Convex | – | invite key gating extra admin signups |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Convex | – | auto-create the owner on first load |
| `VERCEL_DEPLOY_HOOK_URL` | Convex | – | enables the admin "Rebuild now" button |
| `UNSPLASH_ACCESS_KEY` | Convex | – | live Unsplash search in the image picker |
| `ANTHROPIC_API_KEY` | Convex | – | enables the AI assistant (Claude) |
| `NEXT_PUBLIC_DEMO` | Vercel | – | demo only — shows the "Deploy your own" ribbon |

> `vercel.json` sets the Build Command to `npm run build:auto`, which runs
> `convex deploy` automatically when `CONVEX_DEPLOY_KEY` is present — no manual
> build-command change needed.

## 🧱 Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 · Tailwind CSS 4 · shadcn/ui · Radix |
| Backend / DB | Convex — realtime |
| Auth | `@convex-dev/auth` (Password + optional GitHub/Google) |
| AI | AI SDK (`ai`) + `@ai-sdk/anthropic` |
| Theme | next-themes (light / dark / system + theme presets) |
| Charts / DnD | Recharts · dnd-kit |
| Images | `image-picker` slice (gallery · upload · link · Unsplash) |

## 🗂️ Project structure

```
app/
  (public)/        public site — home, portfolio, services, process, journal, team, contact (+ loading/error/404)
  dashboard/admin/ admin CMS + operations panel (gated)
  admin/           redirect → /dashboard/admin
  setup/           health-check page
  login/           sign-in / owner claim
  api/unsplash/    image-picker search route
components/
  admin/           backup-card · update-card
  onboarding/      onboarding wizard
  setup/           setup-health
  blocks/          page/landing block renderers (Hero, Pricing, FAQ, …)
  public-chrome.tsx · admin-gate.tsx · site-loader.tsx · demo-ribbon.tsx · ai-chat-fab.tsx
convex/
  schema.ts        auth + studio content + admin-panel + siteSettings
  auth.ts setup.ts settings.ts backup.ts update.ts seed.ts files.ts  …function modules
  features/        comments · notion · ai-chat slices
lib/headless-core/ shared settings contract + version manifest
frontend/slices/   image-picker · notion-shell (portable slices)
scripts/           setup-auth.mjs (build-time JWT keys) · smoke-test.mjs
```

## 🗺️ Roadmap

- [x] **headless-core** module + version manifest (`lib/headless-core/`)
- [x] One-click **"Update available"** in admin
- [x] One-click **backup / restore**
- [x] Roles (owner / admin / editor / viewer) — derived, surfaced in dashboard
- [x] **`/setup`** health page + clone **smoke-test**
- [x] Built-in AI assistant (Claude) + admin AI-config
- [ ] Per-action RBAC enforcement
- [ ] Optional Resend "forgot password" + newsletter send flow

## 📄 License

MIT © Rahman ([rahmanef.com](https://rahmanef.com))

<div align="center"><sub>Built with <a href="https://resource.rahmanef.com">rahman-resources</a>.</sub></div>
