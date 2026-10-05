# SABATER Ingeniería — Demo web

Home y cuatro landings: acústica industrial, acústica arquitectónica, acústica legal y mantenimiento predictivo por análisis de vibraciones.

Sitio estático con HTML semántico, CSS responsive y JavaScript progresivo y Three.js para la escena 3D. Contenido e imágenes basados en el material suministrado por el cliente. Paleta grafito, marfil y azul técnico; logos aprobados y matriz de uso respetada. No incluye documentos internos del cliente.

## Desarrollo

- Editar `content.json` y `scripts/build.py`; ejecutar `python scripts/build.py` para regenerar HTML.
- Editar `styles.css` y `app.js` para presentación e interacción.
- Ejecutar `python -m http.server 4173` para previsualizar.
- Ejecutar `python scripts/check.py` para validar rutas y estructura.

## Publicación

GitHub Actions publica únicamente HTML, CSS, JS y assets en GitHub Pages. La demo usa rutas relativas compatibles con subcarpetas. Se mantiene noindex hasta aprobación.

## Límites de demo

El formulario valida datos pero no transmite ni guarda información. WhatsApp y teléfono utilizan +54 11 3322-7832. LinkedIn muestra un aviso de dato pendiente. Ver `PENDIENTES.md`. Las fotografías ilustrativas provienen del banco aportado por el cliente, incluidos sus recursos IA; no se presentan como casos de obra reales. Los logos indican trayectoria profesional, no contratos vigentes.

## Diseño y movimiento

La capa premium.css/premium.js incorpora entrada tipográfica, parallax de portada, revelado progresivo, tarjetas con profundidad, barra de lectura y respuesta sutil al puntero. Respeta prefers-reduced-motion y conserva el scroll nativo. La demo sigue siendo estática: la integración con WordPress y blog administrable corresponde a una segunda etapa.

## Laboratorio 3D e ilustraciones técnicas

La portada incorpora `assets/vibration-lab.inc`, CSS y módulo JS propio. Three.js r170 se sirve localmente desde `assets/vendor/`, con licencia MIT incluida; solo se carga al acercarse a la sección. El motor y sus piezas son geometría procedural propia, no un modelo de equipo comercial. Los tres estados explican transmisión, aislamiento y despiece; no son resultados calculados ni una predicción de rendimiento.

Render suspendido fuera de pantalla y con la pestaña oculta. Movimiento reducido conserva controles y vistas estáticas. Sin WebGL se mantiene una fotografía y la explicación de los tres estados. Giro por arrastre horizontal o botones accesibles. `technical-*.svg` y `signal-explorer.inc` contienen las ilustraciones isométricas y los gráficos explicativos propios.
