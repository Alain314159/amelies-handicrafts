/* ══════════ AMÉLIE'S HANDICRAFTS · MOTOR DEL PORTAFOLIO ══════════
   Lee datos.json (generado automáticamente desde fotos/ + contenido.json)
   y monta: navegación, portada, secciones de galería y visor de fotos.
   Para añadir fotos nuevas NO se toca este archivo: solo se dejan
   los .jpg en fotos/<categoría>/ y se sube el cambio. */

(function () {
  "use strict";

  var DATOS = null;
  var PLANO = []; // lista plana de todas las fotos para el visor
  var visorIdx = 0;

  /* ---------- utilidades ---------- */
  function $(sel) { return document.querySelector(sel); }
  function el(tag, clase, texto) {
    var e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto !== undefined) e.textContent = texto;
    return e;
  }
  function textoSeguro(t) { return (t === undefined || t === null) ? "" : String(t); }

  /* ---------- navegación ---------- */
  function construirNavegacion() {
    var cont = $("#barra-links");
    var enlaces = [{ titulo: "Inicio", ref: "#inicio" }];
    DATOS.categorias.forEach(function (c) {
      enlaces.push({ titulo: c.nombre, ref: "#cat-" + c.slug });
    });
    enlaces.push({ titulo: "Contacto", ref: "#contacto" });
    enlaces.forEach(function (e) {
      var a = el("a", "barra-link", e.titulo);
      a.href = e.ref;
      a.setAttribute("data-ref", e.ref);
      cont.appendChild(a);
    });
  }

  function marcarActivo() {
    var links = document.querySelectorAll(".barra-link");
    var secciones = [];
    links.forEach(function (a) {
      var destino = document.querySelector(a.getAttribute("data-ref"));
      if (destino) secciones.push({ a: a, s: destino });
    });
    window.addEventListener("scroll", function () {
      var pos = window.scrollY + 140;
      var actual = secciones.length ? secciones[0] : null;
      secciones.forEach(function (par) { if (par.s.offsetTop <= pos) actual = par; });
      links.forEach(function (a) { a.classList.remove("activo"); });
      if (actual) actual.a.classList.add("activo");
    }, { passive: true });
  }

  /* ---------- portada: miniaturas destacadas ---------- */
  function buscarFoto(nombreArchivo) {
    for (var i = 0; i < PLANO.length; i++) {
      var f = PLANO[i];
      if (f.archivo.indexOf("/" + nombreArchivo) !== -1) return f;
    }
    return PLANO[0];
  }
  function construirPortada() {
    var cont = $("#portada-miniaturas");
    var clases = ["m1", "m2", "m3"];
    (DATOS.destacados || []).slice(0, 3).forEach(function (nombre, i) {
      var f = buscarFoto(nombre);
      if (!f) return;
      var img = el("img", "mini " + clases[i % 3]);
      img.src = f.archivo;
      img.alt = textoSeguro(f.titulo);
      img.loading = "eager";
      img.addEventListener("click", function () { abrirVisor(f.indice); });
      cont.appendChild(img);
    });
  }

  /* ---------- galería ---------- */
  function construirGaleria() {
    var cont = $("#galeria-contenido");
    DATOS.categorias.forEach(function (cat, i) {
      var sec = el("section", "seccion revelar");
      sec.id = "cat-" + cat.slug;

      /* cabecera */
      var cab = el("div", "seccion-cabecera");
      cab.appendChild(el("div", "numbadge", String(i + 1).padStart(2, "0")));
      cab.appendChild(el("h2", "seccion-titulo", textoSeguro(cat.nombre)));
      var feston = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      feston.setAttribute("class", "feston");
      feston.setAttribute("width", "182"); feston.setAttribute("height", "16");
      feston.setAttribute("viewBox", "0 0 182 16");
      feston.innerHTML = '<path d="M0 15 a7 10 0 0 1 14 0 a7 10 0 0 1 14 0 a7 10 0 0 1 14 0 a7 10 0 0 1 14 0 a7 10 0 0 1 14 0 a7 10 0 0 1 14 0 a7 10 0 0 1 14 0 a7 10 0 0 1 14 0 a7 10 0 0 1 14 0 a7 10 0 0 1 14 0 a7 10 0 0 1 14 0 a7 10 0 0 1 14 0 a7 10 0 0 1 14 0" fill="none" stroke="#b06a56" stroke-width="3" stroke-linecap="round"/>';
      cab.appendChild(feston);
      if (cat.subtitulo) cab.appendChild(el("p", "seccion-desc", textoSeguro(cat.subtitulo)));
      if (cat.dato) cab.appendChild(el("p", "seccion-dato", textoSeguro(cat.dato)));
      sec.appendChild(cab);

      /* rejilla de tarjetas */
      var rejilla = el("div", "rejilla");
      cat.fotos.forEach(function (foto) {
        var tarjeta = el("figure", "tarjeta");
        var img = el("img");
        img.src = foto.archivo;
        img.alt = textoSeguro(foto.titulo);
        img.loading = "lazy";
        tarjeta.appendChild(img);
        tarjeta.appendChild(el("figcaption", "nombre", textoSeguro(foto.titulo)));
        tarjeta.appendChild(el("div", "chip2", textoSeguro(cat.nombre)));
        tarjeta.addEventListener("click", function () { abrirVisor(foto.indice); });
        rejilla.appendChild(tarjeta);
      });
      sec.appendChild(rejilla);

      /* nota al pie de la sección */
      if (cat.nota) sec.appendChild(el("p", "seccion-nota", textoSeguro(cat.nota)));
      sec.appendChild(el("div", "seccion-proximamente", "NUEVAS PIEZAS SE SUMAN AL SUBIR FOTOS"));

      cont.appendChild(sec);
    });
  }

  /* ---------- contacto ---------- */
  function construirContacto() {
    var cont = $("#tarjeta-contacto");
    var valores = DATOS.contacto || {};
    ["Instagram", "WhatsApp", "Correo"].forEach(function (clave) {
      var fila = el("div", "crow");
      fila.appendChild(el("span", "cl", clave));
      var v = textoSeguro(valores[clave]);
      if (v) fila.appendChild(el("span", "cvalor", v));
      else fila.appendChild(el("span", "cdots"));
      cont.appendChild(fila);
    });
  }

  /* ---------- visor ---------- */
  function abrirVisor(idx) {
    if (idx < 0 || idx >= PLANO.length) return;
    visorIdx = idx;
    var f = PLANO[idx];
    $("#visor-img").src = f.archivo;
    $("#visor-img").alt = textoSeguro(f.titulo);
    $("#visor-titulo").textContent = textoSeguro(f.titulo);
    $("#visor-chip").textContent = textoSeguro(f.categoriaNombre);
    $("#visor-desc").textContent = textoSeguro(f.descripcion);
    $("#visor-contador").textContent = (idx + 1) + " / " + PLANO.length;
    $("#visor").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function cerrarVisor() {
    $("#visor").hidden = true;
    $("#visor-img").src = "";
    document.body.style.overflow = "";
  }
  function moverVisor(delta) {
    abrirVisor((visorIdx + delta + PLANO.length) % PLANO.length);
  }
  function atarVisor() {
    $("#visor-cerrar").addEventListener("click", cerrarVisor);
    $("#visor-ant").addEventListener("click", function () { moverVisor(-1); });
    $("#visor-sig").addEventListener("click", function () { moverVisor(1); });
    $("#visor").addEventListener("click", function (ev) {
      if (ev.target === $("#visor")) cerrarVisor();
    });
    document.addEventListener("keydown", function (ev) {
      if ($("#visor").hidden) return;
      if (ev.key === "Escape") cerrarVisor();
      if (ev.key === "ArrowLeft") moverVisor(-1);
      if (ev.key === "ArrowRight") moverVisor(1);
    });
  }

  /* ---------- animaciones ---------- */
  function observarRevelado() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".revelar").forEach(function (e) { e.classList.add("visible"); });
      return;
    }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".revelar").forEach(function (e) { obs.observe(e); });
  }

  /* ---------- arranque ---------- */
  function aplanar() {
    DATOS.categorias.forEach(function (cat) {
      cat.fotos.forEach(function (foto) {
        foto.indice = PLANO.length;
        foto.categoriaNombre = cat.nombre;
        PLANO.push(foto);
      });
    });
  }
  function mostrarError() {
    var main = $("#galeria-contenido");
    main.appendChild(el("div", "aviso-error",
      "No se pudo cargar el catálogo (datos.json). Si estás abriendo el archivo localmente, " +
      "súbelo a GitHub Pages o sírvelo con un servidor local para verlo completo."));
  }

  fetch("datos.json")
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (datos) {
      DATOS = datos;
      aplanar();
      construirNavegacion();
      marcarActivo();
      construirPortada();
      construirGaleria();
      construirContacto();
      atarVisor();
      observarRevelado();
    })
    .catch(function () { mostrarError(); });
})();
