# Premium Care

Premium Care's public website and staff portal. The application is a React 19,
TypeScript, and Vite SPA backed by Supabase Auth, Postgres, Storage, and Edge
Functions.

## Features

- Public pages for home, about, services, careers, contact, privacy, and terms
- Eight service-detail pages
- Booking, contact, newsletter, and job-application forms
- Staff submission inboxes and dashboard
- Admin-only team, role, and invitation management

## Requirements

- Node.js 24 (see `.nvmrc`)
- npm 11
- A Supabase project and the Supabase CLI for database or function changes

## Local setup

From the repository root:

```bash
cd app
npm ci
cp .env.example .env.local
```

Set the browser-safe project values in `app/.env.local`:

```dotenv
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Never expose the Supabase `service_role` key through a `VITE_` variable. Vite
embeds those values in client JavaScript.

Apply the migrations to a linked Supabase project from `app/`:

```bash
npm run db:link
npm run db:push
```

Read [`supabase/README.md`](./supabase/README.md) before the first push. Edge
Function secrets and matching Vault values must be configured before applying
the maintenance migration.

Start Vite:

```bash
npm run dev
```

Without the two Supabase variables, public forms use local storage only during
Vite development and the portal remains unavailable. A production build with
missing variables does not silently retain submissions.

## First administrator

There is no public first-user bootstrap. After all migrations are applied, use
the SQL Editor to create a one-time, seven-day admin invitation, then register
at `/portal/join` with the exact email address and plaintext code. The complete
procedure is in [`supabase/README.md`](./supabase/README.md).

Later invitations are created under **Portal > Team**. The generated code is
shown only once, expires after seven days, and must be sent with the
`/portal/join` URL. Creating an invitation does not send an email.

## Scripts

Run these commands from `app/`:

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build production files in `app/dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint and fail on warnings |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run check` | Run lint, type-checking, and tests |
| `npm run sb -- <args>` | Run the Supabase CLI against the repository root |
| `npm run db:link` | Link the local Supabase directory to a project |
| `npm run db:push` | Apply pending migrations to the linked project |
| `npm run db:pull` | Pull remote schema changes into a migration |
| `npm run db:diff` | Diff the local database schema |
| `npm run db:status` | List accessible Supabase projects |

## Deployment

Do not deploy the repository root as the frontend. On Vercel, import the
repository and set **Root Directory** to `app`; Vercel will then use
`app/vercel.json`, run the Vite build, and serve `app/dist`. Set
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for every required Vercel
environment.

For another static host, use `app` as the base directory, `npm run build` as the
build command, and `dist` as the publish directory. The host must rewrite
unknown routes to `/index.html`; `app/public/_redirects` provides this rule for
hosts that support Netlify-style redirects.

For authentication links and password recovery, add the production URL and
required local URLs in **Supabase > Authentication > URL Configuration**. The
production site is `https://premiumcareinc.com`.

In the hosted Auth settings, require email confirmation, a minimum eight-character
password containing letters and numbers, secure password changes, and production
SMTP before inviting additional staff. `supabase/config.toml` contains matching
local defaults, but database migrations do not alter hosted Auth settings.

The database and the `submit-public`, `notify-submission`, and
`process-maintenance` Edge Functions are separate deployments; deploying the
Vite application does not apply migrations or deploy functions.

## Project content

| Content | File |
|---|---|
| Business details and navigation | `app/src/data/site.ts` |
| Photography URLs | `app/src/data/images.ts` |
| Services | `app/src/data/services.ts` |
| Values, FAQs, coverage, and jobs | `app/src/data/content.ts` |
| Design tokens and global styles | `app/src/index.css` |

## Known limitations

- Legal pages are drafts and require qualified legal review.
- A separate HIPAA Notice of Privacy Practices is not included.
- Staff invitation codes must be delivered manually.
- The public site is client-rendered. Per-route metadata is updated at runtime,
  but crawlers without JavaScript receive the base HTML metadata.
- Site photography uses third-party Unsplash images and should be replaced with
  approved first-party photography where possible.
