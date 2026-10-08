# ADVA — Website direction and agency reference audit

## Design decision
**Charcoal, not pure black.** Use the existing ADVA blue gradient as a precise accent rather than coating every element in gradients. Use kinetic editorial typography, a motion-led hero and an inquiry-first interface.

## What changes
- Intro sequence: "How can we help you?" rises line-by-line, followed by a motion-search input.
- Cursor-responsive ADVA orb with reduced-motion fallback.
- Search understands ordinary-language briefs through transparent rule-based matching. Real generative AI is **not active** without a separately secured backend and API key.
- A guided assistant is labeled as a preview, with meaningful contact handoff.
- Selected work prioritizes Silwadi's multi-touchpoint brand work and BLUETTI exhibition content. Other projects remain visible with grounded scopes.
- The public marketing site has no client portal / CEO dashboard links. Those areas remain intentionally closed.
- Noindex on the Vercel preview. Domain changes are deferred until sign-off.

## Reference sites inspected (45 direct URLs, including the ADVA baseline)
The research tool returned page content for many sites. Some JavaScript-heavy or unreachable sites did **not** provide a full render; they are listed for traceability, not falsely rated.
01. Doctor Multimedia — https://doctormultimedia.com/
02. RNO1 — https://www.rno1.com/
03. KOTA Marketing — https://www.kotamarketing.com/ourservices
04. Trifid Media — https://www.trifidmedia.com/
05. Active Theory — https://activetheory.com/
06. BASIC/DEPT — https://basicagency.com/
07. Instrument — https://www.instrument.com/
08. Fantasy — https://www.fantasy.co/
09. BUCK — https://www.buck.co/
10. Resn — https://www.resn.co.nz/
11. Locomotive — https://www.locomotive.ca/
12. DEPT — https://www.deptagency.com/
13. Media.Monks — https://www.media.monks.com/ (could not inspect fully)
14. AKHIA — https://www.akhia.com/
15. AKQA — https://www.akqa.com/
16. Pentagram — https://www.pentagram.com/
17. COLLINS — https://www.wearecollins.com/
18. Stink Studios — https://www.stinkstudios.com/
19. UNIT9 — https://www.unit9.com/
20. DesignStudio / Further — https://www.design.studio/
21. Ogilvy — https://www.ogilvy.com/
22. Wieden+Kennedy — https://www.wk.com/
23. We Are Social — https://www.wearesocial.com/ (could not inspect fully)
24. Jellyfish — https://www.jellyfish.com/
25. Huge — https://www.hugeinc.com/
26. Critical Mass — https://www.criticalmass.com/
27. R/GA — https://www.rga.com/
28. Havas — https://www.havas.com/
29. Droga5 — https://www.droga5.com/ (could not inspect fully)
30. Wolff Olins — https://www.wolffolins.com/
31. Landor — https://www.landor.com/ (could not inspect fully)
32. Interbrand — https://www.interbrand.com/
33. Turner Duckworth — https://www.turnerduckworth.com/
34. Design Bridge and Partners — https://www.designbridge.com/
35. frog — https://www.frog.co/
36. Hello Monday — https://www.hellomonday.com/
37. Dogstudio — https://www.dogstudio.co/ (could not inspect fully)
38. Studio Dumbar — https://www.studiodumbar.com/ (could not inspect fully)
39. Made by Shape — https://www.madebyshape.co.uk/ (could not inspect fully)
40. ustwo — https://www.ustwo.com/
41. ustwo games — https://www.ustwo.games/ (could not inspect fully)
42. Lusion — https://www.lusion.co/ (could not inspect fully)
43. Hello Design — https://www.hello-design.com/ (could not inspect fully)
44. Metajive — https://www.metajive.com/
45. Tubik Studio — https://www.tubikstudio.com/

**Traffic limitation:** Comparable 2026 monthly visits for these 45 domains could not be independently verified. The list is a *creative and IA benchmark*, **not a ranking by estimated traffic**. Do not invent visit counts or claim a "highest traffic" order.

## Strongest reference patterns
1. **Locomotive / Hello Monday / Instrument:** feature real projects early; strong studio point of view.
2. **RNO1 / DEPT / Critical Mass:** establish strategy, breadth and outcomes before generic service descriptions.
3. **Doctor Multimedia:** clear inquiry route and approachable assistant UI.
4. **KOTA / Trifid:** a distinct tone and a straightforward service navigation.
5. **Pentagram / COLLINS / BUCK / Stink:** let craft and actual visuals dominate; avoid invented case-study images.
6. **Ustwo / frog:** keep creative experimentation usable and accessible.

## Performance and legal guardrails
- Respect prefers-reduced-motion and mobile battery/network constraints.
- No copyrighted case imagery, client logos, healthcare testimonials, private patient images or fabricated metrics without right-to-publish review.
- Confirm applicable UAE media advertising and medical-content approvals before migration to the public domain.
- Add rate limits, moderation, a privacy disclosure and server-only model keys before enabling a public generative-AI endpoint.
- Maintain a secure boundary between public site and future client/admin finance portals.
