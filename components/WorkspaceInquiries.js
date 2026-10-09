"use client";
import {useMemo,useState} from "react";
import AdvaIcon from "./AdvaIcon";
const statuses=["new","reviewing","quoted","won","lost","archived"];
const date=v=>v?new Date(v).toLocaleDateString("en-AE",{month:"short",day:"numeric",year:"numeric"}):"";
function amount(name){return name?.trim()||"Independent enquiry"}
export default function WorkspaceInquiries({ws,go}){
 const {db,data,refresh}=ws;
 const [selected,setSelected]=useState(null),[filter,setFilter]=useState("all"),[query,setQuery]=useState(""),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const leads=data.leads||[];
 const visible=useMemo(()=>leads.filter(l=>(filter==="all"||l.status===filter)&&[l.name,l.company,l.email,l.description].join(" ").toLowerCase().includes(query.trim().toLowerCase())).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)),[leads,filter,query]);
 const current=leads.find(x=>x.id===selected);
 async function update(l,change){
  setBusy(true);setMessage("");
  try{const {error}=await db.from("adva_leads").update(change).eq("id",l.id);if(error)throw error;setMessage("Enquiry updated.");refresh()}
  catch(e){setMessage(e.message||"Couldn't update enquiry.")}finally{setBusy(false)}
 }
 async function createProject(l){
  if(!window.confirm("Create an internal project from this enquiry? The client will not be given portal access automatically."))return;
  const slug=(l.company||l.name||"project").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)+"-"+l.id.slice(0,6);
  setBusy(true);setMessage("");
  try{
   const {error}=await db.from("adva_projects").insert({slug,name:l.company||l.name,client_name:l.company||l.name,description:l.description,status:"active"});
   if(error)throw error;
   if(l.status==="new")await db.from("adva_leads").update({status:"reviewing"}).eq("id",l.id);
   setMessage("Private project created. The enquiry stays in your pipeline until you decide whether it is won.");setSelected(null);refresh();
  }catch(e){setMessage(e.message||"Couldn't create a project.")}finally{setBusy(false)}
 }
 return <div className="aws-module aws-inquiries">
  <div className="aws-page-heading"><div><span className="aws-eyebrow"><i/> OPPORTUNITIES / CLIENT ENQUIRIES</span><h1>Every good idea<br/>starts somewhere.</h1><p>Potential collaborations, messages and briefs — in one clear queue.</p></div><a className="aws-outline" href="/brief" target="_blank" rel="noopener noreferrer">View public brief →</a></div>
  {message&&<div className="aws-feedback" role="status">{message}<button onClick={()=>setMessage("")}><AdvaIcon name="close" size={17}/></button></div>}
  <div className="aws-inquiry-totals"><span><strong>{leads.length}</strong> TOTAL ENQUIRIES</span><span><strong>{leads.filter(x=>x.status==="new").length}</strong> NEED ATTENTION</span><span><strong>{leads.filter(x=>x.status==="quoted").length}</strong> QUOTED</span><span><strong>{leads.filter(x=>x.status==="won").length}</strong> CONVERTED</span></div>
  <div className="aws-inquiry-toolbar"><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, business or idea…" aria-label="Search client inquiries"/><select value={filter} aria-label="Filter enquiries" onChange={e=>setFilter(e.target.value)}><option value="all">All enquiries</option>{statuses.map(x=><option key={x} value={x}>{x.toUpperCase()}</option>)}</select><button onClick={refresh}> Refresh</button></div>
  <div className="aws-inquiry-stage"><div className="aws-inquiry-stream">
   {visible.map((l,i)=><button key={l.id} type="button" className={"aws-inquiry-item"+(selected===l.id?" selected":"")} onClick={()=>setSelected(l.id)}><div className="aws-inquiry-top"><span>ENQUIRY {String(i+1).padStart(2,"0")}</span><span>{date(l.created_at)}</span></div><h3>{amount(l.company||l.name)}</h3><p>{l.description}</p><div className="aws-inquiry-bottom"><span className={"aws-pill aws-pill-"+l.status}>{l.status}</span><small>{(l.services||[]).slice(0,2).join(" / ")||"Creative enquiry"}</small><b>→</b></div></button>)}
   {!visible.length&&<div className="aws-empty"><strong>{leads.length?"Nothing in this view.":"Your next great client could start here."}</strong><p>{leads.length?"Change the search or status filter.":"Once a verified website brief arrives, it will be safely recorded here. The public submission service must be activated first."}</p></div>}
   </div>
   <aside className="aws-inquiry-detail">
    {current?<><div className="aws-inquiry-detail-head"><span>BRIEF / {date(current.created_at)}</span><button type="button" onClick={()=>setSelected(null)} aria-label="Close enquiry"><AdvaIcon name="close" size={17}/></button></div><h2>{amount(current.company||current.name)}</h2><p className="aws-inquiry-contact"><strong>{current.name}</strong><a href={"mailto:"+current.email}>{current.email} →</a></p>
      <div className="aws-inquiry-description"><span>THE IDEA</span><p>{current.description}</p></div>
      <div className="aws-inquiry-fields"><div><span>WHAT THEY NEED</span><strong>{current.services?.join(" / ")||"Not specified"}</strong></div><div><span>WHERE / WHEN</span><strong>{current.location||"—"} · {current.timeline||"—"}</strong></div><div><span>BUDGET</span><strong>{current.budget||"Not specified"}</strong></div></div>
      <label className="aws-inquiry-status">PIPELINE STAGE<select disabled={busy} value={current.status} onChange={e=>update(current,{status:e.target.value})}>{statuses.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
      <form onSubmit={e=>{e.preventDefault();const fd=new FormData(e.currentTarget);update(current,{internal_notes:String(fd.get("notes")||"").slice(0,6000)})}}><label>PRIVATE NOTES<textarea name="notes" key={current.id+"-"+current.internal_notes} defaultValue={current.internal_notes||""} maxLength={6000} rows={4} placeholder="Next steps, call summary, meeting notes…"/></label><button disabled={busy} type="submit" className="aws-outline">Save internal notes →</button></form>
      <button disabled={busy} type="button" className="aws-primary aws-inquiry-convert" onClick={()=>createProject(current)}>Turn into a project →</button>
     </>:<div className="aws-inquiry-placeholder"><span>→</span><strong>Open a conversation.</strong><p>Choose a client inquiry to review their idea, update the stage or turn it into a private ADVA project.</p></div>}
   </aside>
  </div>
  <p className="aws-small-note">Enquiry details are private to the verified CEO. Website submissions are currently disabled until the rate limiter and server-only credentials are connected; this dashboard never displays invented leads.</p>
 </div>;
}