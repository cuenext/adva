"use client";
import {useEffect,useMemo,useState} from "react";
import {SERVICES,SERVICE_GROUPS,servicesInGroup} from "../lib/services";
import AdvaIcon from "./AdvaIcon";
const TIMEFRAMES=["As soon as possible","This month","Within 1–3 months","Still exploring"];
const LOCATIONS=["Abu Dhabi","Dubai","Other UAE emirate","International / remote"];
function Up(){return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 16 16 4M6 4h10v10"/></svg>}
export default function BriefForm({initialService,initialServices=[]}){
 const [selected,setSelected]=useState(()=>[...new Set([...initialServices,initialService].filter(slug=>SERVICES.some(s=>s.slug===slug)))]);
 const [step,setStep]=useState(0);
 const [overview,setOverview]=useState("");
 const [handoffLoaded,setHandoffLoaded]=useState(false);
 const [timeline,setTimeline]=useState("Still exploring");
 const [location,setLocation]=useState("Abu Dhabi");
 const [budget,setBudget]=useState("");
 const [referenceUrl,setReferenceUrl]=useState("");
 const [name,setName]=useState("");
 const [email,setEmail]=useState("");
 const [company,setCompany]=useState("");
 const [copied,setCopied]=useState(false);
 const [error,setError]=useState("");
 const [captureReady,setCaptureReady]=useState(false);
 const [consent,setConsent]=useState(false);
 const [sending,setSending]=useState(false);
 const [submittedReference,setSubmittedReference]=useState("");
 useEffect(()=>{
  try{
   const stored=window.sessionStorage.getItem("adva_brief_seed_v1");
   if(!stored)return;
   const data=JSON.parse(stored);
   if(!data||typeof data.idea!=="string"||Date.now()-data.at>20*60*1000){window.sessionStorage.removeItem("adva_brief_seed_v1");return}
   setOverview(data.idea.slice(0,1800));
   if(Array.isArray(data.services))setSelected(cur=>[...new Set([...cur,...data.services.filter(slug=>SERVICES.some(s=>s.slug===slug))])]);
   setHandoffLoaded(true);
   window.sessionStorage.removeItem("adva_brief_seed_v1");
  }catch{}
 },[]);
 useEffect(()=>{let active=true;fetch("/api/leads",{cache:"no-store"}).then(r=>r.json()).then(d=>{if(active)setCaptureReady(Boolean(d.available))}).catch(()=>{});return()=>{active=false}},[]);
 function toggle(slug){setSelected(s=>s.includes(slug)?s.filter(x=>x!==slug):[...s,slug]);setError("")}
 function validReference(url){if(!url.trim())return true;try{const u=new URL(url.trim());return u.protocol==="https:"&&!u.username&&!u.password&&u.hostname!=="localhost"&&u.hostname!=="127.0.0.1"&&url.length<=600}catch{return false}}
 function next(){
  if(step===1&&!overview.trim()){setError("Tell us a little about the idea to continue.");return}
  if(step===1&&!validReference(referenceUrl)){setError("Use a full, secure https:// reference link, or leave this field blank.");return}
  if(step===2&&(!name.trim()||!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))){setError("Add your name and a valid email to prepare the brief.");return}
  setError("");setStep(s=>Math.min(3,s+1));window.scrollTo({top:0,behavior:"smooth"});
 }
 function back(){setError("");setStep(s=>Math.max(0,s-1));window.scrollTo({top:0,behavior:"smooth"})}
 const names=selected.length?selected.map(slug=>SERVICES.find(s=>s.slug===slug)?.name).filter(Boolean):["I'd like guidance on what I need"];
 const summary=useMemo(()=>"Hello ADVA,\n\nHere's my project brief:\n\nSERVICES\n"+names.map(n=>"• "+n).join("\n")+"\n\nTHE IDEA\n"+(overview.trim()||"I'd like help shaping the brief")+"\n\nTIMELINE\n"+timeline+"\n\nLOCATION\n"+location+"\n\nBUDGET (IF KNOWN)\n"+(budget||"To be discussed")+"\n\nREFERENCE LINK (OPTIONAL)\n"+(referenceUrl.trim()||"Not provided")+"\n\nCONTACT\n"+name+(company?" | "+company:"")+"\n"+email+"\n\nThank you.",[names.join(","),overview,timeline,location,budget,referenceUrl,name,company,email]);
 const mailHref="mailto:inquiries@advaae.com?subject="+encodeURIComponent("New ADVA project inquiry")+"&body="+encodeURIComponent(summary);
 const waHref="https://wa.me/971585876114?text="+encodeURIComponent(summary);
 async function copy(){try{await navigator.clipboard.writeText(summary);setCopied(true)}catch{setCopied(false)}}
 async function submitDirect(){
  if(sending||submittedReference)return;
  if(!consent){setError("Please agree to be contacted about your enquiry.");return;}
  setSending(true);setError("");
  try{
   const response=await fetch("/api/leads",{
     method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},
     body:JSON.stringify({name,email,company,description:overview,services:selected,timeline,location,budget,reference_url:referenceUrl.trim(),consent:true,website:""})
   });
   const result=await response.json();
   if(!response.ok||!result.ok)throw new Error(result.error||"Couldn't submit the brief");
   setSubmittedReference(result.reference||"received");
  }catch(e){setError(e.message||"Secure submission unavailable; you can use email or WhatsApp instead.");}
  finally{setSending(false)}
 }
 return <div className="adva-brief-interface">
  <div className="adva-brief-progress" aria-label={"Step "+(step+1)+" of 4"}>{["Services","Your idea","About you","Review"].map((x,i)=><div className={"adva-brief-progress-segment"+(i<=step?" current":"")} key={x}><span>{String(i+1).padStart(2,"0")} / {x}</span><i/></div>)}</div>
  {step===0&&<section className="adva-brief-step" aria-labelledby="brief-step-one">
   <span className="adva-small-eyebrow"><i/> STEP 01 / WHAT YOU NEED</span><h2 id="brief-step-one">What do you need?</h2><p>Choose one or several. Not sure yet? Continue without selecting anything.</p>{handoffLoaded&&<p className="adva-brief-handoff-note" role="status">Your idea is saved for the next step.</p>}
   <div className="adva-brief-service-groups">{SERVICE_GROUPS.map(group=><div key={group.id}><h3>{group.label}</h3><div className="adva-brief-services">{servicesInGroup(group.id).map(s=><button type="button" key={s.slug} aria-pressed={selected.includes(s.slug)} className={"adva-brief-service"+(selected.includes(s.slug)?" is-selected":"")} onClick={()=>toggle(s.slug)}><span><strong>{s.name}</strong><small>{s.short}</small></span><b aria-hidden="true">{selected.includes(s.slug)?<AdvaIcon name="check" size={16}/>:<AdvaIcon name="plus" size={16}/>}</b></button>)}</div></div>)}</div>
  </section>}
  {step===1&&<section className="adva-brief-step" aria-labelledby="brief-step-two">
   <span className="adva-small-eyebrow"><i/> STEP 02 / THE IDEA</span><h2 id="brief-step-two">Tell us about it.</h2><p>What are you making, and when do you need it?</p>
   <label className="adva-field-label" htmlFor="brief-overview">What do you have in mind? <span>Required</span></label>
   <textarea id="brief-overview" rows="6" maxLength={1800} placeholder="We're launching a new brand, and need a website and content that feel different from the usual..." value={overview} onChange={e=>setOverview(e.target.value)}/>
   <div className="adva-field-row"><div><label className="adva-field-label" htmlFor="brief-timeline">Timeline</label><select id="brief-timeline" value={timeline} onChange={e=>setTimeline(e.target.value)}>{TIMEFRAMES.map(x=><option key={x}>{x}</option>)}</select></div><div><label className="adva-field-label" htmlFor="brief-location">Where's the project?</label><select id="brief-location" value={location} onChange={e=>setLocation(e.target.value)}>{LOCATIONS.map(x=><option key={x}>{x}</option>)}</select></div></div>
   <label className="adva-field-label" htmlFor="brief-budget">Approximate budget <span>Optional</span></label><input id="brief-budget" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="An estimate or 'not sure yet' is fine" maxLength={120}/>
   <label className="adva-field-label" htmlFor="brief-reference">Reference or moodboard link <span>Optional</span></label>
   <input id="brief-reference" type="url" inputMode="url" value={referenceUrl} onChange={e=>setReferenceUrl(e.target.value)} placeholder="https://drive.google.com/..." maxLength={600}/>
   <p className="adva-form-help">Share a viewable Drive, Dropbox, Figma or portfolio link. Please don't include confidential patient information, passwords or private financial documents.</p>
  </section>}
  {step===2&&<section className="adva-brief-step" aria-labelledby="brief-step-three">
   <span className="adva-small-eyebrow"><i/> STEP 03 / YOUR DETAILS</span><h2 id="brief-step-three">Who are we speaking to?</h2><p>Just the essentials so we know who the brief is coming from.</p>
   <div className="adva-field-row"><div><label className="adva-field-label" htmlFor="brief-name">Your name <span>Required</span></label><input id="brief-name" autoComplete="name" maxLength={100} value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" required/></div><div><label className="adva-field-label" htmlFor="brief-email">Work email <span>Required</span></label><input id="brief-email" autoComplete="email" type="email" maxLength={160} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" required/></div></div>
   <label className="adva-field-label" htmlFor="brief-company">Company or brand <span>Optional</span></label><input id="brief-company" autoComplete="organization" maxLength={120} value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company / brand name"/>
   <p className="adva-form-help">Your brief is not sent until you confirm the last step.</p>
  </section>}
  {step===3&&<section className="adva-brief-step" aria-labelledby="brief-step-four">
   <span className="adva-small-eyebrow"><i/> STEP 04 / READY TO SHARE</span><h2 id="brief-step-four">Ready to send.</h2><p>Here's your brief. Choose how you'd like to send it to ADVA.</p>
   <div className="adva-brief-review">
    <div><span>SERVICES</span><strong>{names.join(" · ")}</strong></div><div><span>PROJECT</span><p>{overview||"Need help shaping the project"}</p></div><div><span>WHEN & WHERE</span><strong>{timeline} · {location}</strong></div>{referenceUrl.trim()&&<div><span>REFERENCE</span><p>{referenceUrl.trim()}</p></div>}<div><span>CONTACT</span><strong>{name} · {email}</strong>{company&&<small>{company}</small>}</div>
   </div>
   {captureReady&&<label className="adva-brief-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>I agree that ADVA may use this information to contact me about my project. <a href="/privacy">Privacy policy →</a></span></label>}
   {submittedReference?<div className="adva-brief-success" role="status"><strong>Thank you. Your brief is with ADVA.</strong><p>Reference: {submittedReference}. We'll review your enquiry and respond using the contact details you provided.</p><div className="adva-brief-received-links"><a href="/work">Explore selected work ↗</a><a href="/">Return to the homepage ↗</a></div></div>:<div className="adva-brief-send-options">{captureReady&&<button type="button" className="adva-brief-send-primary" onClick={submitDirect} disabled={sending}>{sending?"Sending securely…":"Send to ADVA securely"} <Up/></button>}<a href={mailHref} className={captureReady?"adva-brief-send-secondary":"adva-brief-send-primary"}>Open email to send <Up/></a><a href={waHref} target="_blank" rel="noopener noreferrer" className="adva-brief-send-secondary">Send via WhatsApp <Up/></a><button type="button" onClick={copy}>{copied?"Copied":"Copy brief"}</button></div>}
   <p className="adva-form-help">{submittedReference?"Submission confirmed. Please do not send the same enquiry again unless you want to add new information.":captureReady?"Secure submission stores your brief for the ADVA team. Email and WhatsApp remain available as alternatives.":"This brief is not yet submitted. Email or WhatsApp opens your app, where you must press Send yourself."}</p>
  </section>}
  {error&&<p role="alert" className="adva-brief-error">{error}</p>}
  <div className="adva-brief-controls"><span>{String(step+1).padStart(2,"0")} / 04</span><div>{step>0&&<button type="button" className="adva-brief-prev" onClick={back}>← Previous</button>}{step<3&&<button type="button" className="adva-brief-next" onClick={next}>Continue <Up/></button>}</div></div>
 </div>;
}