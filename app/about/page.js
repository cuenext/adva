import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import "./about.css";

export const metadata = {
  title: "About ADVA | Creative Production, Digital & Events in Abu Dhabi",
  description: "Meet ADVA, the independent creative agency founded in January 2026 by Abdullah Avadoglu. Film, photography, marketing, design and events in Abu Dhabi."
};

const disciplines = [
  {
    title: "Film & photography",
    detail: "Videography, photography, interviews, editing and event films.",
    href: "/services/videography"
  },
  {
    title: "Brand & digital",
    detail: "Branding, website design, social content and marketing.",
    href: "/services/website-design"
  },
  {
    title: "Events & people",
    detail: "Exhibition coverage, on-site production and event staffing.",
    href: "/services/event-coverage"
  }
];

function Arrow({diagonal=false}) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={diagonal?"M5 19 19 5M8 5h11v11":"M4 12h16m-7-7 7 7-7 7"}/></svg>;
}

export default function About(){
  return <div className="website adva-about-page">
    <SiteNav/>
    <main>
      <section className="adva-about2-hero" aria-labelledby="about-title">
        <div className="container adva-about2-hero-inner">
          <div className="adva-about2-overline">
            <span>About ADVA</span>
            <nav aria-label="About page sections">
              <a href="#our-story">Our story</a>
              <a href="#what-we-do">What we do</a>
              <a href="#our-people">Our people</a>
            </nav>
          </div>
          <div className="adva-about2-hero-grid">
            <h1 id="about-title">
              <span className="adva-about2-line">Creative work</span>
              <span className="adva-about2-line">starts with</span>
              <span className="adva-about2-line adva-about2-blue">people.</span>
            </h1>
            <div className="adva-about2-hero-aside">
              <p>ADVA brings creative thinking and production together—across media, digital and events.</p>
              <div className="adva-about2-facts">
                <div><span>Based in</span><strong>Abu Dhabi, UAE</strong></div>
                <div><span>Established</span><strong>January 2026</strong></div>
              </div>
              <a href="#our-story" className="adva-about2-read">Get to know us <Arrow diagonal/></a>
            </div>
          </div>
          <div className="adva-about2-hero-foot" aria-hidden="true"><span>Independent creative agency</span><span>Abu Dhabi</span></div>
        </div>
      </section>

      <section className="adva-about2-origin" id="our-story" aria-labelledby="about-origin-title">
        <div className="container adva-about2-origin-grid">
          <div className="adva-about2-origin-left">
            <span className="adva-about2-section-label">Our story</span>
            <div className="adva-about2-year" aria-label="Founded in 2026">2026<span className="adva-about2-year-dot">.</span></div>
          </div>
          <div className="adva-about2-origin-copy">
            <h2 id="about-origin-title">A new company.<br/><em>Our own way of working.</em></h2>
            <p>ADVA was founded by <strong>Abdullah Avadoglu</strong> in <strong>January 2026</strong>, with its home in Abu Dhabi.</p>
            <p>We started ADVA to bring creative direction, hands-on production and dependable delivery closer together. From the first conversation to the final export, the details matter.</p>
            <p>Today, the work can mean a film crew on location, a new brand identity, a digital campaign or the people running an event. We bring the right capabilities together around the project—not the other way around.</p>
          </div>
        </div>
      </section>

      <section className="adva-about2-services" id="what-we-do" aria-labelledby="about-services-title">
        <div className="container">
          <div className="adva-about2-services-heading">
            <div><span className="adva-about2-section-label">Our capabilities</span><h2 id="about-services-title">Different disciplines.<br/><em>One clear brief.</em></h2></div>
            <p>We work across production, brand, digital and live events. Every project begins with what actually needs to be done.</p>
          </div>
          <div className="adva-about2-service-list">
            {disciplines.map((s,i)=><a className="adva-about2-service" href={s.href} key={s.title}>
              <span className="adva-about2-service-index">0{i+1}</span>
              <strong>{s.title}</strong>
              <span className="adva-about2-service-detail">{s.detail}</span>
              <span className="adva-about2-service-arrow"><Arrow diagonal/></span>
            </a>)}
          </div>
          <a className="adva-about2-all-services" href="/services">All nine services <Arrow/></a>
        </div>
      </section>

      <section className="adva-about2-team" id="our-people" aria-labelledby="about-people-title">
        <div className="container adva-about2-team-grid">
          <div className="adva-about2-team-label"><span className="adva-about2-section-label">The people</span><span className="adva-about2-team-rule"/></div>
          <div className="adva-about2-team-copy">
            <h2 id="about-people-title">The team depends<br/>on the <em>work.</em></h2>
            <p>ADVA is built around talented individuals who genuinely enjoy what they do. Filmmakers, photographers, editors, designers, marketers and event professionals each bring something different to the table.</p>
            <p>We believe in clear communication, thoughtful planning and the kind of attention to detail that shows in the finished result. No unnecessary layers—just good people doing their best work together.</p>
            <div className="adva-about2-expertise" aria-label="Creative disciplines">
              <span>Production</span><span>Post-production</span><span>Design</span><span>Digital</span><span>Events</span>
            </div>
            <a href="/join" className="adva-about2-join">Work with ADVA <Arrow diagonal/></a>
          </div>
        </div>
      </section>

      <section className="adva-about2-contact" aria-labelledby="about-contact-title">
        <div className="container">
          <span className="adva-about2-section-label">Work with us</span>
          <div className="adva-about2-contact-row">
            <h2 id="about-contact-title">Tell us what<br/>you're planning.</h2>
            <a href="/brief" className="adva-about2-project-link">Start a project <Arrow diagonal/></a>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter/>
  </div>;
}