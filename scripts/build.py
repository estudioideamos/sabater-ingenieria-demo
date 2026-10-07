from pathlib import Path
from vector_arrows import vectorize
import json,html
from site_meta import metadata,discovery
from blog import POSTS,home as blog_home,render as render_blog
from problem_section import render_problems
from service_scope import render_scope,RESULTS
R=Path(__file__).resolve().parents[1];D=json.loads((R/'content.json').read_text(encoding='utf-8'));S=D['services']
esc=html.escape
names={36:'Air Liquide',37:'Ayassa Fombella',38:'Balanz',39:'Banco Galicia',40:'Bayer',41:'Contract Workplaces',42:'Laboratorio Elea Phoenix',43:'Enarsa',44:'Ford',45:'Haleon',46:'HIT Cowork',47:'Mercado Libre',49:'PwC',50:'Raízen',51:'Rubinat',52:'Santander',53:'Shell',54:'Smurfit Kappa',55:'Telecentro',56:'TGN',57:'TGS',58:'UBA',59:'Universidad de Palermo',60:'Swiss Medical'}
def social_icon(name):
 svg=(R/'assets'/f'{name}.svg').read_text(encoding='utf-8')
 import re
 svg=re.sub(r'<title>.*?</title>', '', svg)
 return svg.replace('<svg ', '<svg class="social-icon" width="22" height="22" fill="currentColor" aria-hidden="true" focusable="false" ').replace('role="img"', '')

def tech_icon(kind):
 if kind in ['measure','analysis','solution','support']:return (R/'assets'/('technical-'+kind+'.svg')).read_text(encoding='utf-8')
 paths={
 'measure':'<path d="M7 24h6l4-12 7 25 6-29 5 16h6"/><path class="icon-orbit" d="M7 7h8M7 7v8M41 7h-8M41 7v8M7 41h8M7 41v-8M41 41h-8M41 41v-8"/>',
 'analysis':'<path d="M9 38V10M9 38h31"/><path class="icon-signal" d="M16 31V23M24 31V15M32 31V8"/><circle cx="35" cy="36" r="5"/><path d="m39 40 4 4"/>',
 'solution':'<path d="M24 5 41 15v19L24 44 7 34V15Z"/><path class="icon-signal" d="m15 24 6 6 12-13"/>',
 'support':'<circle cx="24" cy="24" r="17"/><path class="icon-orbit" d="M24 7v7M24 34v7M7 24h7M34 24h7"/><path d="m18 24 4 4 9-10"/>',
 'mail':'<rect x="6" y="11" width="36" height="27" rx="3"/><path d="m7 14 17 13 17-13"/>',
 'phone':'<path d="M14 7h7l3 10-5 4c3 5 5 7 10 10l4-5 9 3v7c0 5-5 7-9 5C17 35 9 26 7 14 6 10 9 7 14 7Z"/>',
 'location':'<path d="M37 19c0 10-13 24-13 24S11 29 11 19a13 13 0 0 1 26 0Z"/><circle cx="24" cy="19" r="4"/>'}
 return '<svg class="tech-icon" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[kind]+'</svg>'
def signal_explorer():
 return (R/'assets/signal-explorer.inc').read_text(encoding='utf-8')

def paras(lines):return ''.join('<p>'+esc(t)+'</p>' for t in lines)
def label(n,t):return f'<div class="eyebrow">{t}</div>' if n.isdigit() else f'<div class="eyebrow"><span>{n}</span>{t}</div>'
def image(key,alt,prefix='',hero=False):
 info=json.loads((R/'image-variants.json').read_text())[key]
 variants=info['variants'];srcset=', '.join(f'{prefix}assets/{name} {width}w' for width,name in variants)
 sizes='100vw' if hero or key in ['home','industrial','arquitectonica','legal','predictivo'] else '(max-width: 760px) 88vw, 44vw' if '-card' in key else '(max-width: 760px) 88vw, 29vw'
 priority='fetchpriority="high" loading="eager"' if hero else 'loading="lazy"'
 return f'<img src="{prefix}assets/{variants[-1][1]}" srcset="{srcset}" sizes="{sizes}" alt="{esc(alt)}" {priority} decoding="async" width="{info["width"]}" height="{info["height"]}">'

