from pathlib import Path
import json
from PIL import Image
r=Path(__file__).resolve().parents[1]
manifest={}
for p in (r/'assets').glob('*-hd.webp'):
 if p.name.startswith(('client-','logo-')):continue
 key=p.stem.removesuffix('-hd');img=Image.open(p);variants=[]
 for w in sorted(set([640,1024,min(1600,img.width)])):
  if w>img.width:continue
  h=round(img.height*w/img.width);out=f'{key}-{w}w.webp';img.resize((w,h),Image.Resampling.LANCZOS).save(r/'assets'/out,'WEBP',quality=82,method=6);variants.append([w,out])
 manifest[key]={'width':img.width,'height':img.height,'variants':variants}
for name in ['medicion-vibraciones-editorial','method-preview-1','method-preview-2','method-preview-3','method-preview-4']:
 p=r/'assets'/f'{name}.png';img=Image.open(p);img.thumbnail((1600,900) if name.startswith('medicion') else (600,414));img.save(r/'assets'/f'{name}.webp','WEBP',quality=86,method=6)
p=r/'assets/logo-light-hd.webp';img=Image.open(p);img.resize((620,round(img.height*620/img.width)),Image.Resampling.LANCZOS).save(r/'assets/logo-light-web.webp','WEBP',quality=94,method=6)
(r/'image-variants.json').write_text(json.dumps(manifest,indent=2))
print('Updated responsive assets and image-variants.json')
