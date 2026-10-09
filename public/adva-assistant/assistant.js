/**
 * ADVA Orb — natural motion and cursor tracking, v4
 * Readable 2.5D head turns and gaze-following, rare synchronized blinks only.
 * No wink, sparkle, dramatic expressions, or constant eye wandering.
 * Public API: ADVAOrb.create(container,{assets?, shellSrc?, leftSrc?, rightSrc?, mouthSrc?})
 * -> { element, blink(), pause(), resume(), setCursor(x,y,bounds), resetCursor(), destroy(), isPaused }
 * No dependencies. Honors prefers-reduced-motion and hidden tabs.
 */
(function(global){
  'use strict';
  const files={shell:'adva-orb-neutral.webp',left:'adva-left-eye.webp',right:'adva-right-eye.webp',mouth:'adva-mouth.webp'};
  const styles=`
.adva-orb-art, .adva-orb-art *{box-sizing:border-box;}
.adva-orb-art{position:relative;width:100%;height:100%;isolation:isolate;user-select:none;-webkit-user-select:none;pointer-events:none;perspective:850px;}
.adva-orb-art .adva-orb-float{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform;transform-origin:50% 51%;}
.adva-orb-art img{display:block;position:absolute;pointer-events:none;max-width:none;user-select:none;-webkit-user-drag:none;}
.adva-orb-art .adva-orb-shell{inset:0;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 15px 20px rgba(0,0,0,.17));}
.adva-orb-art .adva-orb-face{position:absolute;inset:0;pointer-events:none;will-change:transform;transform-origin:50% 50%;}
.adva-orb-art .adva-orb-eye{position:absolute;z-index:2;transform-origin:center;}
.adva-orb-art .adva-orb-eye--left{left:14.583333%;top:37.760417%;width:23.958333%;height:18.229167%;}
.adva-orb-art .adva-orb-eye--right{left:45.3125%;top:38.541667%;width:24.869792%;height:17.838542%;}
/* Smile-to-curiosity morph: one LED ring becomes a big O; the other stays a small o. */
.adva-orb-art .adva-orb-eye img{
 inset:0;width:100%;height:100%;object-fit:fill;transform-origin:center;
 transform:translate3d(var(--eye-x,0px),var(--eye-y,0px),0);
 opacity:calc(1 - var(--curiosity,0));will-change:transform,opacity;
}
.adva-orb-art .adva-orb-eye .adva-orb-curiosity-eye{
 position:absolute;left:50%;top:50%;width:100%;height:115%;display:block;overflow:visible;
 transform:translate(-50%,-50%) scale(var(--curious-scale,.45));
 opacity:var(--curiosity,0);filter:drop-shadow(0 0 2.4px rgba(41,195,252,.56));
 transform-origin:center;will-change:transform,opacity;pointer-events:none;
}
.adva-orb-art .adva-orb-eye--left .adva-orb-curiosity-eye{--curious-scale:var(--left-curious-scale,.40)}
.adva-orb-art .adva-orb-eye--right .adva-orb-curiosity-eye{--curious-scale:var(--right-curious-scale,.40)}
.adva-orb-art .adva-orb-face.is-blinking .adva-orb-curiosity-eye{
 animation:adva-orb-natural-circle-blink 240ms ease-in-out both;
}
@keyframes adva-orb-natural-circle-blink{0%,100%{scale:1 1;filter:brightness(1)}48%,57%{scale:1 .07;filter:brightness(.65)}}
.adva-orb-art .adva-orb-mouth{position:absolute;left:28.385417%;top:55.598958%;width:23.567708%;height:12.239583%;z-index:3;}
.adva-orb-art .adva-orb-mouth img{inset:0;width:100%;height:100%;object-fit:fill;}

/* Expressive state: replace the LED eye arches with glowing full O-shaped eyes. */
/* Refined surprise eyes: translucent blue whites, irises, pupils and tiny reflections. */
/* Eyes darken and close together for a split second, like LED eyes naturally blinking. */
.adva-orb-art .adva-orb-face.is-blinking .adva-orb-eye img{animation:adva-orb-natural-blink 240ms ease-in-out both;}
@keyframes adva-orb-natural-blink{
  0%,100%{opacity:calc(1 - var(--curiosity,0));scale:1 1;filter:brightness(1);}
  36%{opacity:calc(calc(1 - var(--curiosity,0))*.35);scale:1 .87;filter:brightness(.65);}
  47%,57%{opacity:0;scale:1 .80;filter:brightness(.45);}
  77%{opacity:calc(calc(1 - var(--curiosity,0))*.75);scale:1 .96;filter:brightness(.92);}
}
@media(prefers-reduced-motion:reduce){.adva-orb-art *, .adva-orb-art *::before,.adva-orb-art *::after{animation:none!important;transition:none!important;}}
`;
  let styleId=0;
  function makeImg(name,src){const im=document.createElement('img');im.src=src;im.className=name;im.alt='';im.draggable=false;return im;}
  function create(target,opts={}){
    const base=String(opts.assets||'').replace(/\/$/,'');
    const src=(id)=>opts[id+'Src']||(base?base+'/':'')+files[id];
    const holder=document.createElement('div');holder.className='adva-orb-art';holder.setAttribute('aria-hidden','true');
    const levitate=document.createElement('div');levitate.className='adva-orb-float';
    levitate.appendChild(makeImg('adva-orb-shell',src('shell')));
    const face=document.createElement('div');face.className='adva-orb-face';
    function makeCuriousEye(){
      const ns='http://www.w3.org/2000/svg';
      const svg=document.createElementNS(ns,'svg');
      svg.setAttribute('viewBox','0 0 100 100');
      svg.setAttribute('aria-hidden','true');
      svg.setAttribute('class','adva-orb-curiosity-eye');
      const circle=(cx,cy,r,fill,alpha=1)=>{
        const el=document.createElementNS(ns,'circle');
        el.setAttribute('cx',cx.toFixed(2));el.setAttribute('cy',cy.toFixed(2));
        el.setAttribute('r',r.toFixed(2));el.setAttribute('fill',fill);
        if(alpha!==1)el.setAttribute('opacity',alpha.toFixed(2));
        svg.appendChild(el);
      };
      circle(50,50,34.5,'#052947',.26);
      for(let i=0;i<28;i++){
        const angle=2*Math.PI*i/28;
        circle(50+31*Math.cos(angle),50+32*Math.sin(angle),2.75,'#77eaff',.95);
      }
      for(let i=0;i<18;i++){
        const angle=2*Math.PI*i/18;
        circle(50+24*Math.cos(angle),50+25*Math.sin(angle),1.45,'#18a9f5',.65);
      }
      circle(50,50,9,'#0873bc',.90);
      circle(51,51,4.8,'#072647');
      circle(46,45,3.2,'#dcfcff',.96);
      return svg;
    }
    for(const side of ['left','right']){
      const wrapper=document.createElement('span');wrapper.className='adva-orb-eye adva-orb-eye--'+side;
      wrapper.appendChild(makeImg('',src(side)));
      wrapper.appendChild(makeCuriousEye());
      face.appendChild(wrapper);
    }
    const mouth=document.createElement('span');mouth.className='adva-orb-mouth';mouth.appendChild(makeImg('',src('mouth')));face.appendChild(mouth);
    levitate.appendChild(face);holder.appendChild(levitate);target.appendChild(holder);

    const reduced=Boolean(opts.reducedMotion)||Boolean(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
    let dead=false,paused=false,blinking=false,blinkTimer=0,blinkEnd=0,frame=0,lastTime=0;
    let pointerX=0,pointerY=0,followX=0,followY=0,curiosityTarget=0,curiosity=0,largeEyeSide='right';
    const started=performance.now();
    const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
    function stopBlinkClock(){if(blinkTimer){clearTimeout(blinkTimer);blinkTimer=0;}}
    function scheduleBlink(){
      stopBlinkClock();
      if(reduced||dead||paused||document.hidden) return;
      // One synchronized blink, at irregular human-like intervals.
      // No blink or expressions triggered by hover, clicks, or chat opening.
      const delay=10000+Math.random()*8000;
      blinkTimer=global.setTimeout(()=>{blinkTimer=0;if(!dead&&!paused&&!document.hidden)blink();scheduleBlink();},delay);
    }
    function blink(){
      if(dead||paused||reduced||document.hidden||blinking)return false;
      blinking=true;face.classList.remove('is-blinking');
      // Restart the blink animation for manual previews (single blink, never a wink).
      void face.offsetWidth;
      face.classList.add('is-blinking');
      clearTimeout(blinkEnd);
      blinkEnd=global.setTimeout(()=>{face.classList.remove('is-blinking');blinking=false;},255);
      return true;
    }
    function pause(){
      if(dead)return;paused=true;stopBlinkClock();clearTimeout(blinkEnd);
      blinking=false;face.classList.remove('is-blinking');
      levitate.style.transform='none';face.style.transform='none';
      holder.style.setProperty('--curiosity','0');
      holder.style.setProperty('--eye-x','0px');holder.style.setProperty('--eye-y','0px');
    }
    function resume(){if(dead||reduced)return;paused=false;lastTime=0;scheduleBlink();}
    function setCursor(x,y,bounds){
      if(dead||paused||reduced||!bounds)return;
      const cx=bounds.left+bounds.width*.5,cy=bounds.top+bounds.height*.5;
      // Hero: responsive to people moving around the scene.
      // Corner launcher: respond to the ENTIRE screen rather than a tiny 220px hover zone.
      const launcher=bounds.width<200;
      const radiusX=launcher?Math.min(760,Math.max(240,global.innerWidth*.46)):Math.max(165,bounds.width*.70);
      const radiusY=launcher?Math.min(550,Math.max(230,global.innerHeight*.43)):Math.max(165,bounds.height*.73);
      pointerX=clamp((x-cx)/radiusX,-1,1);
      pointerY=clamp((y-cy)/radiusY,-1,1);
      // One actual LED ring expands; its companion remains a small dot.
      // Choose the large eye by cursor side, not oscillating time.
      const distance=Math.hypot(x-cx,y-cy);
      const outerRadius=launcher?Math.max(bounds.width*2.15,180):Math.max(bounds.width*.72,180);
      const innerRadius=launcher?Math.max(bounds.width*.58,54):Math.max(bounds.width*.18,74);
      const closeness=clamp((outerRadius-distance)/(outerRadius-innerRadius),0,1);
      curiosityTarget=closeness*closeness*(3-2*closeness);
      const sideX=x-cx;
      if(curiosityTarget>.12){
        if(sideX < -bounds.width*.10)largeEyeSide='left';
        if(sideX > bounds.width*.10)largeEyeSide='right';
      }
    }
    function resetCursor(){pointerX=0;pointerY=0;curiosityTarget=0;}
    function render(time){
      if(dead)return;
      frame=global.requestAnimationFrame(render);
      if(paused||reduced||document.hidden){lastTime=0;return;}
      const dt=clamp(time-(lastTime||time-16),0,50);lastTime=time;
      // Physics-like lag; eyes can glance just ahead of the body as the visitor moves.
      const smooth=1-Math.exp(-dt/195);
      followX+=(pointerX-followX)*smooth;followY+=(pointerY-followY)*smooth;
      curiosity+=(curiosityTarget-curiosity)*(1-Math.exp(-dt/155));
      const s=holder.clientWidth||240,t=(time-started)/1000;
      // Slow, low amplitude idle movement. Head tracking dominates whenever the cursor moves.
      const x=(Math.sin(t*.42)*.0025+Math.sin(t*.18+.7)*.0014)*s;
      const y=(Math.sin(t*.66+.8)*.007+Math.sin(t*.25)*.0014)*s;
      const roll=.40*Math.sin(t*.35)+.12*Math.sin(t*.14+1.4)+followX*.95;
      const tx=x+followX*s*.018,ty=y+followY*s*.012;
      const pitch=-followY*7.5,yaw=followX*10.5;
      // Explicit perspective + layered facial parallax makes the turn visibly 2.5D, not an almost
      // imperceptible rotateY of a flat image (which was the earlier bug).
      levitate.style.transform=`perspective(${Math.max(430,s*2.05).toFixed(0)}px) translate3d(${tx.toFixed(2)}px,${ty.toFixed(2)}px,0) rotateX(${pitch.toFixed(2)}deg) rotateY(${yaw.toFixed(2)}deg) rotateZ(${roll.toFixed(2)}deg)`;
      face.style.transform=`translate3d(${(followX*s*.014).toFixed(2)}px,${(followY*s*.009).toFixed(2)}px,12px)`;
      holder.style.setProperty('--eye-x',(followX*s*.004).toFixed(2)+'px');
      holder.style.setProperty('--eye-y',(followY*s*.003).toFixed(2)+'px');
      const c=clamp(curiosity,0,1);
      holder.style.setProperty('--curiosity',c.toFixed(3));
      const bigger=.48+.72*c;
      const smaller=.48-.11*c;
      holder.style.setProperty('--left-curious-scale',(largeEyeSide==='left'?bigger:smaller).toFixed(3));
      holder.style.setProperty('--right-curious-scale',(largeEyeSide==='right'?bigger:smaller).toFixed(3));
    }
    function visibility(){if(document.hidden)stopBlinkClock();else if(!paused)scheduleBlink();}
    document.addEventListener('visibilitychange',visibility);
    if(!reduced){frame=global.requestAnimationFrame(render);scheduleBlink();}
    function destroy(){if(dead)return;dead=true;stopBlinkClock();clearTimeout(blinkEnd);global.cancelAnimationFrame(frame);document.removeEventListener('visibilitychange',visibility);holder.remove();}
    return {element:holder,face,blink,pause,resume,setCursor,resetCursor,destroy,get isPaused(){return paused;},get reducedMotion(){return reduced;}};
  }
  global.ADVAOrb={create,styles};
})(window);

/** ADVA Assistant launcher — natural, unobtrusive edition.
 * Load adva-orb-engine.js first. Optional window.ADVA_ASSISTANT_CONFIG:
 * {assetBase:'/assets/adva/', intro:true, onOpen: () => launchYourRealChat()}
 * The default chat panel is only a demonstration; there is no live AI backend.
 */
(()=>{
  'use strict';
  if(document.getElementById('adva-assistant-mount'))return;
  if(/^\/(hq|portal|network|enter)(\/|$)/.test(location.pathname))return;
  if(!window.ADVAOrb){console.error('ADVA: load adva-orb-engine.js first');return;}
  const cfg=window.ADVA_ASSISTANT_CONFIG||{};
  const script=document.currentScript;
  const assets=cfg.assetBase||(script&&script.src?new URL('.',script.src).href:'./');
  const mount=document.createElement('div');mount.id='adva-assistant-mount';document.body.append(mount);
  const shadow=mount.attachShadow({mode:'open'});
  const css=window.ADVAOrb.styles+`
  :host{all:initial;display:block;position:fixed;right:clamp(12px,2.5vw,34px);bottom:clamp(12px,2.1vw,30px);width:138px;height:146px;z-index:2147483000;font-family:Inter,system-ui,-apple-system,'Segoe UI',sans-serif;color:#eff8ff;pointer-events:none;}
  *,*::before,*::after{box-sizing:border-box}
  button{font:inherit;cursor:pointer}button:focus-visible{outline:2px solid #65deee;outline-offset:4px}
  .launcher{position:absolute;right:1px;bottom:0;width:134px;height:134px;background:transparent;border:0;padding:0;pointer-events:auto;transform:translateY(0);transition:filter .22s ease;filter:drop-shadow(0 14px 19px rgba(0,0,0,.36));}
  .launcher:hover{filter:drop-shadow(0 16px 24px rgba(12,103,179,.23)) brightness(1.025)}
  .floor-shadow{position:absolute;bottom:7px;right:31px;width:83px;height:14px;border-radius:50%;background:rgba(0,95,180,.24);filter:blur(12px);pointer-events:none}
  .note{position:absolute;right:126px;bottom:65px;pointer-events:none;white-space:nowrap;opacity:0;transform:translateX(7px);transition:opacity .26s,transform .33s;background:rgba(10,22,34,.96);border:1px solid rgba(110,172,206,.22);color:#e5f4ff;padding:10px 14px;border-radius:11px 11px 3px 11px;font:500 12px/1.25 system-ui,sans-serif;box-shadow:0 12px 30px rgba(0,0,0,.22)}
  .note.visible{opacity:1;transform:translateX(0)}
  .note i{display:inline-block;width:6px;height:6px;border-radius:50%;background:#52dbe9;margin-left:9px;vertical-align:middle}
  .panel{position:absolute;right:5px;bottom:138px;width:min(370px,calc(100vw - 28px));max-height:min(610px,calc(100dvh - 165px));overflow-y:auto;overscroll-behavior:contain;visibility:hidden;opacity:0;pointer-events:none;transform-origin:100% 100%;transform:translateY(7px) scale(.98);transition:opacity .26s,transform .30s cubic-bezier(.2,.8,.3,1),visibility .26s;border-radius:16px;border:1px solid rgba(136,197,227,.20);background:#0b1723;box-shadow:0 20px 65px rgba(0,0,0,.46)}
  .panel.open{visibility:visible;opacity:1;pointer-events:auto;transform:none}
  .head{padding:20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(145,188,211,.13)}
  .head strong{font-size:13px;letter-spacing:.06em}.head small{display:block;margin-top:7px;color:#8dcad9;letter-spacing:.12em;font-size:10px}
  .close{border:1px solid rgba(127,181,204,.19);border-radius:8px;width:32px;height:32px;background:#162a3a;color:#e2f6ff;font-size:22px;line-height:1}
  .content{padding:23px 20px 18px}.content p{margin:0 0 19px;color:#d7e8f2;font-size:14px;line-height:1.65}
  .options{display:grid;gap:8px}.options button{width:100%;padding:12px 14px;text-align:left;color:#dcebf6;background:#112639;border:1px solid rgba(112,172,201,.18);border-radius:9px;font-size:12px;display:flex;justify-content:space-between;align-items:center;gap:14px}.options button:hover{background:#163349}.options button span{font-size:17px;color:#53d6e7}
  .foot{border-top:1px solid rgba(145,188,211,.13);padding:14px 20px;color:#89a2b5;font-size:9px;letter-spacing:.09em}
  @media(max-width:480px){:host{right:8px;bottom:8px;width:107px;height:114px}.launcher{width:103px;height:103px}.floor-shadow{right:22px;width:67px}.note{right:101px;bottom:48px;font-size:11px}.panel{bottom:110px;right:2px;width:min(365px,calc(100vw - 20px));max-height:calc(100dvh - 133px)}}
  @media(prefers-reduced-motion:reduce){.launcher,.panel,.note{transition:none}}

 :host{right:clamp(10px,1.4vw,22px);bottom:clamp(14px,2vw,26px);width:100px;height:112px;}
 .rail{position:fixed;right:0;bottom:27px;height:96px;width:2px;pointer-events:none;background:linear-gradient(180deg,transparent,#148eea 30%,#63e4e0 62%,transparent);box-shadow:0 0 11px #1f95db55;}
 .launcher{right:0;bottom:7px;width:96px;height:96px;z-index:4;transition:transform .4s cubic-bezier(.2,.8,.2,1),filter .3s;}
 .launcher::after{content:"ASK ADVA  ↗";position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);padding:7px 10px;color:#e5f5ff;border:1px solid #6bbddd53;border-radius:7px;background:#091827f0;white-space:nowrap;letter-spacing:.12em;font:800 9px/1 Inter,system-ui,sans-serif;box-shadow:0 8px 20px #0007;}
 .launcher:hover{transform:translateY(-3px);}
 .floor-shadow{right:20px;bottom:7px;width:60px;height:10px;}
 .note{right:93px;bottom:47px;}
 .scrim{position:fixed;inset:0;background:#020a1575;border:0;backdrop-filter:blur(2px);z-index:1;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .34s,visibility .34s}
 .scrim.visible{opacity:1;visibility:visible;pointer-events:auto;}
 .panel{right:0;bottom:113px;width:min(415px,calc(100vw - 24px));height:min(615px,calc(100dvh - 145px));max-height:none;min-height:280px;z-index:3;display:flex;flex-direction:column;overflow:hidden;border-radius:18px;border:1px solid #80c8ed42;background:linear-gradient(160deg,#0b1d2d,#09131e 67%,#0b1c2b);box-shadow:0 30px 95px #000a;transform:translate(16px,31px) scale(.94);filter:blur(4px);transition:transform .45s cubic-bezier(.16,1,.3,1),opacity .35s,filter .39s,visibility .45s;}
 .panel.open{transform:none;filter:none;}
 .panel::before{content:"";height:2px;position:absolute;inset:0 0 auto;background:linear-gradient(90deg,transparent,#2195ef,#5ce5e0,transparent)}
 .head{padding:18px 19px;gap:12px;flex:none}
 .head-group{display:flex;gap:12px;align-items:center}
 .head-mark{width:35px;height:35px;border:1px solid #65dceb47;background:linear-gradient(130deg,#1c5484,#0c2843);border-radius:11px;display:grid;place-items:center}
 .head-mark i{width:18px;height:18px;border:2px solid #4baef0;border-right-color:#58dddd;border-radius:50%;box-shadow:0 0 12px #168ee93d}
 .head strong{font-size:11px}.head small{letter-spacing:0}
 .close{display:grid;place-items:center;flex:none}
 .mode-row{display:flex;align-items:center;gap:8px;padding:9px 20px;border-bottom:1px solid #ffffff15;color:#8cd4df;letter-spacing:.12em;font-size:9px;font-weight:750;flex:none}
 .mode-row i{height:6px;width:6px;border-radius:50%;background:#5ee7dd;box-shadow:0 0 9px #5ee7dd88}
 .mode-row em{font-style:normal;margin-left:auto;color:#738da4}
 .chat-log{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:22px 20px 16px;scrollbar-color:#3c5a70 transparent;scrollbar-width:thin}
 .greeting small{color:#88cdda;font-size:9px;font-weight:800;letter-spacing:.16em}
 .greeting h2{font-weight:750;letter-spacing:-.07em;line-height:1.05;font-size:34px;color:#f0f9ff;margin:12px 0}
 .greeting h2 span{color:#53dfe2}
 .greeting p{max-width:300px;color:#bccede;line-height:1.75;font-size:12px;margin:0 0 20px}
 .suggestions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
 .suggestions[hidden]{display:none}
 .suggestions button{padding:12px 10px;min-height:60px;background:#18394f65;border:1px solid #66c2e22b;border-radius:9px;color:#e0effa;text-align:left;font-size:11px;font-weight:650;display:flex;gap:8px;justify-content:space-between;align-items:flex-start}
 .suggestions button:hover{background:#25547091;border-color:#7ae0f274}
 .suggestions span{color:#65e5e4}
 .bubble{max-width:92%;margin:13px 0;animation:adva-enter .35s both}
 .bubble.user{margin-left:auto;text-align:right}
 .bubble b{display:block;color:#8ccede;margin:0 0 5px 6px;font-size:9px;letter-spacing:.13em}
 .bubble p{display:inline-block;text-align:left;padding:12px 14px;margin:0;border-radius:13px 13px 13px 3px;background:#132c41;border:1px solid #9edaff24;color:#dcecf8;font-size:12px;line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere}
 .bubble.user p{border-radius:13px 13px 3px 13px;background:linear-gradient(110deg,#145fa8,#0a79b1);color:#fff}
 .bubble a{display:block;text-align:left;margin-top:8px;color:#7ce0ed;font-weight:800;font-size:11px;text-decoration:none}
 .bubble a:hover{text-decoration:underline}
 .typing{width:max-content;display:flex;gap:5px;padding:13px 16px;border-radius:11px;background:#173348;margin:12px 0}
 .typing[hidden],.error[hidden]{display:none}
 .typing i{width:6px;height:6px;border-radius:50%;background:#80daed;animation:adva-type 1s ease-in-out infinite}
 .typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.30s}
 .error{font-size:11px;color:#ffcfbf;padding:10px;border-radius:9px;background:#842a2025}
 .composer-area{padding:13px 17px 14px;background:#071523aa;border-top:1px solid #ffffff17;flex:none}
 .composer{display:flex;align-items:center;gap:8px;padding:5px 5px 5px 13px;border:1px solid #90cdeb41;border-radius:11px;background:#13283b}
 .composer:focus-within{border-color:#61d9e9}
 .composer input{flex:1;min-width:0;height:36px;border:0;background:transparent;outline:none;color:#effbff;font-size:12px}
 .composer input::placeholder{color:#7c97ac}
 .composer button{height:36px;width:36px;border:0;border-radius:8px;color:#092333;background:linear-gradient(120deg,#2798f7,#5ddede);font-size:19px}
 .composer button:disabled{opacity:.35;cursor:not-allowed}
 .disclosure{margin:9px 0 12px;text-align:center;color:#829aab;font-size:9px;line-height:1.5}
 .actions{display:flex;justify-content:space-between;gap:12px;border-top:1px solid #ffffff19;padding-top:11px}
 .actions a{color:#c2ddef;font-size:10px;font-weight:750;text-decoration:none}
 .actions a:hover{color:#65e5ee}
 @keyframes adva-enter{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
 @keyframes adva-type{0%,60%,100%{opacity:.4;transform:translateY(0)}30%{opacity:1;transform:translateY(-5px)}}
 @media(max-width:480px){:host{right:8px;bottom:10px;width:78px;height:90px}.launcher{width:76px;height:76px;bottom:8px}.launcher::after{font-size:7px;padding:5px 6px}.floor-shadow{right:16px;bottom:7px;width:48px;height:8px}.note{right:75px;bottom:38px}.panel{right:0;bottom:91px;width:calc(100vw - 14px);height:min(640px,calc(100dvh - 117px));max-height:none}.greeting h2{font-size:31px}.rail{height:68px;bottom:22px}}
 @media(prefers-reduced-motion:reduce){.launcher,.scrim,.panel,.bubble,.typing i{animation:none!important;transition:none!important}}
  `;
  const style=document.createElement('style');style.textContent=css;shadow.append(style);
  const layout=document.createElement('div');
  layout.innerHTML=`
    <div class="rail" aria-hidden="true"></div>
    <button type="button" class="scrim" aria-label="Close assistant"></button>
    <div class="floor-shadow" aria-hidden="true"></div>
    <button class="launcher" type="button" aria-label="Open ADVA AI assistant" aria-controls="adva-panel" aria-expanded="false"></button>
    <div class="note" aria-hidden="true">Ask ADVA anything<i></i></div>
    <section class="panel" id="adva-panel" role="dialog" aria-label="ADVA AI assistant" aria-hidden="true">
      <header class="head"><div class="head-group"><div class="head-mark" aria-hidden="true"><i></i></div><div><strong>ADVA / INTELLIGENCE</strong><small>Let's make something good.</small></div></div><button class="close" type="button" aria-label="Close assistant">×</button></header>
      <div class="mode-row"><i></i><span class="mode">CHECKING CONNECTION</span><em>CREATIVE SUPPORT</em></div>
      <div class="chat-log" role="log" aria-live="polite">
       <div class="greeting"><small>ADVA / YOUR CREATIVE PARTNER</small><h2>What brings<br>you here<span>?</span></h2><p>Hey there. I'm ADVA's digital assistant. What are you working on?</p></div>
       <div class="suggestions"><button type="button" data-prompt="I need a photo or video shoot">Photo & video <span>↗</span></button><button type="button" data-prompt="I want a website and branding">Website & branding <span>↗</span></button><button type="button" data-prompt="I have an upcoming event">Event production <span>↗</span></button><button type="button" data-prompt="I need marketing and social media">Social & marketing <span>↗</span></button></div>
       <div class="typing" role="status" aria-label="Assistant is typing" hidden><i></i><i></i><i></i></div><p class="error" role="alert" hidden></p>
      </div>
      <div class="composer-area"><form class="composer"><label for="adva-question" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)">Your question</label><input id="adva-question" placeholder="Tell me what you're planning..." maxlength="950" autocomplete="off"/><button type="submit" aria-label="Send message">➜</button></form><p class="disclosure">Guided recommendations · Live AI when available.</p><div class="actions"><a href="/brief">Start a project ↗</a><a href="https://wa.me/971585876114" target="_blank" rel="noopener noreferrer">WhatsApp ADVA ↗</a></div></div>
    </section>`;
  shadow.append(layout);

  const trigger=shadow.querySelector('.launcher'),panel=shadow.querySelector('.panel'),note=shadow.querySelector('.note'),close=shadow.querySelector('.close'),scrim=shadow.querySelector('.scrim');
  const log=shadow.querySelector('.chat-log'),suggestions=shadow.querySelector('.suggestions'),form=shadow.querySelector('.composer'),input=shadow.querySelector('#adva-question'),sendButton=form.querySelector('[type=submit]'),modeEl=shadow.querySelector('.mode'),disclosure=shadow.querySelector('.disclosure'),typing=shadow.querySelector('.typing'),error=shadow.querySelector('.error');
  const orb=window.ADVAOrb.create(trigger,{assets,shellSrc:cfg.shellSrc,leftSrc:cfg.leftSrc,rightSrc:cfg.rightSrc,mouthSrc:cfg.mouthSrc});
  let open=false,live=false,busy=false;const history=[];
  const guideItems=[
   {terms:['photo','video','film','shoot','camera','reel','edit'],reply:"ADVA can help with creative direction, videography, photography and editing. What's the project about and when do you need it?",href:'/services/videography',label:'Explore videography'},
   {terms:['website','site','brand','identity','logo','design'],reply:"We can shape the brand and the website together. Is this for a new launch or a refresh of an existing business?",href:'/services/website-design',label:'Explore website design'},
   {terms:['event','expo','exhibition','conference','booth','crew'],reply:"For events, ADVA provides photography, videography and production support. What are the date and location?",href:'/services/event-coverage',label:'Explore event coverage'},
   {terms:['social','instagram','marketing','tiktok','campaign','content','ads'],reply:"We can help with content, social media and campaigns. Is this for an ongoing presence or a specific launch?",href:'/services/social-media-management',label:'Explore social media'}
  ];
  function guide(q){const s=q.toLowerCase();return guideItems.find(v=>v.terms.some(t=>s.includes(t)))||{reply:"ADVA works across film, photography, branding, digital and events. Tell me your goal and I'll help you find a starting point.",href:'/services',label:'Explore services'};}
  function scrollBottom(){log.scrollTop=log.scrollHeight;}
  function addMessage(role,text,link){
   const article=document.createElement('article');article.className='bubble '+role;
   if(role==='assistant'){const badge=document.createElement('b');badge.textContent='ADVA ASSISTANT';article.appendChild(badge);}
   const p=document.createElement('p');p.textContent=text;article.appendChild(p);
   if(link){const a=document.createElement('a');a.href=link.href;a.textContent=link.label+' ↗';article.appendChild(a);}
   log.insertBefore(article,typing);scrollBottom();
  }
  function setOpen(value){
   open=Boolean(value);panel.classList.toggle('open',open);panel.setAttribute('aria-hidden',String(!open));panel.setAttribute('aria-modal',String(open));panel.inert=!open;
   scrim.classList.toggle('visible',open);scrim.tabIndex=open?0:-1;trigger.setAttribute('aria-expanded',String(open));
   note.classList.remove('visible');note.setAttribute('aria-hidden','true');if(open){window.setTimeout(()=>input.focus({preventScroll:true}),250);scrollBottom();}
  }
  async function send(q){
    q=String(q||'').trim().slice(0,950);if(!q||busy)return;
    input.value='';error.hidden=true;history.push({role:'user',text:q});addMessage('user',q);suggestions.hidden=true;
    if(!live){const g=guide(q);history.push({role:'assistant',text:g.reply});addMessage('assistant',g.reply,{href:g.href,label:g.label});return;}
    busy=true;sendButton.disabled=true;typing.hidden=false;scrollBottom();
    try{
      const response=await fetch('/api/assistant',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},cache:'no-store',body:JSON.stringify({messages:history.slice(-10)})});
      const data=await response.json();
      if(!response.ok||typeof data.reply!=='string')throw new Error(data.error||'The assistant is temporarily unavailable.');
      history.push({role:'assistant',text:data.reply.slice(0,1900)});addMessage('assistant',data.reply.slice(0,1900));
    }catch(err){error.textContent=(err&&err.message)||'Connection interrupted. Please try again or contact ADVA.';error.hidden=false;}
    finally{busy=false;sendButton.disabled=false;typing.hidden=true;scrollBottom();}
  }
  panel.inert=true;scrim.tabIndex=-1;
  trigger.addEventListener('click',()=>setOpen(!open));close.addEventListener('click',()=>{setOpen(false);trigger.focus({preventScroll:true});});scrim.addEventListener('click',()=>setOpen(false));
  form.addEventListener('submit',e=>{e.preventDefault();send(input.value);});
  shadow.querySelectorAll('[data-prompt]').forEach(btn=>btn.addEventListener('click',()=>send(btn.dataset.prompt)));
  window.addEventListener('adva:assistant:open',e=>{if(typeof e.detail?.brief==='string')input.value=e.detail.brief.slice(0,950);setOpen(true);});
  window.addEventListener('keydown',e=>{if(!open)return;if(e.key==='Escape'){e.preventDefault();setOpen(false);trigger.focus({preventScroll:true});}if(e.key==='Tab'){const els=[...panel.querySelectorAll('button:not([disabled]),a[href],input:not([disabled])')].filter(n=>n.getClientRects().length);if(els.length&&e.shiftKey&&document.activeElement===els[0]){e.preventDefault();els[els.length-1].focus();}else if(els.length&&!e.shiftKey&&document.activeElement===els[els.length-1]){e.preventDefault();els[0].focus();}}});
  trigger.addEventListener('pointerenter',()=>{if(!open){note.classList.add('visible');note.setAttribute('aria-hidden','false');}});
  trigger.addEventListener('pointerleave',()=>{note.classList.remove('visible');note.setAttribute('aria-hidden','true');});
  document.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')orb.setCursor(e.clientX,e.clientY,trigger.getBoundingClientRect());},{passive:true});
  document.addEventListener('pointerleave',()=>orb.resetCursor());window.addEventListener('blur',()=>orb.resetCursor());
  if(cfg.intro!==false)setTimeout(()=>{if(!open&&!document.hidden){note.classList.add('visible');note.setAttribute('aria-hidden','false');setTimeout(()=>{note.classList.remove('visible');note.setAttribute('aria-hidden','true');},2300);}},2700);
  fetch('/api/assistant',{cache:'no-store'}).then(r=>r.ok?r.json():{available:false}).then(d=>{live=Boolean(d.available);modeEl.textContent=live?'AI CONNECTED':'GUIDED ASSISTANT';disclosure.textContent=live?'Powered by AI. Avoid sharing sensitive information.':'Guided recommendations · Live AI can be enabled later.';}).catch(()=>{modeEl.textContent='GUIDED ASSISTANT';});
  window.ADVA_ASSISTANT_WIDGET={blink:orb.blink,pause:orb.pause,resume:orb.resume,open:()=>setOpen(true),close:()=>setOpen(false),orb};
})();