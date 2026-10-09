import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import "./privacy.css";

export const metadata={
 title:"Privacy & Your Information | ADVA",
 description:"How ADVA handles enquiries, client accounts, creative profiles, media submissions and project collaboration.",
 robots:{index:false,follow:false}
};
const sections=[
 ["01","The information you choose to share","ADVA may receive your name, work email, business name, project description, proposed budget, service selections and contact preferences when you submit an enquiry. Account holders may supply display names, specialties, availability, age range confirmation, portfolios, content comments and project details. The CEO records financial and contract information in separate restricted systems."],
 ["02","Why we use it","We use enquiries to respond and prepare relevant service proposals. Verified accounts give authorized people access to assigned projects, agreed deliverables, internal production schedules, employment opportunities and account administration. Profile information helps ADVA assess suitable project matches. We do not treat joining the network as an employment offer."],
 ["03","Who can see it","Access is restricted by role and assignment. Clients only see content, strategies, contracts and metrics the CEO has explicitly shared with their project; assigned freelancers see permitted workspaces; the CEO sees financial and administrative records. Approved freelancer profiles can be discovered by other authenticated and NDA-authorized creators. Uploaded portfolio files are private, subject to these access rules."],
 ["04","AI and social analytics","The guided search on the marketing website does not send each typed word to an AI service. If live ADVA AI is activated, messages you deliberately send will be processed by an AI provider to generate responses. The assistant has no access to private client finances. Social results are labeled manual or official API; we do not invent reach, views or engagements."],
 ["05","Security, verification and confidentiality","We use Supabase for verified account access and private project data, and Vercel to host the interface. Confidentiality acceptance records, where legally reviewed agreements are activated, may be retained with account identity and timestamps. Permissions are enforced in the database. Avoid sending patient-identifiable, banking or other sensitive personal information through an initial project enquiry."],
 ["06","Hosting, storage and third parties","Our providers may process or host some data outside the UAE. This staging platform is undergoing review of applicable cross-border transfer, data-protection and retention requirements before a full public launch. Links that take you to email, WhatsApp or another service are governed by the relevant provider's privacy terms."],
 ["07","Your choices","You can request information, correction or deletion of personal information associated with your account or enquiry by contacting ADVA. Requests will be reviewed under applicable law, contractual obligations and required retention. A freelancer profile should only contain work you have permission to share."],
 ["08","Cookies and future features","Account sign-in uses authentication session storage. This preview does not advertise automatic third-party ad tracking. If new analytics, cookies, AI features or integrations are activated, the disclosures and consent mechanisms will be reviewed and updated first."]
];
export default function Privacy(){
 return <div className="website adva-subsite"><SiteNav/><main className="adva-privacy-v2">
  <div className="container"><div className="adva-services-breadcrumb"><a href="/">ADVA</a><span>/</span><span>PRIVACY</span></div><span className="adva-small-eyebrow"><i/> ADVA / PERSONAL DATA</span>
    <h1>Your information.<br/><em>Handled with care.</em></h1>
    <div className="adva-privacy-v2-intro"><p>Creativity works better when the people behind it can trust the process. This notice describes how ADVA's staging website and private workspaces handle information.</p><span>PRE-LAUNCH NOTICE<br/>OCTOBER 2026</span></div>
    <div className="adva-privacy-v2-sections">{sections.map(([id,title,body])=><section key={id}><span>{id}</span><div><h2>{title}</h2><p>{body}</p></div></section>)}</div>
    <div className="adva-privacy-v2-contact"><span>QUESTIONS ABOUT YOUR INFORMATION?</span><h2>Talk to ADVA.</h2><a href="mailto:inquiries@advaae.com">inquiries@advaae.com →</a><p>This notice is a working pre-launch disclosure and is subject to legal review. It is not a substitute for a compliant final privacy policy appropriate to the registered legal entity and all active processing activities.</p></div>
  </div>
 </main><SiteFooter/></div>;
}
