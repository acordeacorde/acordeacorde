# acordeacorde — sitio oficial

Sitio estático (HTML + CSS + JS). No necesita build ni dependencias y funciona en GitHub Pages.

| Archivo | Qué hay |
|---|---|
| `contenido.js` | **Lo único que hay que editar**: enlaces, lanzamientos, funciones, merch y archivo. |
| `index.html` | Estructura y textos fijos. |
| `styles.css` | Diseño. |
| `main.js` | Interacción: intro, letras animadas, lista de música, tira de fotos y menú. |
| `assets/brand/` | Logo, favicon, textura de papel e imagen para compartir (OG). |
| `assets/img/` | Fotos optimizadas (AVIF y WebP). |
| `herramientas/optimizar_fotos.py` | Convierte fotos nuevas al formato del sitio. |

## Agregar fotos

```
python3 herramientas/optimizar_fotos.py material/foto1.jpg material/foto2.jpg
```

El script imprime líneas listas para pegar en `archivo` dentro de `contenido.js`. Todas aparecen en la tira de **En vivo**; las que lleven `portada: true` rotan en el inicio.

## Reproductores

En Spotify: *Compartir → Insertar*. Copia la URL `https://open.spotify.com/embed/...` en `spotifyEmbed` del lanzamiento. El reproductor se carga al abrir el lanzamiento.

## Ver en local

```
python3 -m http.server
```
