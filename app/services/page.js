import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import ServicesShowcase from "../../components/ServicesShowcase";
import {AdvaMark} from "../../components/AdvaIcon";

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
     <span className="adva-small-eyebrow"><i/> OUR SERVICES</span>
     <h1>The work<br/><em>we do.</em></h1>
     <p>Film, photography, brands, digital and events. Find exactly what you need.</p>
     <div className="adva-services-intro-actions"><a href="/brief">Build your project brief <span>→</span></a><a href="#services">See every service</a></div>
     <div className="adva-services-intro-glow" aria-hidden="true"><AdvaMark size={195}/></div>
    </div>
   </section>
   <ServicesShowcase/>
   <section className="adva-pathways"><div className="container">
    <div className="adva-pathways-heading"><span className="adva-small-eyebrow"><i/> PROJECT TYPES</span><h2>Start with<br/><em>your brief.</em></h2><p>Choose a starting point. Each selection opens a pre-filled project brief.</p></div>
    <div className="adva-pathways-grid"><a className="adva-pathway" href="/brief?services=branding,website-design,marketing"><div className="adva-pathway-top"><span>01 / BRAND / DIGITAL</span><strong>→</strong></div><h3>Launch your brand</h3><p>Identity, website, marketing. One cohesive start.</p><span className="adva-pathway-next">Build this brief <b>→</b></span></a><a className="adva-pathway" href="/brief?services=videography,video-editing,social-media-management"><div className="adva-pathway-top"><span>02 / CONTENT / SOCIAL</span><strong>→</strong></div><h3>Create content regularly</h3><p>Video, editing and a social presence that works together.</p><span className="adva-pathway-next">Build this brief <b>→</b></span></a><a className="adva-pathway" href="/brief?services=event-coverage,photography,event-staffing"><div className="adva-pathway-top"><span>03 / EVENTS / PEOPLE</span><strong>→</strong></div><h3>Make an event memorable</h3><p>Coverage, photography and the right on-ground people.</p><span className="adva-pathway-next">Build this brief <b>→</b></span></a><a className="adva-pathway" href="/brief?services=website-design,branding,social-media-management"><div className="adva-pathway-top"><span>04 / WEB / CREATIVE</span><strong>→</strong></div><h3>Refresh the digital experience</h3><p>A new website, stronger identity and smarter content.</p><span className="adva-pathway-next">Build this brief <b>→</b></span></a></div>
   </div></section>
   <section className="adva-connect-cta"><div className="container adva-connect-cta-inner"><span>ENQUIRIES</span><h2>Tell us<br/><em>what you need.</em></h2><a href="/brief">Build a brief <span>→</span></a></div></section>
  </main><SiteFooter/>
 </div>;
}