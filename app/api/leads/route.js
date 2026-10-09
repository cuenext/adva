import {NextResponse} from "next/server";
import {SERVICES} from "../../../lib/services";
import {applyRateLimit,rateLimitConfigured} from "../../../lib/server/rateLimit";

export const runtime="nodejs";
export const maxDuration=15;
const head={"Cache-Control":"no-store"};
const isReady=()=>Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && rateLimitConfigured());
const respond=(body,status=200)=>NextResponse.json(body,{status,headers:head});

export function GET(){
 return respond({available:isReady()});
}
function validOrigin(request){
 try{const origin=request.headers.get("origin");return Boolean(origin) && new URL(origin).origin===new URL(request.url).origin;}catch{return false;}
}
function clean(value,max=120){return typeof value==="string"?value.trim().slice(0,max):"";}
function validReference(value){
 if(value===undefined||value===null||value==="")return "";
 if(typeof value!=="string"||value.length>600)return null;
 try{
  const u=new URL(value.trim());
  if(u.protocol!=="https:"||u.username||u.password||u.hostname==="localhost"||u.hostname==="127.0.0.1")return null;
  return value.trim();
 }catch{return null}
}

export async function POST(request){
 if(!isReady())return respond({error:"Secure submission is not connected yet. You can send your brief via email or WhatsApp."},503);
 if(!validOrigin(request))return respond({error:"Origin not permitted"},403);
 if(!(request.headers.get("content-type")||"").includes("application/json"))return respond({error:"Expected JSON"},415);
 if(Number(request.headers.get("content-length")||0)>12000)return respond({error:"Brief too long"},413);
 let body;
 try{const raw=await request.text();if(raw.length>12000)return respond({error:"Brief too long"},413);body=JSON.parse(raw);}catch{return respond({error:"Invalid request"},400);}
 if(body?.website)return respond({ok:true,reference:""}); // unobtrusive honeypot
 const name=clean(body?.name,100),email=clean(body?.email,180).toLowerCase(),
   company=clean(body?.company,150),description=clean(body?.description,2600),
   timeline=clean(body?.timeline,100),location=clean(body?.location,100),budget=clean(body?.budget,160),reference_url=validReference(body?.reference_url);
 const validSlugs=new Set(SERVICES.map(s=>s.slug));
 const services=Array.isArray(body?.services)?
   [...new Set(body.services.filter(s=>typeof s==="string"&&validSlugs.has(s)))].slice(0,9):[];
 if(!body?.consent || name.length<2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
   description.length<12 || description.length>2600 || reference_url===null)return respond({error:"Please complete the name, email and project idea, and use a secure HTTPS reference link if provided."},400);
 const limit=await applyRateLimit(request,"leads",3,20);
 if(!limit.allowed)return respond({error:limit.reason==="rate_limited"?
  "Too many submissions. Please wait or email ADVA directly.":
  "Secure submission is temporarily unavailable. Please use email or WhatsApp."},limit.reason==="rate_limited"?429:503);
 let base;try{base=new URL(process.env.SUPABASE_URL).origin;}catch{return respond({error:"Submission backend is not configured."},503);}
 try{
  const response=await fetch(base+"/rest/v1/adva_leads",{
    method:"POST",
    headers:{
      "apikey":process.env.SUPABASE_SERVICE_ROLE_KEY,
      "Authorization":"Bearer "+process.env.SUPABASE_SERVICE_ROLE_KEY,
      "Content-Type":"application/json",
      "Prefer":"return=representation"
    },
    body:JSON.stringify({
       name,email,company,description,services,timeline,location,budget,reference_url,
       consent_to_contact:true,source:"adva_website"
    }),
    cache:"no-store",signal:AbortSignal.timeout(9000)
  });
  if(!response.ok)return respond({error:"We couldn't save the brief. Please use email or WhatsApp instead."},503);
  const result=await response.json();
  if(!Array.isArray(result)||!result[0]?.id)return respond({error:"We couldn't confirm the submission. Please email ADVA."},503);
  return respond({ok:true,reference:String(result[0].id).slice(0,8)});
 }catch{return respond({error:"Submission is temporarily unavailable. Please use email or WhatsApp."},503);}
}
