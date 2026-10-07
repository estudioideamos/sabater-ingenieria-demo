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

/* A brief sensor cue, positioned against the actual cover crop. */
(()=>{
 const section=document.querySelector('.visual-interlude');
 if(!section||!('IntersectionObserver' in window))return;
 const pulse=section.querySelector('.sensor-pulse'),img=section.querySelector('img');
 if(!pulse||!img)return;
 function place(){const scale=Math.max(section.clientWidth/1983,section.clientHeight/793);pulse.style.left=(section.clientWidth-1983*scale+1983*.625*scale)+'px';pulse.style.top=((section.clientHeight-793*scale)/2+793*.245*scale)+'px';}
 new ResizeObserver(place).observe(section);place();
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){section.classList.add('sensor-entered');observer.disconnect();}},{threshold:.45});observer.observe(section);
})();

// Manual method navigation, with native keyboard focus and readable HTML fallback.
document.querySelectorAll('.method-composition').forEach(root=>{
 const stages=[...root.querySelectorAll('.method-stage')],buttons=stages.map(s=>s.querySelector('button')),photos=[...root.querySelectorAll('.method-photo')];
 let active=0;
 function select(index){active=index;stages.forEach((stage,i)=>{const selected=i===index;stage.classList.toggle('is-active',selected);buttons[i].setAttribute('aria-expanded',String(selected));buttons[i].setAttribute('aria-disabled',String(selected));stage.querySelector('.method-copy').hidden=!selected;if(index>=0){photos[i].classList.toggle('is-active',selected);photos[i].setAttribute('aria-hidden',String(!selected));}});}
 root.classList.add('method-enhanced');select(0);
 // Reserve the tallest explanation at this width so selecting a step does not move the next section.
 if(document.querySelector('.detail-hero')){
  const copies=stages.map(stage=>stage.querySelector('.method-copy'));let lastWidth=0;
  function measure(){root.style.removeProperty('--method-copy-height');copies.forEach(copy=>copy.hidden=false);const height=Math.max(...copies.map(copy=>copy.getBoundingClientRect().height));root.style.setProperty('--method-copy-height',Math.ceil(height)+'px');const saved=active;select(saved<0?0:saved);const panel=root.querySelector('.method-stages');panel.style.minHeight='0px';panel.style.minHeight=Math.ceil(panel.getBoundingClientRect().height)+'px';select(saved);}
  new ResizeObserver(entries=>{const width=Math.round(entries[0].contentRect.width);if(width!==lastWidth){lastWidth=width;measure();}}).observe(root.querySelector('.method-stages'));
  document.fonts.ready.then(measure);
 }

 buttons.forEach((button,i)=>{button.addEventListener('click',()=>{if(active!==i)select(i);});button.addEventListener('keydown',e=>{let next;if(e.key==='ArrowDown')next=(i+1)%buttons.length;else if(e.key==='ArrowUp')next=(i+buttons.length-1)%buttons.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=buttons.length-1;else return;e.preventDefault();buttons[next].focus();select(next);});});
});


// Autoplay advances one logo at a time; interaction, hidden tabs and reduced motion pause it.
document.querySelectorAll('.client-carousel').forEach(root=>{
 const track=root.querySelector('.logos'),controls=root.querySelector('.client-carousel-controls');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let visible=false,hover=false,focused=false,timer=0;
 const max=()=>Math.max(0,track.scrollWidth-track.clientWidth);
 function schedule(){clearTimeout(timer);if(visible&&!hover&&!focused&&!document.hidden&&!reduced.matches&&max()>2)timer=setTimeout(()=>{move(1);schedule();},4500);}
 function sync(){controls.hidden=max()<2;schedule();}
 function move(direction){const step=track.querySelector('figure').getBoundingClientRect().width;let target=track.scrollLeft+direction*step;if(direction>0&&track.scrollLeft>=max()-2)target=0;if(direction<0&&track.scrollLeft<=2)target=max();track.scrollTo({left:Math.max(0,Math.min(max(),target)),behavior:reduced.matches?'instant':'smooth'});}
 controls.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{move(Number(button.dataset.logoDirection));schedule();}));
 root.addEventListener('focusin',()=>{focused=!!root.querySelector(':focus-visible');schedule();});root.addEventListener('focusout',()=>{setTimeout(()=>{focused=!!root.querySelector(':focus-visible');schedule();},0);});
 track.addEventListener('touchstart',()=>{hover=true;schedule();},{passive:true});track.addEventListener('touchend',()=>{hover=false;schedule();},{passive:true});track.addEventListener('touchcancel',()=>{hover=false;schedule();},{passive:true});
 track.addEventListener('keydown',event=>{if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}else if(event.key==='Home'||event.key==='End'){event.preventDefault();track.scrollTo({left:event.key==='Home'?0:max(),behavior:reduced.matches?'instant':'smooth'});}});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.5}).observe(root);new ResizeObserver(sync).observe(track);document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',sync);sync();
});
