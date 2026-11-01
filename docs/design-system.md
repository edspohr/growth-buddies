# Design system

Light system with dark bands. Tokens live in `src/input.css`; this file only explains how to use them.

## Tokens
| Token | Light | Inside `.band-dark` | Use |
|---|---|---|---|
| `--bg` | #FFFFFF | #0B0B0F | Page and band background |
| `--surface` | #F7F9FA | #16161D | Cards, alternate sections |
| `--line` | #E3E7EB | #2B2B38 | 1px borders |
| `--fg` | #1A1A2E | #FFFFFF | Headings, strong text |
| `--fg-soft` | #33364A | #DADCE3 | Body text |
| `--fg-muted` | #5B6170 | #B3B7C2 | Secondary text |
| `--accent` | #0097B2 | same | Fills, borders, icons. Never small text on white |
| `--accent-strong` | #00B5D6 | same | Hover |
| `--accent-text` | #005E70 | #00B5D6 | Accent text |
| `--on-accent` | #0B0B0F | same | Text on accent fills |
| `--metric` | #FB3D03 | same | Result metrics only, 24px or larger |

## Rules
- Never write raw colors or `text-white` in pages: use the tokens, so they flip inside `.band-dark`.
- `.band-dark` is for the hero, proof strip and final CTA only.
- Geist for headings (600, tight tracking), Inter for body at 17px.
- Keep the eyebrow pattern, pill buttons with arrow and 12 to 16px radius cards with 1px borders. No glows or shadows.

## Checks
`node scripts/checks/contrast.mjs <url>` runs axe color contrast on every page and must report 0 problems.
