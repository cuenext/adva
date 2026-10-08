"use client";
import CinematicHero from "../components/CinematicHero";
import { useEffect, useRef, useState } from "react";

const SERVICES = [
  { id:"film", n:"01", name:"Film & photography", tag:"PRODUCTION", tagline:"Good stories deserve great visuals.", copy:"Campaign films, photography, interviews, event highlights and platform-ready content. Made with a purpose, not just a camera.", chips:["Video production","Photography","Interviews"], triggers:["film","video","photo","shoot","reel","camera","interview","content","visual","media","coverage"] },
  { id:"events", n:"02", name:"Events & exhibitions", tag:"EXPERIENCES", tagline:"Make the moment matter.", copy:"Exhibition coverage, conferences, activations and launches, with creative planning and smooth on-ground execution.", chips:["Exhibitions","Launches","Event coverage"], triggers:["event","exhibition","show","conference","booth","launch","expo","activation","fair","corporate"] },
  { id:"social", n:"03", name:"Social & digital", tag:"GROWTH", tagline:"Content worth stopping for.", copy:"Content calendars, creative direction, reels, campaigns and social media support built around a distinct brand voice.", chips:["Social media","Content strategy","Campaigns"], triggers:["social","marketing","content","instagram","tiktok","reels","post","brand","digital","ads","campaign","growth"] },
  { id:"branding", n:"04", name:"Brand & web", tag:"IDENTITY", tagline:"A fresh perspective on your brand.", copy:"Brand refreshes, design systems, thoughtful websites and connected digital touchpoints that feel like one cohesive story.", chips:["Brand identity","Websites","Creative"], triggers:["website","web","brand","identity","rebrand","design","creative","visual","logo","refresh","site"] },
  { id:"staff", n:"05", name:"Staffing & operations", tag:"ON THE GROUND", tagline:"The right people. The right energy.", copy:"Event crew, hosts, registration support and project coordination to keep the experience as polished as the content.", chips:["Event crew","Registration","Coordination"], triggers:["staff","crew","host","ushers","registration","operations","manpower","support","coordinator","team"] },
  { id:"post", n:"06", name:"Editing & finishing", tag:"POST-PRODUCTION", tagline:"All the details, dialled in.", copy:"Editing, colour, retouching, subtitling and multiple platform-ready formats. The finishing touches that bring it all together.", chips:["Video editing","Colour","Delivery"], triggers:["edit","editing","subtitle","colour","color","retouch","post","grading","deliverables"] }
];

const PROJECTS = [
  { index:"01", id:"silwadi", type:"BRAND TRANSFORMATION", name:"Silwadi", sector:"HEALTHCARE · ABU DHABI", desc:"A complete rethink of how an established dental centre shows up. From visual identity and a bilingual website to doctor-led content and a more cohesive digital presence.", services:["Rebranding","Website","Content & social"], detail:"38K+ organic Instagram views", note:"September 2026 reporting period", visual:"silwadi", featured:true },
  { index:"02", id:"bluetti", type:"EXHIBITION PRODUCTION", name:"BLUETTI", sector:"GLOBAL BRAND · UAE EVENTS", desc:"Exhibition photography, interviews and edited event coverage across ADIHEX Abu Dhabi and Middle East Energy Dubai.", services:["Exhibition media","Interviews","Photo & video"], detail:"2 UAE exhibitions", note:"ADIHEX + Middle East Energy 2026", visual:"bluetti" },
  { index:"03", id:"infinity", type:"EVENT STORYTELLING", name:"Infinity Glory", sector:"TECHNOLOGY · EXHIBITIONS", desc:"Visual storytelling and exhibition support around ambitious technology and manufacturing showcases, including UMEX and Make it in the Emirates.", services:["Event coverage","Brand storytelling","On-ground"], detail:"Technology in focus", note:"Exhibition project work", visual:"infinity" },
  { index:"04", id:"doctors", type:"PERSONAL BRAND CONTENT", name:"Doctor-led stories", sector:"HEALTHCARE · SHORT-FORM", desc:"A more human approach to health content: clear educational scripts, approachable filming and short-form creative for individual doctor brands, including SmileByDana.", services:["Creative strategy","Reels","Personal branding"], detail:"People first. Always.", note:"Selected doctor-focused content", visual:"doctors" }
];

