"use client";
import {useCallback,useEffect,useMemo,useState} from "react";

const STATUSES=["new","reviewing","quoted","won","lost","archived"];
const fmt=(date)=>{try{return new Intl.DateTimeFormat("en-AE",{month:"short",day:"numeric",year:"numeric"}).format(new Date(date));}catch{return "";}};
export default function AdminHQ(){
 const [session,setSession]=useState({loading:true,available:false,authenticated:false});
 const [email,setEmail]=useState(""),[password,setPassword]=useState("");
 const [loginBusy,setLoginBusy]=useState(false),[loginError,setLoginError]=useState("");
 const [leads,setLeads]=useState([]),[loadingLeads,setLoadingLeads]=useState(false),[leadError,setLeadError]=useState("");
 const [active,setActive]=useState(null),[filter,setFilter]=useState("all"),[saving,setSaving]=useState("");
 const refresh=useCallback(async()=>{
  setLoadingLeads(true);setLeadError("");
  try{
    const response=await fetch("/api/hq/leads?limit=50",{credentials:"same-origin",cache:"no-store"});
    const data=await response.json();
    if(!response.ok)throw new Error(data.error||"Unable to load enquiries");
    setLeads(data.leads||[]);
  }catch(e){setLeadError(e.message||"Couldn't load enquiries");}
  finally{setLoadingLeads(false)}
 },[]);
 useEffect(()=>{
  let mounted=true;
  fetch("/api/hq/session",{cache:"no-store",credentials:"same-origin"})
   .then(r=>r.json()).then(data=>{if(mounted)setSession({loading:false,...data});})
   .catch(()=>{if(mounted)setSession({loading:false,available:false,authenticated:false});});
  return()=>{mounted=false};
 },[]);
 useEffect(()=>{if(session.authenticated)refresh()},[session.authenticated,refresh]);
 async function login(e){
  e.preventDefault();setLoginBusy(true);setLoginError("");
  try{
   const response=await fetch("/api/hq/session",{
    method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email,password})
   });
   const data=await response.json();if(!response.ok)throw new Error(data.error||"Sign in failed");
   setPassword("");setSession({loading:false,available:true,authenticated:true,...data});
  }catch(e){setLoginError(e.message||"Sign-in unavailable");}
  finally{setLoginBusy(false)}
 }
 async function logout(){
  await fetch("/api/hq/session",{method:"DELETE",credentials:"same-origin"});
  setSession({loading:false,available:true,authenticated:false});setLeads([]);setActive(null);
 }
 async function setStatus(lead,status){
  if(!["ceo","admin"].includes(session.role))return;
  setSaving(lead.id);setLeadError("");
  try{
   const res=await fetch("/api/hq/leads",{method:"PATCH",credentials:"same-origin",
    headers:{"Content-Type":"application/json"},body:JSON.stringify({id:lead.id,status})});
   const data=await res.json();
   if(!res.ok)throw new Error(data.error||"Could not update");
   setLeads(old=>old.map(x=>x.id===lead.id?{...x,status}:x));
   setActive(old=>old?.id===lead.id?{...old,status}:old);
  }catch(e){setLeadError(e.message||"Couldn't update status");}
  finally{setSaving("")}
 }
 const filtered=useMemo(()=>filter==="all"?leads:leads.filter(x=>x.status===filter),[filter,leads]);
 const counts=useMemo(()=>({total:leads.length,new:leads.filter(l=>l.status==="new").length,quoted:leads.filter(l=>l.status==="quoted").length,won:leads.filter(l=>l.status==="won").length}),[leads]);
 return <main className="hq-shell">
  <header className="hq-header"><a href="/" className="hq-logo"><img src="/adva-logo.webp" alt="ADVA"/><span>HQ</span></a><span className="hq-header-note">PRIVATE / INTERNAL OPERATIONS</span>{session.authenticated&&<button className="hq-logout" type="button" onClick={logout}>Sign out ↗</button>}</header>
  {session.loading?<div className="hq-center"><div className="hq-loader"/>Securing your workspace…</div>:
   !session.available?<section className="hq-login-stage"><span>ADVA / WORKSPACE</span><h1>Built for<br/><em>what's next.</em></h1><p>ADVA HQ has been prepared, but secure database authentication is not connected yet. No financial or client information is exposed.</p><div className="hq-lock-note">Private access will open after the Supabase connection and CEO account are configured.</div><a href="/">← Back to ADVA</a></section>:
   !session.authenticated?<section className="hq-login-stage"><span>ADVA / RESTRICTED AREA</span><h1>Welcome<br/><em>back.</em></h1><p>Sign in with your ADVA HQ account to access enquiries and internal operations.</p><form className="hq-login-form" onSubmit={login}><label htmlFor="hq-email">EMAIL</label><input id="hq-email" type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@advaae.com"/><label htmlFor="hq-password">PASSWORD</label><input id="hq-password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/>{loginError&&<p className="hq-error" role="alert">{loginError}</p>}<button type="submit" disabled={loginBusy}>{loginBusy?"Signing in…":"Access ADVA HQ ↗"}</button></form><div className="hq-lock-note">Accounts are provisioned privately. Public sign-up is disabled.</div></section>:
   <div className="hq-dashboard">
    <div className="hq-dashboard-intro"><div><span>ADVA HQ / ENQUIRIES</span><h1>Your next<br/><em>opportunities.</em></h1><p>Welcome, {session.email}. Enquiries shown here are only visible to authorised ADVA staff.</p></div><button type="button" className="hq-refresh" onClick={refresh} disabled={loadingLeads}>↻ Refresh</button></div>
    <div className="hq-summary"><article><span>TOTAL ENQUIRIES</span><strong>{counts.total}</strong></article><article><span>NEW</span><strong>{counts.new}</strong></article><article><span>QUOTED</span><strong>{counts.quoted}</strong></article><article><span>WON</span><strong>{counts.won}</strong></article></div>
    <div className="hq-list-head"><h2>Project enquiries</h2><div><label htmlFor="hq-filter">STATUS</label><select id="hq-filter" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All enquiries</option>{STATUSES.map(s=><option value={s} key={s}>{s}</option>)}</select></div></div>
    {leadError&&<p role="alert" className="hq-error">{leadError}</p>}
    <div className="hq-enquiry-layout"><div className="hq-lead-list">
      {loadingLeads?<div className="hq-empty">Loading enquiries…</div>:!filtered.length?<div className="hq-empty">Nothing in this view yet. New website enquiries will appear here once the submission connection is active.</div>:filtered.map(l=><button key={l.id} type="button" className={"hq-lead-card"+(active?.id===l.id?" active":"")} onClick={()=>setActive(l)}><div className="hq-lead-top"><span>{fmt(l.created_at)}</span><span className={"hq-status hq-status-"+l.status}>{l.status}</span></div><h3>{l.company||l.name}</h3><p>{l.description}</p><span>{l.services?.join(" / ")||"General enquiry"}</span></button>)}
     </div><aside className="hq-detail">
       {!active?<div className="hq-detail-empty">Select an enquiry to view its details and manage its status.</div>:
       <><div className="hq-detail-head"><span>ENQUIRY DETAILS</span><button type="button" onClick={()=>setActive(null)} aria-label="Close detail">✕</button></div><h2>{active.company||active.name}</h2><p className="hq-detail-meta">Received {fmt(active.created_at)}</p><dl><dt>CONTACT</dt><dd>{active.name}</dd><dd><a href={"mailto:"+active.email}>{active.email}</a></dd><dt>PROJECT BRIEF</dt><dd>{active.description}</dd><dt>SERVICES</dt><dd>{active.services?.join(" · ")||"Not specified"}</dd><dt>TIMELINE / LOCATION</dt><dd>{active.timeline||"Not specified"} · {active.location||"Not specified"}</dd><dt>INDICATED BUDGET</dt><dd>{active.budget||"Not specified"}</dd></dl><div className="hq-update"><label htmlFor="hq-status-select">STATUS</label><select id="hq-status-select" value={active.status} onChange={e=>setStatus(active,e.target.value)} disabled={Boolean(saving)||!["ceo","admin"].includes(session.role)}>{STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select>{saving&&<small>Saving…</small>}</div></>}
      </aside></div>
    <p className="hq-dash-foot">Finance and client projects will be added only after role-scoped authentication and data access are validated. This dashboard never fabricates example enquiries.</p>
   </div>}
 </main>;
}
