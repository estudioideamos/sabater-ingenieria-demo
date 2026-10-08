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
 const notes=[...root.querySelectorAll('[data-method-note]')];
 let active=0;
 function select(index){notes.forEach((note,i)=>note.hidden=i!==index);root.style.setProperty('--method-progress',String((index+1)/stages.length));active=index;stages.forEach((stage,i)=>{const selected=i===index;stage.classList.toggle('is-active',selected);buttons[i].setAttribute('aria-expanded',String(selected));buttons[i].setAttribute('aria-disabled',String(selected));stage.querySelector('.method-copy').hidden=!selected;if(index>=0){photos[i].classList.toggle('is-active',selected);photos[i].setAttribute('aria-hidden',String(!selected));}});}
 root.classList.add('method-enhanced');select(0);
 // Reserve the tallest explanation at this width so selecting a step does not move the next section.
 if(document.querySelector('.detail-hero')){
  const copies=stages.map(stage=>stage.querySelector('.method-copy'));let lastWidth=0,nearby=false,pendingMeasure=0;
  function scheduleMeasure(){if(!nearby||pendingMeasure)return;pendingMeasure=requestAnimationFrame(()=>{pendingMeasure=0;measure();});}
  new IntersectionObserver(entries=>{nearby=entries[0].isIntersecting;if(nearby)scheduleMeasure();},{rootMargin:'200px'}).observe(root);
  function measure(){root.style.removeProperty('--method-copy-height');copies.forEach(copy=>copy.hidden=false);const height=Math.max(...copies.map(copy=>copy.getBoundingClientRect().height));root.style.setProperty('--method-copy-height',Math.ceil(height)+'px');const saved=active;select(saved<0?0:saved);const panel=root.querySelector('.method-stages');panel.style.minHeight='0px';panel.style.minHeight=Math.ceil(panel.getBoundingClientRect().height)+'px';select(saved);}
  new ResizeObserver(entries=>{const width=Math.round(entries[0].contentRect.width);if(width!==lastWidth){lastWidth=width;scheduleMeasure();}}).observe(root.querySelector('.method-stages'));
  document.fonts.ready.then(scheduleMeasure);
 }

 buttons.forEach((button,i)=>{button.addEventListener('click',()=>{if(active!==i)select(i);});button.addEventListener('keydown',e=>{let next;if(e.key==='ArrowDown')next=(i+1)%buttons.length;else if(e.key==='ArrowUp')next=(i+buttons.length-1)%buttons.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=buttons.length-1;else return;e.preventDefault();buttons[next].focus();select(next);});});
});


// Continuous logo loop; duplicate visuals are hidden from assistive technology.
document.querySelectorAll('.client-carousel').forEach(root=>{
 const track=root.querySelector('.logos'),controls=root.querySelector('.client-carousel-controls');
 const originals=[...track.querySelectorAll('figure')];if(originals.length<2)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clones=originals.map(item=>{const clone=item.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.inert=true;clone.dataset.loopClone='';clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));clone.removeAttribute('id');track.append(clone);return clone;});
 root.classList.add('continuous-logos');
 let visible=false,touch=false,focused=false,frame=0,last=0,position=0,cycle=0,remaining=0;
 const wrap=n=>cycle?((n%cycle)+cycle)%cycle:0;
 function run(now){frame=0;const dt=last?Math.min((now-last)/1000,.05):0;last=now;
  const automatic=!reduced.matches&&!touch&&!focused;
  if(automatic||Math.abs(remaining)>.2){const step=remaining*(1-Math.exp(-dt*9));remaining-=step;position=wrap(position+step+(automatic?(innerWidth<=760?20:24)*dt:0));track.scrollLeft=position;}
  if(visible&&!document.hidden&&!touch&&(automatic||Math.abs(remaining)>.2))frame=requestAnimationFrame(run);else last=0;
 }
 function schedule(){cancelAnimationFrame(frame);frame=0;last=0;if(visible&&!document.hidden&&!touch)frame=requestAnimationFrame(run);}
 function measure(){if(!visible)return;const previous=cycle;cycle=clones[0].getBoundingClientRect().left-originals[0].getBoundingClientRect().left;position=wrap(previous?position/previous*cycle:track.scrollLeft);track.scrollLeft=position;controls.hidden=cycle<=track.clientWidth;schedule();}
 function move(direction){const step=originals[1].getBoundingClientRect().left-originals[0].getBoundingClientRect().left;if(reduced.matches){position=wrap(track.scrollLeft+direction*step);track.scrollLeft=position;}else{remaining+=direction*step;schedule();}}
 controls.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>move(Number(button.dataset.logoDirection))));
 root.addEventListener('focusin',()=>{focused=!!root.querySelector(':focus-visible');schedule();});root.addEventListener('focusout',()=>setTimeout(()=>{focused=!!root.querySelector(':focus-visible');schedule();},0));
 track.addEventListener('pointerdown',()=>{touch=true;remaining=0;schedule();},{passive:true});
 const release=()=>{if(!touch)return;touch=false;position=wrap(track.scrollLeft);schedule();};addEventListener('pointerup',release,{passive:true});addEventListener('pointercancel',release,{passive:true});
 track.addEventListener('scroll',()=>{if(touch||reduced.matches)position=wrap(track.scrollLeft);},{passive:true});
 track.addEventListener('keydown',event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}else if(event.key==='Home'||event.key==='End'){event.preventDefault();remaining=0;position=event.key==='Home'?0:Math.max(0,cycle-track.clientWidth);track.scrollLeft=position;}});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)measure();else schedule();},{threshold:.1}).observe(root);new ResizeObserver(measure).observe(track);document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',()=>{remaining=0;position=wrap(track.scrollLeft);schedule();});measure();
});

// Footer disclosures collapse only on narrow screens.
(()=>{const mobile=matchMedia('(max-width:760px)');const folds=[...document.querySelectorAll('.footer-fold')];
const sync=()=>folds.forEach(f=>{f.open=!mobile.matches;f.querySelector('summary').tabIndex=mobile.matches?0:-1;});
folds.forEach(f=>f.querySelector('summary').addEventListener('click',e=>{if(!mobile.matches)e.preventDefault();}));
mobile.addEventListener('change',sync);sync();})();
