"""SABATER dimensional technical miniatures. Inline SVG, no image requests."""
import math

def problem_icon(key,index):
 uid=f'pi-{key}-{index}'
 def grad(n):return f'url(#{uid}-{n})'
 def path(d,fill='none',stroke='#a4cbd9',w=1):return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'
 def circle(x,y,r,fill,stroke='none',w=1):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{w}"/>'
 def rect(x,y,w,h,fill,rx=2,stroke='#638b9e'):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="1"/>'
 def block(x,y,w,h,d=9):
  return path(f'M{x} {y}l{d} {-d*.55}h{w}l{-d} {d*.55}Z',grad('top'),'#a0c3d2')+path(f'M{x+w} {y}l{d} {-d*.55}v{h}l{-d} {d*.55}Z',grad('side'),'#527588')+rect(x,y,w,h,grad('front'),1)
 def waves(x,y,scale=1):
  return f'<g transform="translate({x} {y}) scale({scale})" class="mini-signal">'+''.join(path(f'M{r*.4} {-r}Q{r*1.45} 0 {r*.4} {r}',stroke='#b7e2ed',w=1.6 if r==7 else 1.1) for r in [7,13,19])+'</g>'
 def badge(x,y,kind):
  out=circle(x,y,10,grad('badge'),'#95c6d7')
  shapes={'plus':f'M{x-4} {y}h8M{x} {y-4}v8','check':f'M{x-4} {y}l3 3 5-6','alert':f'M{x} {y-4}v5M{x} {y+4}v.2','cross':f'M{x-3} {y-3}l6 6M{x+3} {y-3}l-6 6'}
  return out+path(shapes[kind],stroke='#e0f4fa',w=1.6)
 def room():
  return path('M23 76 63 96 105 74 64 54Z',grad('floor'),'#698c9c')+path('M23 76V34L64 14V54Z',grad('side'),'#86afc2')+path('M64 14 105 34V74L64 54Z',grad('front'),'#a1c6d6')+path('M29 70V38L59 23M69 23 99 38V65',stroke='#b5d4df',w=.7)
 def motor(x=29,y=37):
  out=block(x+6,y+36,54,6,7)+block(x+5,y,48,36,10)+rect(x+20,y-8,19,8,grad('top'))
  out+=''.join(path(f'M{x+i} {y+5}v25',stroke='#a4c5d5',w=1.5) for i in [14,20,26,32,38,44])
  out+=f'<ellipse cx="{x+7}" cy="{y+18}" rx="13" ry="19" fill="{grad("steel")}" stroke="#a9cbd9"/>'
  out+=f'<ellipse cx="{x+7}" cy="{y+18}" rx="8" ry="12" fill="#173545" stroke="#6e96aa"/>'
  out+=rect(x-8,y+14,19,8,grad('steel'),2)+path(f'M{x-4} {y+15}h11',stroke='#d9edf5')
  return out
 def document():
  return path('M39 17 88 21 91 88 40 84Z','#0a1c28','#486a7e')+path('M33 12H76L88 24V84H33Z',grad('paper'),'#b3d5e2')+path('M76 12V25H88',grad('top'),'#7598ab')+rect(42,23,19,4,'#42697d',1,'none')+''.join(path(f'M42 {y}h{w}',stroke='#618699',w=2) for y,w in [(36,34),(43,28),(50,34),(57,21),(69,15)])
 def chart(kind):
  out=block(23,24,76,58,6)+rect(29,30,64,44,'#102b3b',2,'#6a93a8')
  out+=''.join(path(f'M33 {y}h55',stroke='#41697c',w=.6) for y in [40,50,60])+''.join(path(f'M{x} 35v33',stroke='#41697c',w=.6) for x in [44,58,72,86])
  d='M34 60 43 57 52 59 61 49 70 52 79 38 87 35' if kind=='trend' else 'M33 53h6l4-7 5 14 6-25 6 32 6-20 5 9 5-5h11'
  return out+path(d,stroke='#d1e9ec',w=1.8)+path('M44 88h36M57 82v6M67 82v6',stroke='#85aabd',w=2)
 def bearing():
  out=circle(62,51,34,grad('steel'),'#adcddb')+circle(62,51,29,'#173443','#537c90')+circle(62,51,14,grad('steel'),'#afcfdd')+circle(62,51,9,'#0c2230','#628b9f')
  for i in range(9):
   a=i*math.tau/9;out+=circle(round(62+22*math.cos(a),2),round(51+22*math.sin(a),2),5.5,grad('ball'),'#9bbfce',.6)
  return out+path('M40 20q22-12 43 7',stroke='#deedf3',w=.7)
 art=''
 if key=='arquitectonica':
  if index==0:art=room()+path('M59 32 67 28V77L59 81Z',grad('steel'),'#a4cadb')+waves(36,53,.65)+waves(80,54,.55)
  elif index==1:art=room()+circle(45,70,4,grad('ball'))+path('M45 68 91 43 40 41 89 70 66 81',stroke='#c1e0e9',w=1.5)+path('M85 42l6 1-3 6M84 68l5 2-4 5',stroke='#c1e0e9',w=1.5)
  elif index==2:
   art=path('M44 20 64 12 83 23 63 32Z',grad('top'))+path('M44 20V85L63 96V32Z',grad('front'))+path('M63 32 83 23V85L63 96Z',grad('side'))+''.join(path(f'M48 {y}l11 6',stroke='#91b6c9',w=2) for y in range(30,85,8))+waves(16,53,.7)+waves(89,53,.4)
  elif index==3:
   art=block(28,25,65,60,9)+circle(60,54,23,'#102733','#9dbfce')+circle(60,54,18,grad('side'),'#527d94')
   for a in [0,90,180,270]:art+=f'<g transform="rotate({a} 60 54)">'+path('M60 54Q41 39 54 36Q67 32 64 48Z',grad('steel'),'#a6c9d8')+'</g>'
   art+=circle(60,54,5,grad('ball'))+''.join(path(f'M38 {y}h45',stroke='#7198ad',w=.8) for y in [78,81])
  elif index==4:
   for y in [66,49,32]:art+=path(f'M24 {y} 62 {y-18} 103 {y} 65 {y+20}Z',grad('top'),'#a1c4d3')+path(f'M24 {y}v7l41 20 38-20v-7L65 {y+20}Z',grad('side'),'#5e879c')
   art+=badge(99,24,'check')
  else:art=room()+circle(71,62,18,grad('glass'),'#d0e6ef',2)+path('M84 75 102 93',stroke='#a4c9db',w=6)+path('M62 61h18M71 52v18',stroke='#d0e6ef',w=1)
 elif key=='predictivo':
  if index==0:art=bearing()+circle(77,34,7,'#c4a27a','#e6d3b6')+path('M98 27q12 26-3 48',stroke='#b9dce9',w=1.3)
  elif index==1:art=block(15,34,32,29,6)+block(76,43,31,29,6)+rect(43,45,15,9,grad('steel'))+rect(63,53,15,9,grad('steel'))+path('M59 30v45M13 81h97',stroke='#8eb1c4')+path('M55 35h8M55 70h8',stroke='#d5e9f0',w=2)
  elif index==2:art=bearing()+badge(95,83,'alert')
  elif index==3:art=motor()+path('M33 88h54M43 81v11M77 81v11',stroke='#c8e2ec',w=2)+circle(43,91,3,grad('steel'))+circle(77,91,3,grad('steel'))+path('M15 40v27M11 45v17',stroke='#acd2e1')
  elif index==4:art=chart('wave')
  else:art=chart('trend')+badge(97,25,'alert')
 elif key=='legal':
  if index==0:art=block(25,42,37,38,8)+path('M22 42 43 23 68 38 62 44 43 32 28 47Z',grad('steel'))+rect(38,60,12,20,'#133140')+waves(72,48,.75)+badge(91,83,'check')
  elif index==1:
   art=block(36,88,51,5,5)+rect(59,24,6,64,grad('steel'))+path('M31 35 95 28',stroke='#c6e0eb',w=3)+path('M33 35 20 60h26ZM92 29 79 54h26Z',stroke='#b4d5e4')+path('M20 60q13 15 26 0Z',grad('steel'))+path('M79 54q13 15 26 0Z',grad('steel'))+circle(62,22,6,grad('ball'))
  elif index==2:art=document()+badge(83,77,'check')
  elif index==3:art=block(18,46,25,39,6)+block(48,29,27,56,6)+block(81,53,20,32,6)+''.join(rect(x,y,4,6,'#9abcc9',0,'none') for x,y in [(24,54),(33,54),(24,66),(54,39),(64,39),(54,52),(64,52),(87,62)])+waves(84,29,.5)
  elif index==4:art=document()+''.join(badge(83,y,'check') for y in [39,70])
  else:art=document()+badge(84,76,'alert')
 else:
  if index==0:art=block(23,44,36,39,8)+path('M19 44 42 25 65 40 60 46 42 33 26 49Z',grad('steel'))+rect(36,64,12,19,'#142f3d')+waves(73,49,.85)
  elif index==1:art=path('M48 82c0-14-20-15-20-37a28 28 0 0 1 56 0c0 19-18 24-18 40 0 12-16 19-23 10',grad('side'),'#b4d6e3',2)+path('M40 46c0-22 32-22 32-1 0 12-19 12-17 26M40 55q3 9 9 11',stroke='#d4e9f1',w=2)+waves(94,42,.5)
  elif index==2:art=motor()+badge(96,24,'plus')
  elif index==3:
   art=path('M29 34 65 57 100 32M65 57 33 87M65 57 99 87',stroke='#91b8ca',w=1.5)
   for x,y in [(19,20),(87,18),(20,74),(87,74)]:art+=block(x,y,18,14,4)
   art+=circle(65,57,11,grad('steel'),'#bedbe7')+circle(65,57,5,'#163342')
  elif index==4:art=block(25,28,65,57,9)+rect(32,36,50,40,'#122b39')+''.join(path(f'M38 {y}h37',stroke='#789bac') for y in [43,49,55])+badge(91,75,'cross')
  else:art=chart('trend')+badge(96,76,'check')
 defs=f'''<defs><linearGradient id="{uid}-front" x2=".8" y2="1"><stop stop-color="#7199ad"/><stop offset=".45" stop-color="#3a6075"/><stop offset="1" stop-color="#223e50"/></linearGradient><linearGradient id="{uid}-side" x2="1" y2=".8"><stop stop-color="#36596c"/><stop offset="1" stop-color="#142b3c"/></linearGradient><linearGradient id="{uid}-top" x2=".7" y2="1"><stop stop-color="#c1d9e3"/><stop offset="1" stop-color="#668ca2"/></linearGradient><linearGradient id="{uid}-steel" x2="1" y2=".5"><stop stop-color="#668a9e"/><stop offset=".3" stop-color="#d7e6ed"/><stop offset=".55" stop-color="#86a9bc"/><stop offset="1" stop-color="#385c74"/></linearGradient><radialGradient id="{uid}-ball" cx=".3" cy=".25"><stop stop-color="#e0f0f5"/><stop offset=".5" stop-color="#91b1c1"/><stop offset="1" stop-color="#395e74"/></radialGradient><linearGradient id="{uid}-paper" x2=".7" y2="1"><stop stop-color="#d1e2e9"/><stop offset="1" stop-color="#86a9bd"/></linearGradient><linearGradient id="{uid}-floor" x2="0" y2="1"><stop stop-color="#567b90"/><stop offset="1" stop-color="#1e3a4b"/></linearGradient><linearGradient id="{uid}-badge" x2="1" y2="1"><stop stop-color="#4c8298"/><stop offset="1" stop-color="#23495e"/></linearGradient><radialGradient id="{uid}-glass"><stop stop-color="#9bd5e1" stop-opacity=".12"/><stop offset="1" stop-color="#aadce7" stop-opacity=".3"/></radialGradient></defs>'''
 return f'<svg class="problem-glyph dimensional-glyph" viewBox="0 0 128 112" width="128" height="112" fill="none" aria-hidden="true" focusable="false">'+defs+'<ellipse cx="64" cy="98" rx="44" ry="6" fill="#05121e" opacity=".4"/><g class="miniature-object">'+art+'</g></svg>'
