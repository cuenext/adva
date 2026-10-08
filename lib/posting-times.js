// ADVA posting suggestions — editorial testing windows, NOT account-derived analytics.
// All times are in Asia/Dubai UTC+04:00.
// Healthcare Instagram windows: Sprout Social 2026, best times for hospitals and healthcare.
// Other networks: Buffer 2026 analysis of 52M+ posts. Slots within their broad windows
// are editorial test choices, not precise promises.
export const TIMEZONE="Asia/Dubai";
export const NETWORKS=[
 {id:"instagram",label:"Instagram",source:"Sprout Social healthcare, 2026",url:"https://sproutsocial.com/insights/best-times-to-post-on-instagram/",hint:"Healthcare benchmark • test lunchtime and evening slots",slots:[
  {day:"Wednesday",hour:"13:00",name:"Educational reel",description:"A clear educational answer from a dentist."},
  {day:"Monday",hour:"18:30",name:"Doctor-led video",description:"A relatable topic that encourages comments and saves."},
  {day:"Thursday",hour:"12:00",name:"Carousel / clinic story",description:"Helpful visual explanation or clinic introduction."},
  {day:"Tuesday",hour:"12:00",name:"Short reel",description:"An easy-to-share tip with a natural hook."}
 ]},
 {id:"tiktok",label:"TikTok",source:"Buffer 2026 social timing analysis",url:"https://buffer.com/resources/best-time-to-post-social-media/",hint:"General social benchmark • test weekend mornings and evening windows",slots:[
  {day:"Sunday",hour:"09:00",name:"Educational short",description:"Practical Q&A with a short, immediate hook."},
  {day:"Saturday",hour:"10:00",name:"Doctor personality video",description:"Human, friendly short-form storytelling."},
  {day:"Friday",hour:"20:00",name:"Trend / creative edit",description:"Fast-moving, platform-native creative."}
 ]},
 {id:"facebook",label:"Facebook",source:"Buffer 2026 social timing analysis",url:"https://buffer.com/resources/best-time-to-post-social-media/",hint:"General social benchmark • weekday morning test",slots:[
  {day:"Thursday",hour:"09:00",name:"Clinic update",description:"Useful, informative update with clear contact information."},
  {day:"Wednesday",hour:"10:00",name:"Educational post",description:"Simple prevention or oral-health topic."},
  {day:"Tuesday",hour:"09:30",name:"Community post",description:"Human, helpful clinic-facing content."}
 ]},
 {id:"linkedin",label:"LinkedIn",source:"Buffer 2026 social timing analysis",url:"https://buffer.com/resources/best-time-to-post-social-media/",hint:"General B2B benchmark • professional reputation and recruitment",slots:[
  {day:"Wednesday",hour:"16:00",name:"Professional insight",description:"A clinician's insight or a team milestone."},
  {day:"Thursday",hour:"16:30",name:"Team spotlight",description:"Human expertise and clinic culture."},
  {day:"Friday",hour:"16:00",name:"Partnership update",description:"Recruitment, culture or professional collaboration."}
 ]},
 {id:"youtube_shorts",label:"YouTube Shorts",source:"Buffer 2026 YouTube Shorts timing analysis",url:"https://buffer.com/resources/best-time-to-post-social-media/",hint:"General Shorts benchmark • Friday–Saturday afternoon/evening",slots:[
  {day:"Friday",hour:"17:00",name:"Educational Short",description:"One question and one clear answer."},
  {day:"Saturday",hour:"17:00",name:"Doctor Q&A",description:"Practical advice in a compact format."},
  {day:"Friday",hour:"18:30",name:"Short recap",description:"A simple recap of a helpful idea."}
 ]}
];
export function network(id){return NETWORKS.find(n=>n.id===id)||NETWORKS[0]}
export function display12(t){const [h,m]=t.split(":").map(Number);return (h%12||12)+":"+String(m).padStart(2,"0")+" "+(h>=12?"PM":"AM")}
