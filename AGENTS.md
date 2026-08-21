# TermBeacon Agent Guide

This `AGENTS.md` applies to the entire repository. A more deeply nested `AGENTS.md` may add or override instructions for files in its subtree. Direct user/system/developer instructions always take precedence.

Keep this file as a concise operating map. Put detailed product/design/architecture knowledge in the referenced source-of-truth files instead of duplicating large manuals here.

## Read this before changing code

1. Read this file first.
2. For **any UI, UX, layout, copy hierarchy, visual styling, responsive behavior, or motion change**, read `DESIGN.md` in full before writing code.
3. For marketing/product-positioning/SEO work, also read `design-plans/launch-plan.md` and verify it still matches the current implementation.
4. For authentication/workspace work, read `docs/auth-setup.md`, `lib/auth.ts`, and `lib/auth-session.ts`.
5. For contract ingestion/extraction work, read `lib/contract-ingestion.ts`, `lib/contract-extraction.ts`, `lib/contract-store.ts`, the relevant API routes, and migrations before editing.
6. For Cloudflare/runtime changes, inspect `wrangler.jsonc`, `.github/workflows/deploy-cloudflare.yml`, generated binding expectations, and current Cloudflare documentation before changing platform APIs/config.

## Product truth

- Public product name: **TermBeacon**. The GitHub repository slug is `TermBacon`; never expose `TermBacon` in product UI, metadata, marketing copy, email, or public docs.
- Core promise: **Stop contracts from renewing before you decide.**
- TermBeacon is a focused vendor-renewal decision product, not a generic CLM/procurement suite.
- The primary operational object is the **last actionable cancel-by date**, not merely the renewal date.
- Core workflow: upload agreement → extract renewal terms → show source evidence → human reviews/confirms → deterministically calculate cancel-by date → decide Renew / Renegotiate / Cancel.
- AI is subordinate to the review workflow. It may suggest terms; it must not make legal recommendations or silently turn uncertain output into trusted state.
- Source evidence must stay visible near extracted terms and calculated deadlines.
- Risk/deadline status must be deterministic and explainable from confirmed data.
- Do not add generic “chat with your contracts,” opaque AI legal-risk scores, fake savings claims, fabricated logos, ratings, certifications, or social proof.

## Current architecture

- Next.js App Router + TypeScript.
- Tailwind CSS v4 + shadcn-style owned primitives + `radix-ui`.
- Cloudflare Workers through `@opennextjs/cloudflare`.
- Cloudflare D1 is the current application database and stores small PDF chunks for the MVP.
- Workers AI handles PDF conversion/extraction; application code must validate model output and source evidence.
- Google OAuth + D1-backed users/workspaces/sessions protect the private app.
- Polar billing scaffolding exists; preserve it unless billing work is explicitly requested.
- Private `/app/*` surfaces are noindex/nofollow.

## Design system: mandatory source of truth

`DESIGN.md` is the canonical TermBeacon visual system and must be consulted on **every design task**, even for a small component tweak.

Do not modify `DESIGN.md` unless the user explicitly asks to change the design system itself.

### Taste-skill requirement

For any design/UI task, also review and apply the non-conflicting rules from:

`https://github.com/Leonxlnx/taste-skill/blob/main/skills/gpt-tasteskill/SKILL.md`

The taste-skill is a quality bar for avoiding generic LLM UI. Its compatible rules are mandatory, including:

- Do a short `<design_plan>` / design preflight before writing UI code.
- Deliberately vary composition instead of repeating the same left/right/card layout; deterministic variation is fine, but only among choices compatible with `DESIGN.md`.
- Keep marketing hero headings wide and usually within 2–3 lines; avoid narrow 5–6 line headline walls.
- Verify button text contrast and interactive-state legibility.
- Do not use cheap meta labels such as `SECTION 01`, `QUESTION 05`, or similar filler labels.
- If a bento/grid pattern is used, make the geometry intentional and gapless; prefer 3–5 strong items over many weak cards.
- Avoid accidental horizontal overflow from responsive layouts or motion.
- Give clickable cards/images purposeful hover feedback when appropriate.
- Treat layout, typography, spacing, responsiveness, and motion as designed systems rather than defaults.
- Do not use emoji in production UI copy, code comments, or decorative interface elements unless the user explicitly requests it.

### Conflict rule: TermBeacon wins

When the taste-skill conflicts with `DESIGN.md` or the product workflow, **`DESIGN.md` and TermBeacon product requirements win**. In particular:

- Keep the TermBeacon font stack from `DESIGN.md`; do not replace it merely because the taste-skill proposes another font.
- Do **not** introduce gradients, glassmorphism, glow effects, stock/Picsum imagery, decorative AI stars, or generic cinematic assets.
- Do **not** add GSAP, scroll pinning, scrubbed text, marquees, autoplay motion, or heavy animation just because the external skill suggests them. TermBeacon motion is restrained and uses the durations/easing in `DESIGN.md`; animate transform/opacity only and honor reduced motion.
- AIDA structure is useful for marketing landing-page narrative, but it does not override product workflow hierarchy inside `/app`.
- Product screens prioritize Decision Inbox, Escape Window, source verification, and decisions over decorative marketing patterns.

