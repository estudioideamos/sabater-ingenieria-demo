# Blog y futura adaptación a WordPress

El sitio sigue siendo estático. Las notas están en `blog-posts.json`, separadas del diseño. `scripts/blog.py` genera portada, archivo y páginas individuales; `scripts/build.py` las integra con la navegación común.

## Campos y correspondencia

- `title`: título de la entrada (`post_title`).
- `slug`: slug (`post_name`). Mantener `/blog/<slug>/` o implementar redirecciones.
- `excerpt`: extracto editable (`post_excerpt`).
- `category`: categoría de WordPress.
- `date`: fecha de publicación.
- `image`, `alt`: imagen destacada y texto alternativo en la biblioteca multimedia.
- `intro`, `sections`, `takeaway`, `sources`: contenido de la entrada en bloques nativos de Gutenberg: párrafo, encabezado, lista, cita/grupo y enlaces.
- Tiempo de lectura: calculado a 200 palabras/minuto; no se edita manualmente.

## Migración

Crear entradas estándar, sin custom post type ni constructor requerido. Reproducir la plantilla del archivo y de la entrada en el tema; consultar las dos entradas más recientes para la home. Mantener el índice generado desde los H2, el foco de teclado y la adaptación móvil. Los títulos de sección contienen IDs estables. Los archivos WebP ya incluyen variantes de 640 y 1200 px; dejar a WordPress generar su srcset al importar los originales.

`python scripts/export-blog.py` genera `wordpress/blog-import.xml`: borradores importables mediante el importador de WordPress, con contenido Gutenberg, categorías e imágenes destacadas remotas del demo. Revisar y publicar en el WordPress definitivo. La descarga de adjuntos requiere que el demo esté disponible y marcar la opción de importar archivos adjuntos. Cambiar los enlaces hacia las especialidades y el contacto al dominio definitivo durante la migración; los artículos importados mantienen fuentes externas.

No hay panel de administración habilitado en este demo. No se cambia la política noindex del staging.

## Recursos visuales

Imágenes conceptuales generadas con Magnific, modelo Recraft V4.1, el 7 de octubre de 2026. No representan obras ni mediciones reales de SABATER. Exportadas a WebP para la web. Las páginas individuales indican su carácter conceptual.
