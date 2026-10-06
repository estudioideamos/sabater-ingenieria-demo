// Deterministic, small procedural maps shared by the industrial scenes.
export function refineFinishes(T,{steel,paint,rubber}){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const c=canvas.getContext('2d'),data=c.createImageData(128,128);let seed=137;
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){seed=(seed*16807)%2147483647;const n=170+(seed%31)+Math.sin(y*1.9)*18,i=(y*128+x)*4;data.data.set([n,n,n,255],i);}c.putImageData(data,0,0);
 const brushed=new T.CanvasTexture(canvas);brushed.wrapS=brushed.wrapT=T.RepeatWrapping;brushed.repeat.set(2,5);brushed.anisotropy=2;
 steel.roughnessMap=brushed;steel.bumpMap=brushed;steel.bumpScale=.003;steel.roughness=.38;steel.envMapIntensity=1.1;
 const cast=brushed.clone();cast.repeat.set(12,12);paint.roughnessMap=cast;paint.bumpMap=cast;paint.bumpScale=.009;paint.roughness=.48;paint.metalness=.36;
 rubber.bumpMap=cast;rubber.bumpScale=.005;rubber.roughness=.88;
}
