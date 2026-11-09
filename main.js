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

  /* ============ CARRUSEL: arrastre, rueda del mouse y flechas ============ */
  const carrusel = (el, item) => {
    let arr = null, movio = false;
    el.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; arr = { x: e.clientX, s: el.scrollLeft }; movio = false; });
    addEventListener("pointermove", (e) => {
      if (!arr) return;
      const dx = e.clientX - arr.x;
      if (Math.abs(dx) > 4) { movio = true; el.classList.add("arrastra"); }
      el.scrollLeft = arr.s - dx;
    });
    addEventListener("pointerup", () => { if (arr) { el.classList.remove("arrastra"); arr = null; } });
    el.addEventListener("click", (e) => { if (movio) { e.preventDefault(); e.stopPropagation(); movio = false; } }, true);
    // la ruedita mueve el carrusel de lado; en las orillas deja seguir la página
    el.addEventListener("wheel", (e) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
      if ((d < 0 && el.scrollLeft <= 0) || (d > 0 && el.scrollLeft >= max - 1)) return;
      e.preventDefault();
      el.classList.add("rueda");
      el.scrollLeft += d;
      clearTimeout(el._rueda);
      el._rueda = setTimeout(() => el.classList.remove("rueda"), 260);
    }, { passive: false });
    el.addEventListener("keydown", (e) => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!k) return;
      e.preventDefault();
      const it = el.querySelector(item);
      el.scrollBy({ left: k * ((it ? it.offsetWidth : 300) + 24), behavior: reduce ? "auto" : "smooth" });
    });
  };

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
  // a pantalla completa: horizontales en pantallas anchas, verticales en el cel
  const todas = fotos.filter((p) => p.portada);
  const vertical = matchMedia("(orientation: portrait)").matches;
  const encajan = todas.filter((p) => vertical ? p.h > p.w : p.w >= p.h);
  const portada = encajan.length >= 3 ? encajan : todas;
  const heroFotos = $("#heroFotos");
  heroFotos.innerHTML = portada.map((p, i) =>
    `<img src="${p.src}-640.webp" srcset="${srcset(p, "webp")}" sizes="100vw" alt="" style="object-position:${esc(p.foco || "50% 50%")}" ${i ? 'decoding="async"' : 'fetchpriority="high"'}>`).join("");
  const heroImgs = $$("img", heroFotos);
  let hi = 0;
  const muestra = (i) => {
    heroImgs.forEach((im, k) => { im.classList.toggle("ve", k === i); });
    hi = i;
  };
  // espera a que la foto esté descargada y decodificada antes de mostrarla
  const lista = (im) => im.complete && im.naturalWidth ? (im.decode ? im.decode().catch(() => {}) : Promise.resolve())
    : new Promise((ok) => { im.addEventListener("load", ok, { once: true }); im.addEventListener("error", ok, { once: true }); }).then(() => im.decode && im.decode().catch(() => {}));
  let heroOcupado = false;
  const siguiente = () => {
    if (heroOcupado) return;
    const n = (hi + 1) % heroImgs.length;
    if (!(heroImgs[n].complete && heroImgs[n].naturalWidth)) return; // aún no llega: se queda la actual
    heroOcupado = true;
    lista(heroImgs[n]).then(() => { muestra(n); heroOcupado = false; });
  };
  heroImgs.forEach(lista);

  /* ============ MÚSICA ============ */
  const lanz = D.lanzamientos || [];
  const minutos = (r) => {
    const s = (r.canciones || []).reduce((t, [, d]) => { const [m, ss] = String(d).split(":").map(Number); return t + (m * 60 + (ss || 0)); }, 0);
    return s ? `${Math.round(s / 60)} min` : "";
  };
  // los sencillos que son parte de un disco van agrupados debajo de él, con su número de pista
  const dos = (n) => String(n).padStart(2, "0");
  const deDisco = (t) => lanz.map((s, j) => [s, j]).filter(([s]) => s.de === t).sort((a, b) => (a[0].pista || 0) - (b[0].pista || 0));
  $("#lanzamientos").innerHTML = lanz.map((r, i) => [r, i]).filter(([r]) => !r.de).map(([r, i]) => {
    const hijos = deDisco(r.titulo);
    return `<li><button type="button" data-i="${i}" aria-haspopup="dialog">
      ${r.portada ? `<img class="lista__mini" src="${esc(r.portada)}" alt="" loading="lazy" width="640" height="640">` : ""}
      <span class="lista__n">${esc(String(r.fecha || "").slice(-4))}</span>
      <span class="lista__t">${esc(r.titulo || r.tipo)}</span>
      <span class="lista__m">${r.estado === "nuevo" ? "<b>Nuevo</b>" : r.estado === "debut" ? "<b>Álbum debut</b>" : ""}${esc(r.tipo)} · ${esc(r.fecha)}</span>
    </button>
    ${hijos.length ? `<ul class="sub" aria-label="Sencillos de ${esc(r.titulo)}">
      <li class="sub__h mono" aria-hidden="true">Salieron antes como sencillos</li>
      ${hijos.map(([s, j]) => `<li><button type="button" data-i="${j}" aria-haspopup="dialog">
        ${s.portada ? `<img src="${esc(s.portada)}" alt="" loading="lazy" width="640" height="640">` : "<span></span>"}
        <span class="sub__n mono">Pista ${dos(s.pista || 0)}</span>
        <span class="sub__t">${esc(s.titulo)}</span>
        <span class="sub__m mono">Sencillo · ${esc(s.fecha)}</span>
      </button></li>`).join("")}
    </ul>` : ""}</li>`;
  }).join("");

  // reproductor de YouTube: miniatura local y el iframe solo al dar play
  const yt = (r, auto) => `<div class="yt" data-yt="${esc(r.youtube)}">
      <button type="button" class="yt__play" aria-label="Ver ${esc(r.youtubeTipo || "video")}: ${esc(r.titulo || "")}">
        ${r.youtubePoster ? `<img src="${esc(r.youtubePoster)}-640.webp" srcset="${esc(r.youtubePoster)}-640.webp 640w, ${esc(r.youtubePoster)}.webp 1280w" sizes="(min-width: 900px) 60vw, 100vw" alt="" loading="lazy" width="1280" height="720">`
          : `<img src="https://i.ytimg.com/vi/${esc(r.youtube)}/hqdefault.jpg" alt="" loading="lazy">`}
        <span class="video__play" aria-hidden="true"></span>
      </button>
    </div>`;
  const ponYt = (caja) => {
    const id = caja.dataset.yt;
    caja.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="Video de YouTube"></iframe>`;
    caja.classList.add("yt--on");
  };
  document.addEventListener("click", (e) => { const b = e.target.closest(".yt__play"); if (b) ponYt(b.parentElement); });
  /* ---- visualizer de fondo en la portada: arranca solo (sin sonido) y se le sube con un toque ---- */
  const conVideo = lanz.find((r) => r.youtube);
  const heroYt = $("#heroYt"), sonido = $("#sonido");
  const ahorroDatos = navigator.connection && navigator.connection.saveData;
  if (conVideo && heroYt && !reduce && !ahorroDatos) {
    let yp = null, listoYt = false, conSonido = false;
    const id = conVideo.youtube;
    const prende = () => { if (listoYt) return; listoYt = true; heroYt.classList.add("ve"); document.body.classList.add("con-yt"); sonido.hidden = false; };
    const crea = () => {
      const div = document.createElement("div"); heroYt.appendChild(div);
      yp = new YT.Player(div, {
        host: "https://www.youtube-nocookie.com", videoId: id,
        playerVars: { autoplay: 1, mute: 1, controls: 0, loop: 1, playlist: id, playsinline: 1, rel: 0, modestbranding: 1, disablekb: 1, iv_load_policy: 3, fs: 0, enablejsapi: 1, origin: location.origin },
        events: {
          onReady: (e) => {
            e.target.mute(); e.target.playVideo(); sonido.hidden = false;
            // por si el evento de "reproduciendo" no llega, se revisa el estado
            const revisa = setInterval(() => { try { if (yp.getPlayerState() === 1) { prende(); clearInterval(revisa); } } catch (_) {} }, 400);
            setTimeout(() => clearInterval(revisa), 20000);
          },
          onStateChange: (e) => { if (e.data === 1) prende(); },
        },
      });
    };
    window.onYouTubeIframeAPIReady = crea;
    const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; s.async = true; document.head.appendChild(s);
    sonido.addEventListener("click", () => {
      if (!yp) return;
      conSonido = !conSonido;
      if (conSonido) { yp.seekTo(0, true); yp.unMute(); yp.setVolume(100); yp.playVideo(); setTimeout(() => { try { if (yp.getPlayerState() === 1) prende(); } catch (_) {} }, 900); }
      else yp.mute();
      sonido.setAttribute("aria-pressed", conSonido);
      sonido.classList.toggle("on", conSonido);
      $(".sonido__t", sonido).textContent = conSonido ? "Silenciar" : "Subir volumen";
    });
    // fuera de la portada se pausa (salvo que lo estén escuchando)
    new IntersectionObserver(([en]) => {
      if (!yp || !listoYt) return;
      if (en.isIntersecting) yp.playVideo(); else if (!conSonido) yp.pauseVideo();
    }, { threshold: .1 }).observe($("#inicio"));
  }

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
  // página con todas las plataformas (Amazon, Tidal, YouTube Music…) a partir del link de Spotify
  const plataformas = (e) => { const m = String(e.spotify || "").match(/open\.spotify\.com\/(album|track)\/(\w+)/); return m ? `https://${m[1] === "album" ? "album" : "song"}.link/s/${m[2]}` : null; };
  const abrir = (i) => {
    const r = lanz[i]; if (!r) return;
    const e = r.enlaces || {};
    $("#detalleIn").innerHTML = `
      <div class="detalle__portada">${r.portada ? `<img src="${esc(r.portada)}" alt="${esc(r.portadaAlt || "")}" width="640" height="640">` : ""}</div>
      <div>
        <p class="mono">${esc(r.tipo)} · ${esc(r.fecha)}${minutos(r) && r.canciones.length > 1 ? " · " + minutos(r) : ""}</p>
        <h2 id="detalleT">${esc(r.titulo || r.tipo)}</h2>
        ${r.canciones && r.canciones.length ? `<ol class="pistas">${r.canciones.map(([n, t]) => `<li><span>${esc(n)}${lanz.some((s) => s.de === r.titulo && s.titulo === n) ? ' <b class="pistas__s mono">sencillo</b>' : ""}</span><span>${esc(t)}</span></li>`).join("")}</ol>` : ""}
        ${r.spotifyEmbed ? `<div class="reproductor"><iframe src="${esc(r.spotifyEmbed)}?theme=0" height="${r.spotifyAlto || 152}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" title="Reproductor de Spotify: ${esc(r.titulo || "")}"></iframe></div>` : ""}
        <div class="botones">${boton(e.spotify, "Spotify", "")}${boton(e.appleMusic, "Apple Music")}${boton(e.youtube, "YouTube")}${boton(e.deezer, "Deezer")}${boton(e.bandcamp, "Bandcamp")}${boton(plataformas(e), "Todas las plataformas")}</div>
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
  // pila de fotos impresas: la de arriba se avienta con el dedo o el mouse y se va al fondo
  const tira = $("#tira");
  const giro = (i) => ((i * 37) % 11) - 5;                 // inclinaciones "a mano", siempre las mismas
  const corre = (i) => [((i * 53) % 9) - 4, ((i * 29) % 7) - 3];
  tira.innerHTML = fotos.map((p, i) => {
    const r = p.w / p.h, [ox, oy] = corre(i);
    return `<figure data-i="${i}" style="--r:${giro(i)}deg;--ox:${ox * 4}px;--oy:${oy * 4}px;--ar:${r.toFixed(4)}">
      ${picture(p, "(min-width: 700px) 60vw, 86vw", `${i < 3 ? "" : 'loading="lazy" '}draggable="false" style="object-position:${esc(p.foco || "50% 50%")}"`)}</figure>`;
  }).join("");
  const figs = $$("figure", tira);
  const cuenta = $("#tiraCuenta");
  let orden = figs.map((_, i) => i);                       // orden[0] = la de arriba
  const acomoda = () => {
    orden.forEach((fi, k) => { const f = figs[fi]; f.style.zIndex = figs.length - k; f.classList.toggle("arriba", k === 0); f.classList.toggle("asoma", k > 0 && k < 4); f.setAttribute("aria-hidden", k ? "true" : "false"); });
    cuenta.textContent = `${String(orden[0] + 1).padStart(2, "0")} / ${String(figs.length).padStart(2, "0")}`;
  };
  const avienta = (dir = 1, dx = 0, dy = 0) => {
    const f = figs[orden[0]];
    const w = tira.clientWidth;
    f.classList.add("vuela");
    f.style.transform = `translate(calc(-50% + ${dir * w * .75}px), calc(-50% + ${dy * .5 - 40}px)) rotate(${dir * 28}deg)`;
    setTimeout(() => {
      orden.push(orden.shift()); acomoda();
      f.style.transform = "";
      setTimeout(() => f.classList.remove("vuela"), reduce ? 0 : 520);
    }, reduce ? 0 : 260);
  };
  const regresa = () => {                                   // la de hasta abajo vuelve arriba
    orden.unshift(orden.pop()); acomoda();
  };
  // arrastre con dedo o mouse
  let tomo = null;
  tira.addEventListener("pointerdown", (e) => {
    const f = e.target.closest("figure.arriba"); if (!f || (e.pointerType === "mouse" && e.button !== 0)) return;
    tomo = { f, x: e.clientX, y: e.clientY, dx: 0, dy: 0, t: performance.now(), mueve: false };
  });
  tira.addEventListener("pointermove", (e) => {
    if (!tomo) return;
    tomo.dx = e.clientX - tomo.x; tomo.dy = e.clientY - tomo.y;
    if (!tomo.mueve && Math.abs(tomo.dx) > 8 && Math.abs(tomo.dx) > Math.abs(tomo.dy)) { tomo.mueve = true; tomo.f.setPointerCapture(e.pointerId); tomo.f.classList.add("toma"); }
    if (tomo.mueve) tomo.f.style.transform = `translate(calc(-50% + ${tomo.dx}px), calc(-50% + ${tomo.dy * .35}px)) rotate(${tomo.dx / 14}deg)`;
  });
  const suelta = () => {
    if (!tomo) return;
    const { f, dx, dy, mueve, t } = tomo; tomo = null;
    f.classList.remove("toma");
    const vel = Math.abs(dx) / Math.max(1, performance.now() - t);
    if (!mueve) { avienta(1); return; }                     // un toque = siguiente
    if (Math.abs(dx) > 90 || vel > .6) avienta(Math.sign(dx) || 1, dx, dy);
    else f.style.transform = "";
  };
  tira.addEventListener("pointerup", suelta);
  tira.addEventListener("pointercancel", () => { if (tomo) { tomo.f.classList.remove("toma"); tomo.f.style.transform = ""; tomo = null; } });
  tira.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") { e.preventDefault(); avienta(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); regresa(); }
  });
  acomoda();

  /* ============ VIDEO ============ */
  // loop mudo que solo corre mientras se ve; el completo con sonido se abre aparte
  const V = D.video, vBox = $("#video");
  if (V && V.loop && vBox) {
    const ahorro = navigator.connection && navigator.connection.saveData;
    vBox.hidden = false;
    vBox.innerHTML = `<div class="video__marco">
        <video muted loop playsinline preload="none" poster="${esc(V.poster || "")}" aria-hidden="true"><source src="${esc(V.loop)}" type="video/mp4"></video>
        <div class="vhs" aria-hidden="true">
          <span class="vhs__rec"><i></i>REC</span><span class="vhs__modo">SP</span>
          <span class="vhs__play">PLAY ▶</span><span class="vhs__tc" id="vhsTc">00:00:00</span>
          <span class="vhs__bat"><i></i></span>
        </div>
        ${V.completo ? `<button type="button" class="video__ver"><span class="video__play" aria-hidden="true"></span><span>Ver completo<small class="mono">${esc(V.duracion || "")} · con sonido</small></span></button>` : ""}
      </div>`;
    const vid = $("video", vBox);
    // código de tiempo de cámara
    const tc = $("#vhsTc");
    vid.addEventListener("timeupdate", () => {
      const s = vid.currentTime, h = (n) => String(Math.floor(n)).padStart(2, "0");
      tc.textContent = `${h(s / 60)}:${h(s % 60)}:${h((s % 1) * 30)}`;
    });
    // al bajar, la tele crece hasta llenar la pantalla
    if (!reduce) {
      const crece = () => {
        const r = vBox.getBoundingClientRect(), vh = innerHeight;
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * .85)));
        vBox.style.setProperty("--p", p.toFixed(3));
      };
      addEventListener("scroll", () => requestAnimationFrame(crece), { passive: true });
      addEventListener("resize", crece); crece();
    } else vBox.style.setProperty("--p", 1);
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
    // toda la tele es botón
    if (ver) $(".video__marco", vBox).addEventListener("click", (e) => { if (!e.target.closest(".video__ver")) ver.click(); });
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
  const flyers = (f) => [].concat(f.cartel || []);
  const tarjeta = (f) => {
    const [dm, an] = diaMes(f);
    const fl = flyers(f)[0], n = flyers(f).length;
    const tag = esProx(f) ? `<b class="tag tag--lleno">Próxima</b>` : ESTADO[f.estado] ? `<b class="tag">${ESTADO[f.estado]}</b>` : "";
    return `<li class="fecha${f.estado ? " fecha--" + esc(f.estado) : ""}">
      <button type="button" class="fecha__flyer" data-f="${funcs.indexOf(f)}"${fl ? ` style="--img:url('${esc(fl)}')"` : ""} ${fl ? `aria-label="Ver ${n > 1 ? n + " flyers" : "flyer"} del ${esc(fechaDe(f))}${f.lugar ? ", " + esc(f.lugar) : ""}"` : 'disabled tabindex="-1"'}>
        ${flyers(f).map((src, k) => `<img src="${esc(src)}" alt="" loading="lazy" draggable="false"${k ? ' class="otro"' : ' class="ve"'}>`).join("")}
        ${n > 1 ? `<span class="fecha__n mono" aria-hidden="true"><b>1</b>/${n}</span>` : ""}
      </button>
      <p class="fecha__d"><span>${esc(dm)}</span> <small class="mono">${esc(an)}</small>${tag}</p>
      <p class="fecha__l">${esc(f.lugar || f.ciudad || "")}</p>
      ${f.lugar && f.ciudad ? `<p class="fecha__c">${esc(f.ciudad)}</p>` : ""}
      ${f.nota ? `<p class="fecha__c">${esc(f.nota)}</p>` : ""}
      ${f.boletos || f.post ? `<div class="botones">${boton(f.boletos, "Boletos")}${boton(f.post, "Instagram")}</div>` : ""}
    </li>`;
  };
  const sinProx = `<li class="fecha fecha--vacia"><a href="mailto:${esc(correo)}?subject=${encodeURIComponent("Función — acordeacorde")}"><span>sin fechas próximas</span><small class="mono">¿Tienes foro? Escríbenos ↗</small></a></li>`;
  const fechasProx = $("#fechasProx"), fechasPas = $("#fechasPas");
  fechasProx.innerHTML = prox.length ? prox.map(tarjeta).join("") : sinProx;
  fechasPas.innerHTML = pas.map(tarjeta).join("");
  if (!pas.length) { fechasPas.hidden = true; $("#pasadasHead").hidden = true; }
  [fechasProx, fechasPas].forEach((el) => carrusel(el, ".fecha"));
  // fechas con varios flyers: se turnan solos mientras se ven
  const dobles = $$(".fecha__flyer").filter((b) => $$("img", b).length > 1);
  const turna = (b) => {
    const ims = $$("img", b), k = ims.findIndex((im) => im.classList.contains("ve")), n = (k + 1) % ims.length;
    ims.forEach((im, j) => im.classList.toggle("ve", j === n));
    const c = $(".fecha__n b", b); if (c) c.textContent = n + 1;
  };
  const vistos = new Set();
  const ojoF = new IntersectionObserver((ents) => ents.forEach((en) => en.isIntersecting ? vistos.add(en.target) : vistos.delete(en.target)), { threshold: .4 });
  dobles.forEach((b) => ojoF.observe(b));
  if (!reduce) setInterval(() => vistos.forEach(turna), 2600);
  // flyer en grande
  $(".agenda").addEventListener("click", (e) => {
    const b = e.target.closest(".fecha__flyer"); if (!b || b.disabled) return;
    const f = funcs[+b.dataset.f]; const fs = f ? flyers(f) : []; if (!fs.length) return;
    $("#detalleIn").innerHTML = `
      <div class="detalle__flyer">${fs.map((src, k) => `<img src="${esc(src)}" alt="Flyer${fs.length > 1 ? " " + (k + 1) + " de " + fs.length : ""} de la función del ${esc(fechaDe(f))}${f.lugar ? " en " + esc(f.lugar) : ""}.">`).join("")}</div>
      <div>
        <p class="mono">${esc(fechaDe(f))}${ESTADO[f.estado] ? " · " + ESTADO[f.estado] : ""}</p>
        <h2 id="detalleT">${esc(f.lugar || f.ciudad || "")}</h2>
        ${f.lugar && f.ciudad ? `<p class="mono">${esc(f.ciudad)}</p>` : ""}
        <div class="botones">${boton(f.boletos, "Boletos")}${boton(f.post, "Instagram")}</div>
      </div>`;
    if (typeof detalle.showModal === "function") { detalle.showModal(); document.body.classList.add("bloqueado"); detalle.scrollTop = 0; }
    else open(fs[0], "_blank");
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
      ${(D.paquetes || []).length ? `<div class="paquetes">
        <h3 class="paquetes__t">paquetes</h3>
        <ul>${D.paquetes.map((q) => `<li class="paquete">
          <div class="paquete__img" aria-hidden="true">${(q.piezas || []).slice(0, 2).map((k) => merch[k] && merch[k].foto ? `<img src="${esc(merch[k].foto)}" alt="" loading="lazy">` : "").join("")}</div>
          <div><h4>${esc(q.nombre)}</h4><p class="mono">${esc(q.detalle || "")}</p></div>
          <b class="paquete__p">$${esc(q.precio)}</b>
        </li>`).join("")}</ul>
      </div>` : ""}
      <div class="merch__pie">

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

  /* ============ CELULAR: barra inferior, hoja deslizable, merch en carrusel ============ */
  const movil = matchMedia("(max-width: 760px)");
  // sección activa en la barra
  const barra = $("#barra");
  const marcaBarra = (id) => $$("a", barra).forEach((a) => a.classList.toggle("activa", a.dataset.s === id));
  const spy = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) marcaBarra(en.target.id); }), { rootMargin: "-45% 0px -50% 0px" });
  ["inicio", "musica", "en-vivo", "merch", "contacto"].forEach((id) => { const el = document.getElementById(id); if (el) spy.observe(el); });
  // la barra aparece al salir de la portada
  new IntersectionObserver(([en]) => document.body.classList.toggle("en-portada", en.isIntersecting), { threshold: .35 }).observe($("#inicio"));
  // diálogo como hoja: se cierra deslizando hacia abajo
  let hoja = null;
  const asa = $("#detalleAsa");
  detalle.addEventListener("touchstart", (e) => {
    if (!movil.matches) return;
    const desdeAsa = e.target.closest("#detalleAsa, .detalle__cerrar");
    if (!desdeAsa && detalle.scrollTop > 0) return;
    hoja = { y: e.touches[0].clientY, dy: 0 };
  }, { passive: true });
  detalle.addEventListener("touchmove", (e) => {
    if (!hoja) return;
    hoja.dy = Math.max(0, e.touches[0].clientY - hoja.y);
    if (hoja.dy > 0) { detalle.style.transition = "none"; detalle.style.transform = `translateY(${hoja.dy}px)`; }
  }, { passive: true });
  detalle.addEventListener("touchend", () => {
    if (!hoja) return;
    detalle.style.transition = ""; detalle.style.transform = "";
    if (hoja.dy > 110) cerrar();
    hoja = null;
  });
  if (asa) asa.addEventListener("click", cerrar);
  // merch: carrusel con el dedo en el cel
  const laminas = $(".laminas");
  if (laminas) carrusel(laminas, ".lamina");

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
      if (!reduce && heroImgs.length > 1) setInterval(siguiente, 3800);
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
