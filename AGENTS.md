# TermBeacon Agent Guide

This `AGENTS.md` applies to the entire repository. Direct user/system/developer instructions take precedence. A more deeply nested `AGENTS.md` may add narrower instructions for its subtree, but it must not weaken the mandatory TermBeacon design protocol below unless the user explicitly asks for that change.

## Mandatory first step for every task

1. Read this `AGENTS.md` before changing anything.
2. Read the files relevant to the subsystem being changed before editing.
3. Never rely on remembered architecture, remembered design rules, or an older chat summary when the repository source can be read directly.
4. Keep changes scoped and validate them before shipping.

## Mandatory design protocol — no exceptions

For **every** task that changes UI, UX, visual styling, layout, typography, spacing, responsive behavior, interaction design, motion, marketing presentation, product presentation, or copy hierarchy, do all of the following **before writing UI code**:

1. Read the root `DESIGN.md` in full from the current working branch.
2. Treat that file as the exact TermBeacon design source supplied by the project owner. The currently approved uploaded design source has SHA-256:
   `aa45e2d7f9448a0af6c5e056057d616293b38a76455067294039932dd7ff2faf`
3. Read the **full current** GPT taste-skill from:
   `https://github.com/Leonxlnx/taste-skill/blob/main/skills/gpt-tasteskill/SKILL.md`
4. Do not use a remembered/cached summary of the taste-skill when the source can be fetched.
5. Produce the taste-skill `<design_plan>` / preflight **before** React/UI implementation. The preflight must explicitly cover:
   - deterministic layout/composition choice;
   - typography decision;
   - component architecture choice;
   - motion/interaction choice;
   - AIDA check when working on a marketing/landing page;
   - hero line-count/width check when a hero exists;
   - bento/grid density check when a bento/grid exists;
   - meta-label sweep;
   - button contrast/legibility check;
   - horizontal-overflow check;
   - responsive and reduced-motion plan.
6. Re-state the relevant `DESIGN.md` constraints in the design preflight so they cannot be forgotten during implementation.
7. Implement only after the preflight is complete.
8. After implementation, perform a design compliance sweep against **both** `DESIGN.md` and the taste-skill before considering the work complete.

### Both design sources are mandatory

`DESIGN.md` and the GPT taste-skill are both mandatory inputs. Do not silently ignore either one.

There are a few literal collisions between a generic external design skill and TermBeacon's project-specific design system. When that happens:

- `DESIGN.md` controls TermBeacon-specific brand tokens, product hierarchy, colors, typography, prohibited visual treatments, and motion limits.
- The taste-skill controls the anti-generic design process, composition quality, preflight discipline, spacing quality, grid rigor, hero width/line discipline, interaction quality, and creative variation in every dimension that does not violate `DESIGN.md`.
- A collision must be acknowledged in the `<design_plan>` rather than silently dropping a rule.
- Preserve the intent of the taste-skill as strongly as possible while obeying the literal TermBeacon constraint.

Concrete examples:

- `DESIGN.md` specifies the TermBeacon sans stack beginning with Inter; do not replace it merely because the generic taste-skill says never use Inter.
- `DESIGN.md` explicitly bans gradients, glassmorphism, glow effects, decorative AI stars, and stock photography; do not introduce them even when a generic visual recipe proposes them.
- The taste-skill's demand for strong motion quality may be implemented only within TermBeacon's restrained motion system: transform/opacity only, `150ms` hover, `220ms` interaction, `400ms` entrance, shared `cubic-bezier(0.22, 1, 0.36, 1)`, and a reduced-motion path. Do not add distracting autoplay behavior.
- AIDA is mandatory for relevant marketing-page work, but it must use real TermBeacon product proof and cannot replace the product hierarchy inside `/app`.

If the user explicitly asks to change the design system itself, update `DESIGN.md` first, then update this guide if needed. Otherwise, do not mutate the design system to make implementation easier.

## Product truth

- Public product name: **TermBeacon**. The GitHub repository slug is `TermBacon`; never expose `TermBacon` in product UI, metadata, marketing copy, email, or public docs.
- Core promise: **Stop contracts from renewing before you decide.**
- TermBeacon is a focused vendor-renewal decision product, not a generic CLM/procurement suite.
- The primary operational object is the **last actionable cancel-by date**, not merely the renewal date.
- Core workflow: upload agreement → extract renewal terms → show source evidence → human reviews/confirms → deterministically calculate cancel-by date → decide Renew / Renegotiate / Cancel.
- AI is subordinate to the review workflow. It may suggest terms; it must not make legal recommendations or silently turn uncertain output into trusted state.
- Source evidence must remain visible near extracted terms and calculated deadlines.
- Risk/deadline status must be deterministic and explainable from confirmed data.
- Do not add generic “chat with your contracts,” opaque AI legal-risk scores, fake savings claims, fabricated logos, ratings, certifications, or social proof.

## Canonical TermBeacon visual rules

The complete rules live in `DESIGN.md`; these reminders do not replace reading it.

- Warm canvas `#f7f6f0`, white surfaces, ink `#12211d`, forest `#123b32`, acid `#dfff45` only for high-intent actions/small active accents.
- Use risk red/amber only when the displayed contract state warrants it.
- Use the `DESIGN.md` sans stack and tabular numerals for deadlines/counts/dates/currency.
- Marketing uses spacious editorial composition with **live code-built product UI as proof**.
- Product pages prioritize Decision Inbox, Escape Window, source clause, and decision actions over vanity charts/KPI grids.
- Mobile tables become purpose-built stacked rows rather than compressed desktop tables.
- Shadows are restrained; no glow or glass depth.
- Product radius is compact (`0.625rem`); avoid pills unless content is truly badge-like.
- Escape Window always preserves Today → Cancel By → Renewal plus days remaining, exposure, notice requirement, owner/source context, and the derivation explanation.
- Primary marketing CTA: **Find My Cancel-By Dates**.
- Secondary CTA: **See the Escape Window**.
- `Start Free` is reserved for persistent navigation/pricing contexts.
- Never use `transition-all`.

