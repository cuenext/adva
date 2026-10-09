"use client";
import {useEffect,useMemo,useState} from "react";
const emptyProject={name:"",client_name:"",description:"",status:"active"};
function userLabel(user,profiles){const p=profiles.find(x=>x.user_id===user);return p?.display_name||user.slice(0,8)+"…"}
export default function WorkspaceProjects({ws}){
 const {db,role,data,refresh}=ws,isCEO=role==="ceo";
 const [selected,setSelected]=useState(""),[creating,setCreating]=useState(false),[newProject,setNewProject]=useState({...emptyProject});
 const [assignUser,setAssignUser]=useState(""),[responsibility,setResponsibility]=useState("Content producer"),[clientEmail,setClientEmail]=useState("");
 const [contract,setContract]=useState({starts_on:"",ends_on:"",contracted_deliverables:"",client_visible:true});
 const [busy,setBusy]=useState(false),[notice,setNotice]=useState("");
 const projects=data.projects||[];
 useEffect(()=>{if(projects.length&&(!selected||!projects.some(p=>p.id===selected)))setSelected((projects.find(x=>x.slug==="silwadi")||projects[0]).id)},[projects,selected]);
 const project=projects.find(x=>x.id===selected),members=data.members.filter(a=>a.project_id===selected),clients=data.clients.filter(c=>c.project_id===selected);
 const signedContract=data.contracts.find(c=>c.project_id===selected);
 const activeNda=data.ndas.find(n=>n.active&&n.legal_reviewed);
 const ndaSignedIds=new Set(data.ndaAcceptances.filter(a=>a.nda_id===activeNda?.id).map(a=>a.user_id));
 const eligibleCreators=data.freelancers.filter(f=>ndaSignedIds.has(f.user_id));
 useEffect(()=>{if(signedContract)setContract({starts_on:signedContract.starts_on||"",ends_on:signedContract.ends_on||"",contracted_deliverables:signedContract.contracted_deliverables||"",client_visible:!!signedContract.client_visible});else setContract({starts_on:"",ends_on:"",contracted_deliverables:"",client_visible:true})},[selected,signedContract?.id,signedContract?.starts_on,signedContract?.ends_on,signedContract?.contracted_deliverables,signedContract?.client_visible]);
 const scopedContent=data.content.filter(p=>p.project_id===selected);
 const posted=scopedContent.filter(p=>p.status==="posted").length,scheduled=scopedContent.filter(p=>p.status==="scheduled").length;
 const handle=async(op)=>{
  setBusy(true);setNotice("");
  try{const response=await op();if(response.error)throw response.error;setNotice("Saved successfully.");refresh();return true}catch(e){setNotice(e.message||"Couldn't save changes.");return false}finally{setBusy(false)}
 };
 async function addProject(e){
  e.preventDefault();
  const slug=newProject.name.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,72)+"-"+crypto.randomUUID().slice(0,6);
  const ok=await handle(()=>db.from("adva_projects").insert({...newProject,slug}));
  if(ok){setCreating(false);setNewProject({...emptyProject})}
 }
 async function assign(e){
  e.preventDefault();if(!project||!assignUser)return;
  const ok=await handle(()=>db.from("adva_project_members").upsert({project_id:selected,user_id:assignUser,responsibility:responsibility.trim()||"Contributor"}));
  if(ok){setAssignUser("");setResponsibility("Content producer")}
 }
 async function revoke(uid){
  if(!window.confirm("Remove this freelancer from the project's access list?"))return;
  await handle(()=>db.from("adva_project_members").delete().eq("project_id",selected).eq("user_id",uid));
 }
 async function addClient(e){
  e.preventDefault();
  if(!clientEmail.trim())return;
  setBusy(true);setNotice("");
  try{
   const {data:userId,error:err}=await db.rpc("adva_verified_user_id",{p_email:clientEmail.trim()});
   if(err)throw err;
   if(!userId)throw new Error("No verified account found with that email. The client should first verify their email through /portal.");
   const response=await db.from("adva_project_clients").upsert({project_id:selected,user_id:userId});
   if(response.error)throw response.error;
   setNotice("Verified client account linked to this project.");setClientEmail("");refresh();
  }catch(e){setNotice(e.message||"Unable to link client.")}finally{setBusy(false)}
 }
 async function saveContract(e){
  e.preventDefault();await handle(()=>db.from("adva_contracts").upsert({project_id:selected,starts_on:contract.starts_on||null,ends_on:contract.ends_on||null,contracted_deliverables:contract.contracted_deliverables,client_visible:contract.client_visible},{onConflict:"project_id"}));
 }
 async function removeClient(uid){
  if(!window.confirm("Remove this client's access to the project?"))return;
  await handle(()=>db.from("adva_project_clients").delete().eq("project_id",selected).eq("user_id",uid));
 }
 return <div className="aws-module aws-projects">
  <div className="aws-page-heading"><div><span className="aws-eyebrow"><i/> ADVA / PROJECT CONTROL</span><h1>Projects, connected.</h1><p>One place for content schedules, freelancers, client access and contract dates.</p></div>{isCEO&&<button className="aws-primary aws-compact" onClick={()=>setCreating(true)}>+ New project</button>}</div>
  {notice&&<div className="aws-feedback">{notice}<button onClick={()=>setNotice("")}>×</button></div>}
  {projects.length?<><div className="aws-toolbar"><label>CHOOSE PROJECT<select value={selected} onChange={e=>setSelected(e.target.value)}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><span className="aws-pill">{project?.status||"active"}</span></div>
  <div className="aws-project-hero"><div><span>PROJECT / {project?.slug?.toUpperCase()}</span><h2>{project?.name}</h2><p>{project?.description||"A connected ADVA project workspace."}</p></div><div><strong>{posted}</strong><span>POSTED ITEMS</span><strong>{scheduled}</strong><span>UPCOMING CONTENT</span></div></div>
  <div className="aws-project-grid">
   <div className="aws-panel"><div className="aws-panel-title"><div><span>TEAM / ASSIGNMENTS</span><h2>Who's on this?</h2></div><span>{members.length} ASSIGNED</span></div>
    {members.length?<div className="aws-members">{members.map(m=><div key={m.user_id}><span className="aws-avatar">{userLabel(m.user_id,data.freelancers).slice(0,1).toUpperCase()}</span><div><strong>{userLabel(m.user_id,data.freelancers)}</strong><small>{m.responsibility}</small></div>{isCEO&&<button onClick={()=>revoke(m.user_id)} aria-label="Remove freelancer">Remove</button>}</div>)}</div>:<div className="aws-empty"><p>No freelancers assigned yet. They won't see this project until you grant access.</p></div>}
    {isCEO&&<form className="aws-project-inline" onSubmit={assign}><label>Assign a verified freelancer<select required value={assignUser} onChange={e=>setAssignUser(e.target.value)}><option value="">Choose freelancer</option>{eligibleCreators.map(f=><option value={f.user_id} key={f.user_id}>{f.display_name} / {f.specialty}</option>)}</select></label>{eligibleCreators.length===0&&<p className="aws-small-note">Freelancers become assignable after a legally reviewed ADVA NDA is activated and accepted. {activeNda?"No eligible freelancer has signed yet.":"No reviewed NDA is active yet."}</p>}<label>Responsibility<input value={responsibility} maxLength={120} onChange={e=>setResponsibility(e.target.value)} placeholder="Editor / content manager"/></label><button disabled={busy||!assignUser} type="submit" className="aws-outline">Grant access ↗</button></form>}
   </div>
   <div className="aws-panel"><div className="aws-panel-title"><div><span>CLIENT VISIBILITY</span><h2>Client portal access</h2></div><span>{clients.length} LINKED</span></div>
     {clients.length?<div className="aws-members">{clients.map(c=><div key={c.user_id}><span className="aws-avatar">C</span><div><strong>Verified client</strong><small>Account {c.user_id.slice(0,8)}…</small></div>{isCEO&&<button onClick={()=>removeClient(c.user_id)}>Remove</button>}</div>)}</div>:<div className="aws-empty"><p>No client account connected yet. Content and reporting remain private.</p></div>}
     {isCEO&&<form className="aws-project-inline" onSubmit={addClient}><label>Link an existing verified email<input type="email" required value={clientEmail} onChange={e=>setClientEmail(e.target.value)} placeholder="client@company.com"/></label><button className="aws-outline" type="submit" disabled={busy}>Link to this project ↗</button><small>Clients verify their account through /portal before you link them.</small></form>}
   </div>
  </div>
  <div className="aws-panel aws-contract-panel"><div className="aws-panel-title"><div><span>AGREEMENT / DURATION</span><h2>Project agreement</h2></div><span>{signedContract?"RECORDED":"NOT SET"}</span></div>
   {isCEO?<form className="aws-project-inline aws-contract-form" onSubmit={saveContract}><div className="aws-form-pair"><label>Contract starts<input type="date" value={contract.starts_on} onChange={e=>setContract({...contract,starts_on:e.target.value})}/></label><label>Contract ends<input type="date" value={contract.ends_on} min={contract.starts_on||undefined} onChange={e=>setContract({...contract,ends_on:e.target.value})}/></label></div><label>Contracted deliverables<textarea maxLength={3000} rows={3} value={contract.contracted_deliverables} onChange={e=>setContract({...contract,contracted_deliverables:e.target.value})} placeholder="Monthly creative and content scope, revision allowance…"/></label><label className="aws-check"><input type="checkbox" checked={contract.client_visible} onChange={e=>setContract({...contract,client_visible:e.target.checked})}/> Show duration and deliverables in the client's portal</label><button disabled={busy} type="submit" className="aws-primary aws-compact">Save agreement details ↗</button></form>:<div className="aws-empty"><p>{signedContract?("Duration: "+(signedContract.starts_on||"Not set")+" → "+(signedContract.ends_on||"Ongoing")):"ADVA has not entered contract dates yet."}</p></div>}
  </div>
  </>:<div className="aws-empty"><strong>No projects yet.</strong><p>{isCEO?"Create your first project to start scheduling work and assigning people.":"ADVA hasn't assigned a project to this account."}</p></div>}
  {creating&&<div className="aws-modal"><button className="aws-backdrop" aria-label="Close new project" onClick={()=>setCreating(false)}/><form className="aws-modal-card" onSubmit={addProject}><header><div><span>NEW / PROJECT</span><h2>Bring a project to life.</h2></div><button type="button" onClick={()=>setCreating(false)}>×</button></header><label>Project name<input required minLength={2} maxLength={160} value={newProject.name} onChange={e=>setNewProject({...newProject,name:e.target.value})} placeholder="Brand or project name"/></label><label>Client name<input maxLength={180} value={newProject.client_name} onChange={e=>setNewProject({...newProject,client_name:e.target.value})} placeholder="Client or business"/></label><label>Description<textarea rows={4} maxLength={1600} value={newProject.description} onChange={e=>setNewProject({...newProject,description:e.target.value})} placeholder="What is the project about?"/></label><button className="aws-primary" disabled={busy}>Create private project ↗</button></form></div>}
 </div>;
}