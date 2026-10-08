"use client";
import {useMemo,useState} from "react";
import {SERVICES,SERVICE_GROUPS,servicesInGroup} from "../lib/services";
const TIMEFRAMES=["As soon as possible","This month","Within 1–3 months","Still exploring"];
const LOCATIONS=["Abu Dhabi","Dubai","Other UAE emirate","International / remote"];
function Up(){return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 16 16 4M6 4h10v10"/></svg>}
export default function BriefForm({initialService,initialServices=[]}){
 const [selected,setSelected]=useState(()=>[...new Set([...initialServices,initialService].filter(slug=>SERVICES.some(s=>s.slug===slug)))]);
 const [step,setStep]=useState(0);
 const [overview,setOverview]=useState("");
 const [timeline,setTimeline]=useState("Still exploring");
 const [location,setLocation]=useState("Abu Dhabi");
 const [budget,setBudget]=useState("");
 const [name,setName]=useState("");
 const [email,setEmail]=useState("");
 const [company,setCompany]=useState("");
 const [copied,setCopied]=useState(false);
 const [error,setError]=useState("");
 function toggle(slug){setSelected(s=>s.includes(slug)?s.filter(x=>x!==slug):[...s,slug]);setError("")}
 function next(){
  if(step===1&&!overview.trim()){setError("Tell us a little about the idea to continue.");return}
  if(step===2&&(!name.trim()||!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))){setError("Add your name and a valid email to prepare the brief.");return}
  setError("");setStep(s=>Math.min(3,s+1));window.scrollTo({top:0,behavior:"smooth"});
 }
 function back(){setError("");setStep(s=>Math.max(0,s-1));window.scrollTo({top:0,behavior:"smooth"})}
 const names=selected.length?selected.map(slug=>SERVICES.find(s=>s.slug===slug)?.name).filter(Boolean):["I'd like guidance on what I need"];
 const summary=useMemo(()=>"Hello ADVA,\n\nHere's my project brief:\n\nSERVICES\n"+names.map(n=>"• "+n).join("\n")+"\n\nTHE IDEA\n"+(overview.trim()||"I'd like help shaping the brief")+"\n\nTIMELINE\n"+timeline+"\n\nLOCATION\n"+location+"\n\nBUDGET (IF KNOWN)\n"+(budget||"To be discussed")+"\n\nCONTACT\n"+name+(company?" | "+company:"")+"\n"+email+"\n\nThank you.",[names.join(","),overview,timeline,location,budget,name,company,email]);
 const mailHref="mailto:inquiries@advaae.com?subject="+encodeURIComponent("New ADVA project inquiry")+"&body="+encodeURIComponent(summary);
 const waHref="https://wa.me/971585876114?text="+encodeURIComponent(summary);
 async function copy(){try{await navigator.clipboard.writeText(summary);setCopied(true)}catch{setCopied(false)}}
 return <div className="adva-brief-interface">
  <div className="adva-brief-progress" aria-label={"Step "+(step+1)+" of 4"}>{["Services","Your idea","About you","Review"].map((x,i)=><div className={"adva-brief-progress-segment"+(i<=step?" current":"")} key={x}><span>{String(i+1).padStart(2,"0")} / {x}</span><i/></div>)}</div>
  {step===0&&<section className="adva-brief-step" aria-labelledby="brief-step-one">
   <span className="adva-small-eyebrow"><i/> STEP 01 / WHAT YOU NEED</span><h2 id="brief-step-one">What are we creating?</h2><p>Select as many services as you need. Or leave everything unselected if you're still figuring it out.</p>
   <div className="adva-brief-service-groups">{SERVICE_GROUPS.map(group=><div key={group.id}><h3>{group.label}</h3><div className="adva-brief-services">{servicesInGroup(group.id).map(s=><button type="button" key={s.slug} aria-pressed={selected.includes(s.slug)} className={"adva-brief-service"+(selected.includes(s.slug)?" is-selected":"")} onClick={()=>toggle(s.slug)}><span><strong>{s.name}</strong><small>{s.short}</small></span><b aria-hidden="true">{selected.includes(s.slug)?"✓":"+"}</b></button>)}</div></div>)}</div>
  </section>}
  {step===1&&<section className="adva-brief-step" aria-labelledby="brief-step-two">
   <span className="adva-small-eyebrow"><i/> STEP 02 / THE IDEA</span><h2 id="brief-step-two">Tell us a little more.</h2><p>No polished pitch needed. Tell us what you're trying to do, and what's important to you.</p>
   <label className="adva-field-label" htmlFor="brief-overview">What do you have in mind? <span>Required</span></label>
   <textarea id="brief-overview" rows="6" maxLength={1800} placeholder="We're launching a new brand, and need a website and content that feel different from the usual..." value={overview} onChange={e=>setOverview(e.target.value)}/>
   <div className="adva-field-row"><div><label className="adva-field-label" htmlFor="brief-timeline">Timeline</label><select id="brief-timeline" value={timeline} onChange={e=>setTimeline(e.target.value)}>{TIMEFRAMES.map(x=><option key={x}>{x}</option>)}</select></div><div><label className="adva-field-label" htmlFor="brief-location">Where's the project?</label><select id="brief-location" value={location} onChange={e=>setLocation(e.target.value)}>{LOCATIONS.map(x=><option key={x}>{x}</option>)}</select></div></div>
   <label className="adva-field-label" htmlFor="brief-budget">Approximate budget <span>Optional</span></label><input id="brief-budget" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="An estimate or 'not sure yet' is fine" maxLength={120}/>
  </section>}
  {step===2&&<section className="adva-brief-step" aria-labelledby="brief-step-three">
   <span className="adva-small-eyebrow"><i/> STEP 03 / YOUR DETAILS</span><h2 id="brief-step-three">Who are we speaking to?</h2><p>Just the essentials so we know who the brief is coming from.</p>
   <div className="adva-field-row"><div><label className="adva-field-label" htmlFor="brief-name">Your name <span>Required</span></label><input id="brief-name" autoComplete="name" maxLength={100} value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" required/></div><div><label className="adva-field-label" htmlFor="brief-email">Work email <span>Required</span></label><input id="brief-email" autoComplete="email" type="email" maxLength={160} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" required/></div></div>
   <label className="adva-field-label" htmlFor="brief-company">Company or brand <span>Optional</span></label><input id="brief-company" autoComplete="organization" maxLength={120} value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company / brand name"/>
   <p className="adva-form-help">This form prepares an email or WhatsApp message on your device. Nothing is sent automatically or saved on our server.</p>
  </section>}
  {step===3&&<section className="adva-brief-step" aria-labelledby="brief-step-four">
   <span className="adva-small-eyebrow"><i/> STEP 04 / READY TO SHARE</span><h2 id="brief-step-four">Looks like a plan.</h2><p>Here's your brief. Choose how you'd like to send it to ADVA.</p>
   <div className="adva-brief-review">
    <div><span>SERVICES</span><strong>{names.join(" · ")}</strong></div><div><span>PROJECT</span><p>{overview||"Need help shaping the project"}</p></div><div><span>WHEN & WHERE</span><strong>{timeline} · {location}</strong></div><div><span>CONTACT</span><strong>{name} · {email}</strong>{company&&<small>{company}</small>}</div>
   </div>
   <div className="adva-brief-send-options"><a href={mailHref} className="adva-brief-send-primary">Open email to send <Up/></a><a href={waHref} target="_blank" rel="noopener noreferrer" className="adva-brief-send-secondary">Send via WhatsApp <Up/></a><button type="button" onClick={copy}>{copied?"Copied ✓":"Copy brief"}</button></div>
   <p className="adva-form-help">Important: this brief has not been submitted yet. Use an email or WhatsApp option above and complete the send in that app.</p>
  </section>}
  {error&&<p role="alert" className="adva-brief-error">{error}</p>}
  <div className="adva-brief-controls"><span>{String(step+1).padStart(2,"0")} / 04</span><div>{step>0&&<button type="button" className="adva-brief-prev" onClick={back}>← Previous</button>}{step<3&&<button type="button" className="adva-brief-next" onClick={next}>Continue <Up/></button>}</div></div>
 </div>;
}