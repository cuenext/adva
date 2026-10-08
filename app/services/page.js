import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import ServicesShowcase from "../../components/ServicesShowcase";

export const metadata={
 title:"Creative, Media & Marketing Services | ADVA Abu Dhabi",
 description:"Explore ADVA's videography, photography, video editing, social media management, website design, marketing, event staffing, branding and event coverage services in Abu Dhabi.",
};
export default function ServicesPage(){
 return <div className="website adva-subsite">
  <SiteNav/>
  <main>
   <section className="adva-services-intro">
    <div className="container">
     <div className="adva-services-breadcrumb"><a href="/">ADVA</a><span>/</span><span>SERVICES</span></div>
     <span className="adva-small-eyebrow"><i/> OUR CAPABILITIES / ABU DHABI & BEYOND</span>
     <h1>Ideas are good.<br/><em>Making them happen is better.</em></h1>
     <p>Photography. Films. Marketing. Digital experiences. People on the ground. Explore what we do, or tell us what you're trying to achieve and we'll help you put the right pieces together.</p>
     <div className="adva-services-intro-actions"><a href="/brief">Build your project brief <span>↗</span></a><a href="#services">See every service ↓</a></div>
     <div className="adva-services-intro-glow" aria-hidden="true"><span>✳</span></div>
    </div>
   </section>
   <ServicesShowcase/>
   <section className="adva-connect-cta"><div className="container adva-connect-cta-inner"><span>HAVE AN IDEA BUT NOT A COMPLETE PLAN?</span><h2>Start with the thought.<br/><em>We'll help shape the rest.</em></h2><a href="/brief">Build a brief <span>↗</span></a></div></section>
  </main><SiteFooter/>
 </div>;
}