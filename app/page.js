import CinematicHero from "../components/CinematicHero";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import ServicesShowcase from "../components/ServicesShowcase";

export default function Home(){
 return <div className="website adva-home" id="top">
  <SiteNav/>
  <main>
   <CinematicHero/>
   <ServicesShowcase/>
   <section className="adva-home-approach" id="approach"><div className="container">
    <div className="adva-home-approach-head"><div><span className="adva-small-eyebrow"><i/> HOW WE WORK</span><h2>From brief<br/><em>to delivery.</em></h2></div><p>A clear scope, a production plan and work made for the right audience.</p></div>
    <div className="adva-home-process">{[["01","The brief","Tell us the goal, audience, deadline and what’s already in place."],["02","The plan","We set the approach, team, deliverables and production schedule."],["03","The work","We create, refine and prepare everything for its intended use."]].map(([number,title,description])=><article key={number}><span>{number} /</span><h3>{title}</h3><p>{description}</p></article>)}</div>
    <a href="/brief" className="adva-home-approach-link">Talk us through your idea <span>→</span></a>
   </div></section>
   <section className="adva-about-teaser" id="about">
    <div className="container adva-about-teaser-grid">
      <div className="adva-about-teaser-head"><span className="adva-about-section-name">About ADVA</span><h2>Creative work is<br/>about the people<br/><em>behind it.</em></h2></div>
      <div className="adva-about-teaser-body"><p>Founded in Abu Dhabi in January 2026 by Abdullah Avadoglu, ADVA works across media production, marketing, design and events.</p><p>We build each project around its brief and the people best suited to deliver it.</p><a href="/about">Get to know ADVA <span aria-hidden="true">↗</span></a></div>
    </div>
   </section>
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