"use client";
import {useEffect,useMemo,useState} from "react";
import AdvaIcon from "./AdvaIcon";
import PostingGuide from "./PostingGuide";
import {NETWORKS,network} from "../lib/posting-times";
const platforms=NETWORKS.map(x=>({id:x.id,name:x.label}));
function dubaiDate(){return new Date(Date.now()+4*3600000).toISOString().slice(0,10)}
function nextSlot(day){const ids={Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6};const base=dubaiDate();const date=new Date(base+"T00:00:00Z");const delta=(ids[day]-date.getUTCDay()+7)%7||7;date.setUTCDate(date.getUTCDate()+delta);return date.toISOString().slice(0,10)}
function niceDate(value){if(!value)return "Unscheduled";return new Date(value).toLocaleString("en-GB",{timeZone:"Asia/Dubai",weekday:"short",day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})+" UAE"}
function isVideo(kind){return ["reel","video","short"].includes(kind)}
const empty={title:"",concept:"",platform:"instagram",kind:"reel",date:"",time:"13:00",client_visible:false,status:"scheduled",assignee_user_id:""};
export default function WorkspaceCalendar({ws,isClient=false}){
 const {db,role,data,user,refresh}=ws;
 const isCEO=role==="ceo",contributor=role==="freelancer",allowPost=isCEO||contributor;
 const [projectId,setProjectId]=useState(""),[tab,setTab]=useState("schedule");
 const [editor,setEditor]=useState(false),[draft,setDraft]=useState({...empty}),[target,setTarget]=useState(null),[link,setLink]=useState("");
 const [metricsFor,setMetricsFor]=useState(null),[metricsDraft,setMetricsDraft]=useState({views:"",reach:"",likes:"",comments:"",saves:"",shares:""});
 const [busy,setBusy]=useState(false),[feedback,setFeedback]=useState("");
 const projects=data.projects;
 useEffect(()=>{if(projects.length&&(!projectId||!projects.some(p=>p.id===projectId)))setProjectId((projects.find(p=>p.slug==="silwadi")||projects[0]).id)},[projects,projectId]);
 const current=projects.find(p=>p.id===projectId);
 const records=useMemo(()=>data.content.filter(p=>p.project_id===projectId).sort((a,b)=>(a.scheduled_at||"9999").localeCompare(b.scheduled_at||"9999")),[data.content,projectId]);
 const posted=records.filter(p=>p.status==="posted"),videos=posted.filter(p=>isVideo(p.kind));
 const metrics=useMemo(()=>data.metrics.filter(m=>m.project_id===projectId),[data.metrics,projectId]);
 const assigned=data.members.filter(m=>m.project_id===projectId);
 const freelancers=data.freelancers.filter(f=>assigned.some(a=>a.user_id===f.user_id));
 const opts=(platform)=>platforms.find(p=>p.id===platform)?.name||platform;
 function fromSlot(slot){setDraft({...empty,platform:slot.platform,kind:slot.platform==="youtube_shorts"?"short":"reel",date:nextSlot(slot.day),time:slot.hour,title:slot.name});setTab("schedule");setEditor(true);setFeedback("");}
 async function save(e){
  e.preventDefault();setBusy(true);setFeedback("");
  if(!isCEO||!current){setBusy(false);return}
  const stamp=draft.date?new Date(draft.date+"T"+draft.time+":00+04:00").toISOString():null;
  const payload={project_id:projectId,title:draft.title.trim(),concept:draft.concept.trim(),platform:draft.platform,kind:draft.kind,status:stamp?"scheduled":"idea",scheduled_at:stamp,client_visible:Boolean(draft.client_visible),assignee_user_id:draft.assignee_user_id||null};
  try{
   const {error}=await db.from("adva_content").insert(payload);
   if(error)throw error;
   setEditor(false);setDraft({...empty});setFeedback("Content added to the calendar.");refresh();
  }catch(err){setFeedback(err.message||"Couldn't save content.")}finally{setBusy(false)}
 }
 async function markPosted(){
  if(!target||!allowPost)return;
  setBusy(true);setFeedback("");
  try{
   const {data:ok,error}=await db.rpc("adva_mark_posted",{item_id:target.id,published_link:link.trim()});
   if(error||!ok)throw(error||new Error("Couldn't confirm content completion."));
   setFeedback("Marked as posted. Video and posting totals update automatically.");
   setTarget(null);setLink("");refresh();
  }catch(err){setFeedback(err.message||"Couldn't mark posted.")}finally{setBusy(false)}
 }
 async function changeStatus(row,status){
  if(!isCEO)return;
  const {error}=await db.from("adva_content").update({status}).eq("id",row.id);
  setFeedback(error?error.message:"Status updated.");if(!error)refresh();
 }
 async function saveMetrics(e){
  e.preventDefault();if(!isCEO||!metricsFor)return;
  setBusy(true);
  const values=Object.fromEntries(Object.entries(metricsDraft).map(([k,v])=>[k,v===""?null:Math.max(0,Math.floor(Number(v)))]));
  const {error}=await db.from("adva_content_metrics").insert({project_id:projectId,content_id:metricsFor.id,source:"manual",client_visible:true,...values});
  setFeedback(error?error.message:"Manual performance snapshot recorded.");if(!error){setMetricsFor(null);refresh()}setBusy(false);
 }
 return <div className="aws-module aws-calendar">
  <div className="aws-page-heading"><div><span className="aws-eyebrow"><i/> ADVA / CONTENT STUDIO</span><h1>Content calendar.</h1><p>Schedule posts, assign creators and record when content goes live.</p></div><div className="aws-page-heading-actions">{isCEO&&<button type="button" className="aws-primary aws-compact" onClick={()=>{setDraft({...empty});setEditor(true)}}>+ Plan content</button>}</div></div>
  {projects.length>0?<div className="aws-toolbar"><label>PROJECT<select value={projectId} onChange={e=>setProjectId(e.target.value)}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><div className="aws-subtabs" role="tablist"><button className={tab==="schedule"?"active":""} onClick={()=>setTab("schedule")}>Calendar</button><button className={tab==="insights"?"active":""} onClick={()=>setTab("insights")}>Posting times</button></div></div>:<div className="aws-empty">No projects are assigned to your account yet. ADVA will show your calendar once access is granted.</div>}
  {feedback&&<div className="aws-feedback" role="status">{feedback}<button onClick={()=>setFeedback("")}><AdvaIcon name="close" size={17}/></button></div>}
  {projects.length>0&&tab==="insights"&&<PostingGuide projectName={current?.name||"Your project"} onUseSlot={isCEO?fromSlot:null} mode={isCEO?"private":"readonly"}/>}
  {projects.length>0&&tab==="schedule"&&<>
    <div className="aws-mini-stats"><article><span>CONTENT ITEMS</span><strong>{records.filter(p=>p.status!=="cancelled").length}</strong><small>Ideas, drafts and scheduled items</small></article><article><span>POSTED</span><strong>{posted.length}</strong><small>Confirmed manually in ADVA</small></article><article><span>VIDEOS MARKED POSTED</span><strong>{videos.length}</strong><small>Reels, videos and Shorts marked posted</small></article></div>
    <div className="aws-panel"><div className="aws-panel-title"><div><span>PROJECT / {current?.name.toUpperCase()}</span><h2>Production board</h2></div><span>{records.length} ITEMS</span></div>
      {records.length? <div className="aws-post-list">{records.map(p=><div key={p.id} className="aws-post-row">
        <div className="aws-post-platform"><span>{opts(p.platform)}</span><b>{p.kind.toUpperCase()}</b></div>
        <div className="aws-post-description"><strong>{p.title}</strong><p>{p.concept||"No detailed concept yet."}</p><small>{niceDate(p.scheduled_at)} · {p.client_visible?"Client visible":"Internal"}{p.assignee_user_id&&role!=="client"?" · Assigned: "+(data.freelancers.find(f=>f.user_id===p.assignee_user_id)?.display_name||"Team member"):""}</small></div>
        <span className={"aws-pill aws-pill-"+p.status}>{p.status.replaceAll("_"," ")}</span>
        <div className="aws-post-actions">
          {allowPost&&p.status!=="posted"&&(!p.assignee_user_id||p.assignee_user_id===user?.id||isCEO)&&<button type="button" onClick={()=>{setTarget(p);setLink("")}}>Mark posted →</button>}
          {isCEO&&p.status==="posted"&&<button onClick={()=>{setMetricsFor(p);setMetricsDraft({views:"",reach:"",likes:"",comments:"",saves:"",shares:""})}}>Add metrics</button>}
          {isCEO&&p.status!=="posted"&&<select aria-label={"Set status of "+p.title} value={p.status} onChange={e=>changeStatus(p,e.target.value)}><option value="idea">Idea</option><option value="draft">Draft</option><option value="awaiting_approval">Approval</option><option value="approved">Approved</option><option value="scheduled">Scheduled</option><option value="cancelled">Cancelled</option></select>}
        </div>
       </div>)}</div> :<div className="aws-empty"><strong>No content yet.</strong><p>{isCEO?"Add a content item or choose a recommended posting time.":"ADVA has not scheduled content for this project yet."}</p>{isCEO&&<button className="aws-outline" onClick={()=>setTab("insights")}>Explore recommended times →</button>}</div>}
    </div>
    <section className="aws-strategy"><span className="aws-eyebrow"><i/> CREATIVE DIRECTION</span><h2>Content ideas to try.</h2><div className="aws-strategy-grid">{[
      ["01","Answer one patient question","A clear, accurate educational reel with the clinician at the centre."],
      ["02","Show the people behind the practice","Introduce expertise and everyday clinic culture without forced trends."],
      ["03","Build a repeatable series","One topic per post; watch for saves, shares and relevant enquiries."]
    ].map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div><p className="aws-small-note">Healthcare content requires professional review and applicable UAE permissions before publication. No patient images without appropriate consent.</p></section>
  </>}
  {editor&&<div className="aws-modal"><button className="aws-backdrop" onClick={()=>setEditor(false)} aria-label="Close editor"/><form className="aws-modal-card" onSubmit={save}><header><div><span>ADVA / CONTENT</span><h2>Plan content</h2></div><button type="button" onClick={()=>setEditor(false)}><AdvaIcon name="close" size={17}/></button></header><label>Content title<input value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})} required minLength={2} maxLength={180} placeholder="A simple, memorable content idea"/></label><label>Creative brief<textarea rows={4} maxLength={3000} value={draft.concept} onChange={e=>setDraft({...draft,concept:e.target.value})} placeholder="What should the audience learn or feel?"/></label><div className="aws-form-pair"><label>Platform<select value={draft.platform} onChange={e=>setDraft({...draft,platform:e.target.value})}>{platforms.map(n=><option value={n.id} key={n.id}>{n.name}</option>)}</select></label><label>Format<select value={draft.kind} onChange={e=>setDraft({...draft,kind:e.target.value})}>{["reel","video","photo","carousel","story","short","other"].map(x=><option key={x} value={x}>{x}</option>)}</select></label></div><div className="aws-form-pair"><label>Scheduled day<input type="date" value={draft.date} onChange={e=>setDraft({...draft,date:e.target.value})}/></label><label>UAE time<input type="time" value={draft.time} onChange={e=>setDraft({...draft,time:e.target.value})}/></label></div><label>Assigned creator<select value={draft.assignee_user_id} onChange={e=>setDraft({...draft,assignee_user_id:e.target.value})}><option value="">No individual assignment</option>{data.members.filter(m=>m.project_id===projectId).map(m=><option key={m.user_id} value={m.user_id}>{data.freelancers.find(f=>f.user_id===m.user_id)?.display_name||m.user_id.slice(0,8)}</option>)}</select></label><label className="aws-check"><input type="checkbox" checked={draft.client_visible} onChange={e=>setDraft({...draft,client_visible:e.target.checked})}/> Show this content item to the client in their portal</label><p className="aws-small-note">Without a date this will be saved as an idea; a date creates a scheduled item. ADVA does not automatically publish to social platforms yet.</p><button className="aws-primary" type="submit" disabled={busy}>{busy?"Saving…":"Add to content board"} →</button></form></div>}
  {target&&<div className="aws-modal"><button className="aws-backdrop" onClick={()=>setTarget(null)} aria-label="Close confirmation"/><div className="aws-modal-card aws-confirm"><header><div><span>WORK COMPLETION</span><h2>Mark as posted?</h2></div><button onClick={()=>setTarget(null)}><AdvaIcon name="close" size={17}/></button></header><p>This records that <strong>{target.title}</strong> was actually published. ADVA will add this to completed content totals and automatically count it as a finished video if it's a video format.</p><label>Link to published post (optional)<input type="url" placeholder="https://instagram.com/..." value={link} onChange={e=>setLink(e.target.value)} maxLength={1000}/></label><button className="aws-primary" onClick={markPosted} disabled={busy}>{busy?"Saving…":"Yes, mark as posted"} →</button></div></div>}
  {metricsFor&&<div className="aws-modal"><button className="aws-backdrop" onClick={()=>setMetricsFor(null)} aria-label="Close metrics"/><form onSubmit={saveMetrics} className="aws-modal-card"><header><div><span>MANUAL INSIGHTS</span><h2>Record performance</h2></div><button type="button" onClick={()=>setMetricsFor(null)}><AdvaIcon name="close" size={17}/></button></header><p>For <strong>{metricsFor.title}</strong>. Enter real platform figures only. These are labeled manual until an official analytics connection is active.</p><div className="aws-form-pair">{Object.entries(metricsDraft).map(([key,value])=><label key={key}>{key[0].toUpperCase()+key.slice(1)}<input type="number" min="0" step="1" value={value} onChange={e=>setMetricsDraft({...metricsDraft,[key]:e.target.value})} placeholder="—"/></label>)}</div><button type="submit" className="aws-primary" disabled={busy}>Save performance snapshot →</button></form></div>}
 </div>;
}