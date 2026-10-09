"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import AdvaIcon,{AdvaMark} from "./AdvaIcon";
const BUCKET="adva-freelancer-portfolio";
const ACCEPT=new Set(["image/jpeg","image/png","image/webp","video/mp4","video/quicktime","application/pdf"]);
const MAX=25*1024*1024;
function readable(bytes){return bytes<1024*1024?Math.round(bytes/1024)+" KB":(bytes/1024/1024).toFixed(1)+" MB"}
const isImage=mime=>mime?.startsWith("image/");
const isVideo=mime=>mime?.startsWith("video/");
export default function PortfolioMedia({db,ownerId,canUpload=false,title="Selected work"}){
 const [files,setFiles]=useState([]),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState(""),[success,setSuccess]=useState(""),[view,setView]=useState(null);
 const input=useRef(null);
 const load=useCallback(async()=>{
  if(!db||!ownerId)return;
  setLoading(true);setError("");
  try{
   const {data,error}=await db.storage.from(BUCKET).list(ownerId,{limit:50,sortBy:{column:"created_at",order:"desc"}});
   if(error)throw error;
   const results=(data??[]).filter(f=>f.id&&f.name).slice(0,24);
   const signed=await Promise.all(results.map(async f=>{
    const path=ownerId+"/"+f.name;
    const {data:link}=await db.storage.from(BUCKET).createSignedUrl(path,60*30);
    const mime=f.metadata?.mimetype||f.metadata?.contentType||"";
    return {name:f.name,path,url:link?.signedUrl||null,mime,size:Number(f.metadata?.size)||0,created_at:f.created_at||""};
   }));
   setFiles(signed);
  }catch(e){setError(e.message||"The portfolio couldn't be loaded.")}finally{setLoading(false)}
 },[db,ownerId]);
 useEffect(()=>{load()},[load]);
 async function upload(event){
  const file=event.target.files?.[0];if(event.target)event.target.value="";
  if(!file||!canUpload||!ownerId)return;
  setError("");setSuccess("");
  if(!ACCEPT.has(file.type)){setError("Supported: JPG, PNG, WebP, MP4, MOV or PDF.");return}
  if(file.size>MAX){setError("The maximum per file is 25 MB. Export a short, compressed showreel or link to a full-resolution master.");return}
  if(files.length>=24){setError("Your gallery is full. You can keep up to 24 selected files.");return}
  const suffix=file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g,"")||"bin";
  const path=ownerId+"/"+crypto.randomUUID()+"."+suffix;
  setSaving(true);
  try{
   const result=await db.storage.from(BUCKET).upload(path,file,{contentType:file.type,upsert:false,cacheControl:"3600"});
   if(result.error)throw result.error;
   setSuccess("Work uploaded privately. ADVA can review it inside the network.");
   await load();
  }catch(e){setError(e.message||"Upload failed. Try a smaller file.")}finally{setSaving(false)}
 }
 async function remove(file){
  if(!canUpload||!window.confirm("Remove this file from your ADVA portfolio?"))return;
  setSaving(true);setError("");
  try{
   const {error}=await db.storage.from(BUCKET).remove([file.path]);if(error)throw error;
   setSuccess("File removed from your portfolio.");await load();
  }catch(e){setError(e.message||"Couldn't remove file.")}finally{setSaving(false)}
 }
 return <section className="aws-portfolio-media">
  <div className="aws-portfolio-heading"><div><span className="aws-eyebrow"><i/> CREATIVE ARCHIVE / PRIVATE</span><h3>{title}</h3><p>{canUpload?"Choose the work that represents you. Files stay private to you and ADVA, or to approved network members after NDA access.":"Portfolio media visible only to ADVA staff and authorized creators."}</p></div>
   {canUpload&&<><input ref={input} type="file" accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.pdf" style={{display:"none"}} onChange={upload}/><button className="aws-outline" type="button" disabled={saving} onClick={()=>input.current?.click()}>{saving?"Uploading…":"+ Add work"} →</button></>}
  </div>
  {error&&<div className="aws-error" role="alert">{error}</div>}{success&&<div className="aws-feedback" role="status">{success}</div>}
  {loading?<p className="aws-small-note">Loading private work…</p>:files.length?<div className="aws-media-grid">{files.map((f,i)=><article key={f.path} className="aws-media-item">
   <button className="aws-media-preview" type="button" onClick={()=>setView(f)} aria-label={"Preview portfolio item "+(i+1)}>
    {isImage(f.mime)&&f.url?<img src={f.url} alt={"Portfolio item "+(i+1)} loading="lazy"/>:isVideo(f.mime)?<span className="aws-media-video-icon"><AdvaIcon name="play" size={34}/></span>:<span className="aws-media-pdf-icon">PDF</span>}
    <span className="aws-media-hover" aria-hidden="true">VIEW →</span>
   </button>
   <div className="aws-media-meta"><span>{isVideo(f.mime)?"VIDEO":isImage(f.mime)?"IMAGE":"DOCUMENT"} / {readable(f.size)}</span>{canUpload&&<button type="button" disabled={saving} onClick={()=>remove(f)}>Remove</button>}</div>
  </article>)}</div>:<div className="aws-portfolio-empty"><span><AdvaMark size={33}/></span><strong>Every portfolio starts with one strong piece.</strong><p>{canUpload?"Upload a cover image, short edited film or selected PDF — whatever makes your craft visible.":"No portfolio media has been uploaded yet."}</p></div>}
  {canUpload&&<p className="aws-small-note">Up to 24 files, 25 MB each. Videos should be compressed previews. Keep original full-resolution footage in your own archive. Upload only media you own or have permission to showcase. Private links expire after 30 minutes.</p>}
  {view&&<div className="aws-modal"><button type="button" className="aws-backdrop" onClick={()=>setView(null)} aria-label="Close portfolio preview"/><div className="aws-modal-card aws-media-modal"><header><div><span>CREATIVE ARCHIVE / PREVIEW</span><h2>Selected work.</h2></div><button type="button" onClick={()=>setView(null)}><AdvaIcon name="close" size={17}/></button></header>{view.url&&(isImage(view.mime)?<img src={view.url} alt="Selected portfolio work"/>:isVideo(view.mime)?<video src={view.url} controls playsInline preload="metadata"/>:<a href={view.url} target="_blank" rel="noopener noreferrer" className="aws-primary">Open PDF →</a>)}<p>Private portfolio preview · {readable(view.size)}</p></div></div>}
 </section>;
}