"use client";
import {useMemo,useState} from "react";
import AdvaIcon,{AdvaMark} from "./AdvaIcon";
const statuses=["open","reviewed","resolved"];
function displayDay(s){try{return new Date(s).toLocaleDateString("en-AE",{day:"numeric",month:"short",year:"numeric"})}catch{return "—"}}
export default function WorkspaceFeedback({ws}){
 const {db,data,refresh}=ws;
 const [active,setActive]=useState(null),[filter,setFilter]=useState("all"),[busy,setBusy]=useState(false),[notice,setNotice]=useState("");
 const feedback=data.feedback||[];
 const ordered=useMemo(()=>feedback.filter(x=>filter==="all"||x.status===filter).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)),[feedback,filter]);
 const selected=feedback.find(x=>x.id===active);
 function projectName(id){return data.projects.find(x=>x.id===id)?.name||"Private project"}
 function contentTitle(id){return data.content.find(x=>x.id===id)?.title||"Content item"}
 async function setStatus(item,value){
  setBusy(true);setNotice("");
  try{const {error}=await db.from("adva_client_feedback").update({status:value}).eq("id",item.id);if(error)throw error;setNotice("Feedback status updated.");refresh()}
  catch(e){setNotice(e.message||"Couldn't update feedback.")}finally{setBusy(false)}
 }
 return <div className="aws-module aws-feedback-inbox">
  <div className="aws-page-heading"><div><span className="aws-eyebrow"><i/> CLIENT RELATIONSHIPS / APPROVALS</span><h1>Listen closely.</h1><p>Every comment from a client has a place, and every request deserves a clear next step.</p></div></div>
  {notice&&<div className="aws-feedback" role="status">{notice}<button onClick={()=>setNotice("")} type="button"><AdvaIcon name="close" size={17}/></button></div>}
  <div className="aws-inquiry-totals"><span><strong>{feedback.length}</strong> TOTAL COMMENTS</span><span><strong>{feedback.filter(x=>x.status==="open").length}</strong> NEED REVIEW</span><span><strong>{feedback.filter(x=>x.status==="reviewed").length}</strong> REVIEWED</span><span><strong>{feedback.filter(x=>x.status==="resolved").length}</strong> RESOLVED</span></div>
  <div className="aws-inquiry-toolbar"><label htmlFor="aws-feedback-filter">STATUS</label><select id="aws-feedback-filter" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All feedback</option>{statuses.map(x=><option value={x} key={x}>{x}</option>)}</select><button type="button" onClick={refresh}>↻ Refresh</button></div>
  <div className="aws-inquiry-stage"><section className="aws-inquiry-stream">
   {ordered.map((f,i)=><button type="button" key={f.id} onClick={()=>setActive(f.id)} className={"aws-inquiry-item"+(active===f.id?" selected":"")}><div className="aws-inquiry-top"><span>{projectName(f.project_id).toUpperCase()}</span><span>{displayDay(f.created_at)}</span></div><h3>{contentTitle(f.content_id)}</h3><p>{f.comment}</p><div className="aws-inquiry-bottom"><span className={"aws-pill aws-pill-"+f.status}>{f.status}</span><small>CLIENT FEEDBACK / {String(i+1).padStart(2,"0")}</small><b>→</b></div></button>)}
   {!ordered.length&&<div className="aws-empty"><strong>{feedback.length?"Nothing in this view.":"No feedback to review yet."}</strong><p>Once a linked client comments on content shared in their portal, the note will appear here.</p></div>}
  </section><aside className="aws-inquiry-detail">
   {selected?<><div className="aws-inquiry-detail-head"><span>CLIENT COMMENT / {displayDay(selected.created_at)}</span><button type="button" aria-label="Close feedback" onClick={()=>setActive(null)}><AdvaIcon name="close" size={17}/></button></div><h2>{contentTitle(selected.content_id)}</h2><p className="aws-inquiry-contact">{projectName(selected.project_id)}<span>From a verified project client</span></p><div className="aws-inquiry-description"><span>WHAT THE CLIENT SAID</span><p>{selected.comment}</p></div><div className="aws-inquiry-fields"><div><span>REVIEW STATUS</span><strong>{selected.status}</strong></div><div><span>RECEIVED</span><strong>{displayDay(selected.created_at)}</strong></div></div><label className="aws-inquiry-status">MARK AS<select disabled={busy} value={selected.status} onChange={e=>setStatus(selected,e.target.value)}>{statuses.map(x=><option key={x} value={x}>{x}</option>)}</select></label><p className="aws-small-note">Status updates are internal. If you need to confirm a creative change to the client, contact them through the project's agreed communication channel.</p></>:<div className="aws-inquiry-placeholder"><span><AdvaMark size={32}/></span><strong>Stay close to the work.</strong><p>Select a client comment to review it and record the next step.</p></div>}
  </aside></div>
 </div>;
}