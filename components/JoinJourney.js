"use client";
import {useEffect,useRef,useState} from "react";
import AdvaIcon from "./AdvaIcon";
import {authEmailRedirect} from "../lib/auth-email-redirect";

const CACHE_KEY="adva_join_application_v1";
const TTL=2*60*60*1000;
const disciplines=[
 ["videography","Videographer","Stories in motion"],
 ["photography","Photographer","A point of view in every frame"],
 ["editing","Video editor","The right story in the right cut"],
 ["social_media","Social creative","Ideas made to connect"],
 ["design","Designer","An identity people remember"],
 ["marketing","Marketing creative","Strategy turned into momentum"],
 ["event_staff","Events & staffing","Making real moments happen"],
 ["other","Something else","A craft of your own"]
];
const initial={specialty:"",display_name:"",handle:"",location:"Abu Dhabi",availability:"Flexible / project-based",experience_level:"Developing",age_band:"18-24",is_adult:false,bio:"",portfolio_links:"",email:""};
const isEmail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v||"");
const parseLinks=value=>String(value||"").split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
const validLink=value=>{try{return new URL(value).protocol==="https:"}catch{return false}};
function savedForm(){
 try{const x=JSON.parse(window.localStorage.getItem(CACHE_KEY)||"null");if(!x||Date.now()-x.createdAt>TTL){window.localStorage.removeItem(CACHE_KEY);return null}return x.form}catch{return null}
}
function stash(form){try{window.localStorage.setItem(CACHE_KEY,JSON.stringify({form,createdAt:Date.now()}))}catch{}}
function clearStash(){try{window.localStorage.removeItem(CACHE_KEY)}catch{}}
export default function JoinJourney({db,user,role,refresh}){
 const [step,setStep]=useState(0),[form,setForm]=useState(initial),[code,setCode]=useState(""),[showCode,setShowCode]=useState(false),[agreed,setAgreed]=useState(false);
 const [error,setError]=useState(""),[emailLimited,setEmailLimited]=useState(false),[notice,setNotice]=useState(""),[busy,setBusy]=useState(false),[restored,setRestored]=useState(false);
 const saving=useRef(false);
 useEffect(()=>{const previous=savedForm();if(previous){setForm({...initial,...previous});setStep(3)}setRestored(true)},[]);
 async function complete(account,fields){
  if(saving.current||!account||!db)return;
  const f=fields||savedForm()||form;
  if(!f.email||account.email?.trim().toLowerCase()!==f.email.trim().toLowerCase()){setError("Use the same verified email address as your application.");setStep(3);return}
  const links=parseLinks(f.portfolio_links);
  if(!f.is_adult||!f.specialty||f.display_name.trim().length<2||links.length>8||links.some(x=>!validLink(x))){setError("The saved application needs valid profile details.");setStep(2);return}
  saving.current=true;setBusy(true);setError("");setStep(5);
  try{
   const record={
     user_id:account.id,
     display_name:f.display_name.trim().slice(0,120),
     handle:f.handle.trim().toLowerCase()||null,
     specialty:f.specialty,
     location:f.location.slice(0,100),
     availability:f.availability.slice(0,200),
     experience_level:f.experience_level.slice(0,100),
     age_band:f.age_band,
     is_adult:true,
     bio:f.bio.slice(0,1800),
     portfolio_links:links,
     approved_network_visible:false
   };
   const {error}=await db.from("adva_freelancers").insert(record);
   if(error&&error.code!=="23505")throw error;
   clearStash();setNotice("Your verified profile is ready.");refresh();
   window.location.assign("/network");
  }catch(e){setError(e.message||"Your profile could not be created. Please try again.");setStep(3)}
  finally{saving.current=false;setBusy(false)}
 }
 useEffect(()=>{
  if(!restored||!user||!["unlinked","client"].includes(role))return;
  const pending=savedForm();
  if(pending?.email?.toLowerCase()===user.email?.toLowerCase())complete(user,pending);
 },[restored,user?.id,role]);
 function update(field,value){setForm(f=>({...f,[field]:value}));setError("")}
 function next(){
  setError("");
  if(step===0&&!form.specialty){setError("Choose the type of work you create.");return}
  if(step===1&&!form.is_adult){setError("The ADVA freelance network currently accepts applicants aged 18 and over.");return}
  if(step===2){
   const links=parseLinks(form.portfolio_links);
   if(form.display_name.trim().length<2){setError("Enter your name.");return}
   if(form.handle&&!/^[a-z0-9_]{3,24}$/.test(form.handle)){setError("Use 3–24 lowercase letters, numbers or underscores for your handle.");return}
   if(links.length>8||links.some(x=>!validLink(x))){setError("Use up to eight full https:// portfolio URLs, one per line.");return}
  }
  setStep(s=>Math.min(3,s+1));
 }
 async function requestEmail(e){
  e.preventDefault();setError("");setNotice("");setEmailLimited(false);
  if(!agreed){setError("Confirm the privacy acknowledgement before verification.");return}
  const address=(user?.email||form.email).trim().toLowerCase();
  if(!isEmail(address)){setError("Enter a valid email address.");return}
  const profile={...form,email:address};
  stash(profile);
  setForm(profile);
  if(user){await complete(user,profile);return}
  setBusy(true);
  try{
   if(!db)throw new Error("Authentication has not been configured.");
   const {error}=await db.auth.signInWithOtp({email:address,options:{shouldCreateUser:true,emailRedirectTo:authEmailRedirect("/join")}});
   if(error)throw error;
   setShowCode(false);
   setNotice("A secure confirmation link was sent. Follow the link in your email to finish registration.");
   setStep(4);
  }catch(e){const limited=/email rate limit|over_email_send_rate_limit/i.test(e?.message||"");setEmailLimited(limited);setError(limited?"ADVA's email service is temporarily at its sending limit. If your account already exists, use password sign-in below. Otherwise try again later.":(e.message||"Couldn't send a verification email."))}finally{setBusy(false)}
 }
 async function verify(e){
  e.preventDefault();setError("");if(code.length!==6)return;setBusy(true);
  try{
   const {data,error}=await db.auth.verifyOtp({email:form.email,token:code,type:"email"});
   if(error)throw error;
   if(data.user)await complete(data.user,form);
   else setNotice("Verified. Preparing your profile…");
  }catch(e){setError(e.message||"That code has expired or isn't valid.")}finally{setBusy(false)}
 }
 if(!restored)return <div className="aws-join-loading">Preparing ADVA…</div>;
 return <div className="aws-join-page">
  <header className="aws-join-top"><a href="/" aria-label="ADVA"><img src="/adva-logo.webp" alt="ADVA"/></a><a href="/enter">Explore ADVA →</a></header>
  
  <main className="aws-join-container">
   <div className="aws-join-topline"><span>ADVA CREATIVE NETWORK</span><a href="/network">Already registered? Sign in →</a></div>
   <div className="aws-join-progress"><span>{step<=3?"0"+(step+1)+" / 04":"VERIFYING"}</span><div>{[0,1,2,3].map(i=><b key={i} className={step>=i?"active":""}/>)}</div><span>{["YOUR CRAFT","YOUR APPROACH","YOUR WORK","YOUR EMAIL","YOUR EMAIL","FINISHING"][step]}</span></div>
   <div className="aws-join-content">
    {step===0&&<><div className="aws-join-label">01 / WHO YOU ARE</div><h1>What do<br/><em>you create?</em></h1><p>Choose your main discipline. You can show the rest in your portfolio.</p><div className="aws-join-choice-grid">{disciplines.map(([slug,title,description])=><button type="button" onClick={()=>update("specialty",slug)} aria-pressed={form.specialty===slug} className={form.specialty===slug?"active":""} key={slug}><span><strong>{title}</strong><small>{description}</small></span><b>{form.specialty===slug?<AdvaIcon name="check" size={17}/>:<AdvaIcon name="up" size={17}/>}</b></button>)}</div></>}
    {step===1&&<><div className="aws-join-label">02 / YOUR AVAILABILITY</div><h1>When are<br/><em>you available?</em></h1><p>Tell us where you are and the hours you can take projects.</p><div className="aws-join-fields"><div className="aws-join-pair"><label>Location<input maxLength={100} value={form.location} onChange={e=>update("location",e.target.value)} placeholder="Abu Dhabi"/></label><label>Age range (18+ only)<select value={form.age_band} onChange={e=>update("age_band",e.target.value)}>{["18-24","25-34","35-44","45+"].map(x=><option key={x}>{x}</option>)}</select></label></div><label>Availability<input maxLength={200} value={form.availability} onChange={e=>update("availability",e.target.value)} placeholder="Weekends / weekdays / project-based"/></label><label>Experience level<select value={form.experience_level} onChange={e=>update("experience_level",e.target.value)}>{["Developing","1–2 years","3–5 years","5+ years"].map(x=><option key={x}>{x}</option>)}</select></label><label className="aws-join-check"><input type="checkbox" checked={form.is_adult} onChange={e=>update("is_adult",e.target.checked)}/> I confirm that I am at least 18 years old.</label></div></>}
    {step===2&&<><div className="aws-join-label">03 / INTRODUCE YOURSELF</div><h1>Show us<br/><em>your work.</em></h1><p>Tell us about your work. You can upload samples after verification.</p><div className="aws-join-fields"><div className="aws-join-pair"><label>Display name<input maxLength={120} minLength={2} value={form.display_name} onChange={e=>update("display_name",e.target.value)} placeholder="Your name"/></label><label>Handle (optional)<input maxLength={24} value={form.handle} onChange={e=>update("handle",e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,""))} placeholder="yourname"/></label></div><label>About your work<textarea rows={3} maxLength={1800} value={form.bio} onChange={e=>update("bio",e.target.value)} placeholder="The types of projects you love creating…"/></label><label>Portfolio / showreel links<textarea rows={4} value={form.portfolio_links} onChange={e=>update("portfolio_links",e.target.value)} placeholder={"https://yourportfolio.com\nhttps://yourshowreel.com"}/></label></div></>}
    {step===3&&<><div className="aws-join-label">YOUR ACCOUNT</div><h1>Finish<br/><em>your profile.</em></h1><p>New to ADVA? Verify your address with a secure email link. Already registered? You can sign in without another email.</p><form className="aws-join-fields" onSubmit={requestEmail}><label>Your email<input type="email" autoComplete="email" readOnly={Boolean(user)} required maxLength={254} value={user?.email||form.email} onChange={e=>update("email",e.target.value)} placeholder="you@example.com"/></label><label className="aws-join-check"><input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)}/> I consent to account verification and have read <a href="/privacy" target="_blank" rel="noopener noreferrer">the privacy information →</a>.</label><p className="aws-join-help">Your application is saved in this browser to finish verification; expired drafts are cleared the next time you open this page. Job access requires a separate, legally reviewed NDA.</p><button className="aws-join-next" disabled={busy} type="submit">{busy?"Sending…":user?"Create your verified profile":"Send verification link"} <span>→</span></button></form><div className="aws-existing-login"><p>{emailLimited?"Email delivery is currently limited. You can still sign in with a password.":"Already have an ADVA freelancer account?"}</p><a href="/network">Sign in with password <span aria-hidden="true">↗</span></a></div></>}
    {step===4&&<><div className="aws-join-label">EMAIL VERIFICATION</div><h1>Check your<br/><em>inbox.</em></h1><p>We sent a secure sign-in link to <strong>{form.email}</strong>. Open that link to finish registration. If the message has no code, you don't need one.</p><button type="button" className="aws-join-back" onClick={()=>setShowCode(v=>!v)} aria-expanded={showCode}>{showCode?"Hide code entry":"I received a six-digit code"}</button>{showCode&&<form className="aws-join-fields" onSubmit={verify}><label>Six-digit code<input inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,""))}/></label><button className="aws-join-next" type="submit" disabled={busy||code.length!==6}>Complete verification <span>→</span></button></form>}<button type="button" className="aws-join-back" onClick={()=>setStep(3)}>← Change email or request a new link</button><div className="aws-existing-login"><p>Already created your ADVA profile?</p><a href="/network">Sign in with password <span aria-hidden="true">↗</span></a></div></>}
    {step===5&&<><div className="aws-join-label">FINALIZING ACCOUNT</div><h1>Setting up<br/><em>your account.</em></h1><p>Saving your verified creative profile…</p></>}
    {error&&<div className="aws-error" role="alert">{error}</div>}{notice&&<div className="aws-feedback" role="status">{notice}</div>}
    {step<=2&&<div className="aws-join-actions">{step>0&&<button className="aws-join-back" type="button" onClick={()=>{setStep(step-1);setError("")}}>← Previous</button>}<button className="aws-join-next" type="button" onClick={next}>Continue <span>→</span></button></div>}
   </div>
   <div className="aws-join-bottom"><span>ADVA Creative Network</span><span>Abu Dhabi</span></div>
  </main>
 </div>;
}