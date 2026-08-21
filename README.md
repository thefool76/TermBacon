# TermBeacon

Focused B2B SaaS for contract renewal decisions: **know what renews, know when to act**.

## Stack

- Next.js (App Router) + TypeScript
- Cloudflare Workers via the OpenNext adapter
- Tailwind CSS v4 + shadcn/ui configuration
- Polar SDK, ready for Checkout and webhooks

## Local development

```bash
npm install
cp .dev.vars.example .dev.vars
npm run dev
```

## Polar setup

Create a product in Polar, then set `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, and `POLAR_PRODUCT_ID` in Cloudflare with `npx wrangler secret put <NAME>`. Register `https://<your-worker>.workers.dev/webhooks/polar` as the Polar webhook endpoint.

## Deploy

```bash
npm run deploy
```

The first deployment requires signing in to the intended Cloudflare account in Wrangler.
