// Génère des images d'exemple (SVG) pour les produits de démo.
// À supprimer / ignorer une fois que tu as ajouté tes vraies photos.
import { mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";

const METALS = {
  or: ["#F6E4AE", "#C6A15B", "#7A5E2B"],
  "or-rose": ["#F6D3C4", "#C98E77", "#8A5642"],
  argent: ["#F4F5F7", "#B9BEC6", "#6E747C"],
  noir: ["#4A4A4E", "#26262A", "#101012"],
};

function grad(id, stops) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${stops[0]}"/>
    <stop offset=".5" stop-color="${stops[1]}"/>
    <stop offset="1" stop-color="${stops[2]}"/></linearGradient>`;
}

function ringSVG(metal) {
  const s = METALS[metal];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs>${grad("m", s)}</defs>
  <rect width="600" height="600" fill="#100E0C"/>
  <ellipse cx="300" cy="340" rx="185" ry="185" fill="none" stroke="url(#m)" stroke-width="58"/>
  <path d="M300 90l58 64-58 58-58-58z" fill="url(#m)" stroke="rgba(255,255,255,.35)" stroke-width="3"/>
</svg>`;
}

function watchSVG(metal) {
  const s = METALS[metal];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs>${grad("m", s)}</defs>
  <rect width="600" height="600" fill="#100E0C"/>
  <rect x="262" y="70" width="76" height="150" rx="16" fill="url(#m)"/>
  <rect x="262" y="380" width="76" height="150" rx="16" fill="url(#m)"/>
  <circle cx="300" cy="300" r="150" fill="#0A0908" stroke="url(#m)" stroke-width="20"/>
  <circle cx="300" cy="300" r="118" fill="none" stroke="url(#m)" stroke-width="3" opacity=".5"/>
  <line x1="300" y1="300" x2="300" y2="210" stroke="url(#m)" stroke-width="8" stroke-linecap="round"/>
  <line x1="300" y1="300" x2="360" y2="330" stroke="url(#m)" stroke-width="8" stroke-linecap="round"/>
  <circle cx="300" cy="300" r="9" fill="url(#m)"/>
</svg>`;
}

const files = {
  "public/products/bague-onyx/or.svg": ringSVG("or"),
  "public/products/bague-onyx/or-rose.svg": ringSVG("or-rose"),
  "public/products/bague-onyx/argent.svg": ringSVG("argent"),
  "public/products/bague-onyx/noir.svg": ringSVG("noir"),
  "public/products/montre-onyx-classic/or.svg": watchSVG("or"),
  "public/products/montre-onyx-classic/argent.svg": watchSVG("argent"),
  "public/products/montre-onyx-classic/noir.svg": watchSVG("noir"),
};

for (const [path, content] of Object.entries(files)) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  console.log("écrit:", path);
}
console.log("Terminé.");
