# TermBeacon Launch Plan

## Product Goal

TermBeacon is a focused B2B SaaS that makes one operational promise immediately understandable: show the last day a team can still act before a vendor contract auto-renews.

The product is intentionally narrower than a CLM or procurement suite. AI may suggest renewal-relevant terms, but a person confirms those terms before they become trusted state. Confirmed renewal dates and notice periods drive a deterministic cancel-by date and a clear Renew / Renegotiate / Cancel workflow.

## Route Map

| Route | Purpose | Indexing |
| --- | --- | --- |
| `/` | Marketing narrative, product proof, security, pricing, conversion | Index |
| `/sign-in` | Google OAuth entry point for durable workspace access | Noindex |
| `/app` | Decision Inbox | Noindex |
| `/app/contracts` | Searchable/filterable vendor contract table | Noindex |
| `/app/contracts/[id]` | Escape Window, source clause, decision actions | Noindex |
| `/app/upload` | Real PDF upload → extraction → review → confirmation | Noindex |
| `/api/health` | Deployment smoke test | Disallow in robots |
| `/robots.txt` | Crawl policy | Public |
| `/sitemap.xml` | Public URL discovery | Public |
| `/manifest.webmanifest` | PWA/site metadata | Public |
| `/opengraph-image` | Dynamic social preview | Public |

## Current Product Foundation

- Next.js App Router + TypeScript + Tailwind CSS v4.
- shadcn-style owned UI primitives backed by `radix-ui`.
- Cloudflare Workers through `@opennextjs/cloudflare`.
- Cloudflare D1 for application data, auth/session records, and chunked MVP PDF persistence.
- Workers AI for PDF conversion and renewal-term extraction.
- Google OAuth + D1-backed users, workspaces, memberships, and hashed sessions.
- Polar billing scaffolding preserved for later activation.
- GitHub Actions gate production with type-check, extraction tests, production build, migrations, remote D1 auth smoke, Worker deploy, active-release verification, and OAuth secret handling.

## Signature Product UI

- Escape Window: Today → Cancel By → Renewal, days remaining, exposure, notice requirement, owner/source context, and date derivation.
- Decision Inbox: focused operational view of what needs attention next.
- Source verification: agreement clause beside extracted terms so confirmation never depends on opaque model output.
- Human-controlled Renew / Renegotiate / Cancel decisions.
- Real upload/review flow with durable ingestion states and retryable failures.

## Landing Page Design State

The homepage follows the owner-approved Aura/Neuform `DESIGN.md` and the mandatory GPT taste-skill process defined in `AGENTS.md`.

Current landing architecture:

1. Premium rounded navigation on the `#FAF9F9` background with black/orange CTA hierarchy.
2. **Editorial split hero**: large Inter outcome copy on the left; dark `#191C21` animated focal panel on the right with a canvas orbital effect and a code-built Escape Window.
3. Black mono workflow marquee carrying TermBeacon process language rather than fake partner logos.
4. Gapless 12-column teaching composition explaining renewal date vs cancel-by (`7 + 5`, then `4 + 4 + 4`).
5. Dark horizontal Upload → Verify → Act accordions with hover/focus expansion.
6. Pinned product-proof chapter with GSAP scale/fade across Decision Inbox → source evidence → orange Escape Window decision card.
7. Dark traceability/security section, one focused pricing plan, oversized dark/orange final CTA, and compact footer.

### Canonical landing visual rules

- Primary orange `#F97316`; accent orange `#FB923C`.
- Background `#FAF9F9`; dark surface `#191C21`; secondary black `#000000`.
- Text `#111827` / `#4B5563`; dark border language `#2A2524`.
- Inter for display moments, Geist for body copy, JetBrains Mono/equivalent for labels and technical metadata.
- Card radius 16px; control radius 8px; pills only where the source composition supports them.
- Preserve the source-inspired first viewport signal, dark focal object, visual density, max-width behavior and responsive stacking.
- Do not flatten the page into a generic SaaS card grid.
- Canvas/particles/radial atmospheric effects are supporting layers only and must remain performant.
- Do not invent customer logos, customer counts, testimonials, security certifications, ratings, savings claims, or legal outcomes.
- `Start Free` stays in persistent navigation/pricing. Acquisition uses “Find My Cancel-By Dates” and “See the Escape Window.”

### Motion

