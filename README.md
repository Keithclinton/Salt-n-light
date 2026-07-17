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
  index.ts  Serverless entry that boots the NestJS app for Vercel
vercel.json  Routes /api/* to the NestJS function, everything else to the SPA
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
- `JWT_SECRET` — any long random string.
- `ADMIN_USERNAME` — the admin login username.
- `ADMIN_PASSWORD_HASH` — a bcrypt hash of the admin password. Generate one with:

  ```bash
  npm run hash-password --workspace apps/api -- "your-password"
  ```

  Copy the printed `ADMIN_PASSWORD_HASH=...` line into `apps/api/.env`.
- `CORS_ORIGIN` — comma-separated list of allowed frontend origins.

## 3. Set up the database

```bash
npm run prisma:migrate --workspace apps/api
```

This creates the `Feedback` table using `apps/api/prisma/schema.prisma`.

## 4. Run locally

In two terminals:

```bash
npm run dev:api   # NestJS on http://localhost:3001
npm run dev:web   # Vite on http://localhost:5173 (proxies /api to the API)
```

Visit `http://localhost:5173`. The admin panel is at `/admin/login`.

## 5. Deploy to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Vercel will read `vercel.json`, building the React app as static output and
   the NestJS app (`api/index.ts`) as a serverless function.
3. In the Vercel project settings, add the same environment variables from
   `apps/api/.env` (`DATABASE_URL`, `JWT_SECRET`, `ADMIN_USERNAME`,
   `ADMIN_PASSWORD_HASH`, `CORS_ORIGIN` set to your production domain).
4. Run `npx prisma migrate deploy` (with `DATABASE_URL` pointed at your
   production database) once before/after the first deploy to create the
   schema.
5. Deploy. The site, feedback form, and `/admin` panel are all served from the
   same domain — no separate API URL needed (`VITE_API_URL` can stay blank).

## Admin panel

- `/admin/login` — sign in with `ADMIN_USERNAME` / the password you hashed.
- `/admin` — view all feedback submissions, see response count and average
  rating, and delete entries. Protected by a JWT issued on login (12h expiry).
- Also manage **Updates** (activity news shown on the homepage) and
  **Devotionals** from the same dashboard — these are stored in the database,
  so posting one takes effect immediately with no redeploy.

## Activity photos

Photos are **static frontend assets** — they are not uploaded through the admin
panel, because Vercel's serverless functions have no persistent filesystem.
Changing them is a code change plus a redeploy.

To add or change a photo:

1. Drop the image into `apps/web/public/images/activities/`.
2. Add an entry to the list in `apps/web/src/data/activityPhotos.ts`:

   ```ts
   { src: '/images/activities/retreat.jpg', alt: 'Youth at the annual retreat', caption: 'Youth Retreat' },
   ```

3. Delete the `placeholder-*.svg` files and their entries once real photos are in.
4. Commit and push — Vercel redeploys automatically.

The gallery renders at `/#gallery` with a click-to-enlarge lightbox (arrow keys
to move between photos, `Esc` to close). It hides itself when the list is empty.

**Compress photos before adding them.** Phone photos are often 4–8 MB each and
will make the page crawl; aim for roughly 1600px wide and under ~300 KB.

If you later want non-technical people to add photos without a redeploy, the
upgrade path is Vercel Blob for the files plus a `Photo` table — the gallery
would then fetch from an API instead of importing this list.
