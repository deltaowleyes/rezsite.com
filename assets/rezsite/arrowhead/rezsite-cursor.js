/** RezSite cursor. No libraries needed. Assumes arrowhead.svg and rezsite-cursor.css are served adjacent to this module. */
export function installRezSiteCursor(options = {}) {
  const { svgUrl = new URL('./arrowhead.svg', import.meta.url).href,
    shootingDistance = 100, shootingDuration = 285, clickEnabled = true } = options;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let cursor, svgText, last = { x: innerWidth / 2, y: innerHeight / 2 };
  const abort = new AbortController();
  const active = () => fine.matches;
  const editable = el => Boolean(el?.closest?.('input,textarea,select,[contenteditable="true"],[contenteditable=""], [role="textbox"]'));
  const show = () => { if(cursor) cursor.style.display = ''; };
  const hide = () => { if(cursor) cursor.style.display = 'none'; };
  function move(e) {
    last = { x:e.clientX, y:e.clientY };
    if (!cursor) return;
    cursor.style.left = last.x + 'px'; cursor.style.top = last.y + 'px';
    editable(e.target) ? hide() : show();
  }
  function projectile(e) {
    // Touch/pen taps on touchscreen laptops get the v1.3 landing effect instead; mouse behaviour unchanged.
    if (e.pointerType && e.pointerType !== 'mouse') return;
    if (!clickEnabled || !active() || reduced.matches || editable(e.target) || !cursor || !svgText) return;
    const x=e.clientX, y=e.clientY;
    cursor.animate([
      {transform:'translate(-50%,-7%) scale(1)'},
      {transform:'translate(-50%,2%) scale(.8)'},
      {transform:'translate(-50%,-7%) scale(1)'}
    ],{duration:220,easing:'ease-out'});
    const shot=document.createElement('div'); shot.className='rs-cursor-projectile';
    shot.style.left=x+'px'; shot.style.top=y+'px'; shot.innerHTML=svgText;
    shot.querySelector('svg')?.setAttribute('width','100%');
    document.body.append(shot);
    const animation=shot.animate([
      {transform:'translate(-50%,-7%) translateY(0)',opacity:1,filter:'drop-shadow(0 0 0px #7cf0d3)'},
      {transform:`translate(-50%,-7%) translateY(${-shootingDistance*.42}px)`,opacity:.9,filter:'drop-shadow(0 20px 6px #4fd8b8)'},
      {transform:`translate(-50%,-7%) translateY(${-shootingDistance}px) scale(.65)`,opacity:0,filter:'drop-shadow(0 35px 12px #4fd8b8)'}
    ],{duration:shootingDuration,easing:'ease-out'});
    animation.onfinish=()=> {
      shot.remove();
      const impact=document.createElement('div'); impact.className='rs-cursor-impact';
      impact.style.left=x+'px'; impact.style.top=(y-shootingDistance)+'px';
      document.body.append(impact);
      impact.animate([
        {transform:'translate(-50%,-50%) scale(.3)',opacity:1},
        {transform:'translate(-50%,-50%) scale(6)',opacity:0}
      ],{duration:380,easing:'ease-out'}).onfinish=()=>impact.remove();
      for(let i=0;i<5;i++) {
        const spark=document.createElement('div'); spark.className='rs-cursor-spark';
        spark.style.left=x+'px'; spark.style.top=(y-shootingDistance)+'px'; document.body.append(spark);
        const a=i*Math.PI*2/5;
        spark.animate([
          {transform:'translate(0,0)',opacity:1},
          {transform:`translate(${Math.cos(a)*28}px,${Math.sin(a)*28}px)`,opacity:0}
        ],{duration:340,easing:'ease-out'}).onfinish=()=>spark.remove();
      }
    };
    animation.oncancel=()=>shot.remove();
  }
  const target = e => (e.target instanceof Element ? e.target : null);
  function setEnabled() {
    document.documentElement.classList.toggle('rs-cursor-enabled',active());
    if(cursor) cursor.style.display=active()?'':'none';
  }
  async function start() {
    if(!active()) return;
    const res=await fetch(svgUrl);
    if(!res.ok) throw new Error('Could not load RezSite arrowhead SVG');
    svgText=await res.text();
    // Asset is same-origin and trusted by the site owner; never substitute untrusted SVG input.
    cursor=document.createElement('div'); cursor.className='rs-cursor-head';
    cursor.innerHTML=svgText;
    const graphic=cursor.querySelector('svg');
    if(graphic){ graphic.style.display='block'; graphic.style.width='100%';graphic.style.height='auto'; }
    document.body.append(cursor);move({clientX:last.x,clientY:last.y,target:document.body});setEnabled();
  }
  document.addEventListener('pointermove',move,{signal:abort.signal,passive:true});
  document.addEventListener('pointerdown',projectile,{signal:abort.signal,passive:true});
  document.addEventListener('pointerleave',hide,{signal:abort.signal});
  window.addEventListener('blur',hide,{signal:abort.signal});
  fine.addEventListener('change',setEnabled,{signal:abort.signal});
  start().catch(err=>console.warn('RezSite cursor unavailable; native cursor retained.',err));
  return () => {abort.abort();cursor?.remove();document.documentElement.classList.remove('rs-cursor-enabled');};
}
