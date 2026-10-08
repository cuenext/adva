"use client";

import {useEffect,useRef} from "react";

/**
 * ADVA's flashlight interaction — one requestAnimationFrame loop for both the
 * atmospheric halo and section-level light. Does not move React state.
 * Disabled on touch and when reduced motion is requested.
 */
export default function CursorSpotlight(){
 const light=useRef(null);
 useEffect(()=>{
  const fine=window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  const root=document.documentElement;
  if(reduce.matches)return;
  const allowLight=fine.matches;
  const el=light.current;
  if(!el)return;
  let frame=0,inside=false,visible=false;
  const pointer={x:window.innerWidth*.5,y:window.innerHeight*.44};
  const position={...pointer};
  const hot=[];
  const addRevealTargets=()=>{
    const selector=[
     ".adva-exp-intro",".adva-output-heading",".adva-output-tile",
     ".adva-home-approach-head",".adva-home-process article",
     ".adva-home-about-copy",".adva-home-about-art",".adva-home-contact",
     ".adva-pathways-heading",".adva-pathway",".adva-service-steps article",
     ".adva-related-grid > a",".adva-services-intro h1"
    ].join(",");
    return Array.from(document.querySelectorAll(selector));
  };
  let observer=null;
  if("IntersectionObserver" in window){
    const targets=addRevealTargets();
    observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("adva-seen");
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.07,rootMargin:"0px 0px -30px 0px"});
    for(const node of targets){
      const bounds=node.getBoundingClientRect();
      if(bounds.bottom>0 && bounds.top<window.innerHeight*.9){
        node.classList.add("adva-seen");
      }else{
        node.classList.add("adva-await-reveal");
        observer.observe(node);
      }
    }
  }
  const onMove=(e)=>{
    if(e.pointerType && e.pointerType!=="mouse" && e.pointerType!=="pen")return;
    pointer.x=e.clientX;pointer.y=e.clientY;
    if(!visible){visible=true;root.classList.add("adva-spotlight-live");}
    const card=e.target?.closest?.(".adva-output-tile,.adva-pathway,.adva-exp-row,.adva-brief-service,.adva-mega-link,.adva-related-grid > a,.adva-nav-cta");
    if(card){
      const r=card.getBoundingClientRect();
      card.style.setProperty("--local-x",((e.clientX-r.left)/r.width*100).toFixed(2)+"%");
      card.style.setProperty("--local-y",((e.clientY-r.top)/r.height*100).toFixed(2)+"%");
    }
  };
  const onLeave=()=>{root.classList.remove("adva-spotlight-live");visible=false};
  const move=()=>{
    position.x+=(pointer.x-position.x)*.115;
    position.y+=(pointer.y-position.y)*.115;
    el.style.transform="translate3d("+position.x+"px,"+position.y+"px,0) translate(-50%,-50%)";
    frame=requestAnimationFrame(move);
  };
  root.classList.add("adva-enhanced-motion");
  if(allowLight){
    window.addEventListener("pointermove",onMove,{passive:true});
    window.addEventListener("blur",onLeave);
    document.addEventListener("mouseleave",onLeave);
    move();
  }
  return()=>{
    cancelAnimationFrame(frame);
    observer?.disconnect();
    root.classList.remove("adva-spotlight-live","adva-enhanced-motion");
    window.removeEventListener("pointermove",onMove);
    window.removeEventListener("blur",onLeave);
    document.removeEventListener("mouseleave",onLeave);
  };
 },[]);
 return <div ref={light} className="adva-flashlight" aria-hidden="true">
  <div className="adva-flashlight-ambient"/>
  <div className="adva-flashlight-core"/>
 </div>;
}
