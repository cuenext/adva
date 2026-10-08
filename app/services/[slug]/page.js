import {notFound} from "next/navigation";
import SiteNav from "../../../components/SiteNav";
import SiteFooter from "../../../components/SiteFooter";
import {SERVICES,SERVICE_GROUPS,serviceBySlug} from "../../../lib/services";

export function generateStaticParams(){return SERVICES.map(s=>({slug:s.slug}));}
export async function generateMetadata({params}){
 const {slug}=await params;
 const s=serviceBySlug(slug);
 if(!s)return {title:"Service not found | ADVA"};
 return {title:s.name+" | ADVA Creative & Marketing Abu Dhabi",description:s.short+" "+s.introduction};
}
function Up(){return <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 16 16 4M6 4h10v10"/></svg>}
export default async function ServicePage({params}){
 const {slug}=await params,service=serviceBySlug(slug);
 if(!service)notFound();
 const group=SERVICE_GROUPS.find(g=>g.id===service.group);
 const related=service.related.map(serviceBySlug).filter(Boolean);
 return <div className="website adva-subsite" style={{"--service-accent":group.accent}}>
  <SiteNav/>
  <main>
    <section className="adva-service-hero">
     <div className="container">
      <div className="adva-services-breadcrumb"><a href="/">ADVA</a><span>/</span><a href="/services">SERVICES</a><span>/</span><span>{service.name.toUpperCase()}</span></div>
      <div className="adva-service-hero-grid">
       <div className="adva-service-hero-copy">
        <span className="adva-small-eyebrow"><i/> {service.eyebrow} / {service.number} — 09</span>
        <h1>{service.name}<span>.</span></h1>
        <p className="adva-service-statement">{service.statement}</p>
        <p className="adva-service-lead">{service.introduction}</p>
        <div className="adva-service-hero-actions"><a href={"/brief?service="+service.slug}>Let's discuss your project <Up/></a><a href="#details">Explore the service ↓</a></div>
       </div>
       <div className={"adva-service-art adva-service-art-"+service.group} aria-hidden="true">
        <div className="adva-service-art-grid"/><div className="adva-service-art-orbit one"/><div className="adva-service-art-orbit two"/><div className="adva-service-art-orb"><span>{service.number}</span></div>
        <span className="adva-service-art-caption">CRAFT / {group.label.toUpperCase()}</span>
        <span className="adva-service-art-corner">ADVA <b>✳</b></span>
       </div>
      </div>
     </div>
    </section>
    <section className="adva-service-detail" id="details">
     <div className="container adva-service-detail-grid">
      <div className="adva-service-sticky"><span className="adva-small-eyebrow"><i/> THE DETAILS</span><h2>Thoughtful work.<br/>No guesswork.</h2><p>{service.audience}</p><a href={"/brief?service="+service.slug}>Tell us what you need <Up/></a></div>
      <div className="adva-service-deliverables">
       <div className="adva-service-title-row"><span>01 / WHAT WE DO</span><h3>What goes into it.</h3></div>
       <div className="adva-deliverable-list">{service.deliverables.map((d,i)=><div key={d}><span>{String(i+1).padStart(2,"0")}</span><strong>{d}</strong><span aria-hidden="true">↗</span></div>)}</div>
      </div>
     </div>
    </section>
    <section className="adva-service-process">
     <div className="container"><div className="adva-service-process-head"><span className="adva-small-eyebrow"><i/> 02 / THE PROCESS</span><h2>Good ideas need<br/><em>good execution.</em></h2></div>
       <div className="adva-service-steps">{service.process.map(([title,desc],i)=><article key={title}><div className="adva-step-counter">0{i+1}<span>✳</span></div><h3>{title}</h3><p>{desc}</p></article>)}</div>
     </div>
    </section>
    <section className="adva-service-questions">
     <div className="container adva-service-question-grid"><div><span className="adva-small-eyebrow"><i/> 03 / GOOD TO KNOW</span><h2>A few useful answers.</h2><p>Every project starts somewhere different. Here's the practical part.</p></div>
       <div className="adva-service-faq">{service.questions.map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div>
     </div>
    </section>
    <section className="adva-service-related"><div className="container"><div className="adva-service-related-head"><span className="adva-small-eyebrow"><i/> MORE WAYS TO WORK TOGETHER</span><h2>It all connects.</h2></div>
      <div className="adva-related-grid">{related.map((s,i)=><a href={"/services/"+s.slug} key={s.slug}><span>0{i+1} / RELATED</span><h3>{s.name}</h3><p>{s.short}</p><Up/></a>)}</div>
     </div></section>
    <section className="adva-connect-cta"><div className="container adva-connect-cta-inner"><span>HAVE SOMETHING IN MIND?</span><h2>Tell us the idea.<br/><em>Let's make it real.</em></h2><a href={"/brief?service="+service.slug}>Build a project brief <Up/></a></div></section>
  </main>
  <SiteFooter/>
 </div>;
}