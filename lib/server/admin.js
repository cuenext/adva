import "server-only";
import {cookies} from "next/headers";

export const ADMIN_COOKIE="adva_admin_access";

export function supabaseAdminConfigured(){
 return Boolean(process.env.SUPABASE_URL &&
   process.env.SUPABASE_SERVICE_ROLE_KEY &&
   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
function supabaseOrigin(){
 try{return new URL(process.env.SUPABASE_URL).origin;}catch{return null;}
}
export async function getAdminFromToken(token){
 if(!supabaseAdminConfigured()||typeof token!=="string"||token.length<30||token.length>6000)return null;
 const url=supabaseOrigin();if(!url)return null;
 try{
  const userRequest=await fetch(url+"/auth/v1/user",{
   method:"GET",headers:{
    "apikey":process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    "Authorization":"Bearer "+token
   },signal:AbortSignal.timeout(6000),cache:"no-store"
  });
  if(!userRequest.ok)return null;
  const user=await userRequest.json();
  if(!user?.id||!user?.email)return null;
  const query=url+"/rest/v1/adva_admins?select=user_id,role&user_id=eq."+encodeURIComponent(user.id)+"&limit=1";
  const roleRequest=await fetch(query,{
    method:"GET",
    headers:{
      "apikey":process.env.SUPABASE_SERVICE_ROLE_KEY,
      "Authorization":"Bearer "+process.env.SUPABASE_SERVICE_ROLE_KEY
    },cache:"no-store",signal:AbortSignal.timeout(6000)
  });
  if(!roleRequest.ok)return null;
  const rows=await roleRequest.json();
  if(!Array.isArray(rows)||!rows[0]||!["ceo","admin","staff"].includes(rows[0].role))return null;
  return {userId:user.id,email:user.email,role:rows[0].role};
 }catch{return null;}
}
export async function getCurrentAdmin(){
 const jar=await cookies();
 return getAdminFromToken(jar.get(ADMIN_COOKIE)?.value);
}
export function adminSupabaseHeaders(extra={}){
 return {
  "apikey":process.env.SUPABASE_SERVICE_ROLE_KEY,
  "Authorization":"Bearer "+process.env.SUPABASE_SERVICE_ROLE_KEY,
  ...extra
 };
}
export function authorizedOrigin(request){
 const origin=request.headers.get("origin");
 try{return !origin || new URL(origin).origin===new URL(request.url).origin;}catch{return false;}
}
