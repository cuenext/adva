"use client";
import {useMemo,useState} from "react";
import {SERVICES,SERVICE_GROUPS} from "../lib/services";

const filters=[{id:"all",label:"All"},...SERVICE_GROUPS];
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
       <div><span className="adva-small-eyebrow"><i/> SERVICES</span><h2>What we<br/><em>create.</em></h2></div>
       <div className="adva-exp-blurb"><p>Film, digital, branding, social and events. Explore each discipline.</p><a href="/services">Explore our services <Arrow/></a></div>
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
         <div className="adva-exp-panel-header"><span>{group.label.toUpperCase()}</span></div>
         <div className={"adva-exp-art exp-art-"+active.group} key={active.slug}>
           <div className="adva-exp-art-orbit orbit-a"/><div className="adva-exp-art-orbit orbit-b"/>
           <svg className="adva-exp-art-vector" viewBox="0 0 320 320" fill="none" aria-hidden="true">
             {active.group==="production"?<><circle cx="160" cy="160" r="101" stroke="currentColor" strokeOpacity=".62"/><circle cx="160" cy="160" r="68" stroke="currentColor" strokeOpacity=".23"/><path d="M137 111 208 160 137 209V111Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity=".10"/></>:null}
             {active.group==="digital"?<><rect x="76" y="68" width="163" height="170" rx="22" stroke="currentColor" strokeWidth="2" transform="rotate(-11 76 68)"/><rect x="95" y="90" width="158" height="168" rx="18" stroke="currentColor" strokeOpacity=".45" strokeWidth="2" transform="rotate(7 95 90)"/><path d="M112 172h99M112 193h70M112 214h84" stroke="currentColor" strokeOpacity=".6"/></>:null}
             {active.group==="experiences"?<><path d="M57 161c35-73 72-73 108 0s77 73 111-2M57 202c35-73 72-73 108 0s77 73 111-2M57 119c35-73 72-73 108 0s77 73 111-2" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/><circle cx="159" cy="160" r="107" stroke="currentColor" strokeOpacity=".22"/></>:null}
           </svg>
         </div>
         <div className="adva-exp-panel-bottom">
           <span style={{color:group.accent}}>{group.label.toUpperCase()}</span>
           <h3>{active.statement}</h3><p>{active.short}</p>
           <a href={"/services/"+active.slug}>See how it works <Arrow/></a>
         </div>
       </aside>
     </div>
     <div className="adva-exp-bottom"><span>From idea to execution.</span><a href="/brief">Tell us what you need <Arrow/></a></div>
   </div>
 </section>;
}
