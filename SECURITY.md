# Seguridad de SABATER Ingeniería

Revisión: 2026-10-07. Alcance: código estático, dependencias, compilación y publicación en GitHub Pages. Referencia: [OWASP Top 10:2025](https://top10.owasp.org/2025/). No es una certificación ni una garantía de ausencia de vulnerabilidades.

## Controles activos y alcance por categoría

| OWASP 2025 | Tratamiento en este sitio |
| --- | --- |
| A01 Control de acceso | No hay cuentas, administración, base de datos ni API privada. El artefacto público contiene solo recursos alcanzables, nunca el repositorio completo. La protección de la cuenta GitHub y las reglas de rama son controles del propietario, no se infieren como habilitados. |
| A02 Configuración | CSP por página: scripts y conexiones del mismo origen, JSON-LD con hash SHA-256, bloqueo de scripts inline, eventos HTML, frames, objetos y envíos de formularios. Referencia strict-origin-when-cross-origin. GitHub Pages limita las cabeceras HTTP configurables. |
| A03 Cadena de suministro | Dependencias exactas, lockfile con integridad, instalación sin scripts, acciones fijadas a SHA, Dependabot semanal, auditoría npm que bloquea publicación ante cualquier severidad conocida y validación de pull requests sin permisos de escritura. |
| A04 Criptografía | Recursos propios por HTTPS, sin contraseñas ni datos personales almacenados. No se introducen secretos en JavaScript. |
| A05 Inyección | Sin consultas SQL ni plantillas alimentadas por solicitudes. Contenido compilado, JSON-LD escapado y autorizado por hash; datos del formulario no se insertan como HTML. Comprobaciones de URLs y eventos inline. |
| A06 Diseño inseguro | Formulario demo sin transporte ni almacenamiento y CSP form-action none. Activar recepción exige revisión explícita del backend. |
| A07 Autenticación | No aplica a una web pública sin cuentas. El acceso al repositorio y hosting debe protegerse con MFA por sus administradores. |
| A08 Integridad | Compilación reproducible desde versiones exactas y lockfile, dependencias locales y comprobaciones antes de publicar; no hay scripts de CDN. |
| A09 Registro y alertas | GitHub Actions conserva los resultados de build, comprobaciones y auditoría. Dependabot aporta avisos de dependencias. No hay registro de consultas porque no existe receptor; al conectarlo se requieren registros mínimos sin datos sensibles. |
| A10 Excepciones | El 3D tiene captura estática durante carga y ante fallos de importación/WebGL; los controles se habilitan solo al estar listo. Los fallos de compilación, rutas, CSP o dependencias detienen la publicación. |

`style-src unsafe-inline` permanece por estilos calculados de las animaciones. Los scripts no permiten unsafe-inline ni unsafe-eval. Una CSP en meta no sustituye todas las cabeceras de un servidor.

## Antispam y formulario

La demo no recibe, transmite ni guarda consultas. No se puede afirmar que haya un filtro antispam de servidor activo. Destinatario confirmado para la futura integración: hola@sabater.com.ar.

Antes de activar recepción en el hosting definitivo:

- Validar campos, longitudes, tipos y tamaño total en el servidor; rechazar CR/LF en direcciones y cabeceras. Remitente fijo del dominio, correo validado solo como Reply-To.
- Límites de frecuencia por origen y globales, con ventanas y expiración; evitar guardar IP completas más tiempo del necesario.
- Campo señuelo, tiempo mínimo de envío y verificación de origen/token. El frontend por sí solo no es protección.
- Desafío antibot con verificación servidor, si el volumen lo justifica; secretos solo en variables de entorno, nunca en el repositorio.
- Respuesta genérica y control de duplicados; reintentos limitados. Logs mínimos, monitorización de rechazos y de errores de entrega, sin cuerpos de mensajes.
- SMTP autenticado, SPF/DKIM/DMARC comprobados para el remitente. Limitar adjuntos o no admitirlos.
- Probar envíos legítimos y automatizados antes de cambiar la CSP form-action none.

## Hosting definitivo

Configurar y comprobar en respuestas HTTPS reales: CSP HTTP (incluyendo frame-ancestors 'none'), X-Content-Type-Options: nosniff, Referrer-Policy, Permissions-Policy y HSTS adecuado. No habilitar includeSubDomains/preload sin auditar todos los subdominios. Estos controles no se presentan como activos en GitHub Pages.

Mantener la demo noindex. Al publicar el dominio aprobado, regenerar SITE_URL y SITE_INDEXABLE=true, comprobar canónicas, sitemap, robots, formulario y cabeceras. llms.txt y llms-full.txt ayudan a descubrir contenido, no garantizan indexación ni citas por IA.

## Comprobaciones

npm run build; npm run check; npm run check:security; npm audit --audit-level=low; npm run prepare:site.

La revisión de secretos comprueba patrones comunes en archivos versionados, no todo el historial ni las cuentas externas. Si se descubre una credencial publicada, revocarla, no solo borrar el archivo. Reportar incidentes por un canal privado con el responsable del proyecto.
