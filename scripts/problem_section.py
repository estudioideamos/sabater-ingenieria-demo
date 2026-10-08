from html import escape
from problem_icons import problem_icon

INTRO = {
 'industrial': 'Equipos, procesos y estructuras pueden intervenir al mismo tiempo. Identificamos qué genera el problema y dónde conviene actuar.',
 'arquitectonica': 'Cada espacio tiene exigencias acústicas propias. Evaluamos qué afecta el confort, la privacidad y el uso previsto.',
 'legal': 'Una situación acústica necesita evidencia clara. Evaluamos los niveles de ruido y preparamos el respaldo técnico de cada caso.',
 'predictivo': 'Las vibraciones pueden revelar cambios en la maquinaria. Analizamos las señales para orientar el diagnóstico y la intervención.'
}
EMPHASIS = {
 'industrial': ['afecta el entorno', 'identificar las fuentes dominantes', 'antes de su puesta en marcha', 'qué fuente tiene mayor impacto', 'no alcanzaron la reducción esperada', 'definir dónde intervenir primero'],
 'arquitectonica': ['afectan la confidencialidad o el confort', 'dificultades para comprender la palabra', 'nivel de aislación requerido', 'confort acústico del espacio', 'antes de incorporarse al proyecto', 'requieren diagnóstico y corrección'],
 'legal': ['evaluar objetivamente', 'mediciones, análisis e informes técnicos', 'evaluación acústica y documentación técnica', 'analizar su incidencia sonora', 'criterios normalizados', 'una respuesta técnica'],
 'predictivo': ['vibraciones anormales', 'aumentan el riesgo de falla', 'antes de una falla crítica', 'comportamiento vibratorio', 'niveles de vibración superiores', 'priorizar una intervención']
}
CLOSING = {
 'industrial': 'Contanos qué ocurre en tu planta.',
 'arquitectonica': 'Contanos qué necesita tu espacio.',
 'legal': 'Contanos qué situación necesitás evaluar.',
 'predictivo': 'Contanos qué observás en tus equipos.'
}
def render_problems(service, title):
 key=service['key']
 cards=[]
 for i,(heading,copy) in enumerate(service['problems']):
  if key=='industrial':
   heading={'Exposición dentro de planta':'Exposición al ruido en planta','Nuevos equipos o ampliaciones':'Equipos nuevos y ampliaciones'}.get(heading,heading)
  phrase=EMPHASIS[key][i]
  assert phrase in copy, (key,phrase)
  copy=escape(copy).replace(escape(phrase), '<strong>'+escape(phrase)+'</strong>',1)
  svg=problem_icon(key,i)
  cards.append('<article><div class="problem-symbol" data-lazy-diagram><template>'+svg+'</template></div><h3>'+escape(heading)+'</h3><p>'+copy+'</p></article>')
 return '<section class="section problems"><div class="eyebrow">PROBLEMAS QUE RESOLVEMOS</div><div class="section-heading"><h2>'+title+'</h2><p>'+INTRO[key]+'</p></div><div class="problem-grid">'+''.join(cards)+'</div><div class="problem-next"><div><h3>¿Reconocés alguna de estas situaciones?</h3><p>'+CLOSING[key]+'</p></div><a href="#contacto">Evaluemos tu caso <span aria-hidden="true">↗</span></a></div></section>'
