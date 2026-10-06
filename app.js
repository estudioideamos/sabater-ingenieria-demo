const menu=document.querySelector('.menu-toggle');const nav=document.querySelector('nav');
const servicesToggle=document.querySelector('.services-toggle');const servicesSubmenu=document.querySelector('#services-submenu');const servicesGroup=document.querySelector('.nav-services');
function closeServices(){servicesToggle.setAttribute('aria-expanded','false');servicesSubmenu.hidden=true;}
servicesToggle.addEventListener('click',()=>{const open=servicesToggle.getAttribute('aria-expanded')!=='true';servicesToggle.setAttribute('aria-expanded',String(open));servicesSubmenu.hidden=!open;});
document.addEventListener('click',e=>{if(!servicesGroup.contains(e.target))closeServices();});
servicesGroup.addEventListener('focusout',e=>{if(!servicesGroup.contains(e.relatedTarget))closeServices();});
function closeMenu(){closeServices();nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Menú: abrir navegación');}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Menú: cerrar navegación':'Menú: abrir navegación');});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!servicesSubmenu.hidden){closeServices();servicesToggle.focus();}else if(nav.classList.contains('open')){closeMenu();menu.focus();}}});
const dialog=document.querySelector('#pending-dialog');document.querySelectorAll('[data-pending]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#pending-title').textContent=b.dataset.pending;dialog.showModal();}));
dialog.querySelectorAll('.dialog-close,.dialog-done').forEach(b=>b.addEventListener('click',()=>dialog.close()));dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
const form=document.querySelector('#contact-form');form.addEventListener('submit',e=>{e.preventDefault();document.querySelector('#form-status').textContent='La consulta está completa. Esta es una demostración: no se ha enviado ningún mensaje. El envío se habilitará al conectar el formulario definitivo.';});
