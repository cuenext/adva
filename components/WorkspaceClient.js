"use client";
import {useMemo,useState} from "react";
function pretty(x){return x?new Date(x).toLocaleString("en-GB",{timeZone:"Asia/Dubai",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})+" UAE":"To be confirmed"}
function compact(x){return new Intl.NumberFormat("en",{notation:"compact",maximumFractionDigits:1}).format(x)}
export default function WorkspaceClient({ws}){
 const {db,user,data,refresh}=ws;
 const [selected,setSelected]=useState(""),[reviewing,setReviewing]=useState(null),[comment,setComment]=useState(""),[busy,setBusy]=useState(false),[status,setStatus]=useState("");
 const project=data.projects.find(p=>p.id===selected)||data.projects[0];
 const posts=data.content.filter(p=>p.project_id===project?.id);
 const upcoming=posts.filter(p=>p.scheduled_at&&!["posted","cancelled"].includes(p.status)).sort((a,b)=>a.scheduled_at.localeCompare(b.scheduled_at));
 const posted=posts.filter(p=>p.status==="posted");
 const contract=data.contracts.find(c=>c.project_id===project?.id);
 const currentMonth=new Date(Date.now()+4*3600000).toISOString().slice(0,7);
 const plan=(data.plans||[]).find(p=>p.project_id===project?.id&&p.month?.slice(0,7)===currentMonth);
 const snapshots=useMemo(()=>{const newest=new Map();const list=data.metrics.filter(m=>m.project_id===project?.id).sort((a,b)=>new Date(b.measured_at)-new Date(a.measured_at));list.forEach(m=>{if(!newest.has(m.content_id))newest.set(m.content_id,m)});return Array.from(newest.values())},[data.metrics,project?.id]);
 const views=snapshots.reduce((a,m)=>a+(Number(m.views)||0),0),reach=snapshots.reduce((a,m)=>a+(Number(m.reach)||0),0);
 async function leaveFeedback(e){
  e.preventDefault();if(!reviewing||comment.trim().length<5)return;
  setBusy(true);setStatus("");
  const {error}=await db.from("adva_client_feedback").insert({client_user_id:user.id,project_id:project.id,content_id:reviewing.id,comment:comment.trim()});
  setBusy(false);if(error){setStatus(error.message);return}
  setReviewing(null);setComment("");setStatus("Your feedback is now visible to the ADVA team.");refresh();
 }
 return <div className="aws-module aws-client">
  <div className="aws-page-heading"><div><span className="aws-eyebrow"><i/> CLIENT PORTAL / APPROVED CONTENT</span><h1>Your creative world.</h1><p>Content in progress, scheduled work, reporting and contract duration. All in one place.</p></div></div>
  {data.projects.length>1&&<div className="aws-toolbar"><label>MY PROJECT<select value={project?.id||""} onChange={e=>setSelected(e.target.value)}>{data.projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label></div>}
  {status&&<div className="aws-feedback">{status}<button onClick={()=>setStatus("")}>×</button></div>}
  {!project?<div className="aws-empty"><strong>Your portal is ready.</strong><p>ADVA will connect your verified account to the correct project. No private records are accessible before that assignment.</p></div>:<>
   <div className="aws-project-hero"><div><span>ADVA / CLIENT EXPERIENCE</span><h2>{project.name}</h2><p>{project.description||"Your creative work, in progress."}</p></div><div><strong>{upcoming.length}</strong><span>UPCOMING</span><strong>{posted.length}</strong><span>POSTED</span></div></div>
   <div className="aws-client-stats"><article><span>REPORTED VIEWS</span><strong>{snapshots.length?compact(views):"—"}</strong><small>{snapshots.length?"Latest recorded per content":"Not yet connected"}</small></article><article><span>REPORTED REACH</span><strong>{snapshots.length?compact(reach):"—"}</strong><small>Real metrics only</small></article><article><span>COMPLETED CONTENT</span><strong>{posted.length}</strong><small>Confirmed published items</small></article></div>
   <div className="aws-client-plan"><div className="aws-client-plan-header"><span>MONTHLY DIRECTION / {currentMonth}</span><b>{plan?"PLANNED":"AWAITING DIRECTION"}</b></div>{plan?<><h2>{plan.title}</h2><p>{plan.objective||"ADVA's monthly content direction."}</p><div className="aws-client-pillar-list">{(plan.content_pillars||[]).map((p,i)=><span key={i}>{p}</span>)}</div><small>{plan.recommended_cadence||""}</small>{(plan.target_videos>0||plan.target_posts>0)&&<div className="aws-client-plan-targets">{plan.target_videos>0&&<span>{plan.target_videos} target videos</span>}{plan.target_posts>0&&<span>{plan.target_posts} total posts planned</span>}</div>}</>:<><h2>Better content starts with a plan.</h2><p>ADVA will share the monthly creative direction here when it's approved for your project.</p></>}</div>
   <div className="aws-project-grid">
    <section className="aws-panel"><div className="aws-panel-title"><div><span>CONTENT PLAN</span><h2>What's coming</h2></div><span>{upcoming.length} ITEMS</span></div>{upcoming.length?<div className="aws-client-list">{upcoming.map(p=><article key={p.id}><div><small>{pretty(p.scheduled_at)}</small><strong>{p.title}</strong><span>{p.platform.replaceAll("_"," ")} · {p.kind} · {p.status.replaceAll("_"," ")}</span></div><button onClick={()=>setReviewing(p)}>Leave feedback ↗</button></article>)}</div>:<div className="aws-empty"><p>ADVA has not published a client-visible content schedule yet.</p></div>}</section>
    <section className="aws-panel"><div className="aws-panel-title"><div><span>PROJECT AGREEMENT</span><h2>Contract overview</h2></div></div>{contract?<div className="aws-contract-read"><div><span>START DATE</span><strong>{contract.starts_on||"TBC"}</strong></div><div><span>END DATE</span><strong>{contract.ends_on||"Ongoing"}</strong></div><p>{contract.contracted_deliverables||"Deliverables will be added by ADVA."}</p></div>:<div className="aws-empty"><p>ADVA has not published contract dates or scope here yet.</p></div>}</section>
   </div>
   <section className="aws-panel"><div className="aws-panel-title"><div><span>REPORTED INSIGHTS</span><h2>Content performance</h2></div><span>{snapshots.length} REPORTS</span></div>
     {snapshots.length?<div className="aws-scroll-table"><table><thead><tr><th>Content</th><th>Platform</th><th>Views</th><th>Reach</th><th>Source</th></tr></thead><tbody>{snapshots.map(m=>{const p=posts.find(x=>x.id===m.content_id);return <tr key={m.id}><td>{p?.title||"Content"}</td><td>{p?.platform||"—"}</td><td>{m.views??"—"}</td><td>{m.reach??"—"}</td><td>{m.source==="official_api"?"Official API":"Manual report"}</td></tr>})}</tbody></table></div>:<div className="aws-empty"><strong>No published analytics yet.</strong><p>ADVA will show recorded social insights here when official accounts are connected or verified metrics have been entered.</p></div>}
   </section>
  </>}
  {reviewing&&<div className="aws-modal"><button className="aws-backdrop" aria-label="Close feedback" onClick={()=>setReviewing(null)}/><form className="aws-modal-card" onSubmit={leaveFeedback}><header><div><span>CLIENT / FEEDBACK</span><h2>Leave a note</h2></div><button type="button" onClick={()=>setReviewing(null)}>×</button></header><p>Regarding <strong>{reviewing.title}</strong></p><label>Your comments<textarea rows={5} required minLength={5} maxLength={2000} value={comment} onChange={e=>setComment(e.target.value)} placeholder="What should ADVA know about this content?"/></label><button disabled={busy} type="submit" className="aws-primary">{busy?"Sending…":"Send feedback"} ↗</button></form></div>}
 </div>;
}