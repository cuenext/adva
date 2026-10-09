import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import "./about.css";

export const metadata = {
  title: "About ADVA | Creative Production, Digital & Events in Abu Dhabi",
  description: "ADVA is an independent creative agency in Abu Dhabi, founded by Abdullah Avadoglu in January 2026. Explore our story, people and work across media, digital and events."
};

const disciplines = [
  {
    title: "Film & photography",
    detail: "Video production, photography, interviews, event highlights and editing.",
    href: "/services/videography"
  },
  {
    title: "Brand & digital",
    detail: "Brand identities, websites, campaign creative and social content.",
    href: "/services/website-design"
  },
  {
    title: "Events & people",
    detail: "Photography, film and on-site teams for exhibitions and live events.",
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
              <p>ADVA works across film, photography, design, marketing and live events. We combine creative thinking with practical production, from the first brief to delivery.</p>
              <div className="adva-about2-facts">
                <div><span>Based in</span><strong>Abu Dhabi, UAE</strong></div>
                <div><span>Founded</span><strong>January 2026</strong></div>
              </div>
              <a href="#our-story" className="adva-about2-read">Discover our story <Arrow diagonal/></a>
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
            <h2 id="about-origin-title">The story<br/><em>so far.</em></h2>
            <p>ADVA was founded in Abu Dhabi in <strong>January 2026</strong> by <strong>Abdullah Avadoglu</strong>.</p>
            <p>We started ADVA to bring media production, design, marketing and event services closer together. Our aim is to make working with a creative team straightforward, from the first conversation to the finished work.</p>
            <p>Some projects need a photographer or film crew. Others need a website, a content plan or people on the exhibition floor. We take the time to understand what each brief calls for, then put the right team and plan in place.</p>
          </div>
        </div>
      </section>

      <section className="adva-about2-services" id="what-we-do" aria-labelledby="about-services-title">
        <div className="container">
          <div className="adva-about2-services-heading">
            <div><span className="adva-about2-section-label">Our capabilities</span><h2 id="about-services-title">Film, digital<br/><em>and events.</em></h2></div>
            <p>We produce films and photography, create brands and digital content, and support exhibitions and live events.</p>
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
            <h2 id="about-people-title">People who care<br/>about the <em>details.</em></h2>
            <p>We work with filmmakers, photographers, editors, designers, marketers and event professionals. Each brings specialist skills and a genuine interest in making work they're proud of.</p>
            <p>We value people who take pride in their craft, ask good questions and follow through. For us, how a project is handled matters just as much as how it looks when it is finished.</p>
            <div className="adva-about2-expertise" aria-label="Creative disciplines">
              <span>Production</span><span>Post-production</span><span>Design</span><span>Digital</span><span>Events</span>
            </div>
            <a href="/join" className="adva-about2-join">Join our creative network <Arrow diagonal/></a>
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