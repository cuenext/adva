import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import BriefForm from "../../components/BriefForm";
export const metadata={title:"Start a Project | ADVA Creative, Media & Events",description:"Tell ADVA what you're planning. Choose services, share your idea and prepare an enquiry for our Abu Dhabi creative team."};
export default async function BriefPage({searchParams}){
 const query=await searchParams;
 const service=typeof query?.service==="string"?query.service:null;
 return <div className="website adva-subsite"><SiteNav/><main className="adva-brief-page"><div className="container"><div className="adva-services-breadcrumb"><a href="/">ADVA</a><span>/</span><span>START A PROJECT</span></div><div className="adva-brief-heading"><span className="adva-small-eyebrow"><i/> GOOD WORK STARTS SOMEWHERE</span><h1>Tell us what<br/><em>you're thinking.</em></h1><p>No long forms or complicated process. Just the idea, a few details and a way to connect.</p></div><BriefForm initialService={service}/></div></main><SiteFooter/></div>;
}