def btn(text,target='#contacto',secondary=False):return f'<a class="button {"secondary" if secondary else ""}" href="{target}">{text}<span class="button-icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 17 17 7M7 7h10v10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></a>'
def logos(ids,b,carousel=False):
 if not ids:return ''
 bounds=json.loads((R/'logo-layout.json').read_text(encoding='utf-8'))
 items=[]
 for i in ids:
  filename={47:'client-47-official.webp',60:'client-60-official.png',39:'client-39-official.png',40:'client-40-official.svg'}.get(i,f'client-{i}-hd.webp');info=bounds[filename];w,h=info['size'];x,y,x2,y2=info['box'];bw,bh=x2-x,y2-y
  mark_width=info.get('display_width',min(154,54*bw/bh))
  if carousel: mark_width={59:76,58:142,38:140,49:118,51:130,37:138,60:145}.get(i,mark_width)
  style=f'--mark-width:{mark_width:.2f}px;--mark-ratio:{bw}/{bh};--image-width:{w/bw*100:.3f}%;--image-height:{h/bh*100:.3f}%;--image-left:{-x/bw*100:.3f}%;--image-top:{-y/bh*100:.3f}%'
  items.append(f'<figure class="logo-item {"logo-dark-tile" if i in [43,46,55,58,60] else ""} {"logo-paper-source" if i in [41,54,56] else "logo-reverse-source" if i in [39,59] else ""}"><div class="logo-stage"><div class="logo-mark" style="{style}"><img src="{b}assets/{filename}" alt="{names[i]}" width="{w}" height="{h}" loading="lazy"></div></div></figure>')
 filters=(R/'assets/logo-filters.inc').read_text(encoding='utf8')
 if carousel:
  return filters+'<div class="client-carousel" role="region" aria-label="Organizaciones de nuestra trayectoria"><div class="client-carousel-bar"><span>TRAYECTORIA PROFESIONAL</span><div class="client-carousel-controls" hidden><button type="button" data-logo-direction="-1" aria-label="Ver logos anteriores" aria-controls="client-logo-track"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M19 12H5m6-6-6 6 6 6"/></svg></button><button type="button" data-logo-direction="1" aria-label="Ver logos siguientes" aria-controls="client-logo-track"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button></div></div><div class="logos" id="client-logo-track" tabindex="0" aria-label="Logos de organizaciones. Usá las flechas para recorrerlos.">'+''.join(items)+'</div></div>'
 return filters+'<div class="logos">'+''.join(items)+'</div>'

def process(steps,end='Cada proyecto se aborda con un proceso claro, trazable y adaptable a la complejidad de cada necesidad.',b='',specialty=None):
 alts=['Sensor de vibración instalado sobre el alojamiento de un motor industrial','Instrumento de análisis de señales con sensor conectado','Detalle de apoyos elásticos y fijaciones de aislamiento','Revisión de resultados y documentación técnica']
 visuals=''.join(f'<img class="method-photo{ " is-active" if j==0 else ""}" src="{b}assets/method-editorial-{j+1}-960.webp" srcset="{b}assets/method-editorial-{j+1}-480.webp 480w, {b}assets/method-editorial-{j+1}-960.webp 960w, {b}assets/method-editorial-{j+1}-1536.webp 1536w" sizes="(max-width:760px) 88vw, 65vw" alt="{alts[j]}" width="1536" height="1024" loading="lazy" decoding="async" aria-hidden="{str(j!=0).lower()}">' for j in range(4))
 if specialty:
  keys=[specialty+'-editorial-card',specialty+'-analizar',specialty+'-decidir']
  descriptions=['Relevamiento y mediciones en el contexto del servicio','Análisis técnico de las condiciones del proyecto','Evaluación de alternativas para orientar la solución']
  replacements=''.join(image(k,descriptions[j],b).replace('<img ',f'<img class="method-photo{ " is-active" if j==0 else ""}" aria-hidden="{str(j!=0).lower()}" ').replace('29vw','52vw') for j,k in enumerate(keys))
  visuals=replacements+visuals[visuals.rfind('<img '):]
 notes=RESULTS[specialty] if specialty else ['Comprender el contexto y definir el alcance.','Interpretar mediciones y reconocer patrones.','Comparar alternativas con criterio técnico.','Documentar una decisión fundamentada.']
 visuals+='<div class="method-annotation" aria-live="polite">'+''.join(f'<p data-method-note="{j}"'+(' hidden' if j else '')+f'><span>{j+1:02d} / LECTURA TÉCNICA</span>{esc(note)}</p>' for j,note in enumerate(notes))+'</div>'
 stages=''.join(f'<article class="method-stage{ " is-active" if j==0 else ""}"><h3><button type="button" data-method-stage="{j}" aria-expanded="true" aria-controls="method-copy-{j}" id="method-title-{j}">{('<span class="method-number" aria-hidden="true">'+str(j+1).zfill(2)+'</span>') if specialty else ''}<span class="method-title">{esc(t)}</span></button></h3><div class="method-copy" id="method-copy-{j}" role="region" aria-labelledby="method-title-{j}"><p>{esc(v)}</p>{('<p class="method-result"><span>RESULTADO</span>'+esc(RESULTS[specialty][j])+'</p>') if specialty else ''}</div></article>' for j,(t,v) in enumerate(steps))
 return '<section class="section process method-editorial" id="metodo">'+label('04','MÉTODO DE TRABAJO')+'<div class="section-heading"><h2>Cómo trabajamos</h2><p>Del diagnóstico a una decisión técnicamente fundamentada.</p></div><div class="method-composition"><div class="method-gallery">'+visuals+'</div><div class="method-stages">'+stages+'</div></div><p class="section-note">'+esc(end)+'</p></section>'

