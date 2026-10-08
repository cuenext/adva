"use client";
import {useMemo,useState} from "react";
import {SERVICES,SERVICE_GROUPS} from "../lib/services";

const filters=[{id:"all",label:"All capabilities"},...SERVICE_GROUPS];
function Arrow(){return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 19 19 4M7 4h12v12"/></svg>}

export default function ServicesShowcase(){
 const [activeGroup,setActiveGroup]=useState("all");
 const [focused,setFocused]=useState(null);
 const list=useMemo(()=>activeGroup==="all"?SERVICES:SERVICES.filter(s=>s.group===activeGroup),[activeGroup]);
 const active=(focused&&list.find(s=>s.slug===focused))||list[0];
 const group=SERVICE_GROUPS.find(g=>g.id===active.group);
 return <section className="adva-expertise" id="services">
   <div className="container">
     <div className="adva-exp-intro">
       <div><span className="adva-small-eyebrow"><i/> 01 — CAPABILITIES</span><h2>Every detail<br/><em>has its people.</em></h2></div>
       <div className="adva-exp-blurb"><p>We're specific about what we do. Pick one capability or build the right combination around your project.</p><a href="/services">Explore our services <Arrow/></a></div>
     </div>
     <div className="adva-exp-filters" role="group" aria-label="Filter services">
       {filters.map(f=><button key={f.id} type="button" onClick={()=>{setActiveGroup(f.id);setFocused(null)}} className={activeGroup===f.id?"selected":""} aria-pressed={activeGroup===f.id}>{f.label}</button>)}
     </div>
     <div className="adva-exp-body">
       <div className="adva-exp-list" aria-label="ADVA services">
         {list.map((s,i)=><a key={s.slug} href={"/services/"+s.slug} className={"adva-exp-row"+(active.slug===s.slug?" is-active":"")} onMouseEnter={()=>setFocused(s.slug)} onFocus={()=>setFocused(s.slug)}>
            <span className="adva-exp-number">{s.number.padStart(2,"0")}</span><span className="adva-exp-name">{s.name}</span><Arrow/>
         </a>)}
       </div>
       <aside className="adva-exp-preview" aria-live="polite">
         <div className="adva-exp-panel-header"><span>THE ADVA TOOLKIT</span><span>{active.number} / 09</span></div>
         <div className={"adva-exp-art exp-art-"+active.group} key={active.slug}>
           <div className="adva-exp-art-orbit orbit-a"/><div className="adva-exp-art-orbit orbit-b"/>
           <span className="adva-exp-art-glyph">{active.group==="production"?"◉":active.group==="digital"?"✳":"✦"}</span>
           <span className="adva-exp-art-slug">{active.eyebrow}</span>
         </div>
         <div className="adva-exp-panel-bottom">
           <span style={{color:group.accent}}>{group.label.toUpperCase()}</span>
           <h3>{active.statement}</h3><p>{active.short}</p>
           <a href={"/services/"+active.slug}>See how it works <Arrow/></a>
         </div>
       </aside>
     </div>
     <div className="adva-exp-bottom"><span>ONE IDEA. MULTIPLE DISCIPLINES. NO UNNECESSARY HANDOFFS.</span><a href="/brief">Not sure where to start? Build a brief <Arrow/></a></div>
   </div>
 </section>;
}
