"use client";
import {useEffect,useMemo,useState} from "react";
import {useAdvaWorkspace} from "../lib/use-adva-workspace";
import WorkspaceLogin from "./WorkspaceLogin";
import WorkspaceCalendar from "./WorkspaceCalendar";
import WorkspaceStrategy from "./WorkspaceStrategy";
import WorkspaceFinance from "./WorkspaceFinance";
import WorkspaceProjects from "./WorkspaceProjects";
import WorkspaceClient from "./WorkspaceClient";
import WorkspaceNetwork,{FreelancerOnboarding} from "./WorkspaceNetwork";
import PortfolioMedia from "./PortfolioMedia";
import WorkspaceInquiries from "./WorkspaceInquiries";
import WorkspaceFeedback from "./WorkspaceFeedback";
import AdvaIcon from "./AdvaIcon";

const navIcons={
 overview:"grid",inquiries:"inbox",feedback:"users",calendar:"calendar",strategy:"layers",
 projects:"briefcase",finance:"chart",network:"users",team:"shield",performance:"chart"
};
const niceTime=v=>v?new Date(v).toLocaleString("en-GB",{timeZone:"Asia/Dubai",weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}):"Not scheduled";

function Overview({ws,go}){
 const {role,data}=ws;
 const ceo=role==="ceo",projects=data.projects,content=data.content,posted=content.filter(x=>x.status==="posted"),upcoming=content.filter(x=>x.status==="scheduled"&&x.scheduled_at&&new Date(x.scheduled_at)>new Date()).sort((a,b)=>a.scheduled_at.localeCompare(b.scheduled_at));
 const activeProjects=projects.filter(p=>p.status==="active");
 const assigned=data.members.filter(x=>x.user_id===ws.user?.id);
 return <div className="aws-module aws-overview">
  <div className="aws-page-heading"><div><span className="aws-eyebrow"><i/> ADVA / OPERATIONS</span><h1>{ceo?"Studio overview.":"Your work, organized."}</h1><p>{ceo?"Every project, every detail. A clearer view of what comes next.":"Your assigned projects and upcoming content, without the noise."}</p></div><div className="aws-page-heading-actions">{ceo&&<button className="aws-outline" onClick={()=>go("inquiries")}>{data.leads?.filter(l=>l.status==="new").length||0} new inquiries →</button>}<a className="aws-primary aws-compact" href="/posting-times">Posting intelligence →</a></div></div>
  <div className="aws-overview-stats"><article><span>{ceo?"ACTIVE PROJECTS":"ASSIGNED PROJECTS"}</span><strong>{activeProjects.length}</strong><small>Current ADVA workspace</small></article><article><span>UPCOMING POSTS</span><strong>{upcoming.length}</strong><small>Scheduled publishing tasks</small></article><article><span>POSTED CONTENT</span><strong>{posted.length}</strong><small>Confirmed in ADVA</small></article><article><span>VIDEOS MARKED POSTED</span><strong>{posted.filter(x=>["reel","video","short"].includes(x.kind)).length}</strong><small>Automatically counted on posting</small></article></div>
  <div className="aws-overview-layout">
   <section className="aws-panel"><div className="aws-panel-title"><div><span>WHAT'S COMING</span><h2>Next on the calendar</h2></div><button className="aws-panel-text-button" onClick={()=>go("calendar")}>Open calendar →</button></div>{upcoming.length?<div className="aws-upcoming-list">{upcoming.slice(0,7).map(p=><article key={p.id}><span className="aws-when">{niceTime(p.scheduled_at)}</span><div><strong>{p.title}</strong><small>{projects.find(x=>x.id===p.project_id)?.name} · {p.platform}</small></div><span className="aws-pill">{p.status}</span></article>)}</div>:<div className="aws-empty"><strong>The calendar's yours to build.</strong><p>{ceo?"Start with Silwadi, choose a platform and turn a content idea into a scheduled task.":"ADVA hasn't scheduled content on your assigned projects yet."}</p><button className="aws-outline" onClick={()=>go("calendar")}>Open content planning →</button></div>}</section>
   <section className="aws-panel aws-overview-projects"><div className="aws-panel-title"><div><span>THE WORK</span><h2>Your projects</h2></div><button className="aws-panel-text-button" onClick={()=>go("projects")}>See projects →</button></div>{projects.length?projects.slice(0,6).map(p=><button type="button" onClick={()=>go("projects")} className="aws-overview-project" key={p.id}><span className="aws-avatar">{p.name.slice(0,1)}</span><span><strong>{p.name}</strong><small>{p.client_name||"ADVA project"}</small></span><b>→</b></button>):<div className="aws-empty"><p>No projects assigned to this account yet.</p></div>}</section>
  </div>
 </div>;
}

