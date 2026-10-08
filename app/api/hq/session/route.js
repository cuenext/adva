import {NextResponse} from "next/server";
import {ADMIN_COOKIE,authorizedOrigin,getCurrentAdmin,getAdminFromToken,supabaseAdminConfigured} from "../../../../lib/server/admin";
import {applyRateLimit,rateLimitConfigured} from "../../../../lib/server/rateLimit";

export const runtime="nodejs";
export const maxDuration=20;
const respond=(body,status=200)=>NextResponse.json(body,{status,headers:{"Cache-Control":"no-store"}});
export async function GET(){
 if(!supabaseAdminConfigured())return respond({available:false,authenticated:false});
 const admin=await getCurrentAdmin();
 return respond({available:true,authenticated:Boolean(admin),role:admin?.role??null,email:admin?.email??null});
}
export async function POST(request){
 if(!supabaseAdminConfigured()||!rateLimitConfigured())return respond({error:"ADVA HQ isn't connected to Supabase yet."},503);
 if(!authorizedOrigin(request))return respond({error:"Invalid origin"},403);
 if(Number(request.headers.get("content-length")||0)>3000)return respond({error:"Request too large"},413);
 let body;
 try{const raw=await request.text();if(raw.length>3000)return respond({error:"Request too large"},413);body=JSON.parse(raw);}catch{return respond({error:"Invalid request"},400);}
 const email=typeof body?.email==="string"?body.email.trim().toLowerCase():"";
 const password=typeof body?.password==="string"?body.password:"";
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||password.length<8||password.length>256)return respond({error:"Invalid sign-in details"},400);
 const limit=await applyRateLimit(request,"hq-login",5,20);
 if(!limit.allowed)return respond({error:"Sign-in is temporarily unavailable. Please try later."},429);
 let data;
 try{
  const origin=new URL(process.env.SUPABASE_URL).origin;
  const response=await fetch(origin+"/auth/v1/token?grant_type=password",{
   method:"POST",
   headers:{"Content-Type":"application/json","apikey":process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY},
   body:JSON.stringify({email,password}),
   cache:"no-store",signal:AbortSignal.timeout(9000)
  });
  if(!response.ok)return respond({error:"Could not sign in. Check your details or access."},401);
  data=await response.json();
 }catch{return respond({error:"Sign-in service is unavailable."},503);}
 const token=data?.access_token;
 const admin=await getAdminFromToken(token);
 if(!admin)return respond({error:"This account does not have ADVA HQ access."},403);
 const result=respond({authenticated:true,role:admin.role,email:admin.email});
 result.cookies.set(ADMIN_COOKIE,token,{
   httpOnly:true,secure:process.env.NODE_ENV==="production",
   sameSite:"strict",path:"/",maxAge:Math.min(3600,Math.max(60,Number(data.expires_in)||3600))
 });
 return result;
}
export async function DELETE(request){
 if(!authorizedOrigin(request))return respond({error:"Invalid origin"},403);
 const result=respond({authenticated:false});
 result.cookies.set(ADMIN_COOKIE,"",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:0});
 return result;
}
