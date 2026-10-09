"use client";
import {useEffect,useRef,useState,useMemo} from "react";
import {AdvaMark} from "./AdvaIcon";

const suggestions=[
 {title:"Branding & identity",keys:["brand","branding","rebrand","identity","logo","design system"],service:"branding",project:"Branding",desc:"Shape a distinctive and consistent visual identity."},
 {title:"Website design",keys:["website","web design","web development","landing page","redesign","site"],service:"website-design",project:"Web design",desc:"A digital presence that's considered from first click to last."},
 {title:"Video production",keys:["video","videos","videography","film","filming","shoot","videographer","production","interview"],service:"videography",project:"Video production",desc:"Purposeful filming and stories built for the right platform."},
 {title:"Photography",keys:["photo","photos","photography","photographer","images","portrait","photoshoot"],service:"photography",project:"Photography",desc:"Striking stills for brands, people and experiences."},
 {title:"Video editing",keys:["editing","edit video","post production","colour grade","motion graphics"],service:"video-editing",project:"Video editing",desc:"Refined edits, motion and sound that finish the story."},
 {title:"Social media",keys:["instagram","tiktok","reel","content","social media","socials","post","content calendar"],service:"social-media-management",project:"Social media",desc:"Content planning, creative execution and platform management."},
 {title:"Marketing & campaigns",keys:["marketing","campaign","ads","advertising","promotion","leads","seo"],service:"marketing",project:"Marketing",desc:"Creative and strategic direction built around your goals."},
 {title:"Event coverage",keys:["exhibition","event","conference","expo","trade show","highlight"],service:"event-coverage",project:"Event coverage",desc:"Photo and video coverage for moments that matter."},
 {title:"Event staffing",keys:["staff","staffing","hostess","host","promoter","usher","event crew"],service:"event-staffing",project:"Event staffing",desc:"The right people to support the experience on site."}
];
const prompts=["I need creative coverage for a three-day exhibition","We need to rebrand and launch a new website","We want to make content people actually watch","I'm planning a brand campaign in Abu Dhabi"];
function match(q){const t=q.toLowerCase().replace(/[^a-z0-9 ]/g," ");const items=suggestions.map((s,i)=>({...s,score:s.keys.reduce((n,k)=>n+(t.includes(k)?(k.length>8?4:3):0),0)-i*.00001})).sort((a,b)=>b.score-a.score);return items[0].score>0?items.filter(s=>s.score>0).slice(0,4):[suggestions[1],suggestions[5]]}
function Arrow(){return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 10h14m-6-6 6 6-6 6"/></svg>}
function Up(){return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 16 16 4M6 4h10v10"/></svg>}
export default function CinematicHero(){
 const root=useRef(null),orb=useRef(null),input=useRef(null),chatBox=useRef(null);
 const [query,setQuery]=useState(""),[prompt,setPrompt]=useState(0),[submitted,setSubmitted]=useState(""),[open,setOpen]=useState(false),[question,setQuestion]=useState(""),[messages,setMessages]=useState([]),[aiLive,setAiLive]=useState(false),[sending,setSending]=useState(false);
 const matches=useMemo(()=>match(submitted),[submitted]);
 useEffect(()=>{let active=true;fetch("/api/assistant",{cache:"no-store"}).then(r=>r.json()).then(d=>{if(active)setAiLive(Boolean(d.available))}).catch(()=>{if(active)setAiLive(false)});return()=>{active=false}},[]);
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
 function saveBriefIdea(){
  if(typeof window==="undefined"||!submitted)return;
  try{window.sessionStorage.setItem("adva_brief_seed_v1",JSON.stringify({idea:submitted,services:matches.map(m=>m.service),at:Date.now()}))}catch{}
 }
 function submit(e){e.preventDefault();const v=query.trim();if(!v){input.current?.focus();return}setSubmitted(v)}
 async function send(e){
  e.preventDefault();
  const q=question.trim();
  if(!q||sending)return;
  setQuestion("");setMessages(prev=>[...prev,{role:"you",text:q}]);
  if(!aiLive){
   const results=match(q);
   setMessages(prev=>[...prev,{role:"adva",text:"I'd start with "+results[0].title.toLowerCase()+". Explore "+results[0].project+" for a useful starting point. Tell us your goals and timing in the project brief, and the ADVA team can shape a real scope."}]);
   return;
  }
  setSending(true);
  try{
   const history=messages.slice(-9).map(m=>({role:m.role==="you"?"user":"assistant",text:m.text})).concat([{role:"user",text:q}]);
   const response=await fetch("/api/assistant",{method:"POST",headers:{"Content-Type":"application/json"},cache:"no-store",body:JSON.stringify({messages:history,brief:submitted||query})});
   const data=await response.json();
   if(!response.ok||!data?.reply)throw Error(data?.error||"Service unavailable");
   setMessages(prev=>[...prev,{role:"adva",text:data.reply}]);
  }catch{
   setMessages(prev=>[...prev,{role:"adva",text:"I'm having trouble connecting right now. You can still choose a service, prepare a project brief, or message the ADVA team directly."}]);
  }finally{setSending(false)}
 }
 const encoded=encodeURIComponent("Hello ADVA,\n\nI'd like to discuss a new project:\n"+(submitted||query)+"\n\nCompany:\nTimeline:\n");
 return <>
  <section className="cinema" ref={root} aria-labelledby="cinema-title">
    <div className="cinema-backdrop" aria-hidden="true"><div className="cinema-grid"/><span className="cinema-light"/><span className="cinema-edge"/></div>
    <div className="container cinema-inner">
      <div className="cinema-top"><span className="live-dot"/> CREATIVE STUDIO <span className="cinema-top-right">ABU DHABI</span></div>
      <div className="cinema-main">
        <div className="cinema-story">
          <div className="cinema-kicker"><span/> THE NEXT IDEA STARTS HERE</div>
          <h1 id="cinema-title" className="cinema-title"><span className="cinema-mask"><span>How can we</span></span><span className="cinema-mask"><span className="cinema-ink-gradient">help you<span className="cinema-q">?</span></span></span></h1>
          <p className="cinema-intro">Film, branding, digital and live experiences. Tell us what you have in mind.</p>
          <div className="cinema-search-group">
            <form className="cinema-search" onSubmit={submit}>
              <span className="cinema-search-mark" aria-hidden="true"><AdvaMark size={23}/></span>
              <label className="sr-only" htmlFor="adva-query">What can ADVA help you with?</label>
              <input id="adva-query" ref={input} value={query} onChange={e=>setQuery(e.target.value)} placeholder={prompts[prompt]} maxLength={480} autoComplete="off"/>
              <button type="submit" aria-label="Explore your project"><span>Explore</span><Arrow/></button>
            </form>
            <div className="cinema-examples"><button type="button" onClick={()=>{setQuery("I need event coverage at an exhibition");input.current?.focus()}}>Exhibition coverage <Up/></button><button type="button" onClick={()=>{setQuery("I want to rebrand and build a website");input.current?.focus()}}>Brand & web <Up/></button><button type="button" onClick={()=>{setQuery("I need creative social content");input.current?.focus()}}>Social content <Up/></button></div>
            <div className="cinema-ai-nudge"><span className="ai-live-dot"/>Questions? <button type="button" onClick={()=>setOpen(true)}>Talk to ADVA AI <Up/></button></div>
          </div>
        </div>
        <div className="cinema-scene" aria-hidden="true"><span className="cinema-outline">A</span><span className="cinema-ring outer"/><span className="cinema-ring inner"/><div ref={orb} className="cinema-orb"><div className="cinema-orb-inner"><b>ADVA<span>.</span></b></div></div><div className="cinema-cross-h"/><div className="cinema-cross-v"/></div>
      </div>
      {submitted&&<div className="cinema-results" role="status" aria-live="polite"><div className="cinema-results-title"><div><span>YOUR PROJECT</span><h2>Services that fit.</h2></div><button onClick={()=>setSubmitted("")}>Reset</button></div><div className="cinema-result-list">{matches.map((m,i)=><a href={"/services/"+m.service} key={m.title}><small>{"0"+(i+1)}</small><strong>{m.title}</strong><p>{m.desc}</p><span>Explore {m.project} <Up/></span></a>)}</div><div className="cinema-results-actions"><a className="cinema-results-primary" href={"/brief?services="+matches.map(m=>m.service).join(",")+"&from=search"} onClick={saveBriefIdea}>Continue with these services <Up/></a><button type="button" onClick={()=>setOpen(true)}>Ask ADVA AI <Up/></button></div></div>}
      <div className="cinema-foot"><a href="#services">Scroll to services <span className="cinema-foot-rule"/></a></div>
    </div>
  </section>
  <button className="ai-orb-button" type="button" onClick={()=>setOpen(true)} aria-label="Open ADVA AI guided assistant"><span className="ai-orb-mini"/> ADVA AI <Up/></button>
  {open&&<div className="ai-overlay"><button type="button" className="ai-scrim" aria-label="Close assistant" onClick={()=>setOpen(false)}/><aside className="ai-window" role="dialog" aria-modal="true" aria-label="ADVA AI guided assistant"><div className="ai-window-top"><div className="ai-window-icon"><AdvaMark size={23}/></div><div><small>{"ADVA AI / "+(aiLive?"LIVE CONCIERGE":"GUIDED PREVIEW")}</small><h2>Let's work this out.</h2></div><button className="ai-window-close" aria-label="Close assistant" onClick={()=>setOpen(false)} type="button">Close</button></div><div className="ai-history" ref={chatBox} role="log" aria-live="polite"><p className="ai-bubble">Tell me what you're planning. I'll help you find the right starting point.</p>{messages.map((m,i)=><p className={"ai-bubble "+(m.role==="you"?"user":"")} key={i}>{m.text}</p>)}{sending&&<div className="ai-typing" aria-label="ADVA AI is composing a response"><i/><i/><i/></div>}<p className="ai-disclosure">{aiLive?"AI messages are processed by OpenAI when you press Send. Avoid sharing sensitive personal information.":"Guided preview; live AI activates after secure integration. ADVA confirms all proposals and pricing."}</p></div><form className="ai-entry" onSubmit={send}><label className="sr-only" htmlFor="ai-input">Message</label><input id="ai-input" value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What are you planning?" maxLength={480}/><button aria-label="Send" type="submit" disabled={sending}><Arrow/></button></form><div className="ai-links"><a href={"https://wa.me/971585876114?text="+encoded} target="_blank" rel="noopener noreferrer">WhatsApp ADVA <Up/></a><a href={"mailto:inquiries@advaae.com?subject=ADVA%20Project&body="+encoded}>Email your brief <Up/></a></div></aside></div>}
 </>;
}
