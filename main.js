/* acordeacorde — interacción. Contenido en contenido.js (window.AAC). */
(() => {
  "use strict";
  const D = window.AAC || {};
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const enlaces = D.enlaces || {};
  const correo = (D.contacto && D.contacto.correo) || "acordeacordemusic@gmail.com";
  const srcset = (p, ext) => p.anchos.map((w) => `${p.src}-${w}.${ext} ${w}w`).join(", ");
  const grande = (p) => `${p.src}-${p.anchos[p.anchos.length - 1]}.webp`;
  const picture = (p, sizes, attrs = "") => `<picture>
      <source type="image/avif" srcset="${srcset(p, "avif")}" sizes="${sizes}">
      <source type="image/webp" srcset="${srcset(p, "webp")}" sizes="${sizes}">
      <img src="${grande(p)}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" decoding="async" ${attrs}>
    </picture>`;
  const fotos = (D.archivo || []).filter((p) => p.tipo === "foto");

  /* ============ NOMBRE: letras sueltas ============ */
  const giros = [-4, 2, -2, 3, -3, 4, 0, 3, -2];
  const alturas = [.02, -.03, .03, -.02, .04, -.01, .02, .03, -.04];
  $$(".nombre__l").forEach((linea, li) => {
    linea.innerHTML = [...linea.textContent].map((c, i) => {
      const k = i + li * 3;
      return `<i style="--g:${giros[k % giros.length]}deg;--y:${alturas[k % alturas.length]}em;--d:${(li * 7 + i) * 0.055}s">${esc(c)}</i>`;
    }).join("");
  });
  const brinca = (i) => { if (!i || i.classList.contains("brinca")) return; i.classList.add("brinca"); };
  $(".nombre").addEventListener("pointerover", (e) => brinca(e.target.closest("i")));
  $(".nombre").addEventListener("pointerdown", (e) => brinca(e.target.closest("i")));
  $(".nombre").addEventListener("animationend", (e) => e.target.classList.remove("brinca"));

  /* ============ TEXTO POR LÍNEAS ============ */
  const partirLineas = (el) => {
    const txt = el.dataset.txt || el.textContent.trim();
    el.dataset.txt = txt;
    el.innerHTML = txt.split(/\s+/).map((w) => `<span class="w">${esc(w)}</span>`).join(" ");
    const filas = [];
    let top = null;
    $$(".w", el).forEach((w) => {
      if (w.offsetTop !== top) { filas.push([]); top = w.offsetTop; }
      filas[filas.length - 1].push(w.textContent);
    });
    el.innerHTML = filas.map((f, i) => `<span class="l"><span style="--d:${i * 0.09}s">${f.map(esc).join(" ")}</span></span>`).join("");
  };
  const lineas = $$(".lineas");
  const partirTodo = () => lineas.forEach(partirLineas);

  /* ============ FOTOS DEL INICIO ============ */
  const portada = fotos.filter((p) => p.portada);
  const heroFotos = $("#heroFotos");
  heroFotos.innerHTML = portada.map((p, i) =>
    `<img src="${p.src}-640.webp" srcset="${srcset(p, "webp")}" sizes="(min-width: 760px) 42vw, 74vw" alt="" style="object-position:${esc(p.foco || "50% 50%")}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}>`).join("");
  const heroImgs = $$("img", heroFotos);
  let hi = 0;
  const muestra = (i) => {
    heroImgs.forEach((im, k) => { im.classList.toggle("ve", k === i); });
    hi = i;
  };

  /* ============ MÚSICA ============ */
  const lanz = D.lanzamientos || [];
  const minutos = (r) => {
    const s = (r.canciones || []).reduce((t, [, d]) => { const [m, ss] = String(d).split(":").map(Number); return t + (m * 60 + (ss || 0)); }, 0);
    return s ? `${Math.round(s / 60)} min` : "";
  };
  $("#lanzamientos").innerHTML = lanz.map((r, i) => `
    <li><button type="button" data-i="${i}" aria-haspopup="dialog">
      ${r.portada ? `<img class="lista__mini" src="${esc(r.portada)}" alt="" loading="lazy" width="640" height="640">` : ""}
      <span class="lista__n">${String(i + 1).padStart(2, "0")}</span>
      <span class="lista__t">${esc(r.titulo || r.tipo)}</span>
      <span class="lista__m">${r.estado === "nuevo" ? "<b>Nuevo</b>" : r.estado === "debut" ? "<b>Álbum debut</b>" : ""}${esc(r.tipo)} · ${esc(r.fecha)}</span>
    </button></li>`).join("");

  // portada flotante que sigue al cursor (escritorio)
  const flota = $("#flota"), flotaImg = $("img", flota);
  let fx = 0, fy = 0, tx = 0, ty = 0, flotaActiva = false;
  if (finePointer) {
    $("#lanzamientos").addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; });
    $("#lanzamientos").addEventListener("pointerover", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      const r = lanz[+b.dataset.i];
      if (r && r.portada) { flotaImg.src = r.portada; flota.classList.add("ve"); flotaActiva = true; }
    });
    $("#lanzamientos").addEventListener("pointerleave", () => { flota.classList.remove("ve"); flotaActiva = false; });
  }

  // detalle
  const detalle = $("#detalle");
  const boton = (url, txt, cls = "") => url ? `<a class="boton ${cls}" href="${esc(url)}" target="_blank" rel="noopener"><span>${esc(txt)}</span><i aria-hidden="true">↗</i></a>` : "";
  const abrir = (i) => {
    const r = lanz[i]; if (!r) return;
    const e = r.enlaces || {};
    $("#detalleIn").innerHTML = `
      <div class="detalle__portada">${r.portada ? `<img src="${esc(r.portada)}" alt="${esc(r.portadaAlt || "")}" width="640" height="640">` : ""}</div>
      <div>
        <p class="mono">${esc(r.tipo)} · ${esc(r.fecha)}${minutos(r) && r.canciones.length > 1 ? " · " + minutos(r) : ""}</p>
        <h2 id="detalleT">${esc(r.titulo || r.tipo)}</h2>
        ${r.canciones && r.canciones.length ? `<ol class="pistas">${r.canciones.map(([n, t]) => `<li><span>${esc(n)}</span><span>${esc(t)}</span></li>`).join("")}</ol>` : ""}
        ${r.spotifyEmbed ? `<div class="reproductor"><iframe src="${esc(r.spotifyEmbed)}?theme=0" height="${r.spotifyAlto || 152}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" title="Reproductor de Spotify: ${esc(r.titulo || "")}"></iframe></div>` : ""}
        <div class="botones">${boton(e.spotify, "Spotify", "")}${boton(e.appleMusic, "Apple Music")}${boton(e.youtube, "YouTube")}${boton(e.bandcamp, "Bandcamp")}</div>
      </div>`;
    if (typeof detalle.showModal === "function") { detalle.showModal(); document.body.classList.add("bloqueado"); }
    else location.hash = "#musica";
    detalle.scrollTop = 0;
    flota.classList.remove("ve");
  };
  const cerrar = () => { if (detalle.open) detalle.close(); };
  detalle.addEventListener("close", () => { document.body.classList.remove("bloqueado"); $("#detalleIn").innerHTML = ""; });
  $("#detalleCerrar").addEventListener("click", cerrar);
  detalle.addEventListener("click", (e) => { if (e.target === detalle) cerrar(); });
  $("#lanzamientos").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) abrir(+b.dataset.i); });
  $$("[data-abre]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); abrir(+a.dataset.abre); }));
  if (enlaces.spotify) $("#spotifyArtista").href = enlaces.spotify;

  /* ============ EN VIVO: tira ============ */
  const tira = $("#tira");
  tira.innerHTML = fotos.map((p, i) => `<figure data-i="${i}">${picture(p, "(min-width: 700px) 50vw, 84vw", `loading="lazy" draggable="false" style="object-position:${esc(p.foco || "50% 50%")}"`)}</figure>`).join("");
  const figs = $$("figure", tira);
  const cuenta = $("#tiraCuenta");
  const marcaActiva = () => {
    const c = tira.scrollLeft + tira.clientWidth / 2;
    let mejor = 0, dist = Infinity;
    figs.forEach((f, i) => { const d = Math.abs(f.offsetLeft + f.offsetWidth / 2 - c); if (d < dist) { dist = d; mejor = i; } });
    figs.forEach((f, i) => f.classList.toggle("activa", i === mejor));
    cuenta.textContent = `${String(mejor + 1).padStart(2, "0")} / ${String(figs.length).padStart(2, "0")}`;
  };
  tira.addEventListener("scroll", () => requestAnimationFrame(marcaActiva), { passive: true });
  marcaActiva();
  // arrastrar con mouse
  let arr = null;
  tira.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; arr = { x: e.clientX, s: tira.scrollLeft, movio: false }; });
  addEventListener("pointermove", (e) => {
    if (!arr) return;
    const dx = e.clientX - arr.x;
    if (Math.abs(dx) > 4) { arr.movio = true; tira.classList.add("arrastra"); }
    tira.scrollLeft = arr.s - dx;
  });
  addEventListener("pointerup", () => { if (arr) { tira.classList.remove("arrastra"); arr = null; } });
  tira.addEventListener("keydown", (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!k) return;
    e.preventDefault();
    const act = figs.findIndex((f) => f.classList.contains("activa"));
    const sig = figs[Math.max(0, Math.min(figs.length - 1, act + k))];
    tira.scrollTo({ left: sig.offsetLeft - (tira.clientWidth - sig.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  });

  /* ============ VIDEO ============ */
  // loop mudo que solo corre mientras se ve; el completo con sonido se abre aparte
  const V = D.video, vBox = $("#video");
  if (V && V.loop && vBox) {
    const ahorro = navigator.connection && navigator.connection.saveData;
    vBox.hidden = false;
    vBox.innerHTML = `<video muted loop playsinline preload="none" poster="${esc(V.poster || "")}" aria-hidden="true"><source src="${esc(V.loop)}" type="video/mp4"></video>
      ${V.completo ? `<button type="button" class="video__ver"><span class="video__play" aria-hidden="true"></span><span>Ver completo<small class="mono">${esc(V.duracion || "")} · con sonido</small></span></button>` : ""}`;
    const vid = $("video", vBox);
    if (!reduce && !ahorro) {
      new IntersectionObserver(([en]) => { if (en.isIntersecting) vid.play().catch(() => {}); else vid.pause(); }, { threshold: .25 }).observe(vBox);
    }
    const ver = $(".video__ver", vBox);
    if (ver) ver.addEventListener("click", () => {
      vid.pause();
      $("#detalleIn").innerHTML = `<div class="detalle__video"><video controls autoplay playsinline preload="auto" poster="${esc(V.poster || "")}"><source src="${esc(V.completo)}" type="video/mp4"></video></div>`;
      if (typeof detalle.showModal === "function") { detalle.showModal(); document.body.classList.add("bloqueado"); }
      else open(V.completo, "_blank");
    });
  }

  /* ============ AGENDA ============ */
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  // cada función es su flyer; abajo solo fecha, lugar y boletos
  const fechaDe = (f) => {
    const d = new Date(f.fecha + "T12:00");
    return f.fechaTexto || `${String(d.getDate()).padStart(2, "0")} ${meses[d.getMonth()]} ${d.getFullYear()}`;
  };
  const ESTADO = { cancelado: "Cancelado", lluvia: "Suspendido por lluvia" };
  const funcs = (D.funciones || []).slice().sort((a, b) => a.fecha.localeCompare(b.fecha));
  const esProx = (f) => new Date(f.fecha + "T23:59") >= hoy;
  const prox = funcs.filter(esProx);
  const pas = funcs.filter((f) => !esProx(f)).reverse();
  const diaMes = (f) => {
    if (f.fechaTexto) return [f.fechaTexto.replace(/\s*\d{4}$/, ""), (f.fechaTexto.match(/\d{4}$/) || [""])[0]];
    const d = new Date(f.fecha + "T12:00");
    return [`${String(d.getDate()).padStart(2, "0")} ${meses[d.getMonth()]}`, String(d.getFullYear())];
  };
  const tarjeta = (f) => {
    const [dm, an] = diaMes(f);
    const tag = esProx(f) ? `<b class="tag tag--lleno">Próxima</b>` : ESTADO[f.estado] ? `<b class="tag">${ESTADO[f.estado]}</b>` : "";
    return `<li class="fecha${f.estado ? " fecha--" + esc(f.estado) : ""}">
      <button type="button" class="fecha__flyer" data-f="${funcs.indexOf(f)}" ${f.cartel ? `aria-label="Ver flyer del ${esc(fechaDe(f))}${f.lugar ? ", " + esc(f.lugar) : ""}"` : 'disabled tabindex="-1"'}>
        ${f.cartel ? `<img src="${esc(f.cartel)}" alt="" loading="lazy" draggable="false">` : ""}
      </button>
      <p class="fecha__d"><span>${esc(dm)}</span> <small class="mono">${esc(an)}</small>${tag}</p>
      <p class="fecha__l">${esc(f.lugar || f.ciudad || "")}</p>
      ${f.lugar && f.ciudad ? `<p class="fecha__c">${esc(f.ciudad)}</p>` : ""}
      ${f.nota ? `<p class="fecha__c">${esc(f.nota)}</p>` : ""}
      ${f.boletos || f.post ? `<div class="botones">${boton(f.boletos, "Boletos")}${boton(f.post, "Instagram")}</div>` : ""}
    </li>`;
  };
  const sinProx = `<li class="fecha fecha--vacia"><a href="mailto:${esc(correo)}?subject=${encodeURIComponent("Función — acordeacorde")}"><span>sin fechas próximas</span><small class="mono">¿Tienes foro? Escríbenos ↗</small></a></li>`;
  const fechasEl = $("#fechas");
  fechasEl.innerHTML = (prox.length ? prox.map(tarjeta).join("") : sinProx) +
    (pas.length ? `<li class="fecha-sep" aria-hidden="true"><span>ya pasó</span></li>` + pas.map(tarjeta).join("") : "");
  // arrastrar con mouse sin abrir el flyer al soltar
  let arrF = null, movioF = false;
  fechasEl.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; arrF = { x: e.clientX, s: fechasEl.scrollLeft }; movioF = false; });
  addEventListener("pointermove", (e) => {
    if (!arrF) return;
    const dx = e.clientX - arrF.x;
    if (Math.abs(dx) > 4) { movioF = true; fechasEl.classList.add("arrastra"); }
    fechasEl.scrollLeft = arrF.s - dx;
  });
  addEventListener("pointerup", () => { if (arrF) { fechasEl.classList.remove("arrastra"); arrF = null; } });
  fechasEl.addEventListener("click", (e) => { if (movioF) { e.preventDefault(); e.stopPropagation(); movioF = false; } }, true);
  fechasEl.addEventListener("keydown", (e) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!k) return;
    e.preventDefault();
    fechasEl.scrollBy({ left: k * (fechasEl.querySelector(".fecha").offsetWidth + 24), behavior: reduce ? "auto" : "smooth" });
  });
  // flyer en grande
  fechasEl.addEventListener("click", (e) => {
    const b = e.target.closest(".fecha__flyer"); if (!b || b.disabled) return;
    const f = funcs[+b.dataset.f]; if (!f || !f.cartel) return;
    $("#detalleIn").innerHTML = `
      <div class="detalle__flyer"><img src="${esc(f.cartel)}" alt="Flyer de la función del ${esc(fechaDe(f))}${f.lugar ? " en " + esc(f.lugar) : ""}."></div>
      <div>
        <p class="mono">${esc(fechaDe(f))}${ESTADO[f.estado] ? " · " + ESTADO[f.estado] : ""}</p>
        <h2 id="detalleT">${esc(f.lugar || f.ciudad || "")}</h2>
        ${f.lugar && f.ciudad ? `<p class="mono">${esc(f.ciudad)}</p>` : ""}
        <div class="botones">${boton(f.boletos, "Boletos")}${boton(f.post, "Instagram")}</div>
      </div>`;
    if (typeof detalle.showModal === "function") { detalle.showModal(); document.body.classList.add("bloqueado"); detalle.scrollTop = 0; }
    else open(f.cartel, "_blank");
  });

  /* ============ MERCH ============ */
  const merch = D.merch || [];
  const dm = enlaces.instagram ? `https://ig.me/m/${enlaces.instagram.split("/").filter(Boolean).pop()}` : null;
  const stock = (m) => m.quedan === 0 ? `<b class="agotado">Agotado</b>` : m.quedan != null && m.quedan <= 3 ? `<b>Quedan ${m.quedan}</b>` : "";
  $("#catalogo").innerHTML = merch.length
    ? `<ul class="laminas">${merch.map((m) => `<li class="lamina${m.quedan === 0 ? " lamina--agotada" : ""}">
        <div class="lamina__img">${m.foto ? `<img src="${esc(m.foto)}" alt="${esc(m.alt || m.nombre)}" loading="lazy" width="600" height="600">` : ""}</div>
        <h3>${esc(m.nombre)}</h3>
        <p class="mono">${esc(m.variante || "")}${m.variante ? " · " : ""}${m.precio ? "$" + esc(m.precio) : "Consultar"} ${stock(m)}</p>
      </li>`).join("")}</ul>
      <div class="merch__pie">
        ${(D.combos || []).length ? `<p class="mono">${D.combos.map(esc).join(" · ")}</p>` : ""}
        <div class="botones">${boton(dm, "Apartar por DM", "")}<a class="boton" href="mailto:${esc(correo)}?subject=${encodeURIComponent("Merch — acordeacorde")}"><span>Por correo</span><i aria-hidden="true">↗</i></a></div>
      </div>`
    : `<div class="catalogo-vacio"><p>El catálogo se está imprimiendo. Mientras, lo que hay se vende en la mesa de cada función.</p>
       <div class="botones">${enlaces.instagram ? boton(enlaces.instagram, "Mensaje directo") : ""}<a class="boton" href="mailto:${esc(correo)}?subject=${encodeURIComponent("Merch — acordeacorde")}"><span>Por correo</span><i aria-hidden="true">↗</i></a></div></div>`;

  /* ============ PÚBLICO (fondo de "escríbenos") ============ */
  // entra en blanco y negro y pasa a color conforme sube con el scroll
  const pub = D.publico, pubBox = $("#publico");
  if (pub && pubBox) {
    pubBox.innerHTML = picture({ ...pub, alt: "" }, "100vw", 'loading="lazy"');
    pubBox.style.setProperty("--foco", pub.foco || "50% 60%");
    if (!reduce) {
      let pubVisible = false, pubPend = false;
      const pubPinta = () => {
        pubPend = false;
        const r = pubBox.getBoundingClientRect(), vh = innerHeight;
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * .9 + r.height * .35)));
        pubBox.style.setProperty("--p", p.toFixed(3));
      };
      new IntersectionObserver(([en]) => { pubVisible = en.isIntersecting; if (pubVisible) pubPinta(); }).observe(pubBox);
      addEventListener("scroll", () => { if (pubVisible && !pubPend) { pubPend = true; requestAnimationFrame(pubPinta); } }, { passive: true });
    }
  }

  /* ============ CONTACTO ============ */
  const REDES = [["spotify", "Spotify"], ["instagram", "Instagram"], ["appleMusic", "Apple Music"], ["youtube", "YouTube"], ["bandcamp", "Bandcamp"], ["tiktok", "TikTok"]];
  $("#redes").innerHTML = REDES.filter(([k]) => enlaces[k]).map(([k, n]) => `<li>${boton(enlaces[k], n)}</li>`).join("");
  $$("#correoGrande, #correoTxt, #menuCorreo").forEach((a) => { a.href = "mailto:" + correo; });
  $("#correoTxt").textContent = correo; $("#menuCorreo").textContent = correo;
  $("#riderLink").href = `mailto:${correo}?subject=${encodeURIComponent("Rider técnico — acordeacorde")}`;
  $("#copiar").addEventListener("click", async (e) => {
    try { await navigator.clipboard.writeText(correo); e.target.textContent = "Copiado ✓"; }
    catch (_) { e.target.textContent = "Selecciónalo y copia"; }
    setTimeout(() => { e.target.textContent = "Copiar"; }, 1800);
  });

  /* ============ MENÚ ============ */
  const menu = $("#menu"), menuBtn = $("#menuBtn");
  const setMenu = (si) => {
    document.body.classList.toggle("menu-abierto", si);
    document.body.classList.toggle("bloqueado", si);
    menuBtn.setAttribute("aria-expanded", si);
    $(".top__menu-txt").textContent = si ? "Cerrar" : "Menú";
    if (si) { menu.hidden = false; setTimeout(() => $("a", menu).focus(), 60); } else { setTimeout(() => { if (!document.body.classList.contains("menu-abierto")) menu.hidden = true; }, 800); }
  };
  menu.hidden = true;
  menuBtn.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-abierto")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && document.body.classList.contains("menu-abierto")) { setMenu(false); menuBtn.focus(); } });

  /* ============ TINTA QUE HIERVE ============ */
  // como animación hecha a mano: el contorno cambia unas 8 veces por segundo
  const turbFina = $("#tinta-fina feTurbulence");
  const turbTitulos = $$("#tinta-m feTurbulence, #tinta-s feTurbulence");
  const turb = $("#tinta feTurbulence"), disp = $("#tinta feDisplacementMap"), blur = $("#tinta feGaussianBlur");
  const ajustaTinta = () => {
    const fs = parseFloat(getComputedStyle($(".nombre")).fontSize) || 300;
    const k = Math.max(.45, fs / 320);
    turb.setAttribute("baseFrequency", (0.012 / k).toFixed(4));
    disp.setAttribute("scale", (13 * k).toFixed(1));
    blur.setAttribute("stdDeviation", (3.6 * k).toFixed(2));
  };
  ajustaTinta(); addEventListener("resize", ajustaTinta);
  let visibles = new Set();
  const vio = new IntersectionObserver((ents) => ents.forEach((en) => en.isIntersecting ? visibles.add(en.target) : visibles.delete(en.target)));
  $$(".nombre, .contacto__t, .sec-head__t, .lista, .agenda, .nuevo, .laminas").forEach((el) => vio.observe(el));
  let semilla = 0;
  if (!reduce) setInterval(() => {
    const extra = document.body.classList.contains("menu-abierto") || detalle.open;
    if (document.hidden || (!visibles.size && !extra && document.getElementById("intro").classList.contains("fuera"))) return;
    semilla = (semilla + 1) % 4;
    turb.setAttribute("seed", [7, 23, 41, 58][semilla]);
    turbFina.setAttribute("seed", [7, 23, 41, 58][semilla]);
    turbTitulos.forEach((t) => t.setAttribute("seed", [7, 23, 41, 58][semilla]));
  }, 125);

  /* ============ APARICIONES ============ */
  const io = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("visto"); io.unobserve(en.target); }
  }), { threshold: .2 });

  /* ============ LOOP (portada flotante) ============ */
  const loop = () => {
    if (flotaActiva) {
      fx += (tx - fx) * .14; fy += (ty - fy) * .14;
      flota.style.translate = `${fx}px ${fy}px`;
    }
    requestAnimationFrame(loop);
  };
  if (finePointer) requestAnimationFrame(loop);

  /* ============ ARRANQUE ============ */
  const intro = $("#intro");
  let arrancado = false;
  const arranca = () => {
    if (arrancado) return; arrancado = true;
    document.body.classList.remove("bloqueado");
    intro.classList.add("sale");
    setTimeout(() => intro.classList.add("fuera"), reduce ? 0 : 1000);
    setTimeout(() => {
      document.body.classList.add("listo");
      muestra(0);
      if (!reduce && heroImgs.length > 1) setInterval(() => muestra((hi + 1) % heroImgs.length), 3800);
    }, reduce ? 0 : 380);
  };
  const fuentes = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  fuentes.then(() => {
    partirTodo();
    lineas.forEach((el) => io.observe(el));
    let ancho = innerWidth;
    addEventListener("resize", () => { if (Math.abs(innerWidth - ancho) > 40) { ancho = innerWidth; partirTodo(); lineas.forEach((el) => el.classList.add("visto")); } });
  });
  if (reduce) { intro.classList.add("fuera"); arranca(); }
  else {
    document.body.classList.add("bloqueado");
    const minimo = new Promise((r) => setTimeout(r, 2300));
    Promise.all([fuentes, minimo]).then(arranca);
    setTimeout(arranca, 4500); // por si las fuentes tardan demasiado
    const saltar = () => arranca();
    $("#introSaltar").addEventListener("click", saltar);
    intro.addEventListener("click", saltar);
    addEventListener("keydown", saltar, { once: true });
  }
})();
