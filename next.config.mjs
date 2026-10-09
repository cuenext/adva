/** ADVA staging security headers.
 * Application permissions are enforced by Supabase RLS; browser headers are
 * defense in depth, not a substitute for authorization.
 */
const securityHeaders=[
 {key:"X-Content-Type-Options",value:"nosniff"},
 {key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
 {key:"X-Frame-Options",value:"DENY"},
 {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=(), payment=()"},
 {key:"Cross-Origin-Resource-Policy",value:"same-origin"},
];
const noCache={key:"Cache-Control",value:"private, no-store, max-age=0"};

const config={
 poweredByHeader:false,
 reactStrictMode:true,
 async headers(){
  return [
   {source:"/:path*",headers:securityHeaders},
   ...["/hq","/portal","/network","/join"].map(source=>({source,headers:[noCache]}))
  ];
 }
};
export default config;
