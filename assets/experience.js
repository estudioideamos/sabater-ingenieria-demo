/* Small progressive enhancements; no requests, storage or navigation interception. */
(()=>{
 const root=document.querySelector('[data-diagnostic]');if(!root)return;
 const buttons=[...root.querySelectorAll('.diagnostic-hotspots button')];
 const panels=[...root.querySelectorAll('.diagnostic-readout article')];
 function select(index){root.dataset.point=String(index);buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));panels.forEach((panel,i)=>panel.hidden=i!==index);}
 buttons.forEach((button,index)=>{button.addEventListener('click',()=>select(index));button.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%buttons.length;else if(event.key==='ArrowLeft')next=(index+buttons.length-1)%buttons.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=buttons.length-1;else return;event.preventDefault();select(next);buttons[next].focus();});});
 root.querySelector('.diagnostic-hotspots').hidden=false;
 root.querySelector('.diagnostic-comparison').hidden=false;
 const range=root.querySelector('input[type=range]');
 range.addEventListener('input',()=>{const value=Number(range.value);root.style.setProperty('--treatment',String(value/100));range.setAttribute('aria-valuetext',value===0?'Sin intervención representada':value===100?'Estrategia de control representada':'Transición visual entre ambas situaciones');});
 select(0);
 const section=root.closest('.diagnostic');
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{section.classList.toggle('in-view',entries[0].isIntersecting&&!document.hidden);},{threshold:.1}).observe(section);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)section.classList.remove('in-view');else{const rect=section.getBoundingClientRect();section.classList.toggle('in-view',rect.bottom>0&&rect.top<innerHeight);}});
})();

// Animate native disclosures in both directions, retaining keyboard and no-JS behavior.
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.faq details,.footer-fold,.contact-extra,.lab-view-controls').forEach(details=>{
  const summary=details.querySelector(':scope > summary');if(!summary||!details.animate)return;
  let animation=null,desired=details.open;
  const clear=()=>{details.style.removeProperty('height');details.style.removeProperty('overflow');};
  function settle(){if(!animation)return;const current=animation;animation=null;current.cancel();details.open=desired;clear();}
  summary.addEventListener('click',event=>{
   if(event.defaultPrevented||reduced.matches||(details.classList.contains('footer-fold')&&innerWidth>760))return;
   event.preventDefault();
   if(!animation)desired=details.open;
   desired=!desired;
   const start=details.getBoundingClientRect().height;
   animation?.cancel();animation=null;clear();
   details.open=desired;const end=details.getBoundingClientRect().height;details.open=true;
   details.style.height=start+'px';details.style.overflow='hidden';
   const next=details.animate([{height:start+'px'},{height:end+'px'}],{duration:280,easing:'cubic-bezier(.22,.7,.2,1)',fill:'both'});
   animation=next;
   next.finished.then(()=>{if(animation!==next)return;animation=null;details.open=desired;clear();next.cancel();}).catch(()=>{});
  });
  reduced.addEventListener('change',settle);
  addEventListener('resize',()=>{if(!animation)return;animation.cancel();animation=null;clear();desired=details.open;},{passive:true});
 });
})();
// Contextual instrument cursor; native fallback for forms, touch and reduced motion.
(()=>{
 const fine=matchMedia('(hover:hover) and (pointer:fine)'),reduce=matchMedia('(prefers-reduced-motion:reduce)');
 let dot,ring,label,frame=0,x=0,y=0,rx=0,ry=0,visible=false,drag=false;
 function hide(){visible=false;document.documentElement.classList.remove('instrument-cursor');if(dot)dot.hidden=ring.hidden=true;cancelAnimationFrame(frame);frame=0;}
 function create(){if(dot)return;dot=document.createElement('span');ring=document.createElement('span');dot.className='instrument-dot';ring.className='instrument-ring';dot.setAttribute('aria-hidden','true');ring.setAttribute('aria-hidden','true');label=document.createElement('span');ring.append(label);document.body.append(dot,ring);hide();}
 function draw(){frame=0;if(!visible)return;rx+=(x-rx)*.24;ry+=(y-ry)*.24;dot.style.transform=`translate3d(${x}px,${y}px,0)`;ring.style.transform=`translate3d(${rx}px,${ry}px,0)`;if(Math.abs(x-rx)+Math.abs(y-ry)>.1)frame=requestAnimationFrame(draw);}
 function context(target){if(!(target instanceof Element)||target.closest('input:not([type=range]),textarea,select,[contenteditable=true],iframe')){hide();return false;}let mode='default',text='';if(target.closest('input[type=range]'))mode='compare';else if(target.closest('.lab-ready .lab-viewport')){mode='rotate';text=drag?'Girando':'Girar';}else if(target.closest('.diagnostic-hotspots button')){mode='explore';text='Explorar';}else if(target.closest('a,button,summary,[role=button]'))mode='link';ring.dataset.mode=mode;ring.classList.toggle('is-dragging',drag);dot.classList.toggle('has-label',mode==='rotate'||mode==='explore'||mode==='compare');label.textContent=text;return true;}
 document.addEventListener('pointermove',e=>{if(!fine.matches||reduce.matches||e.pointerType==='touch'){hide();return;}create();x=e.clientX;y=e.clientY;if(!context(e.target))return;if(!visible){rx=x;ry=y;visible=true;dot.hidden=ring.hidden=false;document.documentElement.classList.add('instrument-cursor');}if(!frame)frame=requestAnimationFrame(draw);},{passive:true});
 document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){hide();return;}drag=true;if(visible)context(e.target);},{passive:true});
 addEventListener('pointerup',()=>{drag=false;if(visible)context(document.elementFromPoint(x,y));},{passive:true});
 addEventListener('pointercancel',()=>{drag=false;hide();});document.documentElement.addEventListener('pointerleave',hide);document.addEventListener('keydown',hide);addEventListener('blur',()=>{drag=false;hide();});document.addEventListener('visibilitychange',()=>{if(document.hidden)hide();});addEventListener('scroll',()=>{if(visible)context(document.elementFromPoint(x,y));},{passive:true});fine.addEventListener('change',hide);reduce.addEventListener('change',hide);
})();
