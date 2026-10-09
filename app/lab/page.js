import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import CreativeGallery from "../../components/CreativeGallery";
import EditRoom from "../../components/EditRoom";
export const metadata={
 title:"ADVA Lab | Original Creative Studies",
 description:"Original motion, typography, brand, website and event design explorations by ADVA. Concepts, not client case studies.",
 robots:{index:false,follow:false}
};
export default function Lab(){
 return <div className="website adva-lab">
  <SiteNav/>
  <main>
   <section className="adva-lab-intro"><div className="container">
    <span className="adva-v5-kicker">ADVA / LABORATORY</span>
    <h1>ADVA <em>Lab.</em></h1>
    <p>A space for visual ideas we want to try. No invented clients, no performance claims. Just original studies in design, motion and digital experiences.</p>
    <a href="#studies">Explore the studies <span aria-hidden="true">↓</span></a>
   </div></section>
   <CreativeGallery full/>
   <EditRoom/>
   <section className="adva-lab-close"><div className="container"><span className="adva-v5-kicker">LET'S TALK</span><h2>Have a project<br/><em>in mind?</em></h2><a href="/brief">Start a project <span aria-hidden="true">↗</span></a></div></section>
  </main>
  <SiteFooter/>
 </div>
}