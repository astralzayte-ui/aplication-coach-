#!/usr/bin/env python3
"""ONYX CLOSE — generateur d'identite.

Trois pistes de logo + les declinaisons reelles d'une marque de vetements :
photo de profil carree (testee en cercle de 40 px), logo d'en-tete de site,
version monochrome pour l'etiquette.

Le texte est vectorise (Jost, SIL OFL 1.1) : aucun fichier ne depend d'une
webfont installee. Dependance : pip install fonttools.
"""
import math, os, shutil, subprocess, urllib.request
from fontTools.misc.transform import Transform
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

INK   = "#0B0B0C"   # noir onyx (jamais du #000 pur : il s'ecrase a l'impression)
PAPER = "#F4F2EE"   # blanc casse
STONE = "#8A8F98"   # gris pierre, pour les mentions secondaires

FONTS = {  # Jost : geometrique, registre mode, tres lisible en tres petit
    300: "https://fonts.gstatic.com/s/jost/v20/92zPtBhPNqw79Ij1E865zBUv7mz9JQVG.ttf",
    400: "https://fonts.gstatic.com/s/jost/v20/92zPtBhPNqw79Ij1E865zBUv7myjJQVG.ttf",
    500: "https://fonts.gstatic.com/s/jost/v20/92zPtBhPNqw79Ij1E865zBUv7myRJQVG.ttf",
}
ROOT  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "tools", ".cache")


def ensure(w):
    p = os.path.join(CACHE, f"Jost-{w}.ttf")
    if not os.path.exists(p):
        os.makedirs(CACHE, exist_ok=True)
        try:
            with urllib.request.urlopen(FONTS[w], timeout=30) as r, open(p, "wb") as f:
                shutil.copyfileobj(r, f)
        except Exception:
            subprocess.run(["curl", "-sS", "-L", "-o", p, FONTS[w]], check=True)
    return p


class Face:
    def __init__(self, path):
        self.f = TTFont(path); self.upem = self.f["head"].unitsPerEm
        self.gs = self.f.getGlyphSet(); self.cmap = self.f.getBestCmap()
        self.hmtx = self.f["hmtx"]; self.cap = self.f["OS/2"].sCapHeight / self.upem

    def adv(self, ch, size): return self.hmtx[self.cmap[ord(ch)]][0] * size / self.upem

    def text(self, s, size, x=0.0, baseline=0.0, tracking=0.0):
        pen = SVGPathPen(self.gs, ntos=lambda v: f"{v:.2f}")
        sc, cur = size / self.upem, x
        for ch in s:
            n = self.cmap.get(ch and ord(ch))
            if n: self.gs[n].draw(TransformPen(pen, Transform(sc, 0, 0, -sc, cur, baseline)))
            cur += self.adv(ch, size) + tracking
        return pen.getCommands(), cur - x - tracking

    def ink(self, s, size, x=0.0, baseline=0.0, tracking=0.0):
        pen = BoundsPen(self.gs); sc, cur = size / self.upem, x
        for ch in s:
            n = self.cmap.get(ord(ch))
            if n: self.gs[n].draw(TransformPen(pen, Transform(sc, 0, 0, -sc, cur, baseline)))
            cur += self.adv(ch, size) + tracking
        return pen.bounds


F300, F400, F500 = (Face(ensure(w)) for w in (300, 400, 500))

# ---------------------------------------------------------------- les marques
# Grille 100 x 100, marque inscrite dans un disque de 100 (contrainte photo de profil).

def mark_taille(col=PAPER):
    """TAILLE — un O dont le vide interieur est une pierre taillee a huit pans.
    Onyx est une pierre : le signe porte la taille du gemme, pas une illustration."""
    r_out, r_in = 34.0, 20.5
    pts = []
    for i in range(8):
        a = math.radians(22.5 + i * 45)
        pts.append(f"{50 + r_in * math.cos(a):.2f} {50 + r_in * math.sin(a):.2f}")
    octo = "M" + " L".join(pts) + " Z"
    return (f'<path fill-rule="evenodd" fill="{col}" d="'
            f'M50 {50 - r_out} A{r_out} {r_out} 0 1 0 50 {50 + r_out} '
            f'A{r_out} {r_out} 0 1 0 50 {50 - r_out} Z {octo[1:]}"/>')


def mark_oc(col=PAPER):
    """O/C — le monogramme : le C loge exactement dans le vide du O.
    Deux arcs, une seule graisse : c'est la forme qui survit le mieux a 40 px."""
    sw = 7.5
    r_o, r_c = 33.0, 17.5
    a0, a1 = math.radians(-52), math.radians(52)     # ouverture du C, vers la droite
    p0 = (50 + r_c * math.cos(a0), 50 + r_c * math.sin(a0))
    p1 = (50 + r_c * math.cos(a1), 50 + r_c * math.sin(a1))
    return (f'<circle cx="50" cy="50" r="{r_o}" fill="none" stroke="{col}" stroke-width="{sw}"/>'
            f'<path d="M{p0[0]:.2f} {p0[1]:.2f} A{r_c} {r_c} 0 1 0 {p1[0]:.2f} {p1[1]:.2f}"'
            f' fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="butt"/>')


def mark_lettre(col=PAPER):
    """LETTRE — le O du logotype, isole et ouvert en bas : la marque n'est alors
    qu'un detail agrandi du nom, jamais un signe a installer separement."""
    sw, r = 7.5, 33.0
    a0, a1 = math.radians(100), math.radians(80)
    p0 = (50 + r * math.cos(a0), 50 + r * math.sin(a0))
    p1 = (50 + r * math.cos(a1), 50 + r * math.sin(a1))
    d, w = F300.text("O", 46, baseline=50 + F300.cap * 46 / 2)
    b = F300.ink("O", 46, baseline=50 + F300.cap * 46 / 2)
    return (f'<path d="M{p0[0]:.2f} {p0[1]:.2f} A{r} {r} 0 1 1 {p1[0]:.2f} {p1[1]:.2f}"'
            f' fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="butt"/>'
            f'<path transform="translate({50 - (b[0] + b[2]) / 2:.2f},0)" d="{d}" fill="{col}"/>')


