import {NextResponse} from "next/server";
import {getCurrentAdmin,supabaseAdminConfigured,adminSupabaseHeaders,authorizedOrigin} from "../../../../lib/server/admin";
import {applyRateLimit} from "../../../../lib/server/rateLimit";

export const runtime="nodejs";
export const maxDuration=18;
const respond=(body,status=200)=>NextResponse.json(body,{status,headers:{"Cache-Control":"no-store"}});
const STATUSES=new Set(["new","reviewing","quoted","won","lost","archived"]);
const ID=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
function endpoint(){
 return new URL(process.env.SUPABASE_URL).origin+"/rest/v1/adva_leads";
}
export async function GET(request){
 if(!supabaseAdminConfigured())return respond({error:"ADVA HQ is not configured"},503);
 const admin=await getCurrentAdmin();
 if(!admin)return respond({error:"Unauthorized"},401);
 const params=new URL(request.url).searchParams;
 const limit=Math.min(50,Math.max(1,Number(params.get("limit"))||25));
 const offset=Math.min(5000,Math.max(0,Number(params.get("offset"))||0));
 const url=endpoint()+"?select=id,created_at,name,email,company,description,services,timeline,location,budget,status,source&order=created_at.desc&limit="+limit+"&offset="+offset;
 try{
  const response=await fetch(url,{
   headers:adminSupabaseHeaders(),cache:"no-store",signal:AbortSignal.timeout(10000)
  });
  if(!response.ok)return respond({error:"Couldn't load enquiries"},503);
  const rows=await response.json();
  return respond({leads:Array.isArray(rows)?rows:[],offset,limit,role:admin.role});
 }catch{return respond({error:"Couldn't load enquiries"},503);}
}
export async function PATCH(request){
 if(!supabaseAdminConfigured())return respond({error:"ADVA HQ is not configured"},503);
 if(!authorizedOrigin(request))return respond({error:"Invalid origin"},403);
 const admin=await getCurrentAdmin();
 if(!admin)return respond({error:"Unauthorized"},401);
 if(!["ceo","admin"].includes(admin.role))return respond({error:"Insufficient permissions"},403);
 let body;
 try{
  const raw=await request.text();if(raw.length>1200)return respond({error:"Request too large"},413);
  body=JSON.parse(raw);
 }catch{return respond({error:"Invalid request"},400);}
 if(typeof body?.id!=="string"||!ID.test(body.id)||!STATUSES.has(body?.status))
  return respond({error:"Invalid enquiry or status"},400);
 const limit=await applyRateLimit(request,"hq-update",15,300);
 if(!limit.allowed)return respond({error:"Too many changes. Please try later."},429);
 try{
  const response=await fetch(endpoint()+"?id=eq."+body.id,{
   method:"PATCH",headers:adminSupabaseHeaders({"Content-Type":"application/json","Prefer":"return=representation"}),
   body:JSON.stringify({status:body.status,updated_at:new Date().toISOString()}),
   cache:"no-store",signal:AbortSignal.timeout(10000)
  });
  if(!response.ok)return respond({error:"Couldn't update status"},503);
  const rows=await response.json();
  if(!Array.isArray(rows)||!rows.length)return respond({error:"Enquiry not found"},404);
  return respond({ok:true,status:body.status});
 }catch{return respond({error:"Couldn't update status"},503);}
}
