import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import {SELECTED_WORK} from "../../lib/selected-work";
import {WORK_COLLECTIONS,WORK_MEDIA,mediaForCollection} from "../../lib/work-library";
import {PUBLIC_ROBOTS} from "../../lib/site-publication";
import "./portfolio.css";

export const metadata={
 title:"Our Work | Film, Social, Events & Commercials — ADVA",
 description:"Explore the ADVA work archive: interviews, social videos, event coverage, marketing, commercials and cinematic social content.",
 robots:PUBLIC_ROBOTS
};

function MediaFrame({item,collection}){
 if(item?.kind==="video")return <video className="adva-portfolio-loaded-media" controls playsInline preload="metadata" poster={item.poster||undefined} aria-label={item.alt||item.title}>
  <source src={item.src} type="video/mp4"/>Your browser cannot play this video.
 </video>;
 if(item?.kind==="image")return <img className="adva-portfolio-loaded-media" src={item.src} alt={item.alt||item.title} loading="lazy" decoding="async"/>;
 return <div className={"adva-portfolio-art adva-portfolio-art--"+collection.slug} aria-hidden="true">
  <div className="adva-portfolio-art-grain"/>
  <div className="adva-portfolio-art-geometry"><i/><i/><i/></div>
  <span className="adva-portfolio-art-number">{collection.index}</span>
  <div className="adva-portfolio-art-identity">
   <span>ADVA / {collection.tag}</span>
   <strong>{collection.artText}</strong>
   <small>FRAME STUDY · MEDIA SLOT</small>
  </div>
 </div>;
}

function CollectionCard({collection}){
 const featured=mediaForCollection(collection.slug)[0];
 return <article id={collection.slug} className={"adva-portfolio-card adva-portfolio-card--"+collection.slug+" adva-portfolio-card--"+collection.layout} aria-labelledby={"collection-"+collection.slug}>
  <div className="adva-portfolio-card-frame">
   <MediaFrame item={featured} collection={collection}/>
   <div className="adva-portfolio-frame-chrome" aria-hidden="true">
    <span>ADVA — {collection.index}</span>
    <span>{featured?"SELECTED FRAME":"ARCHIVE IN PROGRESS"}</span>
   </div>
  </div>
  <div className="adva-portfolio-card-info">
   <span className="adva-portfolio-card-index">{collection.index} / 06</span>
   <div className="adva-portfolio-card-copy">
    <h3 id={"collection-"+collection.slug}>{collection.title}</h3>
    <p>{collection.summary}</p>
   </div>
   <span className="adva-portfolio-card-format">{collection.descriptor}</span>
  </div>
 </article>;
}

