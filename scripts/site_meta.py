from pathlib import Path
import json,os,hashlib,base64,html,re
from urllib.parse import urlsplit
R=Path(__file__).resolve().parents[1]
CONFIG=json.loads((R/'site-config.json').read_text())
BASE=os.environ.get('SITE_URL',CONFIG['url']).rstrip('/')+'/'
INDEXABLE=os.environ.get('SITE_INDEXABLE',str(CONFIG['indexable'])).lower()=='true'
assert urlsplit(BASE).scheme=='https' and urlsplit(BASE).netloc and not urlsplit(BASE).query and not urlsplit(BASE).fragment,'SITE_URL must be an absolute HTTPS URL without query or fragment'
def plain(s):return html.unescape(re.sub('<[^>]+>','',s))
def metadata(title,description,hero,active,services):
 service=next((s for s in services if s['key']==active),None)
 url=BASE+(service['slug']+'/' if service else '')
 org={'@type':'Organization','@id':BASE+'#organization','name':'SABATER Ingeniería','url':BASE,'logo':BASE+'assets/logo-light-web.webp','email':'hola@sabater.com.ar','telephone':'+54 11 3322-7832','areaServed':{'@type':'Country','name':'Argentina'}}
 website={'@type':'WebSite','@id':BASE+'#website','url':BASE,'name':'SABATER Ingeniería','inLanguage':'es-AR','publisher':{'@id':org['@id']}}
 page={'@type':'WebPage','@id':url+'#webpage','url':url,'name':title,'description':plain(description),'inLanguage':'es-AR','isPartOf':{'@id':website['@id']},'about':{'@id':org['@id']}}
 graph=[org,website,page]
 if service:
  graph.append({'@type':'Service','@id':url+'#service','name':service['name'],'description':plain(service['lead']),'url':url,'serviceType':service['short'],'provider':{'@id':org['@id']},'areaServed':{'@type':'Country','name':'Argentina'}})
  page['mainEntity']={'@id':url+'#service'}
  graph.append({'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Inicio','item':BASE},{'@type':'ListItem','position':2,'name':service['short'],'item':url}]})
  graph.append({'@type':'FAQPage','@id':url+'#faq','mainEntity':[{'@type':'Question','name':plain(q),'acceptedAnswer':{'@type':'Answer','text':plain(a)}} for q,a in service['faq']]})
 else:
  org['hasOfferCatalog']={'@type':'OfferCatalog','name':'Especialidades de ingeniería','itemListElement':[{'@type':'Offer','itemOffered':{'@type':'Service','name':s['name'],'url':BASE+s['slug']+'/'}} for s in services]}
 schema=json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
 digest=base64.b64encode(hashlib.sha256(schema.encode()).digest()).decode()
 csp=f"default-src 'self'; script-src 'self' 'sha256-{digest}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'"
 esc=html.escape
 return f'''<meta http-equiv="Content-Security-Policy" content="{esc(csp,quote=True)}"><meta name="referrer" content="strict-origin-when-cross-origin"><meta name="robots" content="{'index,follow,max-image-preview:large' if INDEXABLE else 'noindex,nofollow'}"><link rel="canonical" href="{esc(url)}"><meta property="og:type" content="website"><meta property="og:locale" content="es_AR"><meta property="og:site_name" content="SABATER Ingeniería"><meta property="og:url" content="{esc(url)}"><meta property="og:image" content="{BASE}assets/sabater-social-v1.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:alt" content="Medición acústica y de vibraciones sobre maquinaria industrial"><meta name="twitter:image" content="{BASE}assets/sabater-social-v1.jpg"><meta name="twitter:image:alt" content="Medición acústica y de vibraciones sobre maquinaria industrial"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">{schema}</script>'''
def discovery(services):
 urls=[BASE]+[BASE+s['slug']+'/' for s in services]
 (R/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+html.escape(u)+'</loc></url>' for u in urls)+'</urlset>\n',encoding='utf8')
 (R/'robots.txt').write_text('User-agent: *\n'+('Allow: /\n\nSitemap: '+BASE+'sitemap.xml\n' if INDEXABLE else 'Disallow: /\n'),encoding='utf8')
 text='# SABATER Ingeniería\n\n> Consultoría especializada en acústica y vibraciones. Buenos Aires, Argentina; proyectos en todo el país.\n\n'+('Sitio de demostración, no indexable.\n\n' if not INDEXABLE else '')+'## Especialidades\n\n'
 for s in services:text+=f"- [{s['name']}]({BASE}{s['slug']}/): {plain(s['lead'])}\n"
 text+='\n## Contacto y alcance\n\n- Teléfono y WhatsApp: +54 11 3322-7832.\n- Correo: hola@sabater.com.ar.\n- Más de 15 años de trayectoria profesional en ingeniería acústica.\n- Las visualizaciones son conceptuales, no resultados de mediciones ni predicciones de rendimiento.\n- Los logos reflejan trayectoria profesional, no contratos vigentes.\n'
 if not INDEXABLE:text+='- El formulario de demostración no envía ni almacena consultas.\n'
 (R/'llms.txt').write_text(text,encoding='utf8')
