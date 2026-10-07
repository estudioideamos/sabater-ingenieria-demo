/* Progressive visual enhancements; wheel easing is isolated in assets/smooth-wheel.js. */
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
 const hero=document.querySelector('.hero');
 const progress=document.querySelector('.reading-progress');
 const band=document.querySelector('.precision-band');
 const about=document.querySelector('.about');
 const closing=document.querySelector('.closing');
 let observer,frame=0;
 const revealTargets=[...document.querySelectorAll('.intro h2,.intro-text,.section-heading,.service-card,.why h2,.why-grid article,.steps article,.about-layout,.service-gallery .logos figure,.home-hero~.experience-gallery .logos,.knowledge-grid a,.blog-card,.sequence figure,.problem-grid article,.problem-next,.faq-layout,.closing h2,.closing p,.contact>div,.contact form')];
 function revealAll(){revealTargets.forEach(el=>{el.classList.remove('awaiting');el.classList.add('is-visible');});}
 function configureMotion(){
  observer?.disconnect();
  if((reduced.matches)){document.body.classList.remove('motion-ready');revealAll();hero?.style.removeProperty('--hero-drift');band?.style.removeProperty('--band-shift');return;}
  document.body.classList.add('motion-ready');
  if(!('IntersectionObserver' in window)){revealAll();return;}
  observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.remove('awaiting');entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}},{threshold:.08,rootMargin:'0px 0px -25px 0px'});
  revealTargets.forEach(el=>{if(!el.classList.contains('is-visible')){el.classList.add('motion-reveal','awaiting');if(el.matches('.logos figure,.why-grid article,.knowledge-grid a,.blog-card,.problem-grid article'))el.style.setProperty('--reveal-delay',`${[...el.parentNode.children].indexOf(el)%4*65}ms`);observer.observe(el);}});
 }
 if(!(reduced.matches)&&hero){
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
  if((reduced.matches))return;
  const heroBounds=hero?.getBoundingClientRect();
  if(innerWidth>760&&heroBounds?.bottom>0)hero.style.setProperty('--hero-drift',`${Math.min(y*.025,18)}px`);
  if(band){const b=band.getBoundingClientRect();if(b.bottom>0&&b.top<innerHeight)band.style.setProperty('--band-shift',`${-20-Math.max(0,innerHeight-b.top)*.13}px`);}
  if(about){const b=about.getBoundingClientRect();if(b.bottom>0&&b.top<innerHeight)about.style.setProperty('--ring-turn',`${(innerHeight-b.top)*.045}deg`);}
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(updateScroll);}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});addEventListener('load',schedule,{once:true});reduced.addEventListener('change',()=>{configureMotion();schedule();});schedule();
 document.querySelectorAll('.button').forEach(button=>{button.addEventListener('pointermove',e=>{if((reduced.matches)||!finePointer.matches)return;const r=button.getBoundingClientRect();button.style.setProperty('--button-x',`${(e.clientX-r.left-r.width/2)*.035}px`);button.style.setProperty('--button-y',`${(e.clientY-r.top-r.height/2)*.07}px`);});button.addEventListener('pointerleave',()=>{button.style.removeProperty('--button-x');button.style.removeProperty('--button-y');});});
 if(closing)closing.addEventListener('pointermove',e=>{if((reduced.matches)||!finePointer.matches)return;const r=closing.getBoundingClientRect();closing.style.setProperty('--light-x',`${(e.clientX-r.left)/r.width*100}%`);closing.style.setProperty('--light-y',`${(e.clientY-r.top)/r.height*100}%`);});
 document.addEventListener('focusin',e=>{const target=e.target.closest('.motion-reveal');if(target){target.classList.remove('awaiting');target.classList.add('is-visible');}});
})();
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const band=document.querySelector('.precision-band');
 function makeLoop(track){const group=document.createElement('div');group.className='marquee-group';while(track.firstChild)group.append(track.firstChild);const duplicate=group.cloneNode(true);duplicate.setAttribute('aria-hidden','true');track.append(group,duplicate);}
 if(band){const track=band.querySelector('.precision-track');makeLoop(track);track.classList.add('is-marquee');}
 const frame=document.createElement('div');frame.className='marquee-frame';frame.setAttribute('aria-hidden','true');frame.innerHTML='<div class="expertise-marquee"><div class="marquee-line"><span>Acústica industrial</span><b>↗</b><span>Acústica arquitectónica</span><b>↗</b><span>Acústica legal</span><b>↗</b><span>Análisis de vibraciones</span><b>↗</b></div></div>';
 const services=document.querySelector('.services');const context=services||document.querySelector('.what');
 if('IntersectionObserver'in window){const visibility=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('in-view',e.isIntersecting)));document.querySelectorAll('.precision-band,.expertise-marquee').forEach(e=>visibility.observe(e));}
 document.querySelectorAll('.card-image').forEach(card=>{const cursor=document.createElement('span');cursor.className='card-cursor';cursor.setAttribute('aria-hidden','true');cursor.textContent='EXPLORAR ↗';card.append(cursor);card.addEventListener('pointermove',e=>{if(!fine.matches||reduced.matches)return;const r=card.getBoundingClientRect();card.style.setProperty('--cursor-x',`${e.clientX-r.left}px`);card.style.setProperty('--cursor-y',`${e.clientY-r.top}px`);card.classList.add('pointer-inside');});card.addEventListener('pointerleave',()=>card.classList.remove('pointer-inside'));});
 document.querySelectorAll('.button').forEach(button=>button.addEventListener('pointerdown',e=>{if(reduced.matches)return;const r=button.getBoundingClientRect();const ripple=document.createElement('span');ripple.className='button-ripple';ripple.setAttribute('aria-hidden','true');ripple.style.setProperty('--ripple-x',`${e.clientX-r.left}px`);ripple.style.setProperty('--ripple-y',`${e.clientY-r.top}px`);button.append(ripple);setTimeout(()=>ripple.remove(),700);}));
 const navLinks=document.querySelector('.blog-article,.blog-archive')?[]:[...document.querySelectorAll('nav>a[href*="#"]')];
 // Mark only the section currently crossing the reading line; clear gaps and closing.
 const navigationSections=['inicio','nosotros','experiencia','conocimiento'].map(id=>document.getElementById(id)).filter(Boolean);
 let navigationFrame=0;
 function updateNavigation(){navigationFrame=0;if(document.querySelector('.detail-hero')){navLinks.forEach(a=>a.dataset.active='false');const specialty=document.querySelector('.services-toggle');if(specialty)specialty.dataset.active='true';return;}const line=Math.min(innerHeight*.35,240);const current=navigationSections.find(el=>{const r=el.getBoundingClientRect();return r.top<=line&&r.bottom>line;});navLinks.forEach(a=>{a.dataset.active=String(!!current&&new URL(a.href).hash==='#'+current.id);});}
 function queueNavigation(){if(!navigationFrame)navigationFrame=requestAnimationFrame(updateNavigation);}
 addEventListener('scroll',queueNavigation,{passive:true});addEventListener('resize',queueNavigation,{passive:true});updateNavigation();
 const floatingContact=document.querySelector('.floating-contact');
 const inlineContacts=[...document.querySelectorAll('.closing-editorial .text-button,.contact-whatsapp')];
 if(floatingContact&&inlineContacts.length&&'IntersectionObserver'in window){
  const visibleContacts=new Set();
  const syncContact=()=>{floatingContact.hidden=visibleContacts.size>0&&document.activeElement!==floatingContact;};
  const contactObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.intersectionRatio>=.99)visibleContacts.add(entry.target);else visibleContacts.delete(entry.target);});syncContact();},{threshold:[0,.99,1],rootMargin:'-110px 0px -12px 0px'});
  inlineContacts.forEach(el=>contactObserver.observe(el));floatingContact.addEventListener('blur',syncContact);
 }

 const scene=document.querySelector('.visual-interlude');let frameId=0;
 function shiftScene(){frameId=0;if(!scene||reduced.matches||innerWidth<761)return;const r=scene.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)scene.style.setProperty('--interlude-y',`${-30+(innerHeight-r.top)*.02}px`);}
 if(scene){addEventListener('scroll',()=>{if(!frameId)frameId=requestAnimationFrame(shiftScene);},{passive:true});shiftScene();}
})();

