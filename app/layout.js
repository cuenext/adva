import "./globals.css";
import "./reframe.css";
import "./navigation.css";
import "./navigation-v4.css";
import "./capabilities.css";
import "./experience.css";
import "./spotlight.css";
import "./activation.css";
import "./refinement-v4.css";
import "./v5-services.css";
import "./v5-layout.css";
import "./editorial.css";
import "./work/work.css";
import CursorSpotlight from "../components/CursorSpotlight";
import Script from "next/script";
import {SITE_ORIGIN,PUBLIC_ROBOTS} from "../lib/site-publication";
export const metadata = {
 metadataBase:new URL(SITE_ORIGIN),
 title: "ADVA | Creative, Media & Events in Abu Dhabi",
 description: "ADVA is an Abu Dhabi-based creative, media and events agency. Brand transformation, videography, photography, exhibitions, social media, websites and production.",
 applicationName: "ADVA",
 openGraph: {title:"ADVA | Creative, Media & Events in Abu Dhabi",description:"Film, photography, digital and exhibition production from Abu Dhabi.",type:"website",siteName:"ADVA",locale:"en_AE"},
 robots: PUBLIC_ROBOTS, // Staging noindex; explicit approval required for production indexing.
};
export default function RootLayout({children}){return <html lang="en"><body><CursorSpotlight/>{children}<Script src="/adva-assistant/assistant.js" strategy="afterInteractive" /></body></html>;}
