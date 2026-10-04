#!/usr/bin/env python3
"""Lecture du coffre de l'application budget, pour les bilans de Claude.

Le coffre (netlify/functions/vault.mjs) garde l'état complet de l'application :
période en cours, historique des périodes clôturées, revenus, charges, notes.
Ce script le récupère avec la clé (variable BUDGET_KEY, ou identifiant
Bearer de l'environnement injecté par le proxy) et en tire un résumé chiffré, à reformuler ensuite pour
l'utilisateur. Aucune donnée n'est écrite sur le disque.

    python3 outils/coffre.py              résumé complet
    python3 outils/coffre.py --json       état brut
    python3 outils/coffre.py --versions   dates des copies journalières
    python3 outils/coffre.py --date AAAA-MM-JJ   résumé d'une copie passée
    python3 outils/coffre.py --suivi 2026-10      suivi d'un mois
    python3 outils/coffre.py --suivi 2026         suivi d'une année
    python3 outils/coffre.py --suivi 2026-10-01 2026-12-31   suivi d'un intervalle

Le suivi commence le 2026-10-01 (remise à zéro de l'appli) : tout ce qui est
daté avant est ignoré.
"""
import json, os, ssl, sys, urllib.error, urllib.request
from collections import defaultdict
from datetime import date

URL = os.environ.get("BUDGET_URL", "https://chic-biscotti-07e6f1.netlify.app/.netlify/functions/vault")
CATS = {"nourriture": "Nourriture", "boisson": "Boisson", "plaisirs": "Plaisir",
        "sorties": "Activité", "transport": "Transport", "divers": "Choses de la vie",
        "remboursement": "Remboursement"}
