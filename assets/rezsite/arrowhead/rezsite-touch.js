/** RezSite v1.3 APPROVED touch landing animation. No dependencies. */
export function installRezSiteTouchEffect({
  svgUrl = new URL('./arrowhead.svg', import.meta.url).href,
  selector = 'a,button,[role="button"],[data-rez-touch]',
  ignoreSelector = 'input,textarea,select,[contenteditable],[role="textbox"],[data-rez-no-touch]',
  allowAnywhere = false, // DEMO ONLY. In production keep false.
  testWithMouse = false, // DEMO ONLY. In production keep false.
  travel = 105,
  duration = 440,
  maxEffects = 80,
  enabled = true
} = {}) {
  const controller = new AbortController();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Set(), nodes = new Set(), pending = new Map();
  let svg = '', disposed = false;
  const own = node => {nodes.add(node);document.body.appendChild(node);return node;};
  function spawn(kind,x,y) {
    if(nodes.size >= maxEffects)return null;
    const el=document.createElement('div');el.className=kind;
    el.style.left=x+'px';el.style.top=y+'px';
    return own(el);
  }
  function animate(el,keyframes,options) {
    if(!el)return;
    // fill:'both' keeps delayed trail sparks hidden (opacity 0) until their turn, so they follow the arrowhead instead of all appearing at once.
    const animation=el.animate(keyframes,{...options,fill:'both'});
    active.add(animation);
    const clean=()=>{active.delete(animation);nodes.delete(el);el.remove();};
    animation.onfinish=clean;animation.oncancel=clean;
    return animation;
  }
  function ring(x,y) {
    const el=spawn('rs-touch-ring',x,y);
    animate(el,[{transform:'translate(-50%,-50%) scale(.2)',opacity:1},{transform:'translate(-50%,-50%) scale(5.2)',opacity:0}],{duration:380,easing:'ease-out'});
  }
  function sparks(x,y,count=10,spread=20,delay=0){
    for(let i=0;i<count;i++){
      const el=spawn('rs-touch-spark',x,y);if(!el)break;
      el.style.background=(i%4===0)?'#dfae82':'#63dfc1';
      const dx=(Math.random()-.5)*spread*2,dy=5+Math.random()*spread;
      animate(el,[{transform:'translate(-50%,-50%) scale(1)',opacity:0},{transform:'translate(-50%,-50%) scale(1)',opacity:1,offset:.13},{transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.1)`,opacity:0}],{duration:260,delay,easing:'ease-out'});
    }
  }
  function fire(x,y) {
    if(!svg||disposed)return;
    if(reduce.matches){ring(x,y);return;}
    // Hotspot is the pointed TIP at top of SVG; landing top of artwork exactly at (x,y).
    // We start BELOW the tap by travel px, then move UP by exactly travel px.
    const el=spawn('rs-touch-arrow',x,y+travel);if(!el)return;
    // SVG is a trusted static file bundled with this package, not user input.
    el.innerHTML=svg;
    const shot=animate(el,[
      {transform:'translate(-50%,0) translateY(0) scale(.95)',opacity:0},
      {transform:'translate(-50%,0) translateY(-12px) scale(1)',opacity:1,offset:.12},
      {transform:`translate(-50%,0) translateY(-${travel*.7}px) scale(1)`,opacity:1,offset:.76},
      {transform:`translate(-50%,0) translateY(-${travel}px) scale(1)`,opacity:1}
    ],{duration,easing:'cubic-bezier(.22,.7,.24,1)'});
    // Particles remain below projectile, following it UP toward the actual tap.
    for(let i=0;i<7;i++){
      const fraction=(i+1)/8;
      const py=y+travel-travel*fraction+34;
      sparks(x+(i%2?5:-5),py,3,11,Math.round(duration*fraction));
    }
    if(shot)shot.addEventListener('finish',()=>{if(disposed)return;ring(x,y);sparks(x,y,10,20);},{once:true});
  }
  const qualifies=e=>{
    if(!enabled||disposed||!svg||!e.isPrimary)return false;
    if(e.pointerType!=='touch'&&!(testWithMouse&&e.pointerType==='mouse'&&e.button===0))return false;
    const target=e.target instanceof Element?e.target:null;
    if(!target||target.closest(ignoreSelector))return false;
    if(!allowAnywhere&&!target.closest(selector))return false;
    return true;
  };
  function down(e){if(!qualifies(e))return;pending.set(e.pointerId,{x:e.clientX,y:e.clientY,time:performance.now()});}
  function cancel(e){pending.delete(e.pointerId);}
  function up(e){
    const start=pending.get(e.pointerId);pending.delete(e.pointerId);
    if(!start)return;
    // Do not animate scroll, drag, long-press or swipe; no preventDefault ever.
    if(Math.hypot(e.clientX-start.x,e.clientY-start.y)>12 || performance.now()-start.time>650)return;
    fire(e.clientX,e.clientY);
  }
  fetch(svgUrl,{credentials:'same-origin'}).then(r=>{if(!r.ok)throw new Error('SVG failed to load');return r.text();}).then(content=>{if(!disposed)svg=content;}).catch(err=>console.warn('RezSite touch effect unavailable; taps unaffected.',err));
  document.addEventListener('pointerdown',down,{passive:true,signal:controller.signal});
  document.addEventListener('pointerup',up,{passive:true,signal:controller.signal});
  document.addEventListener('pointercancel',cancel,{passive:true,signal:controller.signal});
  return ()=>{disposed=true;controller.abort();pending.clear();for(const a of [...active])a.cancel();for(const n of [...nodes])n.remove();active.clear();nodes.clear();};
}