## Current architecture

- Next.js App Router + TypeScript.
- Tailwind CSS v4 + shadcn-style owned primitives + `radix-ui`.
- Cloudflare Workers through `@opennextjs/cloudflare`.
- Cloudflare D1 is the current application database and stores small PDF chunks for the MVP.
- Workers AI handles PDF conversion/extraction; application code validates model output and source evidence.
- Google OAuth + D1-backed users/workspaces/sessions protect the private app.
- Polar billing scaffolding exists; preserve it unless billing work is explicitly requested.
- Private `/app/*` surfaces are noindex/nofollow.

## Read by subsystem

- Marketing/product-positioning/SEO: read `design-plans/launch-plan.md` and verify it matches current implementation.
- Authentication/workspaces: read `docs/auth-setup.md`, `lib/auth.ts`, and `lib/auth-session.ts`.
- Contract ingestion/extraction: read `lib/contract-ingestion.ts`, `lib/contract-extraction.ts`, `lib/contract-store.ts`, relevant API routes, and migrations.
- Cloudflare/runtime: inspect `wrangler.jsonc`, `.github/workflows/deploy-cloudflare.yml`, generated binding expectations, and current Cloudflare documentation before changing platform APIs/config.

## Data and security rules

- Once auth is enforced, resolve private contract access from validated D1 session/workspace membership, not the legacy anonymous workspace cookie alone.
- Never log or commit secrets, OAuth credentials, raw session tokens, Google access tokens, or document contents unnecessarily.
- Store only hashed session tokens in D1.
- Validate request bodies and AI output server-side. Browser-provided confidence/status fields are not trusted state.
- AI extraction must prefer `null`/unknown over unsupported guesses.
- A supporting clause must be verified against converted document text before treating it as evidence.
- Confirmation is human-controlled and deterministic; cancel-by calculations must use confirmed dates/notice periods.
- Keep destructive or production-affecting operations explicit and scoped.

## Contract ingestion invariants

- Durable states: `uploaded`, `processing`, `needs_review`, `extraction_failed`, `confirmed`, `archived`.
- Persist the file before extraction so failures are retryable.
- Deduplicate uploads by SHA-256 within the workspace.
- Failed extraction preserves the stored PDF and exposes retry rather than forcing re-upload.
- Low-confidence or incomplete critical terms require manual review.
- Confirmation only promotes a valid persisted review state and should be idempotent where possible.

## Engineering style

- Prefer small composable functions and explicit types over clever abstractions.
- Use existing shadcn/Radix primitives before inventing a new interaction primitive.
- Avoid `any`, unsafe double casts, hidden global request state, floating promises, and hardcoded secrets.
- Use Web Crypto (`crypto.randomUUID`, `crypto.getRandomValues`, `crypto.subtle`) for security-sensitive identifiers/hashes.
- Use Cloudflare bindings directly rather than REST calls from the Worker.
- Keep schema changes in migrations; request handlers should not run ad-hoc DDL as a normal path.
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

For design/UI changes, also verify:

- `DESIGN.md` was read from the current branch;
- the current taste-skill was read from its source;
- the `<design_plan>` was completed before UI code;
- no gradient/glass/glow/stock-photo/AI-star regressions;
- no `transition-all`;
- hero line width and contrast when applicable;
- grid/bento has no accidental dead space when applicable;
- no cheap meta labels such as `SECTION 01` / `QUESTION 05`;
- no accidental horizontal overflow;
- approximately 320, 375, 768, 1024, and 1440 CSS px when browser tooling is available;
- keyboard accessibility and focus-visible behavior;
- `prefers-reduced-motion` behavior.

Do **not** run `npm run deploy` or remote production migrations from an ad-hoc local environment unless explicitly requested. Production deploys go through GitHub Actions.

After a production push, do not claim success until the workflow reports the relevant gates. Current status contexts include `termbeacon/predeploy-ok` and `termbeacon/deploy-ok`.

If a required check cannot be run, state exactly which check was not run and why. Never replace validation with “should work.”

## Git / change discipline

- Start write work from current `main` on a feature branch unless explicitly directed otherwise.
- Keep commits scoped; do not mix unrelated cleanup into feature work.
- Never force-push `main`.
- Prefer fast-forwarding a reviewed feature commit/branch or opening a PR depending on the requested workflow.
- Do not delete branches, rewrite history, rotate secrets, or change production resources unless asked.
- Verify the final diff contains only intended files.

## Sources of truth

- **Owner-approved visual system:** `DESIGN.md` (current approved upload SHA-256 `aa45e2d7f9448a0af6c5e056057d616293b38a76455067294039932dd7ff2faf`)
- **Mandatory external design quality skill:** `https://github.com/Leonxlnx/taste-skill/blob/main/skills/gpt-tasteskill/SKILL.md`
- Product/marketing launch map: `design-plans/launch-plan.md`
- Auth setup: `docs/auth-setup.md`
- Runtime/deployment: `wrangler.jsonc`, `.github/workflows/deploy-cloudflare.yml`
- Database evolution: `migrations/`
- Contract extraction/ingestion: `lib/contract-extraction.ts`, `lib/contract-ingestion.ts`, `lib/contract-store.ts`
- Authentication/session logic: `lib/auth.ts`, `lib/auth-session.ts`

When documentation and implementation disagree, inspect the current code/tests and update the stale source. Never silently work around the mismatch.
