# TermBeacon Agent Guide

This `AGENTS.md` applies to the entire repository. Direct user/system/developer instructions take precedence. A more deeply nested `AGENTS.md` may add narrower rules for its subtree but must not weaken the mandatory design protocol below unless the user explicitly requests that change.

## Mandatory first step for every task

1. Read this `AGENTS.md` before changing anything.
2. Read the files relevant to the subsystem being changed before editing.
3. Never rely on remembered architecture, remembered design rules, screenshots from an older build, or an older chat summary when the repository source can be read directly.
4. Keep changes scoped and validate them before shipping.

## Mandatory design protocol — no exceptions

For every task that changes UI, UX, visual styling, layout, typography, spacing, responsive behavior, interaction design, motion, marketing presentation, product presentation, or copy hierarchy, use this exact order before writing UI code:

1. Read the **full current GPT taste-skill** from:
   `https://github.com/Leonxlnx/taste-skill/blob/main/skills/gpt-tasteskill/SKILL.md`
2. Do not use a remembered or cached summary when the source can be fetched.
3. Read the root `DESIGN.md` in full from the current working branch.
4. Treat that file as the exact owner-approved visual source. The currently approved uploaded design source has SHA-256:
   `48b93df3b84bfbc2ee29bcab7162f5218c2e9779f680d8c3612d2e3e588f274e`
5. Produce the taste-skill `<design_plan>` / preflight before React/UI implementation. It must explicitly cover:
   - deterministic RNG-selected hero architecture;
   - typography selection and any collision with `DESIGN.md`;
   - three component architecture selections;
   - two GSAP motion paradigms;
   - AIDA structure for marketing/landing pages;
   - hero width and 2–3 line verification;
   - bento/grid density math and `grid-flow-dense` when applicable;
   - meta-label sweep;
   - button contrast and legibility;
   - horizontal-overflow protection;
   - responsive behavior;
   - reduced-motion behavior;
   - WebGL/canvas/particles/atmospheric effects when supported by `DESIGN.md`.
6. Re-state the relevant `DESIGN.md` constraints in the design preflight.
7. Implement only after the preflight is complete.
8. After implementation, perform a compliance sweep against both sources before shipping.

### Design-source hierarchy

Both sources are mandatory.

- `DESIGN.md` controls the project-specific palette, font roles, radii, component density, first-viewport composition, color mode, visible hierarchy, and source-specific guardrails.
- GPT taste-skill controls anti-generic composition quality, deterministic variation, AIDA, hero width discipline, bento rigor, motion quality, component creativity, and interaction polish.
- When the two sources conflict, acknowledge the collision in the `<design_plan>` and follow `DESIGN.md` for project-specific tokens/visual identity while preserving the taste-skill's intent as strongly as possible.

Current known collision: the taste-skill's randomized typography options may exclude Inter, while the owner-approved `DESIGN.md` explicitly uses Inter for display moments, Geist for body copy, and JetBrains Mono for labels/technical metadata. `DESIGN.md` wins for those font roles.

If the user explicitly supplies a new design system, replace `DESIGN.md` first, update the approved SHA and visual reminders in this file, then perform design work.

## Current canonical visual system

The complete rules live in `DESIGN.md`; these reminders do not replace reading it.

- Primary orange `#F97316`; accent orange `#FB923C`.
- Secondary black `#000000`.
- Page background `#FAF9F9`.
- Dark surface `#191C21`; border language `#2A2524`.
- Primary text `#111827`; secondary text `#4B5563`.
- Display: Inter, approximately 64px / 500 / 1.04 when the composition supports it.
- Body: Geist, 16px / 400 / 1.6.
- Labels and technical metadata: JetBrains Mono or equivalent mono, around 12px / 600.
- Base spacing 8px; common gap 16px; card padding 24px; section padding around 80px before responsive scaling.
- Card radius 16px; control radius 8px; pill radius only where source composition actually uses pills.
- Preserve the source's first-screen hierarchy, focal object, density, max-width behavior, card density, responsive stacking, input/button hierarchy, and interaction tone.
- Do not flatten the design into a generic SaaS card grid.
- Motion may include masked/staggered reveals, hover lift, GSAP scroll transitions, pinning/stacking/scrubbing, and ambient movement.
- Canvas/WebGL/particles/gradients/atmospheric effects are allowed when used as supporting layers, kept performant and secondary to content.
- Keep button/card/badge radius and border language consistent.

## Product truth

- Public product name: **TermBeacon**. The repository slug is `TermBacon`; never expose `TermBacon` in product UI, metadata, marketing copy, email, or public docs.
- Core promise: **Stop contracts from renewing before you decide.**
- TermBeacon is a focused vendor-renewal decision product, not a generic CLM/procurement suite.
- The primary operational object is the last actionable cancel-by date, not merely the renewal date.
- Core workflow: upload agreement → extract renewal terms → show source evidence → human reviews/confirms → deterministically calculate cancel-by date → decide Renew / Renegotiate / Cancel.
- AI is subordinate to the review workflow. It may suggest terms; it must not make legal recommendations or silently turn uncertain output into trusted state.
- Source evidence stays near extracted terms and calculated deadlines.
- Do not add generic “chat with your contracts,” opaque AI legal-risk scores, fake savings claims, fabricated logos, ratings, certifications, or customer social proof.

## Current architecture

