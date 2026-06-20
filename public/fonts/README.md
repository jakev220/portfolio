# Fonts

Self-hosted **Neue Montreal** files load via `@font-face` in `src/styles/globals.css`.

Add the licensed font files here with these exact names:

- `NeueMontreal-Regular.woff2` (weight 400, normal)
- `NeueMontreal-Italic.woff2` (weight 400, italic)
- `NeueMontreal-Bold.woff2` (weight 700, normal)
- `NeueMontreal-BoldItalic.woff2` (weight 700, italic)

Until these exist, the site falls back to the system sans-serif stack defined in
`--font-sans`. No build error occurs when they are missing.

> Prefer `next/font/local`? Move the files into `src/app/fonts/`, create a font
> loader module, expose its `.variable` as `--font-sans`, and remove the
> `@font-face` block from `globals.css`.
