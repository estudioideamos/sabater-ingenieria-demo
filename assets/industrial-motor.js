// Purpose-built industrial motor, with coaxial machined parts and cast housing details.
export function createIndustrialMotor(T,{paint,steel,dark,rubber,copper}){
 const motor=new T.Group();motor.position.y=1.02;
 const coated=new T.MeshPhysicalMaterial({color:0x647782,metalness:.8,roughness:.36,clearcoat:.12,clearcoatRoughness:.25,bumpMap:paint.bumpMap,bumpScale:.0012});
 const alloy=new T.MeshPhysicalMaterial({color:0xc1c8ce,metalness:1,roughness:.32,anisotropy:.35,roughnessMap:steel.roughnessMap,bumpMap:steel.bumpMap,bumpScale:.00045});
 // Tooling marks modulate reflection without drawing artificial grooves on the metal.
 const machining=document.createElement('canvas');machining.width=machining.height=512;const mc=machining.getContext('2d');mc.fillStyle='#b9b9b9';mc.fillRect(0,0,512,512);let grainSeed=73;
 for(let row=0;row<512;row++){grainSeed=(grainSeed*16807)%2147483647;const n=150+grainSeed%65;mc.fillStyle=`rgb(${n},${n},${n})`;mc.fillRect(0,row,512,1);}
 for(let i=0;i<45;i++){grainSeed=(grainSeed*16807)%2147483647;mc.strokeStyle='rgba(250,250,250,.18)';mc.lineWidth=.4;mc.beginPath();mc.moveTo(grainSeed%512,(grainSeed>>5)%512);mc.lineTo(grainSeed%512+30,(grainSeed>>5)%512+1);mc.stroke();}
 const machiningMap=new T.CanvasTexture(machining);machiningMap.wrapS=machiningMap.wrapT=T.RepeatWrapping;machiningMap.repeat.set(2,3);machiningMap.anisotropy=4;alloy.roughnessMap=machiningMap;alloy.bumpMap=machiningMap;alloy.bumpScale=.0008;
 const cast=coated.clone();cast.color.set(0x526671);cast.roughness=.42;
 function add(g,m,p,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o;}
 function block(w,h,d,m,p,x,y,z,b=.015){b=Math.min(b,w/4,h/4,d/4);const s=new T.Shape();s.moveTo(-w/2+b,-h/2+b);s.lineTo(w/2-b,-h/2+b);s.lineTo(w/2-b,h/2-b);s.lineTo(-w/2+b,h/2-b);s.closePath();const g=new T.ExtrudeGeometry(s,{depth:d-2*b,bevelEnabled:true,bevelSize:b,bevelThickness:b,bevelSegments:3,steps:1});g.translate(0,0,-d/2+b);return add(g,m,p,x,y,z);}
 function cylinder(r,h,m,p,x,y,z,axis='x',segments=64){const o=add(new T.CylinderGeometry(r,r,h,segments),m,p,x,y,z);if(axis==='x')o.rotation.z=-Math.PI/2;if(axis==='z')o.rotation.x=Math.PI/2;return o;}
 function torus(r,t,m,p,x,y,z,axis='x'){const o=add(new T.TorusGeometry(r,t,8,80),m,p,x,y,z);if(axis==='x')o.rotation.y=Math.PI/2;if(axis==='y')o.rotation.x=Math.PI/2;return o;}
 function lathe(profile,m,p,x,y,z){const o=add(new T.LatheGeometry(profile.map(v=>new T.Vector2(...v)),96),m,p,x,y,z);o.rotation.z=-Math.PI/2;return o;}
 function screw(p,x,y,z,axis='x',size=.047){cylinder(size*1.55,.018,alloy,p,x,y,z,axis,32);const offset=axis==='x'?[.021,0,0]:axis==='y'?[0,.021,0]:[0,0,.021];cylinder(size,.045,alloy,p,x+offset[0],y+offset[1],z+offset[2],axis,6);cylinder(size*.43,.047,dark,p,x+offset[0]*1.2,y+offset[1]*1.2,z+offset[2]*1.2,axis,6);}
 // Cast barrel, rounded longitudinal ribs, recessed valleys.
 lathe([[.59,0],[.66,0],[.66,2.02],[.59,2.02],[.59,0]],coated,motor,-1.25,.94,0);
 const finShape=new T.Shape();finShape.moveTo(-.014,-.052);finShape.lineTo(.014,-.052);finShape.lineTo(.009,.052);finShape.quadraticCurveTo(0,.062,-.009,.052);finShape.closePath();
 const finGeometry=new T.ExtrudeGeometry(finShape,{depth:1.89,bevelEnabled:true,bevelSize:.004,bevelThickness:.01,bevelSegments:2,steps:1});finGeometry.translate(0,0,-.945);finGeometry.rotateY(Math.PI/2);
 const fins=new T.InstancedMesh(finGeometry,cast,36),dummy=new T.Object3D();
 for(let i=0;i<36;i++){const a=i*Math.PI/18;dummy.position.set(-.24,.94+Math.cos(a)*.693,Math.sin(a)*.693);dummy.rotation.set(a,0,0);dummy.updateMatrix();fins.setMatrixAt(i,dummy.matrix);}fins.castShadow=fins.receiveShadow=true;motor.add(fins);
 for(const x of [-1.29,.8]){lathe([[.59,0],[.66,0],[.72,.025],[.73,.055],[.73,.09],[.7,.12],[.59,.12],[.59,0]],cast,motor,x,.94,0);torus(.69,.009,dark,motor,x+.055,.94,0);}
 const endBell=new T.Group();motor.add(endBell);
 // Front casting steps down toward the bearing carrier, with radial reinforcing ribs.
 lathe([[.18,0],[.68,0],[.69,.04],[.65,.09],[.59,.15],[.5,.21],[.37,.25],[.32,.3],[.18,.3]],cast,endBell,.89,.94,0);
 torus(.66,.014,alloy,endBell,.965,.94,0);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;const rib=block(.14,.28,.028,coated,endBell,1.06,.94+Math.cos(a)*.45,Math.sin(a)*.45,.01);rib.rotation.x=a;screw(endBell,.987,.94+Math.cos(a)*.62,Math.sin(a)*.62,'x',.038);}
 lathe([[.165,0],[.3,0],[.325,.025],[.325,.065],[.3,.09],[.165,.09]],alloy,endBell,1.19,.94,0);

 for(let i=0;i<4;i++){const a=i*Math.PI/2+.4;screw(endBell,1.284,.94+Math.cos(a)*.258,Math.sin(a)*.258,'x',.024);}
 torus(.178,.015,rubber,endBell,1.29,.94,0);
 // Turned shaft and flexible coupling: separate hubs, a recessed elastomer insert and socket bolts.
 const shaftAssembly=new T.Group();motor.add(shaftAssembly);const rotor=new T.Group();rotor.position.set(1.29,.94,0);shaftAssembly.add(rotor);
 lathe([[0,0],[.17,0],[.17,.26],[.155,.29],[.155,.41],[.12,.43],[.12,1.03],[.105,1.06],[0,1.06]],alloy,rotor,0,0,0);

 for(const x of [.38,.62])lathe([[.15,0],[.31,0],[.35,.025],[.35,.15],[.32,.175],[.15,.175]],alloy,rotor,x,0,0);
 cylinder(.318,.095,rubber,rotor,.59,0,0);
 for(let i=0;i<6;i++){const a=i*Math.PI/3;const y=Math.cos(a)*.26,z=Math.sin(a)*.26;screw(rotor,.8,y,z,'x',.03);block(.075,.055,.055,alloy,rotor,.584,y,z,.009);}
 block(.22,.04,.06,alloy,rotor,.95,.12,0,.008);
 // Copper end windings and laminated stator: visible when the front cover withdraws.
 const windings=new T.Group();motor.add(windings);
 const varnish=new T.MeshPhysicalMaterial({color:0x9b5127,metalness:.8,roughness:.27,clearcoat:.5,clearcoatRoughness:.2});
 const lamination=new T.MeshStandardMaterial({color:0x333c42,metalness:.85,roughness:.36});
 lathe([[.34,0],[.58,0],[.58,1.75],[.34,1.75],[.34,0]],lamination,windings,-1.13,.94,0);
 for(let wire=0;wire<3;wire++){
  const r=.45+wire*.022,points=[];for(let n=0;n<=32;n++){const t=n/32*Math.PI*2;const theta=Math.cos(t)*.062;points.push(new T.Vector3(.62+Math.sin(t)*.17,Math.cos(theta)*r,Math.sin(theta)*r));}
  const coils=new T.InstancedMesh(new T.TubeGeometry(new T.CatmullRomCurve3(points,true),32,.011,5,true),varnish,24),pose=new T.Object3D();
  for(let i=0;i<24;i++){pose.position.set(0,.94,0);pose.rotation.x=i*Math.PI/12;pose.updateMatrix();coils.setMatrixAt(i,pose.matrix);}coils.castShadow=coils.receiveShadow=true;windings.add(coils);
 }
 // Separate bearing races and rolling elements. Real concentric geometry, no painted icon.
 const bearing=new T.Group();motor.add(bearing);
 for(const [outer,inner]of [[.36,.285],[.208,.165]])lathe([[inner,0],[outer-.012,0],[outer,.012],[outer,.095],[outer-.012,.108],[inner,.108],[inner,0]],alloy,bearing,.86,.94,0);
 for(let i=0;i<12;i++){const a=i*Math.PI/6;add(new T.SphereGeometry(.045,20,12),alloy,bearing,.914,.94+Math.cos(a)*.247,Math.sin(a)*.247);}
 torus(.246,.008,copper,bearing,.966,.94,0);
 // Rear ventilator: real open perforations, internal blades and a rolled perimeter.
 lathe([[0,0],[.56,0],[.65,.035],[.68,.09],[.68,.27],[.65,.31],[0,.31]],coated,motor,-1.66,.94,0);
 const grille=new T.Shape();grille.absarc(0,0,.635,0,Math.PI*2,false);
 for(const [r,count]of [[.22,12],[.35,18],[.48,24],[.57,28]])for(let i=0;i<count;i++){const a=i/count*Math.PI*2,hole=new T.Path();hole.absarc(Math.cos(a)*r,Math.sin(a)*r,.028,0,Math.PI*2,true);grille.holes.push(hole);}
 const grilleGeo=new T.ExtrudeGeometry(grille,{depth:.012,bevelEnabled:false,curveSegments:8});const grilleMesh=add(grilleGeo,cast,motor,-1.685,.94,0);grilleMesh.rotation.y=-Math.PI/2;
 torus(.636,.016,alloy,motor,-1.69,.94,0);
 // Grounded cast feet, ribs, mounting slots and fasteners.
 for(const x of [-.91,.56])for(const z of [-.48,.48]){block(.55,.11,.43,cast,motor,x,.08,z);block(.34,.28,.26,cast,motor,x,.245,z);const gusset=block(.26,.24,.07,coated,motor,x,.4,z);gusset.rotation.x=z>0?-.35:.35;screw(motor,x,.151,z+(z>0?.1:-.1),'y',.045);}
 // Terminal enclosure with gasket, lid seam, lid screws and cable glands.
 block(.67,.3,.56,cast,motor,-.38,1.68,0,.035);block(.73,.016,.62,rubber,motor,-.38,1.832,0,.007);block(.75,.065,.64,coated,motor,-.38,1.87,0,.023);
 for(const x of [-.67,-.09])for(const z of [-.23,.23])screw(motor,x,1.91,z,'y',.022);
 cylinder(.09,.11,alloy,motor,-.4,1.68,.34,'z',6);cylinder(.068,.13,rubber,motor,-.4,1.68,.43,'z');
 for(let z=.43;z<.5;z+=.019)torus(.069,.005,coated,motor,-.4,1.68,z,'z');
 const cablePoints=[[-.4,1.68,.51],[-.4,1.56,.68],[-.65,1.2,.84],[-.95,.55,.84],[-1.36,.24,.71]].map(p=>new T.Vector3(...p));add(new T.TubeGeometry(new T.CatmullRomCurve3(cablePoints),48,.026,8,false),rubber,motor);
 cylinder(.055,.12,alloy,motor,-.98,1.67,0,'y');torus(.105,.028,alloy,motor,-.98,1.79,0,'z');
 // Accelerometer with a locking collar and a curved signal lead.
 cylinder(.078,.07,alloy,motor,.37,1.68,.06,'y',6);cylinder(.059,.13,alloy,motor,.37,1.77,.06,'y');torus(.06,.008,copper,motor,.37,1.79,.06,'y');
 add(new T.TubeGeometry(new T.CatmullRomCurve3([[.37,1.86,.06],[.67,2.04,.13],[1,1.72,.48],[.96,.68,.84]].map(p=>new T.Vector3(...p))),48,.014,8,false),rubber,motor);
 // Engraved identification plate and separate rivets, using a high-resolution local canvas.
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=320;const ctx=canvas.getContext('2d');ctx.fillStyle='#9aa9ae';ctx.fillRect(0,0,1024,320);ctx.strokeStyle='#334650';ctx.lineWidth=3;ctx.strokeRect(20,20,984,280);ctx.fillStyle='#13252d';ctx.font='bold 56px Arial';ctx.fillText('SABATER',48,91);ctx.font='24px monospace';ctx.fillText('INGENIERÍA · ESTUDIO DE VIBRACIONES',48,132);ctx.fillRect(48,154,920,2);ctx.font='22px monospace';ctx.fillText('MOTOR / APOYOS / ESTRUCTURA',48,202);ctx.fillText('MODELO CONCEPTUAL',48,246);const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
 const plate=block(.93,.29,.015,alloy,motor,-.32,1.04,.759,.005);add(new T.PlaneGeometry(.91,.28),new T.MeshStandardMaterial({map:texture,metalness:.6,roughness:.42}),motor,-.32,1.04,.768);
 for(const x of [-.74,.10])for(const y of [.92,1.16])cylinder(.012,.013,alloy,motor,x,y,.78,'z',16);
 motor.scale.setScalar(1.08);
 const articulate=value=>{windings.visible=bearing.visible=value>.02;endBell.position.x=value*.72;shaftAssembly.position.x=value*1.0;bearing.position.x=value*.32;};
 return{motor,rotor,articulate};
}