def predictive_benefits(items):
 diagrams=[(R/'assets/benefits'/f'benefit-{i+1}.svg').read_text(encoding='utf-8') for i in range(5)]
 out='<div class="predictive-benefits" aria-label="Beneficios del análisis de vibraciones">'
 for i,item in enumerate(items):
  title,description=item.split(': ',1)
  eyebrow=''
  if i==0:
   title='Detectar cambios.<br>Anticipar decisiones.'
   description='Leemos las señales del equipo para identificar cambios y orientar la próxima intervención.'
   eyebrow='<div class="benefit-top"><span>ANTICIPACIÓN · CRITERIO TÉCNICO</span></div>'
  else:title=esc(title)
  out+=f'<article class="predictive-benefit benefit-{i+1}">{diagrams[i]}<div class="benefit-copy">{eyebrow}<h3>{title}</h3><p>{esc(description)}</p></div></article>'
 return out+'</div>'

def contact(selected=''):
 opts=''.join(f'<option {"selected" if s["name"]==selected else ""}>{s["name"]}</option>' for s in S)
 markup='<section class="section contact" id="contacto"><div>'+label('HABLEMOS','CONTACTO')+'<h2>Hablemos de<br><em>tu proyecto.</em></h2><p>Contanos qué necesitás resolver y coordinemos una conversación.</p><div class="contact-directory"><a class="contact-channel" href="mailto:hola@sabater.com.ar"><span class="channel-icon">'+tech_icon('mail')+'</span><span class="channel-copy"><small>ESCRIBINOS</small><strong>hola@sabater.com.ar</strong></span><span class="channel-arrow" aria-hidden="true">↗</span></a><a class="contact-channel" href="tel:+541133227832"><span class="channel-icon">'+tech_icon('phone')+'</span><span class="channel-copy"><small>HABLEMOS DE TU PROYECTO</small><strong>+54 11 3322-7832</strong></span><span class="channel-arrow" aria-hidden="true">↗</span></a><div class="contact-reach"><span class="reach-icon">'+tech_icon('location')+'</span><div><span>Proyectos en todo el país.</span></div></div></div><div class="contact-links"><a class="contact-whatsapp" href="https://wa.me/541133227832" target="_blank" rel="noopener noreferrer">'+social_icon('whatsapp')+'<span>Consultanos por WhatsApp</span><span aria-hidden="true">↗</span></a><div class="contact-networks"><span>SEGUINOS</span><button data-pending="Instagram">'+social_icon('instagram')+'<span>Instagram ↗</span></button><button data-pending="LinkedIn">'+social_icon('linkedin')+'<span>LinkedIn ↗</span></button></div></div></div><form id="contact-form" method="post"><h3>Contanos qué necesitás.</h3><p class="form-intro">Los campos con * son obligatorios.</p><div class="form-grid"><label>Nombre y apellido *<input name="nombre" maxlength="120" autocomplete="name" required placeholder="Tu nombre"></label><label>Email *<input type="email" name="email" autocomplete="email" required placeholder="nombre@empresa.com"></label></div><label>Servicio de interés (opcional)<select name="servicio"><option value="" '+('selected' if not selected else '')+'>Seleccioná un servicio</option>'+opts+'<option>Otro / No estoy seguro</option></select></label><label>Contanos sobre tu proyecto *<textarea name="mensaje" maxlength="5000" required rows="3" placeholder="Contanos el problema, dónde ocurre y qué necesitás evaluar."></textarea></label><details class="contact-extra"><summary>Datos adicionales <span>(opcional)</span></summary><div class="form-grid"><label>Empresa (opcional)<input name="empresa" maxlength="160" autocomplete="organization" placeholder="Nombre de la empresa"></label><label>Teléfono (opcional)<input type="tel" name="telefono" autocomplete="tel" placeholder="Código de área y número"></label></div></details><button class="button" type="submit">Enviar consulta <span class="button-icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 17 17 7M7 7h10v10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button><p class="form-note">Formulario de demostración. No se envían ni almacenan datos.</p><p id="form-status" role="status"></p></form></section>'
 # Keep the reading order: introduction, form, alternative channels.
 intro,rest=markup.split('<div class="contact-directory">',1)
 channels,form_markup=rest.split('</div><form ',1)
 intro=intro.replace('<section class="section contact" id="contacto"><div>','<section class="section contact" id="contacto"><div class="contact-intro">')+'</div>'
 return intro+'<form '+form_markup.removesuffix('</section>')+'<div class="contact-alternatives"><div class="contact-directory">'+channels+'</div></section>'

