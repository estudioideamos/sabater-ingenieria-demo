from pathlib import Path
import json,html,math
R=Path(__file__).resolve().parents[1]
POSTS=json.loads((R/'blog-posts.json').read_text(encoding='utf8'))
e=html.escape

def minutes(p):
 text=p['intro']+' '+p['takeaway']+' '+' '.join(s['title']+' '+' '.join(s['paragraphs']) for s in p['sections'])
 return max(1,math.ceil(len(text.split())/200))

def photo(p,b='',eager=False):
 return f'<img src="{b}assets/{p["image"]}-1200.webp" srcset="{b}assets/{p["image"]}-640.webp 640w, {b}assets/{p["image"]}-1200.webp 1200w" sizes="(max-width:760px) 90vw, {"88vw" if eager else "44vw"}" alt="{e(p["alt"])}" width="1344" height="768" loading="{"eager" if eager else "lazy"}" {"fetchpriority=high" if eager else ""} decoding="async">'

def card(p,b=''):
 return f'<article class="blog-card"><a class="blog-card-link" href="{b}blog/{p["slug"]}/"><div class="blog-card-photo">{photo(p,b)}<span class="blog-photo-arrow" aria-hidden="true">↗</span></div><div class="blog-card-copy"><div class="blog-meta"><span>{e(p["category"])}</span><span>{minutes(p)} min de lectura</span></div><h3>{e(p["title"])}</h3><p>{e(p["excerpt"])}</p><span class="blog-read">Leer artículo <span aria-hidden="true">↗</span></span></div></a></article>'

def home():
 return '<section class="section knowledge blog-home" id="conocimiento"><div class="eyebrow">CONOCIMIENTO / BLOG</div><div class="section-heading"><h2>La precisión empieza<br>por <em>entender.</em></h2><p>Ideas y criterios técnicos para comprender el ruido, interpretar las señales y tomar mejores decisiones.</p></div><div class="blog-grid">'+''.join(card(p) for p in POSTS)+'</div><div class="blog-bottom"><span>Acústica y vibraciones, explicadas con criterio.</span><a class="text-link" href="blog/">Explorá el blog <span aria-hidden="true">↗</span></a></div></section>'

def article_content(p):
 out='<p class="article-lead">'+e(p['intro'])+'</p>'
 for s in p['sections']:
  out+=f'<section class="article-section" id="{s["id"]}"><h2>{e(s["title"])}</h2>'+''.join('<p>'+e(t)+'</p>' for t in s['paragraphs'])
  if 'source' in s:
   source=p['sources'][s['source']];out+=f'<p class="article-reference">Referencia: <a href="{source["url"]}" target="_blank" rel="noopener noreferrer">{e(source["title"])} ↗</a></p>'
  out+='</section>'
 out+='<aside class="article-takeaway"><span>PARA RECORDAR</span><p>'+e(p['takeaway'])+'</p></aside>'
 out+='<section class="article-sources" id="fuentes"><h2>Fuentes y lectura complementaria</h2><ul>'+''.join(f'<li><a href="{s["url"]}" target="_blank" rel="noopener noreferrer">{e(s["title"])} ↗</a></li>' for s in p['sources'])+'</ul><p>Contenido de divulgación. El diagnóstico y el diseño de una intervención requieren evaluar las condiciones de cada proyecto.</p></section>'
 return out

def render(page):
 def save(route,body,title,desc,b,post=None):
  target=R/route;target.mkdir(parents=True,exist_ok=True)
  doc=page(body,title,desc,b=b,active='blog',route=route+'/',post=post)
  for anchor in ('contacto','metodo'):doc=doc.replace(f'href="#{anchor}"',f'href="{b}index.html#{anchor}"')
  doc=doc.replace(f'href="{b}index.html#conocimiento"',f'href="{b}blog/"')
  doc=doc.replace(f'<a href="{b}blog/">Conocimiento</a>',f'<a href="{b}blog/" data-active="true">Conocimiento</a>')
  (target/'index.html').write_text(doc,encoding='utf8')
 body='<section class="section blog-archive" id="inicio"><a class="blog-back" href="../index.html">← Inicio</a><div class="eyebrow">CONOCIMIENTO / BLOG</div><h1>La precisión empieza<br>por <em>entender.</em></h1><p class="blog-intro">Acústica, vibraciones y decisiones técnicas. Un espacio para conocer qué hay detrás de cada diagnóstico.</p><div class="blog-grid">'+''.join(card(p,'../') for p in POSTS)+'</div></section>'
 save('blog',body,'Conocimiento y blog | SABATER Ingeniería','Artículos sobre acústica industrial, ruido y análisis de vibraciones para orientar decisiones técnicas.','../')
 for p in POSTS:
  body='<article class="blog-article" id="inicio"><div class="article-heading"><a class="blog-back" href="../">← Volver al blog</a><div class="blog-meta"><span>'+e(p['category'])+f'</span><span>{minutes(p)} min de lectura</span></div><h1>'+e(p['title'])+'</h1><p>'+e(p['excerpt'])+'</p><div class="article-byline"><span>SABATER Ingeniería</span><time datetime="'+p['date']+'">7 de octubre de 2026</time></div></div><figure class="article-cover">'+photo(p,'../../',True)+'<figcaption>Imagen conceptual generada con IA.</figcaption></figure><div class="article-layout"><aside class="article-toc"><div class="toc-links" role="navigation" aria-label="En este artículo"><span>EN ESTE ARTÍCULO</span>'+''.join(f'<a href="#{s["id"]}">{e(s["title"])}</a>' for s in p['sections'])+'<a href="#fuentes">Fuentes</a></div></aside><div class="article-body">'+article_content(p)+f'<div class="article-cta"><h2>¿Necesitás evaluar una situación concreta?</h2><p>Conocé nuestro enfoque de {e(p["category"].lower())} o contanos qué necesitás resolver.</p><a class="button" href="../../{p["service"]}/">Explorar especialidad <span aria-hidden="true">↗</span></a><a class="article-contact" href="../../index.html#contacto">Hablemos de tu proyecto ↗</a></div></div></div></article>'
  other=next(x for x in POSTS if x!=p)
  body+='<section class="section blog-related"><div class="eyebrow">SEGUÍ EXPLORANDO</div><h2>Otra perspectiva.<br><em>El mismo criterio.</em></h2><div class="blog-grid">'+card(other,'../../')+'</div><a class="blog-back" href="../">Ver todos los artículos →</a></section>'
  save('blog/'+p['slug'],body,p['title']+' | SABATER Ingeniería',p['excerpt'],'../../',p)
