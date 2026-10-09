import CinematicHero from "../components/CinematicHero";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import ServicesShowcase from "../components/ServicesShowcase";
import {AdvaMark} from "../components/AdvaIcon";

export default function Home(){
 return <div className="website adva-home" id="top">
  <SiteNav/>
  <main>
   <CinematicHero/>
   <ServicesShowcase/>
   <section className="adva-creative-output" id="work">
    <div className="container">
     <div className="adva-output-heading"><div><span className="adva-small-eyebrow"><i/> 02 — THE CREATIVE OUTPUT</span><h2>Ideas you can<br/><em>actually feel.</em></h2></div><p>Film, identities, digital experiences and the moments between.</p></div>
     <div className="adva-output-grid">
      <a href="/services/videography" className="adva-output-tile adva-output-film">
       <div className="adva-output-art"><div className="adva-film-trace"><span/><span/><span/><span/><span/><span/><span/></div><div className="adva-film-orb"/></div>
       <div className="adva-output-tile-info"><div><span>PRODUCTION / 001</span><h3>Motion & story.</h3><p>Films, photographs and edits that look good and have something to say.</p></div><b>→</b></div>
      </a>
      <a href="/services/branding" className="adva-output-tile adva-output-brand">
       <div className="adva-output-art"><span className="adva-brand-art-letter">A<span>.</span></span></div>
       <div className="adva-output-tile-info"><div><span>BRAND / 002</span><h3>Designed to stick.</h3><p>Identities and digital experiences that belong together.</p></div><b>→</b></div>
      </a>
      <a href="/services/event-coverage" className="adva-output-tile adva-output-live">
       <div className="adva-output-art"><span className="adva-live-art-rings"><i/><i/><i/></span></div>
       <div className="adva-output-tile-info"><div><span>EXPERIENCES / 003</span><h3>Made for the moment.</h3><p>Live experiences with a story that travels beyond the event.</p></div><b>→</b></div>
      </a>
     </div>
    </div>
   </section>
   <section className="adva-home-approach" id="approach"><div className="container">
    <div className="adva-home-approach-head"><div><span className="adva-small-eyebrow"><i/> 03 — THE WAY WE WORK</span><h2>One idea.<br/><em>Every detail considered.</em></h2></div><p>One brief, one creative direction, and a team that can carry it through.</p></div>
    <div className="adva-home-process">{[["01","Understand the brief","What are you trying to achieve, who needs to see it, and what should happen next?"],["02","Find the creative direction","We make the strategy, visuals, content and execution feel like one connected project."],["03","Make it real","From preparation to production and polish, we deliver work designed for where it will be seen."]].map(([number,title,description])=><article key={number}><span>{number} /</span><h3>{title}</h3><p>{description}</p></article>)}</div>
    <a href="/brief" className="adva-home-approach-link">Talk us through your idea <span>→</span></a>
   </div></section>
   <section className="adva-home-about" id="about"><div className="container adva-home-about-grid">
    <div className="adva-home-about-art" aria-hidden="true"><AdvaMark size={65} className="adva-home-about-star"/><span className="adva-home-about-a">A.</span><span className="adva-home-about-caption">ABU DHABI / CREATIVE PARTNERS</span></div>
    <div className="adva-home-about-copy"><span className="adva-small-eyebrow"><i/> 04 — HELLO, WE'RE ADVA</span><h2>Made here.<br/><em>Thinking bigger.</em></h2><p>ADVA is an Abu Dhabi-based creative, media and events agency. We work where brand, content, digital and real-world experiences meet.</p><p>Some clients need a single strong video. Others need a complete digital refresh or a team on the ground. We give every brief the attention it deserves.</p><a href="/services">See what we do <span>→</span></a></div>
   </div></section>
   <section className="adva-home-contact" id="contact"><div className="container">
    <span className="adva-small-eyebrow"><i/> 05 — YOUR NEXT MOVE</span>
    <h2>Have something<br/><em>in mind?</em></h2>
    <p>Tell us about it. A rough idea is more than enough to start.</p>
    <div className="adva-home-contact-actions"><a href="/brief">Start a project <span>→</span></a><a href="https://wa.me/971585876114" target="_blank" rel="noopener noreferrer">WhatsApp ADVA <span>→</span></a></div>
   </div></section>
  </main>
  <SiteFooter/>
 </div>;
}