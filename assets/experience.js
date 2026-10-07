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