MARKS = {"taille": (mark_taille, "TAILLE", "Le O taille comme la pierre"),
         "oc":     (mark_oc,     "O / C",  "Le monogramme, deux arcs"),
         "lettre": (mark_lettre, "LETTRE", "Le O du nom, agrandi")}


# -------------------------------------------------------------- les logotypes
def lettering(size=40, tracking_em=0.34, col=PAPER, x=0.0, baseline=0.0, face=None):
    """ONYX en capitales tres espacees — la convention du pret-a-porter,
    et la seule facon de rendre un nom court imposant."""
    face = face or F300
    tr = size * tracking_em
    d, w = face.text("ONYX", size, x=x, baseline=baseline, tracking=tr)
    return f'<path d="{d}" fill="{col}"/>', w


def sub(size=13, tracking_em=0.5, col=None, x=0.0, baseline=0.0):
    col = col or STONE
    tr = size * tracking_em
    d, w = F400.text("CLOSE", size, x=x, baseline=baseline, tracking=tr)
    return f'<path d="{d}" fill="{col}"/>', w


def svg(w, h, body, title, color=None):
    c = f' color="{color}"' if color else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}"'
            f' height="{h}" role="img" aria-label="{title}"{c}><title>{title}</title>{body}</svg>\n')


def write(path, content):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, "w", encoding="utf-8").write(content)
    return path


def profil(key, size=1000):
    """Photo de profil : fond onyx pleine dalle, marque a 44 % — Instagram et
    TikTok rognent en cercle, tout doit tenir dans le disque inscrit."""
    fn = MARKS[key][0]
    s = size / 100 * 0.44
    off = (size - 100 * s) / 2
    return svg(size, size,
               f'<rect width="{size}" height="{size}" fill="{INK}"/>'
               f'<g transform="translate({off:.1f},{off:.1f}) scale({s:.4f})">{fn(PAPER)}</g>',
               f"ONYX CLOSE — photo de profil ({MARKS[key][1]})")


def profil_nom(size=1000):
    """Variante : le nom seul, pour qui prefere se faire lire plutot que reconnaitre."""
    d, w = lettering(112, col=PAPER, baseline=0)
    d2, w2 = sub(34, col=STONE, baseline=0)
    return svg(size, size,
               f'<rect width="{size}" height="{size}" fill="{INK}"/>'
               f'<g transform="translate({(size - w) / 2:.1f},{size / 2 - 6:.1f})">{d}</g>'
               f'<g transform="translate({(size - w2) / 2:.1f},{size / 2 + 78:.1f})">{d2}</g>',
               "ONYX CLOSE — photo de profil (nom)")


def build():
    out = []
    for key, (fn, name, _) in MARKS.items():
        out.append(write(f"marks/onyx-{key}.svg",
                         svg(100, 100, fn("currentColor"), f"ONYX CLOSE — {name}", color=PAPER)))
        out.append(write(f"marks/onyx-{key}-noir.svg",
                         svg(100, 100, fn("currentColor"), f"ONYX CLOSE — {name} (noir)", color=INK)))
        out.append(write(f"profil/onyx-{key}-profil-1000.svg", profil(key)))

        # en-tete de site : marque + nom, aligne sur l'axe optique du lettrage
        gap, ls = 26, 34
        d, w = lettering(ls, col="currentColor", baseline=62)
        d2, w2 = sub(11, col="currentColor", baseline=82)
        body = (f'<g transform="translate(0,7) scale(0.7)">{fn("currentColor")}</g>'
                f'<g transform="translate({70 + gap},0)" opacity="1">{d}</g>'
                f'<g transform="translate({70 + gap + 2},0)" opacity=".62">{d2}</g>')
        for suffix, col in (("", PAPER), ("-noir", INK)):
            out.append(write(f"lockups/onyx-{key}-site{suffix}.svg",
                             svg(round(70 + gap + max(w, w2) + 4), 92, body,
                                 f"ONYX CLOSE — en-tete ({name})", color=col)))

        # etiquette : empile, centre, une seule couleur
        d, w = lettering(30, col="currentColor", baseline=0)
        d2, w2 = sub(10, col="currentColor", baseline=22)
        W = max(w, w2, 62)
        body = (f'<g transform="translate({(W - 62) / 2:.1f},0) scale(0.62)">{fn("currentColor")}</g>'
                f'<g transform="translate({(W - w) / 2:.1f},96)">{d}</g>'
                f'<g transform="translate({(W - w2) / 2:.1f},96)" opacity=".62">{d2}</g>')
        out.append(write(f"lockups/onyx-{key}-etiquette.svg",
                         svg(round(W), 128, body, f"ONYX CLOSE — etiquette ({name})", color=INK)))

    out.append(write("profil/onyx-nom-profil-1000.svg", profil_nom()))
    d, w = lettering(48, col="currentColor", baseline=54)
    d2, w2 = sub(15, col="currentColor", baseline=78)
    out.append(write("lockups/onyx-logotype.svg",
                     svg(round(max(w, w2)), 92,
                         f'{d}<g transform="translate({(w - w2) / 2:.1f},0)" opacity=".62">{d2}</g>',
                         "ONYX CLOSE — logotype", color=PAPER)))
    return out


if __name__ == "__main__":
    print(len(build()), "fichiers")