function TeamControl({ws}){
 const {db,data,refresh}=ws;
 const [notice,setNotice]=useState(""),[jobId,setJobId]=useState(""),[ndaTitle,setNdaTitle]=useState(""),[ndaURL,setNdaURL]=useState(""),[reviewed,setReviewed]=useState(false),[busy,setBusy]=useState(false),[creator,setCreator]=useState(null);
 const jobs=data.jobs||[],requests=data.jobRequests||[],activeNda=data.ndas?.find(d=>d.active);
 async function action(fn,label){setBusy(true);setNotice("");try{const res=await fn();if(res.error)throw res.error;setNotice(label);refresh()}catch(e){setNotice(e.message||"Could not complete the change.")}finally{setBusy(false)}}
 async function saveNda(e){
  e.preventDefault();
  if(!reviewed){setNotice("A reviewed NDA must be confirmed before activation.");return}
  try{const url=new URL(ndaURL);if(url.protocol!=="https:")throw Error();}catch{setNotice("Use a secure https:// link to the approved legal document.");return}
  if(activeNda){setNotice("An NDA is already active. Review versioning before replacing it.");return}
  await action(()=>db.from("adva_nda_documents").insert({title:ndaTitle,version:"adva-"+new Date().toISOString().slice(0,10)+"-"+Math.floor(Date.now()/1000),document_url:ndaURL,legal_reviewed:true,active:true}),"Legal agreement activated. Verified freelancers can now read and accept it.");
 }
 async function changeRequest(row,status){await action(()=>db.from("adva_job_requests").update({status}).eq("id",row.id),"Application updated.")}
 async function toggleCreator(f){await action(()=>db.from("adva_freelancers").update({approved_network_visible:!f.approved_network_visible}).eq("user_id",f.user_id),f.approved_network_visible?"Removed from network discovery.":"Creator approved for the NDA-protected network.")}
 return <div className="aws-module">
  <div className="aws-page-heading"><div><span className="aws-eyebrow"><i/> CEO / TEAM GOVERNANCE</span><h1>The people behind ADVA.</h1><p>Manage trusted creatives, review job requests and control the confidentiality gate.</p></div></div>
  {notice&&<div className="aws-feedback">{notice}<button onClick={()=>setNotice("")}>×</button></div>}
  <div className="aws-overview-stats"><article><span>FREELANCERS</span><strong>{data.freelancers.length}</strong><small>Verified profiles</small></article><article><span>JOB POSTS</span><strong>{jobs.length}</strong><small>Including drafts</small></article><article><span>JOB REQUESTS</span><strong>{requests.length}</strong><small>Awaiting review or decision</small></article><article><span>ACTIVE NDA</span><strong>{activeNda?"YES":"NO"}</strong><small>{activeNda?"Legally reviewed version active":"Required before job access"}</small></article></div>
  <div className="aws-project-grid">
   <section className="aws-panel"><div className="aws-panel-title"><div><span>RECRUITMENT PIPELINE</span><h2>Freelancer requests</h2></div></div><p className="aws-small-note" style={{padding:"0 20px"}}>An approved application is not an employment offer or a project assignment. Create the scope and assign the verified creator separately.</p>{requests.length?<div className="aws-upcoming-list">{requests.map(r=><article key={r.id}><div><strong>{jobs.find(j=>j.id===r.job_id)?.title||"Opportunity"}</strong><small>Applicant: {data.freelancers.find(f=>f.user_id===r.applicant_user_id)?.display_name||"Verified account"} — {r.message||"No note"}</small></div><select value={r.status} disabled={busy} onChange={e=>changeRequest(r,e.target.value)}><option value="requested">Requested</option><option value="reviewing">Reviewing</option><option value="accepted">Accepted</option><option value="declined">Declined</option></select></article>)}</div>:<div className="aws-empty"><p>Verified freelancers' job applications will appear here.</p></div>}</section>
   <section className="aws-panel"><div className="aws-panel-title"><div><span>LEGAL REVIEW</span><h2>Confidentiality agreement</h2></div></div>{activeNda?<div className="aws-contract-read"><p><strong>{activeNda.title}</strong></p><a target="_blank" rel="noopener noreferrer" href={activeNda.document_url}>View the active NDA →</a><small>Version: {activeNda.version}</small></div>:<form className="aws-project-inline" onSubmit={saveNda}><p className="aws-small-note">We will not invent or publish a legal NDA. Have a UAE-qualified lawyer review your own agreement before activating access. This is an acknowledgment system, not a substitute for a reviewed e-signature workflow.</p><label>Reviewed document name<input required value={ndaTitle} onChange={e=>setNdaTitle(e.target.value)} placeholder="ADVA Freelancer Confidentiality Agreement"/></label><label>Secure link to reviewed NDA<input required type="url" value={ndaURL} onChange={e=>setNdaURL(e.target.value)} placeholder="https://...approved-agreement.pdf"/></label><label className="aws-check"><input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)}/> I confirm a qualified legal professional has reviewed this NDA and it is ready to publish to candidates.</label><button type="submit" className="aws-primary aws-compact" disabled={busy||!reviewed}>Activate reviewed NDA →</button></form>}</section>
  </div>
  <section className="aws-panel"><div className="aws-panel-title"><div><span>TALENT / VERIFIED PROFILES</span><h2>The ADVA network</h2></div></div><div className="aws-talent-board">{data.freelancers.map(f=><article key={f.user_id}><span className="aws-avatar">{f.display_name.slice(0,1).toUpperCase()}</span><h3>{f.display_name}</h3><p>{f.specialty.replaceAll("_"," ")} · {f.location}</p><small>{f.availability}</small><div className="aws-creator-approval-controls"><button className="aws-outline" type="button" disabled={busy} onClick={()=>toggleCreator(f)}>{f.approved_network_visible?"Hide from discovery":"Approve discovery"}</button><button type="button" className="aws-outline" onClick={()=>setCreator(f)}>Review media</button></div><div>{(f.portfolio_links||[]).filter(u=>{try{return new URL(u).protocol==="https:"}catch{return false}}).map((u,i)=><a key={i} href={u} target="_blank" rel="noopener noreferrer">Portfolio {i+1} →</a>)}</div></article>)}{data.freelancers.length===0&&<div className="aws-empty"><strong>No talent profiles yet.</strong><p>Send candidates to /join to verify their email and create a profile.</p></div>}</div></section>
  {creator&&<div className="aws-modal"><button className="aws-backdrop" aria-label="Close portfolio review" onClick={()=>setCreator(null)}/><div className="aws-modal-card aws-creator-profile-modal"><header><div><span>CEO / PORTFOLIO REVIEW</span><h2>{creator.display_name}</h2></div><button type="button" onClick={()=>setCreator(null)}>×</button></header><PortfolioMedia db={db} ownerId={creator.user_id} title="Selected work"/></div></div>}
 </div>;
}
export default function WorkspaceApp({mode="hq"}){
 const ws=useAdvaWorkspace(mode);
 const {db,user,role,data,loading,error,refresh}=ws;
 const [section,setSection]=useState("overview"),[menuOpen,setMenuOpen]=useState(false);
 const viewRole=role==="ceo"?"ceo":role==="client"?"client":role==="freelancer"?"freelancer":null;
 const nav=viewRole==="ceo"?[["overview","Overview"],["inquiries","Enquiries"],["feedback","Feedback"],["calendar","Content"],["strategy","Strategy"],["projects","Projects"],["finance","Finances"],["network","Freelancers"],["team","Team access"]]:viewRole==="client"?[["overview","Overview"],["calendar","Content plan"],["strategy","Monthly plan"],["performance","Performance"]]:[["overview","Overview"],["calendar","My content"],["strategy","Creative plan"],["projects","Projects"],["network","Network"]];
 const paths={hq:"/hq",portal:"/portal",join:"/join",network:"/network"};
 const greeting=role==="ceo"?"CEO / ADVA HQ":role==="client"?"CLIENT / ADVA":role==="freelancer"?"FREELANCER / ADVA":"ADVA";
 useEffect(()=>{if(mode==="network"&&role==="freelancer")setSection("network");if(mode==="portal"&&role==="client")setSection("overview");if(mode==="hq"&&role==="ceo")setSection("overview")},[mode,role]);
 if(["configuration","checking"].includes(role))return <div className="adva-hq-shell aws-waiting"><div className="aws-waiting-mark">A.</div><p>{role==="checking"?"Verifying workspace permissions…":"The workspace is waiting for its Supabase connection."}</p></div>;
 if(role==="guest")return <div className="adva-hq-shell"><WorkspaceLogin db={db} mode={mode} redirect={paths[mode]||"/hq"}/></div>;
 if(mode==="join"&&role==="unlinked")return <div className="adva-hq-shell"><FreelancerOnboarding ws={ws}/></div>;
 if(role==="unlinked"){
  return <div className="adva-hq-shell aws-waiting"><div className="aws-waiting-mark">A.</div><span className="aws-eyebrow">VERIFIED ACCOUNT</span><h1>You're in. Your access is next.</h1><p>Your email is verified, but the CEO hasn't linked this account to a client project or freelancer profile yet.</p><div className="aws-wait-links"><a href="/join">Join the creative network →</a><a href="/portal">Client portal →</a><a href="/">Back to the website →</a></div><button onClick={()=>db.auth.signOut()} className="aws-outline">Sign out</button></div>;
 }
 if(mode==="hq"&&role!=="ceo")return <div className="adva-hq-shell aws-waiting"><div className="aws-waiting-mark">A.</div><h1>CEO workspace.</h1><p>This part of ADVA is reserved exclusively for the verified CEO. Your own workspace is available below.</p><a href={role==="freelancer"?"/network":"/portal"} className="aws-primary">Open your workspace →</a></div>;
 if(mode==="portal"&&role==="ceo")return <div className="adva-hq-shell aws-waiting"><div className="aws-waiting-mark">A.</div><h1>Your CEO workspace.</h1><p>ADVA HQ contains all project controls, including private finance and client administration.</p><a className="aws-primary" href="/hq">Open CEO HQ →</a></div>;
 if(mode==="network"&&role==="ceo")return <div className="adva-hq-shell aws-waiting"><div className="aws-waiting-mark">A.</div><h1>The network is waiting.</h1><p>Manage freelancer opportunities and approvals from the private HQ.</p><a className="aws-primary" href="/hq">Open CEO HQ →</a></div>;
 if(mode==="portal"&&role==="freelancer")return <div className="adva-hq-shell aws-waiting"><div className="aws-waiting-mark">A.</div><h1>Different door. Same ADVA.</h1><p>Freelancer workspaces are in the ADVA network.</p><a className="aws-primary" href="/network">Open network →</a></div>;
 if(mode==="network"&&role==="client")return <div className="adva-hq-shell aws-waiting"><div className="aws-waiting-mark">A.</div><h1>Welcome to ADVA.</h1><p>Your client experience is in the project portal.</p><a href="/portal" className="aws-primary">Go to client portal →</a></div>;
 if(mode==="join"&&role==="ceo")return <div className="adva-hq-shell aws-waiting"><div className="aws-waiting-mark">A.</div><h1>ADVA team, ready.</h1><p>You're already the CEO. Manage freelancer profiles and recruitment from your workspace.</p><a className="aws-primary" href="/hq">Open HQ →</a></div>;
 const content=(tab)=>{
  if(role==="client"){if(tab==="calendar")return <WorkspaceCalendar ws={ws} isClient/>;if(tab==="strategy")return <WorkspaceStrategy ws={ws}/>;return <WorkspaceClient ws={ws}/>}
  if(tab==="inquiries"&&role==="ceo")return <WorkspaceInquiries ws={ws}/>;
  if(tab==="feedback"&&role==="ceo")return <WorkspaceFeedback ws={ws}/>;
  if(tab==="calendar")return <WorkspaceCalendar ws={ws}/>;
  if(tab==="strategy")return <WorkspaceStrategy ws={ws}/>;
  if(tab==="projects")return <WorkspaceProjects ws={ws}/>;
  if(tab==="finance"&&role==="ceo")return <WorkspaceFinance ws={ws}/>;
  if(tab==="network")return <WorkspaceNetwork ws={ws}/>;
  if(tab==="team"&&role==="ceo")return <TeamControl ws={ws}/>;
  return <Overview ws={ws} go={setSection}/>;
 };
 const go=tab=>{setSection(tab);setMenuOpen(false);window.scrollTo({top:0,behavior:"smooth"})};
 return <div className="adva-hq-shell aws-console">
  <aside className={"aws-sidebar"+(menuOpen?" open":"")}><div className="aws-sidebar-logo"><a href="/"><img src="/adva-logo.webp" alt="ADVA"/></a><span>WORKSPACE</span></div><p className="aws-sidebar-eyebrow">Menu</p><nav aria-label="Workspace menu">{nav.map(([id,label])=><button type="button" key={id} onClick={()=>go(id)} aria-current={section===id?"page":undefined} className={section===id?"active":""}><span className="aws-nav-icon"><AdvaIcon name={navIcons[id]||"grid"} size={18}/></span><span className="aws-nav-label">{label}</span><b><AdvaIcon name="arrow" size={13}/></b></button>)}</nav><div className="aws-sidebar-bottom"><span className="aws-sidebar-status"><i/> SECURE WORKSPACE</span><div><strong>{user?.email||"Verified account"}</strong><small>{greeting}</small></div><button onClick={()=>db?.auth.signOut()} type="button">Sign out →</button></div></aside>
  <div className="aws-main">
   <header className="aws-topbar"><button type="button" className="aws-mobile-toggle" aria-label={menuOpen?"Close workspace menu":"Open workspace menu"} aria-expanded={menuOpen} onClick={()=>setMenuOpen(v=>!v)}><AdvaIcon name={menuOpen?"close":"menu"} size={19}/></button><span className="aws-topbar-path">ADVA <span className="aws-topbar-divider">/</span> {nav.find(x=>x[0]===section)?.[1]||"Workspace"}</span><div><span className="aws-topbar-role">{greeting}</span><button type="button" onClick={refresh} disabled={loading} className="aws-topbar-refresh" aria-label="Refresh data"><AdvaIcon name="refresh" size={17}/></button><a href="/" target="_blank" rel="noopener noreferrer" className="aws-topbar-site">View site <AdvaIcon name="up" size={14}/></a></div></header>
   {error&&<div className="aws-feedback">{error}</div>}
   {loading&&<div className="aws-loading-bar"><i/></div>}
   <main className="aws-body">{content(section)}</main>
  </div>
  {menuOpen&&<button className="aws-mobile-scrim" aria-label="Close navigation" onClick={()=>setMenuOpen(false)}/>}
 </div>;
}