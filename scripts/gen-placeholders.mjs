// Génère des VISUELS PROVISOIRES (SVG) pour la montre, aux 5 couleurs.
// À remplacer par tes vraies photos (voir README > "Ajouter un produit").
import { mkdirSync, writeFileSync, rmSync } from "fs";
import { dirname } from "path";

// palette par couleur : [boîtier, cadran clair, cadran foncé, aiguilles, index]
const PAL = {
  bleu:      ["#2B3350", "#F2F4F8", "#2E5AA8", "#FFFFFF", "#8FA0C0"],
  noir:      ["#17171A", "#2A2A2E", "#121214", "#EDEDED", "#6E6E74"],
  turquoise: ["#49C6B6", "#DFF6F1", "#49C6B6", "#0E5B52", "#2E9488"],
  blanc:     ["#E9E9E6", "#FBFBFA", "#D9D9D4", "#9A9A93", "#B8B8B0"],
  rose:      ["#F0348B", "#FBC7E0", "#F0348B", "#FFFFFF", "#C41E6E"],
};

function watch(c) {
  const [caseC, dialA, dialB, hand, idx] = PAL[c];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${dialA}"/><stop offset="1" stop-color="${dialB}"/></linearGradient>
    <linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${caseC}" stop-opacity=".82"/><stop offset="1" stop-color="${caseC}"/></linearGradient>
  </defs>
  <rect width="600" height="600" fill="#0E0D0C"/>
  <!-- bracelet -->
  <g fill="url(#c)">
    <rect x="250" y="46"  width="100" height="52" rx="12"/>
    <rect x="252" y="104" width="96"  height="46" rx="10"/>
    <rect x="250" y="502" width="100" height="52" rx="12"/>
    <rect x="252" y="450" width="96"  height="46" rx="10"/>
  </g>
  <!-- boîtier octogonal -->
  <polygon points="300,140 407,183 450,300 407,417 300,460 193,417 150,300 193,183"
    fill="url(#c)" stroke="rgba(255,255,255,.14)" stroke-width="3"/>
  <circle cx="300" cy="300" r="118" fill="url(#d)"/>
  <circle cx="300" cy="300" r="118" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="2"/>
  <!-- index -->
  <g stroke="${idx}" stroke-width="5" stroke-linecap="round">
    <line x1="300" y1="196" x2="300" y2="212"/>
    <line x1="404" y1="300" x2="388" y2="300"/>
    <line x1="300" y1="404" x2="300" y2="388"/>
    <line x1="196" y1="300" x2="212" y2="300"/>
  </g>
  <!-- aiguilles -->
  <line x1="300" y1="300" x2="300" y2="228" stroke="${hand}" stroke-width="7" stroke-linecap="round"/>
  <line x1="300" y1="300" x2="352" y2="330" stroke="${hand}" stroke-width="7" stroke-linecap="round"/>
  <circle cx="300" cy="300" r="8" fill="${hand}"/>
  <!-- couronne -->
  <rect x="448" y="288" width="16" height="24" rx="4" fill="url(#c)"/>
</svg>`;
}

// Montre "Éclipse" : boîtier noir, cadran nacré noir & blanc à chiffres arabes.
function eclipse() {
  const caseC = "#141416";
  const nums = ["١٢", "٣", "٦", "٩"]; // 12, 3, 6, 9 en chiffres arabes
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#26262A"/><stop offset="1" stop-color="${caseC}"/></linearGradient>
    <clipPath id="dial"><circle cx="300" cy="300" r="118"/></clipPath>
  </defs>
  <rect width="600" height="600" fill="#0E0D0C"/>
  <g fill="url(#c)">
    <rect x="250" y="46"  width="100" height="52" rx="12"/>
    <rect x="252" y="104" width="96"  height="46" rx="10"/>
    <rect x="250" y="502" width="100" height="52" rx="12"/>
    <rect x="252" y="450" width="96"  height="46" rx="10"/>
  </g>
  <polygon points="300,140 407,183 450,300 407,417 300,460 193,417 150,300 193,183"
    fill="url(#c)" stroke="rgba(255,255,255,.16)" stroke-width="3"/>
  <g clip-path="url(#dial)">
    <rect x="182" y="182" width="236" height="236" fill="#0B0B0D"/>
    <path d="M182 300 Q250 210 300 250 Q360 300 300 360 Q250 410 182 372 Z" fill="#EDEEF0"/>
    <path d="M300 182 Q330 250 300 250 Q270 250 300 182Z" fill="#F2F3F5" opacity=".8"/>
    <ellipse cx="255" cy="300" rx="70" ry="95" fill="#F0F1F3" opacity=".92"/>
  </g>
  <circle cx="300" cy="300" r="118" fill="none" stroke="rgba(255,255,255,.10)" stroke-width="2"/>
  <g font-family="Arial" font-size="26" fill="#C9CBD0">
    <text x="300" y="214" text-anchor="middle">${nums[0]}</text>
    <text x="388" y="309" text-anchor="middle">${nums[1]}</text>
    <text x="300" y="398" text-anchor="middle">${nums[2]}</text>
    <text x="212" y="309" text-anchor="middle">${nums[3]}</text>
  </g>
  <line x1="300" y1="300" x2="300" y2="232" stroke="#F5F5F5" stroke-width="6" stroke-linecap="round"/>
  <line x1="300" y1="300" x2="346" y2="332" stroke="#F5F5F5" stroke-width="6" stroke-linecap="round"/>
  <circle cx="300" cy="300" r="7" fill="#F5F5F5"/>
  <rect x="448" y="288" width="16" height="24" rx="4" fill="url(#c)"/>
</svg>`;
}

// on repart propre : on efface les anciens dossiers d'exemple
for (const old of ["public/products/bague-onyx", "public/products/montre-onyx-classic"]) {
  rmSync(old, { recursive: true, force: true });
}

for (const c of Object.keys(PAL)) {
  const path = `public/products/montre-onyx-arabesque/${c}.svg`;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, watch(c));
  console.log("écrit:", path);
}
const ecPath = "public/products/montre-onyx-eclipse/noir.svg";
mkdirSync(dirname(ecPath), { recursive: true });
writeFileSync(ecPath, eclipse());
console.log("écrit:", ecPath);
console.log("Terminé.");
