# Deskside

Personal IT support: log the tech you own, get AI-grounded compatibility answers and
everyday IT help. Next.js (App Router) + Supabase (auth, Postgres, storage) + the
Anthropic API called only from server routes.

Covers milestones 1–3 of the build plan: auth, device intake (photo → AI identification →
device passport cards with edit/delete), and the compatibility chat with a verdict badge.
SMS, voice, and payments are future milestones — not implemented here.

## Setup

### 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/schema.sql` from this repo. It creates the `users`,
   `devices`, `conversations`, and `messages` tables, a trigger that populates `users` on
   signup, RLS policies scoping every table to `auth.uid()`, and a private
   `device-photos` storage bucket with per-user folder policies.
3. Under Authentication → Providers, enable **Email** and **Google**. For Google you'll
   need an OAuth client ID/secret from the Google Cloud Console — configure it in
   Supabase's Google provider settings (not as an app env var).
4. Under Authentication → URL Configuration, add your app's `/auth/callback` URL (e.g.
   `http://localhost:3000/auth/callback` for local dev, plus your deployed URL) as a
   redirect URL.

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

- `ANTHROPIC_API_KEY` — server-only, used by `src/app/api/devices/identify` and
  `src/app/api/chat`. Never sent to the client.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase Project
  Settings → API.
- `SUPABASE_SERVICE_ROLE_KEY` — included per the project spec for future admin-privileged
  operations. Nothing in this codebase currently uses it: every server route acts as the
  signed-in user via their session cookie, so RLS applies everywhere. Keep it out of any
  client bundle if you do start using it.

### 3. Run

```bash
npm install
npm run dev
```

## How the AI calls stay server-side

- `POST /api/devices/identify` — takes a Supabase Storage path for an already-uploaded
  photo, downloads it server-side, sends it to Claude vision, inserts the identified
  device row (RLS-scoped to the caller), returns it.
- `POST /api/chat` — looks up the authenticated user's device rows from Postgres itself
  (never trusts a client-sent inventory), builds the system prompt from that data, calls
  Claude with the `web_search` tool enabled, persists both sides of the exchange, and
  returns the reply plus a parsed verdict.

Device photo uploads and plain device/message CRUD happen directly from the browser via
the Supabase client — RLS policies (not app code) enforce that a user can only read/write
their own rows and files.

## What's not built yet

SMS (Twilio), voice, and payments are intentionally out of scope for this phase.
