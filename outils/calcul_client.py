#!/usr/bin/env python3
"""Calcule coûts, calendrier de paiement et bénéfice d'un client à partir de ses choix.

Usage :
  python3 outils/calcul_client.py clients/<slug>/choix.json   → écrit clients/<slug>/finances.md
  python3 outils/calcul_client.py --bilan                      → écrit finances.md (tous les clients)

choix.json : {"nom": "Spa Serenite", "pack": "premium" | "essentiel" | null, "lancement": false,
              "etude": false, "reseaux": false, "site": false, "whatsapp": false, "instagram_ia": false, "gestion_pub": false, "videos": 0, "stories": 0}
"""
import glob, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = json.load(open(os.path.join(ROOT, "outils", "tarifs.json")))
V, C, S = T["vente"], T["couts"], T["semaines_par_mois"]


def calcul(ch):
    pack = V["packs"].get(ch.get("pack") or "")
    lanc = ch.get("lancement")
    etude = ch.get("etude") or bool(lanc)
    reseaux = ch.get("reseaux") or bool(lanc)
    site = ch.get("site") or bool(lanc)
    videos = pack["videos"] if pack else int(ch.get("videos", 0))
    stories = pack["stories"] if pack else int(ch.get("stories", 0))
    whatsapp = (pack and pack["whatsapp"]) or ch.get("whatsapp", False)
    insta_ia = ch.get("instagram_ia", False)
    pub = ch.get("gestion_pub", False)

    # Chiffre d'affaires
    ca_sem = pack["semaine"] if pack else (
        V["videos_semaine"][str(videos)] + V["stories_semaine"][str(stories)]
        + (V["whatsapp_semaine"] if whatsapp else 0))
    ca_sem += (V["instagram_ia_semaine"] if insta_ia else 0) + (V["gestion_pub_semaine"] if pub else 0)
    ca_once = V["packs"]["lancement"]["une_fois"] if lanc else (
        (V["etude"] if etude else 0) + (V["reseaux"] if reseaux else 0) + (V["site"] if site else 0))

    # Coûts : (poste, montant, fréquence, équivalent / semaine)
    lignes, once = [], []
    if videos:
        m = videos * S * C["video_unite"]
        lignes.append(("Vidéos Higgsfield (%d/sem)" % videos, m, "mois (abonnement Higgsfield)", m / S))
    if videos or stories:
        m = C["buffer_mois_par_reseau"] * C["buffer_reseaux"]
        lignes.append(("Buffer (%d réseaux)" % C["buffer_reseaux"], m, "mois", m / S))
    if whatsapp:
        lignes.append(("IA WhatsApp", C["whatsapp_ia_mois"], "mois", C["whatsapp_ia_mois"] / S))
    if insta_ia:
        lignes.append(("IA Instagram (messages privés)", C["instagram_ia_mois"], "mois", C["instagram_ia_mois"] / S))
    if whatsapp or reseaux:
        once.append(("Achat puce", C["puce_achat"]))
    if site:
        lignes.append(("Renouvellement du domaine", C["domaine_an"], "an", C["domaine_an"] / 52))
        once.append(("1re année de domaine", C["domaine_an"]))
    if etude:
        once.append(("Crédits étude de marché", C["etude_credits"]))

    cout_sem = sum(l[3] for l in lignes)
    return dict(nom=ch.get("nom", "?"), ca_sem=ca_sem, ca_once=ca_once, lignes=lignes, once=once,
                cout_sem=cout_sem, videos=videos, stories=stories, whatsapp=whatsapp,
                etude=etude, reseaux=reseaux, site=site, insta_ia=insta_ia, pub=pub, pack=ch.get("pack"), lanc=lanc)


def dh(x):
    return f"{round(x):,} DH".replace(",", " ")


