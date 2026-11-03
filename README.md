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

## Next steps

1. Create a Supabase project and run `supabase/schema.sql`.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and key in Vercel env vars; swap `lib/data.ts` for queries.
3. Import the n8n workflow and set `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `WA_PHONE_NUMBER_ID`, `OWNER_WHATSAPP`.
4. Add real clients, hosting and expiry dates.
5. Phase 2: WhatsApp intake, AI classification, task creation.

## Security notes

- Never store cPanel / WordPress / hosting passwords in the database. Use a vault and keep only `vault_ref`.
- Add authentication (Supabase Auth) before putting real client data in. The prototype has none.
- Use the official WhatsApp Cloud API, not unofficial WhatsApp Web libraries.
