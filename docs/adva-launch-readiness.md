# ADVA Website — Launch Readiness
Updated: 9 October 2026

This is an operational checklist, not a marketing page. Keep the Squarespace production domain and DNS unchanged until ADVA explicitly approves replacement.

## Finished on Vercel staging
- [x] Homepage, dark cosmic treatment, centered interactive project search.
- [x] Public navigation, Services dropdown hover reliability, About and nine Services pages.
- [x] Selected Work index and four authentic event-project pages: Make It in the Emirates, UMEX, ADIHEX and Middle East Energy (2026).
- [x] Public project brief with multiple services, secure optional HTTPS reference link, and final review.
- [x] CEO HQ enquiry panel shows the reference link privately.
- [x] Supabase migration adds `adva_leads.reference_url` with a 600-character bound.
- [x] Staging noindex and robots disallow; sitemap generation is gated behind explicit production flags.
- [x] Checked core routes with HTTP 200 and tested Work pages at desktop, tablet, 390px and 320px screen widths.
- [x] Database tables have RLS enabled; freelancer network-visibility update is restricted to the verified CEO by a trigger.

## Assets & publication approvals
- [ ] Confirm the Google Drive media folder link and grant the connected reviewer access to the relevant export set.
- [ ] Select full-resolution, *final delivered* photographs and video cuts, not raw client files.
- [ ] Check publication rights, third-party music, event photography rights, recognizable people, NDA terms, embargoes and patient privacy.
- [ ] Obtain approval for each public asset and add captions and descriptive alt text.
- [ ] Only after approval, populate `lib/selected-work.js` `media[]` entries and test video autoplay/hover and responsive delivery.

## Operational blockers
- [ ] **Secure direct leads**: Vercel currently lacks server-only `SUPABASE_SERVICE_ROLE_KEY` and the persistent rate-limiter variables `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `ADVA_RATE_LIMIT_SALT`. Keep `/api/leads` fail-closed; email and WhatsApp handoff remain available. Add secrets via the Vercel Dashboard, never the repository. Test a synthetic form submission and verify it in CEO HQ before enabling direct submit.
- [ ] **Supabase login delivery**: configure a verified custom SMTP sender and a supported rate limit. The built-in mailer has been returning 429 after repeated OTP requests. Test password and magic-link flows separately. Enable leaked-password protection in Supabase Auth settings.
- [ ] **Analytics**: Web Analytics is not enabled on the current Vercel project. Enable it with an appropriate privacy review; confirm pageview capture and consent requirements before production.
- [ ] **Search Console**: after DNS moves, verify the new domain, submit the production sitemap, check indexing and monitor search performance.
- [ ] **Production release gate**: legal/privacy review, metadata/OG preview audit, performance audit with final media, no unintended public PII and role-based end-to-end testing of client/freelancer access.
- [ ] **DNS/production**: do not change `advaae.com` Squarespace, mail DNS or redirects until the user approves the final site. After migration set `ADVA_PUBLIC_ORIGIN=https://advaae.com` and `ADVA_PUBLIC_LAUNCH=true` in the proper production environment and redeploy.

## Important security rules
- The public project pages include no private client names, contracts, financial data or fabricated outcomes.
- There are no media references published until individual publication clearance is documented.
- Never place Supabase service-role credentials or other secrets in `NEXT_PUBLIC_*` variables or committed files.
- `robots.txt` and noindex discourage indexing; they are not authorization. Private client information belongs behind Supabase RLS and role checks.
