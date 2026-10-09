"use client";
import {useMemo,useState} from "react";
import {NETWORKS,network,display12} from "../lib/posting-times";
function Arrow(){return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>}
export default function PostingGuide({projectName="Example account",onUseSlot,mode="private"}){
 const [selected,setSelected]=useState("instagram");
 const [current,setCurrent]=useState(0);
 const chosen=useMemo(()=>network(selected),[selected]),slots=chosen.slots;
 const pick=idx=>setCurrent(Math.min(idx,slots.length-1));
 return <section className="adva-posting-guide">
  <div className="apg-top"><div className="apg-kicker"><i/> ADVA SIGNALS <span>/</span> CONTENT INTELLIGENCE</div><span className="apg-timezone">UAE TIME · ASIA/DUBAI · UTC+4</span></div>
  <div className="apg-heading"><div><h2>Timing is a tool.<br/><em>Not a guessing game.</em></h2><p>{projectName} · platform-specific posting windows to test and refine.</p></div><div className="apg-orbit" aria-hidden="true"><span>✳</span><i/><b>ADVA</b></div></div>
  <div className="apg-panel">
   <div className="apg-filter"><label htmlFor="apg-network">CHANNEL / SELECT PLATFORM</label><div className="apg-select-wrap"><select id="apg-network" value={selected} onChange={e=>{setSelected(e.target.value);setCurrent(0)}}>{NETWORKS.map(n=><option key={n.id} value={n.id}>{n.label}</option>)}</select><span aria-hidden="true">⌄</span></div></div>
   <div className="apg-content">
    <div className="apg-highlight"><span className="apg-highlight-kicker">01 / SUGGESTED TEST SLOT</span><div className="apg-highlight-day">{slots[current].day}</div><div className="apg-highlight-hour">{display12(slots[current].hour)}<span>UAE</span></div><h3>{slots[current].name}</h3><p>{slots[current].description}</p>{onUseSlot?<button className="apg-cta" type="button" onClick={()=>onUseSlot({platform:selected,...slots[current]})}>Plan content for this slot <Arrow/></button>:mode==="preview"?<a className="apg-cta" href="/enter">Explore ADVA workspaces <Arrow/></a>:<span className="apg-readonly-note">Only the ADVA project team can schedule content.</span>}</div>
    <div className="apg-options"><div className="apg-options-head"><span>RECOMMENDED WINDOWS</span><span>RESEARCH-BASED</span></div>{slots.map((slot,i)=><button key={selected+"-"+i} type="button" onClick={()=>pick(i)} aria-pressed={i===current} className={"apg-option"+(i===current?" active":"")}><span className="apg-option-num">0{i+1}</span><span className="apg-option-name"><strong>{slot.day}</strong><small>{slot.name}</small></span><span className="apg-option-time">{display12(slot.hour)}</span><span className="apg-option-arrow" aria-hidden="true">↗</span></button>)}<div className="apg-source"><span>WHY THESE WINDOWS?</span><p>{chosen.hint}. These are industry and platform-wide benchmarks, not connected follower analytics for {projectName}.</p><a href={chosen.url} target="_blank" rel="noopener noreferrer">Review the source ↗</a></div></div>
   </div>
  </div>
  <p className="apg-note">The best time for a specific account may be different. As we collect actual reach and engagement from connected accounts, ADVA should replace these test windows with client-specific recommendations. Marking a post “Posted” records work completion; it does not itself publish to social media.</p>
 </section>;
}