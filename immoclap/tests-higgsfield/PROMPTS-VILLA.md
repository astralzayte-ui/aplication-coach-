# Test Higgsfield — photos de villa (Gemini) puis Kling 2.5 vs Kling 3.0

Toutes ces images sont générées par IA → toujours étiquetées « démonstration », jamais présentées comme un vrai bien.

## Astuce cohérence (même maison sur toutes les photos)
1. Génère d'abord la photo 1 (façade).
2. Pour les suivantes, joins la photo 1 à Gemini et commence le prompt par :
   « Same villa as the attached image, same architecture, materials and colors. »

## Bloc commun (à coller à la fin de chaque prompt)
Real estate listing photo, shot on a full-frame camera with a 24mm lens, natural daylight, realistic, sharp, no people, no text, no watermark, landscape 16:9, 1920px wide.

## Les 7 photos
1. **Façade** — Modern Moroccan luxury villa in the Palmeraie of Marrakech, white tadelakt walls, arched wooden door, olive trees and palm trees, gravel driveway, clear blue sky, late morning light.
2. **Piscine** — Large rectangular infinity pool in front of the villa, sun loungers with beige cushions, palm trees, Atlas mountains in the distance, golden hour.
3. **Salon** — Spacious living room, double-height ceiling, beige linen sofas, Berber rugs, brass lanterns, large arched windows opening onto the garden, soft daylight.
4. **Cuisine** — Open modern kitchen, white zellige tiles, walnut cabinets, marble island with three stools, plants, daylight from a large window.
5. **Chambre** — Master bedroom, king-size bed with white linen, carved cedar headboard, terracotta tones, view on the pool through a large window.
6. **Salle de bain** — Bathroom in green zellige and tadelakt, freestanding bathtub, brass fixtures, arched mirror, soft light.
7. **Terrasse au coucher du soleil** — Rooftop terrace with lounge area and lanterns, view over palm trees and the Atlas mountains at sunset.

## Le test (7 vidéos)
| Test | Photo | Mouvement demandé | Kling 2.5 | Kling 3.0 |
|---|---|---|---|---|
| A | 1 Façade | slow push-in toward the door | ✅ | ✅ |
| B | 3 Salon | slow orbit / lateral tracking | ✅ | ✅ |
| C | 2 Piscine | slow pull-back revealing the view | ✅ | ✅ |
| 7e | au choix | refaire le plus raté | | |

Prompt vidéo (même texte pour les 2 modèles) : « Cinematic real estate shot, [mouvement], smooth and steady camera, no change to the architecture or furniture, no people, 5 seconds. »

## Ce qu'on note pour chaque vidéo
coût (crédits) · temps de génération · déformations (murs, meubles, piscine) · fluidité · rendu « luxe » · note /10
