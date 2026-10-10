// ADVA's work-library layout registry.
// This is a catalogue of formats ADVA makes, not a list of fabricated case studies.
// Once publication rights are confirmed, add approved media items to WORK_MEDIA.
//
// Example:
// {
//   id: "interview-001",
//   collection: "interviews",
//   title: "Approved project title",
//   kind: "video", // "video" or "image"
//   src: "/portfolio/interview-001.mp4",
//   poster: "/portfolio/interview-001.webp",
//   alt: "Specific description of the still or frame",
//   note: "Optional short factual caption"
// }
//
// The first WORK_MEDIA item for a category becomes its large feature frame.
// Every additional item appears in the film library below the categories.
// Never publish raw exports, third-party music, identifiable client data,
// or client logos without clearance.

export const WORK_COLLECTIONS=[
 {
  slug:"interviews",
  index:"01",
  title:"Interviews",
  shortTitle:"Interviews",
  descriptor:"PEOPLE / PERSPECTIVE",
  summary:"On-camera conversations, founder stories and interviews that give the subject room to speak.",
  artText:"THE CONVERSATION",
  layout:"wide",
  tag:"INTERVIEW FILMS"
 },
 {
  slug:"social-videos",
  index:"02",
  title:"Social media videos",
  shortTitle:"Social videos",
  descriptor:"SHORT FORM / SOCIAL",
  summary:"Reels and platform-first edits made for the places people actually watch.",
  artText:"9:16 / SOCIAL",
  layout:"narrow",
  tag:"SHORT-FORM VIDEO"
 },
 {
  slug:"event-highlights",
  index:"03",
  title:"Events & highlights",
  shortTitle:"Event highlights",
  descriptor:"ON LOCATION / LIVE",
  summary:"Exhibition coverage, live moments, interviews and highlight films built around the day.",
  artText:"ON THE FLOOR",
  layout:"narrow",
  tag:"EVENT PRODUCTION"
 },
 {
  slug:"marketing",
  index:"04",
  title:"Marketing",
  shortTitle:"Marketing",
  descriptor:"CAMPAIGNS / CREATIVE",
  summary:"Campaign-led content shaped around the message, audience and what the work needs to achieve.",
  artText:"THE MESSAGE",
  layout:"wide",
  tag:"CAMPAIGN CREATIVE"
 },
 {
  slug:"commercials",
  index:"05",
  title:"Commercials",
  shortTitle:"Commercials",
  descriptor:"BRAND FILMS / SPOTS",
  summary:"Brand and product-focused films, from the first visual idea to the final cut.",
  artText:"ON SCREEN",
  layout:"wide",
  tag:"COMMERCIAL FILMS"
 },
 {
  slug:"cinematic-social",
  index:"06",
  title:"Cinematic social content",
  shortTitle:"Cinematic social",
  descriptor:"CINEMA / SOCIAL-FIRST",
  summary:"Film-style storytelling with movement, atmosphere and a mobile-first frame.",
  artText:"FRAME / FEEL",
  layout:"narrow",
  tag:"CINEMATIC SHORTS"
 }
];

export const WORK_MEDIA=[];

export function mediaForCollection(slug){
 return WORK_MEDIA.filter(media=>media.collection===slug);
}
