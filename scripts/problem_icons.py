"""Decorative technical illustrations, with a static base and animated accent."""
def path(d): return '<path d="'+d+'"/>'
def circle(x,y,r): return f'<circle cx="{x}" cy="{y}" r="{r}"/>'
DOC=path('M18 9h21l9 9v36H18ZM39 9v11h9M25 28h16M25 35h10')
ROOM=path('M12 52V16h40v36M32 16v36M12 52h40')
MOTOR=path('M13 23h33v24H13ZM19 23v-7h18v7M46 29h8v12h-8M17 47v6M42 47v6M9 53h40M20 28v14M26 28v14M32 28v14')
WAVE=path('M9 34h9l5-10 7 22 7-30 6 18h12')
ICONS={
'industrial':[
 (path('M10 49V28l12-9 12 9v21M17 49V37h10v12M7 49h32'),path('M41 24q12 9 0 18M46 18q19 15 0 30'),'ripple'),
 (path('M25 43c0-8-11-9-11-20a17 17 0 0 1 34 0c0 12-10 14-10 24s-7 13-14 10M26 24a6 6 0 0 1 12 0c0 5-8 7-8 13'),path('M50 18q9 9 0 18'),'ripple'),
 (MOTOR,path('M44 9h12M50 3v12'),'lift'),
 (circle(32,32,8)+path('M12 12l14 14M38 38l14 14M12 52l14-14M38 26l14-14'),circle(10,10,3)+circle(54,10,3)+circle(10,54,3)+circle(54,54,3),'pulse'),
 (path('M10 17h44v34H10ZM16 23h32M16 29h14M16 35h9'),path('M34 33l13 13M47 33 34 46'),'draw'),
 (path('M10 11v43h45M19 46V34M31 46V27M43 46V19'),path('M17 26 30 17 44 10M36 10h8v8'),'lift')],
'arquitectonica':[
 (ROOM,path('M19 29q10 6 0 12M45 29q-10 6 0 12'),'ripple'),
 (path('M10 15v39h44V15M17 15h30'),path('M19 28q26-18 26 4t-26 4q26-18 26 4'),'ripple'),
 (path('M27 12v42M35 12v42M27 20h8M27 30h8M27 40h8M27 50h8'),path('M7 26h5l4 12 5-20M41 30h5l4 4h7'),'draw'),
 (path('M12 11h40v42H12ZM12 20h40M18 15h2M24 15h2')+circle(32,36,4),path('M32 23c10 0 13 9 4 10M45 37c0 10-10 13-11 3M30 49c-10 0-13-10-3-11M19 35c0-10 10-13 11-3'),'turn'),
 (path('M9 44 32 55 55 44M9 34 32 45 55 34M9 24 32 35 55 24 32 13Z'),path('M24 23l6 5 12-10'),'draw'),
 (ROOM,path('M39 39l15 15')+circle(34,34,9),'shift')],
'legal':[
 (path('M10 48V26l12-9 12 9v22M17 48V36h10v12M8 48h29'),path('M43 19q14 12 0 25M40 46l4 4 9-10'),'ripple'),
 (path('M32 10v43M20 54h24M14 22h36M18 22 9 39h18ZM46 22 37 39h18Z'),circle(32,18,4)+path('M26 46h12'),'pulse'),
 (DOC,path('M28 44l6 6 14-14'),'draw'),
 (path('M10 51V32h11V21h12v30M33 30h13v21M7 51h45'),path('M43 14q13 9 7 23M38 19q8 6 4 15'),'ripple'),
 (path('M15 9h33v46H15M22 18h18M22 26h10M22 34h10M22 42h10'),path('M36 26l3 3 7-8M36 42l3 3 7-8'),'draw'),
 (DOC,path('M39 33 52 54H26ZM39 40v6')+circle(39,50,0.8),'pulse')],
'predictivo':[
 (circle(32,32,21)+circle(32,32,5)+path('M32 11v5M32 48v5M11 32h5M48 32h5'),path('M32 17a15 15 0 0 1 15 15')+circle(42,22,3),'turn'),
 (path('M7 22h19v16H7M38 28h19v16H38M26 30h7M33 36h5'),path('M9 49h17M38 17h17M32 15v8M32 43v8'),'shift'),
 (circle(32,32,22)+circle(32,32,9),''.join(circle(x,y,3) for x,y in [(32,16),(46,24),(46,40),(32,48),(18,40),(18,24)]),'turn'),
 (path('M10 45h44v8H10M15 45V21h34v24M22 21v-7h20v7'),path('M25 28h14v10H25ZM7 33h5M52 33h5'),'shift'),
 (path('M8 52h48M12 12v40'),WAVE,'draw'),
 (path('M9 12v42h46M17 45h35M17 34h35M17 23h35'),path('M17 43 25 36 33 38 42 25 52 16')+circle(52,16,3),'draw')]
}

def problem_icon(key,index):
 base,accent,motion=ICONS[key][index]
 return '<svg class="problem-glyph motion-'+motion+'" viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><g class="glyph-base">'+base+'</g><g class="glyph-accent">'+accent+'</g></svg>'
