# Musiques ImmoClap

## État au 08/10/2026

Bibliothèque vide : `pistes.json` vaut `[]`, aucune piste n'est encore générée.
L'app propose alors seulement le choix par ambiance, sans bouton d'écoute.

## Source prévue

Musiques instrumentales originales générées par IA avec Google Lyria 3 Clip (API Gemini) :
4 ambiances × 3 pistes (élégante, dynamique, chaleureuse, orientale), 30 s environ, sans voix ni paroles,
sans imiter d'artiste connu.

Traitement prévu : fondu d'entrée et de sortie, volume normalisé à -16 LUFS, mp3 128 kb/s + ogg/opus 96 kb/s,
700 Ko au plus par fichier. Chaque piste est contrôlée avant d'entrer dans la liste (durée, silences, pics de volume).

## Licence et conditions (conditions additionnelles de l'API Gemini, lues le 08/10/2026)

- Google ne revendique pas la propriété du contenu généré.
- Pas d'exclusivité : Google peut générer un contenu identique ou proche pour d'autres.
- L'utilisateur est responsable de l'usage du contenu, et de l'usage qu'en font ceux à qui il le partage.
- Aucune clause n'interdit l'usage commercial du contenu généré.
- Chaque son produit par Lyria contient un filigrane SynthID inaudible qui l'identifie comme généré par IA.

Conséquence pour les textes publics (site, FAQ, CGV art. 10, mentions légales, mis à jour le 09/10/2026) :
on dit « morceaux originaux générés par IA, non exclusifs », jamais « libres de droits » ni « usage commercial autorisé »
(les conditions n'accordent pas de licence, elles n'interdisent simplement pas cet usage).

## Format de `pistes.json`

Tableau d'objets :

```json
{
  "id": "elegante-1",
  "titre": "…",
  "ambiance": "elegante | dynamique | chaleureuse | orientale",
  "duree_s": 30.0,
  "bpm": 70,
  "mp3": "assets/musique/elegante-1.mp3",
  "ogg": "assets/musique/elegante-1.ogg",
  "source": "Google Lyria 3 Clip (API Gemini), générée le JJ/MM/AAAA",
  "modele": "lyria-3-clip-preview",
  "ia": true,
  "licence": "Générée par IA · non exclusive · pour la promotion du bien (CGV, art. 10)",
  "licence_detail": "…"
}
```

- `ia` : `true` pour une piste générée par IA. Le site affiche alors « musique générée par IA » sous l'extrait.
- `licence` : texte COURT (moins de 160 caractères), affiché tel quel dans l'espace client.
- `licence_detail` : conditions complètes, pour le dossier (non affiché).
- `source` : la date est celle du fichier brut (date de génération), pas celle du traitement.

`bpm` peut valoir `null`. Si le fichier est absent ou vide, l'app fonctionne quand même.
