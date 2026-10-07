"""Check static demo security boundaries; not a penetration test."""
from pathlib import Path
from html.parser import HTMLParser
import json,re,subprocess
ROOT=Path(__file__).resolve().parents[1]
class SecurityHTML(HTMLParser):
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  assert not any(k.lower().startswith('on') for k in a), 'Inline event handler'
  for k in ('src','href','action'):
   assert not a.get(k,'').strip().lower().startswith(('javascript:','http://')), 'Unsafe resource URL'
  if a.get('target')=='_blank':assert 'noopener' in a.get('rel','').split(), 'Missing noopener'
  if tag=='form':assert not a.get('action'), 'Demo must not gain a submission endpoint silently'
  if tag=='script':assert a.get('src') or a.get('type')=='application/ld+json','Executable inline script'
  if tag=='meta' and a.get('http-equiv','').lower()=='content-security-policy':
   csp=a['content']
   for rule in ("default-src 'self'", "object-src 'none'", "base-uri 'none'", "form-action 'none'", "script-src-attr 'none'", "frame-src 'none'"):
    assert rule in csp, 'Missing CSP boundary: '+rule
   assert "'unsafe-eval'" not in csp
pages=[ROOT/'index.html',*ROOT.glob('acustica-*/index.html'),ROOT/'mantenimiento-predictivo/index.html',*ROOT.glob('blog/**/index.html')]
for page in pages:
 source=page.read_text(encoding='utf8');SecurityHTML().feed(source)
 assert 'Content-Security-Policy' in source,page
 assert source.index('Content-Security-Policy')<source.index('<script'),page
package=json.loads((ROOT/'package.json').read_text())
lock=json.loads((ROOT/'package-lock.json').read_text())
for group in ('dependencies','devDependencies'):
 for name,version in package.get(group,{}).items():
  assert re.fullmatch(r'\d+\.\d+\.\d+',version), 'Unpinned dependency: '+name
  assert lock['packages']['node_modules/'+name]['version']==version,name
for name,item in lock['packages'].items():
 if name:assert item.get('integrity','').startswith('sha512-') and item.get('resolved','').startswith('https://registry.npmjs.org/'),name
for workflow in (ROOT/'.github/workflows').glob('*.yml'):
 for ref in re.findall(r'uses:\s*([^\s#]+)',workflow.read_text()):
  assert re.fullmatch(r'[\w-]+/[\w-]+@[0-9a-f]{40}',ref), 'Unpinned action: '+ref
tracked=subprocess.check_output(['git','ls-files','-z'],cwd=ROOT).decode().split('\0')
for name in filter(None,tracked):
 p=ROOT/name
 assert not (p.name.startswith('.env') or p.suffix in ('.pem','.key')), 'Private configuration tracked: '+name
 if p.is_file() and p.suffix in ('.js','.py','.json','.yml','.html','.md'):
  text=p.read_text(encoding='utf8')
  assert not re.search(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{36,}|AKIA[0-9A-Z]{16}',text), 'Potential secret in '+name
print(f'PASS: {len(pages)} pages, CSP, links, demo form boundary, exact dependencies, lock integrity, pinned actions and tracked-secret patterns.')
