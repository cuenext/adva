"use client";
import {useMemo,useState} from "react";
import AdvaIcon from "./AdvaIcon";
const todayMonth=()=>new Date(Date.now()+4*3600000).toISOString().slice(0,7);
const money=(n,c)=>new Intl.NumberFormat("en-AE",{style:"currency",currency:c,maximumFractionDigits:2}).format(Number(n)||0);
function periods(start,end){
 if(!/^\d{4}-\d{2}$/.test(start)||!/^\d{4}-\d{2}$/.test(end)||end<start)return [];
 const [y,m]=start.split("-").map(Number),result=[];
 for(let i=0;i<36;i++){
  const d=new Date(Date.UTC(y,m-1+i,1));
  const val=d.toISOString().slice(0,7);
  if(val>end)break;
  result.push(val);
 }
 return result;
}
export default function FinanceSchedule({ws,currency="AED",onClose}){
 const {db,data,refresh}=ws;
 const [projectId,setProjectId]=useState(data.projects[0]?.id||"");
 const [plan,setPlan]=useState("Monthly ADVA services"),[from,setFrom]=useState(todayMonth()),[to,setTo]=useState(todayMonth());
 const [amount,setAmount]=useState(""),[note,setNote]=useState("");
 const [busy,setBusy]=useState(false),[error,setError]=useState("");
 const months=useMemo(()=>periods(from,to),[from,to]);
 const duplicate=months.some(m=>data.finance.some(f=>f.project_id===projectId&&f.service_plan===plan.trim()&&f.month?.startsWith(m)));
 async function submit(e){
  e.preventDefault();setError("");
  const fee=Number(amount);
  if(!projectId||!plan.trim()||months.length===0||!Number.isFinite(fee)||fee<=0||fee!==Math.round(fee*100)/100){setError("Choose a client, valid date range and positive monthly fee.");return}
  if(duplicate){setError("One or more months already have this service plan. Edit those records rather than overwriting their payment history.");return}
  if(months.length===36&&months[35]<to){setError("Maximum schedule length is 36 months.");return}
  setBusy(true);
  const rows=months.map(m=>({project_id:projectId,service_plan:plan.trim(),month:m+"-01",currency,amount_due:fee,payment_note:note.trim()}));
  try{const {error:err}=await db.from("adva_monthly_finances").insert(rows);if(err)throw err;refresh();onClose()}
  catch(e){setError(e.message||"The schedule could not be created.")}finally{setBusy(false)}
 }
 return <div className="aws-modal" role="dialog" aria-modal="true" aria-label="Create multi-month billing schedule">
  <button className="aws-backdrop" aria-label="Close contract schedule" onClick={onClose}/>
  <form className="aws-modal-card" onSubmit={submit}><header><div><span>CEO / MULTI-MONTH BILLING</span><h2>Plan recurring months</h2></div><button type="button" onClick={onClose} aria-label="Close"><AdvaIcon name="close" size={17}/></button></header>
   <p className="aws-small-note">This creates a separate amount due for each month. It does not pretend future payments were received.</p>
   <label>Client project<select required value={projectId} onChange={e=>setProjectId(e.target.value)}><option value="">Choose project</option>{data.projects.map(p=><option key={p.id} value={p.id}>{p.client_name||p.name} · {p.name}</option>)}</select></label>
   <label>Service / agreement<input value={plan} onChange={e=>setPlan(e.target.value)} required maxLength={160} placeholder="Monthly content management"/></label>
   <div className="aws-form-pair"><label>First billing month<input type="month" required value={from} onChange={e=>setFrom(e.target.value)}/></label><label>Final billing month<input type="month" required value={to} min={from} onChange={e=>setTo(e.target.value)}/></label></div>
   <label>Amount due each month ({currency})<input type="number" min="0.01" step="0.01" required value={amount} onChange={e=>setAmount(e.target.value)}/></label>
   <label>Contract notes (private)<textarea rows={2} maxLength={1000} value={note} onChange={e=>setNote(e.target.value)} placeholder="Agreement, scope, milestones…"/></label>
   <div className="aws-form-summary"><span>{months.length} MONTH{months.length===1?"":"S"} · TOTAL CONTRACT VALUE</span><strong>{money(months.length*Number(amount||0),currency)}</strong></div>
   {duplicate&&<p className="aws-error" role="alert">A matching month already exists. Existing billing rows will never be silently replaced.</p>}
   {error&&<p className="aws-error" role="alert">{error}</p>}
   <button className="aws-primary" type="submit" disabled={busy||duplicate||!months.length}>{busy?"Saving…":"Create monthly schedule"} →</button>
  </form>
 </div>;
}
