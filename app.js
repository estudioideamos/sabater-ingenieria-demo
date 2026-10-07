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
const form=document.querySelector('#contact-form');
if(form){
 form.noValidate=true;
 const status=document.querySelector('#form-status');
 const fields=[...form.querySelectorAll('input,select,textarea')];
 fields.forEach(field=>{field.id=field.id||'contact-'+field.name;const error=document.createElement('span');error.className='field-error';error.id=field.id+'-error';error.hidden=true;field.after(error);field.setAttribute('aria-describedby',error.id);});
 function validate(field){
  const error=document.getElementById(field.id+'-error');
  const blank=field.required&&!field.value.trim();
  const invalid=blank||!field.validity.valid;
  error.textContent=invalid?(blank?'Completá este campo.':field.type==='email'?'Ingresá un email válido, por ejemplo nombre@empresa.com.':'Revisá el valor ingresado.'):'';
  error.hidden=!invalid;field.setAttribute('aria-invalid',String(invalid));return !invalid;
 }
 fields.forEach(field=>{field.addEventListener('blur',()=>{if(field.value||field.getAttribute('aria-invalid')==='true')validate(field);});field.addEventListener('input',()=>{status.textContent='';if(field.getAttribute('aria-invalid')==='true')validate(field);});});
 form.addEventListener('submit',e=>{e.preventDefault();const invalid=fields.filter(field=>!validate(field));if(invalid.length){status.textContent='Revisá los campos indicados para completar la consulta.';invalid[0].focus();return;}status.textContent='Consulta completa. Este formulario es una demostración: no se envió ni se guardó ningún dato. Para contactarnos, usá el email, el teléfono o WhatsApp.';status.tabIndex=-1;status.focus();});
}
