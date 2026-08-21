# TermBeacon Launch Plan

## Product Goal

Ship a focused B2B SaaS marketing site and product shell that makes one operational promise immediately understandable: TermBeacon shows the last day a team can still act before a vendor contract auto-renews.

The launch surface is intentionally narrower than a CLM or procurement suite. AI may suggest renewal-relevant terms, but the interface requires human confirmation before those terms become trusted product state.

## Route Map

| Route | Purpose | Indexing |
| --- | --- | --- |
| `/` | Marketing narrative, product proof, security, pricing, conversion | Index |
| `/app` | Decision Inbox | Noindex |
| `/app/contracts` | Searchable/filterable vendor contract table | Noindex |
| `/app/contracts/[id]` | Escape Window, source clause, decision actions | Noindex |
| `/app/upload` | Upload → review → confirm demo workflow | Noindex |
| `/api/health` | Deployment smoke test | Disallow in robots |
| `/robots.txt` | Crawl policy | Public |
| `/sitemap.xml` | Public URL discovery | Public |
| `/manifest.webmanifest` | PWA/site metadata | Public |
| `/opengraph-image` | Dynamic social preview | Public |

## Phase 1 — Foundation

- Preserve Next.js App Router, TypeScript, Tailwind CSS v4, shadcn/ui source ownership, OpenNext Cloudflare configuration, and existing Polar scaffolding.
- Centralize public site configuration and static demo contract data.
- Establish semantic color, radius, and motion tokens in `app/globals.css`.
- Remove `transition-all` from shared primitives.
- Keep billing secrets and webhook behavior unchanged.

## Phase 2 — Signature Product UI

- Build one reusable Escape Window used by marketing and the private product shell.
- Build one reusable Decision Inbox using 3 metrics only.
- Build source-clause verification with highlighted source language beside extracted terms.
- Build human-confirmed decision actions for Renew, Renegotiate, and Cancel.
- Keep all sample values in `lib/demo-data.ts` so marketing and product proof cannot drift.

## Phase 3 — Marketing Narrative

1. Persistent navigation with Product, How It Works, Security, Pricing, Sign in, and Start Free.
2. Split hero with outcome-led copy and live Decision Inbox + Escape Window proof.
3. Trust strip explaining the focused vendor-renewal category.
4. Problem section teaching why renewal date ≠ decision deadline.
5. Upload → Confirm → Decide workflow.
6. Product-proof section for Decision Inbox and Escape Window.
7. Source verification with clause highlight.
8. Explainable Renewal Risk section.
9. Conservative security/privacy section without unsupported certifications.
10. Single-plan pricing and final outcome CTA.

## Phase 4 — Product Shell

- `/app`: prioritize decisions by cancel-by date.
- `/app/contracts`: URL-backed status filters and search query.
- `/app/contracts/[id]`: make Escape Window the primary surface, followed by decision actions and source verification.
- `/app/upload`: provide an interaction-driven static demo that never claims to upload or process a real document.
- Use mobile-specific stacked rows instead of squeezing desktop tables.

## Phase 5 — SEO & Metadata

- Configure `metadataBase` from `NEXT_PUBLIC_SITE_URL` with a localhost development fallback.
- Keep one title template and stable description defaults in the root layout.
- Add homepage canonical, Open Graph URL/title/description, and Twitter metadata.
- Add dynamic icon and Open Graph image using `ImageResponse`.
- Add `robots.ts`, `sitemap.ts`, and `manifest.ts`.
- Keep `/app/*` noindex/nofollow and out of the sitemap.
- Render only Organization and SoftwareApplication JSON-LD properties that match the public product copy.
- Use “TermBeacon” consistently in public metadata even though the repository slug remains `TermBacon`.

## Phase 6 — Accessibility & Motion

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
| `demo_contract_opened` | Contract row/detail navigation | `contract_id`, `vendor` |
| `decision_action_clicked` | Renew / Renegotiate / Cancel | `contract_id`, `action` |
| `upload_started` | Upload review action | `source` |
| `upload_review_viewed` | Suggested terms shown | `contract_id` |
| `extracted_terms_confirmed` | Human confirmation | `contract_id` |
| `pricing_cta_clicked` | Pricing “Start Free” | `plan=team` |
| `nav_cta_clicked` | Persistent “Start Free” | `viewport` |

The event contract is provider-neutral. Add an analytics SDK only after choosing a provider.

## Launch Checklist

### Product & Copy

- [x] Primary positioning says “Stop contracts from renewing before you decide.”
- [x] Primary conversion CTA says “Find My Cancel-By Dates.”
- [x] Secondary CTA says “See the Escape Window.”
- [x] “Start Free” is limited to navigation/pricing contexts.
- [x] AI is framed as suggestion + confirmation, not an autonomous decision maker.
- [x] No generic contract chatbot or legal-risk score exists.
- [x] No fake social proof or security certification is rendered.

### Interface

- [x] Signature Escape Window exists on marketing and product detail surfaces.
- [x] Decision Inbox uses 3 metrics.
- [x] Source clause sits beside extracted terms.
- [x] Mobile uses stacked decision/contract rows.
- [x] Destructive Cancel action requires a confirmation dialog.
- [x] Upload demo clearly states that it does not upload the selected file.

### Accessibility

- [x] Skip link is present.
- [x] Focus-visible styles are defined for custom interactive controls.
- [x] Mobile navigation uses a keyboard-accessible Sheet.
- [x] Dialogs are keyboard/focus managed by the shared primitive.
- [x] Form inputs are labeled.
- [x] Async demo processing and decision confirmation use polite live regions.
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

### Validation Before Production

> **Current handoff status (Aug 21, 2026):** source-level syntax/import/accessibility/SEO audits pass in the working copy. The exact `typecheck`, `build`, `preview`, and Wrangler commands cannot complete in this sandbox because repository dependencies are not installed and package-registry access is unavailable. Keep the repository’s existing `package-lock.json`, run `npm ci` in the real checkout, then complete the unchecked browser/OpenNext/deployment gates below.

- [ ] Install dependencies with the repository lockfile in a network-enabled environment.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Run `npm run preview` and verify OpenNext/Cloudflare runtime behavior.
- [ ] Test `/api/health` through the preview server.
- [ ] Verify `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, `/icon`, and `/opengraph-image` through HTTP.
- [ ] Test 320, 375, 768, 1024, and 1440 CSS-pixel widths in a real browser.
- [ ] Complete keyboard-only pass for navigation, dialogs, dropdowns, and upload flow.
- [ ] Complete browser `prefers-reduced-motion` pass.
- [ ] Set production `NEXT_PUBLIC_SITE_URL`.
- [ ] Verify Cloudflare credentials/account before `npm run deploy`.
- [ ] Smoke-test the deployed URL and `/api/health`.

## Future SaaS Roadmap

### After Launch Validation

- Real PDF ingestion and storage with explicit retention/deletion policy.
- Renewal-term extraction pipeline that returns source spans and a review state.
- Auth, workspace membership, and owner assignment.
- Persisted decision history and reminders.
- Email/calendar notifications around confirmed cancel-by dates.

### After Product-Market Evidence

- Bulk import and vendor normalization.
- Approval workflows for higher-exposure renewals.
- Renewal calendar and exported decision history.
- Role-based permissions and audit logging.
- Procurement/finance integrations justified by actual customer workflows.

### Explicitly Not On The Near-Term Roadmap

- Generic “chat with contracts.”
- General-purpose CLM authoring/redlining.
- E-signature.
- Vendor marketplace/discovery.
- Opaque AI legal-risk scoring.
- Dashboard expansion that does not improve a renewal decision.
