import {SERVICES} from "../lib/services";
import {SELECTED_WORK} from "../lib/selected-work";
import {SITE_IS_LIVE,SITE_ORIGIN} from "../lib/site-publication";
export default function sitemap(){
 if(!SITE_IS_LIVE)return [];
 const now=new Date();
 const paths=["/","/about","/services","/work","/brief",...SERVICES.map(s=>"/services/"+s.slug),...SELECTED_WORK.map(s=>"/work/"+s.slug)];
 return paths.map(path=>({
  url:SITE_ORIGIN+path,
  lastModified:now,
  changeFrequency:path==="/"?"weekly":"monthly",
  priority:path==="/"?1:path==="/work"||path==="/services"?.85:.65
 }));
}
