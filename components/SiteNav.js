"use client";

import {useEffect,useRef,useState} from "react";
import {SERVICE_GROUPS,servicesInGroup} from "../lib/services";
import AdvaIcon from "./AdvaIcon";

const destinations=[
 {href:"/brief",label:"Client Inquiries",desc:"Tell us what you're building.",number:"01"},
 {href:"/portal",label:"Client Portal",desc:"Your projects, plans and content.",number:"02"},
 {href:"/join",label:"Join Our Team",desc:"For creative people and collaborators.",number:"03"},
 {href:"/network",label:"Freelancer Sign In",desc:"Already part of the team?",number:"04"}
];
function ServiceLinks({close,expanded}){
 return <div className="adva-v4-services-inner">
  {SERVICE_GROUPS.map(group=><div className="adva-v4-service-group" key={group.id}>
   <span className="adva-v4-group-heading">{group.label}</span>
   {servicesInGroup(group.id).map(service=><a key={service.slug} href={"/services/"+service.slug} onClick={close} tabIndex={expanded?0:-1}>{service.name}<AdvaIcon name="up" size={13}/></a>)}
  </div>)}
 </div>;
}
export default function SiteNav(){
 const [services,setServices]=useState(false);
 const [menu,setMenu]=useState(false);
 const [showMenuServices,setShowMenuServices]=useState(false);
 const serviceRef=useRef(null),triggerRef=useRef(null),closeRef=useRef(null),dialogRef=useRef(null),menuBodyRef=useRef(null);
 useEffect(()=>{
  const esc=e=>{
    if(e.key==="Escape"){setMenu(false);setServices(false);}
    if(e.key==="Tab"&&menu&&dialogRef.current){
      const nodes=[...dialogRef.current.querySelectorAll('a[href],button:not([disabled])')].filter(n=>n.offsetParent!==null);
      if(!nodes.length)return;
      if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes[nodes.length-1].focus();}
      else if(!e.shiftKey&&document.activeElement===nodes[nodes.length-1]){e.preventDefault();nodes[0].focus();}
    }
  };
  const outside=e=>{if(serviceRef.current&&!serviceRef.current.contains(e.target))setServices(false)};
  document.addEventListener("keydown",esc);
  document.addEventListener("pointerdown",outside);
  return()=>{document.removeEventListener("keydown",esc);document.removeEventListener("pointerdown",outside)};
 },[menu]);
 useEffect(()=>{
  if(!menu)return;
  const before=document.body.style.overflow;
  document.body.style.overflow="hidden";
  setServices(false);
  setShowMenuServices(false);
  if(menuBodyRef.current)menuBodyRef.current.scrollTop=0;
  const focusFrame=requestAnimationFrame(()=>closeRef.current?.focus());
  return()=>{cancelAnimationFrame(focusFrame);document.body.style.overflow=before;triggerRef.current?.focus()};
 },[menu]);
 const shut=()=>{setMenu(false);setServices(false)};
 return <>
  <header className="main-header adva-site-nav adva-nav-v4">
    <div className="container header-inner">
      <a href="/" className="brand adva-brand" aria-label="ADVA home" onClick={shut}>
        <img className="brand-logo" src="/adva-logo.webp" alt="ADVA" width="116" height="65"/>
      </a>
      <nav className="adva-desktop-nav adva-v4-primary" aria-label="Main site navigation">
        <div className="adva-menu-holder" ref={serviceRef} onMouseEnter={()=>setServices(true)} onMouseLeave={()=>setServices(false)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setServices(false)}}>
          <button type="button" aria-expanded={services} aria-controls="adva-v4-services-dropdown" className="adva-v4-service-trigger" onClick={()=>setServices(v=>!v)}>Services <AdvaIcon name="chevron" size={14}/></button>
          <div id="adva-v4-services-dropdown" className={"adva-v4-services-dropdown"+(services?" is-open":"")} aria-hidden={!services} inert={!services}>
            <div className="adva-v4-services-top"><span>What we do</span><a href="/services" onClick={shut} tabIndex={services?0:-1}>All services <AdvaIcon name="up" size={14}/></a></div>
            <ServiceLinks close={shut} expanded={services}/>
          </div>
        </div>
        <a href="/#approach" onClick={shut}>How We Work</a>
        <a href="/about" onClick={shut}>About</a>
        <a href="/#contact" onClick={shut}>Contact</a>
      </nav>
      <div className="adva-v4-actions">
        <a className="adva-v4-mobile-services" href="/services">Services</a>
        <a className="adva-v4-inquiry-link adva-v4-project-action" href="/brief" aria-label="Start a project with ADVA"><span className="adva-v4-action-long">Start a Project</span><span className="adva-v4-action-short">Let's Talk</span><AdvaIcon name="up" size={15}/></a>
        <button ref={triggerRef} type="button" className="adva-v4-hamburger" aria-label="Open ADVA menu" aria-expanded={menu} aria-controls="adva-v4-menu" onClick={()=>setMenu(true)}>
          <span className="adva-v4-hamburger-lines" aria-hidden="true"><i/><i/><i/></span>
          <span className="adva-v4-hamburger-text">Menu</span>
        </button>
      </div>
    </div>
  </header>
  <div className={"adva-v4-overlay"+(menu?" is-open":"")} id="adva-v4-menu" aria-hidden={!menu} inert={!menu}>
    <button className="adva-v4-overlay-scrim" type="button" onClick={shut} aria-label="Close menu"/>
    <div className="adva-v4-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-label="ADVA navigation">
      <div className="adva-v4-dialog-header">
        <a href="/" onClick={shut} aria-label="ADVA home"><img src="/adva-logo.webp" alt="ADVA" width="113" height="65"/></a>
        <button className="adva-v4-dialog-close" ref={closeRef} type="button" onClick={shut}>Close <AdvaIcon name="close" size={18}/></button>
      </div>
      <div className="adva-v4-dialog-body" ref={menuBodyRef}>
        <section className="adva-v4-menu-main">
          <p className="adva-v4-menu-eyebrow">Work with ADVA</p>
          <h2>What brings<br/>you here<span>?</span></h2>
          <div className="adva-v4-paths">
            {destinations.map((d,i)=><a key={d.href} href={d.href} onClick={shut} className={"adva-v4-path"+(i===0?" featured":"")}>
              <span className="adva-v4-path-index">{d.number}</span>
              <span className="adva-v4-path-content"><strong>{d.label}</strong><small>{d.desc}</small></span>
              <AdvaIcon name="up" size={22}/>
            </a>)}
          </div>
        </section>
        <aside className="adva-v4-menu-secondary">
          <div className="adva-v4-menu-secondary-top">
            <span>Discover</span>
            <div className="adva-v4-secondary-links">
              <a href="/services" onClick={shut}>Services <AdvaIcon name="up" size={18}/></a>
              <a href="/#approach" onClick={shut}>How We Work <AdvaIcon name="up" size={18}/></a>
              <a href="/about" onClick={shut}>About ADVA <AdvaIcon name="up" size={18}/></a>
              <a href="/#contact" onClick={shut}>Contact <AdvaIcon name="up" size={18}/></a>
            </div>
            <button type="button" className="adva-v4-expand-services" aria-expanded={showMenuServices} onClick={()=>setShowMenuServices(v=>!v)}>
              Browse services <AdvaIcon name={showMenuServices?"minus":"plus"} size={17}/>
            </button>
            {showMenuServices&&<div className="adva-v4-expanded-services">{SERVICE_GROUPS.map(g=><div key={g.id}><span>{g.label}</span>{servicesInGroup(g.id).map(s=><a key={s.slug} href={"/services/"+s.slug} onClick={shut}>{s.name}</a>)}</div>)}</div>}
          </div>
          <div className="adva-v4-menu-mark" aria-hidden="true"><span>A</span><i/></div>
        </aside>
      </div>
      <div className="adva-v4-dialog-footer"><span>ADVA — Creative, media and experiences</span><a href="mailto:inquiries@advaae.com">Email ADVA <AdvaIcon name="up" size={14}/></a></div>
    </div>
  </div>
 </>;
}
