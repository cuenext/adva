"use client";
import {useMemo,useState} from "react";
import AdvaIcon from "./AdvaIcon";

const cash=(n,c="AED")=>new Intl.NumberFormat("en-AE",{style:"currency",currency:c,maximumFractionDigits:2}).format(Number(n)||0);
const displayDate=r=>{
 if(r.received_at)return new Date(r.received_at).toLocaleString("en-GB",{timeZone:"Asia/Dubai",day:"numeric",month:"short",year:"numeric",hour:"numeric",minute:"2-digit",hour12:true})+" UAE";
 if(r.received_on)return new Date(r.received_on+"T12:00:00Z").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"});
 return "Date not provided";
};
const monthLabel=m=>m?new Date(m.slice(0,7)+"-01T12:00:00Z").toLocaleDateString("en-GB",{month:"short",year:"numeric",timeZone:"UTC"}):"";

export function FinanceReceiptForm({ws,currency="AED",onClose}){
 const {db,data,refresh}=ws;
 const [projectId,setProjectId]=useState(data.projects?.[0]?.id||"");
 const [paidOn,setPaidOn]=useState("");
 const [paidTime,setPaidTime]=useState("");
 const [method,setMethod]=useState("unspecified");
 const [note,setNote]=useState("");
 const [amounts,setAmounts]=useState({});
 const [busy,setBusy]=useState(false),[error,setError]=useState("");
 const lines=useMemo(()=>data.finance.filter(f=>f.project_id===projectId&&f.currency===currency&&Number(f.amount_due)>Number(f.amount_paid)).sort((a,b)=>a.month.localeCompare(b.month)),[data.finance,projectId,currency]);
 const alloc=lines.map(f=>({finance_id:f.id,amount:Math.round(Number(amounts[f.id]||0)*100)/100})).filter(x=>x.amount>0);
 const total=Math.round(alloc.reduce((n,a)=>n+a.amount,0)*100)/100;
 const invalid=lines.some(f=>Number(amounts[f.id]||0)>Math.round((Number(f.amount_due)-Number(f.amount_paid))*100)/100);
 async function submit(e){
  e.preventDefault();setError("");
  if(!projectId||!total||invalid){setError("Choose at least one outstanding service and keep allocations within the remaining amount.");return}
  if(paidTime&&!paidOn){setError("Choose a date before entering the receipt time.");return}
  setBusy(true);
  try{
   const {error:err}=await db.rpc("adva_record_receipt",{
    p_project_id:projectId,p_currency:currency,p_amount:total,p_allocations:alloc,
    p_received_on:paidOn||null,p_received_at:paidOn&&paidTime?paidOn+"T"+paidTime+":00+04:00":null,
    p_method:method,p_note:note.trim()
   });
   if(err)throw err;
   refresh();onClose();
  }catch(e){setError(e.message||"Could not record this receipt.")}finally{setBusy(false)}
 }
 return <div className="aws-modal" role="dialog" aria-modal="true" aria-label="Record a payment">
  <button className="aws-backdrop" aria-label="Close payment form" onClick={onClose}/>
  <form className="aws-modal-card aws-receipt-modal" onSubmit={submit}>
   <header><div><span>CEO / PAYMENT LEDGER</span><h2>Record a receipt</h2></div><button type="button" onClick={onClose} aria-label="Close"><AdvaIcon name="close" size={17}/></button></header>
   <p className="aws-small-note">Record what actually arrived. Divide one receipt across several months or services without counting it twice.</p>
   <label>Client / project<select value={projectId} required onChange={e=>{setProjectId(e.target.value);setAmounts({})}}><option value="">Choose a project</option>{data.projects.map(p=><option value={p.id} key={p.id}>{p.client_name||p.name} · {p.name}</option>)}</select></label>
   <div className="aws-form-pair">
    <label>Date received (optional)<input type="date" value={paidOn} onChange={e=>setPaidOn(e.target.value)}/></label>
    <label>UAE time (optional)<input type="time" value={paidTime} disabled={!paidOn} onChange={e=>setPaidTime(e.target.value)}/></label>
   </div>
   <label>Payment method<select value={method} onChange={e=>setMethod(e.target.value)}><option value="unspecified">Not specified</option><option value="bank_transfer">Bank transfer</option><option value="cash">Cash</option><option value="card">Card</option><option value="other">Other</option></select></label>
   <div className="aws-receipt-allocate"><strong>Allocate against unpaid services</strong>
    {lines.length?lines.map(f=><label key={f.id} className="aws-receipt-allocation-row"><span><b>{monthLabel(f.month)} · {f.service_plan}</b><small>Outstanding {cash(Number(f.amount_due)-Number(f.amount_paid),f.currency)}</small></span><input type="number" min="0" step="0.01" max={Math.max(0,Number(f.amount_due)-Number(f.amount_paid))} placeholder="0.00" value={amounts[f.id]??""} onChange={e=>setAmounts(v=>({...v,[f.id]:e.target.value}))}/></label>):<div className="aws-empty"><p>No outstanding items for this client. Add a billing entry or multi-month schedule first.</p></div>}
   </div>
   <label>Private notes<textarea rows={2} maxLength={1600} value={note} onChange={e=>setNote(e.target.value)} placeholder="Installment, payment reference, or details…"/></label>
   <div className="aws-form-summary"><span>RECEIPT TOTAL</span><strong>{cash(total,currency)}</strong></div>
   {error&&<p className="aws-error" role="alert">{error}</p>}
   <button type="submit" className="aws-primary" disabled={busy||total<=0||invalid}>{busy?"Saving…":"Record received payment"} →</button>
  </form>
 </div>;
}

