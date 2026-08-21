# TermBeacon Launch Plan

## Product Goal

Ship a focused B2B SaaS that makes one operational promise immediately understandable: TermBeacon shows the last day a team can still act before a vendor contract auto-renews.

The product is intentionally narrower than a CLM or procurement suite. AI may suggest renewal-relevant terms, but the interface requires human confirmation before those terms become trusted product state. Confirmed renewal dates and notice periods drive a deterministic cancel-by date and a clear Renew / Renegotiate / Cancel workflow.

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
- GitHub Actions gates production with type-check, production build, migrations, remote D1 smoke tests, deploy, and OAuth-secret sync.

## Signature Product UI

- Reusable Escape Window on marketing and contract detail surfaces.
- Decision Inbox focused on the few metrics needed to decide what needs attention next.
- Source-clause verification beside extracted terms.
- Human-confirmed Renew / Renegotiate / Cancel decisions.
- Real upload/review flow with durable ingestion states and retryable failures.
- Shared product language and demo data where marketing proof requires deterministic examples.

## Marketing Narrative

1. Persistent navigation with Product, How It Works, Security, Pricing, Sign in, and Start Free.
2. Split hero with outcome-led copy and live Decision Inbox + Escape Window proof.
3. Trust strip explaining the focused vendor-renewal category.
4. Problem section teaching why renewal date ≠ decision deadline.
5. Upload → Confirm → Decide workflow.
6. Product-proof section for Decision Inbox and Escape Window.
7. Source verification with clause highlight.
8. Explainable renewal risk/deadline section.
9. Conservative security/privacy section without unsupported certifications.
10. Single-plan pricing and final outcome CTA.

## Product Shell

- `/app`: prioritize decisions by cancel-by date.
- `/app/contracts`: URL-backed status filters and search query.
- `/app/contracts/[id]`: make Escape Window the primary surface, followed by decision actions and source verification.
- `/app/upload`: accept a real PDF, persist it, extract renewal terms, require review, and only then confirm trusted terms.
- Use mobile-specific stacked rows instead of squeezing desktop tables.

### Contract ingestion states

The durable ingestion lifecycle is:

`uploaded → processing → needs_review | extraction_failed → confirmed | archived`

Rules:

- Persist the PDF before extraction so a failed extraction remains retryable.
- Deduplicate by SHA-256 within the workspace.
- Prefer unknown/null over unsupported AI guesses.
- Verify source evidence against converted agreement text.
- Low-confidence or incomplete critical terms require manual review.
- Human confirmation is the boundary between AI suggestions and trusted contract state.

## Authentication & Workspaces

- Google OAuth is used for identity.
- D1 stores users, workspaces, workspace memberships, and hashed session tokens.
- Google access/refresh tokens are not persisted.
- Once authentication is enforced, contract authorization resolves from the validated D1 session/workspace rather than trusting an anonymous workspace cookie.
- Existing anonymous browser data can be claimed into the first signed-in workspace when safe.

## SEO & Metadata

- Configure `metadataBase` from `NEXT_PUBLIC_SITE_URL` with a localhost development fallback.
- Keep one title template and stable description defaults in the root layout.
- Keep homepage canonical, Open Graph URL/title/description, and Twitter metadata.
- Keep icon, dynamic Open Graph image, robots, sitemap, and manifest routes.
- Keep `/app/*` and `/sign-in` noindex/nofollow and out of the sitemap.
- Render only Organization and SoftwareApplication JSON-LD properties that match public product copy.
- Use “TermBeacon” consistently in public metadata even though the repository slug remains `TermBacon`.

## Accessibility & Motion

- Keep a visible-on-focus skip link and hierarchical headings.
- Use links for navigation and buttons for actions.
- Ensure every form control has a label and every icon-only control has an accessible name.
- Use focus-visible rings on interactive controls.
- Use Radix-backed shadcn Dialog, Sheet, Dropdown Menu, Tooltip, Tabs, Accordion, Progress, Label, and Separator where those interaction patterns are needed.
- Restrict motion to transform/opacity for entrances and small directional affordances.
- Honor `prefers-reduced-motion` globally.
- Keep hover feedback short and consistent; avoid autoplay or looping attention effects around pricing and conversion surfaces.

## Analytics Events

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

## Launch Checklist

### Product & Copy

- [x] Primary positioning says “Stop contracts from renewing before you decide.”
- [x] Primary conversion CTA says “Find My Cancel-By Dates.”
- [x] Secondary CTA says “See the Escape Window.”
- [x] “Start Free” is limited to navigation/pricing contexts.
- [x] AI is framed as suggestion + confirmation, not an autonomous decision maker.
- [x] No generic contract chatbot or legal-risk score exists.
- [x] No fake social proof or security certification is rendered.

### Core Product

- [x] Signature Escape Window exists on marketing and product detail surfaces.
- [x] Decision Inbox uses a focused operational hierarchy.
- [x] Source clause sits beside extracted terms.
- [x] Real PDF ingestion is live.
- [x] Failed extraction remains retryable from the stored PDF.
- [x] Duplicate PDF uploads are detected by workspace-scoped SHA-256.
- [x] Low-confidence/incomplete terms require review.
- [x] Confirmation produces a deterministic cancel-by date.
- [x] Decisions persist in D1.
- [x] Google OAuth and durable workspaces are live.

### Accessibility

- [x] Skip link is present.
- [x] Focus-visible styles are defined for custom interactive controls.
- [x] Mobile navigation uses a keyboard-accessible Sheet.
- [x] Dialogs are keyboard/focus managed by the shared primitive.
- [x] Form inputs are labeled.
- [x] Async upload/review states use accessible status/error messaging.
- [x] Reduced-motion behavior is defined.

### SEO

- [x] Metadata API used.
- [x] `metadataBase` configurable through `NEXT_PUBLIC_SITE_URL`.
- [x] Canonical homepage metadata exists.
- [x] Open Graph and Twitter cards configured.
- [x] Dynamic Open Graph image exists.
- [x] Icon and manifest routes exist.
- [x] Robots and sitemap routes exist.
- [x] Private product shell is noindex/nofollow.
- [x] Structured data avoids ratings, reviews, customer counts, certifications, and other unsupported claims.

### Production Validation

Current GitHub Actions deployment should not be treated as successful until both status contexts are green:

- `termbeacon/predeploy-ok`
- `termbeacon/deploy-ok`

The predeploy gate covers TypeScript, extraction tests, production Next.js build, D1 migrations, and remote D1 auth smoke validation. The deploy gate covers the Cloudflare Worker deployment and OAuth secret synchronization.

Browser-level checks remain necessary for user-facing changes:

- [ ] Test 320, 375, 768, 1024, and 1440 CSS-pixel widths after meaningful UI changes.
- [ ] Complete keyboard-only pass for navigation, dialogs, dropdowns, and upload/review flow.
- [ ] Complete browser `prefers-reduced-motion` pass after motion changes.
- [ ] Smoke-test `/api/health`, authentication, a real PDF upload, extraction review, confirmation, decision persistence, sign-out, and sign-in after core-flow changes.

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

### After Product-Market Evidence

- Bulk import and vendor normalization.
- Approval workflows for higher-exposure renewals.
- Renewal calendar and exported decision history.
- Role-based permissions and richer audit logging.
- Procurement/finance integrations justified by actual customer workflows.

### Explicitly Not On The Near-Term Roadmap

- Generic “chat with contracts.”
- General-purpose CLM authoring/redlining.
- E-signature.
- Vendor marketplace/discovery.
- Opaque AI legal-risk scoring.
- Dashboard expansion that does not improve a renewal decision.
