# Sovan — Landing Page

Landing page for [Sovan](https://sovan.app) — empowering indie artists with true ownership and human-verified authenticity.

## Tech Stack

- **Frontend**: Vite 5 + React 18 + TypeScript + Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (waitlist)
- **Hosting**: GitHub Pages (via GitHub Actions)

## Getting Started

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous API key |

Get these from your [Supabase project dashboard](https://supabase.com/dashboard) → Settings → API.

### Development

```bash
npm run dev
```

Opens at `http://localhost:5000`.

### Build

```bash
npm run build
```

## Database

The Supabase migration in `supabase/migrations/` creates the `waitlist` table with email signup and row-level security (RLS):

- **Anonymous** users can INSERT into waitlist
- **Authenticated** users can SELECT all entries

Apply the migration in the Supabase SQL Editor or via Supabase CLI.

## Deployment

Pushes to `main` trigger GitHub Actions (`.github/workflows/deploy.yml`):

1. `npm install` + `npm run build`
2. Deploy `dist/` to GitHub Pages

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous API key |

## Project Structure

```
├── .github/workflows/deploy.yml   # GitHub Pages deploy
├── src/
│   ├── App.tsx                    # Main landing page component
│   ├── main.tsx                   # React entry point
│   ├── index.css                  # Tailwind + custom styles
│   └── lib/supabase.ts            # Supabase client
├── supabase/migrations/           # Database migrations
├── public/logo.png                # Sovan logo
└── masterplan/                    # Business & product planning docs
```

## License

Private. All rights reserved.