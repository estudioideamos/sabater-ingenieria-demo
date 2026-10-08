import {createIndustrialMotor} from './industrial-motor.js?v=2';
import {refineFinishes} from './material-finishes.js';
// SABATER — purpose-built mechanical study. Illustrative, not a numerical simulation.
const root=document.querySelector('.vibration-lab');
if(root){
 const modeButtons=[...root.querySelectorAll('[data-lab-mode]')];modeButtons.forEach(b=>b.disabled=true);root.setAttribute('aria-busy','true');
 function showStatic(){root.classList.remove('lab-ready','lab-loading');root.classList.add('lab-unavailable');root.setAttribute('aria-busy','false');root.querySelector('.lab-live').textContent='VISTA ESTÁTICA · MODELO CONCEPTUAL';modeButtons.forEach(b=>b.disabled=true);}

 const mobileLayout=matchMedia('(max-width: 760px)'),viewControls=root.querySelector('.lab-view-controls');const syncControls=()=>viewControls.open=!mobileLayout.matches;syncControls();mobileLayout.addEventListener('change',syncControls);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let mode=0,api=null;
 const copy=[['La vibración llega a la estructura.','Las fuerzas dinámicas de una máquina pueden viajar a través de sus apoyos y excitar la estructura que la sostiene.'],['El aislamiento puede reducir la transmisión.','Los apoyos elásticos pueden reducir la transmisión cuando se seleccionan según la masa, las frecuencias de excitación y las condiciones de instalación.'],['Cada parte tiene una función.','Explorá el rodamiento, el bobinado y el acople del motor, además de sus apoyos y estructura. El diagnóstico permite identificar dónde se origina la vibración y cómo se transmite.']];
 root.querySelectorAll('[data-lab-mode]').forEach(b=>b.addEventListener('click',()=>{mode=Number(b.dataset.labMode);root.querySelector('.lab-stage').dataset.mode=mode;root.querySelector('.lab-state-caption').textContent=mode===1?'Apoyos elásticos · menor transmisión':mode===2?'Despiece · componentes del sistema':'Apoyos rígidos · transmisión a la base';root.querySelectorAll('[data-lab-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));root.querySelector('.lab-explanation h3').textContent=copy[mode][0];root.querySelector('.lab-explanation p').textContent=copy[mode][1];root.querySelector('.lab-spectrum>span').textContent=mode===1?'Transmisión reducida · esquema conceptual':'Transmisión a la estructura';root.querySelector('[data-anchor="mount"] b').textContent=mode?'Apoyos elásticos':'Camino de transmisión';api?.refresh(true);}));
 let inView=false,starting=false,startTimer=0,lastScroll=performance.now();
 const markScroll=()=>{lastScroll=performance.now();if(inView&&!starting)queueStart();};
 const waitForQuiet=async()=>{while(document.hidden||performance.now()-lastScroll<220)await new Promise(resolve=>setTimeout(resolve,100));};
 async function startScene(){if(starting||!inView||document.hidden)return;starting=true;root.classList.add('lab-loading');await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));try{const T=await import('./vendor/three.module.min.js?v=186');await waitForQuiet();if(!inView){starting=false;root.classList.remove('lab-loading');return;}api=buildScene(T);await api.ready;root.classList.remove('lab-loading');root.classList.add('lab-ready');root.setAttribute('aria-busy','false');modeButtons.forEach(b=>b.disabled=false);}catch(e){showStatic();}finally{if(starting){observer.disconnect();removeEventListener('scroll',markScroll);document.removeEventListener('visibilitychange',queueStart);}}}
 function queueStart(){clearTimeout(startTimer);if(inView&&!starting)startTimer=setTimeout(startScene,240);}
 const observer=new IntersectionObserver(entries=>{inView=entries[0].intersectionRatio>=.12;queueStart();},{threshold:.12});observer.observe(root);addEventListener('scroll',markScroll,{passive:true});document.addEventListener('visibilitychange',queueStart);

 function buildScene(T){
 const host=root.querySelector('.lab-viewport'),stage=root.querySelector('.lab-stage');
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:innerWidth>760?'high-performance':'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth>760?1.75:1.25));renderer.shadowMap.enabled=true;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;renderer.shadowMap.type=T.VSMShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;host.append(renderer.domElement);
 let composer=null,expensiveFrames=0;
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.1,80);scene.background=new T.Color(0x09141c);scene.fog=new T.Fog(0x09141c,7,19);
 // Large softbox panels create real reflections on the machined metal surfaces.
 const envScene=new T.Scene();envScene.background=new T.Color(0x34434c);
 for(const [x,y,z,w,h,c] of [[0,6,1,6,1.8,0xffffff],[-4,2,3,1.3,5,0xc2ddf1],[3,2,-4,1.1,5,0xffffff],[4,1,3,.5,3,0xf2dac5]]){const p=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:c,side:T.DoubleSide}));p.position.set(x,y,z);p.lookAt(0,1,0);envScene.add(p);}
 const pmrem=new T.PMREMGenerator(renderer),env=pmrem.fromScene(envScene,.05);scene.environment=env.texture;scene.environmentIntensity=.95;pmrem.dispose();
 scene.add(new T.HemisphereLight(0xd9edf8,0x263b49,.65));
 const key=new T.DirectionalLight(0xf4f6f7,1.5);key.position.set(-3,5,6);key.castShadow=true;key.shadow.mapSize.set(innerWidth>760?2048:1024,innerWidth>760?2048:1024);key.shadow.normalBias=.025;key.shadow.radius=5;key.shadow.blurSamples=8;Object.assign(key.shadow.camera,{left:-6,right:6,top:6,bottom:-6});key.shadow.bias=-.001;scene.add(key);
 const rim=new T.DirectionalLight(0xc9e6f3,1.8);rim.position.set(2,3,-5);scene.add(rim);const warm=new T.PointLight(0xf2d4b6,5,15);warm.position.set(5,3,2);scene.add(warm);const fill=new T.DirectionalLight(0xb8d1df,1.1);fill.position.set(0,3,6);scene.add(fill);const supportLight=new T.PointLight(0xc0d9e8,13,9,2);supportLight.position.set(-1,.95,3.5);scene.add(supportLight);
 const steel=new T.MeshStandardMaterial({color:0xb0b5b6,metalness:.94,roughness:.28}),paint=new T.MeshStandardMaterial({color:0x34474f,metalness:.2,roughness:.37}),dark=new T.MeshStandardMaterial({color:0x101b24,metalness:.6,roughness:.44}),rubber=new T.MeshStandardMaterial({color:0x10161a,metalness:.05,roughness:.8}),copper=new T.MeshStandardMaterial({color:0xb78a60,metalness:.85,roughness:.26}),blue=new T.MeshStandardMaterial({color:0x86cbdc,metalness:.55,roughness:.22,emissive:0x416a7b,emissiveIntensity:.4});
 // Subtle procedural cast-metal grain; no downloaded texture or enlarged image.
 const grainCanvas=document.createElement('canvas');grainCanvas.width=128;grainCanvas.height=128;const gc=grainCanvas.getContext('2d'),gd=gc.createImageData(128,128);let seed=17;for(let i=0;i<gd.data.length;i+=4){seed=(seed*16807)%2147483647;const n=105+seed%45;gd.data[i]=gd.data[i+1]=gd.data[i+2]=n;gd.data[i+3]=255;}gc.putImageData(gd,0,0);const grain=new T.CanvasTexture(grainCanvas);grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.repeat.set(6,6);paint.bumpMap=grain;paint.bumpScale=.018;paint.roughnessMap=grain;paint.roughness=.85;
 // Distinct surfaces: milled steel, painted casting, rubber and mineral foundation.
 const finishCanvas=document.createElement('canvas');finishCanvas.width=256;finishCanvas.height=256;const fc=finishCanvas.getContext('2d');fc.fillStyle='#a9a9a9';fc.fillRect(0,0,256,256);for(let y=0;y<256;y++){seed=(seed*16807)%2147483647;fc.fillStyle=`rgba(255,255,255,${.04+(seed%20)/100})`;fc.fillRect(0,y,256,1);}const brushed=new T.CanvasTexture(finishCanvas);brushed.wrapS=brushed.wrapT=T.RepeatWrapping;brushed.repeat.set(1,5);steel.roughnessMap=brushed;steel.roughness=.65;steel.bumpMap=brushed;steel.bumpScale=.002;
 refineFinishes(T,{steel,paint,rubber});
 paint.color.set(0x20333f);paint.metalness=.3;paint.roughness=.48;paint.bumpScale=.007;
 steel.color.set(0xd1d7da);steel.roughness=.38;
 const machined=steel.clone();machined.roughness=.32;machined.envMapIntensity=.9;

 const concreteCanvas=document.createElement('canvas');concreteCanvas.width=256;concreteCanvas.height=256;const cc=concreteCanvas.getContext('2d'),cd=cc.createImageData(256,256);for(let i=0;i<cd.data.length;i+=4){seed=(seed*16807)%2147483647;const v=88+seed%62;cd.data[i]=v;cd.data[i+1]=v+5;cd.data[i+2]=v+9;cd.data[i+3]=255;}cc.putImageData(cd,0,0);for(let i=0;i<180;i++){seed=(seed*16807)%2147483647;cc.fillStyle='rgba(35,45,50,.25)';cc.beginPath();cc.arc(seed%256,(seed>>8)%256,.3+(seed%9)/10,0,Math.PI*2);cc.fill();}const concreteMap=new T.CanvasTexture(concreteCanvas);concreteMap.wrapS=concreteMap.wrapT=T.RepeatWrapping;concreteMap.repeat.set(3,2);concreteMap.colorSpace=T.SRGBColorSpace;const concrete=new T.MeshStandardMaterial({color:0x899299,map:concreteMap,bumpMap:concreteMap,bumpScale:.025,roughness:.93,metalness:.02});
 function mesh(geo,mat,parent,x=0,y=0,z=0){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function box(w,h,d,mat,parent,x,y,z){if(w<.4||h<.08||d<.25)return mesh(new T.BoxGeometry(w,h,d),mat,parent,x,y,z);const b=Math.min(.025,h*.14),shape=new T.Shape(),a=w/2-b,c=h/2-b;shape.moveTo(-a,-c);shape.lineTo(a,-c);shape.lineTo(a,c);shape.lineTo(-a,c);shape.closePath();const geo=new T.ExtrudeGeometry(shape,{depth:d-2*b,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:2,steps:1});geo.translate(0,0,-d/2+b);return mesh(geo,mat,parent,x,y,z);}
 function cyl(r,len,mat,parent,x,y,z,axis='x',segments=64){const m=mesh(new T.CylinderGeometry(r,r,len,segments),mat,parent,x,y,z);if(axis==='x')m.rotation.z=Math.PI/2;return m;}
 function ring(r,t,mat,parent,x,y,z){const m=mesh(new T.TorusGeometry(r,t,10,80),mat,parent,x,y,z);m.rotation.y=Math.PI/2;return m;}
 const assembly=new T.Group();scene.add(assembly);
 const foundation=new T.Group();assembly.add(foundation);box(5,.28,2.7,concrete,foundation,0,-.03,0);box(4.9,.015,2.6,concrete,foundation,0,.12,0);
 // Machined anchor bolts, recesses and compression springs.
 const mounts=new T.Group();assembly.add(mounts);const rigidMounts=[];
 for(const x of [-1.65,1.65])for(const z of [-.85,.85]){
  rigidMounts.push(box(.43,.46,.43,paint,mounts,x,.47,z));box(.65,.09,.57,steel,mounts,x,.2,z);cyl(.2,.46,rubber,mounts,x,.47,z,'y');
  const points=[];for(let i=0;i<=180;i++){const a=i/180*Math.PI*12;points.push(new T.Vector3(x+Math.cos(a)*.21,.28+i/180*.39,z+Math.sin(a)*.21));}mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),180,.032,7,false),steel,mounts);
  cyl(.28,.08,steel,mounts,x,.7,z,'y');cyl(.07,.64,copper,mounts,x,.5,z,'y',6);
  for(const dx of [-.24,.24])cyl(.045,.07,steel,mounts,x+dx,.28,z,'y',6);
 }
 const rigidFinish=paint.clone();rigidFinish.transparent=true;rigidMounts.forEach(m=>m.material=rigidFinish);
 const springFinish=steel.clone();springFinish.emissive=new T.Color(0x305969);springFinish.emissiveIntensity=0;
 const transmissionMarkers=[];
 for(const x of [-1.65,1.65])for(const z of [-.85,.85]){
  const marker=mesh(new T.SphereGeometry(.035,10,8),new T.MeshBasicMaterial({color:0xd5a77d,transparent:true,opacity:.75,depthWrite:false}),assembly,x,.75,z);
  marker.castShadow=false;transmissionMarkers.push(marker);
 }
 const bed=new T.Group();assembly.add(bed);box(4.45,.18,2.3,paint,bed,0,.85,0);box(4.4,.025,2.28,paint,bed,0,.95,0);
 // Washers, recessed fasteners and anchor studs at the edges of the bed.
 for(const x of [-1.94,1.94])for(const z of [-.93,.93]){cyl(.12,.024,dark,bed,x,.98,z,'y');cyl(.085,.035,steel,bed,x,1.005,z,'y');cyl(.057,.075,steel,bed,x,1.045,z,'y',6);box(.05,.004,.01,dark,bed,x,1.085,z);}
 for(const x of [-2.27,2.27])for(const z of [-1.1,1.1]){cyl(.095,.022,steel,foundation,x,.143,z,'y');cyl(.056,.065,steel,foundation,x,.176,z,'y',6);}
 const {motor,rotor,articulate}=createIndustrialMotor(T,{paint,steel,dark,rubber,copper});assembly.add(motor);
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const sc=shadowCanvas.getContext('2d'),sg=sc.createRadialGradient(64,64,15,64,64,64);sg.addColorStop(0,'rgba(0,0,0,.65)');sg.addColorStop(.5,'rgba(0,0,0,.3)');sg.addColorStop(1,'rgba(0,0,0,0)');sc.fillStyle=sg;sc.fillRect(0,0,128,128);const contactShadow=mesh(new T.PlaneGeometry(8,5),new T.MeshBasicMaterial({map:new T.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}),scene,0,-.087,0);contactShadow.rotation.x=-Math.PI/2;contactShadow.castShadow=false;
 const floor=mesh(new T.PlaneGeometry(200,200),new T.MeshStandardMaterial({color:0x0c161d,roughness:1,metalness:0}),scene,0,-.1,0);floor.rotation.x=-Math.PI/2;
 const waves=[];for(let i=0;i<5;i++){const m=mesh(new T.RingGeometry(.99,1.007,100),new T.MeshBasicMaterial({color:0xc9956c,transparent:true,opacity:.2,side:T.DoubleSide,depthWrite:false}),scene,0,-.06,0);m.rotation.x=-Math.PI/2;waves.push(m);}
 const grid=new T.GridHelper(16,32,0x335366,0x203645);grid.position.y=-.08;grid.material.transparent=true;grid.material.opacity=.055;scene.add(grid);
 let detail=0,targetDetail=0;
 let yaw=.9,targetYaw=.9,pitch=.16,targetPitch=.16,active=false,raf=0,last=0,time=0,explode=0,isolate=0,drag=null,lastShadow=0;
 const labels=[...root.querySelectorAll('[data-anchor]')],v=new T.Vector3();
 function size(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);composer?.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();refresh();}
 function render(dt=0){const priorExplode=explode;time+=dt;const smooth=1-Math.exp(-dt*6);yaw+=(targetYaw-yaw)*(dt?smooth:1);pitch+=(targetPitch-pitch)*(dt?smooth:1);explode+=((mode===2?1:0)-explode)*(reduced.matches?1:smooth);isolate+=((mode===1?1:0)-isolate)*(reduced.matches?1:smooth);
 detail+=(targetDetail-detail)*(reduced.matches?1:smooth);const radius=((host.clientWidth<500?10.4:8.8)+explode*2.4)*(1-detail*.25);camera.position.set(Math.sin(yaw)*radius,1.55+Math.sin(pitch)*radius,Math.cos(yaw)*radius);camera.lookAt(.25+explode*.25+detail*.15,1.18+explode*.7+detail*.58,0);camera.updateMatrixWorld();
 articulate(explode);motor.position.y=1.02+explode*1.35;bed.position.y=explode*.5;mounts.position.y=explode*.2;
 if(!reduced.matches){motor.position.x=Math.sin(time*32)*.009*(1-explode);rotor.rotation.x=time*2.5;foundation.position.y=Math.sin(time*32)*.016*(1-isolate*.9)*(1-explode);}else{motor.position.x=0;foundation.position.y=0;}
 rigidFinish.opacity=(1-isolate)*(1-explode);rigidMounts.forEach(m=>m.visible=rigidFinish.opacity>.02);springFinish.emissiveIntensity=isolate*.26;mounts.children.forEach(m=>{if(m.geometry.type==='TubeGeometry'){m.material=springFinish;m.visible=isolate>.02||mode===2;}});
 transmissionMarkers.forEach((m,i)=>{const phase=reduced.matches?.5:(time*.8+i*.18)%1;m.position.y=.78-phase*.55;m.material.opacity=(.8-isolate*.64)*(1-explode);m.material.color.set(isolate>.5?0x9ed8e5:0xd5a77d);m.visible=explode<.1;});
 waves.forEach((m,i)=>{const f=((time*.22+i/5)%1);m.scale.setScalar(1+f*4);m.material.opacity=(1-f)*.24*(1-isolate*.85)*(1-explode);m.material.color.set(isolate>.5?0x92cddd:0xc9956c);});
 const anchors=[[-.4,2.4+explode*1.35,.52],[1.65,.48+explode*.2,.85],[-1.9,.12,1.25]];
 const W=host.clientWidth,H=host.clientHeight;
 const positions=[[.18,.25],[.83,.58],[.18,.79]],lines=root.querySelectorAll('.lab-leaders line');
 anchors.forEach((a,i)=>{v.set(...a).project(camera);const label=labels[i],line=lines[i],show=mode===2||(mode===0?i!==1:i!==0);
 label.hidden=!show;line.style.display=show?'':'none';
 const x=W*positions[i][0],y=H*positions[i][1];label.style.left=`${x}px`;label.style.top=`${y}px`;
 line.setAttribute('x1',x+(i===1?-1:1)*label.offsetWidth/2);line.setAttribute('y1',y-label.offsetHeight/2);
 line.setAttribute('x2',(v.x*.5+.5)*W);line.setAttribute('y2',(-v.y*.5+.5)*H);const dot=root.querySelectorAll('.lab-leaders circle')[i];dot.style.display=show?'':'none';dot.setAttribute('cx',(v.x*.5+.5)*W);dot.setAttribute('cy',(-v.y*.5+.5)*H);
 });
 if((Math.abs(explode-priorExplode)>.0005&&time-lastShadow>.12)||stage.dataset.renderedMode!==String(mode)){renderer.shadowMap.needsUpdate=true;lastShadow=time;}if(composer){const started=performance.now();composer.render();if(!reduced.matches&&performance.now()-started>50)expensiveFrames++;else expensiveFrames=Math.max(0,expensiveFrames-1);if(expensiveFrames>=8){for(const pass of composer.passes)pass.dispose?.();composer.dispose();composer=null;root.dataset.contactShading='basic';}}else renderer.render(scene,camera);stage.dataset.renderedMode=String(mode);
 }
 function loop(now){raf=0;if(!active||document.hidden)return;const elapsed=(now-last)/1000;if(elapsed>=1/30){last=now;render(root.classList.contains('lab-ready')?Math.min(elapsed,.5):0);}if(!reduced.matches)raf=requestAnimationFrame(loop);}
 function refresh(force=false){
  if(reduced.matches||force){
   // A direct action always updates the actual scene, even between visibility callbacks.
   if(reduced.matches||!active){explode=mode===2?1:0;isolate=mode===1?1:0;}
   render(reduced.matches||!active?0:1/30);
  }
  if(!reduced.matches&&active&&!document.hidden&&!raf){last=performance.now();raf=requestAnimationFrame(loop);}
 }
 const visibility=new IntersectionObserver(es=>{active=es[0].isIntersecting;if(active)refresh();else{cancelAnimationFrame(raf);raf=0;}},{threshold:.01});visibility.observe(root);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else refresh();});reduced.addEventListener('change',()=>{cancelAnimationFrame(raf);raf=0;refresh();});new ResizeObserver(size).observe(host);
 host.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;drag={x:e.clientX,y:e.clientY,yaw:targetYaw,pitch:targetPitch};host.setPointerCapture(e.pointerId);});host.addEventListener('pointermove',e=>{if(!drag)return;targetYaw=drag.yaw+(e.clientX-drag.x)*.008;if(e.pointerType==='mouse')targetPitch=Math.max(.15,Math.min(.85,drag.pitch+(e.clientY-drag.y)*.003));refresh(true);});host.addEventListener('pointerup',()=>drag=null);host.addEventListener('pointercancel',()=>drag=null);host.addEventListener('lostpointercapture',()=>drag=null);
 root.querySelector('[data-lab-detail]').addEventListener('click',e=>{targetDetail=1-targetDetail;stage.dataset.detail=String(!!targetDetail);e.currentTarget.setAttribute('aria-pressed',String(!!targetDetail));e.currentTarget.innerHTML=targetDetail?'Ver conjunto <span aria-hidden="true">−</span>':'Ver de cerca <span aria-hidden="true">＋</span>';refresh(true);});
 root.querySelectorAll('[data-orbit]').forEach(b=>b.addEventListener('click',()=>{targetYaw+=Number(b.dataset.orbit)*.4;refresh(true);}));root.querySelector('[data-reset]').addEventListener('click',()=>{targetYaw=.9;targetPitch=.16;targetDetail=0;stage.dataset.detail='false';const zoomButton=root.querySelector('[data-lab-detail]');zoomButton.setAttribute('aria-pressed','false');zoomButton.innerHTML='Ver de cerca <span aria-hidden="true">＋</span>';refresh(true);});renderer.domElement.addEventListener('webglcontextrestored',()=>{renderer.shadowMap.needsUpdate=true;root.classList.remove('lab-unavailable');active=true;refresh(true);root.classList.add('lab-ready');root.setAttribute('aria-busy','false');root.querySelector('.lab-live').textContent='MODELO CONCEPTUAL';modeButtons.forEach(b=>b.disabled=false);});renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);active=false;showStatic();});size();render(0);
 // Contact occlusion adds depth between cooling fins, fasteners and mating surfaces.
 // Only desktop uses the extra pass; mobile retains the lightweight physical materials.
 const qualityReady=innerWidth>760?import('./vendor/lab-postprocessing.js?v=1').then(({EffectComposer,RenderPass,GTAOPass,OutputPass})=>{
  const target=new T.WebGLRenderTarget(host.clientWidth,host.clientHeight,{type:T.HalfFloatType,samples:4});
  composer=new EffectComposer(renderer,target);composer.setPixelRatio(1);composer.setSize(host.clientWidth,host.clientHeight);
  composer.addPass(new RenderPass(scene,camera));const ao=new GTAOPass(scene,camera,host.clientWidth,host.clientHeight);ao.updateGtaoMaterial({radius:.45,distanceExponent:1.5,thickness:.3});ao.blendIntensity=1;composer.addPass(ao);composer.addPass(new OutputPass());root.dataset.contactShading='ready';refresh(true);
 }).catch(()=>{composer=null;}):Promise.resolve();
 root.dataset.lighting='studio';
 const ready=Promise.race([qualityReady,new Promise(resolve=>setTimeout(resolve,1800))]).then(()=>{render(0);return new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
 return{refresh,ready};
 }
}
