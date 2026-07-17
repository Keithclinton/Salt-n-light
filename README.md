# Salt & Light

Website for Salt & Light, built from the ministry's Vision, Mission, and Core
Values (from the rollup banner artwork), including a public feedback form and
a password-protected admin panel to review submissions.

**Stack:** React + Vite (frontend) · NestJS + Prisma (API) · PostgreSQL ·
deployed as a single Vercel project.

## Project structure

```
apps/
  web/    React + Vite frontend (pages: Home, Feedback, Admin login, Admin dashboard)
  api/    NestJS API (feedback CRUD + admin JWT auth), Prisma schema
api/
  [[...path]].ts  Serverless catch-all that boots NestJS for Vercel
vercel.json  Builds the SPA + API function, routes non-/api paths to the SPA
```

Brand colors extracted from the banner artwork are defined as CSS variables in
`apps/web/src/styles/theme.css`: navy `#16324F`, gold `#E0A63E`, cream
`#FBF3E7`.

## 1. Install dependencies

From the repo root (uses npm workspaces):

```bash
npm install
```

## 2. Configure environment variables

Copy the example env files and fill them in:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

`apps/api/.env`:
- `DATABASE_URL` — a PostgreSQL connection string (e.g. [Neon](https://neon.tech),
  [Supabase](https://supabase.com), or Vercel Postgres — all have free tiers).
- `DATABASE_URL_UNPOOLED` — the direct (non-pooled) connection string, used only
  for migrations. Locally, set it to the same value as `DATABASE_URL`.
- `JWT_SECRET` — any long random string.
- `ADMIN_USERNAME` — the admin login username.
- `ADMIN_PASSWORD_HASH` — a bcrypt hash of the admin password. Generate one with:

  ```bash
  npm run hash-password --workspace apps/api -- "your-password"
  ```

  Copy the printed `ADMIN_PASSWORD_HASH=...` line into `apps/api/.env`.
- `CORS_ORIGIN` — comma-separated list of allowed frontend origins.

## 3. Set up the database

If you don't already have a Postgres to point at, run one locally with Docker:

```bash
docker run -d --name saltlight-pg -p 5432:5432 \
  -e POSTGRES_USER=saltlight -e POSTGRES_PASSWORD=devpass -e POSTGRES_DB=saltlight \
  postgres:16-alpine
```

Then set both `DATABASE_URL` and `DATABASE_URL_UNPOOLED` in `apps/api/.env` to
`postgresql://saltlight:devpass@localhost:5432/saltlight?schema=public` and run:

```bash
npm run prisma:migrate --workspace apps/api
```

This creates the `Feedback`, `Update`, and `Devotional` tables from
`apps/api/prisma/schema.prisma`.

## 4. Run locally

In two terminals:

```bash
npm run dev:api   # NestJS on http://localhost:3001
npm run dev:web   # Vite on http://localhost:5173 (proxies /api to the API)
```

Visit `http://localhost:5173`. The admin panel is at `/admin/login`.

## 5. Deploy to Vercel

The whole project deploys as **one** Vercel project: the React app as static
output, and the NestJS API as a single serverless function
(`api/[[...path]].ts`, a catch-all so every `/api/*` route reaches Nest).

### 5a. Project settings (do this first)

In **Settings → Build & Deployment**:

- **Root Directory** must be `./` (the repo root). If it points at `apps/api`,
  Vercel builds the API alone, ignores `vercel.json`, and fails with
  *"No Output Directory named public found"*.
- Leave **Build Command** and **Output Directory** on default so `vercel.json`
  controls them.

### 5b. Database

Add Postgres from **Storage → Create Database → Neon**. The integration injects
`DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct) into the project
automatically — both are required:

- Queries run through the **pooled** URL. Serverless opens a connection per
  invocation, and a direct connection would exhaust Postgres' connection limit.
- Migrations run through the **unpooled** URL (`directUrl` in the schema);
  migrations cannot run through a pooler.

### 5c. Remaining environment variables

Add these yourself under **Settings → Environment Variables**:

| Variable | Value |
| --- | --- |
| `JWT_SECRET` | A long random string — generate a **new** one, don't reuse the local value |
| `ADMIN_USERNAME` | The admin login username |
| `ADMIN_PASSWORD_HASH` | bcrypt hash from `npm run hash-password --workspace apps/api -- "your-password"` |
| `CORS_ORIGIN` | Your production domain, e.g. `https://your-site.vercel.app` |

### 5d. Deploy

Push to GitHub and Vercel builds automatically. `vercel-build` runs
`prisma generate` → `prisma migrate deploy` → `vite build`, so the production
schema is created and kept in sync on every deploy — there is no separate
migration step to remember.

`VITE_API_URL` can stay blank: the site and API share one domain.

## Admin panel

- `/admin/login` — sign in with `ADMIN_USERNAME` / the password you hashed.
- `/admin` — view all feedback submissions, see response count and average
  rating, and delete entries. Protected by a JWT issued on login (12h expiry).
- Also manage **Updates** (activity news shown on the homepage) and
  **Devotionals** from the same dashboard — these are stored in the database,
  so posting one takes effect immediately with no redeploy.

## Update posters

Each update can carry an optional poster image. Unlike the activity gallery,
these are **uploaded from the admin panel** — no code change, no redeploy.

Setup (once): in Vercel, **Storage → Create Database → Blob**. Connect it to the
project and it injects `BLOB_READ_WRITE_TOKEN` automatically. Without that
token, posting an update still works; only the poster upload fails.

How it works: the browser asks `POST /api/uploads` (admin JWT required) for a
short-lived upload token, then sends the file **straight to Vercel Blob**. The
file never passes through the API function, so the 4.5 MB serverless request
body limit does not apply. The returned URL is saved as `Update.imageUrl`.

Constraints, enforced on both sides:

- JPG, PNG, WEBP or GIF, max 8 MB.
- `imageUrl` is validated against `*.blob.vercel-storage.com`, so a stolen admin
  token cannot point the homepage at an arbitrary third-party image.

To upload posters while developing locally, copy `BLOB_READ_WRITE_TOKEN` from
the Blob store's `.env.local` tab into `apps/api/.env`.

## Activity photos

Photos are **static frontend assets** — they are not uploaded through the admin
panel, because Vercel's serverless functions have no persistent filesystem.
Changing them is a code change plus a redeploy.

To add or change a photo:

1. Drop the image into `apps/web/public/images/activities/`.
2. Add an entry to the list in `apps/web/src/data/activityPhotos.ts`:

   ```ts
   { src: '/images/activities/activity-07.jpg', alt: 'Members singing during worship' },
   ```

3. Commit and push — Vercel redeploys automatically.

The gallery renders at `/#gallery` as a mosaic (masonry) so photos of any shape
appear uncropped, with a click-to-enlarge lightbox (arrow keys to move between
photos, `Esc` to close). It hides itself when the list is empty.

There are deliberately **no captions or categories** — the photos are an
unordered collection. `alt` text is still required: it is never shown on screen,
but screen readers and search engines rely on it.

**Resize and compress before adding.** Phone photos are often 4–8 MB and will
make the page crawl. Aim for ~1600px wide and under ~300 KB. If a photo has a
lot of dead space (sky, floor), crop to the subject first — it both looks better
in the mosaic and cuts the file size. Quick way to do both:

```bash
python3 -c "
from PIL import Image, ImageOps
im = ImageOps.exif_transpose(Image.open('IN.jpg'))
im.thumbnail((1600, 1600), Image.LANCZOS)
im.convert('RGB').save('apps/web/public/images/activities/OUT.jpg',
                       quality=82, optimize=True, progressive=True)"
```

If you later want non-technical people to add photos without a redeploy, the
upgrade path is Vercel Blob for the files plus a `Photo` table — the gallery
would then fetch from an API instead of importing this list.
