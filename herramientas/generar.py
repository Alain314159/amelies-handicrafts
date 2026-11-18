#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Herramienta · Regenerar el catálogo del portafolio (datos.json)
==============================================================
Lee las imágenes de fotos/<carpeta-de-categoría>/ y las combina con los
metadatos opcionales de contenido.json para producir datos.json, el único
archivo que el sitio lee para montar toda la galería.

Ejecución:
    python3 herramientas/generar.py                     → escribe datos.json en la raíz
    python3 herramientas/generar.py _sitio/datos.json   → escribe en la ruta indicada

Para AÑADIR una foto nueva NO hace falta tocar nada de esto:
basta con colocar el archivo .jpg dentro de fotos/<categoría>/ y subir el
cambio. Los títulos y descripciones son OPCIONALES: si el archivo no
figura en contenido.json, el título se deduce del nombre del archivo.
"""
import json
import os
import re
import sys

EXTENSIONES = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def titulo_desde_nombre(nombre_archivo):
    """Convierte 'mi-gatito-nuevo.jpg' → 'Mi gatito nuevo' (para fotos sin metadatos)."""
    base = os.path.splitext(os.path.basename(nombre_archivo))[0]
    base = base.replace("-", " ").replace("_", " ")
    base = re.sub(r"\s+", " ", base).strip()
    return base[:1].upper() + base[1:] if base else "Pieza del taller"


def cargar_contenido():
    ruta = os.path.join(RAIZ, "contenido.json")
    if not os.path.isfile(ruta):
        return {}
    with open(ruta, encoding="utf-8") as f:
        return json.load(f)


def escanear_fotos(contenido):
    fotos_dir = os.path.join(RAIZ, "fotos")
    if not os.path.isdir(fotos_dir):
        print("ERROR: no existe la carpeta fotos/")
        sys.exit(1)

    metadatos = contenido.get("fotos", {})
    vistos = {}          # nombre de archivo → categoría (para detectar duplicados)
    categorias = {}

    for slug in sorted(os.listdir(fotos_dir)):
        carpeta = os.path.join(fotos_dir, slug)
        if not os.path.isdir(carpeta):
            continue
        piezas = []
        for nombre in sorted(os.listdir(carpeta)):
            if os.path.splitext(nombre)[1].lower() not in EXTENSIONES:
                continue
            if nombre in vistos and vistos[nombre] != slug:
                print("AVISO: nombre duplicado «%s» (en %s y en %s) — renómbralo." % (nombre, vistos[nombre], slug))
            vistos[nombre] = slug
            meta = metadatos.get(nombre, {})
            piezas.append({
                "archivo": "fotos/%s/%s" % (slug, nombre),
                "titulo": meta.get("titulo") or titulo_desde_nombre(nombre),
                "descripcion": meta.get("descripcion", ""),
                "orden": meta.get("orden", 900),
            })
        if piezas:
            piezas.sort(key=lambda p: (p["orden"], p["archivo"]))
            categorias[slug] = piezas

    if not categorias:
        print("ERROR: fotos/ está vacío (no hay imágenes en carpetas de categoría).")
        sys.exit(1)
    return categorias


def main():
    contenido = cargar_contenido()
    nombres = contenido.get("categorias", {})
    orden_cat = contenido.get("orden_categorias", {})

    categorias_encontradas = escanear_fotos(contenido)

    lista = []
    for slug, piezas in categorias_encontradas.items():
        info = nombres.get(slug, {})
        lista.append({
            "slug": slug,
            "nombre": info.get("nombre", slug.replace("-", " ").capitalize()),
            "subtitulo": info.get("subtitulo", ""),
            "dato": info.get("dato", ""),
            "nota": info.get("nota", ""),
            "orden": orden_cat.get(slug, 900),
            "fotos": piezas,
        })
    lista.sort(key=lambda c: (c["orden"], c["nombre"]))

    total = sum(len(c["fotos"]) for c in lista)
    datos = {
        "total": total,
        "contacto": contenido.get("contacto", {}),
        "destacados": contenido.get("destacados", []),
        "categorias": lista,
    }

    ruta_salida = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(RAIZ, "datos.json")
    os.makedirs(os.path.dirname(ruta_salida) or RAIZ, exist_ok=True)
    with open(ruta_salida, "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)

    print("OK → %s" % ruta_salida)
    for c in lista:
        print("  · %-12s %-14s %2d fotos" % (c["slug"], c["nombre"], len(c["fotos"])))
    print("Total: %d fotos en %d categorías" % (total, len(lista)))


if __name__ == "__main__":
    main()
