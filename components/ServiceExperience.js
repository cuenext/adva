"use client";
import {useState} from "react";
import AdvaIcon from "./AdvaIcon";

const modes={
 videography:[["Wide / 16:9","wide"],["Vertical / 9:16","vertical"],["Square / 1:1","square"]],
 "video-editing":[["Cool","cool"],["Warm","warm"],["Monochrome","mono"]],
 branding:[["Ocean","ocean"],["Graphite","graphite"],["Coral","coral"]],
 "website-design":[["Desktop","desktop"],["Mobile","mobile"]],
 "social-media-management":[["Instagram","instagram"],["TikTok","tiktok"],["LinkedIn","linkedin"]],
 marketing:[["Brand launch","launch"],["Lead campaign","leads"],["Awareness","awareness"]],
 "event-coverage":[["Before","before"],["During","during"],["After","after"]]
};
const goals={
 launch:{title:"Introduce the brand.",text:"Clear positioning, memorable visuals and a focused launch sequence."},
 leads:{title:"Bring in enquiries.",text:"Campaign creative, landing pages and a clear next step for visitors."},
 awareness:{title:"Stay recognizable.",text:"Consistent creative across the platforms your audience actually uses."}
};
const eventSteps={
 before:{title:"Plan the coverage",note:"Venue, crew, priorities, interview list and the delivery timeline."},
 during:{title:"Capture the day",note:"People, atmosphere, interviews and moments worth keeping."},
 after:{title:"Keep the story moving",note:"Edited highlights, selected images and platform-ready versions."}
};
const roleOptions=["Registration","Guest experience","Activation crew","Brand hosts","On-site support"];
export default function ServiceExperience({slug}){
 const options=modes[slug]||[];
 const [mode,setMode]=useState(options[0]?.[1]||"");
 const [brightness,setBrightness]=useState(57);
 const [roles,setRoles]=useState(["Registration","Brand hosts"]);
 if(!["videography","photography","video-editing","branding","website-design","social-media-management","marketing","event-coverage","event-staffing"].includes(slug))return null;
 function toggle(role){setRoles(x=>x.includes(role)?x.filter(y=>y!==role):[...x,role])}
 return <section className={"adva-v5-service-experience service-"+slug} aria-label="Interactive service example">
  <div className="adva-v5-svc-intro"><span>TAKE A LOOK</span><p>{slug==="event-staffing"?"Explore the roles you might need.":slug==="photography"?"Change the lighting. See the difference.":"Explore a creative option."}</p></div>
  <div className="adva-v5-svc-stage" data-mode={mode}>
   {slug==="videography"&&<div className="adva-v5-svc-film"><div className={"adva-v5-svc-film-window "+mode}><div className="adva-v5-svc-film-halo"/><div className="adva-v5-svc-film-object"/><span>FRAME / 01</span><strong>A.</strong></div><span className="adva-v5-svc-stage-note">ONE STORY. DIFFERENT FORMATS.</span></div>}
   {slug==="photography"&&<div className="adva-v5-svc-photo" style={{filter:"brightness("+(brightness/60)+")"}}><div className="adva-v5-svc-photo-light"/><div className="adva-v5-svc-photo-object"/><div className="adva-v5-svc-photo-base"/><span>LIGHT / STUDY 01</span></div>}
   {slug==="video-editing"&&<div className={"adva-v5-svc-edit "+mode}><div className="adva-v5-svc-edit-ring"/><strong>COMPOSE<br/>THE FRAME.</strong><span>COLOUR / PACING / SOUND</span></div>}
   {slug==="branding"&&<div className={"adva-v5-svc-brand "+mode}><span>IDENTITY / ORIGINAL STUDY</span><strong>FORM<span>.</span></strong><div className="adva-v5-svc-brand-line"/></div>}
   {slug==="website-design"&&<div className={"adva-v5-svc-web "+mode}><div className="adva-v5-svc-web-shell"><div className="adva-v5-svc-web-nav"><b>FORM.</b><i/></div><div className="adva-v5-svc-web-hero"><span>AN INTERFACE CONCEPT</span><h3>Not just<br/>another page.</h3></div><div className="adva-v5-svc-web-bars"><i/><i/><i/></div></div></div>}
   {slug==="social-media-management"&&<div className={"adva-v5-svc-social "+mode}><div className="adva-v5-svc-social-content"><small>{mode.toUpperCase()} / CONCEPT</small><strong>Make<br/>people<br/>look.</strong><i/></div><div className="adva-v5-svc-social-outline"/></div>}
   {slug==="marketing"&&<div className={"adva-v5-svc-marketing "+mode}><span>CAMPAIGN DIRECTION / CONCEPT</span><h3>{goals[mode]?.title}</h3><p>{goals[mode]?.text}</p><div className="adva-v5-svc-marketing-marks"><i/><i/><i/><i/></div></div>}
   {slug==="event-coverage"&&<div className={"adva-v5-svc-events "+mode}><span>EVENT COVERAGE / WORKFLOW</span><div className="adva-v5-svc-event-circle"/><h3>{eventSteps[mode]?.title}</h3><p>{eventSteps[mode]?.note}</p></div>}
   {slug==="event-staffing"&&<div className="adva-v5-svc-staff"><div className="adva-v5-svc-staff-number">{String(roles.length).padStart(2,"0")}</div><span>SELECTED EVENT ROLES</span><p>A rough staffing outline, not an availability confirmation.</p></div>}
  </div>
  {slug==="photography"?<div className="adva-v5-svc-bottom"><label htmlFor="adva-photo-light">LIGHT INTENSITY</label><input id="adva-photo-light" type="range" min="30" max="85" value={brightness} onChange={e=>setBrightness(Number(e.target.value))}/><span>{brightness}%</span></div>:slug==="event-staffing"?<div className="adva-v5-svc-role-select" role="group" aria-label="Event staffing roles">{roleOptions.map(r=><button key={r} aria-pressed={roles.includes(r)} className={roles.includes(r)?"selected":""} onClick={()=>toggle(r)} type="button">{r}<AdvaIcon name={roles.includes(r)?"check":"plus"} size={14}/></button>)}</div>:<div className="adva-v5-svc-buttons" role="group" aria-label="Explore service options">{options.map(([label,id])=><button className={mode===id?"selected":""} key={id} type="button" aria-pressed={mode===id} onClick={()=>setMode(id)}>{label}</button>)}</div>}
  <p className="adva-v5-svc-disclaimer">Interactive concept demonstration, not a client project or committed deliverable.</p>
 </section>;
}
