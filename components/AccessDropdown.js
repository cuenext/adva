"use client";
import {useEffect,useRef,useState} from "react";

const doors=[
 {href:"/brief",n:"01",icon:"↗",title:"Start a project",copy:"An idea, a question, a brief. Tell us what you have in mind.",tag:"CLIENT INQUIRIES"},
 {href:"/portal",n:"02",icon:"◈",title:"Client space",copy:"Your content calendar, performance and project updates.",tag:"EXISTING CLIENTS"},
 {href:"/join",n:"03",icon:"✳",title:"Join ADVA",copy:"Your creative profile, opportunities and the team network.",tag:"CREATORS & FREELANCERS"}
];
export default function AccessDropdown(){
 const [open,setOpen]=useState(false),root=useRef(null);
 useEffect(()=>{
  if(!open)return;
  function onOutside(e){if(root.current&&!root.current.contains(e.target))setOpen(false)}
  function onEscape(e){if(e.key==="Escape")setOpen(false)}
  document.addEventListener("pointerdown",onOutside);
  document.addEventListener("keydown",onEscape);
  return()=>{document.removeEventListener("pointerdown",onOutside);document.removeEventListener("keydown",onEscape)};
 },[open]);
 return <div className="adva-access-holder" ref={root}>
  <button type="button" className={"adva-access-trigger"+(open?" open":"")} aria-haspopup="true" aria-controls="adva-access-options" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>
    <span className="adva-access-trigger-orb" aria-hidden="true">✳</span>
    <span className="adva-access-word">Enter ADVA</span>
    <span className="adva-access-chevron" aria-hidden="true">{open?"−":"+"}</span>
  </button>
  <div id="adva-access-options" className={"adva-access-panel"+(open?" expanded":"")} aria-hidden={!open}>
   <div className="adva-access-panel-head"><div><span>THE ADVA EXPERIENCE / ACCESS</span><h2>You're in the right place.</h2></div><small>01—03</small></div>
   <div className="adva-access-options">
    {doors.map(d=><a key={d.n} href={d.href} tabIndex={open?0:-1} onClick={()=>setOpen(false)}>
      <div className="adva-access-option-rail"><span>{d.n}</span><b>{d.icon}</b></div>
      <div className="adva-access-option-copy"><small>{d.tag}</small><strong>{d.title}</strong><p>{d.copy}</p></div>
      <span className="adva-access-option-arrow" aria-hidden="true">↗</span>
    </a>)}
   </div>
   <a className="adva-access-panel-foot" href="/enter" onClick={()=>setOpen(false)} tabIndex={open?0:-1}>Explore all the ways into ADVA <span>↗</span></a>
  </div>
 </div>;
}
