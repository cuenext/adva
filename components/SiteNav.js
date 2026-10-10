"use client";

import {useEffect,useRef,useState} from "react";
import {SERVICE_GROUPS,servicesInGroup} from "../lib/services";
import AdvaIcon from "./AdvaIcon";

const primaryPages=[
 {href:"/services",label:"Services"},
 {href:"/work",label:"Work"},
 {href:"/about",label:"About"},
 {href:"/#contact",label:"Contact"}
];
const accounts=[
 {href:"/portal",label:"Client portal"},
 {href:"/network",label:"Freelancer sign in"},
 {href:"/join",label:"Join our team"}
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
 const serviceRef=useRef(null),triggerRef=useRef(null),closeRef=useRef(null),dialogRef=useRef(null),serviceCloseTimer=useRef(null);

 const cancelServiceClose=()=>{
  if(serviceCloseTimer.current!==null){clearTimeout(serviceCloseTimer.current);serviceCloseTimer.current=null}
 };
 const openServiceMenu=()=>{cancelServiceClose();if(!menu)setServices(true)};
 const scheduleServiceClose=()=>{
  cancelServiceClose();
  serviceCloseTimer.current=setTimeout(()=>{serviceCloseTimer.current=null;setServices(false)},220);
 };
 const closeAll=()=>{cancelServiceClose();setMenu(false);setServices(false)};

 useEffect(()=>{
  const onKey=e=>{
   if(e.key==="Escape"){
    if(menu){e.preventDefault();setMenu(false)}
    else setServices(false);
   }
   if(e.key==="Tab"&&menu&&dialogRef.current){
    const nodes=[...dialogRef.current.querySelectorAll('a[href],button:not([disabled])')]
      .filter(node=>node.getClientRects().length>0);
    if(!nodes.length)return;
    if(e.shiftKey&&document.activeElement===nodes[0]){
     e.preventDefault();nodes[nodes.length-1].focus();
    }else if(!e.shiftKey&&document.activeElement===nodes[nodes.length-1]){
     e.preventDefault();nodes[0].focus();
    }
   }
  };
  const outside=e=>{if(serviceRef.current&&!serviceRef.current.contains(e.target))setServices(false)};
  document.addEventListener("keydown",onKey);
  document.addEventListener("pointerdown",outside);
  return()=>{
   document.removeEventListener("keydown",onKey);
   document.removeEventListener("pointerdown",outside);
   if(serviceCloseTimer.current!==null)clearTimeout(serviceCloseTimer.current);
  };
 },[menu]);

 useEffect(()=>{
  if(!menu)return;
  const previousOverflow=document.body.style.overflow;
  document.body.style.overflow="hidden";
  document.body.dataset.advaMenuOpen="true";
  setServices(false);
  const focusFrame=requestAnimationFrame(()=>closeRef.current?.focus());
  return()=>{
   cancelAnimationFrame(focusFrame);
   document.body.style.overflow=previousOverflow;
   delete document.body.dataset.advaMenuOpen;
   triggerRef.current?.focus({preventScroll:true});
  };
 },[menu]);

 return <>
  <header className="main-header adva-site-nav adva-nav-v4 adva-nav-clean" onMouseLeave={scheduleServiceClose}>
   <div className="container header-inner">
    <a href="/" className="brand adva-brand" aria-label="ADVA home" onClick={closeAll}>
     <img className="brand-logo" src="/adva-logo.webp" alt="ADVA" width="116" height="65"/>
    </a>
    <nav className="adva-desktop-nav adva-v4-primary" aria-label="Primary navigation">
     <div className="adva-menu-holder" ref={serviceRef} onMouseEnter={openServiceMenu} onBlur={e=>{
      if(!e.currentTarget.contains(e.relatedTarget)){cancelServiceClose();setServices(false)}
     }}>
      <button type="button" aria-expanded={services} aria-controls="adva-v4-services-dropdown" className="adva-v4-service-trigger" onClick={()=>{cancelServiceClose();setServices(v=>!v)}}>
       Services <AdvaIcon name="chevron" size={14}/>
      </button>
      <div id="adva-v4-services-dropdown" className={"adva-v4-services-dropdown"+(services?" is-open":"")} onMouseEnter={cancelServiceClose} aria-hidden={!services} inert={!services}>
       <div className="adva-v4-services-top"><span>Our services</span><a href="/services" onClick={closeAll} tabIndex={services?0:-1}>View all services <AdvaIcon name="up" size={14}/></a></div>
       <ServiceLinks close={closeAll} expanded={services}/>
      </div>
     </div>
     <a href="/work" onClick={closeAll}>Work</a>
     <a href="/about" onClick={closeAll}>About</a>
    </nav>
    <div className="adva-v4-actions">
     <a className="adva-v4-mobile-services" href="/services" onClick={closeAll}>Services</a>
     <a className="adva-v4-inquiry-link adva-v4-project-action" href="/brief" onClick={closeAll} aria-label="Start a project with ADVA">
      <span className="adva-v4-action-long">Start a Project</span><span className="adva-v4-action-short">Let's Talk</span><AdvaIcon name="up" size={15}/>
     </a>
     <button ref={triggerRef} type="button" className="adva-v4-hamburger" aria-label="Open navigation menu" aria-expanded={menu} aria-controls="adva-clean-menu" onClick={()=>{cancelServiceClose();setServices(false);setMenu(true)}}>
      <span className="adva-v4-hamburger-lines" aria-hidden="true"><i/><i/><i/></span>
      <span className="adva-v4-hamburger-text">Menu</span>
     </button>
    </div>
   </div>
  </header>

  <div className={"adva-v6-overlay"+(menu?" is-open":"")} id="adva-clean-menu" aria-hidden={!menu} inert={!menu}>
   <button className="adva-v6-scrim" type="button" onClick={closeAll} aria-label="Close navigation menu"/>
   <div className="adva-v6-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="adva-v6-menu-title">
    <div className="adva-v6-top">
     <a href="/" onClick={closeAll} aria-label="ADVA home"><img src="/adva-logo.webp" alt="ADVA" width="119" height="65"/></a>
     <span className="adva-v6-top-caption" id="adva-v6-menu-title">Navigation</span>
     <button className="adva-v6-close" ref={closeRef} type="button" onClick={closeAll} aria-label="Close navigation">
      Close <AdvaIcon name="close" size={16}/>
     </button>
    </div>
    <div className="adva-v6-content">
     <section className="adva-v6-main" aria-label="Explore ADVA">
      <p className="adva-v6-eyebrow">Explore ADVA</p>
      <nav className="adva-v6-primary" aria-label="Site pages">
       {primaryPages.map(({href,label},i)=><a key={href} href={href} onClick={closeAll}>
        <span className="adva-v6-index">{String(i+1).padStart(2,"0")}</span>
        <strong>{label}</strong>
        <AdvaIcon name="up" size={23}/>
       </a>)}
      </nav>
     </section>
     <aside className="adva-v6-aside">
      <p className="adva-v6-eyebrow">Let's work together</p>
      <h2>Something<br/>in mind?</h2>
      <p className="adva-v6-intro">Tell us what you're planning. We'll help shape the next step.</p>
      <a href="/brief" className="adva-v6-cta" onClick={closeAll}>Start a project <AdvaIcon name="up" size={19}/></a>
      <div className="adva-v6-utility">
       <p className="adva-v6-eyebrow">Your ADVA space</p>
       <div className="adva-v6-account-links">
        {accounts.map(({href,label})=><a href={href} key={href} onClick={closeAll}>{label}<AdvaIcon name="up" size={13}/></a>)}
       </div>
      </div>
     </aside>
    </div>
    <div className="adva-v6-bottom">
     <a href="/#approach" onClick={closeAll}>Our approach <AdvaIcon name="up" size={12}/></a>
     <span>Abu Dhabi · UAE</span>
     <a href="mailto:inquiries@advaae.com">inquiries@advaae.com</a>
    </div>
   </div>
  </div>
 </>;
}