If the user explicitly requests a design-system deviation, follow the request and state the deviation clearly in the implementation summary.

## Signature UX constraints

- The Escape Window is the signature component. Preserve: Today → Cancel By → Renewal, days remaining, exposure, notice requirement, owner/source context, and an explanation of the calculation.
- Decision Inbox stays operational and compact; do not grow it into a vanity dashboard.
- Primary acquisition CTA: **Find My Cancel-By Dates**.
- Secondary CTA: **See the Escape Window**.
- `Start Free` is reserved for persistent navigation/pricing contexts.
- Use real code-built product UI as visual proof; do not substitute stock screenshots or fake product imagery.
- Desktop tables must become purposeful stacked/mobile rows rather than squeezed columns.
- Use semantic headings, labels, focus-visible states, keyboard-safe Radix primitives, and accessible names for icon-only controls.
- Never use `transition-all`.

## Data and security rules

- Once auth is enforced, resolve private contract access from the validated D1 session/workspace membership, not from the legacy anonymous workspace cookie alone.
- Never log or commit secrets, OAuth credentials, raw session tokens, Google access tokens, or document contents unnecessarily.
- Store only hashed session tokens in D1.
- Validate request bodies and AI output server-side. Browser-provided confidence/status fields are not trusted state.
- AI extraction must prefer `null`/unknown over unsupported guesses.
- A supporting clause must be verified against converted document text before treating it as evidence.
- Confirmation is human-controlled and deterministic; cancel-by calculations must use confirmed dates/notice periods.
- Keep destructive or production-affecting operations explicit and scoped.

## Contract ingestion invariants

- Durable states are: `uploaded`, `processing`, `needs_review`, `extraction_failed`, `confirmed`, `archived`.
- Persist the file before extraction so failures are retryable.
- Deduplicate uploads by SHA-256 within the workspace.
- Failed extraction must preserve the stored PDF and expose retry rather than forcing a re-upload.
- Low-confidence or incomplete critical terms require manual review.
- Confirmation must only promote a valid persisted review state and must be idempotent where possible.

## Engineering style

- Prefer small, composable functions and explicit types over clever abstractions.
- Use existing shadcn/Radix primitives before inventing a new interaction primitive.
- Avoid `any`, unsafe double casts, hidden global request state, floating promises, and hardcoded secrets.
- Use Web Crypto (`crypto.randomUUID`, `crypto.getRandomValues`, `crypto.subtle`) for security-sensitive identifiers/hashes.
- Use Cloudflare bindings directly rather than REST calls from the Worker.
- Keep runtime schema changes in migrations; request handlers should not run ad-hoc DDL as a normal code path.
- Preserve existing Polar scaffolding unless the task is specifically about billing.

## Required validation before shipping

Run the smallest relevant checks during development, then run the full applicable gate before production changes:

```bash
npm ci
npm run cf-typegen        # when Cloudflare bindings/config change
npm run typecheck
npm run test:extraction   # always for extraction/ingestion changes; inexpensive enough to run broadly
npm run build
```

For UI changes, additionally inspect responsive behavior at approximately 320, 375, 768, 1024, and 1440 CSS px when browser tooling is available, plus keyboard and `prefers-reduced-motion` behavior.

Do **not** run `npm run deploy` or remote `npm run db:migrate` against production from an ad-hoc local environment unless the user explicitly requests it. Production deploys go through the repository GitHub Actions workflow.

After a production push, do not claim success until the workflow reports the relevant gates. Current workflow status contexts include `termbeacon/predeploy-ok` and `termbeacon/deploy-ok`.

If a check cannot be run, say exactly which check was not run and why. Never replace validation with “should work.”

## Git / change discipline

- Start write work from current `main` on a feature branch unless the user explicitly directs otherwise.
- Keep commits scoped; do not mix unrelated cleanup into feature work.
- Never force-push `main`.
- Prefer fast-forwarding a reviewed feature commit/branch or opening a PR, depending on the requested workflow.
- Do not delete branches, rewrite history, rotate secrets, or change production resources unless asked.
- Verify the final diff contains only intended files.

## Sources of truth

- Product visual system: `DESIGN.md`
- Product/marketing launch map: `design-plans/launch-plan.md`
- Auth setup: `docs/auth-setup.md`
- Runtime/deployment: `wrangler.jsonc`, `.github/workflows/deploy-cloudflare.yml`
- Database evolution: `migrations/`
- Contract extraction/ingestion: `lib/contract-extraction.ts`, `lib/contract-ingestion.ts`, `lib/contract-store.ts`
- Authentication/session logic: `lib/auth.ts`, `lib/auth-session.ts`

When documentation and implementation disagree, inspect the current code and tests, determine which is stale, and update the stale source rather than silently working around the mismatch.