// Interactive explanatory diagram; never presented as a live measurement.
document.querySelectorAll('.signal-explorer').forEach(panel=>{
 const copy=['Registramos las señales para conocer el comportamiento real del entorno o equipo.','Interpretamos los datos en contexto para identificar causas y evaluar alternativas.','Definimos una recomendación técnica viable y fundamentada para el próximo paso.'];
 panel.querySelectorAll('[data-signal-stage]').forEach(button=>button.addEventListener('click',()=>{const stage=Number(button.dataset.signalStage);panel.querySelector('.signal-display').dataset.stage=String(stage);panel.querySelectorAll('[data-signal-stage]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));panel.querySelector('.signal-explanation').textContent=copy[stage];const label=panel.querySelector('.scope-stage-label');if(label)label.textContent=['Señal registrada','Patrones identificados','Control de transmisión'][stage];}));
});
if('IntersectionObserver' in window){const techVisibility=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('tech-in-view',e.isIntersecting)),{threshold:.2});document.querySelectorAll('.signal-explorer,.contact-directory,.steps').forEach(e=>techVisibility.observe(e));}
// Brief conceptual signal transition: time trace, spectrum and isolation diagram.
// Only the visible panel renders. These are illustrative signals, never telemetry.
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.signal-explorer').forEach(panel=>{
  const display=panel.querySelector('.signal-display'),wave=panel.querySelector('.scope-wave polyline');if(!wave)return;
  const originalWave=wave.getAttribute('points'),bars=[...panel.querySelectorAll('.scope-spectrum path')].filter(p=>/^M\d+ 108v-/.test(p.getAttribute('d'))),originalBars=bars.map(p=>p.getAttribute('d'));
  const scan=panel.querySelector('.scope-scan'),edge=panel.querySelector('.scope-scan-edge'),machine=panel.querySelector('.scope-machine'),springs=panel.querySelector('.scope-supports'),flowIn=panel.querySelector('.scope-flow-in'),flowOut=panel.querySelector('.scope-flow-out'),dot=panel.querySelector('.scope-wave circle:last-child');
  const springOriginal=springs?.getAttribute('d');let visible=false,frame=0,last=0,time=0,until=0,entered=false;
  function draw(){const stage=display.dataset.stage;const phase=time*1.5;
   if(stage==='0'){
    const points=[];for(let x=34;x<446;x+=2){const u=x-phase*26;const y=66+Math.sin(u*.21)*Math.sin(u*.061)*18+Math.sin(u*.71)*5;points.push(`${x},${y.toFixed(2)}`);}wave.setAttribute('points',points.join(' '));const u=246-phase*26;dot?.setAttribute('cy',(66+Math.sin(u*.21)*Math.sin(u*.061)*18+Math.sin(u*.71)*5).toFixed(2));
   }else if(stage==='1'){
    bars.forEach((bar,i)=>{const x=38+i*5;const height=4+50*Math.exp(-Math.pow((x-151-Math.sin(phase*.7)*8)/18,2))*(1+.13*Math.sin(phase*2))+28*Math.exp(-Math.pow((x-278)/24,2))*(1+.2*Math.cos(phase*1.7))+7*(1+Math.sin(x*.5+phase*3));bar.setAttribute('d',`M${x} 108v-${height.toFixed(2)}`);});
   }else{
    const shift=Math.sin(time*5)*3;machine?.setAttribute('transform',`translate(0 ${shift.toFixed(2)})`);
    const support=[];for(const [x,top,bottom]of [[179,62,87],[293,63,88],[241,83,108]]){const start=top+shift;let path=`M${x} ${start.toFixed(2)}`;for(let n=1;n<=5;n++)path+=`l${n%2?12:-12} ${((bottom-start)/5).toFixed(2)}`;support.push(path);}springs?.setAttribute('d',support.join(' '));flowIn?.setAttribute('cx',(60+(time*.32%1)*77).toFixed(2));flowOut?.setAttribute('cx',(337+(time*.32%1)*84).toFixed(2));
   }
   const position=32+(time*.18%1)*414;scan?.setAttribute('transform',`translate(${position.toFixed(2)} 0)`);edge?.setAttribute('transform',`translate(${position.toFixed(2)} 0)`);
  }
  function tick(now){frame=0;if(!visible||document.hidden||reduced.matches||now>until){panel.classList.remove('scope-running');return;}const elapsed=(now-last)/1000;if(elapsed>=1/30){time+=Math.min(elapsed,.06);last=now;draw();}frame=requestAnimationFrame(tick);}
  function sync(){cancelAnimationFrame(frame);frame=0;panel.classList.toggle('scope-running',visible&&!document.hidden&&!reduced.matches);if(reduced.matches){wave.setAttribute('points',originalWave);bars.forEach((p,i)=>p.setAttribute('d',originalBars[i]));machine?.removeAttribute('transform');if(springs)springs.setAttribute('d',springOriginal);dot?.setAttribute('cy','66');return;}if(visible&&!document.hidden){last=performance.now();until=last+1400;frame=requestAnimationFrame(tick);}}
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&!entered){entered=true;sync();}else if(!visible){cancelAnimationFrame(frame);panel.classList.remove('scope-running');}},{threshold:.05}).observe(panel);
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  panel.querySelectorAll('[data-signal-stage]').forEach(b=>b.addEventListener('click',()=>{if(!reduced.matches){draw();sync();}}));
 });
})();
// Benefit illustrations animate independently while visible; no hover is required.
(()=>{const cards=[...document.querySelectorAll('.predictive-benefit')];if(!cards.length)return;const visible=new Set();function update(){cards.forEach(card=>card.classList.toggle('benefits-running',visible.has(card)&&!document.hidden));}const observer=new IntersectionObserver(entries=>{entries.forEach(e=>e.isIntersecting?visible.add(e.target):visible.delete(e.target));update();},{threshold:.1});cards.forEach(c=>observer.observe(c));document.addEventListener('visibilitychange',update);})();

