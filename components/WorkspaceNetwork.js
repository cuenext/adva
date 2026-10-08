"use client";
import {useMemo,useState} from "react";

const specialties=[
 ["videography","Videographer"],["photography","Photographer"],["editing","Video editor"],
 ["social_media","Social media"],["design","Designer"],["marketing","Marketing"],["event_staff","Event staffing"],["other","Other"]
];
const placeholder={display_name:"",handle:"",specialty:"videography",location:"Abu Dhabi",availability:"Flexible / project based",experience_level:"Developing",age_band:"18-24",is_adult:false,bio:"",portfolio_links:""};
const jobBlank={title:"",specialty:"videography",description:"",location:"Abu Dhabi",salary_amount:"",salary_currency:"AED",salary_unit:"project",status:"draft",deadline:""};
const linkValid=s=>{try{const u=new URL(s);return ["https:","http:"].includes(u.protocol)}catch{return false}};
export function FreelancerOnboarding({ws}){
 const {db,user,refresh}=ws;
 const [values,setValues]=useState({...placeholder}),[step,setStep]=useState(0),[error,setError]=useState(""),[saving,setSaving]=useState(false);
 async function save(e){
  e.preventDefault();
  if(!values.is_adult){setError("You must be 18 or older to register for this ADVA network.");return}
  const links=values.portfolio_links.split(/\n/).map(s=>s.trim()).filter(Boolean);
  if(links.some(x=>!linkValid(x))){setError("Please enter full https:// portfolio links, one per line.");return}
  setSaving(true);setError("");
  const record={user_id:user.id,display_name:values.display_name.trim(),handle:values.handle.trim().toLowerCase()||null,specialty:values.specialty,location:values.location,availability:values.availability,experience_level:values.experience_level,age_band:values.age_band,is_adult:true,bio:values.bio,portfolio_links:links.slice(0,8)};
  const {error:err}=await db.from("adva_freelancers").insert(record);
  setSaving(false);
  if(err){setError(err.message);return}
  refresh();
  window.location.href="/network";
 }
 return <div className="aws-onboarding"><div className="aws-onboarding-background" aria-hidden="true"><span>A.</span><i/></div><div className="aws-onboarding-intro"><span className="aws-eyebrow"><i/> ADVA CREATIVE NETWORK / YOUR NEXT CHAPTER</span><h1>Good work starts<br/><em>with good people.</em></h1><p>Tell us what you create and how you like to work. Your verified portfolio becomes your home inside the ADVA network.</p></div>
  <div className="aws-onboarding-form"><div className="aws-progress-line"><span>0{step+1} / 03</span><div><i style={{width:((step+1)/3*100)+"%"}}/></div><span>{["YOUR CRAFT","YOUR WORK STYLE","YOUR PROFILE"][step]}</span></div>
   <form onSubmit={save}>
    {step===0&&<><h2>What's your craft?</h2><p>Select your main speciality; your portfolio can show everything else.</p><div className="aws-specialty-grid">{specialties.map(([id,label])=><button key={id} className={values.specialty===id?"active":""} type="button" onClick={()=>setValues({...values,specialty:id})}><span>{label}</span><b>{values.specialty===id?"✓":"↗"}</b></button>)}</div></>}
    {step===1&&<><h2>How do you work best?</h2><p>We use this to connect opportunities to people's real availability.</p><div className="aws-form-pair"><label>Based in<input value={values.location} maxLength={100} onChange={e=>setValues({...values,location:e.target.value})} placeholder="Abu Dhabi"/></label><label>Age range (18+ only)<select value={values.age_band} onChange={e=>setValues({...values,age_band:e.target.value})}>{["18-24","25-34","35-44","45+"].map(x=><option key={x}>{x}</option>)}</select></label></div><label>Availability<input maxLength={200} value={values.availability} onChange={e=>setValues({...values,availability:e.target.value})} placeholder="Weekends, weekdays, flexible, shoots only…"/></label><label>Experience<select value={values.experience_level} onChange={e=>setValues({...values,experience_level:e.target.value})}>{["Developing","1–2 years","3–5 years","5+ years"].map(x=><option key={x}>{x}</option>)}</select></label><label className="aws-check"><input type="checkbox" checked={values.is_adult} onChange={e=>setValues({...values,is_adult:e.target.checked})}/> I confirm I am at least 18 and the details are accurate.</label></>}
    {step===2&&<><h2>Introduce your work.</h2><p>A strong introduction beats a stack of buzzwords. Your portfolio is yours to update later.</p><div className="aws-form-pair"><label>Display name<input required minLength={2} maxLength={120} value={values.display_name} onChange={e=>setValues({...values,display_name:e.target.value})} placeholder="Your name"/></label><label>Handle (optional)<input pattern="[a-z0-9_]{3,24}" title="3–24 lowercase letters, numbers or underscores" value={values.handle} onChange={e=>setValues({...values,handle:e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,"")})} placeholder="creative_name"/></label></div><label>Short bio<textarea rows={3} maxLength={1800} value={values.bio} onChange={e=>setValues({...values,bio:e.target.value})} placeholder="What do you love creating? What does your best work look like?"/></label><label>Portfolio or video links (up to eight)<textarea rows={4} value={values.portfolio_links} onChange={e=>setValues({...values,portfolio_links:e.target.value})} placeholder="https://your-portfolio.com\nhttps://your-vimeo-video.com"/></label><p className="aws-small-note">Use portfolio links you own or have permission to share. Media uploads and project file delivery will be added later.</p></>}
    {error&&<p className="aws-error" role="alert">{error}</p>}
    <div className="aws-onboarding-buttons">{step>0&&<button type="button" className="aws-outline" onClick={()=>{setStep(step-1);setError("")}}>← Back</button>}{step<2?<button className="aws-primary" type="button" onClick={()=>{if(step===1&&!values.is_adult){setError("Confirm that you are at least 18 years old.");return}setError("");setStep(step+1)}}>Continue ↗</button>:<button className="aws-primary" type="submit" disabled={saving}>{saving?"Creating profile…":"Create ADVA profile"} ↗</button>}</div>
   </form>
  </div>
 </div>;
}

export default function WorkspaceNetwork({ws}){
 const {db,role,data,user,refresh}=ws;
 const ceo=role==="ceo",profile=data.profile;
 const [newJob,setNewJob]=useState({...jobBlank}),[formOpen,setFormOpen]=useState(false),[message,setMessage]=useState("");
 const [applyTo,setApplyTo]=useState(null),[applicationMessage,setApplicationMessage]=useState("");
 const [agreeName,setAgreeName]=useState(profile?.display_name||""),[busy,setBusy]=useState(false),[notice,setNotice]=useState("");
 const [editingProfile,setEditingProfile]=useState(false),[bio,setBio]=useState(profile?.bio||""),[portfolio,setPortfolio]=useState((profile?.portfolio_links||[]).join("\n"));
 const currentNda=data.ndas.find(n=>n.active&&n.legal_reviewed);
 const hasNda=!!currentNda&&data.ndaAcceptances.some(a=>a.user_id===user?.id&&a.nda_id===currentNda.id);
 const jobs=data.jobs||[];
 const assigned=data.members.filter(m=>m.user_id===user?.id);
 async function run(op,success){
  setBusy(true);setNotice("");
  try{const res=await op();if(res.error)throw res.error;setNotice(success);refresh();return true}catch(e){setNotice(e.message||"Couldn't complete action.");return false}finally{setBusy(false)}
 }
 async function createJob(e){
  e.preventDefault();if(!ceo)return;
  if(newJob.title.trim().length<3||newJob.description.trim().length<10||!(Number(newJob.salary_amount)>=0)){setNotice("Complete the job title, description and salary.");return}
  const payload={...newJob,salary_amount:Number(newJob.salary_amount),title:newJob.title.trim(),description:newJob.description.trim(),deadline:newJob.deadline||null};
  const ok=await run(()=>db.from("adva_jobs").insert(payload),"Job recorded. It becomes available to verified freelancers only after the NDA is approved and signed.");
  if(ok){setFormOpen(false);setNewJob({...jobBlank})}
 }
 async function acceptNda(e){
  e.preventDefault();if(!currentNda||!agreeName.trim()||!profile)return;
  await run(()=>db.from("adva_nda_acceptances").insert({nda_id:currentNda.id,user_id:user.id,signed_name:agreeName.trim()}),"NDA acceptance recorded.");
 }
 async function apply(e){
  e.preventDefault();if(!applyTo||!hasNda)return;
  const ok=await run(()=>db.from("adva_job_requests").insert({job_id:applyTo.id,applicant_user_id:user.id,message:applicationMessage.trim()}),"Application sent to ADVA.");
  if(ok){setApplyTo(null);setApplicationMessage("")}
 }
 async function saveProfile(e){
  e.preventDefault();if(!profile)return;
  const links=portfolio.split(/\n/).map(x=>x.trim()).filter(Boolean);
  if(links.length>8||links.some(x=>!linkValid(x))){setNotice("Use up to eight full http/https portfolio links.");return}
  const ok=await run(()=>db.from("adva_freelancers").update({bio:bio.slice(0,1800),portfolio_links:links}).eq("user_id",user.id),"Profile updated.");
  if(ok)setEditingProfile(false)
 }
 const myApplications=data.jobRequests.filter(r=>r.applicant_user_id===user?.id);
 return <div className="aws-module aws-network">
  <div className="aws-page-heading"><div><span className="aws-eyebrow"><i/> ADVA / CREATIVE NETWORK</span><h1>{ceo?"Your creative circle.":"Build. Connect. Create."}</h1><p>{ceo?"Post paid opportunities, review talent and build the right production team.":"Your ADVA profile, assigned work and paid opportunities — all in one network."}</p></div>{ceo&&<button className="aws-primary aws-compact" onClick={()=>setFormOpen(true)}>+ Post an opportunity</button>}</div>
  {notice&&<div className="aws-feedback" role="status">{notice}<button onClick={()=>setNotice("")}>×</button></div>}
  {!ceo&&profile&&<section className="aws-network-profile"><div className="aws-network-profile-avatar">{profile.display_name.charAt(0).toUpperCase()}</div><div><span>VERIFIED CREATIVE PROFILE</span><h2>{profile.display_name}</h2><p>{profile.specialty.replaceAll("_"," ")} · {profile.location} · {profile.availability}</p><small>{profile.bio||"Add a short bio to introduce your work."}</small></div><button onClick={()=>{setEditingProfile(true);setBio(profile.bio||"");setPortfolio((profile.portfolio_links||[]).join("\n"))}}>Edit profile ↗</button></section>}
  <div className="aws-network-layout">
   <div className="aws-network-feed">
    <div className="aws-panel-title aws-network-title"><div><span>THE NETWORK / OPPORTUNITIES</span><h2>Open briefs.</h2></div><span>{jobs.filter(j=>j.status==="open").length} AVAILABLE</span></div>
    {!ceo&&!currentNda&&<div className="aws-network-lock"><div className="aws-lock-orb">✳</div><span>FREELANCER NETWORK / NDA REQUIRED</span><h3>We protect the work before we open the doors.</h3><p>ADVA's freelancer NDA is being prepared for legal review. Once a reviewed agreement is published, you'll be able to read, accept it and access paid opportunities here.</p><strong>NO AGREEMENT HAS BEEN SIGNED YET</strong></div>}
    {!ceo&&currentNda&&!hasNda&&<form className="aws-nda-card" onSubmit={acceptNda}><span>CONFIDENTIALITY / REVIEW BEFORE ACCESS</span><h3>Read the ADVA freelancer NDA.</h3><p>You must review the full legal agreement before you can access private job listings or apply for projects.</p><a href={currentNda.document_url} target="_blank" rel="noopener noreferrer">Read the agreement: {currentNda.title} ↗</a><label>Type your full legal name to confirm acceptance<input required minLength={2} maxLength={140} value={agreeName} onChange={e=>setAgreeName(e.target.value)}/></label><button className="aws-primary" type="submit" disabled={busy}>I have read and accept the NDA ↗</button><small>Acceptance is recorded with your verified user identity and timestamp. Further legal e-signature requirements may apply.</small></form>}
    {(ceo||hasNda)&&<div className="aws-job-feed">{jobs.filter(j=>ceo||j.status==="open").map(j=><article className="aws-job-post" key={j.id}><div className="aws-job-avatar">A.</div><div className="aws-job-main"><div className="aws-job-byline"><strong>ADVA Team</strong><span>· Paid opportunity</span><span className={"aws-pill aws-pill-"+j.status}>{j.status}</span></div><h3>{j.title}</h3><p>{j.description}</p><div className="aws-job-tags"><span>{j.specialty.replaceAll("_"," ")}</span><span>{j.location}</span><span className="aws-job-pay">{j.salary_currency} {Number(j.salary_amount).toLocaleString()} / {j.salary_unit}</span></div>{!ceo&&j.status==="open"&&<button onClick={()=>{setApplyTo(j);setApplicationMessage("")}} disabled={myApplications.some(a=>a.job_id===j.id)}>{myApplications.some(a=>a.job_id===j.id)?"Application received ✓":"Request to join ↗"}</button>}</div></article>)}{jobs.length===0&&<div className="aws-empty"><strong>{ceo?"No jobs posted yet.":"No open opportunities at the moment."}</strong><p>{ceo?"Create a paid brief when you need a photographer, editor, videographer or event team.":"Your profile is here whenever the next brief opens."}</p></div>}</div>}
   </div>
   <aside className="aws-network-side">
    <div className="aws-panel"><div className="aws-panel-title"><div><span>NETWORK / PROFILE</span><h2>{ceo?"Talent directory":"Your account"}</h2></div></div>{ceo?<div className="aws-talent-list">{data.freelancers.map(f=><div key={f.user_id}><span className="aws-avatar">{f.display_name.charAt(0)}</span><div><strong>{f.display_name}</strong><small>{f.specialty.replaceAll("_"," ")} / {f.availability}</small></div></div>)}{!data.freelancers.length&&<p>No verified freelancers have joined yet.</p>}</div>:<div className="aws-talent-list"><p>{assigned.length?assigned.length+" assigned project(s)":"No projects assigned yet"}.</p>{myApplications.map(a=><div key={a.id}><strong>{jobs.find(j=>j.id===a.job_id)?.title||"Opportunity"}</strong><small>{a.status}</small></div>)}</div>}</div>
    <div className="aws-network-note"><span>ADVA / CREATIVE COMMUNITY</span><p>Quality work needs a trusted circle. Your portfolio, availability and skills help us build the right team.</p></div>
   </aside>
  </div>
  {formOpen&&<div className="aws-modal"><button className="aws-backdrop" onClick={()=>setFormOpen(false)} aria-label="Close job"/><form onSubmit={createJob} className="aws-modal-card"><header><div><span>CEO / NETWORK</span><h2>Post an opportunity</h2></div><button type="button" onClick={()=>setFormOpen(false)}>×</button></header><label>Job title<input minLength={3} required value={newJob.title} onChange={e=>setNewJob({...newJob,title:e.target.value})} placeholder="Photographer for exhibition coverage"/></label><label>What's needed<textarea rows={5} required minLength={10} maxLength={5000} value={newJob.description} onChange={e=>setNewJob({...newJob,description:e.target.value})}/></label><div className="aws-form-pair"><label>Speciality<select value={newJob.specialty} onChange={e=>setNewJob({...newJob,specialty:e.target.value})}>{specialties.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label><label>Location<input value={newJob.location} maxLength={100} onChange={e=>setNewJob({...newJob,location:e.target.value})}/></label></div><div className="aws-form-pair"><label>Compensation (AED)<input type="number" min="0" step="0.01" required value={newJob.salary_amount} onChange={e=>setNewJob({...newJob,salary_amount:e.target.value})}/></label><label>Payment basis<select value={newJob.salary_unit} onChange={e=>setNewJob({...newJob,salary_unit:e.target.value})}>{["project","day","hour","month"].map(x=><option key={x} value={x}>{x}</option>)}</select></label></div><div className="aws-form-pair"><label>Job status<select value={newJob.status} onChange={e=>setNewJob({...newJob,status:e.target.value})}><option value="draft">Private draft</option><option value="open">Open after NDA access</option><option value="closed">Closed</option></select></label><label>Apply by<input type="date" value={newJob.deadline} onChange={e=>setNewJob({...newJob,deadline:e.target.value})}/></label></div><p className="aws-small-note">No opportunities become visible to applicants until a legally reviewed NDA is active and accepted.</p><button type="submit" disabled={busy} className="aws-primary">Save opportunity ↗</button></form></div>}
  {applyTo&&<div className="aws-modal"><button className="aws-backdrop" onClick={()=>setApplyTo(null)} aria-label="Close application"/><form className="aws-modal-card" onSubmit={apply}><header><div><span>ADVA / REQUEST TO JOIN</span><h2>{applyTo.title}</h2></div><button type="button" onClick={()=>setApplyTo(null)}>×</button></header><p>Compensation: {applyTo.salary_currency} {Number(applyTo.salary_amount).toLocaleString()} per {applyTo.salary_unit}</p><label>Why are you a good fit?<textarea rows={5} maxLength={1400} value={applicationMessage} onChange={e=>setApplicationMessage(e.target.value)} placeholder="Tell ADVA about your relevant experience or link to recent work…"/></label><button type="submit" className="aws-primary" disabled={busy}>Request to enroll ↗</button></form></div>}
  {editingProfile&&<div className="aws-modal"><button className="aws-backdrop" onClick={()=>setEditingProfile(false)} aria-label="Close profile"/><form onSubmit={saveProfile} className="aws-modal-card"><header><div><span>ADVA / PORTFOLIO</span><h2>Edit your profile</h2></div><button type="button" onClick={()=>setEditingProfile(false)}>×</button></header><label>Bio<textarea rows={4} maxLength={1800} value={bio} onChange={e=>setBio(e.target.value)}/></label><label>Portfolio and video links<textarea rows={6} value={portfolio} onChange={e=>setPortfolio(e.target.value)} placeholder="One https:// link per line"/></label><button className="aws-primary" disabled={busy}>Save profile ↗</button></form></div>}
 </div>;
}