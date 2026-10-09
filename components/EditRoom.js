"use client";
import {useId,useState} from "react";
import AdvaIcon from "./AdvaIcon";
const looks=[
 {id:"blue",name:"Blue hour",filter:"saturate(1.35) contrast(1.23) brightness(.9)"},
 {id:"warm",name:"Golden",filter:"sepia(.29) saturate(1.5) contrast(1.25) brightness(.94) hue-rotate(-17deg)"},
 {id:"mono",name:"Monochrome",filter:"grayscale(1) contrast(1.46) brightness(.92)"}
];
function Artwork({grade,animated}){
 const id=useId().replace(/:/g,""),u=k=>k+"-"+id;
 return <svg className={"adva-edit-art"+(animated?" is-animated":"")} viewBox="0 0 1000 580" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Original digital illustration of a monumental architectural set">
 <defs>
  <linearGradient id={u("bg")} x1="0" y1="0" x2=".9" y2="1"><stop stopColor="#69849b"/><stop offset=".48" stopColor="#2a3b52"/><stop offset="1" stopColor="#0b1b2e"/></linearGradient>
  <linearGradient id={u("floor")} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#3b5269"/><stop offset="1" stopColor="#081427"/></linearGradient>
  <radialGradient id={u("halo")}><stop stopColor="#d9f0ff" stopOpacity=".92"/><stop offset=".32" stopColor="#9bcff1" stopOpacity=".26"/><stop offset="1" stopColor="#699dce" stopOpacity="0"/></radialGradient>
  <filter id={u("blur")}><feGaussianBlur stdDeviation="20"/></filter>
 </defs>
 <rect width="1000" height="580" fill={"url(#"+u("bg")+")"}/>
 <path d="M0 0h1000v300H0Z" fill="#071426" opacity=".14"/>
 <path d="M0 0h425l-28 352L0 431Z" fill="#152234"/>
 <path d="M1000 0H694l-49 352 355 82Z" fill="#0d1b30"/>
 <path d="M425 0h269l-48 351-249 1Z" fill="#7895a8" opacity=".23"/>
 <path d="M0 0h425l-28 352L0 431M1000 0H694l-49 352 355 82" fill="none" stroke="#bed7e8" strokeOpacity=".24" strokeWidth="3"/>
 <path d="M500 53c-57 0-103 47-103 104v184h206V157c0-57-46-104-103-104Z" fill="#173451" stroke="#b8d5ea" strokeWidth="4" strokeOpacity=".7"/>
 <path d="M500 79c-42 0-77 35-77 78v154h154V157c0-43-35-78-77-78Z" fill="#10263d"/>
 <ellipse cx="501" cy="198" rx="178" ry="170" fill={"url(#"+u("halo")+")"} className="adva-edit-halo"/>
 <circle cx="500" cy="169" r="61" fill={"url(#"+u("halo")+")"}/>
 <circle cx="500" cy="169" r="34" fill="#c5e7f9" fillOpacity=".4" stroke="#d0ecff" strokeWidth="2"/>
 <circle cx="500" cy="169" r="13" fill="#e9f7ff" fillOpacity=".76"/>
 <path d="M500 53v289M398 168h205" stroke="#daefff" strokeOpacity=".35" strokeWidth="2"/>
 {Array.from({length:11},(_,i)=><path key={i} d={"M"+(i*46)+" 0v"+(333+i*2)} stroke="#c5e4f8" strokeOpacity={.04+(i%4)*.03} strokeWidth="2"/>)}
 <path d="M0 357 500 330 1000 357v223H0Z" fill={"url(#"+u("floor")+")"}/>
 <path d="M0 357 500 330l500 27" fill="none" stroke="#b5d8f3" strokeOpacity=".52" strokeWidth="3"/>
 {Array.from({length:11},(_,i)=><path key={i} d={"M500 331 "+(i*100)+" 580"} stroke="#d7e4ef" strokeOpacity=".10" strokeWidth="1.7"/>)}
 {[385,425,468,515,564].map((y,i)=><path key={y} d={"M0 "+y+" Q500 "+(350+i*28)+" 1000 "+y} stroke="#c9e9fc" strokeOpacity=".13" strokeWidth="1.5"/>)}
 <path d="M396 350h205l89 230H300Z" fill="#6fbef1" opacity=".032"/>
 <rect width="1000" height="580" fill="#01050e" opacity=".07"/>
 </svg>;
}
export default function EditRoom(){
 const [split,setSplit]=useState(53),[grade,setGrade]=useState("blue"),[animate,setAnimate]=useState(false);
 const current=looks.find(x=>x.id===grade)||looks[0];
 return <section className="adva-edit-room" id="edit-room" aria-labelledby="edit-room-heading"><div className="container">
  <div className="adva-v5-section-head"><div><span className="adva-v5-kicker">ADVA EDIT ROOM</span><h2 id="edit-room-heading">One frame.<br/><em>Three moods.</em></h2></div><p>Move the divider to compare the untreated illustration with a different visual treatment. Try another colour grade.</p></div>
  <div className="adva-edit-shell">
   <div className="adva-edit-menubar"><span><i/> FRAME STUDY 01</span><span>COMPARISON VIEW</span></div>
   <div className="adva-edit-preview" style={{"--cut":split+"%"}}>
    <div className="adva-edit-frame before"><Artwork animated={animate}/></div>
    <div className="adva-edit-frame after" style={{clipPath:"inset(0 "+(100-split)+"% 0 0)",filter:current.filter}}><Artwork animated={animate}/></div>
    <div className="adva-edit-splitline" style={{left:split+"%"}} aria-hidden="true"><span><AdvaIcon name="arrow" size={16}/><AdvaIcon name="arrow" size={16}/></span></div>
    <div className="adva-edit-label left">TREATED</div><div className="adva-edit-label right">ORIGINAL</div>
    <input type="range" className="adva-edit-input" min="0" max="100" value={split} onChange={e=>setSplit(Number(e.target.value))} aria-label="Before and after comparison position"/>
    <div className="adva-edit-cinema-bar top"/><div className="adva-edit-cinema-bar bottom"/>
   </div>
   <div className="adva-edit-controls"><div className="adva-edit-control-caption">COLOUR TREATMENT</div><div className="adva-edit-grades" role="group" aria-label="Select colour treatment">{looks.map(x=><button type="button" key={x.id} aria-pressed={grade===x.id} onClick={()=>setGrade(x.id)} className={grade===x.id?"selected":""}>{x.name}</button>)}</div><button className="adva-edit-play" type="button" onClick={()=>setAnimate(v=>!v)} aria-pressed={animate}><AdvaIcon name={animate?"pause":"play"} size={17}/>{animate?"Pause":"Animate light"}</button></div>
   <div className="adva-edit-timeline" aria-hidden="true"><span>00:00</span><div><i className={animate?"playing":""}/>{Array.from({length:18},(_,i)=><b key={i}/>)}</div><span>00:18</span></div>
  </div>
  <div className="adva-edit-caption"><p>Original interactive illustration made for this demonstration — not real client footage or a production colour grade.</p><a href="/services/video-editing">Video editing <AdvaIcon name="up" size={16}/></a></div>
 </div></section>;
}
