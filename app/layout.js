import "./globals.css";
import "./reframe.css";
import "./navigation.css";
import "./capabilities.css";
import "./experience.css";
import "./spotlight.css";
import "./hq.css";
import "./activation.css";
import CursorSpotlight from "../components/CursorSpotlight";
export const metadata = {
 title: "ADVA | Creative, Media & Events in Abu Dhabi",
 description: "ADVA is an Abu Dhabi-based creative, media and events agency. Brand transformation, videography, photography, exhibitions, social media, websites and production.",
 applicationName: "ADVA",
 openGraph: { title:"ADVA | Ideas into impact", description:"Creative thinking. Real-world execution. Media, events and brand experiences from Abu Dhabi.",type:"website"},
 robots: {index:false,follow:false}, // Preview staging only; switch when advaae.com migrates.
};
export default function RootLayout({children}){return <html lang="en"><body><CursorSpotlight/>{children}</body></html>;}
