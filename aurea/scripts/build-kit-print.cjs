/* ==========================================================================
   ÁUREA · Generador del Kit Imprimible (PDF listo para gráfica)
   Uso:  node aurea/scripts/build-kit-print.cjs
   Requiere: Node.js + Playwright + Chrome instalados.
   --------------------------------------------------------------------------
   Genera 12 páginas A4:
     · Páginas impares  → frentes (22 arcanos, 4 por pliego)
     · Páginas pares    → dorsos correspondientes
   Cada carta mide 70 × 121 mm, con marcas de corte y 10 mm de separación.
   Las imágenes se embeben a resolución nativa (720 × 1246 px ≈ 261 dpi)
   como JPEG de alta calidad para conservar dorados y tonos oscuros.
   ========================================================================== */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const CARDS_DIR = path.join(ROOT, "assets", "cards");
const TMP_DIR = path.join(CARDS_DIR, "_print");
const OUT = path.join(ROOT, "assets", "AUREA_Kit_Imprimible_22_Arcanos.pdf");
const PORT = 8791;
const BASE = "http://127.0.0.1:" + PORT + "/";

/* ---------- Geometría del pliego (mm) ---------- */
const PAGE_W = 210;
const PAGE_H = 297;
const CARD_W = 70;
const CARD_H = 121;
const GAP = 10;
const XS = [(PAGE_W - (CARD_W * 2 + GAP)) / 2, (PAGE_W - (CARD_W * 2 + GAP)) / 2 + CARD_W + GAP];
const YS = [(PAGE_H - (CARD_H * 2 + GAP)) / 2, (PAGE_H - (CARD_H * 2 + GAP)) / 2 + CARD_H + GAP];

const cards = fs
  .readdirSync(CARDS_DIR)
  .filter((f) => /^\d{2}-.+\.webp$/i.test(f))
  .sort();

if (cards.length !== 22) {
  console.error("Se esperaban 22 cartas y se encontraron " + cards.length);
  process.exit(1);
}

const PER_SHEET = 4;
const SHEETS = Math.ceil(cards.length / PER_SHEET);

/* ---------- Marcas de corte ---------- */
function marks(x, y) {
  const g = 1.5;   // separación entre carta y marca
  const len = 2.5; // largo de la marca
  const th = 0.2;  // grosor
  const out = [];
  const h = (left, top) =>
    '<i class="mk" style="left:' + left.toFixed(3) + "mm;top:" + top.toFixed(3) + "mm;width:" + len + "mm;height:" + th + 'mm"></i>';
  const v = (left, top) =>
    '<i class="mk" style="left:' + left.toFixed(3) + "mm;top:" + top.toFixed(3) + "mm;width:" + th + "mm;height:" + len + 'mm"></i>';

  [y, y + CARD_H].forEach((edge) => {
    out.push(h(x - g - len, edge - th / 2));
    out.push(h(x + CARD_W + g, edge - th / 2));
  });
  [x, x + CARD_W].forEach((edge) => {
    out.push(v(edge - th / 2, y - g - len));
    out.push(v(edge - th / 2, y + CARD_H + g));
  });
  return out.join("");
}

/* ---------- Hoja ---------- */
function sheetHTML({ index, side, files }) {
  const isBack = side === "dorso";
  const cardsHTML = files
    .map((file, i) => {
      const x = XS[i % 2];
      const y = YS[Math.floor(i / 2)];
      return (
        '<div class="card" style="left:' + x + "mm;top:" + y + 'mm">' +
        '<img src="' + BASE + "assets/cards/_print/" + file + '" alt="">' +
        "</div>" +
        marks(x, y)
      );
    })
    .join("");

  const label =
    "ÁUREA · KIT IMPRIMIBLE · PLIEGO " + (index + 1) + " DE " + SHEETS +
    " · " + (isBack ? "DORSO" : "FRENTE");
  const foot = "22 arcanos · Carta 70 × 121 mm · Doble faz · Papel ilustración mate";

  return (
    '<section class="sheet' + (isBack ? " is-back" : "") + '">' +
    '<p class="head-label">' + label + "</p>" +
    cardsHTML +
    '<p class="foot-label">' + foot + "</p>" +
    "</section>"
  );
}

