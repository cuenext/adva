# ADVA — Operating Platform Status
**Technical snapshot · 9 October 2026**
**Environment:** Vercel preview only. \`advaae.com\` remains on Squarespace.

## What is implemented
| Area | Current experience | Protection |
| --- | --- | --- |
| Public marketing site | Services navigation and luxury charcoal/blue creative experience | public |
| Enter ADVA | Three routes: project enquiry, client portal, creative network | public |
| Join ADVA | Four-step role → availability → work → email verification | Supabase Auth; verified email before profile |
| CEO HQ | All projects, team controls, monthly strategies, finance, client enquiries, recruitment | \`adva_is_ceo()\` plus Row Level Security |
| Finance | Plan + project + billing month + due + paid + outstanding + expenses + 6-month chart | CEO only, audit on finance edits |
| Project membership | CEO assigns verified freelancers to a project and clients to their own project | membership-based Row Level Security |
| Content | Ideas, schedule, platform, creator assignment, client visibility, completion status | client/member policy; posted RPC checks assignee |
| Content proof | Posting timestamp and audit event when a post is marked Posted; posted videos count automatically | recorded transaction; not social platform automation |
| Monthly strategy | Goals, pillars, cadence, video/post targets, team-only notes | separate protected notes table |
| Client dashboard | CEO-approved schedule, contract dates, creative plan, reported metrics | linked projects only |
| Freelancer network | Profiles, private JPG/PNG/WebP/MP4/MOV/PDF uploads, approved discovery, job board | verified login, active reviewed NDA for jobs/peer discovery |
| NDA | Draft prepared, legal review gate, acceptance records and versioning | inactive pending professional approval |
| Posting time guide | Instagram, TikTok, Facebook, LinkedIn, YouTube Shorts suggested UAE windows | research-based estimates; no account-specific audience data |
| Live generative AI & direct website enquiries | Backend interfaces prepared, graceful fallback | OFF until private keys & rate limiting configured |

## Essential external activation steps
1. **CEO email verification**. Create/sign in to a verified Supabase account using the owner email designated in ADVA's restricted allowlist. Use the Auth UI, not shared passwords. Confirm the account is recognized as CEO before entering any real finance data.
2. **Supabase email redirect configuration**. In Supabase → Authentication → URL Configuration, add the Vercel preview origin and callback paths to Allowed Redirect URLs. Recommended: \`https://adva-platform-adva6.vercel.app/**\`. Confirm Site URL, link template and branded sending domain before open recruitment.
3. **Six-digit verification code**. Supabase email templates must use \`{{ .Token }}\` to send a six-digit OTP rather than only a magic link. The interface handles both when they are provided. Verify sending limits before launch.
4. **Supabase Auth SMTP**. Configure a reliable approved transactional email service for account volume and sender reputation. The built-in provider is unsuitable for heavy public signup.
5. **NDA legal review**. Finalize legal entity, local counsel review, signature record, effective date, confidentiality duration, IP rights, media permissions and independent contractor work authorization. Only then activate reviewed version through ADVA HQ.
6. **Direct leads**. Add \`SUPABASE_SERVICE_ROLE_KEY\` as an encrypted server-only Vercel secret; configure a distributed rate limiter such as Upstash. Verify anti-abuse protections; enable only after form and privacy checks. Never expose server secrets in frontend or GitHub.
7. **AI concierge**. Add a project-scoped \`OPENAI_API_KEY\` privately with a hard monthly usage budget plus the rate limiting service. Keep the assistant in guided mode until configured.
8. **Social analytics**. Authorize a Silwadi Instagram Business/Creator account and other desired social channels (Meta permissions, TikTok/YouTube accounts) through an approved analytics integration. Metricool is connected as a plugin but has **no social account attached yet**. Until then metrics are manual and clearly labeled.
9. **Client onboarding & published content**. Link real client accounts only after verification and documented consent. Set \`client_visible\` only for approved content; check clinic/media requirements for patient materials.
10. **Production security**. Audit RLS, data retention and incident response; enable MFA for the CEO if supported. Complete UAE cross-border data and media-law review before migrating public domain.
11. **Real media**. Only incorporate cleared, licensed and optimized ADVA work into public-facing work and showreels after approvals.
12. **Domain migration**. Keep Squarespace \`advaae.com\` until the preview passes sign-in, privacy, performance, client-access and release checks. DNS cutover only with explicit authorization.

## Rules you must not misinterpret
- Posted = completed in ADVA's task ledger, NOT an automatic Instagram/TikTok publish.
- Official account analytics are not connected. Manual metrics need source labeling and should never be presented as independently verified.
- The client portal does NOT reveal internal project notes, freelancer salaries or CEO finances.
- Freelancers can see assigned projects only. They cannot see other private client projects.
- The finance chart is a ledger, not bank synchronization or accounting/tax certification.
- Joining the network does not grant employment or an opportunity to work in the UAE; legal work authorization remains separate.
- Private portfolio uploads require correct rights and a reviewed privacy policy.

## Checks completed in this build cycle
- Vercel compilation for the connected workspace was successful.
- Database transaction test: marking a temporary Silwadi content item Posted recorded a timestamp and one audit event. The transaction was rolled back, leaving no test content.
- An anonymous-role attempt to access the finance table returned permission denied.
- Row-level policies inspected: monthly finances restricted to CEO, client strategies scoped to projects, private strategy notes restricted to staff, and freelancer portfolios stored in a non-public Storage bucket.
- No fabricated client projects, finance entries, views or freelancer accounts were inserted.

## Still requiring end-to-end user-account testing
- Verify login email delivery and callback on the user's domain.
- Log in as real CEO, freelancer and client accounts; verify access isolation with real sessions.
- Run an end-to-end content workflow: CEO creates item → assigns creator → creator marks posted → client sees only approved parts.
- Verify portfolio uploads on desktop and iOS, user-readable file preview, and author-initiated deletion.
- Validate final onboarding wording, WCAG interaction details, slow mobile connections and real social data integration.

## Reference URLs
- Supabase Auth Redirect URLs: https://supabase.com/docs/guides/auth/redirect-urls
- Supabase custom SMTP: https://supabase.com/docs/guides/auth/auth-smtp
- Supabase email OTP template: https://supabase.com/docs/guides/auth/auth-email-passwordless
- Supabase private Storage: https://supabase.com/docs/guides/storage/security/access-control
