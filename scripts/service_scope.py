from html import escape
SCOPE={
 'industrial': ('Identificamos las fuentes y los caminos de transmisión del ruido para evaluar alternativas antes de invertir y definir medidas de control técnicamente justificadas.',[
 ('Diagnóstico acústico','Mediciones de ruido y vibraciones para identificar fuentes, niveles y caminos de transmisión.'),
 ('Análisis y modelado','Evaluación del comportamiento acústico y comparación de alternativas de intervención.'),
 ('Diseño de mitigación','Aislamiento, encapsulados, barreras, silenciadores y tratamientos específicos según cada caso.')]),
 'arquitectonica': ('Integramos el confort y el aislamiento acústico al diseño, evaluando alternativas antes de ejecutar la obra y ajustando cada solución al uso del espacio.',[
 ('Evaluación del proyecto','Análisis de los usos, la privacidad y las necesidades acústicas de cada ambiente.'),
 ('Modelado acústico','Evaluación de la reverberación, el aislamiento y el comportamiento sonoro del espacio.'),
 ('Soluciones constructivas','Criterios de materiales, acondicionamiento y control del ruido de instalaciones.')]),
 'legal': ('Evaluamos cada situación según su contexto y la normativa aplicable, con mediciones y documentación técnica para respaldar trámites, reclamos y decisiones profesionales.',[
 ('Medición y relevamiento','Registro de niveles de ruido y condiciones de medición para una evaluación trazable.'),
 ('Evaluación técnica y normativa','Análisis de ruidos molestos, impacto acústico y criterios de evaluación según cada caso.'),
 ('Informes y pericias','Documentación para pericias en acústica, inscripciones RAC, evaluaciones de impacto e informes según IRAM 4062.')]),
 'predictivo': ('Analizamos las vibraciones de equipos rotativos para conocer su condición, detectar indicadores tempranos de falla y orientar las decisiones de mantenimiento.',[
 ('Medición de vibraciones','Registro de señales y niveles en condiciones representativas de operación.'),
 ('Diagnóstico de condición','Evaluación de espectros, tendencias y posibles anomalías según el tipo de equipo.'),
 ('Criterios de mantenimiento','Recomendaciones para priorizar intervenciones, seguimiento o evaluaciones complementarias.')])
}
RESULTS={
 'industrial':['Alcance y objetivos definidos','Fuentes y caminos de transmisión caracterizados','Alternativas de control comparadas','Prioridades y recomendaciones de mitigación'],
 'arquitectonica':['Requerimientos acústicos definidos','Condiciones acústicas evaluadas','Criterios y soluciones constructivas','Definiciones integradas al proyecto'],
 'legal':['Alcance y marco de evaluación definidos','Mediciones y condiciones documentadas','Resultados interpretados según el caso','Informe o documentación de respaldo'],
 'predictivo':['Equipos y alcance del análisis definidos','Señales de vibración registradas','Diagnóstico de condición','Prioridades y próximos pasos de mantenimiento']
}

def render_scope(service,image,prefix):
 intro,cards=SCOPE[service['key']]
 figures=''.join('<figure>'+image(service['key']+'-'+key,title,prefix)+'<figcaption><h3>'+escape(title)+'</h3><p>'+escape(copy)+'</p></figcaption></figure>' for key,(title,copy) in zip(['medir','analizar','decidir'],cards))
 note=''
 if service['key'] in ['legal','predictivo']:
  extra=service['what'][2] if service['key']=='legal' else service['what'][1]+' '+service['what'][2]
  note='<p class="scope-technical-note">'+escape(extra)+'</p>'
 return '<section class="section what"><div class="eyebrow">QUÉ HACEMOS</div><div class="section-heading"><h2>'+escape(service['whatTitle'])+'</h2><p>'+escape(intro)+'</p></div><div class="sequence">'+figures+'</div>'+note+'</section>'
