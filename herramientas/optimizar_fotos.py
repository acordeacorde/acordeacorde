"""Optimiza fotos para el sitio: genera versiones de 640 px y del ancho
original (máx. 1600) en AVIF y WebP dentro de assets/img/.

Uso:  python3 herramientas/optimizar_fotos.py material/*.jpg
Requiere Pillow 11+ (pip install pillow).
Imprime la línea lista para pegar en contenido.js (sección archivo).
"""
import sys, pathlib, re, unicodedata
from PIL import Image, ImageOps

OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)

def slug(t):
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")

for ruta in sys.argv[1:]:
    p = pathlib.Path(ruta)
    im = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
    if im.width > 1600:
        im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
    nombre = slug(p.stem)
    anchos = sorted({min(640, im.width), im.width})
    for w in anchos:
        r = im if w == im.width else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        r.save(OUT / f"{nombre}-{w}.webp", quality=78, method=6)
        r.save(OUT / f"{nombre}-{w}.avif", quality=55)
    print(f'{{ tipo: "foto", src: "assets/img/{nombre}", anchos: {anchos}, w: {im.width}, h: {im.height}, alt: "", pie: "" }},')
