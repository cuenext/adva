/* Deliberately custom SVG symbols: consistent stroke, never emoji glyphs. */
const shapes={
  menu:<><path d="M4 7h16M4 12h16M4 17h16"/></>,
  close:<><path d="M5 5l14 14M19 5L5 19"/></>,
  arrow:<><path d="M4 12h16m-7-7 7 7-7 7"/></>,
  up:<><path d="M5 19 19 5M8 5h11v11"/></>,
  down:<><path d="M12 4v16m-7-7 7 7 7-7"/></>,
  chevron:<><path d="m6 9 6 6 6-6"/></>,
  plus:<><path d="M12 5v14M5 12h14"/></>,
  minus:<><path d="M5 12h14"/></>,
  check:<><path d="m4 12 5 5L20 6"/></>,
  grid:<><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></>,
  calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 15h3"/></>,
  inbox:<><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 13h5l3 3 3-3h5"/></>,
  layers:<><path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/></>,
  wallet:<><rect x="3" y="6" width="18" height="15" rx="2"/><path d="M3 9V6c0-2 1-3 3-3h12M15 13h6v5h-6a2 2 0 0 1 0-5Z"/></>,
  users:<><circle cx="9" cy="8" r="3"/><path d="M2 20v-2a7 7 0 0 1 14 0v2M16 5a3 3 0 0 1 0 6m2 4a5 5 0 0 1 4 5"/></>,
  briefcase:<><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M3 13c5 4 13 4 18 0"/></>,
  spark:<><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8m0-12.8L5.6 18.4"/><circle cx="12" cy="12" r="2"/></>,
  play:<><path d="m9 6 10 6-10 6V6Z"/><circle cx="12" cy="12" r="10"/></>,
  camera:<><path d="M3 8h4l2-3h6l2 3h4v12H3V8Z"/><circle cx="12" cy="14" r="3.5"/></>,
  globe:<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18m0-18c5 5 5 13 0 18"/></>,
  chart:<><path d="M4 20V4M4 20h16M8 15l4-5 3 3 5-7"/></>,
  shield:<><path d="m12 2 8 4v6c0 5-4 9-8 10-4-1-8-5-8-10V6l8-4Z"/><path d="m8 12 3 3 5-6"/></>,
  file:<><path d="M7 3h7l5 5v13H5V3h2Zm7 0v5h5M8 13h8M8 17h6"/></>,
  filter:<><path d="M4 6h16M7 12h10M10 18h4"/></>,
  link:<><path d="M10 13a5 5 0 0 0 7 .2l3-3a5 5 0 1 0-7-7l-1.8 1.8M14 11a5 5 0 0 0-7-.2l-3 3a5 5 0 0 0 7 7l1.8-1.8"/></>,
  search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
  video:<><rect x="3" y="5" width="15" height="14" rx="2"/><path d="m18 10 4-3v10l-4-3"/></>,
  star:<><path d="m12 3 2.1 6.9L21 12l-6.9 2.1L12 21l-2.1-6.9L3 12l6.9-2.1L12 3Z"/></>,
  pause:<><path d="M8 5v14M16 5v14"/></>,
  clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/></>,
  refresh:<><path d="M20 8a8 8 0 0 0-14-2L3 9m0-5v5h5M4 16a8 8 0 0 0 14 2l3-3m0 5v-5h-5"/></>,
  lock:<><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>
};
export default function AdvaIcon({name="up",size=20,className="",strokeWidth=1.7}){
 return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{shapes[name]||shapes.up}</svg>
}
export function AdvaMark({size=24,className=""}){
 return <svg width={size} height={size} className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
 <path d="M24 3v42M3 24h42M9.2 9.2l29.6 29.6m0-29.6L9.2 38.8" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round"/>
 <circle cx="24" cy="24" r="4" fill="currentColor"/>
 </svg>
}