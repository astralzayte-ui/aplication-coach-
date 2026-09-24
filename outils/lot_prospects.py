#!/usr/bin/env python3
"""Transforme des résultats Google Maps (Apify compass/crawler-google-places, avec avis)
en lot de prospects : score, accroche, lien WhatsApp 1 clic → CSV prêt pour Google Sheets.

Usage : python3 outils/lot_prospects.py SORTIE.csv DATE fichier1.json [fichier2.json ...]
  --deja FICHIER.csv   : ignorer les prospects déjà présents dans des lots précédents (par téléphone)
  --max 30             : nombre de prospects à garder
Les données prospects ne vont PAS dans le dépôt (dépôt public).
"""
import argparse, csv, io, json, re, urllib.parse

SIGNATURE = "Julien"
KW_PRIX = re.compile(r"(prix|tarif|cher|payé|payer|dhs?\b)", re.I)
KW_ATTENTE = re.compile(r"(attendu|attente|retard|rendez-vous|rdv)", re.I)


def propre(texte):
    """Retire les emojis (non pris en charge à l'import Google Docs/Sheets) et les espaces en trop."""
    return re.sub(r"\s+", " ", "".join(c for c in texte if ord(c) <= 0xFFFF and not 0xFE00 <= ord(c) <= 0xFE0F and not 0x2600 <= ord(c) <= 0x27BF)).strip(" .")


def charger(fichiers):
    items = []
    for f in fichiers:
        data = json.load(open(f))
        items += data["items"] if isinstance(data, dict) else data
    return items


def site_type(it):
    w = (it.get("website") or "").lower()
    if not w: return None
    if "facebook.com" in w: return "facebook"
    if "instagram.com" in w: return "instagram"
    if any(x in w for x in ("netlify.app", "wixsite", "business.site", "linktr.ee", "blogspot")): return "site-basique"
    return "site"


def secteur(it):
    c = (it.get("categoryName") or "") + " " + (it.get("title") or "")
    if re.search(r"barb", c, re.I): return "barbier"
    return "salon"


def analyser(it):
    nom, note, nb = it.get("title"), it.get("totalScore"), it.get("reviewsCount") or 0
    revs = it.get("reviews") or []
    owner = sum(1 for r in revs if r.get("responseFromOwnerText"))
    neg = [r for r in revs if (r.get("stars") or 5) <= 2]
    neg_sans_rep = [r for r in neg if not r.get("responseFromOwnerText")]
    site = site_type(it)
    cl = "clients" if secteur(it) == "barbier" else "clientes"
    n = lambda x: str(x).replace(".", ",")
    if note and note < 4 and len(neg_sans_rep) >= 3:
        return ("1-CHAUD", f"Note {n(note)}/5, {len(neg_sans_rep)} avis négatifs sans réponse",
                f"votre note Google est à {n(note)} sur 5 et plusieurs avis négatifs sont restés sans réponse : ça fait fuir les nouvelles {cl} avant même qu'elles appellent")
    if any(KW_PRIX.search(r.get("text") or "") for r in neg):
        return ("1-CHAUD", "Plaintes sur les prix dans les avis",
                f"des {cl} se plaignent sur Google de ne pas connaître les prix à l'avance : un WhatsApp qui envoie votre carte de prix automatiquement règle ça")
    if any(KW_ATTENTE.search(r.get("text") or "") for r in neg):
        return ("1-CHAUD", "Plaintes sur l'attente / les rendez-vous",
                f"des {cl} se plaignent sur Google de l'attente et des rendez-vous : un WhatsApp qui gère les réservations tout seul règle ça")
    if neg_sans_rep:
        return ("1-CHAUD", "Avis négatif récent sans réponse",
                "un avis négatif récent est resté sans réponse sur votre fiche Google, et vos futures " + cl + " le lisent")
    if site == "site" and revs and owner >= 0.8 * len(revs):
        return ("3-FROID", "Déjà bien présent (site + réponses aux avis)",
                f"vous êtes déjà bien présents sur Google ; on peut aller plus loin avec des vidéos chaque semaine et un WhatsApp qui répond à vos {cl} 24h/24")
    if nb >= 50 and site in (None, "facebook", "instagram"):
        extra = "" if owner else ", et vous ne répondez pas aux avis"
        return ("1-CHAUD", f"{nb} avis, pas de vrai site" + ("" if owner else ", 0 réponse aux avis"),
                f"vous avez {nb} avis à {n(note)} sur 5, super, mais pas de vrai site internet{extra} : les {cl} qui vous cherchent sur Google ne trouvent ni vos prix ni vos prestations")
    if nb >= 50 and not owner:
        return ("2-TIÈDE", f"{nb} avis, 0 réponse aux avis",
                f"vous avez {nb} avis sur Google, mais vous ne répondez à aucun : vos futures {cl} lisent ces avis et voient qu'il n'y a personne derrière")
    if site == "site-basique":
        return ("2-TIÈDE", "Site basique (page gratuite)", "votre site est une page gratuite très simple, sans vos prix ni la prise de rendez-vous")
    if nb == 0:
        return ("2-TIÈDE", "Aucun avis Google", "vous n'avez encore aucun avis sur Google : les salons autour de vous en ont plus de 100, donc Google les montre avant vous")
    if nb < 20:
        q = "qu'un seul avis" if nb == 1 else f"que {nb} avis"
        return ("2-TIÈDE", f"Seulement {nb} avis Google" + ("" if site else ", pas de site"),
                f"vous n'avez {q} sur Google, alors que les salons autour de vous en ont plus de 100 : Google les montre avant vous")
    if not site or site in ("facebook", "instagram"):
        return ("2-TIÈDE", f"{nb} avis, pas de site", f"vous avez {nb} avis sur Google mais pas de site internet, donc les {cl} ne trouvent ni vos prix ni vos prestations en ligne")
    return ("3-FROID", "Site OK", f"vous avez déjà un site ; on peut aller plus loin avec des vidéos chaque semaine et un WhatsApp qui répond à vos {cl} 24h/24")