def closing(title,text,cta,key='industrial',b='',home=False):
 words=title.rsplit(' ',3)
 heading='Tu próximo desafío.<br><em>Lo resolvemos con criterio.</em>' if home else esc(words[0])+' <em>'+esc(' '.join(words[1:]))+'</em>'
 if key=='industrial' and not home:
  first,second=title.split('? ',1);heading=esc(first+'?')+'<br><em>'+esc(second)+'</em>'
 heading=heading.replace('por ruido', 'por&nbsp;ruido')
 compact=' closing-home' if home else ' closing-compact'
 return '<section class="closing closing-editorial'+compact+'">'+image(key if home else key+'-decidir','Ingeniería aplicada al diagnóstico y la definición de soluciones',b).replace('sizes="(max-width: 760px) 88vw, 29vw"','sizes="100vw"')+'<div class="closing-content">'+label('SIGUIENTE PASO','INGENIERÍA CON CRITERIO')+f'<h2>{heading}</h2><p>{esc(text)}</p><div class="closing-actions">'+btn(cta)+'<a class="text-button" href="https://wa.me/541133227832" target="_blank" rel="noopener noreferrer"><span class="closing-social-icon">'+social_icon('whatsapp')+'</span><span>Consultar por WhatsApp</span></a></div></div></section>'

