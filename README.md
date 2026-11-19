# Amélie's Handicrafts 🧶 · Portafolio de creaciones

Sitio web del taller de crochet de **Amélie** — amigurumis, ramos eternos, aretes y llaveros tejidos a mano.
Publicado en **GitHub Pages**: se actualiza solo cada vez que se sube una foto nueva.

## ✨ Cómo añadir una foto nueva (lo único que hay que hacer)

1. Coloca el archivo `.jpg` dentro de la carpeta de su categoría en `fotos/`:
   - `fotos/amigurumis/` → muñecos rellenos
   - `fotos/ramos/` → ramos y flores
   - `fotos/aretes/` → pendientes
   - `fotos/llaveros/` → colgantes de llaves
   - `fotos/gorros/` → gorros para bebés y mascotas
   - `fotos/bolsos/` → bolsos tejidos
   - ¿Categoría nueva? → crea `fotos/<nueva>/` y ya aparece en el sitio
2. Sube el cambio (en GitHub: *Add file → Upload files*).

Eso es todo: el catálogo se regenera y publica automáticamente en 1–2 minutos.

## 📝 Opcional: título y descripción bonitos

Sin tocar nada, la foto toma como título su nombre de archivo
(`mi-gatito.jpg` → «Mi gatito»). Si quieres un título y una descripción
bonitos, añade una entrada en **`contenido.json`** (es solo texto, no es código):

```json
"mi-gatito.jpg": {
  "titulo": "Gatito dormilón",
  "descripcion": "Michi de lana gris con patitas rosadas, listo para adoptarse.",
  "orden": 19
}
```

Los datos de contacto (Instagram / WhatsApp / Correo) también se llenan en
`contenido.json`, dentro de `"contacto"`.

## 🤖 Para asistentes de IA

La guía completa de mantenimiento está en **`GUIA_IA.md`**: qué se puede
editar, qué no se debe tocar y cómo funciona el despliegue automático.

---
Hecho con amor, hilo y paciencia · Amélie's Handicrafts · 2026
