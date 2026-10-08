import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
export const metadata={title:"Privacy & Data Handling | ADVA",description:"How ADVA handles website enquiries and AI-assisted project conversations."};
export default function Privacy(){
 return <div className="website adva-subsite"><SiteNav/>
  <main className="adva-privacy"><div className="container">
   <div className="adva-services-breadcrumb"><a href="/">ADVA</a><span>/</span><span>PRIVACY</span></div>
   <span className="adva-small-eyebrow"><i/> YOUR INFORMATION MATTERS</span>
   <h1>Privacy is part<br/><em>of good design.</em></h1>
   <p className="adva-privacy-intro">This notice explains how ADVA handles information submitted through the website and its project enquiry tools. Updated 9 October 2026. The new website is currently in a staging phase.</p>
   <div className="adva-privacy-sections">
    <section><h2>What we collect</h2><p>If you submit an enquiry through our secure form after it has been activated, we collect the information you provide: your name, email address, company, description of your project, selected services, timing, location and an optional budget indication. We also keep an enquiry status and date for our internal follow-up.</p><p>Please do not submit patient details, medical records, identification documents, payment-card information, passwords or other sensitive information through initial project forms.</p></section>
    <section><h2>How project enquiries work</h2><p>The project-brief tool can prepare a message for your email or WhatsApp app. That alone does not send data to ADVA. Once secure submission is enabled, you'll see a separate “Send to ADVA securely” button and a consent checkbox. Only pressing that button sends the brief to our internal enquiry database.</p><p>ADVA uses those details to respond, assess the project and prepare proposals. Enquiries are accessible only to authorised staff through a role-protected internal system.</p></section>
    <section><h2>ADVA AI</h2><p>When the assistant is marked “Guided preview,” suggestions are generated locally from predefined service descriptions, without transmitting the conversation to a generative AI service. When marked “Live concierge,” messages you choose to send are processed by OpenAI through our server to generate responses. We do not intend to use these messages to make automated decisions about you, and a person reviews actual commercial proposals.</p></section>
    <section><h2>Technology providers</h2><p>Our website is hosted on Vercel. When enabled, enquiry storage is provided by Supabase, AI responses by OpenAI, and technical abuse protection by Upstash. If you choose WhatsApp or email, your message is handled by the communication provider you use. Provider processing may occur outside the UAE; we review those arrangements before public activation.</p></section>
    <section><h2>Security and retention</h2><p>We use restricted database permissions, authenticated staff access and HTTPS connections. Technical abuse-prevention data is limited to temporary hashed identifiers. We retain project-enquiry records only while reasonably needed to handle the relationship, meet applicable obligations or resolve disputes, and periodically review records for deletion. No website can guarantee absolute security.</p></section>
    <section><h2>Your choices</h2><p>For questions, corrections, access requests, withdrawal of consent or deletion requests, email <a href="mailto:inquiries@advaae.com">inquiries@advaae.com</a>. We assess and respond in accordance with applicable UAE data-protection requirements and relevant legal retention obligations.</p></section>
   </div>
   <div className="adva-privacy-note">This notice must be reviewed alongside the final hosting, analytics, cross-border processing and client-content arrangements before the website replaces the current Squarespace site.</div>
  </div></main><SiteFooter/>
 </div>;
}