def fiche(r):
    services = [s for s, ok in [("Étude de marché", r["etude"]), ("Création réseaux", r["reseaux"]),
                                ("Site", r["site"]), ("WhatsApp IA", r["whatsapp"]),
                                ("IA Instagram", r["insta_ia"]), ("Gestion pub payante", r["pub"])] if ok]
    if r["videos"]: services.append(f"{r['videos']} vidéos/sem")
    if r["stories"]: services.append(f"{r['stories']} stories/sem")
    ben_sem = r["ca_sem"] - r["cout_sem"]
    once_cout = sum(o[1] for o in r["once"])
    out = [f"# Finances — {r['nom']}", "",
           f"**Services** : {', '.join(services) or 'aucun'}" + (f" · Pack {r['pack']}" if r["pack"] else "")
           + (" · Pack Lancement" if r["lanc"] else ""), "",
           "## Ce que tu gagnes", "",
           "| | Par semaine | Par mois |", "|---|---|---|",
           f"| Il te paie | {dh(r['ca_sem'])} | {dh(r['ca_sem'] * S)} |",
           f"| Ça te coûte | {dh(r['cout_sem'])} | {dh(r['cout_sem'] * S)} |",
           f"| **Bénéfice** | **{dh(ben_sem)}** | **{dh(ben_sem * S)}** |", ""]
    if r["ca_once"] or r["once"]:
        out += [f"**Une seule fois** : il te paie {dh(r['ca_once'])}, ça te coûte {dh(once_cout)} "
                f"→ bénéfice **{dh(r['ca_once'] - once_cout)}**.", ""]
    out += ["## Ce que tu dois payer, et quand", "",
            "| Dépense | Montant | À payer par | Équivalent / semaine |", "|---|---|---|---|"]
    out += [f"| {n} | {dh(m)} | {f} | {dh(s)} |" for n, m, f, s in r["lignes"]]
    out += [f"| {n} | {dh(m)} | une fois | — |" for n, m in r["once"] if m]
    if r["pub"]:
        out += ["", "Budget publicitaire : payé par le client directement à Meta / TikTok (pas dans tes coûts)."]
    out += ["", "Aucune de ces dépenses ne se paie à la semaine : mets de côté l'équivalent / semaine "
            "à chaque paiement du client.", ""]
    return "\n".join(out)


def bilan():
    rs = [calcul(json.load(open(p))) for p in sorted(glob.glob(os.path.join(ROOT, "clients", "*", "choix.json")))
          if "_modele" not in p]
    ca = sum(r["ca_sem"] for r in rs); co = sum(r["cout_sem"] for r in rs)
    vids = sum(r["videos"] for r in rs) * S
    out = ["# Bilan Sahir Digital", "", "| Client | Payé / sem | Coût / sem | Bénéfice / sem | Bénéfice / mois |",
           "|---|---|---|---|---|"]
    out += [f"| {r['nom']} | {dh(r['ca_sem'])} | {dh(r['cout_sem'])} | {dh(r['ca_sem'] - r['cout_sem'])} | "
            f"{dh((r['ca_sem'] - r['cout_sem']) * S)} |" for r in rs]
    out += [f"| **Total** | **{dh(ca)}** | **{dh(co)}** | **{dh(ca - co)}** | **{dh((ca - co) * S)}** |", "",
            f"Vidéos à produire : ~{round(vids)} / mois → abonnement Higgsfield conseillé : "
            + ("Starter" if vids <= 20 else "Plus" if vids <= 45 else "Ultra" if vids <= 110 else "Ultra + recharges de crédits"),
            ""]
    return "\n".join(out)


if __name__ == "__main__":
    if sys.argv[1:] == ["--bilan"]:
        open(os.path.join(ROOT, "finances.md"), "w").write(bilan())
        print(bilan())
    else:
        p = sys.argv[1]
        md = fiche(calcul(json.load(open(p))))
        open(os.path.join(os.path.dirname(p), "finances.md"), "w").write(md)
        print(md)
