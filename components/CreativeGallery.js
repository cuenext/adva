"use client";
import {useEffect,useRef,useState} from "react";
import AdvaIcon from "./AdvaIcon";

const studies=[
 {id:"frame",number:"01",category:"motion",type:"Motion",name:"Frame / 01",detail:"An exploration of pacing, contrast and on-screen composition.",service:"video-editing"},
 {id:"identity",number:"02",category:"identity",type:"Identity",name:"The mark",detail:"A graphic study in identity, repetition and restraint.",service:"branding"},
 {id:"stage",number:"03",category:"live",type:"Live",name:"In the room",detail:"An imagined stage composition, built around atmosphere and light.",service:"event-coverage"},
 {id:"interface",number:"04",category:"digital",type:"Digital",name:"New perspectives",detail:"A responsive-interface concept focused on typography and hierarchy.",service:"website-design"},
 {id:"stills",number:"05",category:"motion",type:"Photography",name:"Light study",detail:"An abstract still-life lighting and composition study.",service:"photography"},
 {id:"type",number:"06",category:"identity",type:"Design",name:"Type in motion",detail:"Kinetic typography, forms and modular layouts.",service:"branding"}
];
const categories=[["all","All"],["motion","Motion & stills"],["identity","Identity"],["digital","Digital"],["live","Live"]];
function StudyVisual({id}){
 if(id==="frame")return <div className="adva-study-visual adva-study-frame"><div className="as-frame-grid"/><div className="as-frame-ring"/><div className="as-frame-shape"/><div className="as-frame-inner"/><span className="as-frame-number">00:14:07:12</span><span className="as-frame-caption">COMPOSITION / MOVEMENT</span></div>;
 if(id==="identity")return <div className="adva-study-visual adva-study-identity"><span className="as-ident-top">ADVA® / GRAPHIC STUDY</span><strong>A<span>.</span></strong><div className="as-ident-stripes"><i/><i/><i/></div><small>FORM / 002</small></div>;
 if(id==="stage")return <div className="adva-study-visual adva-study-stage"><div className="as-stage-ceiling"/><div className="as-stage-arc"/><div className="as-stage-arc second"/><div className="as-stage-arc third"/><div className="as-stage-floor"/><span>LIGHT / SPACE / SCALE</span></div>;
 if(id==="interface")return <div className="adva-study-visual adva-study-interface"><div className="as-ui-window"><div className="as-ui-navigation"><strong>FORM.</strong><span>WORK / ABOUT / CONTACT</span></div><div className="as-ui-type">Built to<br/><em>be different.</em></div><div className="as-ui-rule"/><div className="as-ui-bottom"><span>001 / EXPERIENCE</span><span>DISCOVER —</span></div></div></div>;
 if(id==="stills")return <div className="adva-study-visual adva-study-stills"><div className="as-still-halo"/><div className="as-still-object"/><div className="as-still-shadow"/><span>LIGHT STUDY / 35MM</span></div>;
 return <div className="adva-study-visual adva-study-type"><div className="as-type-flow"><span>LOOK</span><span>AGAIN</span><span className="as-type-finish">.</span></div><div className="as-type-lines"/><small>TYPOGRAPHY / EXPERIMENT 06</small></div>;
}
export default function CreativeGallery({full=false}){
 const [filter,setFilter]=useState("all"),[selected,setSelected]=useState(null);
 const closeRef=useRef(null),returnFocus=useRef(null);
 const visible=studies.filter(s=>!full?["frame","identity","stage","interface"].includes(s.id):filter==="all"||s.category===filter);
 useEffect(()=>{
  if(!selected)return;
  const overflow=document.body.style.overflow;document.body.style.overflow="hidden";
  const escape=e=>{if(e.key==="Escape")setSelected(null);if(e.key==="Tab"){const dialog=document.querySelector(".adva-gallery-dialog");if(!dialog)return;const els=[...dialog.querySelectorAll("button,a[href]")];if(!els.length)return;if(e.shiftKey&&document.activeElement===els[0]){e.preventDefault();els[els.length-1].focus()}else if(!e.shiftKey&&document.activeElement===els[els.length-1]){e.preventDefault();els[0].focus()}}};
  document.addEventListener("keydown",escape);closeRef.current?.focus();
  return()=>{document.body.style.overflow=overflow;document.removeEventListener("keydown",escape);returnFocus.current?.focus()};
 },[selected]);
 function open(s,e){returnFocus.current=e.currentTarget;setSelected(s)}
 return <section id={full?"studies":"work"} className={"adva-v5-gallery"+(full?" full":"")} aria-labelledby="adva-gallery-heading">
  <div className="container">
   <div className="adva-v5-section-head">
    <div><span className="adva-v5-kicker">{full?"ADVA LAB":"THE CREATIVE GALLERY"}</span><h2 id="adva-gallery-heading">{full?<>Ideas, tested<br/><em>in public.</em></>:<>A closer<br/><em>look.</em></>}</h2></div>
    <p>{full?"Experiments in motion, identity, digital and physical space. Uncommissioned studies created to explore new ideas.":"Creative disciplines, explored through original design studies. Real production work will be added with publication approval."}</p>
   </div>
   {full&&<div className="adva-gallery-filterbar" role="group" aria-label="Filter concept gallery">{categories.map(([id,name])=><button key={id} type="button" className={id===filter?"active":""} aria-pressed={id===filter} onClick={()=>setFilter(id)}>{name}</button>)}</div>}
   <div className="adva-gallery-grid">
    {visible.map((study,i)=><button key={study.id} type="button" className={"adva-gallery-card "+study.id} onClick={e=>open(study,e)} aria-label={"Open "+study.name+" concept study"}>
      <div className="adva-gallery-art"><StudyVisual id={study.id}/><div className="adva-gallery-art-overlay"><span>VIEW STUDY</span><AdvaIcon name="up" size={19}/></div></div>
      <div className="adva-gallery-card-bottom"><span className="adva-gallery-card-index">{study.number} / {study.type}</span><div><h3>{study.name}</h3><AdvaIcon name="up" size={20}/></div></div>
    </button>)}
   </div>
   <div className="adva-gallery-bottom"><span>These are original visual concepts, not client commissions.</span>{!full?<a href="/lab">Enter ADVA Lab <AdvaIcon name="up" size={18}/></a>:<a href="/brief">Bring us a real brief <AdvaIcon name="up" size={18}/></a>}</div>
  </div>
  {selected&&<div className="adva-gallery-modal"><button type="button" className="adva-gallery-scrim" onClick={()=>setSelected(null)} aria-label="Close concept viewer"/><div className="adva-gallery-dialog" role="dialog" aria-modal="true" aria-labelledby="adva-gallery-title"><div className="adva-gallery-modal-top"><span>ADVA LAB / {selected.number}</span><button type="button" ref={closeRef} onClick={()=>setSelected(null)}>Close <AdvaIcon name="close" size={17}/></button></div><div className="adva-gallery-modal-image"><StudyVisual id={selected.id}/></div><div className="adva-gallery-modal-text"><div><span>ORIGINAL CONCEPT / {selected.type.toUpperCase()}</span><h2 id="adva-gallery-title">{selected.name}</h2><p>{selected.detail}</p><small>Demonstration artwork. Not photographed or produced for a client.</small></div><a href={"/services/"+selected.service}>Related service <AdvaIcon name="up" size={17}/></a></div></div></div>}
 </section>;
}
