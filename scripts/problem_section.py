from html import escape

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
# Simple vector symbols stay sharp at every screen density.
ICONS = [
 '<path d="M5 20V9l7-5 7 5v11M9 20v-6h6v6M3 20h18"/>',
 '<path d="M8 15c0-3-3-3-3-7a7 7 0 0 1 14 0c0 4-3 5-3 8s-2 5-5 5"/><path d="M10 10V8a2 2 0 0 1 4 0c0 2-3 3-3 5"/>',
 '<rect x="4" y="6" width="16" height="14" rx="2"/><path d="M8 6V3h8v3M8 13h8M12 9v8"/>',
 '<circle cx="12" cy="12" r="3"/><path d="M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4"/><circle cx="4" cy="4" r="1"/><circle cx="20" cy="4" r="1"/><circle cx="4" cy="20" r="1"/><circle cx="20" cy="20" r="1"/>',
 '<path d="M4 5h16v14H4zM8 9l8 6M16 9l-8 6"/>',
 '<path d="M4 20h17M7 16v-4M12 16V8M17 16V4M5 7l5-3"/>'
]

def render_problems(service, title):
 key=service['key']
 cards=[]
 for i,(heading,copy) in enumerate(service['problems']):
  phrase=EMPHASIS[key][i]
  assert phrase in copy, (key,phrase)
  copy=escape(copy).replace(escape(phrase), '<strong>'+escape(phrase)+'</strong>',1)
  # Non-industrial specialties use diagnosis-oriented symbols rather than an ear/house metaphor.
  icon=ICONS[i] if key=='industrial' else ICONS[[3,5,2,3,5,4][i]]
  svg='<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icon+'</svg>'
  cards.append('<article><div class="problem-symbol">'+svg+'</div><h3>'+escape(heading)+'</h3><p>'+copy+'</p></article>')
 return '<section class="section problems"><div class="eyebrow">PROBLEMAS QUE RESOLVEMOS</div><div class="section-heading"><h2>'+title+'</h2><p>'+INTRO[key]+'</p></div><div class="problem-grid">'+''.join(cards)+'</div><div class="problem-next"><div><h3>¿Reconocés alguna de estas situaciones?</h3><p>'+CLOSING[key]+'</p></div><a href="#contacto">Evaluemos tu caso <span aria-hidden="true">↗</span></a></div></section>'
