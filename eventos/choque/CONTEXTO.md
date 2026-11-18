# CHOQUE · SLT × MTY — contexto para seguir en Claude Code local

Pega este archivo (o pídele a Claude que lo lea) para retomar el trabajo donde quedó.

## El encargo

Flyer e identidad visual para un evento en Saltillo con dos bandas de Monterrey y dos de Saltillo.

**Bandas**
- Cenicero — Saltillo (SLT)
- Nova Doler — Saltillo (SLT)
- Adobes Buenos — Monterrey (MTY)
- acordeacorde — Monterrey (MTY)

**Horarios**
- Puertas: 6:00 PM
- Bazar: 7:00 – 11:00 PM (**aún no confirmado**)

**Lugar:** Beer Therapy — Blvd. Eulalio Gutiérrez Treviño 1905, local 8, Los Tulipanes, 25275, Saltillo, Coah.

**Idea del usuario:** "dos mundos chocando".

**Referencias que pasó (imágenes, no están en el repo):**
1. Carteles de cine checos: tipografía caligráfica enorme y rotada, fondo verde oscuro / naranja con textura de spray y mancha.
2. "Park Golf" (Tokio): letras de distintos tamaños entremezcladas, recuadros negros rotados con letras blancas encima de la tipografía principal.
3. "Decompose": fondo partido en dos colores (rojo / gris), letras isométricas que se rompen en fragmentos con estelas finas.
4. "Duality in Harmony": póster partido verticalmente en dos mundos; la palabra central cruza la división y cambia de tipografía y color de un lado a otro.

## Lo que se hizo

**Concepto: CHOQUE · SLT × MTY** ("CHOQUE" es nombre provisional, propuesto por Claude).

Dos mundos separados por una **falla roja diagonal** (nunca vertical):

| | Saltillo (izquierda) | Monterrey (derecha) |
|---|---|---|
| Fondo | Adobe `#E08A2C` con mancha `#C8641F`, spray y grano | Acero `#0C0C0C` con retícula técnica tenue y grano |
| Tinta | Huizache `#1D2B22` | Hueso `#ECE9E2` |
| Tipografía | Fraunces itálica (SOFT 100, WONK 1, 700–800) con borde de tinta irregular | Archivo condensada (wdth 62, wght 850) / ancha para el logotipo |
| Contenido | Cenicero, Nova Doler, lugar y dirección | Adobes Buenos, acordeacorde, fecha y horarios |

- Rojo `#C0212B` = la chispa: la línea de la falla y un círculo con "×".
- Mono para datos: IBM Plex Mono (horarios, dirección, coordenadas).
- **Regla principal:** todo lo que cruza la falla cambia de mundo. "CHOQUE" se dibuja dos veces con el mismo ancho (`textLength`): mitad Fraunces verde, mitad Archivo hueso, con un pequeño desfase. Los nombres de bandas cambian de color al cruzar.
- Esquirlas (fragmentos con estelas) saltan de la falla: negro/rojo caen en Saltillo, naranja/hueso en Monterrey. Usan PRNG con semilla, así salen igual en cada export.
- Negro/hueso/rojo vienen de la identidad de acordeacorde (ver `styles.css` del sitio).

## Archivos

- `eventos/choque/flyer.html` — todo el diseño (SVG generado con JS). Los datos editables están en el objeto `EV` al inicio del `<script>`.
  - Formatos: `?f=post` (1080×1350), `?f=story` (1080×1920), `?f=cuadro` (1080×1080), `?f=identidad` (1920×1200, hoja de identidad).
  - Cada formato es una función (`post()`, `story()`, `cuadro()`, `identidad()`) con coordenadas a mano.
- `eventos/choque/exportar.js` — exporta los 4 formatos a PNG con Playwright.
- `eventos/choque/export/` — PNGs exportados (1x y @2x). `.gitignore` tiene la excepción `!eventos/**/export/*.png`.

**Exportar** (requiere `npm i playwright` y `npx playwright install chromium` en local; necesita internet para cargar Google Fonts):
```bash
node eventos/choque/exportar.js
```
```bash
node eventos/choque/exportar.js 2
```

## Pendientes

- [ ] **Fecha real**: en el flyer dice `SÁB 00 · MES` (campo `EV.fecha`).
- [ ] Confirmar el bazar; si sigue pendiente, poner `EV.bazarNota = "por confirmar"`.
- [ ] Precio / cover (no se dio; no aparece).
- [ ] Confirmar o cambiar el nombre "CHOQUE" (`EV.titulo`).
- [ ] Ideas ofrecidas: más intensidad en el choque (más esquirlas, letras rotas en recuadros como "Park Golf"), versión para imprimir (tamaño carta/tabloide, CMYK, rebase).

## Rama

Todo está en `claude/epic-meitner-oexwjt` del repo `acordeacorde/acordeacorde`:
```bash
git fetch origin claude/epic-meitner-oexwjt && git checkout claude/epic-meitner-oexwjt
```
