/* Smooth desktop wheel travel; native touch, keyboard and accessibility remain intact. */
(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const desktop=matchMedia('(hover: hover) and (pointer: fine)');
  let frame=0,target=scrollY,current=scrollY,lastTime=0,lastWritten=scrollY,direction=0,pointerHeld=false;
  const stop=()=>{cancelAnimationFrame(frame);frame=0;target=current=scrollY;direction=0;};
  const locked=()=>document.querySelector('dialog[open],nav.open') || [document.documentElement,document.body].some(el=>/hidden|clip/.test(getComputedStyle(el).overflowY));
  function nativeTarget(event){
    for(const el of event.composedPath()){
      if(!(el instanceof Element)||el===document.body||el===document.documentElement)continue;
      if(el.matches('input,textarea,select,option,dialog,[contenteditable]:not([contenteditable="false"]),[data-native-scroll]'))return true;
      if(/auto|scroll|overlay/.test(getComputedStyle(el).overflowY)&&el.scrollHeight>el.clientHeight+1)return true;
    }
    return false;
  }
  function tick(now){
    if(pointerHeld||reduced.matches||!desktop.matches||locked()||Math.abs(scrollY-lastWritten)>.5){stop();return;}
    const dt=Math.min(64,now-lastTime);lastTime=now;
    target=Math.max(0,Math.min(target,document.documentElement.scrollHeight-innerHeight));
    current+=(target-current)*(1-Math.exp(-dt/240));
    const done=Math.abs(target-current)<.5;
    if(done)current=target;
    scrollTo({top:current,left:scrollX,behavior:'instant'});lastWritten=scrollY;
    frame=done?0:requestAnimationFrame(tick);
    if(done)direction=0;
  }
  addEventListener('wheel',event=>{
    // Small vertical deltas also come from physical wheels; never bypass easing by magnitude.
    if(pointerHeld||!event.cancelable||event.defaultPrevented||reduced.matches||!desktop.matches||event.ctrlKey||event.metaKey||event.shiftKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||!event.deltaY||locked()||nativeTarget(event)){stop();return;}
    const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1)*.55;
    const nextDirection=Math.sign(delta);
    if(!frame||Math.abs(scrollY-lastWritten)>.5||nextDirection!==direction){target=current=scrollY;}
    target=Math.max(0,Math.min(current+Math.max(-480,Math.min(480,target-current+delta)),document.documentElement.scrollHeight-innerHeight));
    if(!frame&&Math.abs(target-scrollY)<.5)return;
    event.preventDefault();direction=nextDirection;
    if(!frame){lastTime=performance.now();lastWritten=scrollY;frame=requestAnimationFrame(tick);}
  },{passive:false});
  // A new native interaction always takes priority over residual wheel inertia.
  const beginNative=()=>{pointerHeld=true;stop();};
  const endNative=()=>{pointerHeld=false;stop();};
  for(const name of ['pointerdown','mousedown','touchstart'])addEventListener(name,beginNative,{capture:true,passive:true});
  for(const name of ['pointerup','mouseup','pointercancel','touchend','touchcancel'])addEventListener(name,endNative,{capture:true,passive:true});
  for(const name of ['keydown','focusin'])addEventListener(name,stop,{capture:true,passive:true});
  // Native scrollbar gestures may not dispatch pointer events to the document.
  // Observe native position changes too, before the next easing frame can overwrite them.
  addEventListener('scroll',()=>{if(frame&&Math.abs(scrollY-lastWritten)>.5)stop();},{passive:true});
  addEventListener('mousemove',event=>{if(!event.buttons)pointerHeld=false;if(event.buttons||event.clientX>=document.documentElement.clientWidth)stop();},{capture:true,passive:true});
  document.addEventListener('pointerleave',stop,{passive:true});
  addEventListener('blur',endNative,{passive:true});
  for(const name of ['resize','hashchange','pagehide','blur'])addEventListener(name,stop,{passive:true});
  document.addEventListener('visibilitychange',stop);
  reduced.addEventListener('change',stop);desktop.addEventListener('change',stop);
})();