def que(phrase):
    return ("qu'" if phrase[:1].lower() in "aeiouéèêh" else "que ") + phrase


EXCLUS = re.compile(r"(vêtement|boutique de mode|pharmacie|parapharmacie|magasin)", re.I)


def message(nom, accroche, barbier):
    qui = "les barbiers de Marrakech à avoir plus de clients" if barbier else "les salons de beauté de Marrakech à avoir plus de clientes"
    return (f"Bonjour {nom} 👋\nJe suis {SIGNATURE}, de Sahir Digital, à Marrakech. J'ai essayé de vous appeler.\n\n"
            f"En regardant votre fiche Google, j'ai remarqué {que(accroche)}.\n\n"
            f"On aide {qui}, avec :\n✅ un WhatsApp qui répond tout seul, même la nuit\n"
            "✅ des vidéos UGC de qualité publiées pour vous sur Instagram et TikTok\n\nJe vous montre en 30 secondes ?")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("sortie"); p.add_argument("date"); p.add_argument("fichiers", nargs="+")
    p.add_argument("--deja", action="append", default=[]); p.add_argument("--max", type=int, default=30)
    a = p.parse_args()
    deja = set()
    for f in a.deja:
        for row in csv.DictReader(open(f)):
            deja.add(re.sub(r"\D", "", row.get("Téléphone", ""))[-9:])
    lignes, vus = [], set()
    for it in charger(a.fichiers):
        tel = it.get("phoneUnformatted") or ""
        cle = re.sub(r"\D", "", tel)[-9:]
        if EXCLUS.search(it.get("categoryName") or ""):
            continue
        if not cle or cle in deja or cle in vus or it.get("permanentlyClosed") or it.get("temporarilyClosed"):
            continue
        vus.add(cle)
        score, pf, acc = analyser(it)
        if score == "3-FROID":
            continue
        nom = propre(it["title"])
        mobile = cle[0] in "67"
        wa = ("https://wa.me/212" + cle + "?text=" + urllib.parse.quote(message(nom, acc, secteur(it) == "barbier"))) if mobile else "Fixe : appeler seulement"
        t = "0" + cle
        site = {None: "Non", "facebook": "Page Facebook", "instagram": "Instagram seulement", "site": "Oui", "site-basique": "Page gratuite"}[site_type(it)]
        insta = (it.get("instagrams") or [""])[0]
        insta = "@" + insta.rstrip("/").split("/")[-1].split("?")[0] if insta else ""
        lignes.append([score, nom, " ".join([t[:2], t[2:4], t[4:6], t[6:8], t[8:10]]), "J'ai remarqué " + que(acc) + ".", wa, pf,
                       str(it.get("totalScore") or "").replace(".", ","), it.get("reviewsCount") or 0, site, insta, it.get("categoryName") or ""])
    lignes.sort(key=lambda l: (l[0], -int(l[7])))
    lignes = lignes[: a.max]
    buf = io.StringIO(); w = csv.writer(buf, lineterminator="\n")
    w.writerow(["Appelé", "A répondu", "WhatsApp envoyé", "Intéressé", "Score", "Nom", "Téléphone", "Accroche (à lire au téléphone)",
                "WhatsApp 1 clic", "Point faible", "Note Google", "Nb avis", "Site", "Instagram", "Secteur", "Date ajout", "Notes"])
    for l in lignes:
        w.writerow(["", "", "", ""] + l + [a.date, ""])
    open(a.sortie, "w").write(buf.getvalue())
    from collections import Counter
    print(len(lignes), "prospects", dict(Counter(l[0] for l in lignes)))


if __name__ == "__main__":
    main()
