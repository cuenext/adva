import {SERVICE_GROUPS,servicesInGroup} from "../lib/services";
export default function SiteFooter(){
 return <footer className="adva-global-footer">
   <div className="container">
     <div className="adva-footer-main">
       <div className="adva-footer-message"><a href="/" aria-label="ADVA home"><img src="/adva-logo.webp" alt="ADVA"/></a><p>ADVA.<br/>Film. Digital. Events.</p><a href="/brief">Start a project <span>→</span></a></div>
       <div className="adva-footer-columns">
         <div><strong>EXPLORE</strong><a href="/services">All services</a><a href="/#approach">How we work</a><a href="/#about">About</a><a href="/brief">Start a project</a><a href="/join">Join our team</a><a href="/portal">Client portal</a></div>
         <div><strong>CAPABILITIES</strong>{["videography","photography","video-editing","social-media-management","website-design","marketing","event-staffing"].map(slug=>{const x=SERVICE_GROUPS.flatMap(g=>servicesInGroup(g.id)).find(s=>s.slug===slug);return x?<a href={"/services/"+slug} key={slug}>{x.name}</a>:null})}</div>
         <div><strong>CONNECT</strong><a href="mailto:inquiries@advaae.com">Email us →</a><a href="https://wa.me/971585876114" target="_blank" rel="noopener noreferrer">WhatsApp →</a><a href="https://www.instagram.com/adva.ae/" target="_blank" rel="noopener noreferrer">Instagram →</a><a href="/privacy">Privacy</a></div>
       </div>
     </div>
     <div className="adva-footer-bottom"><span>© {new Date().getFullYear()} ADVA</span><span>ABU DHABI · MADE FOR WHAT'S NEXT</span><span>CREATIVE · MEDIA · EXPERIENCES</span></div>
   </div>
 </footer>;
}