def page(body,title,desc,b='',active='',hero='home-cinematic',route='',post=None):
 descriptions={'industrial':'Ruido en plantas','arquitectonica':'Confort y aislamiento','legal':'Evaluaciones y respaldo técnico','predictivo':'Condición de maquinaria'}
 service_links=''
 for service in S:
  current=active==service['key']
  service_links+=f'<li data-specialty="{service["key"]}"><a class="specialty-link" href="{b}{service["slug"]}/"'+(' aria-current="page"' if current else '')+f'><img class="specialty-photo" src="{b}assets/{service["key"]}-card-640w.webp" width="640" height="400" alt="" aria-hidden="true" loading="lazy" decoding="async"><span class="specialty-copy"><strong>{service["short"]}</strong><small>{descriptions[service["key"]]}</small></span><span class="specialty-arrow" aria-hidden="true">↗</span>'+('<span class="specialty-current">Estás acá</span>' if current else '')+'</a></li>'

 dropdown=f'<div class="nav-services"><button class="services-toggle" aria-expanded="false" aria-controls="services-submenu">Servicios <svg class="nav-chevron" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><ul id="services-submenu" class="services-submenu" hidden>{service_links}<li class="all-services"><a href="{b}index.html#servicios">Explorar todas las especialidades <span aria-hidden="true">→</span></a></li></ul></div>'
 nav=f'<a href="{b}index.html#inicio">Inicio</a>'+dropdown+''.join(f'<a href="{b}index.html#{anchor}">{text}</a>' for anchor,text in [('experiencia','Experiencia'),('nosotros','Nosotros'),('conocimiento','Conocimiento')])
 lab_script=f'<script type="module" src="{b}assets/vibration-lab.js?v=17"></script>' if not active else ''
 if active in [s['key'] for s in S]:body=body.replace('class="hero-image"',f'class="hero-image" data-specialty="{active}"',1)
 body_classes=' '.join(name for name,match in [('has-hero','class="hero ' in body),('is-home','home-hero' in body),('is-service','detail-hero' in body)] if match)
 return vectorize(f'''<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{title}</title><meta name="description" content="{esc(desc)}">{metadata(title,desc,hero,active,S,route,post)}<style>@view-transition{{navigation:auto}}@media(prefers-reduced-motion:reduce){{@view-transition{{navigation:none}}}}</style><meta name="theme-color" content="#181A1B"><meta property="og:title" content="{title}"><meta property="og:description" content="{esc(desc)}"><link rel="icon" href="{b}assets/favicon.webp"><link rel="preload" href="{b}assets/fonts/geist-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="{b}assets/site.min.css?v=121">{lab_script}<script src="{b}assets/experience.min.js?v=3" defer></script><script src="{b}assets/app.min.js?v=5" defer></script><script src="{b}assets/smooth-wheel.min.js?v=3" defer></script><script src="{b}assets/premium.min.js?v=23" defer></script><script src="{b}assets/microinteractions.min.js?v=13" defer></script></head><body class="{body_classes}"><div class="reading-progress" aria-hidden="true"></div><a class="skip" href="#contenido">Saltar al contenido</a><header><a href="{b}index.html" class="brand" aria-label="Sabater Ingeniería — Inicio"><img src="{b}assets/logo-light-web.webp" alt="SABATER Ingeniería" width="310" height="64"></a><button class="menu-toggle" aria-expanded="false" aria-controls="navigation" aria-label="Abrir menú"><span class="hamburger" aria-hidden="true"><i></i><i></i><i></i></span></button><nav id="navigation" aria-label="Navegación principal">{nav}<a class="nav-contact" href="#contacto">Hablemos <span class="button-icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 17 17 7M7 7h10v10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></a></nav></header><main id="contenido">{body}</main><footer class="editorial-footer"><div class="footer-intro"><div class="footer-kicker"><span>ACÚSTICA · VIBRACIONES · INGENIERÍA</span><a href="#inicio" class="footer-up" aria-label="Volver arriba"><span>Volver arriba</span><span aria-hidden="true">↑</span></a></div><a class="footer-invitation" href="#contacto"><span>El próximo paso, <em>con criterio.</em></span><span class="footer-invitation-arrow" aria-hidden="true">↗</span></a></div><div class="footer-directory"><div class="footer-statement"><img src="{b}assets/logo-light-web.webp" alt="Sabater Ingeniería" width="310" height="64"><p>Medimos con precisión.<br>Interpretamos con experiencia.<br>Definimos soluciones.</p></div><details class="footer-column footer-fold" open><summary><h3>Especialidades</h3><span aria-hidden="true" class="footer-fold-icon"></span></summary><div class="footer-fold-links"><a href="{b}acustica-industrial/">Acústica industrial</a><a href="{b}acustica-arquitectonica/">Acústica arquitectónica</a><a href="{b}acustica-legal/">Acústica legal</a><a href="{b}mantenimiento-predictivo/">Mantenimiento predictivo</a></div></details><details class="footer-column footer-fold" open><summary><h3>Explorar</h3><span aria-hidden="true" class="footer-fold-icon"></span></summary><div class="footer-fold-links"><a href="{b}index.html#nosotros">Nosotros</a><a href="{b}index.html#experiencia">Experiencia</a><a href="#metodo">Cómo trabajamos</a><a href="{b}index.html#conocimiento">Conocimiento / Blog</a></div></details><div class="footer-column footer-direct"><h3>Conversemos</h3><a href="tel:+541133227832">+54 11 3322-7832</a><a href="mailto:hola@sabater.com.ar">hola@sabater.com.ar</a><a href="#contacto">Contanos tu proyecto ↗</a></div></div><div class="footer-signature footer-signature-brand" aria-hidden="true"><div class="footer-wordmark"><img src="{b}assets/sabater-wordmark.svg" alt="SABATER" width="1800" height="274" loading="lazy" decoding="async"></div></div><div class="footer-bottom"><span>© 2026 SABATER Ingeniería.</span><a class="studio-credit" href="https://ideamos.com.ar/" target="_blank" rel="noopener noreferrer" aria-label="Diseño en sintonía por Ideamos — visitar su web"><span>Diseño en sintonía</span><img src="{b}assets/ideamos-light.webp" alt="Ideamos" width="870" height="213" loading="lazy" decoding="async"><span class="credit-arrow" aria-hidden="true">↗</span></a></div></footer><a class="floating-contact"  aria-label="Contacto por WhatsApp" href="https://wa.me/541133227832" target="_blank" rel="noopener noreferrer">{social_icon('whatsapp')}</a><dialog id="pending-dialog"><button class="dialog-close" aria-label="Cerrar">×</button><div class="eyebrow">DEMO · CONTACTO PENDIENTE</div><h2 id="pending-title">Contacto</h2><p>Estamos preparando este canal. El dato definitivo está pendiente de entrega por parte del cliente.</p><button class="button dialog-done">Entendido <span class="button-icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 17 17 7M7 7h10v10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button></dialog></body></html>''')
