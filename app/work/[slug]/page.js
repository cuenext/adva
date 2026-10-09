import {notFound} from "next/navigation";
import SiteNav from "../../../components/SiteNav";
import SiteFooter from "../../../components/SiteFooter";
import {SELECTED_WORK,selectedWorkBySlug} from "../../../lib/selected-work";

export function generateStaticParams(){return SELECTED_WORK.map(item=>({slug:item.slug}));}
export async function generateMetadata({params}){
 const {slug}=await params;
 const project=selectedWorkBySlug(slug);
 if(!project)return {title:"Project not found | ADVA",robots:{index:false}};
 return {title:project.title+" | Selected Work — ADVA",description:project.intro,robots:{index:false,follow:false}};
}
export default async function WorkCase({params}){
 const {slug}=await params;
 const project=selectedWorkBySlug(slug);
 if(!project)notFound();
 const index=SELECTED_WORK.findIndex(p=>p.slug===project.slug);
 const next=SELECTED_WORK[(index+1)%SELECTED_WORK.length];
 return <div className="website adva-work-page adva-work-case">
  <SiteNav/>
  <main>
   <section className="adva-case-hero">
    <div className="container">
     <div className="adva-case-breadcrumb"><a href="/work">← All work</a><span>{project.number} / {String(SELECTED_WORK.length).padStart(2,"0")}</span></div>
     <div className="adva-case-hero-grid">
      <div><span className="adva-case-label">{project.kind} / {project.year}</span><h1>{project.title}<span className="adva-case-heading-dot">.</span></h1></div>
      <div className="adva-case-side"><span>{project.location}</span><p>{project.intro}</p></div>
     </div>
    </div>
   </section>
   <section className="adva-case-info">
    <div className="container adva-case-info-grid">
     <div className="adva-case-info-title"><span>THE BRIEF / {project.number}</span><h2>{project.short}</h2></div>
     <div className="adva-case-info-body">
      <h3>On the ground</h3><p>{project.story}</p>
      <h3>Our approach</h3><p>{project.approach}</p>
      <div className="adva-case-services"><span>PRODUCTION SCOPE</span><div>{project.deliverables.map(s=><span key={s}>{s}</span>)}</div></div>
     </div>
    </div>
   </section>
   {project.media.length>0&&<section className="adva-case-gallery" aria-label="Approved final work"><div className="container">{project.media.map((item,i)=>item.type==="video"?<video key={i} controls preload="metadata" poster={item.poster||undefined}><source src={item.src} type="video/mp4"/>Your browser cannot play this video.</video>:<figure key={i}><img src={item.src} alt={item.alt} loading="lazy"/>{item.caption&&<figcaption>{item.caption}</figcaption>}</figure>)}</div></section>}
   <section className="adva-case-next">
     <div className="container"><span>NEXT PROJECT</span><a href={"/work/"+next.slug}><strong>{next.title}</strong><span aria-hidden="true">↗</span></a></div>
   </section>
  </main>
  <SiteFooter/>
 </div>;
}
