const menu=document.querySelector('.menu-toggle');const nav=document.querySelector('nav');
const servicesToggle=document.querySelector('.services-toggle');const servicesSubmenu=document.querySelector('#services-submenu');const servicesGroup=document.querySelector('.nav-services');
function closeServices(){servicesToggle.setAttribute('aria-expanded','false');servicesSubmenu.hidden=true;}
servicesToggle.addEventListener('click',()=>{const open=servicesToggle.getAttribute('aria-expanded')!=='true';servicesToggle.setAttribute('aria-expanded',String(open));servicesSubmenu.hidden=!open;});
document.addEventListener('click',e=>{if(!servicesGroup.contains(e.target))closeServices();});
servicesGroup.addEventListener('focusout',e=>{if(!servicesGroup.contains(e.relatedTarget))closeServices();});
const mobileMenu=matchMedia('(max-width:1100px)');
const menuBackground=[...document.querySelectorAll('main,footer,.floating-contact')];
function setMenu(open){
 nav.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);document.documentElement.classList.toggle('menu-open',open);
 menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
 menuBackground.forEach(el=>el.inert=open);
 if(!open)closeServices();
}
function closeMenu(){setMenu(false);}
menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
mobileMenu.addEventListener('change',()=>{if(!mobileMenu.matches)closeMenu();});
document.addEventListener('keydown',e=>{
 if(e.key!=='Tab'||!document.body.classList.contains('menu-open'))return;
 const controls=[...document.querySelector('header').querySelectorAll('a,button')].filter(el=>el.getClientRects().length&&!el.closest('[hidden]'));
 const first=controls[0],last=controls[controls.length-1];
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
});
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