- Next.js App Router + TypeScript.
- Tailwind CSS v4 + owned shadcn-style primitives + `radix-ui`.
- Cloudflare Workers through `@opennextjs/cloudflare`.
- Cloudflare D1 for application data, auth/session records, and chunked MVP PDF persistence.
- Workers AI for PDF conversion/extraction; application code validates model output and source evidence.
- Google OAuth + D1-backed users/workspaces/sessions protect private app routes.
- Polar billing scaffolding exists; preserve it unless billing work is explicitly requested.
- Private `/app/*` surfaces are noindex/nofollow.

## Read by subsystem

- Marketing/product-positioning/SEO: read `design-plans/launch-plan.md` and verify it matches current implementation.
- Authentication/workspaces: read `docs/auth-setup.md`, `lib/auth.ts`, and `lib/auth-session.ts`.
- Contract ingestion/extraction: read `lib/contract-ingestion.ts`, `lib/contract-extraction.ts`, `lib/contract-store.ts`, relevant API routes, and migrations.
- Cloudflare/runtime: inspect `wrangler.jsonc`, `.github/workflows/deploy-cloudflare.yml`, generated binding expectations, and current Cloudflare documentation before changing platform APIs/config.

## Security and data invariants

- Once auth is enforced, resolve private contract access from validated D1 session/workspace membership, not the legacy anonymous workspace cookie alone.
- Never log or commit secrets, OAuth credentials, raw session tokens, Google access tokens, or document contents unnecessarily.
- Store only hashed session tokens in D1.
- Validate request bodies and AI output server-side.
- AI extraction prefers `null`/unknown over unsupported guesses.
- Supporting clauses must be verified against converted document text before becoming trusted evidence.
- Human confirmation is the boundary between AI suggestions and trusted product state.
- Keep schema changes in migrations; request handlers must not run ad-hoc DDL as a normal path.

## Contract ingestion invariants

- Durable states: `uploaded`, `processing`, `needs_review`, `extraction_failed`, `confirmed`, `archived`.
- Persist the PDF before extraction so failures are retryable.
- Deduplicate uploads by SHA-256 within the workspace.
- Failed extraction preserves the stored PDF and exposes retry.
- Low-confidence or incomplete critical terms require manual review.
- Confirmation promotes only a valid persisted review state and should be idempotent where possible.

## Engineering style

- Prefer small composable functions and explicit types over clever abstractions.
- Use existing shadcn/Radix primitives before inventing a new interaction primitive.
- Avoid `any`, unsafe double casts, hidden global request state, floating promises, and hardcoded secrets.
- Use Web Crypto for security-sensitive identifiers/hashes.
- Use Cloudflare bindings directly rather than Worker-side REST calls where bindings exist.
- Preserve Polar scaffolding unless the task is specifically about billing.

## Required validation before shipping

Run the smallest relevant checks during development, then the full applicable gate before production changes:

```bash
npm ci
npm run cf-typegen        # when Cloudflare bindings/config change
npm run typecheck
npm run test:extraction
npm run build
```

For design/UI changes also verify:

- current GPT taste-skill was read first;
- current root `DESIGN.md` was read after it;
- `<design_plan>` was completed before UI code;
- first viewport clearly matches the approved visual direction rather than an older TermBeacon design;
- hero is 2–3 lines at intended desktop widths;
- bento/grid has no accidental dead cells when applicable;
- no cheap meta labels such as `SECTION 01` or `QUESTION 05`;
- button contrast is legible;
- no accidental horizontal overflow;
- approximately 320, 375, 768, 1024, and 1440 CSS px when browser tooling is available;
- keyboard/focus-visible behavior;
- `prefers-reduced-motion` behavior;
- canvas/ambient effects remain secondary and performant.

Do not run production deploys or remote production migrations from an ad-hoc local environment unless explicitly requested. Production deploys go through GitHub Actions.

After a production push, do not claim success until the relevant GitHub status contexts are green, including `termbeacon/predeploy-ok` and `termbeacon/deploy-ok`.

If a required check cannot be run, state exactly which check was not run and why. Never replace validation with “should work.”

## Git discipline

- Start write work from current `main` on a feature branch unless explicitly directed otherwise.
- Keep commits scoped; do not mix unrelated cleanup into feature work.
- Never force-push `main`.
- Prefer fast-forwarding a reviewed feature branch or opening a PR depending on the requested workflow.
- Verify the final diff contains only intended files.

## Sources of truth

- **Owner-approved visual system:** `DESIGN.md` — SHA-256 `48b93df3b84bfbc2ee29bcab7162f5218c2e9779f680d8c3612d2e3e588f274e`
- **Mandatory external design quality skill:** `https://github.com/Leonxlnx/taste-skill/blob/main/skills/gpt-tasteskill/SKILL.md`
- Product/marketing launch map: `design-plans/launch-plan.md`
- Auth setup: `docs/auth-setup.md`
- Runtime/deployment: `wrangler.jsonc`, `.github/workflows/deploy-cloudflare.yml`
- Database evolution: `migrations/`
- Contract extraction/ingestion: `lib/contract-extraction.ts`, `lib/contract-ingestion.ts`, `lib/contract-store.ts`
- Authentication/session logic: `lib/auth.ts`, `lib/auth-session.ts`

When documentation and implementation disagree, inspect the current code/tests and update the stale source instead of silently working around the mismatch.