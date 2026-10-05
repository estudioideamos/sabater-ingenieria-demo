# SABATER Ingeniería — Demo web

Home y cuatro landings: acústica industrial, acústica arquitectónica, acústica legal y mantenimiento predictivo por análisis de vibraciones.

Sitio estático con HTML semántico, CSS responsive y JavaScript sin dependencias. Contenido e imágenes basados en el material suministrado por el cliente. Paleta grafito, marfil y azul técnico; logos aprobados y matriz de uso respetada. No incluye documentos internos del cliente.

## Desarrollo

- Editar `content.json` y `scripts/build.py`; ejecutar `python scripts/build.py` para regenerar HTML.
- Editar `styles.css` y `app.js` para presentación e interacción.
- Ejecutar `python -m http.server 4173` para previsualizar.
- Ejecutar `python scripts/check.py` para validar rutas y estructura.

## Publicación

GitHub Actions publica únicamente HTML, CSS, JS y assets en GitHub Pages. La demo usa rutas relativas compatibles con subcarpetas. Se mantiene noindex hasta aprobación.

## Límites de demo

El formulario valida datos pero no transmite ni guarda información. WhatsApp y LinkedIn muestran un aviso de dato pendiente. Ver `PENDIENTES.md`. Las fotografías ilustrativas provienen del banco aportado por el cliente, incluidos sus recursos IA; no se presentan como casos de obra reales. Los logos indican trayectoria profesional, no contratos vigentes.

## Diseño y movimiento

La capa premium.css/premium.js incorpora entrada tipográfica, parallax de portada, revelado progresivo, tarjetas con profundidad, barra de lectura y respuesta sutil al puntero. Respeta prefers-reduced-motion y conserva el scroll nativo. La demo sigue siendo estática: la integración con WordPress y blog administrable corresponde a una segunda etapa.

