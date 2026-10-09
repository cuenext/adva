# ADVA — Pre-Review Patch Test
**Date:** 9 October 2026  
**Scope:** Public marketing site, entry/onboarding, CEO HQ, finance, project/content assignments, client portal, creative network, storage, API entry points, wording, and initial deployment checks.  
**Environment:** Staging Vercel + connected Supabase. Live \`advaae.com\` Squarespace remains unchanged.

## Executive result
**The staging build is reviewable, but not cleared for public production onboarding or financial operations yet.** The foundation compiles and the unauthenticated public pages are working. Private-record permissions have been reviewed and major logic issues have been patched. Final account-specific acceptance tests still require a verified CEO login, a linked client account and an NDA-approved freelancer account.

## Confirmed issues corrected

| Priority | Finding | Resolution |
|---|---|---|
| P0 | Older HQ API/session endpoints represented a second parallel authentication flow. Their role handling did not match "CEO only". | Removed obsolete routes and unused server/client code; the dashboard uses Supabase Auth and database-enforced permissions. |
| P0 | A person holding both freelancer and client access was treated only as a freelancer and could be redirected away from the client portal. | Prefer the appropriate authorized role per portal: /portal shows client data, /network shows freelancer data, /hq is CEO-only. |
| P1 | Client "Leave feedback" stored a record, but there was no CEO-facing feedback review screen. | Added Client feedback inbox with status review; clients can see their submitted comments. |
| P1 | Converting a new enquiry into a project automatically labeled the deal "Won", overstating conversion. | Project creation no longer marks a sale won. The lead stays in the pipeline until the CEO changes its stage. |
| P1 | The client and freelancer posting-time view linked to CEO-only HQ to schedule a post. | CEO may schedule; non-CEO users see a truthful readonly notice; public preview links to the entry page. |
| P1 | Previously removed client-name case studies remained accessible at direct public URLs. | Retired old case-study routes and unused client-data source. Public posting-time demo no longer names real clients. |
| P1 | Official-API metrics could be labeled by a manual authenticated insert, allowing falsely sourced reporting. | Added a database trigger: only a service-role integration can label metrics \`official_api\`. |
| P1 | Content metric / feedback project IDs could theoretically disagree with the underlying content project's ID. | Added composite foreign keys ensuring content/project match. |
| P1 | Finance and client strategy notes required additional server-side privacy checks. | Confirmed CEO-only finance RLS and moved internal production notes into a separate restricted table, not client-facing plans. |
| P1 | CEO freelancer assignment offered users who could not pass NDA verification. | Only creators with current, accepted reviewed NDA appear as assignable. |
| P2 | "Videos delivered" counted videos merely marked "Posted"; "Good morning" was hard-coded regardless of local time. | Corrected truthful status wording and changed generic greeting. |
| P2 | Email verification UI displayed internal Supabase configuration jargon. | Replaced with plain-language instructions. |
| P2 | Join flow stored a draft in tab-specific session storage, so verification links opening in a second tab lost the application. | Moved to temporary browser-local storage with two-hour freshness check; removed wording that promised automatic deletion while offline. |
| P2 | Enter ADVA was client-only and could not export proper page metadata. | Split into a server page with correct title and a separate interactive component. |
| P2 | Heavy workspace CSS was included on marketing routes, and global cursor effects applied to private workspaces. | Split CSS by route and disabled spotlight processing on private workspace pages. |
| P2 | Public endpoints accepted omitted Origin headers and portfolio URLs could be unsafe if bypassing frontend validation. | Hardened origin verification for API POSTs and enforced HTTPS in database links and preview. |
| P2 | App had little defensive browser-header configuration. | Added content-type, referrer, framing, permissions and resource-policy headers. |
| P2 | Duplicate project names would conflict on a derived unique slug. | Added short unique suffix when creating a project. |
| P2 | Project contract form depended on a timestamp that did not exist in the contract table. | Reloads when actual contract fields change. |
| P2 | Job applications labeled "Accepted" without clarifying that a separate work authorization and project assignment are required. | Changed application wording and added CEO workflow notice. |

## Verified deployment and API results
Live unauthenticated HTTP checks on \`https://adva-platform-five.vercel.app\`:
- HTTP 200: \`/\`, \`/services\`, \`/enter\`, \`/join\`, \`/hq\`, \`/portal\`, \`/network\`, \`/brief\`, \`/posting-times\`, \`/privacy\`.
- HTTP 404: \`/work/silwadi\`, \`/work/bluetti\`, deprecated \`/api/hq/session\`, deprecated \`/api/hq/leads\`, nonexistent test route.
- Correct "Enter ADVA" page metadata now appears in rendered HTML.
- Public homepage and posting demo no longer contain "Silwadi" in their server-rendered content.
- Staging retains \`noindex, nofollow\`.
- Global stylesheet count dropped to 2 links on the homepage and a route-appropriate 4–5 on workspace pages.
- \`/api/assistant\` reports \`available:false\`; \`/api/leads\` reports \`available:false\`, correctly preventing claims that AI/lead submission is already connected.

**URL caveat:** \`adva-platform-adva6.vercel.app\` currently redirects to Vercel SSO for unauthenticated visitors. The \`adva-platform-five.vercel.app\` alias returned public HTTP 200 and is the proper external review link until deployment protection is deliberately configured.

## Data permission and workflow tests
- Verified Supabase Row Level Security is enabled on finance, content, projects, client data and freelancer records.
- Anonymous SQL role was denied SELECT on the finance table.
- Existing rollback test: a temporary Silwadi content item transitioned to \`posted\`, created a \`posted_at\` timestamp and exactly one audit event; transaction rollback left zero test content.
- Storage bucket \`adva-freelancer-portfolio\` is private (\`public=false\`) with 25 MB/file quota, recognized media MIME types and per-user path access.
- Private monthly financial records and current creator accounts remain unpopulated; no artificial financial or performance statistics were inserted.

## Not yet verifiable without owner/external activation
These are **launch blockers**, not silently completed work:
1. **CEO identity:** zero verified Supabase accounts currently match the configured CEO address. Until the owner verifies their account, the live CEO dashboard cannot be acceptance-tested or safely used for real finance.
2. **Supabase Auth email templates/redirects:** authorize the Vercel review domain, confirm SMTP sender, and configure code/link templates. Test iOS and desktop sign-in using real verified accounts.
3. **Freelancer NDA:** a lawyer-reviewed, final, signed agreement is required before accepting NDA submissions or opening jobs. The existing draft is explicitly inactive and not legal advice.
4. **Client/freelancer isolation:** final real-session test must confirm that client A cannot see client B, freelancers cannot see unassigned projects, and finance only opens for the CEO.
5. **Real social analytics:** no authorized Silwadi account connection is active; benchmarks are not follower Insights. "Posted" records internal completion but is not automatic social publishing.
6. **Generative AI and direct lead intake:** still intentionally off until the private model key, Supabase service credential, server-side rate limiting and abuse controls are configured and tested.
7. **Copyright and UAE compliance:** confirm ADVA company legal entity, client work approvals, healthcare advertising, data residency/transfer, freelancer authorization and the final privacy/NDA wording before a public launch.
8. **Visual asset quality:** the deployed ADVA logo source is an aggressively small WebP compared with a high-resolution original; replace it with the original brand-approved SVG or a high-density transparent export for sharp high-DPI headers.
9. **Accessibility/interaction:** CSS and rendered-route checks were completed, but a complete headless-browser interaction and authenticated E2E matrix is not yet verified; validate focus trapping for modals, keyboard-only nav, screen reader announcements and iPhone Safari.
10. **Domain and SEO:** staging is intentionally noindex. Do not migrate \`advaae.com\` or enable public indexing until sign-off.

## Final acceptance sequence
1. Verify the CEO account and sign into \`/hq\`.
2. Create a manual monthly plan, record due/paid amounts, verify chart and outstanding totals.
3. Add a creative plan with video target, schedule a post, mark it Posted, confirm the count/audit.
4. Verify two client accounts; link only one to the project and confirm the other cannot see it.
5. Approve a reviewed NDA, verify a freelancer account, sign, assign to a single project and check access.
6. Upload and view a private portfolio file; test deletion and signed URLs.
7. Have the client review a visible content item, send feedback and confirm the CEO inbox receives it.
8. Only after rate limiting and API keys are configured, enable direct enquiries and AI with spending ceilings.
9. Test desktop, small laptop, tablet, iPhone Safari and reduced-motion experience.
10. Confirm rights-cleared, high-density visuals before public domain cutover.

**Staging is a professional review build, not a declaration of production-readiness.**
