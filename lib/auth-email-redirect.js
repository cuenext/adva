// Authentication emails must return to a stable deployed ADVA origin.
// Vercel's rotating deployment hostnames are not in the Supabase redirect allow list.
// The stable host below MUST also be configured under Supabase Authentication > URL Configuration.
const ADVA_PREVIEW_ORIGIN="https://adva-platform-five.vercel.app";
const allowedPaths=new Set(["/hq","/network","/join","/portal"]);

export function authEmailRedirect(path="/network"){
  const safePath=allowedPaths.has(path)?path:"/network";
  if(typeof window==="undefined")return ADVA_PREVIEW_ORIGIN+safePath;
  const {hostname,origin}=window.location;
  const base=hostname.endsWith(".vercel.app")?ADVA_PREVIEW_ORIGIN:origin;
  return base+safePath;
}
