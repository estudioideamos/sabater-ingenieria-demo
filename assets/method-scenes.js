import {refineFinishes} from './material-finishes.js';
// Four real-time product scenes, with matching rendered previews as the loading/WebGL fallback.
const hosts=[...document.querySelectorAll('.steps .step-visual')];
if(hosts.length){let loaded;const io=new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting){io.unobserve(e.target);loaded??=import('./vendor/three.module.min.js?v=186');loaded.then(T=>createInstrument(T,e.target,hosts.indexOf(e.target))).catch(()=>{});}},{rootMargin:'500px'});hosts.forEach(h=>io.observe(h));}
function createInstrument(T,host,index){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let renderer;
 try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.06;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.VSMShadowMap;renderer.shadowMap.autoUpdate=false;
 const canvas=renderer.domElement;canvas.setAttribute('aria-hidden','true');canvas.className='method-canvas';host.append(canvas);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(33,1,.1,50),group=new T.Group();scene.add(group);camera.position.set(4.7,3.4,6.5);camera.lookAt(0,1,0);
 const env=new T.Scene();env.background=new T.Color('#566571');for(const [x,y,z,w,h,color] of [[-4,4,3,4,6,'#f0f5f7'],[4,3,-2,3,5,'#b7d6e8'],[0,6,0,5,4,'#fff3e0']]){const p=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color,side:T.DoubleSide}));p.position.set(x,y,z);p.lookAt(0,0,0);env.add(p);}const pm=new T.PMREMGenerator(renderer);scene.environment=pm.fromScene(env,.03).texture;scene.environmentIntensity=.85;pm.dispose();env.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
 scene.add(new T.HemisphereLight('#deefff','#101920',1.25));const key=new T.DirectionalLight('#fff3e0',3.5);key.position.set(-3,6,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-4,right:4,top:4,bottom:-4});key.shadow.normalBias=.03;key.shadow.radius=4;key.shadow.blurSamples=6;scene.add(key);const rim=new T.DirectionalLight('#a5d3ef',2.5);rim.position.set(4,2,-3);scene.add(rim);
 const steel=new T.MeshStandardMaterial({color:'#aebbc0',metalness:.93,roughness:.23}),paint=new T.MeshStandardMaterial({color:'#284755',metalness:.48,roughness:.36}),black=new T.MeshStandardMaterial({color:'#101d25',metalness:.2,roughness:.62}),rubber=new T.MeshStandardMaterial({color:'#172023',roughness:.85}),brass=new T.MeshStandardMaterial({color:'#b99264',metalness:.85,roughness:.29});
 const grain=document.createElement('canvas');grain.width=grain.height=128;const gc=grain.getContext('2d'),pixels=gc.createImageData(128,128);let seed=42;for(let i=0;i<pixels.data.length;i+=4){seed=(seed*16807)%2147483647;const v=90+seed%85;pixels.data.set([v,v,v,255],i);}gc.putImageData(pixels,0,0);const tex=new T.CanvasTexture(grain);tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(4,4);paint.bumpMap=tex;paint.bumpScale=.014;
 refineFinishes(T,{steel,paint,rubber});
 function mesh(g,m,parent=group,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
 function box(w,h,d,m,p=group,x=0,y=0,z=0){if(Math.min(w,h,d)<.075)return mesh(new T.BoxGeometry(w,h,d),m,p,x,y,z);const b=Math.min(.028,w*.08,h*.08,d*.08),shape=new T.Shape(),a=w/2-b,c=h/2-b;shape.moveTo(-a,-c);shape.lineTo(a,-c);shape.lineTo(a,c);shape.lineTo(-a,c);shape.closePath();const geo=new T.ExtrudeGeometry(shape,{depth:d-2*b,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:2,steps:1});geo.translate(0,0,-d/2+b);return mesh(geo,m,p,x,y,z);}
 function cyl(r,h,m,p=group,x=0,y=0,z=0){return mesh(new T.CylinderGeometry(r,r,h,40),m,p,x,y,z);}
 function bolt(p,x,y,z){cyl(.075,.035,steel,p,x,y,z);mesh(new T.CylinderGeometry(.046,.046,.07,6),steel,p,x,y+.04,z);}
 function cable(points,r=.022,mat=black,p=group){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),48,r,8,false),mat,p);}
 const floor=mesh(new T.PlaneGeometry(20,20),new T.ShadowMaterial({opacity:.24}),scene,0,-.05,0);floor.rotation.x=-Math.PI/2;
 let screen,ctx,screenTexture,motor,shaft,platform,springs=[],tick=()=>{};
 function display(w,h,parent,x,y,z){screen=document.createElement('canvas');screen.width=512;screen.height=320;ctx=screen.getContext('2d');screenTexture=new T.CanvasTexture(screen);screenTexture.colorSpace=T.SRGBColorSpace;const mat=new T.MeshStandardMaterial({map:screenTexture,emissiveMap:screenTexture,emissive:0xffffff,emissiveIntensity:.55,metalness:.08,roughness:.25});return mesh(new T.PlaneGeometry(w,h),mat,parent,x,y,z);}
 function chart(t,report=false){ctx.fillStyle='#081923';ctx.fillRect(0,0,512,320);ctx.fillStyle='#bfd8e1';ctx.font='22px sans-serif';ctx.fillText(report?'REVISIÓN TÉCNICA':'ANÁLISIS DE SEÑAL',28,39);ctx.strokeStyle='#294653';ctx.lineWidth=1;for(let x=28;x<500;x+=38){ctx.beginPath();ctx.moveTo(x,65);ctx.lineTo(x,281);ctx.stroke();}for(let y=75;y<290;y+=40){ctx.beginPath();ctx.moveTo(28,y);ctx.lineTo(484,y);ctx.stroke();}ctx.strokeStyle='#b8deeb';ctx.lineWidth=2.5;ctx.beginPath();for(let x=28;x<485;x++){const a=x*.062+t*2.2;const y=130+Math.sin(a)*17+Math.sin(a*2.7)*8+Math.pow(Math.sin(a*.47),14)*33;x===28?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();if(report){ctx.fillStyle='#a0bcc8';for(let i=0;i<3;i++)ctx.fillRect(30,216+i*21,300-i*48,3);ctx.fillStyle='#94c9bf';ctx.fillRect(390,217,75,48);}else{for(let i=0;i<26;i++){const v=12+65*Math.exp(-Math.pow((i-9)/4,2))+12*Math.sin(t*1.8+i*.9);ctx.fillStyle=i===9?'#dcb083':'#6eabbf';ctx.fillRect(30+i*17,284-v,8,v);}const g=ctx.createLinearGradient(30,0,484,0);g.addColorStop(0,'#a5dded00');g.addColorStop(1,'#a5dded22');ctx.fillStyle=g;ctx.fillRect(28,66,(t*70)%450,123);}screenTexture.needsUpdate=true;}
 if(index===0){
  box(3,.15,1.9,paint,group,0,.12,0);motor=new T.Group();motor.position.y=1.12;group.add(motor);const body=cyl(.64,1.7,paint,motor);body.rotation.z=Math.PI/2;for(let x=-.78;x<.85;x+=.14){const fin=cyl(.72,.035,paint,motor,x);fin.rotation.z=Math.PI/2;}for(const x of [-.92,.92]){const end=cyl(.65,.12,paint,motor,x);end.rotation.z=Math.PI/2;for(let a=0;a<Math.PI*2;a+=Math.PI/4){const b=mesh(new T.CylinderGeometry(.05,.05,.09,6),steel,motor,x*1.07,Math.sin(a)*.53,Math.cos(a)*.53);b.rotation.z=Math.PI/2;}}shaft=cyl(.19,.65,steel,motor,1.22);shaft.rotation.z=Math.PI/2;box(.46,.25,.45,paint,motor,0,.67,0);cyl(.11,.2,steel,motor,.15,.9,0);for(const x of [-.55,.55]){box(.3,.32,1,paint,group,x,.37,0);for(const z of [-.65,.65])bolt(group,x,.23,z);}cable([[.15,2.11,0],[.6,2.4,-.2],[1.7,2.1,-.2],[1.8,.6,.7]]);const meter=new T.Group();meter.position.set(1.5,.65,.9);meter.rotation.y=-.3;group.add(meter);box(.56,.9,.17,black,meter);display(.43,.49,meter,0,.1,.091);cyl(.07,.04,brass,meter,0,-.3,.11).rotation.x=Math.PI/2;tick=t=>{motor.position.y=1.12+Math.sin(t*25)*.007;shaft.rotation.x=t*2;chart(t);};camera.position.set(4,3.1,6.1);
 }else if(index===1){
  box(3.15,2.02,.38,black,group,0,1.25,0);box(2.98,1.86,.39,paint,group,0,1.25,0);display(2.58,1.55,group,-.07,1.3,.205);for(const x of [-1.43,1.43])for(const y of [.4,2.1]){const b=mesh(new T.CylinderGeometry(.04,.04,.018,6),steel,group,x,y,.21);b.rotation.x=Math.PI/2;}for(let i=0;i<3;i++){const knob=cyl(.07,.07,i===0?brass:steel,group,1.39,.7+i*.24,.25);knob.rotation.x=Math.PI/2;}box(.45,.2,1.1,black,group,-1,.19,0);box(.45,.2,1.1,black,group,1,.19,0);cable([[-1.5,1,-.1],[-1.8,.7,-.2],[-1.6,.15,.8],[-.6,.05,1.1]]);tick=t=>chart(t);camera.position.set(3.3,2.9,6.5);
 }else if(index===2){
  box(3,.2,2.1,paint,group,0,.12,0);platform=new T.Group();platform.position.y=1.18;group.add(platform);box(3,.19,2.1,steel,platform);box(1.2,.38,.85,paint,platform,0,.28,0);for(const x of [-1.15,1.15])for(const z of [-.7,.7]){cyl(.24,.1,rubber,group,x,.28,z);cyl(.24,.08,steel,group,x,.35,z);const pts=[];for(let i=0;i<=180;i++){const a=i/180*Math.PI*12;pts.push(new T.Vector3(x+Math.cos(a)*.16,.4+i/180*.66,z+Math.sin(a)*.16));}const spring=mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),180,.034,8,false),steel);springs.push(spring);bolt(platform,x,.14,z);bolt(group,x,.24,z);}tick=t=>{const d=Math.sin(t*4)*.025+Math.sin(t*8)*.006;platform.position.y=1.18+d;for(const s of springs){s.scale.y=1+d/.66;s.position.y=-.4*d/.66;}};camera.position.set(4.5,3.4,5.8);
 }else{
  const tablet=new T.Group();tablet.rotation.y=-.08;tablet.rotation.x=-.12;tablet.position.set(-.1,1.35,0);group.add(tablet);
  box(2.9,1.95,.15,steel,tablet);box(2.82,1.87,.17,black,tablet);display(2.58,1.61,tablet,0,0,.095);
  box(3,.12,1.8,steel,group,0,.25,.7);box(2.7,.03,1.05,black,group,0,.325,.55);
  for(let row=0;row<4;row++)for(let col=0;col<12;col++)box(.17,.027,.13,paint,group,-1.18+col*.215,.35,.14+row*.205);
  box(.85,.012,.35,paint,group,0,.324,1.32);
  for(const x of [-1.05,1.05]){const hinge=cyl(.09,.35,steel,group,x,.36,-.06);hinge.rotation.z=Math.PI/2;}
  const sensor=new T.Group();sensor.position.set(1.95,.25,.7);group.add(sensor);cyl(.25,.25,steel,sensor,0,.13,0);cyl(.15,.25,steel,sensor,0,.37,0);cyl(.08,.15,brass,sensor,0,.56,0);
  cable([[1.95,.89,.7],[2.1,1,.1],[1.8,.2,-.6],[.7,.2,-.6]],.024,rubber);
  tick=t=>chart(t,true);camera.position.set(3.7,3.1,6.4);

 }

 // Functional hardware: flange grooves, connectors, grilles and captive fasteners.
 if(index===0){
  for(const x of [-1,1]){const collar=mesh(new T.TorusGeometry(.58,.015,8,48),steel,motor,x,0,0);collar.rotation.y=Math.PI/2;}
  for(let i=0;i<4;i++){const collar=mesh(new T.TorusGeometry(.193,.007,6,32),black,motor,1.04+i*.07,0,0);collar.rotation.y=Math.PI/2;}
  const lug=mesh(new T.TorusGeometry(.09,.025,8,24),steel,motor,-.45,.86,0);box(.2,.05,.15,steel,motor,-.45,.76,0);
  for(const x of [-.17,.17])for(const z of [-.17,.17])bolt(motor,x,.81,z);
 }else if(index===1){
  for(let y=.75;y<1.95;y+=.11)box(.012,.035,.24,black,group,1.5,y,-.035);
  for(const x of [-.85,-.55]){const port=cyl(.06,.08,brass,group,x,.39,.25);port.rotation.x=Math.PI/2;const bore=cyl(.035,.085,black,group,x,.39,.255);bore.rotation.x=Math.PI/2;}
  cable([[-1.1,2.3,-.1],[-1.1,2.55,-.1],[1.1,2.55,-.1],[1.1,2.3,-.1]],.045,rubber);
 }else if(index===2){
  for(const x of [-1.15,1.15])for(const z of [-.7,.7]){cyl(.25,.07,steel,platform,x,-.12,z);cyl(.09,.52,brass,group,x,.55,z);cyl(.14,.04,rubber,platform,x,-.17,z);}
  for(const z of [-1.06,1.06])box(2.65,.022,.013,black,platform,0,-.04,z);
 }else{
  for(let i=0;i<5;i++)box(.04,.014,.015,steel,group,-.45+i*.08,.075,.11);
  box(.26,.025,.06,black,group,-.2,.04,.08);
 }
 camera.zoom=1.04;camera.lookAt(0,1.1,0);let shadowTime=-1,visible=false,frame=0,last=0,time=0,target=0;const base=group.rotation.y;
 function draw(){if(time-shadowTime>.2||time===0){renderer.shadowMap.needsUpdate=true;shadowTime=time;}group.rotation.y+=(target-group.rotation.y)*.07;tick(time);renderer.render(scene,camera);}
 function loop(now){frame=0;if(!visible||document.hidden||reduced.matches)return;if(now-last>1000/24){time+=Math.min((now-last)/1000,.1);last=now;draw();}frame=requestAnimationFrame(loop);}
 function sync(){cancelAnimationFrame(frame);frame=0;if(visible&&!document.hidden){draw();if(!reduced.matches){last=performance.now();frame=requestAnimationFrame(loop);}}}
 function size(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();draw();}
 new ResizeObserver(size).observe(host);new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync();},{threshold:.05}).observe(host);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);host.addEventListener('pointermove',e=>{if(!reduced.matches)target=base+((e.clientX-host.getBoundingClientRect().left)/host.clientWidth-.5)*.2;});host.addEventListener('pointerleave',()=>target=base);canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);host.classList.remove('method-ready');});canvas.addEventListener('webglcontextrestored',()=>{host.classList.add('method-ready');sync();});size();host.classList.add('method-ready');
}
