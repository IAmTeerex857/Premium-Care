# Brand assets

`premium-care-logo-original.png` — the logo as supplied: 1536×1024, light blue
and gold artwork on a **solid black background, no alpha channel**.

The two web assets in `app/public/` are derived from it:

| File | Crop | Size | Used by |
|---|---|---|---|
| `logo-full.png` | full lockup | 640×459 | Footer (`<Logo tone="dark">`) |
| `logo-mark.png` | emblem only | 256×216 | Header (`<Logo tone="light">`), favicon reference |

Both have real transparency. The black was removed by treating luminance as
coverage and un-premultiplying (`alpha = max(r,g,b)`, `colour /= alpha`), which
is correct for light artwork composited on black and leaves no dark halo on
light backgrounds — a hard colour-key would.

## Brand colours

| Token | Hex | Contrast on white | Use |
|---|---|---|---|
| `--color-sky` | `#9FD2EC` | 1.63:1 | **Decorative only.** Fills, and text on dark |
| `--color-gold` | `#E8CF95` | 1.52:1 | **Decorative only.** Accents, and text on dark |
| `--color-primary` | `#16536F` | 8.40:1 | Headings, nav |
| `--color-primary-light` | `#26718F` | 5.47:1 | Links, hover |
| `--color-primary-dark` | `#0D394F` | 12.24:1 | Footer, deep surfaces |
| `--color-gold-ink` | `#896B24` | 5.01:1 | Gold that can carry text |
| `--color-gold-strong` | `#D3A945` | 2.20:1 | Stars, decorative emphasis |

The two supplied brand colours are pastels drawn from a logo built for black
backgrounds. They cannot carry text on white at any size. The blue and gold
scales are derived from their hues (200° and 42°) so the palette still reads as
the brand while meeting WCAG AA.
