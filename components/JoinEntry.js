"use client";
import {useAdvaWorkspace} from "../lib/use-adva-workspace";
import JoinJourney from "./JoinJourney";
export default function JoinEntry(){
 const workspace=useAdvaWorkspace("join");
 const {db,user,role,refresh}=workspace;
 if(role==="checking")return <div className="aws-join-loading">Preparing your ADVA experience…</div>;
 if(role==="configuration")return <div className="aws-join-loading">The creative network is awaiting the secure account connection.</div>;
 if(role==="ceo"||role==="freelancer")return <div className="aws-join-already"><a href="/"><img src="/adva-logo.webp" alt="ADVA"/></a><span>ADVA / VERIFIED ACCESS</span><h1>Your next step<br/><em>is waiting.</em></h1><p>{role==="ceo"?"You're already verified as the CEO. Manage recruitment and your network from HQ.":role==="client"?"You're verified as a client. Your project experience is inside the portal.":"You've already created an ADVA creative profile. Your network workspace is ready."}</p><a className="aws-join-next" href={role==="ceo"?"/hq":role==="client"?"/portal":"/network"}>Enter your workspace →</a></div>;
 return <JoinJourney db={db} user={user} role={role} refresh={refresh}/>;
}
