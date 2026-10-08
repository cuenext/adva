"use client";
import {useEffect,useRef,useState,useMemo} from "react";

const suggestions=[
{title:"Brand & digital transformation",keys:["brand","rebrand","logo","website","web","identity","clinic","dental","refresh"],service:"branding",project:"Branding & Design",desc:"Identity, digital experiences and content systems that bring everything together."},
{title:"Events & exhibition production",keys:["exhibition","event","conference","booth","expo","exhibit","fair","adihex","launch"],service:"event-coverage",project:"Event Coverage",desc:"Photography, films, interviews and social coverage for live brand moments."},
{title:"Content & social",keys:["social","tiktok","reels","instagram","content","campaign","creator","marketing"],service:"social-media-management",project:"Social Media Management",desc:"Thoughtful, audience-first content from strategy to the final edit."},
{title:"Film & photography",keys:["film","video","photo","shoot","interview","edit","production"],service:"event-coverage",project:"Event Coverage",desc:"Brand films and visual storytelling for the moments worth capturing."},
{title:"Technology & on-ground stories",keys:["technology","tech","industry","manufacturer","umex","industrial"],service:"event-coverage",project:"Event Coverage",desc:"Complex ideas transformed into clear, compelling exhibition content."}
];
const prompts=["I need creative coverage for a three-day exhibition","We need to rebrand and launch a new website","We want to make content people actually watch","I'm planning a brand campaign in Abu Dhabi"];
function match(q){const t=q.toLowerCase();const items=suggestions.map((s,i)=>({...s,score:s.keys.reduce((n,k)=>n+(t.includes(k)?1:0),0)-i*.001})).sort((a,b)=>b.score-a.score);return items[0].score>0?items.slice(0,2):[suggestions[0],suggestions[1]]}
function Arrow(){return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 10h14m-6-6 6 6-6 6"/></svg>}
function Up(){return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 16 16 4M6 4h10v10"/></svg>}
export default function CinematicHero(){
 const root=useRef(null),orb=useRef(null),input=useRef(null),chatBox=useRef(null);
 const [query,setQuery]=useState(""),[prompt,setPrompt]=useState(0),[submitted,setSubmitted]=useState(""),[open,setOpen]=useState(false),[question,setQuestion]=useState(""),[messages,setMessages]=useState([]);
 const matches=useMemo(()=>match(submitted),[submitted]);
 useEffect(()=>{const id=setInterval(()=>setPrompt(p=>(p+1)%prompts.length),4800);return()=>clearInterval(id)},[]);
 useEffect(()=>{
   if(!root.current||!orb.current||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
   const r=root.current,o=orb.current,t={x:0,y:0},v={x:0,y:0};let id;
   const move=e=>{const box=r.getBoundingClientRect(),x=(e.clientX-box.left)/box.width-.5,y=(e.clientY-box.top)/box.height-.5;t.x=x*60;t.y=y*47;r.style.setProperty("--hover-x",((x+.5)*100)+"%");r.style.setProperty("--hover-y",((y+.5)*100)+"%")};
   const tick=()=>{v.x+=(t.x-v.x)*.08;v.y+=(t.y-v.y)*.08;o.style.setProperty("--orb-x",v.x+"px");o.style.setProperty("--orb-y",v.y+"px");id=requestAnimationFrame(tick)};
   r.addEventListener("pointermove",move,{passive:true});tick();return()=>{r.removeEventListener("pointermove",move);cancelAnimationFrame(id)};
 },[]);
 useEffect(()=>{if(!open)return;const onKey=e=>{if(e.key==="Escape")setOpen(false)};document.addEventListener("keydown",onKey);return()=>document.removeEventListener("keydown",onKey)},[open]);
 useEffect(()=>{if(open&&chatBox.current)chatBox.current.scrollTop=chatBox.current.scrollHeight},[messages,open]);
 function submit(e){e.preventDefault();const v=query.trim();if(!v){input.current?.focus();return}setSubmitted(v)}
 function send(e){e.preventDefault();const q=question.trim();if(!q)return;const results=match(q);setMessages(m=>[...m,{role:"you",text:q},{role:"adva",text:"I'd start by looking at "+results[0].title.toLowerCase()+". A useful service to explore is "+results[0].project+". Share your goals and timing with the team, and we'll shape a real proposal."}]);setQuestion("")}
 const encoded=encodeURIComponent("Hello ADVA,\n\nI'd like to discuss a new project:\n"+(submitted||query)+"\n\nCompany:\nTimeline:\n");
 return <>
  <section className="cinema" ref={root} aria-labelledby="cinema-title">
    <div className="cinema-backdrop" aria-hidden="true"><div className="cinema-grid"/><span className="cinema-light"/><span className="cinema-edge"/></div>
    <div className="container cinema-inner">
      <div className="cinema-top"><span className="live-dot"/> CREATIVE × MEDIA × EXPERIENCES <span className="cinema-top-right">ABU DHABI / WORLDWIDE</span></div>
      <div className="cinema-main">
        <div className="cinema-story">
          <div className="cinema-kicker"><span/> ADVA / CREATIVE PARTNERS <b>001</b></div>
          <h1 id="cinema-title" className="cinema-title"><span className="cinema-mask"><span>How can we</span></span><span className="cinema-mask"><span className="cinema-ink-gradient">help you<span className="cinema-q">?</span></span></span></h1>
          <p className="cinema-intro">From a first idea to the final frame. We bring brands, stories and experiences to life — with creative thinking and real execution.</p>
          <div className="cinema-search-group">
            <form className="cinema-search" onSubmit={submit}>
              <span className="cinema-search-mark" aria-hidden="true">✳</span>
              <label className="sr-only" htmlFor="adva-query">What can ADVA help you with?</label>
              <input id="adva-query" ref={input} value={query} onChange={e=>setQuery(e.target.value)} placeholder={prompts[prompt]} maxLength={480} autoComplete="off"/>
              <button type="submit" aria-label="Explore your project"><span>Explore</span><Arrow/></button>
            </form>
            <div className="cinema-examples"><span>TRY</span><button type="button" onClick={()=>{setQuery("I need event coverage at an exhibition");input.current?.focus()}}>Exhibition coverage <Up/></button><button type="button" onClick={()=>{setQuery("I want to rebrand and build a website");input.current?.focus()}}>Brand & web <Up/></button><button type="button" onClick={()=>{setQuery("I need creative social content");input.current?.focus()}}>Social content <Up/></button></div>
            <div className="cinema-ai-nudge"><span className="ai-live-dot"/>Need more help? <button type="button" onClick={()=>setOpen(true)}>Talk to ADVA AI <Up/></button><small>GUIDED PREVIEW</small></div>
          </div>
        </div>
        <div className="cinema-scene" aria-hidden="true"><span className="cinema-outline">A</span><span className="cinema-ring outer"/><span className="cinema-ring inner"/><div ref={orb} className="cinema-orb"><div className="cinema-orb-inner"><b>ADVA<span>.</span></b><small>IDEAS IN MOTION</small></div></div><div className="cinema-sticker s1">✦&nbsp; MADE TO MOVE</div><div className="cinema-sticker s2">STRATEGY / STORY / EXECUTION ↗</div><div className="cinema-cross-h"/><div className="cinema-cross-v"/></div>
      </div>
      {submitted&&<div className="cinema-results" role="status" aria-live="polite"><div className="cinema-results-title"><div><span>YOUR IDEA, EXPLORED</span><h2>Here's where we'd begin.</h2></div><button onClick={()=>setSubmitted("")}>Start over ×</button></div><div className="cinema-result-list">{matches.map((m,i)=><a href={"/services/"+m.service} key={m.title}><small>{"0"+(i+1)}</small><strong>{m.title}</strong><p>{m.desc}</p><span>Explore {m.project} <Up/></span></a>)}</div><div className="cinema-results-actions"><a href={"mailto:inquiries@advaae.com?subject="+encodeURIComponent("ADVA project inquiry")+"&body="+encoded}>Send your brief <Up/></a><button type="button" onClick={()=>setOpen(true)}>Need more help? Talk to ADVA AI <Up/></button></div></div>}
      <div className="cinema-foot"><a href="#work">SCROLL TO EXPLORE <span className="cinema-foot-rule"/></a><span>MADE TO BE SEEN. BUILT TO BE REMEMBERED.</span><span>01 — 05</span></div>
    </div>
  </section>
  <button className="ai-orb-button" type="button" onClick={()=>setOpen(true)} aria-label="Open ADVA AI guided assistant"><span className="ai-orb-mini"/> ADVA AI <Up/></button>
  {open&&<div className="ai-overlay"><button type="button" className="ai-scrim" aria-label="Close assistant" onClick={()=>setOpen(false)}/><aside className="ai-window" role="dialog" aria-modal="true" aria-label="ADVA AI guided assistant"><div className="ai-window-top"><div className="ai-window-icon">✳</div><div><small>ADVA AI / GUIDED PREVIEW</small><h2>Let's work this out.</h2></div><button className="ai-window-close" aria-label="Close assistant" onClick={()=>setOpen(false)} type="button">×</button></div><div className="ai-history" ref={chatBox} role="log" aria-live="polite"><p className="ai-bubble">Tell me your idea. I'll point you toward relevant ADVA services and projects, then help you contact our team.</p>{messages.map((m,i)=><p className={"ai-bubble "+(m.role==="you"?"user":"")} key={i}>{m.text}</p>)}<p className="ai-disclosure">Guided preview, not a connected generative AI service. The ADVA team confirms all proposals and pricing.</p></div><form className="ai-entry" onSubmit={send}><label className="sr-only" htmlFor="ai-input">Message</label><input id="ai-input" value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What are you planning?" maxLength={480}/><button aria-label="Send" type="submit"><Arrow/></button></form><div className="ai-links"><a href={"https://wa.me/971585876114?text="+encoded} target="_blank" rel="noopener noreferrer">WhatsApp ADVA <Up/></a><a href={"mailto:inquiries@advaae.com?subject=ADVA%20Project&body="+encoded}>Email your brief <Up/></a></div></aside></div>}
 </>;
}
