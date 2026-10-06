/* Event-driven navigation feedback; native scrolling and clicks remain untouched. */
(()=>{
 const header=document.querySelector('header');
 const nav=header?.querySelector('nav');
 if(!nav)return;
 const desktop=matchMedia('(min-width:1101px)');
 const marker=document.createElement('span');
 marker.className='nav-motion-marker';marker.setAttribute('aria-hidden','true');header.prepend(marker);
 const items=[...nav.querySelectorAll(':scope > a:not(.nav-contact),.services-toggle')];
 let hovered=null,frame=0;
 function draw(){
  frame=0;
  if(!desktop.matches){marker.classList.remove('is-visible');return;}
  const focused=items.find(el=>el===document.activeElement);
  const target=hovered||focused||items.find(el=>el.getAttribute('aria-expanded')==='true')||items.find(el=>el.dataset.active==='true');
  if(!target){marker.classList.remove('is-visible');return;}
  const r=target.getBoundingClientRect(),h=header.getBoundingClientRect();
  marker.style.width=r.width+'px';marker.style.height=r.height+'px';
  marker.style.transform=`translate(${r.left-h.left-header.clientLeft}px,${r.top-h.top-header.clientTop}px)`;
  marker.classList.add('is-visible');
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(draw);}
 items.forEach(el=>{el.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovered=el;schedule();}});el.addEventListener('pointerleave',()=>{hovered=null;schedule();});el.addEventListener('focus',schedule);el.addEventListener('blur',schedule);});
 new MutationObserver(schedule).observe(nav,{subtree:true,attributes:true,attributeFilter:['data-active','aria-expanded']});
 new ResizeObserver(schedule).observe(header);
 desktop.addEventListener('change',schedule);document.fonts.ready.then(schedule);schedule();
})();

(()=>{
 const flow=document.querySelector('.approach-flow');
 if(!flow||!('IntersectionObserver' in window))return;
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){flow.classList.add('flow-entered');observer.disconnect();}},{threshold:.25});
 observer.observe(flow);
})();