// Decorative hero film is opt-in by device capability; still image is always present.
(()=>{
 const video=document.querySelector('.hero-film');if(!video)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),desktop=matchMedia('(min-width: 1000px)');
 let visible=true,loaded=false,ready=false;
 const connection=navigator.connection;
 const eligible=()=>desktop.matches&&!reduced.matches&&!connection?.saveData&&!['slow-2g','2g','3g'].includes(connection?.effectiveType);
 function sync(){
  if(!eligible()){video.pause();video.classList.remove('is-playing');return;}
  if(!loaded&&visible){loaded=true;video.src=video.dataset.src;video.load();}
  if(ready&&visible&&!document.hidden){video.play().then(()=>{video.classList.add('is-playing');}).catch(()=>{video.classList.remove('is-playing');});}
  else{video.pause();}
 }
 video.addEventListener('canplay',()=>{ready=true;sync();});video.addEventListener('error',()=>{ready=false;video.classList.remove('is-playing');});
 new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync();},{threshold:.05}).observe(video.closest('.hero'));
 reduced.addEventListener('change',sync);desktop.addEventListener('change',sync);connection?.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
})();

// Keep article navigation anchored to the section being read.
(()=>{const links=[...document.querySelectorAll('.article-toc a[href^="#"]')];if(!links.length)return;const sections=links.map(a=>document.querySelector(a.hash));let queued=false;function update(){queued=false;let current=-1;sections.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<=170)current=i});links.forEach((a,i)=>{if(i===current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});update()})();
