# VueNime

An anime discovery and tracking platform built with Nuxt 4 and Vue 3.

## Features

- Browse and search anime from the MyAnimeList database via [Jikan API](https://jikan.moe/)
- Save favorites and track watched anime
- OAuth authentication (Google, GitHub) and email/password
- Multi-language support (English, Spanish, Japanese)
- Server-side rendering with ISR caching

## Tech Stack

| Category  | Technology                                                                   |
| --------- | ---------------------------------------------------------------------------- |
| Framework | [Nuxt 4](https://nuxt.com/) / [Vue 3](https://vuejs.org/)                    |
| Styling   | [Tailwind CSS](https://tailwindcss.com/) via [Nuxt UI](https://ui.nuxt.com/) |
| State     | [Pinia](https://pinia.vuejs.org/) with persistence                           |
| Backend   | [Supabase](https://supabase.com/) (Auth, Database)                           |
| API       | [Jikan API](https://jikan.moe/) (MyAnimeList data)                           |
| i18n      | [@nuxtjs/i18n](https://i18n.nuxtjs.org/)                                     |
| Testing   | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)        |

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20+ or [Bun](https://bun.sh/)
- [Supabase](https://supabase.com/) project (free tier works)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/vuenime.git
cd vuenime
```

2. Install dependencies:

```bash
bun install
```

3. Configure environment variables:

```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `bun run dev`       | Start development server             |
| `bun run dev:host`  | Dev server with network access       |
| `bun run build`     | Build for production                 |
| `bun run preview`   | Preview production build             |
| `bun run test`      | Run all tests                        |
| `bun run test:e2e`  | Run Playwright E2E tests             |
| `bun run lint`      | Check code with ESLint               |
| `bun run lint:fix`  | Fix ESLint issues                    |
| `bun run typecheck` | TypeScript type checking             |
| `bun run prepush`   | Full check: lint + typecheck + build |

## Project Structure

```
app/
├── components/          # Vue components by domain
│   ├── anime/           # Anime cards, details, player
│   ├── auth/            # Login, signup forms
│   ├── favorites/       # Favorites list, filters
│   └── layout/          # Header, navigation, footer
├── composables/         # Vue 3 composition functions
├── pages/               # File-based routing
├── services/
│   ├── api/anime.ts     # Centralized anime API service
│   └── supabase/        # Database operations
├── stores/              # Pinia stores with persistence
└── middleware/          # Route guards

server/
├── api/jikan/           # Jikan API proxy
├── plugins/             # Nitro plugins
└── utils/               # Server utilities

shared/
├── types/               # Shared TypeScript types
├── schemas/             # Zod validation schemas
└── constants/           # Shared constants

i18n/                    # Translation files (en, es, ja)
```

## Environment Variables

| Variable               | Required | Default                       | Description          |
| ---------------------- | -------- | ----------------------------- | -------------------- |
| `SUPABASE_URL`         | Yes      | -                             | Supabase project URL |
| `SUPABASE_KEY`         | Yes      | -                             | Supabase anon key    |
| `NUXT_JIKAN_API_URL`   | No       | `https://api.jikan.moe/v4`    | Jikan API base URL   |
| `NUXT_PUBLIC_SITE_URL` | No       | `http://localhost:3000`       | Public site URL      |
| `LOG_LEVEL`            | No       | `info` (prod) / `debug` (dev) | Logging level        |

## Deployment

This project is optimized for [Vercel](https://vercel.com/) with:

- **Homepage**: Prerendered at build time
- **Anime pages**: ISR with 1-hour revalidation
- **API routes**: Edge cached for 10 minutes

Deploy with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/vuenime)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `refactor:` Code refactoring
- `docs:` Documentation changes
- `test:` Test additions/changes

## License

MIT
