/* =====================================================================
   CONTENIDO DEL SITIO — acordeacorde
   ---------------------------------------------------------------------
   Edita este archivo para actualizar música, shows, merch y archivo.
   Todo lo que esté en null o vacío se muestra como "pendiente" en la
   página: nada se inventa. No hace falta tocar index.html ni main.js.
   ===================================================================== */
window.AAC = {

  /* ---------- Enlaces oficiales ----------
     Pega aquí las URLs completas. Si un valor es null, el botón
     aparece como "enlace pendiente" y no lleva a ningún lado. */
  enlaces: {
    spotify:    "https://open.spotify.com/artist/30RUl4HTPHJGzQqRHe2yyr",
    appleMusic: null,
    youtube:    null,
    bandcamp:   null,
    tiktok:     null,
    instagram:  "https://www.instagram.com/acorde_acorde/",
    linktree:   "https://linktr.ee/acordeacorde",
  },

  contacto: {
    correo: "acordeacordemusic@gmail.com",
    instagram: "@acorde_acorde",
  },

  /* ---------- Discografía ----------
     tipo: "Sencillo" | "Álbum" | "EP"
     portada: ruta a imagen en assets/portadas/ (cuadrada) o null
     spotifyEmbed: URL de "Insertar" de Spotify (open.spotify.com/embed/...) o null
     spotifyAlto: 152 para sencillo, 352 para álbum
     bandcampEmbed: URL del reproductor de Bandcamp o null
     youtube: ID del video (lo que va después de watch?v=) o null
     canciones: [["Nombre", "3:45"], ...] — vacío = tracklist pendiente */
  lanzamientos: [
    {
      tipo: "Sencillo", estado: "nuevo",
      fecha: "5 ago 2026", titulo: "el pedo no son las drogas",
      nota: "Primer adelanto del siguiente disco.",
      portada: "assets/portadas/el-pedo-no-son-las-drogas.webp",
      portadaAlt: "Portada de el pedo no son las drogas: un pasamontañas tejido en blanco y negro de alto contraste.",
      spotifyEmbed: "https://open.spotify.com/embed/album/5OqBcJx1HcbrGkbej8yUD1", spotifyAlto: 152,
      bandcampEmbed: null, youtube: null,
      enlaces: { spotify: "https://open.spotify.com/album/5OqBcJx1HcbrGkbej8yUD1", appleMusic: null, youtube: null, bandcamp: null },
      canciones: [["el pedo no son las drogas", "5:40"]],
    },
    {
      tipo: "Álbum", estado: "debut",
      fecha: "14 nov 2025", titulo: "La Idea",
      nota: "Álbum debut. Nueve canciones, 26 minutos.",
      portada: "assets/portadas/la-idea.webp",
      portadaAlt: "Portada de La Idea: ilustración en tinta de un samurái con armadura entre nubes.",
      spotifyEmbed: "https://open.spotify.com/embed/album/1QBpP1M0CYkOCVw32arABe", spotifyAlto: 352,
      bandcampEmbed: null, youtube: null,
      enlaces: { spotify: "https://open.spotify.com/album/1QBpP1M0CYkOCVw32arABe", appleMusic: null, youtube: null, bandcamp: null },
      canciones: [
        ["Intro", "1:00"],
        ["Mensajes", "2:16"],
        ["Confianza", "3:46"],
        ["Mal día para mi hígado pt1", "2:11"],
        ["Mal día para mi hígado pt2", "2:10"],
        ["Paquito y Bonney", "1:28"],
        ["La idea", "3:01"],
        ["Lágrimas", "3:14"],
        ["Es así desde la era de los dinosaurios", "6:52"],
      ],
    },
    {
      tipo: "Sencillo", estado: null,
      fecha: "22 jul 2025", titulo: "Mal día para mi hígado pt1",
      nota: "Tercer sencillo. También está en La Idea.",
      portada: "assets/portadas/mal-dia-pt1.webp",
      portadaAlt: "Portada de Mal día para mi hígado pt1: retrato de un integrante con pasamontañas tejido negro.",
      spotifyEmbed: "https://open.spotify.com/embed/album/5DNhL2nTByGQ9u0zGrM5tk", spotifyAlto: 152,
      bandcampEmbed: null, youtube: null,
      enlaces: { spotify: "https://open.spotify.com/album/5DNhL2nTByGQ9u0zGrM5tk", appleMusic: null, youtube: null, bandcamp: null },
      canciones: [["Mal día para mi hígado pt1", "2:11"]],
    },
    {
      tipo: "Sencillo", estado: null,
      fecha: "13 jun 2025", titulo: "Lágrimas",
      nota: "Segundo sencillo. También está en La Idea.",
      portada: "assets/portadas/lagrimas.webp",
      portadaAlt: "Portada de Lágrimas: una figura enmascarada sobre un aire acondicionado, de noche, entre humo.",
      spotifyEmbed: "https://open.spotify.com/embed/album/1fbxq39Iuq4RFuhgRgO1Bj", spotifyAlto: 152,
      bandcampEmbed: null, youtube: null,
      enlaces: { spotify: "https://open.spotify.com/album/1fbxq39Iuq4RFuhgRgO1Bj", appleMusic: null, youtube: null, bandcamp: null },
      canciones: [["Lágrimas", "3:14"]],
    },
    {
      tipo: "Sencillo", estado: "primero",
      fecha: "2 may 2025", titulo: "Mensajes",
      nota: "El primero. Donde empezó todo.",
      portada: "assets/portadas/mensajes.webp",
      portadaAlt: "Portada de Mensajes: figuras enmascaradas con los brazos en alto entre árboles, de noche.",
      spotifyEmbed: "https://open.spotify.com/embed/album/45tyRCeeSmE5GMm0dFcO6L", spotifyAlto: 152,
      bandcampEmbed: null, youtube: null,
      enlaces: { spotify: "https://open.spotify.com/album/45tyRCeeSmE5GMm0dFcO6L", appleMusic: null, youtube: null, bandcamp: null },
      canciones: [["Mensajes", "2:16"]],
    },
  ],

  /* ---------- Funciones ----------
     fecha en formato "AAAA-MM-DD". Las fechas que ya pasaron se mueven
     solas a "Funciones pasadas". lugar/ciudad null = "por confirmar". */
  funciones: [
    { fecha: "2025-07-01", fechaTexto: "Julio 2025", ciudad: "Monterrey, N.L.", lugar: null,
      nota: "Primera presentación en vivo.", boletos: null, cartel: null },
  ],

  /* ---------- Merch ----------
     Cada pieza: { nombre, descripcion, foto, precio, disponible }
     precio null = "consultar". Lista vacía = catálogo en preparación. */
  merch: [],

  /* ---------- Foto del público ----------
     Va de fondo en "escríbenos": entra en blanco y negro y pasa a color
     al hacer scroll. */
  publico: {
    src: "assets/img/publico", anchos: [640, 1600], w: 1600, h: 1066, foco: "50% 60%",
    alt: "acordeacorde y su público al final de una función: todos con las manos en alto.",
  },

  /* ---------- Archivo ----------
     tipo: "foto" | "cartel" | "video" | "documento"
     src: ruta base SIN tamaño ni extensión (herramientas/optimizar_fotos.py
     genera los archivos y te da la línea lista).
     portada: true = aparece en la hoja de contactos del inicio (en este orden).
     foco: qué parte de la foto se conserva al recortar ("50% 30%" = centro, arriba). */
  archivo: [
    { tipo: "foto", portada: true, foco: "50% 22%", src: "assets/img/voz-costura", anchos: [640, 1600], w: 1600, h: 2133,
      alt: "El vocalista canta con un pasamontañas mitad negro y mitad blanco unido por una costura roja en X." },
    { tipo: "foto", portada: true, foco: "45% 40%", src: "assets/img/bajo-guitarra-rojo", anchos: [640, 1600], w: 1600, h: 1066,
      alt: "Bajo y guitarra semihueca bajo luz roja, con el público en primer plano." },
    { tipo: "foto", portada: true, foco: "50% 30%", src: "assets/img/voz-lata", anchos: [640, 1600], w: 1600, h: 1066,
      alt: "La voz, con pasamontañas mitad negro y mitad blanco cosido en rojo, posa con una lata frente a la batería." },
    { tipo: "foto", portada: true, foco: "50% 28%", src: "assets/img/bajo-tejido", anchos: [640, 1600], w: 1600, h: 2133,
      alt: "El bajista toca con una máscara tejida negra con orillas blancas, bajo luz azul." },
    { tipo: "foto", portada: true, foco: "50% 34%", src: "assets/img/bateria-cuernos", anchos: [640, 1440], w: 1440, h: 1920,
      alt: "El baterista, con pasamontañas negro con cuernos, detrás de la batería bajo luz roja." },
    { tipo: "foto", portada: true, foco: "50% 40%", src: "assets/img/guitarra-rodilla", anchos: [640, 1440], w: 1440, h: 1920,
      alt: "El guitarrista, de playera roja y pasamontañas, toca hincado en el escenario entre destellos de luz violeta." },
    { tipo: "foto", portada: true, foco: "45% 40%", src: "assets/img/sax", anchos: [640, 1600], w: 1600, h: 1063,
      alt: "Saxofonista con pasamontañas blanco toca entre estelas de luz de colores." },
    { tipo: "foto", portada: true, foco: "50% 30%", src: "assets/img/lap-steel-piso", anchos: [640, 1600], w: 1600, h: 1063,
      alt: "El vocalista, sudado y en cuclillas, toca un lap steel en el piso rodeado de pedales." },
    { tipo: "foto", portada: true, foco: "50% 30%", src: "assets/img/bateria-azul", anchos: [640, 1600], w: 1600, h: 1066,
      alt: "Batería bajo luz azul: pasamontañas negro con cuernos y costura blanca." },
    { tipo: "foto", portada: true, foco: "45% 35%", src: "assets/img/sax-contraluz", anchos: [640, 1600], w: 1600, h: 1066,
      alt: "Saxofón a contraluz, en blanco y negro: una figura con pasamontañas se lleva la mano a la cara." },
    { tipo: "foto", foco: "55% 40%", src: "assets/img/bateria-sombra", anchos: [640, 1600], w: 1600, h: 1066,
      alt: "Batería entre sombras azules, vista a través del escenario." },
    { tipo: "foto", foco: "50% 40%", src: "assets/img/contraluz-luces", anchos: [640, 1600], w: 1600, h: 1066,
      alt: "Silueta a contraluz bajo las luces del escenario, en blanco y negro; abajo asoma el clavijero de una guitarra." },
    { tipo: "foto", src: "assets/img/bajo-extintor", anchos: [640, 1440], w: 1440, h: 1920,
      alt: "El bajista con máscara tejida de orejas largas toca junto a un extintor." },
    { tipo: "foto", src: "assets/img/guitarra-barrido", anchos: [640, 1600], w: 1600, h: 1063,
      alt: "El guitarrista de playera roja en movimiento, barrido por luz azul; al fondo una X roja." },
    { tipo: "foto", src: "assets/img/micro-pedales", anchos: [640, 1600], w: 1600, h: 1063,
      alt: "Una mano aprieta un micrófono mientras la otra gira las perillas de un pedal azul." },
    { tipo: "foto", src: "assets/img/guitarra-luces", anchos: [640, 1440], w: 1440, h: 1920,
      alt: "El guitarrista con el brazo extendido entre estelas de luz neón rosa y amarilla." },
    { tipo: "foto", src: "assets/img/lap-steel-manos", anchos: [640, 1600], w: 1600, h: 1063,
      alt: "Manos sobre las cuerdas de un lap steel, con pedales en el piso bajo luz azul." },
    { tipo: "foto", src: "assets/img/guitarra-bn", anchos: [640, 1440], w: 1440, h: 1920,
      alt: "Foto en blanco y negro del guitarrista con la cabeza convertida en estelas de luz." },
    { tipo: "foto", src: "assets/img/banda-retrato", anchos: [640, 1280], w: 1280, h: 852,
      alt: "Tres integrantes de acordeacorde posan frente a una pared con pasamontañas negros; uno hace la señal de paz." },
    { tipo: "foto", src: "assets/img/bajo-vivo", anchos: [640, 852], w: 852, h: 1280,
      alt: "El bajista toca un bajo blanco con la cabeza cubierta por una máscara negra con picos." },
    { tipo: "foto", src: "assets/img/ensayo-escenario", anchos: [640, 1280], w: 1280, h: 852,
      alt: "La banda toca en un escenario oscuro con una televisión encendida sobre las bocinas." },
    { tipo: "foto", src: "assets/img/guitarra-detalle", anchos: [640, 852], w: 852, h: 1280,
      alt: "Primer plano de manos tocando una guitarra eléctrica semihueca negra." },
  ],
};
