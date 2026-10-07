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
  if tag=='img':self.alts.append(bool(a.get('alt')) or ('alt' in a and a.get('aria-hidden')=='true'))
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
import json
expected=6+len(json.loads((R/'blog-posts.json').read_text(encoding='utf8')))
assert len(pages)==expected,f'Expected {expected} pages, got {len(pages)}'
assert not errors,'\n'.join(errors)
print('PASS: 8 pages, all local assets/links/anchors, image alt text and one H1 per page.')

# Deployment metadata and browser security must remain coherent with the build mode.
import json,re,base64,hashlib
from site_meta import BASE,INDEXABLE
from xml.etree import ElementTree
sitemap=ElementTree.parse(R/'sitemap.xml')
assert len(sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc'))==expected
for f in pages:
 source=f.read_text(encoding='utf8')
 assert len(re.findall(r'<link rel="canonical"',source))==1,f
 assert ('index,follow,max-image-preview:large' if INDEXABLE else 'noindex,nofollow') in source,f
 assert 'Content-Security-Policy' in source and "form-action &#x27;none&#x27;" in source,f
 schema=re.search(r'<script type="application/ld\+json">(.*?)</script>',source)[1]
 graph=json.loads(schema)['@graph'];assert any(n['@type']=='Organization' for n in graph),f
 assert all(not n.get('url') or n['url'].startswith(BASE) for n in graph),f
 digest=base64.b64encode(hashlib.sha256(schema.encode()).digest()).decode()
 assert 'sha256-'+digest in source,f
 if 'blog' not in f.relative_to(R).parts:assert '<form id="contact-form" method="post">' in source,f
 elif f.parent.name!='blog':assert any(n['@type']=='BlogPosting' for n in graph),f
 assert 'fonts.googleapis.com' not in source,f
 for srcset in re.findall(r'srcset="([^"]+)"',source):
  for item in srcset.split(','):
   assert (f.parent/item.strip().split()[0]).exists(),item
 assert not re.search(r'\son[a-z]+=',source),f
 assert not re.search(r'(?:src|href)="http://',source),f
print('PASS: canonical URLs, structured data, sitemap, CSP hashes, image variants and demo indexing policy.')