const CONTACT_EMAIL="inquiries@advaae.com";
const PHONE="+971 58 587 6114";
const WHATSAPP="971585876114";

function Icon({type="arrow",size=20}) {
 const props={width:size,height:size,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":true};
 const shapes={
  arrow:<><path d="M4 12h16"/><path d="m13 5 7 7-7 7"/></>,
  up:<><path d="M5 19 19 5M7 5h12v12"/></>,
  search:<><circle cx="10.8" cy="10.8" r="6.7"/><path d="m16 16 5 5"/></>,
  menu:<><path d="M4 7h16M4 12h16M4 17h16"/></>,
  close:<><path d="M5 5 19 19M19 5 5 19"/></>,
  mail:<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
  film:<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16m10-16v16M3 9h4m-4 6h4m10-6h4m-4 6h4"/></>,
  events:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-12 5h6"/></>,
  social:<><rect x="3" y="3" width="18" height="18" rx="6"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></>,
  branding:<><path d="m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6L12 2z"/></>,
  staff:<><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2m1-12a3 3 0 0 1 0 6m5 6v-2a5 5 0 0 0-3-4.6"/></>,
  post:<><path d="m14 5 5 5M3 21l4.5-.7L20 7.8a2.1 2.1 0 0 0-3-3L4.4 17.5 3 21z"/></>,
  whatsapp:<><path d="M19.1 4.9A9.7 9.7 0 0 0 3.7 16.2L2.5 21.5l5.5-1.2a9.7 9.7 0 0 0 11.1-15.4z"/><path d="M8.2 8.1c-.3.2-.7 1.1-.6 1.6.3 2.7 3.7 6 6.6 6.5.5.1 1.4-.3 1.7-.8l.5-1-2.5-1.2-1 1.1c-1.2-.6-2.4-1.8-3-3l1-1-1.2-2.4z"/></>
 };
 return <svg {...props}>{shapes[type]||shapes.arrow}</svg>;
}
function Brand({inverse=false}) {return <a className={"brand"+(inverse?" brand-inverse":"")} href="#top" aria-label="ADVA, back to top"><img className="brand-logo" src="/adva-logo.webp" alt="ADVA" onError={(e)=>{e.currentTarget.style.display="none";e.currentTarget.nextElementSibling.style.display="inline-block";}}/><span className="brand-fallback">ADVA<span className="brand-fallback-dot">.</span></span></a>;}
function SectionLabel({children,light=false}) {return <div className={"section-label"+(light?" section-label-light":"")}><span className="section-label-bullet"/> {children}</div>;}
function ProjectArt({item}) {
 return <div className={"project-art project-art-"+item.visual} aria-hidden="true">
   <div className="project-art-grain"/><div className="project-art-grid"/><div className="project-art-orbit orbit-one"/><div className="project-art-orbit orbit-two"/>
   {item.visual==="silwadi" && <><span className="project-art-kicker">A NEW CHAPTER</span><div className="silwadi-art"><span className="silwadi-symbol">S</span><span>silwadi.</span><small>THOUGHTFUL CARE, REIMAGINED</small></div><span className="project-floating project-floating-a">IDENTITY ↗</span><span className="project-floating project-floating-b">DIGITAL ↗</span></>}
   {item.visual==="bluetti" && <><span className="project-art-kicker">EXHIBITION STORIES</span><div className="bluetti-art"><span className="bluetti-burst">✦</span><strong>POWER<br/>IN MOTION<span>.</span></strong></div><div className="bluetti-film"><i/><i/><i/><i/><i/><i/></div><span className="project-floating project-floating-a">ADIHEX / MEE</span></>}
   {item.visual==="infinity" && <><span className="project-art-kicker">BEYOND THE EXPECTED</span><div className="infinity-art"><span>∞</span><small>IDEAS IN FLIGHT</small></div><span className="project-floating project-floating-b">EXHIBITIONS / TECH</span></>}
   {item.visual==="doctors" && <><span className="project-art-kicker">CONTENT WITH CHARACTER</span><div className="doctors-art"><span className="doctors-smile">:)</span><strong>Human<br/><em>stories.</em></strong></div><span className="project-floating project-floating-a">MADE TO CONNECT</span></>}
 </div>;
}
function ProjectCard({item}) {return <article className={"project-card"+(item.featured?" project-card-featured":"")} data-reveal>
 <ProjectArt item={item}/>
 <div className="project-info"><div className="project-meta"><span>{item.type}</span><span>{item.sector}</span></div><h3>{item.name}</h3><p>{item.desc}</p><div className="project-scope">{item.services.map(x=><span key={x}>{x}</span>)}</div><div className="project-impact"><strong>{item.detail}</strong><span>{item.note}</span></div><a className="project-open" href={"/work/"+item.id}>Explore the project <Icon type="up" size={17}/></a></div>
 </article>;}
