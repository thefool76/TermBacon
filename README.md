# TermBeacon

Focused B2B SaaS for vendor renewal decisions: **stop contracts from renewing before you decide**.

## Stack

- Next.js App Router + TypeScript
- Cloudflare Workers via `@opennextjs/cloudflare`
- Tailwind CSS v4 + shadcn/ui source components
- Polar SDK scaffolding retained for future Checkout/webhooks

## Product Surfaces

- `/` — marketing site
- `/app` — Decision Inbox demo
- `/app/contracts` — contracts table
- `/app/contracts/[id]` — Escape Window + source-backed clause
- `/app/upload` — upload/review/confirm demo flow
- `/api/health` — deployment health check

## Local Development

```bash
npm ci
cp .env.example .env.local
cp .dev.vars.example .dev.vars
npm run dev
```

Set `NEXT_PUBLIC_SITE_URL` in `.env.local` for local development and as a Cloudflare build variable for production so canonical, social, sitemap, and structured-data URLs resolve to the real origin. It is public configuration, not a secret.

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

## Polar Setup

Billing behavior is intentionally not completed by the launch UI work. Create a product in Polar when you are ready to activate billing, then set `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, and `POLAR_PRODUCT_ID` in Cloudflare with `npx wrangler secret put <NAME>`.

Never commit `.dev.vars` or billing secrets.

## Validation

```bash
npm run typecheck
npm run build
npm run preview
```

Then check the preview URL plus:

```text
/api/health
/robots.txt
/sitemap.xml
/manifest.webmanifest
/icon
/opengraph-image
```

## Deploy

```bash
npm run deploy
```

The first deployment requires Wrangler to be signed in to the intended Cloudflare account. Set `NEXT_PUBLIC_SITE_URL` to the final public origin before the production build.

## Design & Launch Documentation

- `DESIGN.md` — evidenced visual system and interface rules
- `design-plans/launch-plan.md` — routes, phases, analytics contract, validation checklist, and future roadmap
