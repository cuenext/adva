import {SITE_IS_LIVE,SITE_ORIGIN} from "../lib/site-publication";
export default function robots(){
 return {
  rules:SITE_IS_LIVE?
   [{userAgent:"*",allow:"/",disallow:["/api/","/hq","/portal","/network","/join","/enter","/posting-times"]}]:
   [{userAgent:"*",disallow:"/"}],
  ...(SITE_IS_LIVE?{sitemap:SITE_ORIGIN+"/sitemap.xml"}:{})
 };
}
