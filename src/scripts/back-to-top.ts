const control=document.querySelector<HTMLAnchorElement>('.star-top');
const outline=control?.querySelector<SVGPathElement>('[data-star-outline]');
const motion=matchMedia('(prefers-reduced-motion: reduce)');
// A fresh visit to the bare homepage starts at the hero. Back navigation
// and explicit section links retain their normal browser behaviour.
const navigationEntry=performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming|undefined;
if(location.pathname==='/'&&!location.hash&&navigationEntry?.type!=='back_forward'){
  history.scrollRestoration='manual';
  window.scrollTo({top:0,behavior:'instant'});
  window.addEventListener('pageshow',()=>window.scrollTo({top:0,behavior:'instant'}),{once:true});
}
if(control&&outline){
  let frame=0,hovered=false,focused=false,flying=false;
  const star=outline.getAttribute('d')!;
  const update=()=>{if(!flying)control.classList.toggle('is-visible',scrollY>260);};
  addEventListener('scroll',update,{passive:true});update();
  // Sample the eight-ray silhouette and a true circle with matching points.
  const morph=(now:number)=>{
    if(motion.matches||(!hovered&&!focused)){outline.setAttribute('d',star);frame=0;return;}
    const blend=(1-Math.cos(now/1200*Math.PI))/2;
    const points=Array.from({length:64},(_,i)=>{
      const segment=i/4, vertex=Math.floor(segment),fraction=segment-vertex;
      const point=(n:number)=>{const a=n*Math.PI/8-Math.PI/2,r=n%2?10:n%4===0?26:21;return [Math.cos(a)*r,Math.sin(a)*r];};
      const a=point(vertex),b=point(vertex+1),angle=i*Math.PI/32-Math.PI/2;
      return `${32+(a[0]+(b[0]-a[0])*fraction)*(1-blend)+Math.cos(angle)*23*blend},${32+(a[1]+(b[1]-a[1])*fraction)*(1-blend)+Math.sin(angle)*23*blend}`;
    });
    outline.setAttribute('d','M'+points.join(' L')+'Z');frame=requestAnimationFrame(morph);
  };
  const start=()=>{if(!frame)frame=requestAnimationFrame(morph);};
  control.addEventListener('pointerenter',()=>{hovered=true;start();});
  control.addEventListener('pointerleave',()=>hovered=false);
  control.addEventListener('focus',()=>{focused=true;start();});
  control.addEventListener('blur',()=>focused=false);
  control.addEventListener('click',event=>{
    event.preventDefault();if(flying)return;
    window.scrollTo({top:0,behavior:motion.matches?'instant':'smooth'});
    if(location.hash)history.replaceState(null,'',location.pathname+location.search);
    if(!motion.matches){
      flying=true;control.classList.add('is-flying');
      const flight=control.animate([{transform:'translateY(0)',opacity:1},{transform:`translateY(-${innerHeight}px) rotate(100deg)`,opacity:0}],{duration:950,easing:'cubic-bezier(.4,0,.5,1)',fill:'forwards'});
      flight.onfinish=()=>{flight.cancel();flying=false;control.classList.remove('is-flying');update();};
    }else update();
    const heading=document.querySelector<HTMLElement>('h1');if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
  });
}
