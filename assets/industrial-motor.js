// Purpose-built industrial motor, with coaxial machined parts and cast housing details.
export function createIndustrialMotor(T,{paint,steel,dark,rubber,copper}){
 const motor=new T.Group();motor.position.y=1.02;
 const coated=new T.MeshPhysicalMaterial({color:0x18303c,metalness:.28,roughness:.43,clearcoat:.18,clearcoatRoughness:.3,bumpMap:paint.bumpMap,bumpScale:.004});
 const alloy=steel.clone();alloy.color.set(0xb7c2c9);alloy.roughness=.28;
 const cast=coated.clone();cast.color.set(0x263d49);cast.roughness=.51;
 function add(g,m,p,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o;}
 function block(w,h,d,m,p,x,y,z,b=.015){b=Math.min(b,w/4,h/4,d/4);const s=new T.Shape();s.moveTo(-w/2+b,-h/2+b);s.lineTo(w/2-b,-h/2+b);s.lineTo(w/2-b,h/2-b);s.lineTo(-w/2+b,h/2-b);s.closePath();const g=new T.ExtrudeGeometry(s,{depth:d-2*b,bevelEnabled:true,bevelSize:b,bevelThickness:b,bevelSegments:3,steps:1});g.translate(0,0,-d/2+b);return add(g,m,p,x,y,z);}
 function cylinder(r,h,m,p,x,y,z,axis='x',segments=64){const o=add(new T.CylinderGeometry(r,r,h,segments),m,p,x,y,z);if(axis==='x')o.rotation.z=-Math.PI/2;if(axis==='z')o.rotation.x=Math.PI/2;return o;}
 function torus(r,t,m,p,x,y,z,axis='x'){const o=add(new T.TorusGeometry(r,t,8,80),m,p,x,y,z);if(axis==='x')o.rotation.y=Math.PI/2;if(axis==='y')o.rotation.x=Math.PI/2;return o;}
 function lathe(profile,m,p,x,y,z){const o=add(new T.LatheGeometry(profile.map(v=>new T.Vector2(...v)),96),m,p,x,y,z);o.rotation.z=-Math.PI/2;return o;}
 function screw(p,x,y,z,axis='x',size=.047){cylinder(size*1.55,.018,alloy,p,x,y,z,axis,32);const offset=axis==='x'?[.021,0,0]:axis==='y'?[0,.021,0]:[0,0,.021];cylinder(size,.045,alloy,p,x+offset[0],y+offset[1],z+offset[2],axis,6);cylinder(size*.43,.047,dark,p,x+offset[0]*1.2,y+offset[1]*1.2,z+offset[2]*1.2,axis,6);}
 // Cast barrel, rounded longitudinal ribs, recessed valleys.
 cylinder(.66,2.02,coated,motor,-.24,.94,0);
 const finGeometry=new T.BoxGeometry(1.92,.12,.031);
 const fins=new T.InstancedMesh(finGeometry,cast,36),dummy=new T.Object3D();
 for(let i=0;i<36;i++){const a=i*Math.PI/18;dummy.position.set(-.24,.94+Math.cos(a)*.693,Math.sin(a)*.693);dummy.rotation.set(a,0,0);dummy.updateMatrix();fins.setMatrixAt(i,dummy.matrix);}fins.castShadow=fins.receiveShadow=true;motor.add(fins);
 for(const x of [-1.29,.8]){lathe([[0,0],[.66,0],[.72,.025],[.73,.055],[.73,.09],[.7,.12],[0,.12]],cast,motor,x,.94,0);torus(.69,.009,dark,motor,x+.055,.94,0);}
 // Front casting steps down toward the bearing carrier, with radial reinforcing ribs.
 lathe([[.18,0],[.68,0],[.69,.04],[.65,.09],[.59,.15],[.5,.21],[.37,.25],[.32,.3],[.18,.3]],cast,motor,.89,.94,0);
 torus(.66,.014,alloy,motor,.965,.94,0);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;const rib=block(.14,.28,.028,coated,motor,1.06,.94+Math.cos(a)*.45,Math.sin(a)*.45,.01);rib.rotation.x=a;screw(motor,.987,.94+Math.cos(a)*.62,Math.sin(a)*.62,'x',.038);}
 lathe([[.165,0],[.3,0],[.325,.025],[.325,.065],[.3,.09],[.165,.09]],alloy,motor,1.19,.94,0);

 for(let i=0;i<4;i++){const a=i*Math.PI/2+.4;screw(motor,1.284,.94+Math.cos(a)*.258,Math.sin(a)*.258,'x',.024);}
 torus(.178,.015,rubber,motor,1.29,.94,0);
 // Turned shaft and flexible coupling: separate hubs, a recessed elastomer insert and socket bolts.
 const rotor=new T.Group();rotor.position.set(1.29,.94,0);motor.add(rotor);
 lathe([[0,0],[.17,0],[.17,.26],[.155,.29],[.155,.41],[.12,.43],[.12,1.03],[.105,1.06],[0,1.06]],alloy,rotor,0,0,0);

 for(const x of [.38,.62])lathe([[.15,0],[.31,0],[.35,.025],[.35,.15],[.32,.175],[.15,.175]],alloy,rotor,x,0,0);
 cylinder(.318,.095,rubber,rotor,.59,0,0);
 for(let i=0;i<6;i++){const a=i*Math.PI/3;const y=Math.cos(a)*.26,z=Math.sin(a)*.26;screw(rotor,.8,y,z,'x',.03);block(.075,.055,.055,alloy,rotor,.584,y,z,.009);}
 block(.22,.04,.06,alloy,rotor,.95,.12,0,.008);
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
 return{motor,rotor};
}
