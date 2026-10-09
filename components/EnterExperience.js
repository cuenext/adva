"use client";
import {useRef} from "react";
import AdvaIcon from "./AdvaIcon";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";


const options=[
 {id:"brief",n:"01",eyebrow:"FOR CLIENTS & FUTURE PARTNERS",title:"Bring an idea.",copy:"Starting fresh or changing direction? Tell us what you need and we'll shape the right brief together.",tag:"PROJECT INQUIRIES",href:"/brief",glyph:"arrow"},
 {id:"client",n:"02",eyebrow:"FOR OUR CLIENTS",title:"See what's next.",copy:"Your calendar, project timeline and the work behind every published moment. One place, no email chains.",tag:"CLIENT PORTAL",href:"/portal",glyph:"grid"},
 {id:"network",n:"03",eyebrow:"FOR CREATIVE PEOPLE",title:"Join the people.",copy:"Introduce your work, build your ADVA profile and discover opportunities once you're verified and onboarded.",tag:"ADVA CREATIVE NETWORK",href:"/join",glyph:"users"}
];
function EntryCard({item}){
 const root=useRef(null);
 function track(e){
  if(!root.current||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const box=root.current.getBoundingClientRect();
  root.current.style.setProperty("--card-x",((e.clientX-box.left)/box.width*100)+"%");
  root.current.style.setProperty("--card-y",((e.clientY-box.top)/box.height*100)+"%");
 }
 return <a className={"adva-entry-card entry-"+item.id} ref={root} href={item.href} onPointerMove={track}>
  <div className="adva-entry-card-top"><span>{item.n} / {item.tag}</span><span className="adva-entry-card-arrow"><AdvaIcon name="up" size={19}/></span></div>
  <div className="adva-entry-card-art" aria-hidden="true"><div className="adva-entry-card-art-grid"/><div className="adva-entry-orbit"/><strong><AdvaIcon name={item.glyph} size={84} strokeWidth={1.05}/></strong></div>
  <div className="adva-entry-card-bottom"><span>{item.eyebrow}</span><h2>{item.title}</h2><p>{item.copy}</p><span className="adva-entry-link">Continue <AdvaIcon name="arrow" size={18}/></span></div>
 </a>;
}
export default function EnterADVA(){return <div className="website adva-entry-page"><SiteNav/><main>
 <section className="adva-entry-hero"><div className="container">
  <div className="adva-entry-eyebrow"><span className="adva-entry-light"/> WELCOME TO ADVA <span>ABU DHABI · EVERYWHERE</span></div>
  <h1>Choose your<br/><em>way in.</em></h1>
  <div className="adva-entry-hero-lower"><p>Let's make the next step simple. Start a project, check in on your work or join the creative network.</p><span><AdvaIcon name="down" size={18}/></span></div>
 </div></section>
 <section className="adva-entry-options"><div className="container"><div className="adva-entry-options-header"><span>CHOOSE YOUR PATH</span><span></span></div><div className="adva-entry-grid">{options.map(x=><EntryCard key={x.id} item={x}/>)}</div><div className="adva-entry-end"><span>ALREADY WORKING WITH ADVA?</span><a href="/portal">Access your client portal →</a></div></div></section>
 </main><SiteFooter/></div>;}
