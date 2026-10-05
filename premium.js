/* Progressive enhancement: native scroll, no animation library or wheel interception. */
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
 const hero=document.querySelector('.hero');
 const progress=document.querySelector('.reading-progress');
 const band=document.querySelector('.precision-band');
 const about=document.querySelector('.about');
 const closing=document.querySelector('.closing');
 let observer,frame=0;
 const revealTargets=[...document.querySelectorAll('.intro h2,.intro-text,.section-heading,.service-card,.why h2,.why-grid article,.steps article,.about-layout,.logos figure,.knowledge-grid a,.sequence figure,.faq-layout,.closing h2,.closing p,.contact>div,.contact form,.footer-signature')];
 function revealAll(){revealTargets.forEach(el=>{el.classList.remove('awaiting');el.classList.add('is-visible');});}
 function configureMotion(){
  observer?.disconnect();
  if((reduced.matches||document.body.classList.contains('motion-paused'))){document.body.classList.remove('motion-ready');revealAll();hero.style.removeProperty('--hero-drift');band?.style.removeProperty('--band-shift');return;}
  document.body.classList.add('motion-ready');
  if(!('IntersectionObserver' in window)){revealAll();return;}
  observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.remove('awaiting');entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}},{threshold:.08,rootMargin:'0px 0px -25px 0px'});
  revealTargets.forEach(el=>{if(!el.classList.contains('is-visible')){el.classList.add('motion-reveal','awaiting');if(el.matches('.logos figure,.why-grid article,.knowledge-grid a'))el.style.setProperty('--reveal-delay',`${[...el.parentNode.children].indexOf(el)%4*65}ms`);observer.observe(el);}});
 }
 if(!(reduced.matches||document.body.classList.contains('motion-paused'))){
  const heading=document.querySelector('h1');
  const accessibleText=heading.textContent.replace(/\s+/g,' ').trim();
  heading.setAttribute('aria-label',accessibleText);
  const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  let index=0;
  nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(token=>{if(!token.trim()){fragment.append(document.createTextNode(token));return;}const word=document.createElement('span');word.className='motion-word';word.setAttribute('aria-hidden','true');const inner=document.createElement('span');inner.textContent=token;inner.style.setProperty('--word-index',index++);word.append(inner);fragment.append(word);});node.replaceWith(fragment);});
 }
 configureMotion();
 function updateScroll(){
  frame=0;const y=window.scrollY;const travel=document.documentElement.scrollHeight-innerHeight;
  progress.style.transform=`scaleX(${travel>0?Math.min(1,Math.max(0,y/travel)):0})`;
  document.body.classList.toggle('has-scrolled',y>25);
  if((reduced.matches||document.body.classList.contains('motion-paused')))return;
  const heroBounds=hero.getBoundingClientRect();
  if(innerWidth>760&&heroBounds.bottom>0)hero.style.setProperty('--hero-drift',`${Math.min(y*.025,18)}px`);
  if(band){const b=band.getBoundingClientRect();if(b.bottom>0&&b.top<innerHeight)band.style.setProperty('--band-shift',`${-20-Math.max(0,innerHeight-b.top)*.13}px`);}
  if(about){const b=about.getBoundingClientRect();if(b.bottom>0&&b.top<innerHeight)about.style.setProperty('--ring-turn',`${(innerHeight-b.top)*.045}deg`);}
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(updateScroll);}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});addEventListener('load',schedule,{once:true});reduced.addEventListener('change',()=>{configureMotion();schedule();});schedule();
 document.querySelectorAll('.service-card').forEach(card=>{
  let pointerFrame=0;
  card.addEventListener('pointermove',e=>{if((reduced.matches||document.body.classList.contains('motion-paused'))||!finePointer.matches||pointerFrame)return;pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;const r=card.getBoundingClientRect();card.style.setProperty('--tilt-x',`${-(e.clientY-r.top-r.height/2)/r.height*2.5}deg`);card.style.setProperty('--tilt-y',`${(e.clientX-r.left-r.width/2)/r.width*3}deg`);});});
  card.addEventListener('pointerleave',()=>{cancelAnimationFrame(pointerFrame);pointerFrame=0;card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});
 });
 document.querySelectorAll('.button').forEach(button=>{button.addEventListener('pointermove',e=>{if((reduced.matches||document.body.classList.contains('motion-paused'))||!finePointer.matches)return;const r=button.getBoundingClientRect();button.style.setProperty('--button-x',`${(e.clientX-r.left-r.width/2)*.035}px`);button.style.setProperty('--button-y',`${(e.clientY-r.top-r.height/2)*.07}px`);});button.addEventListener('pointerleave',()=>{button.style.removeProperty('--button-x');button.style.removeProperty('--button-y');});});
 if(closing)closing.addEventListener('pointermove',e=>{if((reduced.matches||document.body.classList.contains('motion-paused'))||!finePointer.matches)return;const r=closing.getBoundingClientRect();closing.style.setProperty('--light-x',`${(e.clientX-r.left)/r.width*100}%`);closing.style.setProperty('--light-y',`${(e.clientY-r.top)/r.height*100}%`);});
 document.addEventListener('focusin',e=>{const target=e.target.closest('.motion-reveal');if(target){target.classList.remove('awaiting');target.classList.add('is-visible');}});
})();
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const band=document.querySelector('.precision-band');
 function makeLoop(track){const group=document.createElement('div');group.className='marquee-group';while(track.firstChild)group.append(track.firstChild);const duplicate=group.cloneNode(true);duplicate.setAttribute('aria-hidden','true');track.append(group,duplicate);}
 if(band){const track=band.querySelector('.precision-track');makeLoop(track);track.classList.add('is-marquee');}
 const frame=document.createElement('div');frame.className='marquee-frame';frame.setAttribute('aria-hidden','true');frame.innerHTML='<div class="expertise-marquee"><div class="marquee-line"><span>Acústica industrial</span><b>↗</b><span>Acústica arquitectónica</span><b>↗</b><span>Acústica legal</span><b>↗</b><span>Análisis de vibraciones</span><b>↗</b></div></div>';
 document.querySelector('.closing').before(frame);makeLoop(frame.querySelector('.marquee-line'));
 if('IntersectionObserver'in window){const visibility=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('in-view',e.isIntersecting)));document.querySelectorAll('.precision-band,.expertise-marquee').forEach(e=>visibility.observe(e));}
 const control=document.querySelector('.motion-control');control.hidden=false;
 control.addEventListener('click',()=>{const paused=document.body.classList.toggle('motion-paused');document.documentElement.classList.toggle('motion-paused',paused);control.setAttribute('aria-pressed',String(paused));control.setAttribute('aria-label',paused?'Reanudar efectos de movimiento':'Pausar efectos de movimiento');control.innerHTML=paused?'<span aria-hidden="true">▷</span> Reanudar movimiento':'<span aria-hidden="true">Ⅱ</span> Pausar movimiento';document.querySelectorAll('.motion-reveal').forEach(el=>{el.classList.remove('awaiting');el.classList.add('is-visible');});});
 document.querySelectorAll('.card-image').forEach(card=>{const cursor=document.createElement('span');cursor.className='card-cursor';cursor.setAttribute('aria-hidden','true');cursor.textContent='EXPLORAR ↗';card.append(cursor);card.addEventListener('pointermove',e=>{if(!fine.matches||reduced.matches||document.body.classList.contains('motion-paused'))return;const r=card.getBoundingClientRect();card.style.setProperty('--cursor-x',`${e.clientX-r.left}px`);card.style.setProperty('--cursor-y',`${e.clientY-r.top}px`);card.classList.add('pointer-inside');});card.addEventListener('pointerleave',()=>card.classList.remove('pointer-inside'));});
 document.querySelectorAll('.button').forEach(button=>button.addEventListener('pointerdown',e=>{if(reduced.matches||document.body.classList.contains('motion-paused'))return;const r=button.getBoundingClientRect();const ripple=document.createElement('span');ripple.className='button-ripple';ripple.setAttribute('aria-hidden','true');ripple.style.setProperty('--ripple-x',`${e.clientX-r.left}px`);ripple.style.setProperty('--ripple-y',`${e.clientY-r.top}px`);button.append(ripple);setTimeout(()=>ripple.remove(),700);}));
 const navLinks=[...document.querySelectorAll('nav>a[href*="#"]')];
 if('IntersectionObserver'in window){const sections=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){navLinks.forEach(a=>{const match=new URL(a.href).hash==='#'+e.target.id;a.dataset.active=String(match);});}}},{rootMargin:'-20% 0px -60% 0px'});['inicio','nosotros','experiencia','conocimiento'].forEach(id=>{const el=document.getElementById(id);if(el)sections.observe(el);});}
 const scene=document.querySelector('.visual-interlude');let frameId=0;
 function shiftScene(){frameId=0;if(!scene||reduced.matches||document.body.classList.contains('motion-paused')||innerWidth<761)return;const r=scene.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)scene.style.setProperty('--interlude-y',`${-30+(innerHeight-r.top)*.02}px`);}
 if(scene){addEventListener('scroll',()=>{if(!frameId)frameId=requestAnimationFrame(shiftScene);},{passive:true});shiftScene();}
})();
