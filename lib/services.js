// Source of truth for ADVA's public service architecture.
// Capabilities are described without invented results, prices or guaranteed deliverables.
export const SERVICE_GROUPS = [
  {id:"production",label:"Production",sub:"Video, photo and post",number:"01",accent:"#65befb"},
  {id:"digital",label:"Brand & digital",sub:"Brands and websites",number:"02",accent:"#a4adff"},
  {id:"experiences",label:"Experiences",sub:"On-site teams",number:"03",accent:"#77ddd1"}
];

export const SERVICES = [
  {
    slug:"videography",name:"Videography",group:"production",number:"01",
    eyebrow:"FILM & STORYTELLING",short:"Campaigns, interviews, events and short-form video.",
    statement:"Planned for the screen.",
    introduction:"From concept and shot list to filming and delivery, we create video for the places people will actually watch it.",
    audience:"For campaigns, corporate stories, launches, interviews and social-first films.",
    deliverables:["Creative concept & shot planning","On-location filming","Interviews & brand stories","Event highlight films","Short-form and platform edits","Colour, sound & delivery formats"],
    process:[["Find the story","We align on the audience, message and what the film needs to accomplish."],["Plan the shoot","Creative direction, locations, shot priorities and production logistics."],["Shoot & shape","We capture, edit and finish content for the platforms that matter."]],
    questions:[["Do you cover exhibitions and conferences?","Yes. Event coverage can be planned as a standalone shoot or as part of a larger exhibition production package."],["Can we request vertical and horizontal deliverables?","Yes. We plan formats around where the video will live, including social platforms, websites and presentations."],["What do you need to quote a shoot?","The location, filming dates, approximate duration, content style and expected deliverables are a good start."]],
    related:["video-editing","photography","event-coverage"]
  },
  {
    slug:"photography",name:"Photography",group:"production",number:"02",
    eyebrow:"STILL IMAGES / BIG IMPACT",short:"Event, portrait, product and brand photography.",
    statement:"See it differently.",
    introduction:"A strong photo library gives your brand consistency across its website, social channels, presentations and campaigns.",
    audience:"For events, products, spaces, teams, campaigns and visual brand libraries.",
    deliverables:["Event & exhibition photography","Brand and lifestyle imagery","Corporate portraits & teams","Product & detail photography","On-site art direction","Selection, retouching & exports"],
    process:[["Define the look","We review brand references, formats and must-have imagery."],["Capture with intention","A planned shot list with room for spontaneous moments."],["Select & finish","Careful curation, editing and useful delivery formats."]],
    questions:[["Can you photograph an event and produce video on the same day?","Yes, with an appropriately scoped crew and production plan."],["Do you offer edited and unedited files?","Edited selections are our standard planning basis. Raw-file needs can be discussed in advance."],["What should we share before booking?","Location, date, approximate hours, subjects and intended channels."]],
    related:["videography","social-media-management","event-coverage"]
  },
  {
    slug:"video-editing",name:"Video Editing",group:"production",number:"03",
    eyebrow:"POST / MOTION / FINISH",short:"Editing, colour, sound, subtitles and motion graphics.",
    statement:"The edit matters.",
    introduction:"We turn filmed material into finished content with clear pacing, considered graphics and formats for each platform.",
    audience:"For campaigns, event recaps, brand films, interviews and recurring reels.",
    deliverables:["Narrative & social edits","Motion graphics & titles","Colour grading","Audio clean-up & mixing","Subtitles & captions","Platform-specific exports"],
    process:[["See the full picture","We review footage, references and the story's purpose."],["Build the rhythm","Structure, pacing, graphics and sound come together."],["Finish the details","A refined final cut, revisions within scope and clean export versions."]],
    questions:[["Can ADVA edit footage we shot ourselves?","Yes. Share a sample, reference and intended deliverables so we can assess the footage and scope."],["Can you make multiple reels from one video?","Yes. One shoot can be planned for multiple shorter edits, depending on the material."],["Do you offer Arabic and English subtitles?","Arabic and English subtitle versions can be included in an agreed editing scope."]],
    related:["videography","social-media-management","branding"]
  },
  {
    slug:"social-media-management",name:"Social Media Management",group:"digital",number:"04",
    eyebrow:"CONTENT / COMMUNITY / DIRECTION",short:"Strategy, content calendars, production and reporting.",
    statement:"A social presence with a plan.",
    introduction:"We work out what to publish, who it's for, when to produce it and how to improve the next round.",
    audience:"For businesses and personal brands that want a considered, sustainable social presence.",
    deliverables:["Social content strategy","Content pillars & calendars","Creative direction and scripting","Reels, posts and carousels","Publishing coordination","Reporting & ongoing refinements"],
    process:[["Understand the audience","We explore your positioning, current channels and real business priorities."],["Create a system","A workable content direction, production schedule and review process."],["Publish, learn, improve","Measure what matters and use feedback to guide the next cycle."]],
    questions:[["Do you manage Instagram and TikTok?","We can scope creative and publishing support for Instagram and TikTok, with other channels considered by project."],["Can you film our team regularly?","Yes. Recurring filming days can be planned around the content calendar."],["Can you guarantee views or followers?","No. We do not guarantee platform reach, views or follower growth. We focus on quality, testing and informed decisions."]],
    related:["videography","video-editing","marketing"]
  },
  {
    slug:"website-design",name:"Website Design",group:"digital",number:"05",
    eyebrow:"DIGITAL EXPERIENCES",short:"Responsive design, clear user journeys and development.",
    statement:"Made for the visitor.",
    introduction:"We plan and build websites around what people need to find, understand and do next.",
    audience:"For businesses ready to launch, rebuild or refine their digital presence.",
    deliverables:["Website strategy & site structure","UX/UI design","Responsive development","Conversion-focused layouts","Content and SEO foundations","Launch preparation & handover"],
    process:[["Map the experience","We clarify audiences, journeys, pages and business goals."],["Design the details","Layout, typography, visual identity and mobile interactions."],["Build & launch","Responsive implementation, testing and a structured handover."]],
    questions:[["Can you redesign an existing website?","Yes. We can assess the current structure and content before suggesting a rebuild or targeted redesign."],["Can you build a bilingual website?","English–Arabic website requirements can be scoped, including typography, RTL layout and content workflow."],["Do you host websites?","Hosting and deployment arrangements depend on the platform and scope; we confirm ongoing responsibilities before launch."]],
    related:["branding","marketing","social-media-management"]
  },
  {
    slug:"marketing",name:"Marketing",group:"digital",number:"06",
    eyebrow:"CREATIVE STRATEGY / DIGITAL",short:"Campaign planning, creative direction and channel strategy.",
    statement:"Start with the objective.",
    introduction:"A good campaign connects the offer, the audience, the message and a useful way to measure results.",
    audience:"For launches, lead generation, brand awareness and ongoing campaign support.",
    deliverables:["Marketing & campaign strategy","Audience and message planning","Creative campaign concepts","Digital advertising creative","SEO and content direction","Performance review & optimisation"],
    process:[["Get clear on the goal","What needs to change, who needs to hear it and how success will be measured."],["Build the campaign","A practical channel, message and creative plan."],["Review the signals","Use results and insights to make the next decisions smarter."]],
    questions:[["Do you manage paid advertising budgets?","Paid campaign execution and budget management can be scoped separately. Media spend is distinct from creative and management fees."],["Can you help a new brand launch?","Yes. We can plan messaging, creative assets, channel priorities and a launch sequence."],["Do you guarantee leads or revenue?","No. Outcomes depend on factors beyond any one agency's control. We agree on realistic objectives and reporting."]],
    related:["social-media-management","website-design","branding"]
  },
  {
    slug:"branding",name:"Branding & Design",group:"digital",number:"07",
    eyebrow:"IDENTITY / CREATIVE DIRECTION",short:"Identity systems, design direction and brand applications.",
    statement:"A clear identity.",
    introduction:"We build visual identities that work across websites, content, physical spaces and everyday brand materials.",
    audience:"For new businesses, rebrands, campaigns and brands that have outgrown their visual identity.",
    deliverables:["Discovery & creative direction","Brand identity concepts","Logo systems and typography","Colour and graphic systems","Social and digital applications","Brand guidelines & handover"],
    process:[["Find the idea","Define what the brand stands for and what makes it different."],["Shape the identity","Explore, refine and build a cohesive visual system."],["Make it usable","Apply the identity to real touchpoints and prepare the files for rollout."]],
    questions:[["Do you only design logos?","We can scope individual design needs, but our strongest work happens when the identity is considered as a connected system."],["Can you improve our existing brand without changing everything?","Yes. A targeted refresh may be more appropriate than a full rebrand."],["Can branding and website work happen together?","Absolutely. Planning them together often produces a more consistent result."]],
    related:["website-design","marketing","social-media-management"]
  },
  {
    slug:"event-staffing",name:"Event Staffing",group:"experiences",number:"08",
    eyebrow:"PEOPLE / PRESENCE / OPERATIONS",short:"Hosts, registration teams and activation support.",
    statement:"The right team on site.",
    introduction:"We plan event staffing around the venue, schedule, guest flow and roles needed on the day.",
    audience:"For exhibitions, conferences, activations and brand events in the UAE.",
    deliverables:["Event crew scoping","Hosts & guest-facing staff","Registration and welcome support","Brand activation support","Shift and role coordination","On-ground communication planning"],
    process:[["Scope the event","Venue, dates, headcount, roles, languages and the visitor experience."],["Build the staffing plan","Define responsibilities, shift requirements and coordination needs."],["Support execution","Prepare the team and on-ground points of contact as agreed."]],
    questions:[["Can you provide staff for a trade show?","Staffing requests can be assessed for exhibitions, conferences and activations, subject to availability and scope."],["Do you provide multilingual hosts?","Language requirements can be included in the brief and checked during staffing arrangements."],["What do you need for a quote?","Location, dates, shift lengths, number of people, tasks and any specific language or dress-code requirements."]],
    related:["event-coverage","photography","videography"]
  },
  {
    slug:"event-coverage",name:"Event Coverage",group:"experiences",number:"09",
    eyebrow:"EXHIBITIONS / EXPERIENCES",short:"Photo and video teams for exhibitions, launches and conferences.",
    statement:"Make the event last.",
    introduction:"We plan and capture the moments you'll need after the doors close, from interviews to highlights and selected photography.",
    audience:"For exhibitions, corporate launches, conferences, and brand activations.",
    deliverables:["Coverage plans & shot priorities","Event photo and video crews","Exhibition interviews","Highlight and recap edits","Vertical/social cutdowns","Timed deliverable planning"],
    process:[["Plan before the doors open","Map the moments, stakeholders and channels."],["Capture the energy","Photo, film and interview coverage with a clear brief."],["Keep the story moving","Edit and prepare deliverables for continued post-event use."]],
    questions:[["Can you cover multiple days or cities?","Multi-day and multi-location projects can be scoped based on crew availability and travel logistics."],["Can you provide edits during an event?","Fast-turnaround edits can be discussed in advance, depending on the crew, format and schedule."],["Can you also arrange event staff?","Yes. Event staffing can be planned as a separate but coordinated workstream."]],
    related:["event-staffing","videography","photography"]
  }
];

export function serviceBySlug(slug){return SERVICES.find(s=>s.slug===slug)}
export function servicesInGroup(group){return SERVICES.filter(s=>s.group===group)}
