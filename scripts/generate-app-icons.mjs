/**
 * Renders one frame of src/assets/lottie/app-logo.json to PNG + SVG for favicon / PWA.
 * Browsers and install manifests need static images — not Lottie JSON.
 *
 * Usage: yarn icons
 * Requires: canvas, jsdom, sharp, lottie-web (see package.json devDependencies)
 */

import "canvas";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const lottieJsonPath = path.join(root, "src/assets/lottie/app-logo.json");
const publicDir = path.join(root, "public");

/** Frame index (inclusive) for the static “logo” pose — tweak if you want a different moment. */
const ICON_FRAME = 72;

function installJsdomGlobals(window, width, height) {
  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
  globalThis.getComputedStyle = window.getComputedStyle.bind(window);
  Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: height });

  /** Node 21+ may define read-only `globalThis.navigator`; replace with jsdom’s. */
  const nav = window.navigator;
  try {
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      enumerable: true,
      value: nav,
      writable: true,
    });
  } catch {
    try {
      Reflect.deleteProperty(globalThis, "navigator");
    } catch {
      /* ignore */
    }
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      enumerable: true,
      value: nav,
      writable: true,
    });
  }
}

async function main() {
  const { JSDOM } = await import("jsdom");
  const sharp = (await import("sharp")).default;

  const animationData = JSON.parse(fs.readFileSync(lottieJsonPath, "utf8"));
  const compW = animationData.w ?? 1080;
  const compH = animationData.h ?? 1080;

  const dom = new JSDOM(
    `<!DOCTYPE html><html><body><div id="lottie-root" style="width:${compW}px;height:${compH}px"></div></body></html>`,
    { pretendToBeVisual: true },
  );

  const { window } = dom;
  installJsdomGlobals(window, compW, compH);

  /** SVG-only build — default `lottie-web` loads canvas code and breaks under jsdom without `canvas`. */
  const lottieMod = await import("lottie-web/build/player/lottie_svg.js");
  const lottie = lottieMod.default ?? lottieMod;

  const container = window.document.getElementById("lottie-root");
  const anim = lottie.loadAnimation({
    container,
    renderer: "svg",
    loop: false,
    autoplay: false,
    animationData,
  });

  await new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Lottie DOMLoaded timeout")), 15000);
    anim.addEventListener("DOMLoaded", () => {
      clearTimeout(t);
      resolve();
    });
    anim.addEventListener("data_failed", () => {
      clearTimeout(t);
      reject(new Error("Lottie data_failed"));
    });
  });

  const frame = Math.min(ICON_FRAME, Math.max(0, anim.totalFrames - 1));
  anim.goToAndStop(frame, true);

  const svgEl = container.querySelector("svg");
  if (!svgEl) throw new Error("No SVG output from Lottie");

  if (!svgEl.getAttribute("xmlns")) {
    svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }
  svgEl.setAttribute("width", String(compW));
  svgEl.setAttribute("height", String(compH));

  const svgString = svgEl.outerHTML;
  fs.mkdirSync(publicDir, { recursive: true });

  const faviconSvgPath = path.join(publicDir, "favicon.svg");
  fs.writeFileSync(faviconSvgPath, svgString, "utf8");
  console.log("Wrote", path.relative(root, faviconSvgPath));

  const raster = async (size, filename) => {
    const buf = await sharp(Buffer.from(svgString))
      .resize(size, size, { fit: "contain", background: { r: 21, g: 43, b: 38, alpha: 1 } })
      .png()
      .toBuffer();
    const out = path.join(publicDir, filename);
    fs.writeFileSync(out, buf);
    console.log("Wrote", path.relative(root, out));
  };

  await raster(32, "favicon-32.png");
  await raster(192, "icon-192.png");
  await raster(512, "icon-512.png");
  await raster(180, "apple-touch-icon.png");

  anim.destroy();
  console.log("Done. Re-run after changing app-logo.json or ICON_FRAME.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
