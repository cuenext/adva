# ADVA Work: publishing new approved media

Categories in lib/work-library.js:
- interviews
- social-videos
- event-highlights
- marketing
- commercials
- cinematic-social

Add approved assets to public/portfolio/, then add entries to WORK_MEDIA in lib/work-library.js.

Example entry:
{ id: 'approved-interview-001', collection: 'interviews', title: 'Real project title', kind: 'video', src: '/portfolio/approved-interview-001.mp4', poster: '/portfolio/approved-interview-001.webp', alt: 'Clear description of the footage', note: 'Optional factual context' }

The FIRST entry for a category automatically replaces its abstract concept placeholder. Additional media items appear in the separate expanded media gallery. For photos use kind: 'image', with src and alt.

Before publishing confirm final delivery, usage rights, client permission, event release requirements, music, any person-identifiable material and privacy restrictions. No invented case studies, client names or results.

The four existing event case studies remain separate under lib/selected-work.js. They keep their original routes and have no published media until cleared.

Check frame cropping and portrait aspect on 320px, 390px, 768px, 1440px, keyboard navigation, WCAG contrast, reduced motion, and video poster/controls after every media addition.