# Seguridad de SABATER Ingeniería

Revisión técnica: 2026-10-06.

## Controles aplicados

- Sitio estático sin base de datos, autenticación ni endpoint de recepción de formularios.
- Formulario demo con POST, interceptado localmente; CSP `form-action none` impide envíos accidentales incluso sin JavaScript. No guarda ni transmite los campos.
- Content Security Policy por página: scripts y conexiones del propio origen; JSON-LD autorizado mediante hash SHA-256; bloqueo de plugins, bases HTML externas y envíos de formularios. No se permite eval ni JavaScript inline ejecutable. Se conserva `style-src unsafe-inline` porque las ilustraciones y animaciones utilizan estilos calculados.
- Política de referencia `strict-origin-when-cross-origin`, enlaces externos con protección contra opener y recursos servidos localmente por HTTPS.
- Dependencias exactas y auditables mediante npm; motor Three.js 0.186.1 y cargador HDR correspondiente. Licencias preservadas. Acciones de CI fijadas a SHA, instalación sin scripts de terceros y auditoría automática antes de publicar.
- El despliegue copia únicamente los archivos del sitio y assets, no el contenido interno del workspace ni node_modules.

## Límites y producción

Una auditoría sin hallazgos conocidos no garantiza ausencia de vulnerabilidades. Repetir revisiones cuando cambien dependencias, formularios o alojamiento.

GitHub Pages administra HTTPS, compresión y caché; este repositorio no configura cabeceras HTTP arbitrarias de ese servicio. La CSP actual se aplica mediante meta HTML. En el hosting definitivo configurar además las cabeceras HTTP CSP (incluyendo `frame-ancestors`), X-Content-Type-Options, Permissions-Policy y la política HTTPS/HSTS apropiada para el dominio. Verificar las respuestas reales antes de dar esos controles por activos. No activar HSTS para todos los subdominios sin comprobarlos.

Al conectar el formulario: sustituir explícitamente la restricción form-action, validar en servidor, limitar tasas y tamaños, protección antispam, no incrustar credenciales en frontend y comprobar el tratamiento de datos. La demo actual no implementa dicho backend.

Para avisos de seguridad, usar el canal privado con el responsable del sitio; no publicar secretos en issues.