body='<section class="hero home-hero" id="inicio"><div class="hero-image">'+image('home-cinematic','Medición acústica en un entorno industrial',hero=True)+'<video class="hero-film" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" data-src="assets/hero-engineering-loop.mp4?v=2"></video></div><div class="hero-content">'+label('SABATER INGENIERÍA','PRECISIÓN QUE TRANSFORMA')+'<h1>Ingeniería<br>especializada en<br><em>acústica</em> y vibraciones<span class="title-dot">.</span></h1><p>Diagnosticamos problemas, evaluamos alternativas y desarrollamos soluciones para que cada decisión técnica esté respaldada por información confiable.</p><div class="hero-actions">'+btn('Hablemos de tu proyecto')+'<a class="text-link" href="#servicios"><span class="secondary-icon" aria-hidden="true">↓</span>Conocé nuestros servicios</a></div></div><div class="hero-bottom"><span>ACÚSTICA & VIBRACIONES</span><a href="#servicios" aria-label="Explorar servicios">EXPLORAR</a></div></section>'
body+='<section class="section services" id="servicios">'+label('02','ESPECIALIDADES')+'<div class="section-heading"><h2>Cuatro especialidades.<br>Un mismo <em>criterio técnico.</em></h2><p>Servicios de ingeniería en acústica y vibraciones. Del diagnóstico a la definición técnica de la solución.</p></div><div class="service-grid">'
EXPERIENCE_COPY={
 'predictivo':['El análisis de vibraciones ayuda a detectar cambios en tus equipos antes de que una falla sea evidente.','Combinamos mediciones y seguimiento de tendencias para definir qué revisar, cuándo intervenir y cómo orientar el mantenimiento.'],
 'industrial':['Más de 15 años de trayectoria profesional en proyectos de ingeniería acústica para empresas y plantas de distintas industrias.','Experiencia en ruido ambiental, exposición ocupacional y sistemas de mitigación, con criterio técnico independiente.'],
 'arquitectonica':['Más de 15 años de trayectoria profesional en ingeniería acústica aplicada a proyectos corporativos, hoteleros, institucionales y grandes espacios.','Acompañamos a estudios, desarrolladores y empresas en la definición de aislamiento, acondicionamiento y confort acústico desde el diseño.']
}
INTRO_EDITORIAL={
 'industrial':('Antes de invertir,','entender el origen.','identificar fuentes, evaluar alternativas y definir planes de mitigación','¿Qué está pasando<br>en tu planta?'),
 'arquitectonica':('Antes de construir,','diseñar el confort.','anticipar problemas y alcanzar los resultados esperados','¿Qué necesita<br>tu espacio?'),
 'legal':('Ante un conflicto,','respaldo técnico.','mediciones, análisis y documentación técnica','¿Qué necesitás<br>evaluar y respaldar?'),
 'predictivo':('Antes de una falla,','leer las señales.','identificar cambios en su comportamiento, detectar posibles anomalías','¿Qué señales<br>dan tus equipos?')
}
for n,s in enumerate(S):
 body+=f'<a class="service-card" data-specialty="{s["key"]}" href="{s["slug"]}/"><div class="card-image">'+image(s['key']+'-editorial-card',s['card'][0])+f'</div><div class="card-copy"><h3>{s["short"]}</h3><p>{s["card"][0]}</p><span class="card-link">Explorar especialidad <span>↗</span></span></div></a>'
