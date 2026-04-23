---
version: alpha
name: LaunchPix
description: Dark, conversion-focused product-launch studio for turning raw screenshots into polished launch assets.
colors:
  ink-950: "#050B16"
  ink-900: "#07101F"
  ink-850: "#0A1426"
  ink-800: "#111C33"
  ink-700: "#1F2B42"
  line-subtle: "#243247"
  line-strong: "#31415C"
  text-primary: "#F7F9FC"
  text-secondary: "#A5B3CB"
  text-muted: "#70819E"
  violet-500: "#7C3AED"
  violet-400: "#9F67FF"
  violet-300: "#B78CFF"
  cyan-400: "#2FC7E6"
  cyan-300: "#73E5F5"
  green-400: "#3BCB8A"
  amber-400: "#F7B955"
  red-400: "#FF6B7A"
  on-dark: "#F7F9FC"
  on-accent: "#FFFFFF"
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 3.5rem
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Inter
    fontSize: 2.75rem
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: -0.035em
  heading-xl:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.03em
  heading-lg:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.025em
  title-md:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.14em
rounded:
  xs: 10px
  sm: 14px
  md: 18px
  lg: 24px
  xl: 32px
spacing:
  0: 0px
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  10: 40px
  12: 48px
  16: 64px
components:
  app-shell:
    backgroundColor: "{colors.ink-950}"
    textColor: "{colors.text-primary}"
    padding: 32px
  sidebar:
    backgroundColor: "{colors.ink-900}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.lg}"
    padding: 16px
  sidebar-active-item:
    backgroundColor: "{colors.ink-700}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.sm}"
    padding: 12px
  surface-card:
    backgroundColor: "{colors.ink-850}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: 24px
  surface-card-muted:
    backgroundColor: "{colors.ink-800}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: 20px
  button-primary:
    backgroundColor: "{colors.violet-500}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.sm}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.violet-400}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.sm}"
    padding: 12px
  button-secondary:
    backgroundColor: "{colors.ink-700}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.sm}"
    padding: 12px
  badge-success:
    backgroundColor: "#163B2B"
    textColor: "{colors.green-400}"
    rounded: "{rounded.xs}"
    padding: 8px
  badge-warning:
    backgroundColor: "#3A2A12"
    textColor: "{colors.amber-400}"
    rounded: "{rounded.xs}"
    padding: 8px
  badge-info:
    backgroundColor: "#19273B"
    textColor: "{colors.cyan-300}"
    rounded: "{rounded.xs}"
    padding: 8px
  input-field:
    backgroundColor: "{colors.ink-800}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: 12px
    height: 48px
  data-table:
    backgroundColor: "{colors.ink-850}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: 24px
---

## Overview

LaunchPix should feel like a focused control room for product launches, not a generic SaaS dashboard. The product sells speed, polish, and confidence. Every screen should make the user feel that their raw screenshots are being turned into premium launch visuals with minimal friction.

The visual language is dark, sharp, and restrained. Purple is the conversion color. Cyan is a support accent for status, highlights, and utility. Surfaces should stack with clear contrast, not with excessive gradients or decorative noise. Layout should prioritize speed of scanning: strong titles, compact metadata, obvious primary actions, and dense use of horizontal space.

## Colors

The palette is anchored in deep navy-black surfaces with cool text and vivid accents.

- **Ink layers:** Use `ink-950`, `ink-900`, `ink-850`, and `ink-800` to build app depth. The background should stay dark enough that cards and controls read immediately.
- **Primary text:** `text-primary` is the default for headings, values, and action labels.
- **Secondary text:** `text-secondary` is for descriptions, helper copy, and low-priority metadata.
- **Muted text:** `text-muted` is for tertiary timestamps, table metadata, and dividers.
- **Purple accents:** `violet-500` and `violet-400` are reserved for primary CTAs, active states, and key progress moments.
- **Cyan accents:** `cyan-400` and `cyan-300` should support badges, progress, utility chips, and plan/credit affordances.
- **Semantic colors:** Use `green-400`, `amber-400`, and `red-400` sparingly for system status.

Avoid introducing unrelated bright hues. The app should feel coherent and controlled, not colorful for its own sake.

## Typography

Typography should be compact, clean, and assertive. Inter is acceptable here because the product needs clarity over ornament, but the hierarchy must be deliberate.

- **Display styles:** Use `display-xl` and `display-lg` only for hero statements and the most important dashboard headlines.
- **Heading styles:** Use `heading-xl` and `heading-lg` for section titles and major card headers.
- **Body styles:** Default to `body-md`. Use `body-sm` for dense dashboard metadata and row details.
- **Labels:** `label-md` and `label-caps` should control navigation, chips, table headings, and supporting UI labels.

Titles should be short and high-contrast. Paragraphs should stay concise. Long explanatory copy usually means the interface is doing too much.

## Layout

Layouts should use wide horizontal composition, especially on desktop. Blank dead zones are a failure. If a page has spare width, use it for summary rails, comparison columns, activity feeds, tables, previews, or secondary actions.

- Keep the sidebar fixed and visually lighter than the content area.
- Use a clear top content band: page heading, utility search, state chips, and primary action.
- Follow with high-value information in descending order: current project, metrics, workflow, recents, billing.
- Prefer 2-column and 3-column compositions over isolated centered cards.
- Empty states must still feel like a real workspace. They should teach the next step while filling the viewport with structure.

Mobile should collapse stacked regions cleanly, but desktop is the primary reference for dashboard composition.

## Elevation & Depth

Depth comes from layer contrast, borders, and subtle glow, not heavy blur or generic shadow stacks.

- Use borders to separate dark surfaces before reaching for shadow.
- Primary actions can carry a mild luminous edge from the purple accent.
- Preview tiles and KPI cards should have slightly brighter surfaces than the shell background.
- Avoid excessive transparency that weakens legibility.

## Shapes

The product should feel modern and premium, so corners are soft but not bubbly.

- Use `rounded.sm` for controls and nav items.
- Use `rounded.md` for cards, tables, and larger content surfaces.
- Use `rounded.lg` or `rounded.xl` only for major hero or shell treatments.

Over-rounding makes the app feel toy-like. Keep the geometry disciplined.

## Components

### Sidebar

The sidebar is a navigation rail, not the hero element. It should be narrow, stable, and low-noise. Active items need strong contrast, but inactive items should sit back.

### Header / Command Bar

The header should compress search, plan state, credits, and primary action into a compact row. Avoid oversized controls or decorative containers.

### KPI Cards

KPI cards should emphasize one number, one label, and one support line. If a card cannot communicate value in three seconds, it is too busy.

### Project Surfaces

Current project views should combine status, metadata, progress, and action buttons in one glance. Don’t scatter related information across disconnected cards.

### Tables and Lists

Projects, assets, and activity should use dense, readable list patterns with enough spacing to scan quickly. Use row dividers and aligned metadata rather than oversized cards when volume grows.

## Do's and Don'ts

### Do

- Use the full desktop canvas to communicate progress and product value.
- Keep primary actions obvious and singular.
- Make empty states look like usable workspaces, not placeholders.
- Use purple for conversion and cyan for utility.
- Keep text short, concrete, and product-focused.

### Don't

- Don’t center a lone card in a wide content area and leave the rest empty.
- Don’t let the sidebar visually outweigh the page content.
- Don’t mix too many accent colors or gradients.
- Don’t hide important project state behind multiple cards when one unified panel would do.
- Don’t rely on vague marketing copy inside product screens.
