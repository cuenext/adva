import "server-only";
import {createHmac} from "node:crypto";

/**
 * Persistent, fail-closed per-IP and per-day budget using Upstash Redis REST.
 * A valid Redis setup and salt are REQUIRED; no per-instance memory fallback
 * because a Vercel function may be instantiated on many machines.
 */
export function rateLimitConfigured(){
 return Boolean(process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN &&
  process.env.ADVA_RATE_LIMIT_SALT);
}
export async function applyRateLimit(request,scope,perMinute,perDay){
 if(!rateLimitConfigured())return {allowed:false,reason:"unconfigured"};
 const forwarded=(request.headers.get("x-vercel-forwarded-for")||
    request.headers.get("x-forwarded-for")||"unknown").split(",")[0].trim().slice(0,80);
 const ident=createHmac("sha256",process.env.ADVA_RATE_LIMIT_SALT)
   .update(forwarded).digest("hex").slice(0,32);
 const now=Date.now();
 const minute="adva:"+scope+":m:"+Math.floor(now/60000)+":"+ident;
 const day="adva:"+scope+":d:"+Math.floor(now/86400000)+":"+ident;
 const commands=[
   ["INCR",minute],["EXPIRE",minute,120,"NX"],
   ["INCR",day],["EXPIRE",day,172800,"NX"]
 ];
 try{
  const url=process.env.UPSTASH_REDIS_REST_URL.replace(/\/$/,"")+"/multi-exec";
  const response=await fetch(url,{
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":"Bearer "+process.env.UPSTASH_REDIS_REST_TOKEN},
    body:JSON.stringify(commands),cache:"no-store",signal:AbortSignal.timeout(4500)
  });
  if(!response.ok)return {allowed:false,reason:"unavailable"};
  const result=await response.json();
  if(!Array.isArray(result)||result.length!==4||result.some(x=>x.error))return {allowed:false,reason:"unavailable"};
  const minuteCount=Number(result[0].result),dayCount=Number(result[2].result);
  return {allowed:Number.isFinite(minuteCount)&&Number.isFinite(dayCount)&&minuteCount<=perMinute&&dayCount<=perDay,
    reason:"rate_limited",retryAfter:60};
 }catch{return {allowed:false,reason:"unavailable"};}
}