body+='</div></section>'
body+='<section class="section experience experience-gallery" id="experiencia">'+label('06','TRAYECTORIA PROFESIONAL')+'<div class="section-heading"><h2>Experiencia<br><em>que nos respalda.</em></h2><p>A lo largo de <strong>más de 15 años</strong> de trayectoria profesional hemos participado en proyectos de ingeniería acústica para empresas, estudios y organizaciones de múltiples industrias.</p></div>'+logos([44,53,40,45,57,56,42,50,36,54,43,55],'')+'<p class="section-note">Industria · Oil & Gas · Minería · Automotriz · Telecomunicaciones · Arquitectura · Construcción · Farmacéutica · Salud · Servicios financieros.</p></section>'
why_emphasis = ['conocimiento especializado', 'necesidades reales del proyecto', 'validar técnicamente cada decisión', 'soluciones que puedan llevarse efectivamente a la práctica']
body+='<section class="section why"><div class="why-layout"><div class="why-statement">'+label('03','POR QUÉ SABATER INGENIERÍA')+'<h2>Certeros.<br><em>Confiables.</em><br>Impecables.</h2></div><div class="why-grid">'+''.join(f'<article><h3>{t}</h3><p>{v.replace(why_emphasis[j], "<strong>" + why_emphasis[j] + "</strong>")}</p></article>' for j,(t,v) in enumerate(D['why']))+'</div></div></section>'
body+=(R/'assets/diagnostic.inc').read_text(encoding='utf8')
body+=process(D['steps'],D['intro'][2]).replace('<section class="section process method-editorial" id="metodo">','<section class="section process method-editorial home-method" id="metodo"><span id="enfoque" class="section-anchor" aria-hidden="true"></span>').replace('<p>Del diagnóstico a una decisión técnicamente fundamentada.</p>','<p>Mediciones, análisis y experiencia para transformar información en <strong>decisiones técnicas fundamentadas.</strong></p>')
body+=(R/'assets/vibration-lab.inc').read_text(encoding='utf-8')
about_paragraphs=paras(D['about'])
for phrase in ['consultoría especializada en acústica y vibraciones', 'tomar decisiones con información confiable', 'especialización, independencia técnica y metodología', 'la confianza, la claridad y la calidad profesional']:
 about_paragraphs=about_paragraphs.replace(phrase,'<strong>'+phrase+'</strong>')
