"use client";
import {useCallback,useEffect,useMemo,useState} from "react";
import {advaClient} from "./adva-client";

const blank=()=>({projects:[],members:[],clients:[],content:[],plans:[],planNotes:[],metrics:[],contracts:[],finance:[],receipts:[],receiptAllocations:[],leads:[],expenses:[],feedback:[],freelancers:[],jobs:[],jobRequests:[],ndas:[],ndaAcceptances:[],profile:null});
function list(result){return result?.error?[]:(result?.data||[])}

export function useAdvaWorkspace(preferredMode="default"){
 const db=useMemo(()=>advaClient(),[]);
 const [user,setUser]=useState(null),[role,setRole]=useState("checking");
 const [data,setData]=useState(blank),[loading,setLoading]=useState(false),[error,setError]=useState("");
 const [version,setVersion]=useState(0);
 const refresh=useCallback(()=>setVersion(v=>v+1),[]);
 useEffect(()=>{
  if(!db){setRole("configuration");return}
  let alive=true; let seq=0;
  async function check(){
   const version=++seq;
   const {data:auth,error:authError}=await db.auth.getUser();
   if(!alive||version!==seq)return;
   if(authError&&!auth?.user){setUser(null);setRole("guest");return}
   const account=auth?.user||null;
   setUser(account);
   if(!account){setRole("guest");setData(blank());return}
   try{
    const [c,p,clients]=await Promise.all([
     db.rpc("adva_is_ceo"),
     db.from("adva_freelancers").select("*").eq("user_id",account.id).maybeSingle(),
     db.from("adva_project_clients").select("project_id").eq("user_id",account.id).limit(1)
    ]);
    if(!alive||version!==seq)return;
    if(c.error)throw c.error;
    const canCEO=c.data===true,canFreelance=Boolean(p?.data),canClient=Boolean(clients?.data?.length);
    const kind=canCEO?"ceo":preferredMode==="portal"&&canClient?"client":preferredMode==="network"&&canFreelance?"freelancer":canFreelance?"freelancer":canClient?"client":"unlinked";
    setRole(kind);
   }catch{if(alive&&version===seq){setError("Could not verify workspace permissions.");setRole("unlinked")}}
  }
  check();
  const {data:{subscription}}=db.auth.onAuthStateChange(()=>{setTimeout(()=>{if(alive)check()},0)});
  return()=>{alive=false;subscription.unsubscribe()};
 },[db,preferredMode]);
 useEffect(()=>{
  if(!db||["guest","checking","configuration","unlinked"].includes(role))return;
  let active=true;
  setLoading(true);setError("");
  const sel=(table,columns="*")=>db.from(table).select(columns);
  (async()=>{
   const isCEO=role==="ceo";
   const calls=[
     sel("adva_projects"),
     sel("adva_project_members"),
     sel("adva_project_clients"),
     sel("adva_content"),
     sel("adva_content_plans"),
     isCEO||role==="freelancer"?sel("adva_plan_private_notes"):Promise.resolve({data:[]}),
     sel("adva_content_metrics"),
     sel("adva_contracts"),
     isCEO?sel("adva_monthly_finances"):Promise.resolve({data:[]}),
     isCEO?sel("adva_receipts"):Promise.resolve({data:[]}),
     isCEO?sel("adva_receipt_allocations"):Promise.resolve({data:[]}),
     isCEO?sel("adva_leads"):Promise.resolve({data:[]}),
     isCEO?sel("adva_expenses"):Promise.resolve({data:[]}),
     sel("adva_client_feedback"),
     isCEO||role==="freelancer"?sel("adva_freelancers"):user?db.from("adva_freelancers").select("*").eq("user_id",user.id):Promise.resolve({data:[]}),
     role==="client"?Promise.resolve({data:[]}):sel("adva_jobs"),
     role==="client"?Promise.resolve({data:[]}):sel("adva_job_requests"),
     sel("adva_nda_documents"),
     role==="client"?Promise.resolve({data:[]}):sel("adva_nda_acceptances")
   ];
   try{
    const results=await Promise.all(calls);
    if(!active)return;
    const sections=["projects","members","clients","content","plans","planNotes","metrics","contracts","finance","receipts","receiptAllocations","leads","expenses","feedback","freelancers","jobs","jobRequests","ndas","ndaAcceptances"];
    const next={...blank()};
    sections.forEach((name,i)=>{next[name]=list(results[i])});
    next.profile=next.freelancers.find(x=>x.user_id===user?.id)||null;
    setData(next);
    if(results[0]?.error)setError("Could not load project records: "+results[0].error.message);
   }catch{if(active)setError("Workspace couldn't load. Refresh and try again.")}
   finally{if(active)setLoading(false)}
  })();
  return()=>{active=false};
 },[db,role,version,user?.id]);
 return {db,user,role,data,loading,error,setError,refresh};
}
