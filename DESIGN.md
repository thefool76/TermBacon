---
version: alpha
name: TermBeacon
description: Focused visual system for vendor-renewal decisions across the marketing site and product shell.
colors:
  canvas: "#f7f6f0"
  surface: "#ffffff"
  ink: "#12211d"
  forest: "#123b32"
  acid: "#dfff45"
  muted-surface: "#eef1ec"
  line: "#d8ded8"
  muted-ink: "#64706b"
  risk-critical: "#b9412e"
  risk-warning: "#a86709"
  positive: "#2f765d"
typography:
  sans:
    fontFamily: "Inter Variable, Inter, Avenir Next, Segoe UI, ui-sans-serif, system-ui, sans-serif"
rounded:
  product: "0.625rem"
---

## Overview

TermBeacon presents vendor-renewal decisions as an operational finance workflow. The interface prioritizes the last actionable cancel-by date, its source terms, renewal exposure, ownership, and a clear Renew / Renegotiate / Cancel decision. Marketing and product surfaces use the same product language and shared proof components.

## Colors

Use `canvas` for the warm page background and `surface` for bounded product UI. Use `ink` for primary text and `forest` for primary product actions and navigation emphasis. Reserve `acid` for high-intent actions and small active accents; it is not a decorative background color. Use risk colors only when the displayed contract state warrants them.

## Typography

Use the shared `sans` stack across marketing and product surfaces. Marketing headings use decisive weight and tight tracking; product text stays compact and operational. Numerical deadlines, counts, dates, and currency values use tabular numerals.

## Layout

Marketing pages use spacious editorial sections with the live product interface as proof. Above the fold, the copy and product preview share the composition rather than placing a generic screenshot below a centered headline. Product pages prioritize the Decision Inbox, Escape Window, source clause, and decision actions over dashboard charts or large KPI grids.

Responsive layouts must preserve the decision hierarchy from narrow mobile widths upward. Desktop tables become purpose-built stacked rows on small screens rather than compressed multi-column tables.

## Elevation & Depth

Most surfaces communicate hierarchy with the shared line color and surface contrast. Shadows are restrained and reserved for the primary product proof, dialogs, menus, and other genuinely elevated surfaces. Do not use glow effects or glass-like depth.

## Shapes

Use the shared `product` radius for product cards and bounded surfaces. Buttons and compact controls stay visually tighter than large marketing containers. Avoid pill-shaped containers unless the content is truly badge-like.

## Components

The Escape Window is the signature TermBeacon component. It always shows Today → Cancel By → Renewal, days remaining, renewal exposure, notice requirement, owner or source context, and an explanation of how the cancel-by date was derived.

The Decision Inbox contains only the metrics and rows required to decide what needs attention next. The source-verification view keeps the highlighted agreement clause beside the extracted terms so confirmation never depends on an opaque model output.

Buttons name outcomes. Marketing acquisition uses “Find My Cancel-By Dates” as the primary outcome CTA and “See the Escape Window” as the secondary CTA; “Start Free” is limited to persistent navigation and pricing.

Motion is restrained corporate feedback. Use `150ms` for hover feedback, `220ms` for interactive state changes, and `400ms` for section/hero entrances with one shared `cubic-bezier(0.22, 1, 0.36, 1)` easing. Animate transform and opacity only; honor `prefers-reduced-motion` by removing nonessential motion.

## Do's and Don'ts

Do keep AI subordinate to the review workflow: AI suggests terms and a person confirms them.

Do keep risk deterministic and explainable using confirmed dates, exposure, ownership, and decision state. Reserve red and amber for risk/deadline data; decision buttons themselves stay neutral or primary so color never implies a legal recommendation.

Do show real code-built product UI as the primary visual proof.

Do keep source language visible near extracted terms and calculated deadlines.

Don't position TermBeacon as generic AI contract management or add “chat with your contracts.”

Don't use gradients, glassmorphism, decorative AI stars, stock photography, autoplay distractions, or dashboard charts without a decision purpose.

Don't invent customer logos, ratings, legal outcomes, security certifications, or savings claims.

Don't use `transition: all`; specify the animated properties and provide a reduced-motion path.
