# ADVA — Activation of AI, enquiries and HQ

The website safely deploys without secrets. The public Services menu, animation and flashlight work immediately.

## Current behaviour before external services are connected
- ADVA AI displays **Guided preview** and returns locally matched services.
- /brief creates a usable email or WhatsApp enquiry; it does not claim a database save.
- /hq remains private and shows no fabricated leads.
- /api/assistant and /api/leads report available: false.

## Connect the existing Supabase project
1. Review and execute supabase/migrations/20261009_adva_leads.sql in Supabase SQL Editor.
2. Create a CEO account in Supabase Authentication, using a strong password and MFA where offered.
3. Manually insert the Auth user UUID into public.adva_admins with role ceo. There is no open registration.
4. Add SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY to the Vercel project settings.
5. The service-role key must stay server-side; never share it in chat, frontend code or public GitHub.

## Connect OpenAI
Create a project-scoped API key with a sensible spending limit. Add OPENAI_API_KEY to Vercel Settings.
The default model is gpt-5.6-terra, overridable with OPENAI_MODEL. Responses API calls are server-side with store: false.

## Required Redis rate limiting
Provision Upstash Redis and configure UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN and ADVA_RATE_LIMIT_SALT.
Public AI and lead-write endpoints fail closed without persistent rate limiting.
Budgets per IP: AI 6/min and 55/day; enquiry 3/min and 20/day; HQ sign-in 5/min and 20/day.

## Verify
1. Redeploy the latest main after setting environment variables.
2. Check /api/assistant and /api/leads for available: true.
3. Send a test enquiry in /brief, confirm it is visible in /hq and test status transitions.
4. Test a real conversation in ADVA AI and confirm its privacy disclosure is visible.
5. Review UAE data protection, healthcare advertising rules and cross-border processing before public launch.

## Security model
- Admin auth uses a secure, HttpOnly SameSite=Strict cookie and re-login after roughly an hour.
- Every protected API request verifies Supabase Auth and a separate admin allowlist.
- Only CEO/admin roles can update status; staff can view authorised enquiries.
- No financial records or client assets should be imported until access, recovery and audit controls are independently tested.
- Vercel stays a non-indexed preview and the Squarespace domain remains untouched.