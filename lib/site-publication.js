// Public launch must be explicitly enabled after the new site is approved.
// Staging remains noindex even while hosted at a Vercel preview URL.
const LIVE_HOSTS=new Set(["advaae.com","www.advaae.com"]);
const configured=process.env.ADVA_PUBLIC_ORIGIN||"";
let validLiveOrigin=null;
try{
 const url=new URL(configured);
 if(url.protocol==="https:"&&LIVE_HOSTS.has(url.hostname))validLiveOrigin=url.origin;
}catch{}
export const SITE_IS_LIVE=process.env.ADVA_PUBLIC_LAUNCH==="true"&&Boolean(validLiveOrigin);
export const SITE_ORIGIN=SITE_IS_LIVE?validLiveOrigin:"https://adva-platform-five.vercel.app";
export const PUBLIC_ROBOTS=SITE_IS_LIVE?{index:true,follow:true}:{index:false,follow:false};
