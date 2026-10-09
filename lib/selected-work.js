// ADVA public Selected Work register.
// Only projects ADVA has publicly described or documented in confirmed project records.
// Never put private client material, contracts, financials, or unapproved media here.
export const SELECTED_WORK=[
 {
  slug:"make-it-in-the-emirates-2026",
  title:"Make It in the Emirates",
  year:"2026",location:"Abu Dhabi",kind:"Exhibition production",
  number:"01",short:"Four days in the middle of the action.",
  intro:"Multi-day exhibition coverage built around the people, products and activity on the show floor.",
  story:"Make It in the Emirates brought a busy exhibition floor and multiple production requirements into one schedule. ADVA worked on-location across four event days, producing photography and video content while moving between the moments that needed documenting.",
  approach:"For high-traffic exhibitions, preparation and movement matter. A clear crew brief, ready equipment and a practical shooting plan help make room for both scheduled content and spontaneous moments.",
  deliverables:["Event photography","Videography","Post-production"],
  categories:["Exhibitions","Media production"],
  publicNote:"Coverage documented in ADVA's public event updates.",
  media:[],
  accent:"slate"
 },
 {
  slug:"umex-2026",
  title:"UMEX",
  year:"2026",location:"Abu Dhabi",kind:"Exhibition coverage",
  number:"02",short:"Production on the exhibition floor.",
  intro:"On-ground photography, videography and event support across a three-day exhibition.",
  story:"At UMEX 2026, ADVA covered the exhibition environment, working across media production and on-ground support. The project combined event documentation with the coordination needed to operate around active booths, visitors and busy schedules.",
  approach:"We worked around the pace of a live exhibition: preparing the crew, organising coverage priorities and capturing useful content while respecting what was happening on site.",
  deliverables:["Exhibition photography","Event videography","On-ground production support"],
  categories:["Exhibitions","Media production","Events"],
  publicNote:"ADVA has publicly shared its UMEX exhibition work.",
  media:[],
  accent:"steel"
 },
 {
  slug:"adihex-2026",
  title:"ADIHEX",
  year:"2026",location:"Abu Dhabi",kind:"Event photography & film",
  number:"03",short:"One event day, multiple ways to tell the story.",
  intro:"Product-led exhibition photography and a professionally edited highlight film.",
  story:"At the Abu Dhabi International Hunting and Equestrian Exhibition, ADVA produced on-site photo and video coverage centred on the exhibitor's presence, product details, demonstrations and interactions throughout the day.",
  approach:"The coverage combined deliberate product imagery with moments from the exhibition itself, followed by selection, editing and preparation for professional business communications.",
  deliverables:["Edited exhibition photography","Highlight video","Editing and sound","Arabic and English subtitles"],
  categories:["Exhibitions","Media production"],
  publicNote:"Only approved final deliverables will appear here.",
  media:[],
  accent:"ice"
 },
 {
  slug:"middle-east-energy-2026",
  title:"Middle East Energy",
  year:"2026",location:"Dubai",kind:"Exhibition media",
  number:"04",short:"Capturing the conversation around the product.",
  intro:"Exhibition photography, interviews and post-production for a fast-moving industry event.",
  story:"At Middle East Energy 2026 in Dubai, ADVA documented booth activity, product demonstrations and interactions with visitors and business partners. The production included photography and video tailored to professional corporate communication.",
  approach:"A focused shoot plan balanced product coverage with the conversations and details that gave the exhibition its character. Material was edited for clear, practical use across digital channels.",
  deliverables:["Edited event photography","Interviews","Highlight film","Post-production"],
  categories:["Exhibitions","Media production"],
  publicNote:"Only approved final deliverables will appear here.",
  media:[],
  accent:"blue"
 }
];

export function selectedWorkBySlug(slug){
 return SELECTED_WORK.find(item=>item.slug===slug)||null;
}
