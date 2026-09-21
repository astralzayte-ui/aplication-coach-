#!/usr/bin/env python3
"""
FORMA — generateur d'identite visuelle.

Produit tous les SVG de brand/ (marques, lockups, icones d'app, favicons)
a partir d'une seule source de verite : les tokens de design du prototype
et la geometrie decrite ci-dessous.

Dependances : fonttools (pip install fonttools).
La police Space Grotesk (Bold) est telechargee depuis Google Fonts et mise
en cache dans brand/tools/.cache/ ; les textes sont vectorises (converted to
outlines) pour que les SVG soient autonomes, sans dependance a une webfont.

Usage : python3 brand/tools/build_logos.py
"""

import json
import math
import os
import shutil
import subprocess
import urllib.request

from fontTools.misc.transform import Transform
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

# --------------------------------------------------------------------------
# Tokens (identiques au prototype — voir README.md « Design Tokens »)
# --------------------------------------------------------------------------
ACCENT      = "#4F7DD1"   # bleu acier, accent principal
ACCENT_DEEP = "#3A5EA3"   # ombre / bas de gradient
INK         = "#0D0F13"   # fond app
SURFACE     = "#15181E"   # surface
PAPER       = "#F2F4EE"   # texte / logo sur fond sombre
GREEN       = "#7BD957"   # semantique : bonne progression

FONT_URL = ("https://fonts.gstatic.com/s/spacegrotesk/v22/"
            "V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj4PVksj.ttf")  # Space Grotesk 700

ROOT      = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # brand/
CACHE     = os.path.join(ROOT, "tools", ".cache")
FONT_PATH = os.path.join(CACHE, "SpaceGrotesk-Bold.ttf")


# --------------------------------------------------------------------------
# Typographie : glyphes -> chemins SVG
# --------------------------------------------------------------------------
def ensure_font():
    if os.path.exists(FONT_PATH):
        return FONT_PATH
    os.makedirs(CACHE, exist_ok=True)
    try:
        with urllib.request.urlopen(FONT_URL, timeout=30) as r, open(FONT_PATH, "wb") as f:
            shutil.copyfileobj(r, f)
    except Exception:
        # environnements derriere un proxy : curl est deja configure
        subprocess.run(["curl", "-sS", "-L", "-o", FONT_PATH, FONT_URL], check=True)
    return FONT_PATH


class Face:
    """Un acces minimal a la police : chemins de glyphes et chasses."""

    def __init__(self, path):
        self.font = TTFont(path)
        self.upem = self.font["head"].unitsPerEm
        self.gs = self.font.getGlyphSet()
        self.cmap = self.font.getBestCmap()
        self.hmtx = self.font["hmtx"]
        self.cap = self.font["OS/2"].sCapHeight / self.upem  # hauteur de capitale, en em

    def advance(self, ch, size):
        return self.hmtx[self.cmap[ord(ch)]][0] * size / self.upem

    def ink_bounds(self, ch, size, baseline=0.0):
        """Bornes reelles du trace (et non la chasse) — pour le centrage optique."""
        pen = BoundsPen(self.gs)
        scale = size / self.upem
        self.gs[self.cmap[ord(ch)]].draw(TransformPen(pen, Transform(scale, 0, 0, -scale, 0, baseline)))
        return pen.bounds

    def text(self, s, size, x=0.0, baseline=0.0, tracking=0.0):
        """Retourne (d, largeur) du texte vectorise, ancre sur sa ligne de base."""
        pen = SVGPathPen(self.gs, ntos=lambda v: f"{v:.2f}")
        scale = size / self.upem
        cursor = x
        for ch in s:
            name = self.cmap.get(ord(ch))
            if name is None:
                continue
            self.gs[name].draw(TransformPen(pen, Transform(scale, 0, 0, -scale, cursor, baseline)))
            cursor += self.advance(ch, size) + tracking
        return pen.getCommands(), cursor - x - (tracking if s else 0)


