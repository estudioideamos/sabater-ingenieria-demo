"""Replace decorative arrow glyphs in HTML text, preserving attributes and existing SVGs."""
import re
PATHS={
 '↺':'M4 10a8 8 0 1 1 1 7M4 4v6h6',
 '↗':'M7 17 17 7M7 7h10v10',
 '→':'M5 12h14m-6-6 6 6-6 6',
 '←':'M19 12H5m6-6-6 6 6 6',
 '↓':'M12 5v14m-6-6 6 6 6-6',
 '↑':'M12 19V5m-6 6 6-6 6 6',
}
def arrow(char):
 return '<svg class="vector-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="'+PATHS[char]+'"/></svg>'
def vectorize(markup):
 parts=re.split(r'(<[^>]+>)',markup);skip=0
 for i,part in enumerate(parts):
  if part.startswith('<'):
   if re.match(r'<(?:svg|script|style)\b',part):skip+=1
   elif re.match(r'</(?:svg|script|style)\s*>',part):skip=max(0,skip-1)
  elif not skip:
   for char in PATHS:part=part.replace(char,arrow(char))
   parts[i]=part
 return ''.join(parts)
