import CinematicHero from "../components/CinematicHero";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import ServicesShowcase from "../components/ServicesShowcase";
import CreativeGallery from "../components/CreativeGallery";
import EditRoom from "../components/EditRoom";
import {AdvaMark} from "../components/AdvaIcon";

export default function Home(){
 return <div className="website adva-home" id="top">
  <SiteNav/>
  <main>
   <CinematicHero/>
   <ServicesShowcase/>
   <CreativeGallery/>
   <EditRoom/>
   <section className="adva-home-approach" id="approach"><div className="container">
    <div className="adva-home-approach-head"><div><span className="adva-small-eyebrow"><i/> HOW WE WORK</span><h2>From brief<br/><em>to delivery.</em></h2></div><p>A clear scope, a production plan and work made for the right audience.</p></div>
    <div className="adva-home-process">{[["01","The brief","Tell us the goal, audience, deadline and what’s already in place."],["02","The plan","We set the approach, team, deliverables and production schedule."],["03","The work","We create, refine and prepare everything for its intended use."]].map(([number,title,description])=><article key={number}><span>{number} /</span><h3>{title}</h3><p>{description}</p></article>)}</div>
    <a href="/brief" className="adva-home-approach-link">Talk us through your idea <span>→</span></a>
   </div></section>
   <section className="adva-home-about" id="about"><div className="container adva-home-about-grid">
    <div className="adva-home-about-art" aria-hidden="true"><AdvaMark size={65} className="adva-home-about-star"/><span className="adva-home-about-a">A.</span><span className="adva-home-about-caption">ABU DHABI / CREATIVE PARTNERS</span></div>
    <div className="adva-home-about-copy"><span className="adva-small-eyebrow"><i/> ABOUT ADVA</span><h2>Independent.<br/><em>Based in Abu Dhabi.</em></h2><p>ADVA brings together production, brand design, digital work and event teams.</p><p>One project might need a film crew. Another needs a website, a content plan or people on site. We build the team around the brief.</p><a href="/services">See what we do <span>→</span></a></div>
   </div></section>
   <section className="adva-home-contact" id="contact"><div className="container">
    <span className="adva-small-eyebrow"><i/> GET IN TOUCH</span>
    <h2>Got a brief?<br/><em>Send it over.</em></h2>
    <p>A few details are enough to begin.</p>
    <div className="adva-home-contact-actions"><a href="/brief">Start a project <span>→</span></a><a href="https://wa.me/971585876114" target="_blank" rel="noopener noreferrer">WhatsApp ADVA <span>→</span></a></div>
   </div></section>
  </main>
  <SiteFooter/>
 </div>;
}