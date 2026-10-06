# SABATER Ingeniería — Demo web

Home y cuatro landings: acústica industrial, acústica arquitectónica, acústica legal y mantenimiento predictivo por análisis de vibraciones.

Sitio estático con HTML semántico, CSS responsive y JavaScript progresivo y Three.js para la escena 3D. Contenido e imágenes basados en el material suministrado por el cliente. Paleta grafito, marfil y azul técnico; logos aprobados y matriz de uso respetada. No incluye documentos internos del cliente.

## Desarrollo

- Editar `content.json` y `scripts/build.py`; ejecutar `npm ci --ignore-scripts` y `npm run build` para regenerar HTML.
- Editar `styles.css` y `app.js` para presentación e interacción.
- Ejecutar `python -m http.server 4173` para previsualizar.
- Ejecutar `python scripts/check.py` para validar rutas y estructura.

## Publicación

GitHub Actions compila, valida y audita las dependencias antes de publicar únicamente HTML, CSS, JS y assets en GitHub Pages. La demo usa rutas relativas compatibles con subcarpetas. Se mantiene noindex hasta aprobación.

## Límites de demo

El formulario valida datos pero no transmite ni guarda información. WhatsApp y teléfono utilizan +54 11 3322-7832. LinkedIn muestra un aviso de dato pendiente. Ver `PENDIENTES.md`. Las fotografías ilustrativas provienen del banco aportado por el cliente, incluidos sus recursos IA; no se presentan como casos de obra reales. Los logos indican trayectoria profesional, no contratos vigentes.

## Diseño y movimiento

La capa premium.css/premium.js incorpora entrada tipográfica, parallax de portada, revelado progresivo, tarjetas con profundidad, barra de lectura y respuesta sutil al puntero. Respeta prefers-reduced-motion y conserva el scroll nativo. La demo sigue siendo estática: la integración con WordPress y blog administrable corresponde a una segunda etapa.

## Laboratorio 3D e ilustraciones técnicas

La portada incorpora `assets/vibration-lab.inc`, CSS y módulo JS propio. Three.js 0.186.1 se sirve localmente desde `assets/vendor/`, con licencia MIT incluida; solo se carga al acercarse a la sección. El motor y sus piezas son geometría procedural propia, no un modelo de equipo comercial. Los tres estados explican transmisión, aislamiento y despiece; no son resultados calculados ni una predicción de rendimiento.

Render suspendido fuera de pantalla y con la pestaña oculta. Movimiento reducido conserva controles y vistas estáticas. Sin WebGL se mantiene una fotografía y la explicación de los tres estados. Giro por arrastre horizontal o botones accesibles. `technical-*.svg` y `signal-explorer.inc` contienen las ilustraciones isométricas y los gráficos explicativos propios.


## SEO, IA y dominio definitivo

`site-config.json` centraliza la URL canónica y la indexación. La demo permanece **noindex,nofollow** y `robots.txt` bloquea el rastreo por decisión del cliente. No enviar su sitemap a buscadores.

Al aprobar el dominio definitivo: cambiar `url` por su URL HTTPS real, cambiar `indexable` a `true` y ejecutar `npm run build`. También pueden usarse `SITE_URL` y `SITE_INDEXABLE=true` en el entorno de compilación. Se regeneran canónicas, Open Graph, Organization, WebSite, WebPage, Service, BreadcrumbList, FAQPage, sitemap y robots. No habilitar indexación antes de conectar/verificar el formulario y confirmar los datos del cliente.

El contenido comercial, servicios y preguntas frecuentes se entrega en HTML, sin depender de JavaScript. `llms.txt` es un resumen público complementario; no garantiza inclusión o citas en respuestas de IA. No se inventan reseñas, certificaciones ni casos de éxito para los datos estructurados.

## Rendimiento y mantenimiento

- Fotos WebP en 640, 1024 y hasta 1600 px con `srcset`, dimensiones correctas y carga diferida. Los originales se preservan.
- Fuentes variables WOFF2 locales y CSS combinado/minificado en `assets/site.min.css`.
- Three.js y su cargador HDR se compilan localmente desde versiones exactas en `package-lock.json`; no se depende de un CDN al navegar.
- La escena de laboratorio solo se referencia en la home; el motor se importa cerca de la sección. Render suspendido fuera de vista, pestaña oculta y soporte para movimiento reducido.
- Para actualizar dependencias: revisar cambios de versión, regenerar con `npm run build`, validar con `npm run check`, comprobar visualmente escenas/controles y ejecutar `npm audit` antes de publicar.
- Dependabot propone revisiones semanales para npm y GitHub Actions; las acciones están fijadas a commits oficiales.

Ver `SECURITY.md` para las protecciones aplicadas y las tareas específicas del hosting definitivo.
