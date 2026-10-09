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
// Fixed positions keep the background consistent during hydration and avoid expensive particles.
const skyPoints=Array.from({length:145},(_,i)=>{
 const noise=n=>{const v=Math.sin(n*127.1+34.47)*43758.5453;return v-Math.floor(v)};
 return {x:Math.round(noise(i+1)*1440),y:Math.round(noise(i+178)*900),size:noise(i+305)>.94?1.8:.65,alpha:.2+noise(i+500)*.65};
});
function match(q){const t=q.toLowerCase().replace(/[^a-z0-9 ]/g," ");const items=suggestions.map((s,i)=>({...s,score:s.keys.reduce((n,k)=>n+(t.includes(k)?(k.length>8?4:3):0),0)-i*.00001})).sort((a,b)=>b.score-a.score);return items[0].score>0?items.filter(s=>s.score>0).slice(0,4):[suggestions[1],suggestions[5]]}
function Arrow(){return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 10h14m-6-6 6 6-6 6"/></svg>}
function Up(){return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 16 16 4M6 4h10v10"/></svg>}
export default function CinematicHero(){
 const input=useRef(null);
 const [query,setQuery]=useState(""),[prompt,setPrompt]=useState(0),[submitted,setSubmitted]=useState("");
 const matches=useMemo(()=>match(submitted),[submitted]);
 useEffect(()=>{const id=setInterval(()=>setPrompt(p=>(p+1)%prompts.length),4800);return()=>clearInterval(id)},[]);
 function saveBriefIdea(){
  if(typeof window==="undefined"||!submitted)return;
  try{window.sessionStorage.setItem("adva_brief_seed_v1",JSON.stringify({idea:submitted,services:matches.map(m=>m.service),at:Date.now()}))}catch{}
 }
 function submit(e){e.preventDefault();const v=query.trim();if(!v){input.current?.focus();return}setSubmitted(v)}
 function openAssistant(){window.dispatchEvent(new CustomEvent("adva:assistant:open",{detail:{brief:submitted||query}}))}
 return <>
  <section className="cinema cinema-cosmos-hero" aria-labelledby="cinema-title">
    <div className="cinema-cosmos" aria-hidden="true">
      <div className="cinema-cosmos-nebula"/>
      <div className="cinema-cosmos-horizon"/>
      <svg className="cinema-cosmos-stars" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {skyPoints.map((s,i)=><circle key={i} cx={s.x} cy={s.y} r={s.size} fill="#d2e8ff" opacity={s.alpha}/>)}
      </svg>
      <div className="cinema-cosmos-vignette"/>
    </div>
    <div className="container cinema-inner">
      <div className="cinema-main">
        <div className="cinema-story">
          <h1 id="cinema-title" className="cinema-title"><span className="cinema-mask"><span>How can we</span></span><span className="cinema-mask"><span className="cinema-ink-gradient">help you<span className="cinema-q">?</span></span></span></h1>
          <p className="cinema-intro">Film and photography. Brand and digital. Events and production. Tell us what you have in mind.</p>
          <div className="cinema-search-group">
            <form className="cinema-search" onSubmit={submit}>
              <span className="cinema-search-mark" aria-hidden="true"><AdvaMark size={23}/></span>
              <label className="sr-only" htmlFor="adva-query">What can ADVA help you with?</label>
              <input id="adva-query" ref={input} value={query} onChange={e=>setQuery(e.target.value)} placeholder={prompts[prompt]} maxLength={480} autoComplete="off"/>
              <button type="submit" aria-label="Explore your project"><span>Explore</span><Arrow/></button>
            </form>
            <div className="cinema-examples"><button type="button" onClick={()=>{setQuery("I need event coverage at an exhibition");input.current?.focus()}}>Exhibition coverage <Up/></button><button type="button" onClick={()=>{setQuery("I want to rebrand and build a website");input.current?.focus()}}>Brand & web <Up/></button><button type="button" onClick={()=>{setQuery("I need creative social content");input.current?.focus()}}>Social content <Up/></button></div>
            <div className="cinema-ai-nudge"><span className="ai-live-dot"/>Questions? <button type="button" onClick={openAssistant}>Talk to ADVA AI <Up/></button></div>
          </div>
        </div>
      </div>
      {submitted&&<div className="cinema-results" role="status" aria-live="polite"><div className="cinema-results-title"><div><span>YOUR PROJECT</span><h2>Services that fit.</h2></div><button onClick={()=>setSubmitted("")}>Reset</button></div><div className="cinema-result-list">{matches.map((m,i)=><a href={"/services/"+m.service} key={m.title}><small>{"0"+(i+1)}</small><strong>{m.title}</strong><p>{m.desc}</p><span>Explore {m.project} <Up/></span></a>)}</div><div className="cinema-results-actions"><a className="cinema-results-primary" href={"/brief?services="+matches.map(m=>m.service).join(",")+"&from=search"} onClick={saveBriefIdea}>Continue with these services <Up/></a><button type="button" onClick={openAssistant}>Ask ADVA AI <Up/></button></div></div>}
      <div className="cinema-foot"><a href="#services">Explore our services <span className="cinema-foot-rule"/></a></div>
    </div>
  </section>
 </>;
}