function BriefResult({brief,reset}) {
 const ranked=SERVICES.map(s=>({...s,score:s.triggers.reduce((a,t)=>a+(brief.toLowerCase().includes(t)?1:0),0)})).sort((a,b)=>b.score-a.score);
 const suggested=ranked[0].score>0?ranked.slice(0,2):[SERVICES[0],SERVICES[1]];
 const mail="mailto:"+CONTACT_EMAIL+"?subject="+encodeURIComponent("ADVA — new project inquiry")+"&body="+encodeURIComponent("Hello ADVA,\n\nHere's what I'm looking for:\n"+brief+"\n\nName:\nCompany:\nTimeline:\n\nThank you.");
 const wa="https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent("Hello ADVA! I'd like to discuss a project:\n"+brief);
 return <div className="brief-result" role="status" aria-live="polite">
   <div className="brief-result-header"><span><i/> YOUR NEXT STEP</span><button type="button" onClick={reset}>Start over ×</button></div>
   <h3>We like where this is going.</h3><p>These ADVA services could be a fit for your project. Ready to tell us more?</p>
   <div className="result-matches">{suggested.map(s=><a key={s.id} href="#services"><Icon type={s.id} size={19}/><span>{s.name}</span><Icon type="up" size={16}/></a>)}</div>
   <div className="result-links"><a href={mail} className="button blue-button"><Icon type="mail" size={18}/> Send your brief <Icon type="up" size={17}/></a><a href={wa} target="_blank" rel="noopener noreferrer" className="button outline-button"><Icon type="whatsapp" size={17}/> WhatsApp ADVA</a></div>
   <div className="brief-disclaimer">This is a guided project matcher. Your idea stays in your browser until you choose to send it by email or WhatsApp.</div>
 </div>;
}
export default function Home() {
 const [navOpen,setNavOpen]=useState(false),[scroll,setScroll]=useState(false),[brief,setBrief]=useState(""),[result,setResult]=useState("");
 const inputRef=useRef(null);
 useEffect(()=>{const f=()=>setScroll(window.scrollY>26);f();window.addEventListener("scroll",f,{passive:true});return()=>window.removeEventListener("scroll",f);},[]);
 useEffect(()=>{if(!("IntersectionObserver" in window)) return; const ob=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");ob.unobserve(e.target);}}),{threshold:.12,rootMargin:"0px 0px -20px 0px"}); document.querySelectorAll("[data-reveal]").forEach(e=>ob.observe(e));return()=>ob.disconnect();},[]);
 function submit(e){e.preventDefault();if(!brief.trim()){inputRef.current?.focus();return;}setResult(brief.trim());}
 function preset(s){setBrief(s);setResult(s);}
 const closeNav=()=>setNavOpen(false);
 return <div className="website" id="top">
   <div className="top-strip"><span className="top-strip-dot"/> CREATIVE THINKING. REAL-WORLD EXECUTION. <span className="top-strip-star">✦</span> ABU DHABI, UAE</div>
   <header className={"main-header"+(scroll?" scrolled":"")}>
     <div className="container header-inner"><Brand/><nav aria-label="Main navigation" className={"navigation"+(navOpen?" navigation-open":"")}><a href="#services" onClick={closeNav}>What we do</a><a href="#work" onClick={closeNav}>Selected work</a><a href="#about" onClick={closeNav}>About us</a><a href="#contact" onClick={closeNav}>Contact</a></nav><a className="header-contact" href="#contact">Let's talk <span><Icon type="up" size={18}/></span></a><button className="hamburger" aria-label={navOpen?"Close menu":"Open menu"} aria-expanded={navOpen} onClick={()=>setNavOpen(!navOpen)}><Icon type={navOpen?"close":"menu"} size={25}/></button></div>
   </header>
   <main>
     <CinematicHero/>
     <div className="marquee" aria-hidden="true"><div className="marquee-track">{[0,1].map(i=><div className="marquee-chunk" key={i}><span>CREATIVE PRODUCTION</span><b>✳</b><span>BRAND & DIGITAL</span><b>✳</b><span>EVENT EXPERIENCES</span><b>✳</b><span>IDEAS THAT MOVE</span><b>✳</b></div>)}</div></div>
     <section className="services-section section-space" id="services">
       <div className="container"><div className="section-heading heading-split" data-reveal><div><SectionLabel>01 / WHAT WE DO</SectionLabel><h2>All the right ideas.<br/><em>One creative team.</em></h2></div><p>We connect the thinking, the making and the doing. So your project feels cohesive from the first conversation to the final delivery.</p></div>
         <div className="services-grid">{SERVICES.map((s,i)=><article className={"service-card service-"+s.id} data-reveal key={s.id} style={{transitionDelay:(i%3)*55+"ms"}}>
           <div className="service-top"><span>{s.n} / {s.tag}</span><div className="service-symbol"><Icon type={s.id} size={26}/></div></div><div className="service-visual" aria-hidden="true"><span className="service-ring ring-main"/><span className="service-ring ring-second"/><span className="service-art-char">{s.id==="film"?"▣":s.id==="events"?"✳":s.id==="social"?"◎":s.id==="branding"?"✦":s.id==="staff"?"◈":"◉"}</span></div><h3>{s.name}</h3><p>{s.copy}</p><div className="service-chips">{s.chips.map(t=><span key={t}>{t}</span>)}</div>
         </article>)}</div>
         <div className="services-footer"><p>Something more specific in mind?</p><a href="#contact">Tell us about it <Icon type="arrow" size={20}/></a></div>
       </div>
     </section>
     <section className="work-section section-space" id="work">
       <div className="container">
         <div className="section-heading work-heading" data-reveal><SectionLabel>02 / SELECTED WORK</SectionLabel><div className="work-heading-row"><h2>Real projects.<br/><em>Real impact.</em></h2><p>Different industries, different challenges, one shared approach: get close to the brand, understand the brief and make something people remember.</p></div></div>
         <div className="projects-grid">{PROJECTS.map(p=><ProjectCard key={p.id} item={p}/>)}</div>
         <p className="work-footnote">Selected project work is shown for portfolio context. Campaign results are period-specific and are not a guarantee of future performance. Project imagery will be added following the relevant usage approvals.</p>
       </div>
     </section>
     <section className="manifesto-section" id="approach"><div className="container manifesto-inner"><div className="manifesto-copy" data-reveal><SectionLabel light>03 / THE ADVA MINDSET</SectionLabel><h2>Made to make<br/><em>you feel something.</em></h2><p>We like clear thinking, strong ideas, great people and work that has a reason to exist. The goal isn't just a beautiful deliverable. It's a better experience from start to finish.</p><a href="#contact" className="manifesto-link">Let's create something <Icon type="up" size={18}/></a></div><div className="manifesto-graphic" aria-hidden="true"><div className="manifesto-circle manifesto-circle-one"/><div className="manifesto-circle manifesto-circle-two"/><div className="manifesto-circle manifesto-circle-three"/><div className="manifesto-letter">A<span>.</span></div><span className="manifesto-corner">ALWAYS MOVING FORWARD ↗</span><span className="manifesto-spark">✳</span></div></div></section>
     <section className="method-section section-space"><div className="container"><div className="section-heading" data-reveal><SectionLabel>04 / HOW WE WORK</SectionLabel><h2>The details matter.<br/><em>The experience should be easy.</em></h2></div><div className="method-grid">{[["01","Tell us the idea","A rough sketch, a detailed brief or a simple conversation. We start by listening."],["02","We find the right angle","We shape the plan, creative direction and team around what actually matters."],["03","Let's make it happen","Production, coordination and communication without the unnecessary noise."],["04","Ready for the world","Polished, purposeful work that reaches the right places in the right formats."]].map((s,i)=><div className="method-step" key={s[0]} data-reveal style={{transitionDelay:i*60+"ms"}}><span>{s[0]}</span><div className="method-line"/><h3>{s[1]}</h3><p>{s[2]}</p></div>)}</div></div></section>
     <section className="about-section section-space" id="about"><div className="container about-layout"><div className="about-text" data-reveal><SectionLabel>05 / HELLO, WE'RE ADVA</SectionLabel><h2>We like making<br/><em>things happen.</em></h2><p>ADVA is an Abu Dhabi–based creative, media and events company working across storytelling, digital presence and on-ground experiences.</p><p>We collaborate with brands, businesses and individuals, from established names to people building something new. Every project is different. That's the fun part.</p><div className="about-pills"><span>ABU DHABI BASED</span><span>BUILT TO COLLABORATE</span><span>IDEA TO EXECUTION</span></div></div><div className="about-art" data-reveal aria-hidden="true"><div className="about-art-inner"><span className="about-art-label">GOOD THINGS ARE MADE TOGETHER</span><strong>Better<br/>together<span>.</span></strong><div className="about-art-daisy">✳</div><span className="about-art-small">ADVA / EST. ABU DHABI</span></div></div></div></section>
     <section className="contact-section" id="contact"><div className="container contact-inner"><div className="contact-blob contact-blob-one"/><div className="contact-blob contact-blob-two"/><div className="contact-copy" data-reveal><SectionLabel light>06 / LET'S GET STARTED</SectionLabel><h2>Got something<br/><em>good in mind?</em></h2><p>We'd love to hear about it. Tell us what you're planning and we'll take it from there.</p><div className="contact-actions"><a className="button contact-primary" href={"mailto:"+CONTACT_EMAIL+"?subject=Let's work together — ADVA"}>Start a conversation <Icon type="up" size={20}/></a><a className="button contact-secondary" href={"https://wa.me/"+WHATSAPP} target="_blank" rel="noopener noreferrer"><Icon type="whatsapp" size={19}/> WhatsApp us</a></div></div><div className="contact-footer"><span>ABU DHABI · UNITED ARAB EMIRATES</span><a href={"mailto:"+CONTACT_EMAIL}>{CONTACT_EMAIL}</a><a href={"tel:"+PHONE.replace(/\s/g,"")}>{PHONE}</a></div></div></section>
   </main>
   <footer className="site-footer"><div className="container footer-inner"><div className="footer-top"><Brand/><div className="footer-links"><a href="#services">Services</a><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a><a href="/privacy">Privacy</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ADVA. Creative thinking, real-world execution.</span><div><a href="https://www.instagram.com/adva.ae/" target="_blank" rel="noopener noreferrer">Instagram ↗</a><span>BASED IN ABU DHABI. MADE FOR MORE.</span></div></div></div></footer>
 </div>;
}
