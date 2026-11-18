# GUIA PARA IA · Mantener el portafolio web de «Amélie's Handicrafts 🧶»

> **Para quién es esto:** cualquier asistente de inteligencia artificial (o persona)
> que reciba este repositorio y la petición «añade esta foto al portafolio».
> Con leer esta guía basta — **no hace falta tocar ni una línea de código.**

---

## 1. Qué es este sitio

- **Marca:** Amélie's Handicrafts 🧶 — taller de crochet hecho a mano.
- **Alojamiento:** GitHub Pages, gratuito. La dirección es del tipo
  `https://<usuario>.github.io/amelies-handicrafts/`.
- **Publicación:** automática. Cada vez que se sube un cambio a la rama `main`,
  el flujo `.github/workflows/publicar.yml` regenera el catálogo y vuelve a
  publicar el sitio (1–2 minutos).
- **Filosofía:** las fotos viven en carpetas por categoría y el catálogo
  (`datos.json`) se genera solo. **Añadir contenido = añadir archivos; jamás
  editar código.**

## 2. Mapa del repositorio

```
index.html        ← estructura del sitio        (NO EDITAR salvo petición expresa)
estilos.css       ← diseño y colores             (NO EDITAR salvo petición expresa)
app.js            ← motor que monta la galería  (NO EDITAR salvo petición expresa)
ovillo.svg        ← ícono de pestaña             (NO EDITAR)
contenido.json    ← ✏️ TÍTULOS, DESCRIPCIONES Y CONTACTO (se puede editar)
fotos/            ← 📷 LAS FOTOS, en carpetas por categoría (aquí se añade)
  ├─ amigurumis/
  ├─ ramos/
  ├─ aretes/
  └─ llaveros/
datos.json        ← generado automáticamente por herramientas/generar.py (NO EDITAR)
herramientas/generar.py   ← regenera datos.json (NO EDITAR)
.github/workflows/publicar.yml  ← publicación automática (NO EDITAR)
GUIA_IA.md        ← esta guía
README.md         ← resumen para humanos
```

## 3. AÑADIR UNA FOTO NUEVA (caso normal)

**Paso 1.** Copiar la imagen a la carpeta de su categoría:

- Muñeco relleno → `fotos/amigurumis/`
- Ramo o flor → `fotos/ramos/`
- Pendiente/arete → `fotos/aretes/`
- Colgante de llaves → `fotos/llaveros/`
- Categoría nueva → crear carpeta `fotos/<nombre-nuevo>/` (minusculas, sin
  acentos ni espacios; usa guiones: `bolsos`, `patucos`…). El sitio la
  mostrará automáticamente.

**Paso 2.** Subir el cambio (commit en `main`).

**Paso 3.** Nada más. El flujo de trabajo regenera el catálogo y publica.
La foto aparece en la galería con:
- **Título** = su nombre de archivo convertido: `mi-gatito.jpg` → «Mi gatito».
  (Usa nombres de archivo limpios y sin acentos.)
- **Descripción** = vacía hasta que alguien la escriba (opcional, ver §4).

**Reglas de oro para los archivos de foto:**
- Formatos admitidos: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`.
- Nombres en minúsculas, sin espacios ni acentos, con guiones
  (`ramo-girasoles.jpg`, NO `Ramo Girasoles (2).JPG`).
- Un nombre de archivo no puede repetirse entre carpetas (el generador avisa
  si pasa). Renombra en caso de duda: `ramo-2.jpg`, `ramo-3.jpg`…
- Orientación: la rejilla recorta al formato 4:5 con `object-fit: cover`;
  se ven bien tanto verticales como cuadradas.

## 4. OPCIONAL · Poner título y descripción bonitos

Editar **`contenido.json`** (solo texto; jamás el HTML/CSS/JS). En la sección
`"fotos"` añadir, usando como clave el **nombre exacto del archivo**:

```json
"mi-gatito.jpg": {
  "titulo": "Gatito dormilón",
  "descripcion": "Michi de lana gris con patitas rosadas, listo para adoptarse.",
  "orden": 19
}
```

- `titulo` (texto): nombre con el que se muestra.
- `descripcion` (texto): 1–2 frases para el visor ampliado.
- `orden` (número): posición dentro de su categoría (opcional; si falta, la
  foto va al final).

También en `contenido.json`:
- `"contacto"` → llenar `"Instagram"`, `"WhatsApp"` o `"Correo"` con los datos
  reales; aparecerán en la tarjeta final del sitio (si están vacíos se muestran
  las líneas punteadas como en el PDF original).
- `"orden_categorias"` → número de orden de cada sección en la galería.
- `"categorias"` → nombre visible, subtítulo, dato y nota de cada categoría
  (útil al estrenar una carpeta nueva).
- `"destacados"` → hasta 3 nombres de archivo que salen en la portada.

## 5. Crear una CATEGORÍA nueva

1. Crear la carpeta `fotos/<nuevo>/` y poner dentro su primera foto.
2. (Opcional, recomendado) añadir en `contenido.json`:
   - en `"categorias"`: `"<nuevo>": {"nombre": "Nombre bonito", "subtitulo": "...", "dato": "...", "nota": "..."}`
   - en `"orden_categorias"`: su posición (5, 6…).
3. Subir. La sección aparece sola en la navegación y la galería.

## 6. Despliegue y verificación

- Al subir a `main`, GitHub Actions ejecuta `publicar.yml`: copia el sitio a
  `_sitio/`, ejecuta `herramientas/generar.py _sitio/datos.json` (escanea
  `fotos/`, aplica `contenido.json`) y despliega.
- Ver estado: pestaña **Actions** del repositorio. Verde = publicado.
- Si algo falla: revisar que la foto esté dentro de una carpeta de categoría
  y que `contenido.json` siga siendo JSON válido (comas, llaves, comillas).
- Se puede forzar una re-publicación manual: **Actions → Publicar portafolio →
  Run workflow**.

## 7. Estética (por si se pide un cambio de diseño)

Paleta y tipografías se mantienen idénticas al PDF original de la marca:
crema `#faf5ee`, arena `#f4ead9`, terracota `#b06a56`, terracota claro
`#d9967f`, rosa pétalo `#eec9bd`, marrón texto `#4a352c`, líneas `#e6d7c1`;
tipografías **Playfair Display** (títulos) y **Nunito** (texto); adornos SVG
de ovillos, ganchillos, flores y corazones. Cualquier cambio de estilo debe
respetar esta identidad visual y editarse solo en `estilos.css`.

## 8. Lo que NO se debe hacer

- ❌ No editar `index.html`, `estilos.css`, `app.js`, `herramientas/generar.py`
  ni `.github/workflows/*` para añadir fotos (no hace falta y rompe el flujo).
- ❌ No editar `datos.json` a mano: se regenera solo.
- ❌ No subir fotos sueltas en la raíz ni dentro de `herramientas/`: solo en
  `fotos/<categoría>/`.
- ❌ No usar acentos/espacios en nombres de archivo.
- ❌ No poner comas finales en `contenido.json` (rompe el JSON).

## 9. Resumen en una línea

**Nueva foto = arrastrar el .jpg a `fotos/<categoría>/` y subir el cambio;
título/descripción bonitos = opcional en `contenido.json`. Nada más.**
