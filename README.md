# Premium Care

A premium health & care website with a role-based employee portal, built from
[`design-specification.md`](./design-specification.md).

- **Public site** — 8 pages (Home, About, Services, Insurance, Careers, Blog, Contact, Referral)
  plus service detail, blog post, and legal pages.
- **Staff portal** — `/portal`, with submission inboxes, a stats dashboard, and
  admin-only team management.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite 8 (SPA) |
| Language | TypeScript (strict) |
| Routing | react-router-dom v7 |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Backend | Supabase (Postgres + Auth + RLS + Realtime) |
| Icons | lucide-react |

---

## Setup

### 1. Install

```bash
cd app
npm install
```

### 2. Apply the database schema

Open your Supabase project → **SQL Editor** → **New query**, paste the entire
contents of [`supabase/schema.sql`](./supabase/schema.sql), and run it.

It is idempotent — safe to run again after edits.

This creates:

| Object | Purpose |
|---|---|
| `profiles` | One row per auth user, holds `role` (`admin` \| `member`) and `is_active` |
| `invites` | Pending invitations created by admins |
| `submissions` | Every public form submission (`booking`, `contact`, `referral`, `application`, `newsletter`) |
| `submission_notes` | Internal staff notes on a submission |
| `handle_new_user()` | Signup trigger — grants the invited role, or bootstraps the first account as admin |
| RLS policies | Anonymous visitors may **insert** submissions but never read them; reading requires an active staff profile |

### 3. Add your keys

```bash
cd app
cp .env.example .env.local
```

Fill in from **Supabase → Project Settings → API**:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

> **Never** put the `service_role` key here. Anything prefixed `VITE_` is bundled
> into browser JavaScript and readable by every visitor.

### 4. Run

```bash
npm run dev
```

Without `.env.local`, the site still runs in **demo mode**: forms save to
`localStorage` and the portal shows a "not connected" screen.

---

## Creating the first admin

The signup trigger bootstraps the **very first account** as an admin.

1. Go to `/portal/join`
2. Sign up with your own email and a password
3. You land in the portal as **Administrator**

Every later account requires an invitation, so the bootstrap can only happen once.

> If your project has **Confirm email** enabled (Authentication → Providers → Email),
> click the confirmation link before signing in. Turning it off makes local testing faster.

## Adding members

`Portal → Team → Invite a member`:

1. Enter their email and pick **Member** or **Admin**
2. Send them the join link (`/portal/join`)
3. They sign up **with that exact email address**, and the database trigger grants
   the role you chose

Signup with an un-invited email is rejected at the database level.

### Why invitations instead of direct account creation

Creating a user account outright requires Supabase's `service_role` key, which
cannot ship in a browser app — any visitor could read it from the bundle and take
over the database. The invite flow achieves the same outcome using only the anon
key, with the role decision enforced in Postgres rather than in client JavaScript.

If you later want an admin to set a member's password directly, deploy a Supabase
Edge Function holding the `service_role` key server-side and call that instead.

---

## Roles

| Capability | Member | Admin |
|---|:---:|:---:|
| View all submission inboxes | ✅ | ✅ |
| Change status / assign submissions | ✅ | ✅ |
| Add internal notes | ✅ | ✅ |
| Delete a submission | ❌ | ✅ |
| Invite & revoke members | ❌ | ✅ |
| Change roles, deactivate accounts | ❌ | ✅ |

Enforced twice: hidden in the UI, and blocked by RLS policies in Postgres.

---

## Where to change things

| What | File |
|---|---|
| Phone, email, address, hours, nav | `app/src/data/site.ts` |
| All photography (Unsplash URLs) | `app/src/data/images.ts` |
| Services | `app/src/data/services.ts` |
| Values, team, FAQs, coverage, jobs | `app/src/data/content.ts` |
| Blog posts | `app/src/data/blog.ts` |
| Colors, type scale, motion tokens | `app/src/index.css` (`@theme` block) |

Photography is centralized: swap the URLs in `images.ts` when real photos are ready
and nothing else changes.

---

## Scripts

```bash
npm run dev       # dev server
npm run build     # typecheck + production build to dist/
npm run preview   # serve the production build
```

## Deploying

`vercel.json` and `public/_redirects` are included, so SPA deep links work on
Vercel and Netlify. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as
environment variables in your host, and add your deployed origin to
**Supabase → Authentication → URL Configuration → Redirect URLs** so password
resets return to the right place.

---

## Responsive verification

Checked with headless Chromium across **15 routes × 8 viewports** (320px through
1440px). Current state: **zero horizontal overflow, zero console errors**, and all
interactive controls meet the WCAG 2.5.8 24×24px target size.

Re-run it any time the layout changes:

```bash
npm run build && npm run preview -- --port 4173
# then run the audit script against http://localhost:4173
```

## Known gaps

- **Legal pages are drafts, not filed documents.** Both are substantive and
  structured for a US home-care agency, but they must be reviewed and adapted by
  counsel — HIPAA, state privacy statutes, and home-care licensing rules vary by
  jurisdiction. Each page carries a visible "Draft for review" banner; delete that
  banner in `src/pages/Legal.tsx` once real copy is in.
- **A HIPAA Notice of Privacy Practices is still needed.** The Privacy Policy
  references it as a separate document given to clients at intake, which is the
  correct structure — but that document does not exist yet.
- **Invitations are not emailed.** The portal creates the invite and gives you a
  join link to pass along; wiring an email provider is a separate step.
- **No SSR.** This is a client-rendered SPA per the chosen stack; `useSeo` sets
  per-route title, description, and canonical tags, but crawlers that do not execute
  JavaScript will see only the shell. Prerendering or a move to Next.js would fix it.
- **Photography is placeholder.** All Unsplash hotlinks, centralized in
  `src/data/images.ts` — verified loading, but they are stock and should be replaced
  with real photography of your team and clients (with consent).