# --------------------------------------------------------------------------
# Les quatre marques — geometrie sur une grille de 64 x 64
# --------------------------------------------------------------------------
# Chaque marque renvoie du markup SVG. `duo` = version couleur (deux tons),
# sinon tout est rendu en `currentColor` pour les declinaisons monochromes.

def grad(id_, a=ACCENT, b=ACCENT_DEEP):
    return (f'<linearGradient id="{id_}" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/>'
            f'</linearGradient>')


def mark_orbe(duo, uid):
    """ORBE — l'anneau de progression referme sur un F.
    Arc ouvert de 290 deg : le cycle en cours, jamais tout a fait clos.
    Le point terminal est le releve du jour sur la courbe de poids."""
    r, sw, sweep = 25, 7, 300
    a0 = math.radians(-90 + (360 - sweep) / 2)      # ouverture centree sur midi
    a1 = math.radians(-90 + (360 - sweep) / 2 + sweep)
    x0, y0 = 32 + r * math.cos(a0), 32 + r * math.sin(a0)
    x1, y1 = 32 + r * math.cos(a1), 32 + r * math.sin(a1)
    ring_fill = f"url(#{uid}g)" if duo else "currentColor"
    dot = (f'<circle cx="{x1:.2f}" cy="{y1:.2f}" r="{sw/2+1.3:.2f}" fill="{GREEN}"/>'
           if duo else "")
    size = 26 / FACE.cap
    base = 32 + 13
    d, _ = FACE.text("F", size, baseline=base)
    bx0, _, bx1, _ = FACE.ink_bounds("F", size, base)            # centrage optique
    d = f'<path transform="translate({32 - (bx0 + bx1) / 2:.2f},0)" d="{d}" fill="{PAPER if duo else "currentColor"}"/>'
    defs = f"<defs>{grad(uid + 'g')}</defs>" if duo else ""
    return (f'{defs}<path d="M{x0:.2f} {y0:.2f} A{r} {r} 0 1 1 {x1:.2f} {y1:.2f}" '
            f'fill="none" stroke="{ring_fill}" stroke-width="{sw}" stroke-linecap="round"/>'
            f'{dot}{d}')


def chevron(cx, apex, half, drop):
    return f"M{cx-half} {apex+drop} L{cx} {apex} L{cx+half} {apex+drop}"


def mark_elan(duo, uid):
    """ELAN — deux chevrons : le coach devant, l'eleve dans sa foulee.
    Lu de loin : une fleche vers le haut ; lu de pres : le A de FORMA."""
    top = chevron(32, 15, 20, 16)          # le coach, devant
    bot = chevron(32, 34, 15, 12)          # l'eleve, dans sa foulee
    c_top = f"url(#{uid}g)" if duo else "currentColor"
    c_bot = PAPER if duo else "currentColor"
    o_bot = "" if duo else ' opacity=".45"'
    defs = f"<defs>{grad(uid + 'g')}</defs>" if duo else ""
    return (f'{defs}<path d="{bot}" stroke="{c_bot}"{o_bot} fill="none" stroke-width="7.5"'
            f' stroke-linecap="round" stroke-linejoin="round"/>'
            f'<path d="{top}" stroke="{c_top}" fill="none" stroke-width="9"'
            f' stroke-linecap="round" stroke-linejoin="round"/>')


def mark_barre(duo, uid):
    """BARRE — le F dont la barre mediane est un halter.
    Le seul signe explicitement « salle de sport » de la famille."""
    c = f"url(#{uid}g)" if duo else "currentColor"
    defs = f"<defs>{grad(uid + 'g')}</defs>" if duo else ""
    return (f'{defs}'
            f'<rect x="11" y="10" width="11" height="44" rx="5.5" fill="{c}"/>'
            f'<rect x="11" y="10" width="41" height="11" rx="5.5" fill="{c}"/>'
            # bras median = barre + deux disques, d un seul tenant avec le fut
            f'<g fill="{c}">'
            f'<rect x="11" y="27" width="35" height="7" rx="3.5"/>'
            f'<rect x="24.5" y="21" width="7" height="19" rx="3.5"/>'
            f'<rect x="37.5" y="21" width="7" height="19" rx="3.5"/>'
            f'</g>')