function buildHTML() {
  let pages = "";
  for (let i = 0; i < SHEETS; i++) {
    const front = cards.slice(i * PER_SHEET, i * PER_SHEET + PER_SHEET);
    const backs = front.map(() => "dorso.jpg");
    pages += sheetHTML({ index: i, side: "frente", files: front.map((f) => f.replace(/\.webp$/i, ".jpg")) });
    pages += sheetHTML({ index: i, side: "dorso", files: backs });
  }

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>ÁureA · Kit imprimible</title>
<style>
  @page { size: 210mm 297mm; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #fff; }
  body { font-family: "Segoe UI", Arial, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  .sheet {
    position: relative;
    width: 210mm; height: 297mm;
    background: #fff;
    overflow: hidden;
    page-break-after: always;
    break-after: page;
  }
  .sheet:last-child { page-break-after: auto; break-after: auto; }

  .card {
    position: absolute;
    width: 70mm; height: 121mm;
    overflow: hidden;
    background: #0a0810;
  }
  .card img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .sheet.is-back .card img { transform: scaleX(-1); }

  .mk { position: absolute; display: block; background: #000; }

  .head-label, .foot-label {
    position: absolute; left: 30mm; width: 150mm;
    margin: 0; font-size: 5.5pt; letter-spacing: 0.08em;
    color: #8a8a8a; text-transform: uppercase;
  }
  .head-label { top: 10mm; }
  .foot-label { bottom: 9mm; text-align: center; }
</style>
</head>
<body>${pages}</body>
</html>`;
}

/* ---------- Servidor local ---------- */
const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "application/javascript",
  ".webp": "image/webp", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
};
const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (url === "/_blank") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<!doctype html><meta charset=utf-8><title>blank</title>");
    return;
  }
  const file = path.resolve(path.join(ROOT, url.replace(/\//g, path.sep)));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end("not found"); return;
  }
  res.writeHead(200, {
    "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-store",
  });
  res.end(fs.readFileSync(file));
});

/* ---------- Conversión WebP → JPEG (calidad de impresión) ---------- */
async function convertCards(page) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
  const list = cards.concat(["dorso.webp"]);
  const data = await page.evaluate(async (files) => {
    const out = [];
    for (const name of files) {
      const res = await fetch("assets/cards/" + encodeURIComponent(name));
      const bmp = await createImageBitmap(await res.blob());
      const canvas = document.createElement("canvas");
      canvas.width = bmp.width;
      canvas.height = bmp.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(bmp, 0, 0);
      out.push([name, canvas.toDataURL("image/jpeg", 0.86).split(",")[1]]);
      bmp.close();
    }
    return out;
  }, list);

  data.forEach(([name, b64]) => {
    fs.writeFileSync(path.join(TMP_DIR, name.replace(/\.webp$/i, ".jpg")), Buffer.from(b64, "base64"));
  });
}

/* ---------- Ejecución ---------- */
server.listen(PORT, "127.0.0.1", async () => {
  let browser;
  try {
    browser = await chromium.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto(BASE + "_blank", { waitUntil: "domcontentloaded" });
    await convertCards(page);

    await page.setContent(buildHTML(), { waitUntil: "load" });
    const broken = await page.evaluate(() =>
      Array.from(document.images).filter((img) => !img.complete || img.naturalWidth === 0).length
    );
    if (broken > 0) throw new Error("No se cargaron " + broken + " imágenes del mazo");
    await page.evaluate(() =>
      Promise.all(Array.from(document.images).map((img) => img.decode().catch(() => {})))
    );

    await page.pdf({
      path: OUT,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    if (process.env.KIT_PREVIEW) {
      const os = require("os");
      const dir = path.join(os.tmpdir(), "aurea-kit-preview");
      fs.mkdirSync(dir, { recursive: true });
      const preview = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
      await preview.setContent(buildHTML(), { waitUntil: "load" });
      await preview.waitForTimeout(500);
      const sheets = await preview.locator(".sheet").count();
      for (const idx of [1, 2, sheets]) {
        await preview.locator(".sheet").nth(idx - 1).screenshot({ path: path.join(dir, "pliego-" + idx + ".png") });
      }
      console.log("Previews: " + dir);
      await preview.close();
    }

    const kb = Math.round(fs.statSync(OUT).size / 1024);
    console.log("Kit imprimible generado: " + OUT);
    console.log("Pliegos: " + SHEETS + " · Páginas: " + SHEETS * 2 + " · Peso: " + kb + " KB");
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
    server.close();
  }
});