export default function WorkIndex(){
 const featuredIds=new Set(WORK_COLLECTIONS.map(category=>mediaForCollection(category.slug)[0]?.id).filter(Boolean));
 const additional=WORK_MEDIA.filter(item=>!featuredIds.has(item.id));
 return <div className="website adva-work-page adva-portfolio-page">
  <SiteNav/>
  <main id="main">
   <section className="adva-portfolio-hero" aria-labelledby="adva-portfolio-title">
    <div className="container adva-portfolio-hero-inner">
     <div className="adva-portfolio-hero-top">
      <span>ADVA / MOTION & IMAGE</span>
      <span>AN EVOLVING ARCHIVE <i aria-hidden="true"/></span>
     </div>
     <div className="adva-portfolio-hero-main">
      <div className="adva-portfolio-headline">
       <span className="adva-portfolio-overline">PORTFOLIO / 001</span>
       <h1 id="adva-portfolio-title">Our work<span className="adva-portfolio-title-dot">.</span><br/><em>In motion.</em></h1>
      </div>
      <div className="adva-portfolio-hero-aside">
       <div className="adva-portfolio-hero-rule"/>
       <p>Interviews, short-form films, event highlights, campaigns and commercials. Different formats. The same attention to the frame.</p>
       <a href="#collections">Explore the formats <span aria-hidden="true">↘</span></a>
      </div>
     </div>
     <div className="adva-portfolio-hero-foot"><span>06 / CREATIVE FORMATS</span><span>SCROLL TO EXPLORE <span aria-hidden="true">↓</span></span></div>
    </div>
    <div className="adva-portfolio-hero-ambient" aria-hidden="true"/>
   </section>

   <section className="adva-portfolio-sections" id="collections" aria-label="Work categories">
    <div className="container">
     <div className="adva-portfolio-section-head">
      <span className="adva-portfolio-eyebrow">01 / THE WORK</span>
      <div className="adva-portfolio-section-heading-row">
       <h2>Six ways<br/>to tell a story.</h2>
       <p>Our collection is taking shape. These are the formats we create; selected finished work will appear here as approved footage and photography are added.</p>
      </div>
     </div>
     <nav className="adva-portfolio-format-nav" aria-label="Jump to a work category">
      {WORK_COLLECTIONS.map(c=><a key={c.slug} href={"#"+c.slug}><span>{c.index}</span>{c.shortTitle}</a>)}
     </nav>
     <div className="adva-portfolio-mosaic">
      {WORK_COLLECTIONS.map(c=><CollectionCard key={c.slug} collection={c}/>)}
     </div>
     <div className="adva-portfolio-archive-foot">
      <span>01—06 / COLLECTIONS</span>
      <p>Real projects. Real frames. Added as they’re ready to publish.</p>
     </div>
    </div>
   </section>

   {additional.length>0&&<section className="adva-portfolio-expanded" aria-labelledby="adva-expanded-title"><div className="container">
    <div className="adva-portfolio-expanded-head"><span className="adva-portfolio-eyebrow">02 / MEDIA LIBRARY</span><h2 id="adva-expanded-title">More frames.</h2></div>
    <div className="adva-portfolio-expanded-grid">{additional.map(item=><figure key={item.id}>
     <div><MediaFrame item={item} collection={WORK_COLLECTIONS.find(c=>c.slug===item.collection)||WORK_COLLECTIONS[0]}/></div>
     <figcaption><strong>{item.title}</strong>{item.note&&<span>{item.note}</span>}</figcaption>
    </figure>)}</div>
   </div></section>}

   <section className="adva-portfolio-projects" id="project-log" aria-labelledby="adva-project-log-title">
    <div className="container">
     <div className="adva-portfolio-projects-head">
      <div><span className="adva-portfolio-eyebrow">02 / PRODUCTION LOG</span><h2 id="adva-project-log-title">On location<span>.</span></h2></div>
      <p>Selected event assignments, documented by scope. Finished media will be introduced as the public collection grows.</p>
     </div>
     <div className="adva-portfolio-project-list">
      {SELECTED_WORK.map((project,i)=><a key={project.slug} className="adva-portfolio-project" href={"/work/"+project.slug}>
       <span className="adva-portfolio-project-index">{String(i+1).padStart(2,"0")}</span>
       <span className="adva-portfolio-project-main"><strong>{project.title}</strong><small>{project.kind}</small></span>
       <span className="adva-portfolio-project-location">{project.location} <span>·</span> {project.year}</span>
       <span className="adva-portfolio-project-arrow" aria-hidden="true">↗</span>
      </a>)}
     </div>
    </div>
   </section>

   <section className="adva-portfolio-end" aria-labelledby="adva-portfolio-end-title">
    <div className="container adva-portfolio-end-inner">
     <span className="adva-portfolio-eyebrow">03 / NEXT PROJECT</span>
     <div className="adva-portfolio-end-row">
      <h2 id="adva-portfolio-end-title">Have something<br/>in mind<span>?</span></h2>
      <div><p>Tell us what you're making. We'll work out the right format together.</p><a href="/brief">Start a project <span aria-hidden="true">↗</span></a></div>
     </div>
    </div>
   </section>
  </main>
  <SiteFooter/>
 </div>;
}