body+='<section class="section about" id="nosotros">'+label('05','SOBRE SABATER INGENIERÍA')+'<div class="about-layout"><div class="experience-number"><div class="experience-overline"><span>TRAYECTORIA</span></div><div class="experience-value">15<span>+</span></div><p>Años de experiencia<br><em>en ingeniería acústica.</em></p><div class="experience-rule" aria-hidden="true"></div><div class="experience-footnote">PRECISIÓN EN CADA MEDICIÓN.<br>CRITERIO EN CADA DECISIÓN.</div></div><div class="about-copy"><h2>Especialización.<br>Independencia.<br><em>Ingeniería con criterio.</em></h2>'+about_paragraphs+'<a class="about-contact" href="#contacto">Conversemos sobre tu proyecto <span aria-hidden="true">↗</span></a></div></div></section>'
body+=blog_home()
body+=closing("Tu próximo desafío", "Contanos qué necesitás resolver. Evaluamos la situación y definimos el próximo paso.", "Contanos tu proyecto",home=True)
body+=contact().replace('Contanos qué necesitás resolver y coordinemos una conversación.','Contanos qué necesitás resolver. Evaluamos la situación y definimos el próximo paso con criterio técnico.')
(R/'index.html').write_text(page(body,'SABATER Ingeniería | Ingeniería Acústica y Vibraciones','Ingeniería especializada en acústica y vibraciones para industrias, arquitectura y evaluaciones técnicas. Diagnóstico, medición, análisis e ingeniería.'),encoding='utf-8')
SERVICE_LEADS={
 'industrial':'Identificamos el origen del ruido y definimos cómo controlarlo en tu planta.',
 'arquitectonica':'Integramos el confort y el aislamiento acústico al diseño de tus espacios.',
 'legal':'Medimos, evaluamos y documentamos cada situación acústica con respaldo técnico.',
 'predictivo':'Analizamos las vibraciones para detectar anomalías y orientar el mantenimiento de tus equipos.'
}
INTRO_EDITORIAL={
 'industrial':('Antes de invertir,','entender el origen.','identificar fuentes, evaluar alternativas y definir planes de mitigación','¿Qué está pasando<br>en tu planta?'),
 'arquitectonica':('Antes de construir,','diseñar el confort.','anticipar problemas y alcanzar los resultados esperados','¿Qué necesita<br>tu espacio?'),
 'legal':('Ante un conflicto,','respaldo técnico.','mediciones, análisis y documentación técnica','¿Qué necesitás<br>evaluar y respaldar?'),
 'predictivo':('Antes de una falla,','leer las señales.','identificar cambios en su comportamiento, detectar posibles anomalías','¿Qué señales<br>dan tus equipos?')
}
for n,s in enumerate(S):
 b='../';body='<section class="hero detail-hero" id="inicio"><div class="hero-image">'+image(s['key'],s['lead'],b,True)+f'<video class="hero-film" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" data-src="../assets/hero-{s["key"]}-loop.mp4"></video></div><div class="hero-content"><a class="breadcrumb" href="../index.html#servicios">← Servicios / '+s['short']+'</a>'+label('ESPECIALIDAD','SABATER INGENIERÍA')+'<h1>'+esc(s['name'])+'<span class="title-dot">.</span></h1><p class="detail-lead">'+esc(SERVICE_LEADS[s['key']])+'</p>'+btn(s['cta'])+'<a class="text-link" href="#metodo"><span class="secondary-icon" aria-hidden="true">↓</span>Ver cómo trabajamos</a></div><div class="hero-bottom"><span>DIAGNÓSTICO · ANÁLISIS · INGENIERÍA</span><span>CRITERIO TÉCNICO INDEPENDIENTE</span></div></section>'
 first,second,emphasis,problem_title=INTRO_EDITORIAL[s['key']]
 intro_copy=paras(s['intro']).replace(emphasis,'<strong>'+emphasis+'</strong>')
 body+='<section class="section detail-intro"><div class="detail-intro-heading">'+label('01','COMPRENDER EL CONTEXTO')+'<h2>'+first+'<br><em>'+second+'</em></h2></div><div class="detail-intro-copy">'+intro_copy+'</div></section>'+render_problems(s,problem_title)
 body+=render_scope(s,image,b)
 body+=process(s['steps'],s['stepEnd'],b,s['key'])
 body+='<section class="section experience'+(' experience-gallery service-gallery' if s['logos'] else '')+'" id="experiencia">'+label('05','INFORMACIÓN QUE RESPALDA DECISIONES')+'<div class="section-heading"><h2>'+('Qué aporta el análisis<br>de vibraciones.' if s['key']=='predictivo' else 'Experiencia y<br>respaldo técnico.')+'</h2><div>'+('<div class="experience-metric"><span>15+</span><small>AÑOS DE TRAYECTORIA PROFESIONAL</small></div>' if s['key']!='predictivo' else '')+paras(EXPERIENCE_COPY.get(s['key'],s['experience'])).replace('Más de 15 años','<strong>Más de 15 años</strong>')+'</div></div>'+logos(s['logos'],b,carousel=True)
 if s.get('benefits'):body+=predictive_benefits(s['benefits'])
 body+='<p class="section-note">'+('<span class="sector-label">Sectores</span>' if s['logos'] else '')+s['sectors']+'</p></section><section class="section faq">'+label('06','PREGUNTAS FRECUENTES')+'<div class="faq-layout"><div class="faq-intro"><h2>Respuestas claras.<br><em>Desde el principio.</em></h2><p>Cada proyecto tiene sus particularidades. Empecemos por resolver las dudas más habituales.</p><a class="faq-contact" href="#contacto">¿Tenés otra consulta? Hablemos <span aria-hidden="true">↗</span></a></div><div class="faq-list">'+''.join('<details'+(' open' if i==0 else '')+'><summary><span class="faq-question">'+esc({'¿Es necesario realizar mediciones antes de definir una solución acústica?':'¿Necesito medir antes de elegir una solución?','¿Dónde operan?':'¿En qué zonas trabajan?','¿Pueden evaluar una solución propuesta por otro proveedor?':'¿Pueden revisar la propuesta de otro proveedor?'}.get(q,q))+'</span><span class="faq-toggle" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10h12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path class="faq-plus-stem" d="M10 4v12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></span></summary><p>'+esc(ans)+'</p></details>' for i,(q,ans) in enumerate(s['faq']))+'</div></div></section>'
 body+=closing(*s['closing'],s['cta'],key=s['key'],b=b)+contact(s['name']);out=R/s['slug'];out.mkdir(exist_ok=True);(out/'index.html').write_text(page(body,s['short']+' | SABATER Ingeniería',s['lead'],b,s['key'],s['key']),encoding='utf-8')
print('Built home and four service pages; generating blog.')


render_blog(page)
discovery(S,POSTS)
