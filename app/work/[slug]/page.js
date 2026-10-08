import { notFound } from "next/navigation";
import { CASES, CASE_KEYS } from "../../../lib/cases";
import "./case.css";
export function generateStaticParams(){return CASE_KEYS.map(slug=>({slug}));}
export async function generateMetadata({params}){
 const {slug}=await params;const item=CASES[slug];
 if(!item)return {title:"Project not found | ADVA"};
 return {title:item.name+" — Selected Work | ADVA",description:item.summary};
}
export default async function CaseStudy({params}){
 const {slug}=await params;
 const c=CASES[slug];if(!c)notFound();
 const next=CASES[CASE_KEYS[(CASE_KEYS.indexOf(slug)+1)%CASE_KEYS.length]];
 const nextSlug=CASE_KEYS[(CASE_KEYS.indexOf(slug)+1)%CASE_KEYS.length];
 return <div className={"case-page case-"+c.tone}>
 <header className="case-header"><a href="/" className="case-brand"><img src="/adva-logo.webp" alt="ADVA"/></a><nav><a href="/#work">All work</a><a href="/#services">Services</a><a href="/#contact">Let's talk ↗</a></nav></header>
 <main><section className="case-hero"><div className="case-container"><div className="case-eyebrow"><span>ADVA / SELECTED WORK</span><span>{c.industry} · {c.year}</span></div><a className="case-back" href="/#work">← Back to selected work</a><p className="case-type">{c.label}</p><h1>{c.title}</h1><p className="case-summary">{c.summary}</p><div className="case-hero-foot"><span>PROJECT / {c.name.toUpperCase()}</span><span>SCROLL TO DISCOVER ↓</span></div></div><div className="case-big-circle"/><div className="case-big-circle case-circle-two"/><span className="case-star">✳</span></section>
 <section className="case-intro"><div className="case-container case-intro-layout"><div><p className="case-section-id">01 / THE BRIEF</p><h2>A little context.</h2><p className="case-lead">{c.introduction}</p><h3>What we set out to do</h3><p className="case-objective">{c.objective}</p></div><aside className="case-contributions"><p className="case-section-id">WHAT WE BROUGHT TO THE PROJECT</p>{c.contribution.map((x,i)=><div key={x}><span>{String(i+1).padStart(2,"0")}</span>{x}</div>)}</aside></div></section>
 <section className="case-process"><div className="case-container"><p className="case-section-id">02 / THE WORK</p><h2>From idea<br/><em>to execution.</em></h2><div className="case-process-grid">{c.moves.map(x=><article key={x.step}><span>{x.step}</span><h3>{x.title}</h3><p>{x.detail}</p></article>)}</div></div></section>
 <section className="case-impact"><div className="case-container case-impact-layout"><div><p className="case-section-id">03 / THE OUTCOME</p><h2>The work speaks<br/><em>for itself.</em></h2><p>{c.note}</p></div><div className="case-impact-number"><strong>{c.stat}</strong><span>{c.statLabel}</span><small>{c.statNote}</small></div></div></section>
 <section className="case-next"><div className="case-container"><p>UP NEXT / SELECTED WORK</p><a href={"/work/"+nextSlug}><span>{next.name}</span><strong>↗</strong></a><div className="case-cta">Have something in mind? <a href="/#contact">Let's make it happen ↗</a></div></div></section>
 </main><footer className="case-footer"><div className="case-container"><a href="/">ADVA.</a><span>© {new Date().getFullYear()} ADVA · ABU DHABI, UAE</span><a href="/privacy">Privacy</a></div></footer></div>;
}
