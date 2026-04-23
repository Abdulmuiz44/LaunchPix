# Design Brain

This project now uses a root `DESIGN.md` file as the canonical visual system for LaunchPix.

## Files

- `DESIGN.md`: the LaunchPix-specific design system in Google DESIGN.md format.
- `docs/design-md/google-designmd-spec.md`: local copy of the upstream Google DESIGN.md specification.

## How to use it

- Read `DESIGN.md` before redesigning pages, components, or dashboard flows.
- Treat the token front matter as the source of truth for color, typography, spacing, radius, and reusable surface patterns.
- Treat the prose sections as behavioral rules for hierarchy, composition, and conversion-focused UI decisions.

## What this is for

The goal is to stop ad hoc UI decisions. New screens should inherit the same layout logic:

- dark control-room shell
- restrained purple conversion accents
- cyan utility/status accents
- dense use of horizontal space on desktop
- fewer isolated cards and fewer blank dead zones

## Optional tooling

If you want to lint the file against the upstream format later, use the official CLI:

```bash
npx @google/design.md lint DESIGN.md
```

If you want version-to-version design reviews later, use:

```bash
npx @google/design.md diff DESIGN.md DESIGN.previous.md
```
