# Library UI Palette And Style

This project has moved away from red and white as the primary visual language. The current direction is a warm library palette with sage green accents, cream surfaces, tan borders, dark brown text, and soft amber highlights.

## Core Palette

| Role | Token / Usage | Color |
| --- | --- | --- |
| Primary action | `primary` | `#2f5d50` |
| Primary text on action | `on-primary` | `#ffffff` |
| Soft primary surface | `primary-container` | `#dce9de` |
| Text on soft primary | `on-primary-container` | `#26453b` |
| App surface | `surface` | `#fbf7ef` |
| Page background | `background` | `#f6f0e5` |
| Main text | `on-surface` | `#2c261f` |
| Muted surface | `surface-variant` | `#f2eadc` |
| Muted text | `on-surface-variant` | `#7a6d5a` |
| Border | `outline` | `#ddd1be` |
| Soft border | `outline-variant` | `#ebe3d6` |
| Warm accent | `--catalog-warm-accent` | `#f0d3ac` |
| Error | `error` | `#b85c4d` |
| Error surface | `error-container` | `#f7dfd9` |
| Error text | `on-error-container` | `#7f362b` |

## Style Rules

- Use `bg-surface`, `bg-background`, or `#f6f0e5` for page-level backgrounds.
- Use `bg-[var(--catalog-panel)]` or white-tinted cream panels for cards, not pure red/white hero blocks.
- Use `text-on-surface` for primary copy and `text-on-surface-variant` for secondary copy.
- Use `border-outline-variant` for default card/input borders and `border-primary` for selected or focused states.
- Use `bg-primary` for primary CTAs and `bg-primary-container` for selected cards, badges, and soft emphasis.
- Keep shapes rounded and soft: `rounded-2xl`, `rounded-[2rem]`, and pill badges fit the updated style.
- Prefer `shadow-soft-card` or warm low-contrast shadows over colored red shadows.
- Use red only for actual error/destructive states through `error`, `error-container`, and `on-error-container`.

## Reference Pages

- `app/catalog/page.tsx`: warm cream catalog shell, dark brown text, rounded panels, soft book/category cards.
- `app/roomViewer/page.tsx`: shared semantic tokens such as `bg-surface`, `text-on-surface`, `text-on-surface-variant`, and tokenized admin layout spacing.
