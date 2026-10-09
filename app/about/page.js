import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";

export const metadata = {
 title: "About ADVA | Creative Agency in Abu Dhabi",
 description: "Founded by Abdullah Avadoglu in January 2026, ADVA is an independent Abu Dhabi creative agency working across media, marketing, design and events."
};

const disciplines = [
 {n:"01",title:"Film & photography",desc:"Campaign filming, exhibitions, interviews, photography and post-production.",link:"/services/videography"},
 {n:"02",title:"Brand & digital",desc:"Brand identity, websites, marketing campaigns and ongoing content.",link:"/services/website-design"},
 {n:"03",title:"Events & people",desc:"Exhibition coverage, on-site production and event staffing.",link:"/services/event-coverage"}
];
export default function About(){
 return <div className="website adva-about-page">
  <SiteNav/>
  <main>
   <section className="adva-about-lead">
    <div className="container adva-about-lead-copy">
     <div><span className="adva-about-section-name">About ADVA</span><h1>Built on the people<br/><em>behind the work.</em></h1></div>
     <p>We are an independent creative agency based in Abu Dhabi. Different disciplines, one shared focus: doing the work properly.</p>
    </div>
    <div className="adva-about-lead-photo"><img src="/adva-crew-hero.webp" alt="ADVA crew member on location at a UAE exhibition" width="720" height="480" fetchPriority="high"/></div>
   </section>
   <section className="adva-about-origin"><div className="container adva-about-origin-grid">
    <div><span className="adva-about-section-name">Our story</span><h2>A new agency.<br/><em>A clear direction.</em></h2></div>
    <div className="adva-about-origin-prose">
     <p>ADVA was founded by <strong>Abdullah Avadoglu</strong> in <strong>January 2026</strong>, in Abu Dhabi, United Arab Emirates.</p>
     <p>It started with a simple idea: bring good creative thinking and dependable execution together. Our work spans professional video and photography, marketing content, websites, brand design, event coverage and staffing.</p>
     <p>Each project is different. We listen first, decide what the work actually needs, then bring together the people and skills to make it happen.</p>
    </div>
   </div></section>
   <section className="adva-about-disciplines"><div className="container">
    <div className="adva-about-disciplines-head"><span className="adva-about-section-name">What we do</span><h2>One team, shaped<br/>around the brief.</h2><p>From a single shoot to a larger production or event, the scope decides the team.</p></div>
    <div className="adva-about-discipline-list">{disciplines.map(item=><a href={item.link} className="adva-about-discipline" key={item.n}><span className="adva-about-discipline-number">{item.n}</span><strong>{item.title}</strong><span className="adva-about-discipline-desc">{item.desc}</span><span className="adva-about-discipline-arrow" aria-hidden="true">↗</span></a>)}</div>
    <a className="adva-about-view-services" href="/services">Explore all services <span aria-hidden="true">↗</span></a>
   </div></section>
   <section className="adva-about-people"><div className="container adva-about-people-grid">
    <span className="adva-about-section-name">Our approach</span><div><h2>Good work takes<br/><em>good people.</em></h2>
    <p>We're built around filmmakers, photographers, editors, designers, marketers and event professionals who care about the details. We value people who take pride in what they make, work well together and stand behind the result.</p>
    <p>We don't believe every project needs the same process or the same-sized team. What matters is having the right people, a clear plan and a result we can stand behind.</p>
    <a href="/join">Interested in working with ADVA? <span aria-hidden="true">↗</span></a></div>
   </div></section>
   <section className="adva-about-last"><div className="container"><h2>Have a project<br/>in mind?</h2><a href="/brief">Start a project <span aria-hidden="true">↗</span></a></div></section>
  </main>
  <SiteFooter/>
 </div>
}