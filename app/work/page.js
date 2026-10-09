import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import {SELECTED_WORK} from "../../lib/selected-work";
import {PUBLIC_ROBOTS} from "../../lib/site-publication";

export const metadata={
 title:"Selected Work | ADVA Creative Production in Abu Dhabi",
 description:"Selected ADVA projects across exhibition media, photography, videography and live-event production in Abu Dhabi and Dubai.",
 robots:PUBLIC_ROBOTS
};

export default function WorkIndex(){
 return <div className="website adva-work-page">
  <SiteNav/>
  <main>
   <section className="adva-work-intro">
    <div className="container">
     <div className="adva-work-intro-top"><span>ADVA / SELECTED WORK</span><span>01—04 / 2026</span></div>
     <h1>Made for<br/><em>the moment.</em></h1>
     <div className="adva-work-intro-bottom">
      <p>A closer look at the briefs we've been part of. Real events, real production and the people doing the work—without dressing a project up as something it isn't.</p>
      <a href="#selected-projects">Explore projects <span aria-hidden="true">↓</span></a>
     </div>
    </div>
   </section>
   <section className="adva-work-index" id="selected-projects" aria-labelledby="work-list-title">
    <div className="container">
     <div className="adva-work-heading"><span>SELECTED WORK / 2026</span><h2 id="work-list-title">Projects in focus.</h2></div>
     <div className="adva-work-rows">
      {SELECTED_WORK.map((project)=><a key={project.slug} href={"/work/"+project.slug} className="adva-work-row">
        <span className="adva-work-row-number">{project.number}</span>
        <div className="adva-work-row-main"><span className="adva-work-row-kind">{project.kind}</span><h3>{project.title}</h3><p>{project.short}</p></div>
        <span className="adva-work-row-location">{project.location}<small>{project.year}</small></span>
        <span className="adva-work-row-arrow" aria-hidden="true">↗</span>
       </a>)}
     </div>
     <div className="adva-work-gallery-note">
      <p>Selected projects are documented here first. Photography and finished films are added only when the relevant publication permissions and final exports are confirmed.</p>
      <a href="/brief">Have a project in mind? <span aria-hidden="true">↗</span></a>
     </div>
    </div>
   </section>
   <section className="adva-work-closer">
    <div className="container"><span>THE NEXT PROJECT</span><h2>Something worth<br/><em>making.</em></h2><a href="/brief">Start a project <span aria-hidden="true">↗</span></a></div>
   </section>
  </main>
  <SiteFooter/>
 </div>
}