- GSAP + ScrollTrigger drives landing-page reveal, desktop pinning and scale/fade choreography.
- The hero canvas provides restrained ambient orbital movement.
- CSS drives the continuous process marquee and horizontal accordion expansion.
- `prefers-reduced-motion` disables nonessential GSAP, canvas looping, marquee animation and hover transforms.
- Content remains readable and usable if external GSAP scripts fail to load.

## Product Shell

- `/app`: prioritize decisions by cancel-by date.
- `/app/contracts`: URL-backed status filters and search query.
- `/app/contracts/[id]`: Escape Window first, then decision actions and source verification.
- `/app/upload`: accept a real PDF, persist it, extract renewal terms, require review, and only then confirm trusted terms.
- Mobile uses purpose-built stacked rows instead of squeezed desktop tables.

## Contract Ingestion

Durable lifecycle:

`uploaded → processing → needs_review | extraction_failed → confirmed | archived`

Rules:

- Persist the PDF before extraction so failures remain retryable.
- Deduplicate by SHA-256 within the workspace.
- Prefer unknown/null over unsupported AI guesses.
- Verify source evidence against converted agreement text.
- Low-confidence or incomplete critical terms require manual review.
- Human confirmation is the boundary between AI suggestion and trusted contract state.

## Authentication & Workspaces

- Google OAuth provides identity.
- D1 stores users, workspaces, memberships, and hashed session tokens.
- Google access/refresh tokens are not persisted.
- Once auth is enforced, contract authorization resolves from the validated D1 session/workspace rather than the legacy anonymous workspace cookie.
- Existing anonymous browser data may be claimed into the first signed-in workspace when safe.

## SEO & Metadata

- `metadataBase` comes from `NEXT_PUBLIC_SITE_URL` with a localhost development fallback.
- Homepage canonical, Open Graph and Twitter metadata remain stable.
- Icon, dynamic Open Graph image, robots, sitemap, and manifest routes remain public.
- `/app/*` and `/sign-in` remain noindex/nofollow and outside the sitemap.
- Organization and SoftwareApplication structured data must match public product claims.
- Public naming is always **TermBeacon**, never the repository slug `TermBacon`.

## Accessibility

- Keep a visible-on-focus skip link and hierarchical headings.
- Use links for navigation and buttons for actions.
- Every form control needs a label; icon-only controls need accessible names.
- Use focus-visible rings on interactive controls.
- Mobile navigation remains a keyboard-accessible Radix Sheet.
- Browser checks should include keyboard navigation and reduced-motion behavior.

## Production Validation

Do not treat a production push as complete until both GitHub status contexts are green:

- `termbeacon/predeploy-ok`
- `termbeacon/deploy-ok`

The predeploy gate covers TypeScript, extraction tests, production Next.js build, D1 migrations, and remote D1 auth smoke validation. The deploy gate covers secret handling, Worker deployment, and verification that the public `workers.dev` page is serving the exact Git release marker.

For meaningful landing UI changes also check:

- 320, 375, 768, 1024, and 1440 CSS-pixel widths when browser tooling is available.
- Keyboard-only navigation and focus-visible behavior.
- Browser `prefers-reduced-motion` behavior.
- No horizontal page overflow.
- Canvas remains secondary and capped for performance.
- Live Worker homepage visibly shows the orange/black Aura direction after deploy.

## Near-Term Roadmap

### Next: proactive renewal alerts

- Email reminders based on **cancel-by date**, not renewal date.
- Initial cadence candidates: 90 / 60 / 30 / 14 / 7 days before cancel-by.
- Alerts should contain vendor, exposure, cancel-by date, renewal date, notice requirement, and a direct Review Contract action.
- Keep v1 email-only; do not add Slack/Teams/SMS until customer evidence justifies them.

### Then

- Team member invitations and durable owner assignment.
- Decision history / audit trail.
- Retention/deletion controls for stored PDFs.
- Billing/pricing activation.
- Onboarding and empty-state refinement.
- Extraction evaluation corpus with representative vendor agreements and measured field-level accuracy.

### Explicitly Not Near-Term

- Generic “chat with contracts.”
- General-purpose CLM authoring/redlining.
- E-signature.
- Vendor marketplace/discovery.
- Opaque AI legal-risk scoring.
- Dashboard expansion that does not improve a renewal decision.
