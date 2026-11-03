# RK Ops — Client Operations (Phase 1)

Internal dashboard for RK Digital: clients, sites, domain/hosting/SSL expiries, WhatsApp requests and reminders.

**Status:** prototype with demo data. Glassmorphism UI on Next.js 15 + Tailwind.

## Run locally

```bash
npm install
npm run dev
```

## Structure

| Path | Purpose |
|---|---|
| `app/` | Pages: dashboard, clients, sites, expiries, requests, reminders |
| `components/` | Glass UI primitives, sidebar, filterable tables |
| `lib/data.ts` | Demo data. Replace with Supabase queries |
| `supabase/schema.sql` | Database schema, `expiry_items` view, RLS |
| `n8n/expiry-reminders.json` | Daily expiry check, WhatsApp to owner and client |

## Connect Supabase (login + real data)

1. Create a Supabase project. In **Authentication > Sign In / Providers**, turn **off** "Allow new users to sign up".
2. SQL editor: run `supabase/schema.sql`, then add yourself as owner:
   `insert into app_owners (email) values ('your-login-email');`
3. Authentication > Users > **Add user** with that email and a strong password.
4. In Vercel project > Settings > Environment Variables add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the anon / publishable key, never the service key)
5. Redeploy. The app now requires login and reads real data. Without these variables it stays in demo mode.

## How it works

- `middleware.ts` redirects every page to `/login` when Supabase is configured.
- `lib/db.ts` loads clients, hostings, sites and requests; `lib/data.ts` holds demo data used only when Supabase is not configured.
- Row Level Security allows only emails listed in `app_owners`.

## Next steps

1. Add / edit forms for clients, hosting and sites.
2. Import the n8n workflow and set `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `WA_PHONE_NUMBER_ID`, `OWNER_WHATSAPP`.
3. Phase 2: WhatsApp intake, AI classification, task creation.

## Security notes

- Never store cPanel / WordPress / hosting passwords in the database. Use a vault and keep only `vault_ref`.
- Keep the Supabase service key out of this app; it belongs only in n8n.
- Use the official WhatsApp Cloud API, not unofficial WhatsApp Web libraries.
