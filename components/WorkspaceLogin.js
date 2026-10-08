"use client";
import {useState} from "react";
export default function WorkspaceLogin({db,mode="hq",redirect="/hq"}){
 const [email,setEmail]=useState(""),[stage,setStage]=useState("email"),[token,setToken]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState(""),[message,setMessage]=useState(""),[busy,setBusy]=useState(false),[isAdult,setAdult]=useState(false);
 const join=mode==="join";
 const intro=mode==="portal"?{title:"Your work, all in one place.",subtitle:"Project timelines, approved content and performance — when ADVA has linked your verified account."}:join?{title:"Create your space in ADVA.",subtitle:"Join our creative network, build your portfolio and apply for opportunities once our NDA is approved."}:{title:"Welcome back to ADVA.",subtitle:"One secure login. The projects and tools you are permitted to access."};
 async function send(e){
  e.preventDefault();setError("");setMessage("");
  if(join&&!isAdult){setError("ADVA's freelance network is currently for applicants aged 18 and over.");return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())){setError("Enter a valid email address.");return}
  if(!db){setError("Authentication is not connected.");return}
  setBusy(true);
  try{
   const r=await db.auth.signInWithOtp({email:email.trim().toLowerCase(),options:{shouldCreateUser:true,emailRedirectTo:window.location.origin+redirect}});
   if(r.error)throw r.error;
   setStage("code");setMessage("We sent a verification message. Enter the six-digit code if your email contains one, or use the confirmation link.");
  }catch(e){setError(e.message||"We couldn't send the verification email.")}finally{setBusy(false)}
 }
 async function verify(e){
  e.preventDefault();setBusy(true);setError("");try{
   const r=await db.auth.verifyOtp({email:email.trim().toLowerCase(),token:token.replace(/\s/g,""),type:"email"});
   if(r.error)throw r.error;
   setMessage("Verified. Opening your workspace…");
  }catch(e){setError(e.message||"The code could not be verified.")}finally{setBusy(false)}
 }
 async function passwordLogin(e){
  e.preventDefault();setBusy(true);setError("");
  try{
   const r=await db.auth.signInWithPassword({email:email.trim().toLowerCase(),password});
   if(r.error)throw r.error;
   setPassword("");
  }catch(e){setError(e.message||"Incorrect login details.")}finally{setBusy(false)}
 }
 return <div className="aws-login-screen"><div className="aws-login-ambient" aria-hidden="true"><span>ADVA</span><i/><b>✳</b></div><div className="aws-login-top"><a href="/"><img src="/adva-logo.webp" alt="ADVA"/></a><span>{join?"CREATIVE NETWORK":mode==="portal"?"CLIENT PORTAL":"ADVA WORKSPACE"} / SECURE ACCESS</span></div><div className="aws-login-card"><span className="aws-eyebrow"><i/> VERIFIED ACCESS / ADVA</span><h1>{intro.title}</h1><p>{intro.subtitle}</p>
  {stage==="email"&&<form onSubmit={send}><label htmlFor="ws-login-email">Your email address</label><input id="ws-login-email" type="email" autoComplete="email" autoFocus maxLength={254} required value={email} placeholder="you@example.com" onChange={e=>setEmail(e.target.value)}/>{join&&<label className="aws-adult-check"><input type="checkbox" checked={isAdult} onChange={e=>setAdult(e.target.checked)}/><span>I confirm I am at least 18 years old and agree to receive an account verification email. <a href="/privacy">Privacy information ↗</a></span></label>}<button className="aws-primary" disabled={busy} type="submit">{busy?"Sending…":"Continue with email"} <span>↗</span></button></form>}
  {stage==="code"&&<form onSubmit={verify}><label htmlFor="ws-otp">Six-digit verification code</label><input id="ws-otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" value={token} onChange={e=>setToken(e.target.value.replace(/\D/g,""))}/><p className="aws-help">If your email has a confirmation link instead, open it to finish signing in. To receive six-digit codes, ADVA must enable the OTP email template in Supabase.</p><button type="submit" className="aws-primary" disabled={busy||token.length!==6}>Verify email <span>↗</span></button><button type="button" className="aws-text-button" onClick={()=>setStage("email")}>← Try another email</button></form>}
  {stage==="password"&&<form onSubmit={passwordLogin}><label htmlFor="ws-p-email">Email</label><input id="ws-p-email" type="email" required value={email} onChange={e=>setEmail(e.target.value)}/><label htmlFor="ws-password">Password</label><input id="ws-password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/><button className="aws-primary" disabled={busy}>Sign in <span>↗</span></button><button className="aws-text-button" type="button" onClick={()=>setStage("email")}>← Use email verification instead</button></form>}
  {error&&<p className="aws-error" role="alert">{error}</p>}{message&&<p className="aws-success" role="status">{message}</p>}
  {stage==="email"&&!join&&<button className="aws-text-button" type="button" onClick={()=>setStage("password")}>Already have a password? Sign in here ↗</button>}
  <div className="aws-login-footer"><a href="/join">Join the ADVA network</a><a href="/portal">Client access</a><a href="/">← Main website</a></div>
 </div></div>;
}