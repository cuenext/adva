import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import BriefForm from "../../components/BriefForm";
export const metadata={title:"Start a Project | ADVA Creative, Media & Events",description:"Tell ADVA what you're planning. Choose services, share your idea and prepare an enquiry for our Abu Dhabi creative team."};
export default async function BriefPage({searchParams}){
 const query=await searchParams;
 const service=typeof query?.service==="string"?query.service:null;
 const services=typeof query?.services==="string"?query.services.split(",").slice(0,9):[];
 return <div className="website adva-subsite"><SiteNav/><main className="adva-brief-page"><div className="container"><div className="adva-services-breadcrumb"><a href="/">ADVA</a><span>/</span><span>START A PROJECT</span></div><div className="adva-brief-heading"><span className="adva-small-eyebrow"><i/> PROJECT ENQUIRY</span><h1>Tell us about<br/><em>your project.</em></h1><p>Select your services, share the brief and choose how to contact us.</p></div><BriefForm initialService={service} initialServices={services}/></div></main><SiteFooter/></div>;
}