def mark_cap(duo, uid):
    """CAP — la coche du jour qui se prolonge en fleche.
    La discipline quotidienne (« entrainement : oui / repas : oui »)
    est litteralement ce qui produit la trajectoire."""
    c = f"url(#{uid}g)" if duo else "currentColor"
    check = PAPER if duo else "currentColor"
    o_check = "" if duo else ' opacity=".45"'
    defs = f"<defs>{grad(uid + 'g')}</defs>" if duo else ""
    common = 'fill="none" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round"'
    return (f'{defs}<path d="M11 35.5 L23 47.5 L36.5 33" stroke="{check}"{o_check} {common}/>'
            f'<path d="M35.5 34 L52 16.5 M41.5 16.5 L52 16.5 L52 27" stroke="{c}" {common}/>')


MARKS = {
    "orbe":  (mark_orbe,  "ORBE",  "Anneau de progression + monogramme F"),
    "elan":  (mark_elan,  "ELAN",  "Deux chevrons : coach et eleve"),
    "barre": (mark_barre, "BARRE", "Monogramme F a barre-halter"),
    "cap":   (mark_cap,   "CAP",   "La coche du jour devenue fleche"),
}


# --------------------------------------------------------------------------
# Assemblage des fichiers
# --------------------------------------------------------------------------
def svg(w, h, body, title, desc, color=None, vb=None):
    vb = vb or f"0 0 {w} {h}"
    style = f' color="{color}"' if color else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{w}" height="{h}"'
            f' role="img" aria-label="{title}"{style}>'
            f"<title>{title}</title><desc>{desc}</desc>{body}</svg>\n")


def write(path, content):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)
    return path


def wordmark(size=48.6, tracking=None, color=PAPER, x=0.0, baseline=0.0):
    tracking = size * 0.04 if tracking is None else tracking
    d, w = FACE.text("FORMA", size, x=x, baseline=baseline, tracking=tracking)
    return f'<path d="{d}" fill="{color}"/>', w


def wordmark_orbe(size=48.6, color=PAPER, accent=ACCENT, x=0.0, baseline=0.0):
    """FORMA dont le O est l'anneau de progression — signature de la piste ORBE."""
    tracking = size * 0.04
    cap = FACE.cap * size
    parts, cursor = [], x
    d, _ = FACE.text("F", size, x=cursor, baseline=baseline, tracking=0)
    parts.append(f'<path d="{d}" fill="{color}"/>')
    cursor += FACE.advance("F", size) + tracking
    adv_o = FACE.advance("O", size)
    cx, cy = cursor + adv_o / 2, baseline - cap / 2
    r, sw = cap * 0.5, size * 0.165
    a0, a1 = math.radians(-60), math.radians(240)
    p0 = (cx + r * math.cos(a0), cy + r * math.sin(a0))
    p1 = (cx + r * math.cos(a1), cy + r * math.sin(a1))
    parts.append(f'<path d="M{p0[0]:.2f} {p0[1]:.2f} A{r:.2f} {r:.2f} 0 1 1 {p1[0]:.2f} {p1[1]:.2f}"'
                 f' fill="none" stroke="{accent}" stroke-width="{sw:.2f}" stroke-linecap="round"/>')
    cursor += adv_o + tracking
    d, _ = FACE.text("RMA", size, x=cursor, baseline=baseline, tracking=tracking)
    parts.append(f'<path d="{d}" fill="{color}"/>')
    cursor += sum(FACE.advance(c, size) for c in "RMA") + 2 * tracking
    return "".join(parts), cursor - x


