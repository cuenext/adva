"use client";

import {useEffect,useRef,useState} from "react";
import {SERVICES,SERVICE_GROUPS,servicesInGroup} from "../lib/services";

function Arrow(){return <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 16 16 4M6 4h10v10"/></svg>}
function Chevron(){return <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 7 6 6 6-6"/></svg>}

export default function SiteNav(){
  const [open,setOpen]=useState(false);
  const [mobile,setMobile]=useState(false);
  const [mobileServices,setMobileServices]=useState(true);
  const menuRef=useRef(null);
  useEffect(()=>{
    const onKey=e=>{if(e.key==="Escape"){setOpen(false);setMobile(false)}};
    const onDown=e=>{if(menuRef.current&&!menuRef.current.contains(e.target))setOpen(false)};
    document.addEventListener("keydown",onKey);
    document.addEventListener("pointerdown",onDown);
    return()=>{document.removeEventListener("keydown",onKey);document.removeEventListener("pointerdown",onDown)};
  },[]);
  useEffect(()=>{if(!mobile)return;const original=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=original}},[mobile]);
  const close=()=>{setOpen(false);setMobile(false)};
  return <header className="main-header adva-site-nav">
    <div className="container header-inner">
      <a href="/" className="brand adva-brand" aria-label="ADVA, homepage"><img className="brand-logo" src="/adva-logo.webp" alt="ADVA"/><span className="adva-brand-caption">CREATIVE / MEDIA / EXPERIENCES</span></a>
      <nav className="adva-desktop-nav" aria-label="Primary navigation">
        <div className="adva-menu-holder" ref={menuRef} onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false)}}>
          <button type="button" className={"adva-nav-trigger"+(open?" active":"")} aria-expanded={open} aria-controls="adva-services-menu" onClick={()=>setOpen(v=>!v)}>Services <span className="adva-chevron"><Chevron/></span></button>
          <div className={"adva-mega-menu"+(open?" expanded":"")} id="adva-services-menu" aria-hidden={!open}>
            <div className="adva-mega-inner">
              <div className="adva-mega-feature">
                <span className="adva-menu-eyebrow">WHAT WE CAN MAKE HAPPEN</span>
                <strong>A full team.<br/>A more connected idea.</strong>
                <p>From the first sketch to the final frame. Find the right people and craft for your project.</p>
                <a href="/services" tabIndex={open?0:-1} onClick={close}>Explore all services <Arrow/></a>
                <span className="adva-menu-index">ADVA / CAPABILITIES 001—009</span>
              </div>
              <div className="adva-mega-groups">
                {SERVICE_GROUPS.map(g=><section key={g.id} className="adva-mega-group">
                  <div className="adva-mega-group-label"><span style={{background:g.accent}}/> {g.label}</div>
                  {servicesInGroup(g.id).map(s=><a key={s.slug} href={"/services/"+s.slug} onClick={close} tabIndex={open?0:-1} className="adva-mega-link"><span>{s.name}</span><Arrow/></a>)}
                </section>)}
              </div>
            </div>
            <div className="adva-mega-bottom"><span>NOT SURE WHAT YOU NEED?</span><a href="/brief" tabIndex={open?0:-1} onClick={close}>Tell us the idea and we'll help shape it <Arrow/></a></div>
          </div>
        </div>
        <a href="/#work" className="adva-top-link" onClick={close}>Explore</a>
        <a href="/#approach" className="adva-top-link" onClick={close}>Approach</a>
        <a href="/#about" className="adva-top-link" onClick={close}>About ADVA</a><a href="/join" className="adva-top-link" onClick={close}>Join our team</a>
      </nav>
      <a className="adva-nav-cta" href="/brief">Start a project <Arrow/></a>
      <button className={"adva-mobile-toggle"+(mobile?" on":"")} type="button" aria-label={mobile?"Close menu":"Open menu"} aria-expanded={mobile} aria-controls="adva-mobile-panel" onClick={()=>{setMobile(v=>!v);setOpen(false)}}><span/><span/></button>
    </div>
    <div id="adva-mobile-panel" className={"adva-mobile-panel"+(mobile?" visible":"")} aria-hidden={!mobile}>
      <div className="adva-mobile-scroll">
        <div className="adva-mobile-intro">EXPLORE ADVA <span>MENU / 001</span></div>
        <button className="adva-mobile-services-toggle" type="button" onClick={()=>setMobileServices(v=>!v)} aria-expanded={mobileServices}>Services <Chevron/></button>
        {mobileServices&&<div className="adva-mobile-services">{SERVICE_GROUPS.map(g=><div key={g.id}><span className="adva-mobile-group-title">{g.label}</span>{servicesInGroup(g.id).map(s=><a href={"/services/"+s.slug} onClick={close} key={s.slug}>{s.name}<Arrow/></a>)}</div>)}<a href="/services" onClick={close} className="adva-mobile-all">View all capabilities <Arrow/></a></div>}
        <a href="/#work" onClick={close} className="adva-mobile-main-link">Explore <Arrow/></a>
        <a href="/#approach" onClick={close} className="adva-mobile-main-link">Approach <Arrow/></a>
        <a href="/#about" onClick={close} className="adva-mobile-main-link">About ADVA <Arrow/></a><a href="/join" onClick={close} className="adva-mobile-main-link">Join our team <Arrow/></a>
        <a href="/brief" onClick={close} className="adva-mobile-project">Start a project <Arrow/></a>
        <span className="adva-mobile-foot">CREATIVE / MEDIA / EXPERIENCES — ABU DHABI</span>
      </div>
    </div>
  </header>;
}
