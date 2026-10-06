// SABATER — purpose-built mechanical study. Illustrative, not a numerical simulation.
const root=document.querySelector('.vibration-lab');
if(root){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let mode=0,api=null;
 const copy=[['Todo empieza en la fuente.','Las fuerzas dinámicas de una máquina pueden viajar a través de sus apoyos y excitar la estructura que la sostiene.'],['Intervenir en el camino.','Los apoyos elásticos pueden reducir la transmisión cuando se seleccionan según la masa, las frecuencias de excitación y las condiciones de instalación.'],['Cada parte tiene una función.','Separá visualmente el conjunto: máquina, bancada, apoyos y estructura. El diagnóstico permite decidir dónde y cómo intervenir.']];
 root.querySelectorAll('[data-lab-mode]').forEach(b=>b.addEventListener('click',()=>{mode=Number(b.dataset.labMode);root.querySelector('.lab-stage').dataset.mode=mode;root.querySelectorAll('[data-lab-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));root.querySelector('.lab-explanation h3').textContent=copy[mode][0];root.querySelector('.lab-explanation p').textContent=copy[mode][1];root.querySelector('[data-anchor="mount"] b').textContent=mode?'Apoyos elásticos':'Camino de transmisión';api?.refresh(true);}));
 const observer=new IntersectionObserver(async entries=>{if(!entries.some(e=>e.isIntersecting))return;observer.disconnect();try{const T=await import('./vendor/three.module.min.js');api=buildScene(T);root.classList.add('lab-ready');}catch(e){root.classList.add('lab-unavailable');root.querySelector('.lab-instruction').textContent='EXPLORÁ LOS TRES PRINCIPIOS';}},{rootMargin:'300px'});observer.observe(root);
 function buildScene(T){
 const host=root.querySelector('.lab-viewport'),stage=root.querySelector('.lab-stage');
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.shadowMap.enabled=true;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;renderer.shadowMap.type=T.PCFShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;host.append(renderer.domElement);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.1,80);scene.fog=new T.FogExp2(0x0b1720,.018);
 // Large softbox panels create real reflections on the machined metal surfaces.
 const envScene=new T.Scene();envScene.background=new T.Color(0x354753);
 for(const [x,y,z,w,h,c] of [[0,6,1,7,3,0xffffff],[-5,2,0,3,5,0x7cb9db],[4,2,-3,3,5,0xffd7ae]]){const p=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:c,side:T.DoubleSide}));p.position.set(x,y,z);p.lookAt(0,1,0);envScene.add(p);}
 const pmrem=new T.PMREMGenerator(renderer),env=pmrem.fromScene(envScene,.02);scene.environment=env.texture;pmrem.dispose();
 scene.add(new T.HemisphereLight(0xd9edf8,0x0d1720,2));
 const key=new T.DirectionalLight(0xdbefff,5);key.position.set(-3,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.normalBias=.025;key.shadow.radius=3;Object.assign(key.shadow.camera,{left:-6,right:6,top:6,bottom:-6});key.shadow.bias=-.001;scene.add(key);
 const rim=new T.DirectionalLight(0x92c7e7,4);rim.position.set(2,3,-5);scene.add(rim);const warm=new T.PointLight(0xf2c69b,35,15);warm.position.set(5,3,2);scene.add(warm);
 const steel=new T.MeshStandardMaterial({color:0x71818c,metalness:.94,roughness:.28}),paint=new T.MeshStandardMaterial({color:0x243a46,metalness:.7,roughness:.37}),dark=new T.MeshStandardMaterial({color:0x101b24,metalness:.6,roughness:.44}),rubber=new T.MeshStandardMaterial({color:0x10161a,metalness:.05,roughness:.8}),copper=new T.MeshStandardMaterial({color:0xb78a60,metalness:.85,roughness:.26}),blue=new T.MeshStandardMaterial({color:0x86cbdc,metalness:.55,roughness:.22,emissive:0x416a7b,emissiveIntensity:.4});
 // Subtle procedural cast-metal grain; no downloaded texture or enlarged image.
 const grainCanvas=document.createElement('canvas');grainCanvas.width=128;grainCanvas.height=128;const gc=grainCanvas.getContext('2d'),gd=gc.createImageData(128,128);let seed=17;for(let i=0;i<gd.data.length;i+=4){seed=(seed*16807)%2147483647;const n=105+seed%45;gd.data[i]=gd.data[i+1]=gd.data[i+2]=n;gd.data[i+3]=255;}gc.putImageData(gd,0,0);const grain=new T.CanvasTexture(grainCanvas);grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.repeat.set(6,6);paint.bumpMap=grain;paint.bumpScale=.018;paint.roughnessMap=grain;paint.roughness=.85;
 // Distinct surfaces: milled steel, painted casting, rubber and mineral foundation.
 const finishCanvas=document.createElement('canvas');finishCanvas.width=256;finishCanvas.height=256;const fc=finishCanvas.getContext('2d');fc.fillStyle='#a9a9a9';fc.fillRect(0,0,256,256);for(let y=0;y<256;y++){seed=(seed*16807)%2147483647;fc.fillStyle=`rgba(255,255,255,${.04+(seed%20)/100})`;fc.fillRect(0,y,256,1);}const brushed=new T.CanvasTexture(finishCanvas);brushed.wrapS=brushed.wrapT=T.RepeatWrapping;brushed.repeat.set(1,5);steel.roughnessMap=brushed;steel.roughness=.48;steel.bumpMap=brushed;steel.bumpScale=.002;
 const concreteCanvas=document.createElement('canvas');concreteCanvas.width=256;concreteCanvas.height=256;const cc=concreteCanvas.getContext('2d'),cd=cc.createImageData(256,256);for(let i=0;i<cd.data.length;i+=4){seed=(seed*16807)%2147483647;const v=88+seed%62;cd.data[i]=v;cd.data[i+1]=v+5;cd.data[i+2]=v+9;cd.data[i+3]=255;}cc.putImageData(cd,0,0);for(let i=0;i<180;i++){seed=(seed*16807)%2147483647;cc.fillStyle='rgba(35,45,50,.25)';cc.beginPath();cc.arc(seed%256,(seed>>8)%256,.3+(seed%9)/10,0,Math.PI*2);cc.fill();}const concreteMap=new T.CanvasTexture(concreteCanvas);concreteMap.wrapS=concreteMap.wrapT=T.RepeatWrapping;concreteMap.repeat.set(3,2);concreteMap.colorSpace=T.SRGBColorSpace;const concrete=new T.MeshStandardMaterial({color:0x899299,map:concreteMap,bumpMap:concreteMap,bumpScale:.025,roughness:.93,metalness:.02});
 function mesh(geo,mat,parent,x=0,y=0,z=0){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function box(w,h,d,mat,parent,x,y,z){if(w<.4||h<.08||d<.25)return mesh(new T.BoxGeometry(w,h,d),mat,parent,x,y,z);const b=Math.min(.025,h*.14),shape=new T.Shape(),a=w/2-b,c=h/2-b;shape.moveTo(-a,-c);shape.lineTo(a,-c);shape.lineTo(a,c);shape.lineTo(-a,c);shape.closePath();const geo=new T.ExtrudeGeometry(shape,{depth:d-2*b,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:2,steps:1});geo.translate(0,0,-d/2+b);return mesh(geo,mat,parent,x,y,z);}
 function cyl(r,len,mat,parent,x,y,z,axis='x',segments=64){const m=mesh(new T.CylinderGeometry(r,r,len,segments),mat,parent,x,y,z);if(axis==='x')m.rotation.z=Math.PI/2;return m;}
 function ring(r,t,mat,parent,x,y,z){const m=mesh(new T.TorusGeometry(r,t,10,80),mat,parent,x,y,z);m.rotation.y=Math.PI/2;return m;}
 const assembly=new T.Group();scene.add(assembly);
 const foundation=new T.Group();assembly.add(foundation);box(5,.28,2.7,concrete,foundation,0,-.03,0);box(4.9,.015,2.6,steel,foundation,0,.12,0);
 // Machined anchor bolts, recesses and compression springs.
 const mounts=new T.Group();assembly.add(mounts);const rigidMounts=[];
 for(const x of [-1.65,1.65])for(const z of [-.85,.85]){
  rigidMounts.push(box(.43,.46,.43,paint,mounts,x,.47,z));box(.65,.09,.57,steel,mounts,x,.2,z);cyl(.2,.46,rubber,mounts,x,.47,z,'y');
  const points=[];for(let i=0;i<=180;i++){const a=i/180*Math.PI*12;points.push(new T.Vector3(x+Math.cos(a)*.21,.28+i/180*.39,z+Math.sin(a)*.21));}mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),180,.032,7,false),steel,mounts);
  cyl(.28,.08,steel,mounts,x,.7,z,'y');cyl(.07,.64,copper,mounts,x,.5,z,'y',6);
  for(const dx of [-.24,.24])cyl(.045,.07,steel,mounts,x+dx,.28,z,'y',6);
 }
 const bed=new T.Group();assembly.add(bed);box(4.45,.18,2.3,paint,bed,0,.85,0);box(4.4,.025,2.28,steel,bed,0,.95,0);
 // Washers, recessed fasteners and anchor studs at the edges of the bed.
 for(const x of [-1.94,1.94])for(const z of [-.93,.93]){cyl(.12,.024,dark,bed,x,.98,z,'y');cyl(.085,.035,steel,bed,x,1.005,z,'y');cyl(.057,.075,steel,bed,x,1.045,z,'y',6);box(.05,.004,.01,dark,bed,x,1.085,z);}
 for(const x of [-2.27,2.27])for(const z of [-1.1,1.1]){cyl(.095,.022,steel,foundation,x,.143,z,'y');cyl(.056,.065,steel,foundation,x,.176,z,'y',6);}
 const motor=new T.Group();assembly.add(motor);motor.position.y=1.02;
 for(const x of [-.95,.65])for(const z of [-.48,.48]){box(.45,.22,.35,paint,motor,x,.12,z);cyl(.06,.06,steel,motor,x,.25,z,'y',6);}
 cyl(.69,2.15,paint,motor,-.25,.9,0);
 // Longitudinal cooling fins follow a cast motor housing, not decorative generic shapes.
 for(let i=0;i<28;i++){const a=i/28*Math.PI*2;const f=box(1.94,.13,.034,paint,motor,-.25,.9+Math.cos(a)*.72,Math.sin(a)*.72);f.rotation.x=a;}
 for(const x of [-1.38,.87]){cyl(.76,.12,paint,motor,x,.9,0);ring(.63,.022,steel,motor,x+(x>0?.07:-.07),.9,0);for(let i=0;i<8;i++){let a=i/8*Math.PI*2;cyl(.047,.05,steel,motor,x+(x>0?.1:-.1),.9+Math.cos(a)*.65,Math.sin(a)*.65,'x',6);}}
 cyl(.59,.23,dark,motor,-1.53,.9,0);for(let i=0;i<10;i++){const a=i/10*Math.PI*2;box(.025,.055,.42,steel,motor,-1.655,.9+Math.cos(a)*.42,Math.sin(a)*.42).rotation.x=a;}
 for(const radius of [.18,.3,.43,.54])ring(radius,.012,steel,motor,-1.66,.9,0);
 for(const x of [1.16,1.22,1.29,1.35,1.42,1.49])ring(.173,.004,dark,motor,x,.9,0);
 // Lifting eye and connector collar add mechanically meaningful detail.
 const eye=mesh(new T.TorusGeometry(.105,.033,10,32),steel,motor,-.93,1.76,0);cyl(.05,.13,steel,motor,-.93,1.65,0,'y');
 cyl(.36,.2,steel,motor,1,.9,0);cyl(.17,.65,steel,motor,1.35,.9,0);
 const rotor=new T.Group();rotor.position.set(1.68,.9,0);motor.add(rotor);cyl(.35,.32,steel,rotor,0,0,0);ring(.31,.04,copper,rotor,.02,0,0);for(let i=0;i<6;i++){let a=i/6*Math.PI*2;cyl(.036,.035,dark,rotor,.18,Math.cos(a)*.25,Math.sin(a)*.25,'x',6);}cyl(.13,.4,steel,motor,1.95,.9,0);
 box(.64,.26,.56,paint,motor,-.3,1.68,0);box(.7,.045,.62,steel,motor,-.3,1.83,0);for(const x of [-.57,-.03])for(const z of [-.24,.24])cyl(.026,.022,dark,motor,x,1.865,z,'y',6);
 // Sensor, cable and inset identity plate.
 cyl(.095,.2,steel,motor,.44,1.67,.04,'y',6);cyl(.067,.08,blue,motor,.44,1.81,.04,'y');const cable=new T.CatmullRomCurve3([new T.Vector3(.44,1.85,.04),new T.Vector3(.7,2,.2),new T.Vector3(.9,1.7,.6),new T.Vector3(.5,.35,1)]);mesh(new T.TubeGeometry(cable,40,.019,6,false),rubber,motor);
 const tagCanvas=document.createElement('canvas');tagCanvas.width=512;tagCanvas.height=128;const ctx=tagCanvas.getContext('2d');ctx.fillStyle='#9aabb4';ctx.fillRect(0,0,512,128);ctx.fillStyle='#182832';ctx.font='bold 34px sans-serif';ctx.fillText('SABATER / INGENIERÍA',22,51);ctx.font='18px monospace';ctx.fillText('ESTUDIO CONCEPTUAL · VIBRACIONES',22,94);const tagTex=new T.CanvasTexture(tagCanvas);tagTex.colorSpace=T.SRGBColorSpace;const tag=mesh(new T.PlaneGeometry(.94,.235),new T.MeshStandardMaterial({map:tagTex,metalness:.6,roughness:.4}),motor,-.3,1,.775);
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const sc=shadowCanvas.getContext('2d'),sg=sc.createRadialGradient(64,64,15,64,64,64);sg.addColorStop(0,'rgba(0,0,0,.65)');sg.addColorStop(.5,'rgba(0,0,0,.3)');sg.addColorStop(1,'rgba(0,0,0,0)');sc.fillStyle=sg;sc.fillRect(0,0,128,128);const contactShadow=mesh(new T.PlaneGeometry(8,5),new T.MeshBasicMaterial({map:new T.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}),scene,0,-.087,0);contactShadow.rotation.x=-Math.PI/2;contactShadow.castShadow=false;
 const floor=mesh(new T.PlaneGeometry(200,200),new T.ShadowMaterial({opacity:.28}),scene,0,-.1,0);floor.rotation.x=-Math.PI/2;
 const waves=[];for(let i=0;i<5;i++){const m=mesh(new T.RingGeometry(.99,1.007,100),new T.MeshBasicMaterial({color:0xc9956c,transparent:true,opacity:.2,side:T.DoubleSide,depthWrite:false}),scene,0,-.06,0);m.rotation.x=-Math.PI/2;waves.push(m);}
 const grid=new T.GridHelper(16,32,0x335366,0x203645);grid.position.y=-.08;grid.material.transparent=true;grid.material.opacity=.28;scene.add(grid);
 let yaw=.7,targetYaw=.7,pitch=.38,targetPitch=.38,active=false,raf=0,last=0,time=0,explode=0,isolate=0,drag=null,lastShadow=0;
 const labels=[...root.querySelectorAll('[data-anchor]')],v=new T.Vector3();
 function size(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();refresh();}
 function render(dt=0){const priorExplode=explode;time+=dt;const smooth=1-Math.exp(-dt*6);yaw+=(targetYaw-yaw)*(dt?smooth:1);pitch+=(targetPitch-pitch)*(dt?smooth:1);explode+=((mode===2?1:0)-explode)*(reduced.matches?1:smooth);isolate+=((mode===1?1:0)-isolate)*(reduced.matches?1:smooth);
 const radius=(host.clientWidth<700?12.5:9.7)+explode*1.2;camera.position.set(Math.sin(yaw)*radius,2.2+Math.sin(pitch)*radius,Math.cos(yaw)*radius);camera.lookAt(0,1.15+explode*.55,0);camera.updateMatrixWorld();
 motor.position.y=1.02+explode*1.65;bed.position.y=explode*.5;mounts.position.y=explode*.2;
 if(!reduced.matches){motor.position.x=Math.sin(time*32)*.009*(1-explode);rotor.rotation.x=time*2.5;foundation.position.y=Math.sin(time*32)*.008*(1-isolate*.86)*(1-explode);}else{motor.position.x=0;foundation.position.y=0;}
 rigidMounts.forEach(m=>m.visible=mode===0);mounts.children.forEach(m=>{if(m.geometry.type==='TubeGeometry'){m.material=mode>0?blue:steel;m.visible=mode>0;}});
 waves.forEach((m,i)=>{const f=((time*.22+i/5)%1);m.scale.setScalar(1+f*4);m.material.opacity=(1-f)*.25*(1-isolate*.85)*(1-explode);m.material.color.set(isolate>.5?0x92cddd:0xc9956c);});
 const anchors=[[-.4,3.1+explode*1.65,0],[1.7,.95+explode*.2,1],[-2.6,.3,1.3]];
 anchors.forEach((a,i)=>{v.set(...a).project(camera);labels[i].style.left=`${Math.max(9,Math.min(91,(v.x*.5+.5)*100))}%`;labels[i].style.top=`${Math.max(17,Math.min(80,(-v.y*.5+.5)*100))}%`;});
 if((Math.abs(explode-priorExplode)>.0005&&time-lastShadow>.12)||stage.dataset.renderedMode!==String(mode)){renderer.shadowMap.needsUpdate=true;lastShadow=time;}renderer.render(scene,camera);stage.dataset.renderedMode=String(mode);
 }
 function loop(now){raf=0;if(!active||document.hidden)return;const elapsed=(now-last)/1000;if(elapsed>=1/30){last=now;render(Math.min(elapsed,.5));}if(!reduced.matches)raf=requestAnimationFrame(loop);}
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
 root.querySelectorAll('[data-orbit]').forEach(b=>b.addEventListener('click',()=>{targetYaw+=Number(b.dataset.orbit)*.4;refresh(true);}));root.querySelector('[data-reset]').addEventListener('click',()=>{targetYaw=.7;targetPitch=.38;refresh(true);});renderer.domElement.addEventListener('webglcontextrestored',()=>{renderer.shadowMap.needsUpdate=true;root.classList.remove('lab-unavailable');root.classList.add('lab-ready');active=true;refresh(true);});renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);active=false;root.classList.remove('lab-ready');root.classList.add('lab-unavailable');});size();render(0);return{refresh};
 }
}