def app_icon(key, size=1024):
    fn, name, desc = MARKS[key]
    s = size / 64 * 0.56          # la marque occupe 56 % de la dalle
    off = (size - 64 * s) / 2
    body = (f'<defs><radialGradient id="bg" cx=".28" cy=".2" r=".9">'
            f'<stop offset="0" stop-color="{SURFACE}"/><stop offset="1" stop-color="{INK}"/>'
            f'</radialGradient></defs>'
            f'<rect width="{size}" height="{size}" rx="{size*0.225:.0f}" fill="url(#bg)"/>'
            f'<rect x="1" y="1" width="{size-2}" height="{size-2}" rx="{size*0.225-1:.0f}"'
            f' fill="none" stroke="{PAPER}" stroke-opacity=".08" stroke-width="2"/>'
            f'<g transform="translate({off:.1f},{off:.1f}) scale({s:.4f})">{fn(True, key)}</g>')
    return svg(size, size, body, f"FORMA — icone d'application ({name})", desc)


def build():
    out = []
    for key, (fn, name, desc) in MARKS.items():
        # marques
        out.append(write(f"marks/forma-{key}.svg",
                         svg(64, 64, fn(True, key), f"FORMA — {name}", desc)))
        out.append(write(f"marks/forma-{key}-mono-light.svg",
                         svg(64, 64, fn(False, key), f"FORMA — {name} (mono clair)",
                             desc + " — monochrome pour fond sombre", color=PAPER)))
        out.append(write(f"marks/forma-{key}-mono-dark.svg",
                         svg(64, 64, fn(False, key), f"FORMA — {name} (mono sombre)",
                             desc + " — monochrome pour fond clair", color=INK)))
        # lockup horizontal : marque + mot, entraxe = 18/64 de la marque
        gap = 18
        wm, ww = wordmark(baseline=49)
        body = (f'{fn(True, key)}<g transform="translate({64+gap},0)">{wm}</g>')
        out.append(write(f"lockups/forma-{key}-lockup-h.svg",
                         svg(round(64 + gap + ww), 64, body, f"FORMA — logo horizontal ({name})", desc)))
        # lockups monochromes (impression, fond photo, gravure)
        for suffix, col in (("mono-light", PAPER), ("mono-dark", INK)):
            wmm, _ = wordmark(baseline=49, color="currentColor")
            bodym = f'{fn(False, key)}<g transform="translate({64+gap},0)">{wmm}</g>'
            out.append(write(f"lockups/forma-{key}-lockup-h-{suffix}.svg",
                             svg(round(64 + gap + ww), 64, bodym,
                                 f"FORMA — logo horizontal ({name}, {suffix})", desc, color=col)))
        # lockup vertical : marque centree au-dessus du mot
        size = 38
        wm, ww = wordmark(size, baseline=0)
        W = max(64.0, ww)
        body = (f'<g transform="translate({(W-64)/2:.2f},0)">{fn(True, key)}</g>'
                f'<g transform="translate({(W-ww)/2:.2f},{64+16+FACE.cap*size:.2f})">{wm}</g>')
        H = 64 + 16 + FACE.cap * size
        out.append(write(f"lockups/forma-{key}-lockup-v.svg",
                         svg(round(W), round(H), body, f"FORMA — logo vertical ({name})", desc)))
        # icone d'app + favicon
        out.append(write(f"app-icons/forma-{key}-1024.svg", app_icon(key)))
        out.append(write(f"favicons/forma-{key}-32.svg",
                         svg(32, 32, f'<g transform="scale(0.5)">{fn(True, key)}</g>',
                             f"FORMA — favicon ({name})", desc, vb="0 0 32 32")))

    # mots seuls
    wm, ww = wordmark(baseline=49)
    out.append(write("lockups/forma-wordmark.svg",
                     svg(round(ww), 64, wm, "FORMA — logotype",
                         "Space Grotesk Bold, interlettrage +4 %, vectorise")))
    wm, ww = wordmark_orbe(baseline=49)
    out.append(write("lockups/forma-wordmark-orbe.svg",
                     svg(round(ww), 64, wm, "FORMA — logotype a O ouvert",
                         "Le O remplace par l'anneau de progression")))
    return out


FACE = Face(ensure_font())

if __name__ == "__main__":
    files = build()
    print(json.dumps({"generated": len(files), "files": files}, indent=2))
