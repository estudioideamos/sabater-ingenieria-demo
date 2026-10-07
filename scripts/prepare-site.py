"""Build a least-content public artifact from reachable runtime resources."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import re,shutil,json
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'_site'
from site_meta import BASE
class Resources(HTMLParser):
 def __init__(self):super().__init__();self.refs=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  for key in ['src','href','data-src','poster']:
   if a.get(key):self.refs.append(a[key])
  if a.get('srcset'):
   self.refs.extend(x.strip().split()[0] for x in a['srcset'].split(','))
  if tag=='meta' and a.get('property')=='og:image':self.refs.append(a['content'])
def resolve(ref,parent):
 if ref.startswith(BASE):ref=ref[len(BASE):];parent=ROOT
 u=urlsplit(ref)
 if u.scheme or u.netloc or not u.path:return None
 p=(parent/unquote(u.path)).resolve()
 if not p.is_relative_to(ROOT):raise ValueError('Resource outside workspace: '+ref)
 if p.is_dir():p=p/'index.html'
 if not p.exists():raise FileNotFoundError(str(p.relative_to(ROOT)))
 return p
pages=[ROOT/'index.html',*ROOT.glob('acustica-*/index.html'),ROOT/'mantenimiento-predictivo/index.html',*ROOT.glob('blog/**/index.html')]
queue=pages+[ROOT/p for p in ['robots.txt','sitemap.xml','llms.txt','llms-full.txt','assets/vendor/THREE-LICENSE.txt']]
seen=set()
while queue:
 p=queue.pop()
 if p in seen:continue
 seen.add(p);refs=[]
 if p.suffix in ['.html','.css','.js']:
  text=p.read_text(encoding='utf-8')
  if p.suffix=='.html':
   parser=Resources();parser.feed(text);refs=parser.refs
  elif p.suffix=='.css':refs=re.findall(r'url\([\s\x22\x27]*([^\x22\x27\s\)]+)',text)
  else:refs=re.findall(r"""["']([^"'\n]+\.(?:js|webp|png|hdr|woff2)(?:\?[^"']*)?)["']""",text)
 for ref in refs:
  target=resolve(ref,p.parent)
  if target is not None:queue.append(target)
assert OUT.resolve()==ROOT/'_site' and not OUT.is_symlink()
if OUT.exists():shutil.rmtree(OUT)
for p in seen:
 target=OUT/p.relative_to(ROOT);target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,target)
(OUT/'.nojekyll').touch()
all_assets=[p for p in (ROOT/'assets').rglob('*') if p.is_file()]
unused=[p for p in all_assets if p not in seen]
print(f'PUBLIC: {len(seen)} files, {sum(p.stat().st_size for p in seen)/1e6:.2f} MB; {len(unused)} source/unused assets excluded ({sum(p.stat().st_size for p in unused)/1e6:.2f} MB).')
assert not any(p.suffix in ['.py','.inc','.hdr','.map'] for p in OUT.rglob('*') if p.is_file())
