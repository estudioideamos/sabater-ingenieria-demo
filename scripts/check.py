from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
R=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=set();self.h1=0;self.alts=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id'in a:self.ids.add(a['id'])
  if tag=='h1':self.h1+=1
  if tag=='img':self.alts.append(a.get('alt',''))
  for attr in ['href','src']:
   if a.get(attr):self.links.append(a[attr])
pages={}
for f in R.rglob('*.html'):
 if '_site' in f.parts:continue
 p=Page();p.feed(f.read_text(encoding='utf-8'));pages[f]=p
errors=[]
for f,p in pages.items():
 if p.h1!=1:errors.append(f'{f}: H1 count {p.h1}')
 if not all(p.alts):errors.append(f'{f}: missing alt')
 for link in p.links:
  u=urlsplit(link)
  if u.scheme or u.netloc:continue
  target=(f.parent/unquote(u.path)).resolve() if u.path else f
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append(f'{f.name}: missing {link}')
  elif u.fragment and target in pages and u.fragment not in pages[target].ids:errors.append(f'{f.name}: missing anchor {link}')
assert len(pages)==5,f'Expected five pages, got {len(pages)}'
assert not errors,'\n'.join(errors)
print('PASS: 5 pages, all local assets/links/anchors, image alt text and one H1 per page.')
