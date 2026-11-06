# Abhay Kargeti

My personal site. I'm a fullstack AI engineer.

## Features

- Full-screen sections over a custom WebGL liquid background whose color changes from section to section
- Hover typography where letters near the cursor gain weight and react to its speed
- Glass navigation with edge refraction on desktop Chromium browsers and a blur fallback elsewhere
- Light, dark, and system themes
- GitHub contribution calendar
- Reduced-motion support and responsive layouts

## Tech stack

React, TypeScript, Vite, and CSS I wrote by hand. I wrote the animations and the WebGL shader myself, without any animation or 3D library.

## Run it locally

Requires [Bun](https://bun.sh).

```bash
bun install
bun run dev
```

| Command | What it does |
| --- | --- |
| `bun run dev` | Starts the development server |
| `bun run build` | Type-checks the project and writes the production site to `dist` |
| `bun run preview` | Serves the production build locally |

## Update the content

The text, links, experience, and projects are in `src/content.ts`.

## License

Copyright (c) 2026 Abhay Kargeti. All rights reserved.

The code is public so you can see how I built it. Please don't copy, modify, deploy, or reuse any part of the code, design, or content without asking me first. See [LICENSE](LICENSE).
