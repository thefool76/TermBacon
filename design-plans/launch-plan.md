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

The homepage follows the owner-approved `DESIGN.md` and the mandatory GPT taste-skill process defined in `AGENTS.md`.

Current landing architecture:

1. Premium bounded navigation with Product, How It Works, Security, Pricing, Sign in, and Start Free.
2. **Cinematic centered hero** with a 2–3 line outcome headline, exactly two acquisition CTAs, and live Escape Window/source proof integrated into the same composition.
3. Three product-principle proof cells: source-backed, human-confirmed, deadline-first.
4. Gapless 12-column teaching grid explaining why renewal date ≠ decision deadline (`7 + 5`, then `4 + 4 + 4`).
5. Horizontal Upload → Verify → Protect workflow interaction.
6. Pinned/stacked product proof showing Decision Inbox → Escape Window → source verification.
7. Source-evidence rail using real demo agreement language rather than fabricated testimonials.
8. Conservative security/privacy section without unsupported certifications.
9. Single launch pricing plan.
10. High-contrast final outcome CTA and compact footer.

### Landing visual rules

- Warm canvas, white product surfaces, ink/forest hierarchy, acid only for high-intent actions and small active accents.
- Use the Inter-based stack defined in `DESIGN.md`.
- Use real code-built product UI as primary visual proof.
- No gradients, glassmorphism, glow, stock photography, decorative AI stars, fake logos, ratings, testimonials, certifications, or savings claims.
- No cheap meta labels such as `SECTION 01` or `QUESTION 05`.
- Marketing hero headings stay wide and within 2–3 lines.
- Bento/grid geometry must have no accidental empty cells.
- Avoid horizontal page overflow; intentional horizontal source rails may scroll within their own container.
- `Start Free` remains limited to persistent navigation and pricing. Acquisition uses “Find My Cancel-By Dates” and “See the Escape Window.”

### Motion

- Real GSAP + ScrollTrigger is used only for landing-page scroll choreography.
- Motion is constrained by `DESIGN.md`: transform and opacity only, restrained corporate behavior, and no autoplay distraction.
- Card stacking and desktop scroll pinning are progressive enhancement; content remains fully readable without JavaScript.
- `prefers-reduced-motion` removes nonessential GSAP/CSS movement.
- Hover feedback stays short and product-like.

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
- Product dialogs/menus use existing Radix-backed primitives.
- Browser checks should include keyboard navigation and reduced-motion behavior.

## Analytics Event Contract

| Event | Trigger | Properties |
| --- | --- | --- |
| `hero_primary_clicked` | Hero “Find My Cancel-By Dates” | `source=hero` |
| `escape_window_clicked` | “See the Escape Window” | `source` |
| `contract_opened` | Contract row/detail navigation | `contract_id`, `vendor` |
| `decision_action_clicked` | Renew / Renegotiate / Cancel | `contract_id`, `action` |
| `upload_started` | Real PDF processing begins | `source` |
| `upload_review_viewed` | Suggested terms shown | `contract_id`, `confidence` |
| `upload_retry_clicked` | Failed extraction retried | `contract_id` |
| `extracted_terms_confirmed` | Human confirmation | `contract_id` |
| `pricing_cta_clicked` | Pricing “Start Free” | `plan=team` |
| `nav_cta_clicked` | Persistent “Start Free” | `viewport` |

The event contract remains provider-neutral until an analytics provider is intentionally selected.

## Production Validation

Do not treat a production push as complete until both GitHub status contexts are green:

- `termbeacon/predeploy-ok`
- `termbeacon/deploy-ok`

The predeploy gate covers TypeScript, extraction tests, production Next.js build, D1 migrations, and remote D1 auth smoke validation. The deploy gate covers secret handling, Worker deployment, and verification that the public `workers.dev` page is serving the exact Git release marker.

For meaningful landing UI changes also check:

- 320, 375, 768, 1024, and 1440 CSS-pixel widths.
- Keyboard-only navigation and focus-visible behavior.
- Browser `prefers-reduced-motion` behavior.
- No horizontal page overflow.
- Live Worker homepage shows the intended hero/product proof after deploy.

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