export function FinanceReceiptHistory({ws,currency="AED"}){
 const {db,data,refresh}=ws;
 const [busy,setBusy]=useState(""),[error,setError]=useState("");
 const receipts=[...(data.receipts||[])].filter(r=>r.currency===currency).sort((a,b)=>String(b.received_at||b.received_on||b.created_at).localeCompare(String(a.received_at||a.received_on||a.created_at)));
 const allInvoices=new Map((data.finance||[]).map(f=>[f.id,f]));
 const projectName=id=>{const p=data.projects.find(x=>x.id===id);return p?((p.client_name||p.name)+" · "+p.name):"Private project"};
 async function voidReceipt(r){
  const reason=window.prompt("Reason for voiding this payment? The receipt will stay in the audit history.");
  if(reason===null)return;
  if(!reason.trim()||reason.trim().length<4){setError("A reason of at least 4 characters is required.");return}
  if(!window.confirm("Void the "+cash(r.amount,r.currency)+" receipt? Its allocations will no longer count as paid."))return;
  setBusy(r.id);setError("");
  try{const {error:err}=await db.rpc("adva_void_receipt",{p_receipt_id:r.id,p_reason:reason.trim()});if(err)throw err;refresh()}
  catch(e){setError(e.message||"Could not void the receipt.")}finally{setBusy("")}
 }
 const totals=receipts.filter(x=>x.status==="posted");
 const withDate=totals.filter(x=>x.received_on);
 return <div className="aws-panel aws-receipts-panel">
  <div className="aws-panel-title"><div><span>REAL PAYMENTS / NOT JUST BILLING MONTHS</span><h2>Receipt history.</h2></div><span>{totals.length} PAYMENT{totals.length===1?"":"S"}</span></div>
  <p className="aws-small-note">{cash(totals.reduce((n,x)=>n+Number(x.amount),0),currency)} actually reported received. {totals.length-withDate.length} payment{totals.length-withDate.length===1?" has":"s have"} no exact receipt date yet — they are never assigned a made-up date.</p>
  {error&&<p className="aws-error" role="alert">{error}</p>}
  {receipts.length?<div className="aws-receipt-list">{receipts.map(r=>{
   const items=(data.receiptAllocations||[]).filter(x=>x.receipt_id===r.id).map(a=>({a,invoice:allInvoices.get(a.finance_id)}));
   return <article className={"aws-receipt-record"+(r.status==="void"?" is-void":"")} key={r.id}>
    <div className="aws-receipt-record-top"><div><strong>{projectName(r.project_id)}</strong><small>{displayDate(r)} · {r.method==="unspecified"?"Method not specified":r.method.replace(/_/g," ")}</small></div><b>{cash(r.amount,r.currency)}</b></div>
    <div className="aws-receipt-line-items">{items.map(({a,invoice},i)=><div key={i}><span>{invoice?monthLabel(invoice.month)+" · "+invoice.service_plan:"Deleted billing item"}</span><strong>{cash(a.amount,r.currency)}</strong></div>)}</div>
    {r.note&&<p>{r.note}</p>}
    <div className="aws-receipt-record-footer">{r.status==="void"?<span className="aws-receipt-voided">Voided · {r.void_reason}</span>:<span>Recorded receipt</span>}{r.status==="posted"&&<button type="button" className="aws-text-button" disabled={!!busy} onClick={()=>voidReceipt(r)}>{busy===r.id?"Voiding…":"Void with reason"}</button>}</div>
   </article>;
  })}</div>:<div className="aws-empty"><p>No receipts in {currency} yet. Use Record payment to add the first one.</p></div>}
 </div>;
}
