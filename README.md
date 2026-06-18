# MailPilot — AI-Powered Command Inbox for Gmail & Google Calendar

A Superhuman-style workflow app built on top of **Corsair**, wiring Gmail and
Google Calendar into a single command center with AI-assisted email triage.

Built for the **Command Inbox: Corsair Hackathon** (ChaiCode x Corsair).

---

## The Problem

Gmail and Google Calendar are general-purpose tools. Every workflow — reading,
triaging, scheduling — takes more clicks than it should, and neither app lets
you decide what should be more prominent. Everyone uses email differently, but
the UI is the same for everyone.

## The Solution

MailPilot uses **Corsair** as the integration layer for Gmail and Google
Calendar, so the UI can be built exactly around how a fast-moving user actually
works: a unified inbox with AI-assisted priority sorting, a calendar with
private per-event notes, and one-click meeting creation — without ever leaving
the app or hitting Google's native UI.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Auth | NextAuth (Google OAuth, multi-tenant) |
| Integrations | Corsair (`corsair`, `@corsair-dev/gmail`, `@corsair-dev/googlecalendar`) |
| Database | Neon Postgres + Drizzle ORM |
| AI | Groq (`llama-3.1-8b-instant`) for email priority classification |
| UI | Tailwind CSS, Lucide icons |

---

## Corsair Features Used

- **Multi-tenant OAuth provisioning** — each logged-in user gets their own
  isolated Corsair tenant (`corsair.withTenant(email)`), with encrypted
  per-tenant credential storage (`corsair_accounts.config`, encrypted with a KEK).
- **Gmail plugin (`@corsair-dev/gmail`)** — used to list, read, and send email
  through Corsair's unified endpoint layer instead of calling the raw Gmail API.
- **Google Calendar plugin (`@corsair-dev/googlecalendar`)** — used for
  `events.getMany` (fetch upcoming events) and `events.create` (create new
  meetings) through Corsair's typed endpoint tree.
- **OAuth flow via Corsair** — `generateOAuthUrl()` / `processOAuthCallback()`
  drive the connect flow, with state encoding the tenant + plugin so tokens are
  written to the correct tenant row automatically.

---

## What Makes This Better Than Gmail/Calendar

1. **AI Priority Inbox** — every email is classified in a single batched Groq
   call into `urgent / important / normal / low`. A "Sort by priority" toggle
   re-orders the inbox so what actually needs action surfaces first, instead of
   a flat reverse-chronological list.
2. **Private calendar notes** — users can attach a private note to any calendar
   event (stored locally in Postgres, never written back to Google) — useful
   for prep notes, talking points, or context that shouldn't live in a shared
   calendar event description.
3. **One-screen meeting creation** — creating a Google Calendar event takes a
   single modal with title, description, date, and time — no need to open
   calendar.google.com.
4. **Keyboard-shortcut reference panel** — built in from the start, with the
   inbox UI/IA wired for fast keyboard-first triage (see `SHORTCUT_GROUPS` in
   `inbox/page.tsx`).

---

## Architecture Notes

- **Multi-tenancy**: Corsair is initialized once with `multiTenancy: true`.
  Every API route resolves `getCorsair(session.user.email)` to get a
  tenant-scoped client — no tenant ever sees another tenant's tokens or data.
- **Token encryption**: Corsair encrypts `access_token` / `refresh_token` /
  `expires_at` at rest in `corsair_accounts.config` using a KEK
  (`CORSAIR_KEK` env var) — verified via a dev-only `/api/debug/credentials`
  route during development (removed before production).
- **AI classification is additive, not blocking**: emails load immediately
  from Gmail via Corsair; classification runs in the background and emails
  re-render with priority badges as soon as it resolves. If classification
  fails, the inbox still works — AI augments the workflow, it doesn't gate it.

---

## Environment Variables

```env
DATABASE_URL=postgresql://...           # Neon Postgres connection string
CORSAIR_KEK=...                         # Corsair encryption key
AUTH_SECRET=...                         # NextAuth secret
AUTH_GOOGLE_ID=...                      # Google OAuth client ID
AUTH_GOOGLE_SECRET=...                  # Google OAuth client secret
APP_URL=http://localhost:3000           # Base app URL (no trailing slash)
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
GROQ_API_KEY=...                        # Groq API key for AI classification
```

> Google Cloud Console must have both of these registered as Authorized
> Redirect URIs:
> `http://localhost:3000/api/auth/callback/google` (NextAuth login)
> `http://localhost:3000/api/connect/callback` (Corsair OAuth — Gmail/Calendar)

---

## Setup

```bash
npm install
npm run dev
```

1. Log in with Google.
2. Go to `/connect` and connect Gmail and Google Calendar individually
   (separate OAuth grants — each writes encrypted tokens to your Corsair
   tenant row).
3. Visit `/inbox` to see your Gmail messages with AI priority badges, or
   `/calendar` to see and create events.

---

## Bonus Tasks Attempted

- [x] AI-based email priority classification via Groq (bonus task #3)
- [ ] Corsair MCP agent chat
- [ ] Realtime webhooks (Corsair built-in)
- [ ] Keyboard shortcut execution (panel built, key bindings WIP)
- [ ] Corsair search API for advanced Gmail search
- [ ] Vector DB for local fast search

---

## Submission Links

- **GitHub**: _add repo link_
- **Live deployment**: _add Vercel link_
- **Demo video**: _add video link_
- **X/Twitter post**: _add link_
- **LinkedIn post**: _add link_

Builder Mode On | MacBook Giveaway Hackathon
#chaicode #corsair-dev
