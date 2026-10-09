import {SELECTED_WORK} from "../lib/selected-work";
export default function SelectedWorkTeaser(){
 const featured=SELECTED_WORK.slice(0,2);
 return <section className="adva-work-teaser" id="work" aria-labelledby="adva-work-teaser-title">
   <div className="container">
    <div className="adva-work-teaser-heading"><div><span className="adva-work-kicker">SELECTED WORK</span><h2 id="adva-work-teaser-title">Out there.<br/><em>Making things.</em></h2></div><p>Recent moments from behind the camera and on the exhibition floor. A little of what we've been making.</p></div>
    <div className="adva-work-teaser-list">{featured.map(p=><a key={p.slug} href={"/work/"+p.slug}><span>{p.number}</span><strong>{p.title}</strong><small>{p.location} / {p.year}</small><b aria-hidden="true">↗</b></a>)}</div>
    <a href="/work" className="adva-work-teaser-more">Explore selected work <span aria-hidden="true">↗</span></a>
   </div>
  </section>
}
