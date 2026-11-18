// Exporta los formatos a PNG: node eventos/choque/exportar.js [escala]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const escala = Number(process.argv[2] || 1);
const formatos = { post: [1080, 1350], story: [1080, 1920], cuadro: [1080, 1080], identidad: [1920, 1200] };
(async () => {
  const b = await chromium.launch();
  const out = path.join(__dirname, 'export');
  fs.mkdirSync(out, { recursive: true });
  for (const [f, [w, h]] of Object.entries(formatos)) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: escala });
    await p.goto('file://' + path.join(__dirname, 'flyer.html') + '?f=' + f);
    await p.waitForSelector('body[data-listo]');
    await p.waitForTimeout(300);
    const file = path.join(out, `choque-${f}${escala > 1 ? '@' + escala + 'x' : ''}.png`);
    await (await p.$('#lienzo svg')).screenshot({ path: file });
    console.log(file);
  }
  await b.close();
})();