SUIVI_DEBUT = "2026-10-01"
MOIS = ["janv", "févr", "mars", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"]


def appeler(query=""):
    # Deux façons de fournir la clé : la variable BUDGET_KEY, ou un identifiant
    # « Bearer » déclaré dans l'environnement Claude Code pour le site du coffre ;
    # dans ce cas le proxy sortant ajoute lui-même l'en-tête et le script ne voit
    # jamais la clé.
    cle = os.environ.get("BUDGET_KEY", "").strip()
    ctx = ssl.create_default_context()
    if os.path.exists("/root/.ccr/ca-bundle.crt"):  # proxy sortant de l'environnement cloud
        ctx.load_verify_locations("/root/.ccr/ca-bundle.crt")
    entetes = {"Cache-Control": "no-store"}
    if cle:
        entetes["Authorization"] = "Bearer " + cle
    req = urllib.request.Request(URL + query, headers=entetes)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        corps = e.read().decode("utf-8", "replace")
        sys.exit({401: "Clé absente ou refusée : poser BUDGET_KEY, ou un identifiant Bearer "
                       "pour chic-biscotti-07e6f1.netlify.app dans les réglages de l'environnement.",
                  404: "Coffre vide pour cette clé : l'application n'a encore rien envoyé."}
                 .get(e.code, f"Erreur {e.code} : {corps}"))


dh = lambda x: f"{round(x):,}".replace(",", " ") + " DH"
nom_cat = lambda c: CATS.get(c, c or "?")


def mois_lisible(ym):
    a, m = ym.split("-")
    return f"{MOIS[int(m) - 1]} {a}"


def montant_charge(c, mode):
    m = c.get("montantMensuel") or 0
    return m if mode == "mois" else round(m / 4)


def resume(env):
    S = env.get("state", {})
    mode = S.get("mode", "semaine")
    dep = S.get("depenses", [])
    payees = [d for d in dep if d.get("coche", True)]
    attente = [d for d in dep if not d.get("coche", True)]
    charges = S.get("chargesRec", [])
    ch_payees = sum(montant_charge(c, mode) for c in charges if c.get("payé"))
    ch_dues = sum(montant_charge(c, mode) for c in charges if not c.get("payé"))
    revenus = sum(r.get("montant", 0) for r in S.get("revenus", []))
    budget_total = S.get("budget", 0) + revenus
    depense = sum(d["montant"] for d in payees) + ch_payees
    archives = S.get("archives", [])

    out = []
    p = out.append
    p(f"# Coffre — reçu le {env.get('recuLe', '?')} (app {env.get('app', '?')})")
    p("")
    p(f"## Période en cours ({mode}, depuis le {S.get('period_start', '?')})")
    p(f"Budget {dh(S.get('budget', 0))} + revenus ajoutés {dh(revenus)} = {dh(budget_total)}")
    p(f"Dépensé {dh(depense)} (dont charges fixes {dh(ch_payees)}) · reste {dh(budget_total - depense)}")
    p(f"En attente, pas encore payé : {dh(sum(d['montant'] for d in attente) + ch_dues)} "
      f"({len(attente)} dépense(s), {sum(1 for c in charges if not c.get('payé'))} charge(s))")
    par_cat = defaultdict(float)
    for d in payees:
        par_cat[d.get("cat")] += d["montant"]
    if par_cat:
        tot = sum(par_cat.values())
        p("Par catégorie (dépenses cochées, hors charges) :")
        for c, v in sorted(par_cat.items(), key=lambda x: -x[1]):
            p(f"  - {nom_cat(c)} : {dh(v)} ({round(v / tot * 100)} %)")
    if payees:
        p("Plus grosses : " + " · ".join(f"{dh(d['montant'])} {d.get('desc', '')} ({d.get('date', '')})"
                                         for d in sorted(payees, key=lambda d: -d["montant"])[:5]))
    if charges:
        p("Charges fixes : " + " · ".join(f"{c.get('nom')} {dh(montant_charge(c, mode))}"
                                          f"{' ✓' if c.get('payé') else ' (à payer)'}" for c in charges))

    # Tout l'historique, période en cours comprise, ventilé par mois civil.
    toutes = [(d, "en cours") for d in payees]
    for a in archives:
        toutes += [(d, a.get("debut")) for d in a.get("depenses", []) if d.get("coche", True)]
    charges_par_mois = defaultdict(float)
    for a in archives:
        ym = (a.get("debut") or "")[:7]
        charges_par_mois[ym] += sum(c.get("montant", 0) for c in a.get("chargesPayees", []))
    charges_par_mois[(S.get("period_start") or "")[:7]] += ch_payees

    p("")
    p(f"## Historique : {len(archives)} période(s) clôturée(s)")
    for a in archives[-12:]:
        dd = [d for d in a.get("depenses", []) if d.get("coche", True)]
        cats = defaultdict(float)
        for d in dd:
            cats[d.get("cat")] += d["montant"]
        top = ", ".join(f"{nom_cat(c)} {dh(v)}" for c, v in sorted(cats.items(), key=lambda x: -x[1])[:3])
        p(f"- {a.get('debut')} → {a.get('fin')} ({a.get('mode')}) : budget {dh(a.get('budgetTotal', a.get('budget', 0)))}, "
          f"dépensé {dh(a.get('depense', 0))}, reste {dh(a.get('reste', 0))} · {top or 'rien'}")
    if len(archives) > 12:
        p(f"  … et {len(archives) - 12} période(s) plus ancienne(s)")

    mois = defaultdict(lambda: defaultdict(float))
    for d, _ in toutes:
        mois[(d.get("date") or "")[:7]][d.get("cat")] += d["montant"]
    for ym, v in charges_par_mois.items():
        if v:
            mois[ym]["_charges"] += v
    if mois:
        p("")
        p("## Par mois civil (dépenses cochées + charges payées)")
        for ym in sorted(k for k in mois if k):
            cats = mois[ym]
            tot = sum(cats.values())
            det = ", ".join(f"{'Charges fixes' if c == '_charges' else nom_cat(c)} {dh(v)}"
                            for c, v in sorted(cats.items(), key=lambda x: -x[1])[:4])
            p(f"- {mois_lisible(ym)} : {dh(tot)} — {det}")
        global_cat = defaultdict(float)
        for cats in mois.values():
            for c, v in cats.items():
                global_cat[c] += v
        tot = sum(global_cat.values())
        nb_mois = len([k for k in mois if k])
        p("")
        p(f"## Depuis le début ({nb_mois} mois) : {dh(tot)}, soit {dh(tot / max(1, nb_mois))} par mois en moyenne")
        for c, v in sorted(global_cat.items(), key=lambda x: -x[1]):
            p(f"  - {'Charges fixes' if c == '_charges' else nom_cat(c)} : {dh(v)} ({round(v / tot * 100)} %)")
        top_all = sorted(toutes, key=lambda x: -x[0]["montant"])[:5]
        p("Plus grosses dépenses de tous les temps : " +
          " · ".join(f"{dh(d['montant'])} {d.get('desc', '')} ({d.get('date', '')})" for d, _ in top_all))

    rev_all = list(S.get("revenus", []))
    for a in archives:
        rev_all += a.get("revenus", [])
    if rev_all:
        p(f"Revenus ajoutés au total : {dh(sum(r.get('montant', 0) for r in rev_all))} "
          f"({len(rev_all)} entrée(s))")
    p("")
    p(f"_Données au {date.today().isoformat()} — notes du bloc-notes présentes : "
      f"{'oui' if S.get('notes') else 'non'} (non affichées ici)._")
    return "\n".join(out)


def mouvements(S):
    """Toutes les dépenses payées et charges payées, datées, depuis SUIVI_DEBUT."""
    mode = S.get("mode", "semaine")
    lignes = []
    def ajouter(deps, charges_payees, debut):
        for d in deps:
            if d.get("coche", True):
                lignes.append((d.get("date") or debut or "", d.get("cat"), d["montant"], d.get("desc", "")))
        for c in charges_payees:
            lignes.append((debut or "", "_charges", c[1], c[0]))
    for a in S.get("archives", []):
        ajouter(a.get("depenses", []), [(c.get("nom", ""), c.get("montant", 0)) for c in a.get("chargesPayees", [])], a.get("debut"))
    ajouter(S.get("depenses", []), [(c.get("nom", ""), montant_charge(c, mode))
                                    for c in S.get("chargesRec", []) if c.get("payé")], S.get("period_start"))
    return [l for l in lignes if l[0] >= SUIVI_DEBUT]


def suivi(env, de, a):
    S = env.get("state", {})
    lignes = [l for l in mouvements(S) if de <= l[0] <= a]
    nom = lambda c: "Charges fixes" if c == "_charges" else nom_cat(c)
    out = [f"# Suivi du {max(de, SUIVI_DEBUT)} au {min(a, date.today().isoformat())}"]
    tot = sum(l[2] for l in lignes)
    if not tot:
        return out[0] + "\nAucune dépense enregistrée sur cette période."
    jours = {l[0] for l in lignes}
    out.append(f"Total dépensé : {dh(tot)} ({len(lignes)} ligne(s), sur {len(jours)} jour(s) avec dépense)")
    cats = defaultdict(float)
    for l in lignes:
        cats[l[1]] += l[2]
    out.append("Par catégorie :")
    cumul = 0
    for c, v in sorted(cats.items(), key=lambda x: -x[1]):
        cumul += v
        out.append(f"  - {nom(c)} : {dh(v)} ({round(v / tot * 100)} %, cumul {round(cumul / tot * 100)} %)")
    par_mois = defaultdict(float)
    for l in lignes:
        par_mois[l[0][:7]] += l[2]
    if len(par_mois) > 1:
        out.append("Par mois : " + " · ".join(f"{mois_lisible(m)} {dh(v)}" for m, v in sorted(par_mois.items())))
        out.append(f"Moyenne : {dh(tot / len(par_mois))} par mois")
    out.append("Plus grosses : " + " · ".join(f"{dh(l[2])} {l[3]} ({l[0]})"
                                             for l in sorted(lignes, key=lambda l: -l[2])[:5]))
    rev = [r for r in S.get("revenus", []) + [r for x in S.get("archives", []) for r in x.get("revenus", [])]
           if de <= (r.get("date") or r.get("ts") or "")[:10] <= a
           and (r.get("date") or r.get("ts") or "")[:10] >= SUIVI_DEBUT]
    if rev:
        out.append(f"Revenus ajoutés : {dh(sum(r.get('montant', 0) for r in rev))}")
    return "\n".join(out)


def bornes(args):
    x = args[0]
    if len(args) > 1:
        return x, args[1]
    if len(x) == 4:
        return f"{x}-01-01", f"{x}-12-31"
    if len(x) == 7:
        return f"{x}-01", f"{x}-31"
    return x, x


if __name__ == "__main__":
    a = sys.argv[1:]
    if "--suivi" in a:
        i = a.index("--suivi")
        args = [x for x in a[i + 1:i + 3] if x[:1].isdigit()] or [str(date.today().year)]
        print(suivi(appeler(), *bornes(args)))
    elif "--versions" in a:
        print("\n".join(appeler("?versions=1").get("dates", [])) or "aucune copie")
    elif "--date" in a:
        env = appeler("?date=" + a[a.index("--date") + 1])
        print(json.dumps(env, ensure_ascii=False, indent=1) if "--json" in a else resume(env))
    else:
        env = appeler()
        print(json.dumps(env, ensure_ascii=False, indent=1) if "--json" in a else resume(env))
