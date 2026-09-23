/* =========================================================
   donnees.js — Le contenu du restaurant (fictif)
   ---------------------------------------------------------
   La carte, la galerie et les crédits photos sont des
   données : les pages les affichent automatiquement.
   Chaque texte existe en français (fr) et en anglais (en).
   Prix en dirhams (DH).
   ========================================================= */

const RESTAURANT = {
  nom: 'Dar Zaafran',
  nomArabe: 'دار الزعفران',
  whatsapp: '212693511445',                 // format international, sans + ni espaces
  telephoneAffiche: '+212 6 93 51 14 45',
  adresse: '12 Derb Zaafran, Médina',
  ville: 'Marrakech',
  // Point sur la carte (quartier de la place Jemaa el-Fna)
  latitude: 31.6258,
  longitude: -7.9891,
  email: 'bonjour@dar-zaafran.ma'
};

// Catégories de la carte, dans l'ordre d'affichage.
const CATEGORIES = [
  { id: 'entrees', fr: 'Entrées', en: 'Starters' },
  { id: 'plats', fr: 'Plats', en: 'Mains' },
  { id: 'desserts', fr: 'Desserts', en: 'Desserts' },
  { id: 'boissons', fr: 'Boissons', en: 'Drinks' }
];

// "etiquettes" : vegetarien, signature, epice
const CARTE = [
  { id: 'harira', categorie: 'entrees', prix: 45, photo: 'harira', etiquettes: ['vegetarien'],
    fr: { nom: 'Harira', desc: 'Soupe de tomates, lentilles et pois chiches, coriandre fraîche, citron et dattes.' },
    en: { nom: 'Harira', desc: 'Tomato, lentil and chickpea soup with fresh coriander, lemon and dates.' } },
  { id: 'salade', categorie: 'entrees', prix: 55, photo: 'salade-marocaine', etiquettes: ['vegetarien'],
    fr: { nom: 'Salade marocaine', desc: 'Tomates, concombre, oignon rouge, olives noires, huile d\'argan et cumin.' },
    en: { nom: 'Moroccan salad', desc: 'Tomatoes, cucumber, red onion, black olives, argan oil and cumin.' } },
  { id: 'briouates', categorie: 'entrees', prix: 65, photo: 'briouates-2', etiquettes: [],
    fr: { nom: 'Briouates au bœuf', desc: 'Feuilles de brick croustillantes, bœuf épicé, sésame doré.' },
    en: { nom: 'Beef briouates', desc: 'Crisp brick pastry filled with spiced beef, golden sesame.' } },
  { id: 'assortiment', categorie: 'entrees', prix: 85, photo: 'salades-variees', etiquettes: ['vegetarien', 'signature'],
    fr: { nom: 'Assortiment de salades', desc: 'Sept petites salades cuites et crues : zaalouk, taktouka, carottes au cumin…' },
    en: { nom: 'Salad selection', desc: 'Seven small cooked and raw salads: zaalouk, taktouka, cumin carrots…' } },

  { id: 'agneau', categorie: 'plats', prix: 170, photo: 'agneau-pruneaux', etiquettes: ['signature'],
    fr: { nom: 'Souris d\'agneau aux pruneaux', desc: 'Confite sept heures, pruneaux, amandes grillées, sésame et cannelle.' },
    en: { nom: 'Lamb shank with prunes', desc: 'Slow-cooked for seven hours, prunes, toasted almonds, sesame and cinnamon.' } },
  { id: 'couscous', categorie: 'plats', prix: 150, photo: 'couscous-agneau', etiquettes: ['signature'],
    fr: { nom: 'Couscous du vendredi', desc: 'Semoule roulée à la main, agneau, sept légumes, tfaya aux raisins et oignons.' },
    en: { nom: 'Friday couscous', desc: 'Hand-rolled semolina, lamb, seven vegetables, raisin and onion tfaya.' } },
  { id: 'poulet', categorie: 'plats', prix: 135, photo: 'poulet-citron', etiquettes: [],
    fr: { nom: 'Tajine de poulet au citron confit', desc: 'Poulet fermier, citrons confits maison, olives violettes, gingembre.' },
    en: { nom: 'Chicken tagine with preserved lemon', desc: 'Free-range chicken, house-preserved lemons, purple olives, ginger.' } },
  { id: 'kefta', categorie: 'plats', prix: 120, photo: 'tajine-kefta', etiquettes: ['epice'],
    fr: { nom: 'Tajine de kefta aux œufs', desc: 'Boulettes de bœuf, sauce tomate épicée, œufs, persil et coriandre.' },
    en: { nom: 'Kefta tagine with eggs', desc: 'Beef meatballs, spicy tomato sauce, eggs, parsley and coriander.' } },
  { id: 'legumes', categorie: 'plats', prix: 110, photo: 'tajine-legumes', etiquettes: ['vegetarien'],
    fr: { nom: 'Tajine de légumes du marché', desc: 'Légumes de saison, pois chiches, ras-el-hanout et huile d\'olive.' },
    en: { nom: 'Market vegetable tagine', desc: 'Seasonal vegetables, chickpeas, ras el hanout and olive oil.' } },
  { id: 'brochettes', categorie: 'plats', prix: 125, photo: 'brochettes-kefta', etiquettes: ['epice'],
    fr: { nom: 'Brochettes de kefta', desc: 'Grillées au charbon de bois, semoule aux herbes, harissa maison.' },
    en: { nom: 'Kefta skewers', desc: 'Charcoal-grilled, herb semolina, house harissa.' } },

  { id: 'mhencha', categorie: 'desserts', prix: 60, photo: 'mhencha', etiquettes: ['vegetarien', 'signature'],
    fr: { nom: 'M\'hencha', desc: '« Le serpent » : pâte feuilletée à la pâte d\'amandes, eau de fleur d\'oranger, miel.' },
    en: { nom: 'M\'hencha', desc: '"The snake": almond-paste pastry coil, orange blossom water, honey.' } },
  { id: 'oranges', categorie: 'desserts', prix: 45, photo: 'salade-oranges', etiquettes: ['vegetarien'],
    fr: { nom: 'Oranges à la cannelle', desc: 'Oranges de Berkane, cannelle, grenade et fleur d\'oranger.' },
    en: { nom: 'Cinnamon oranges', desc: 'Berkane oranges, cinnamon, pomegranate and orange blossom.' } },
  { id: 'seffa', categorie: 'desserts', prix: 70, photo: 'seffa', etiquettes: ['vegetarien'],
    fr: { nom: 'Seffa', desc: 'Vermicelles ou semoule vapeur, beurre, sucre glace, cannelle et amandes.' },
    en: { nom: 'Seffa', desc: 'Steamed semolina with butter, icing sugar, cinnamon and almonds.' } },

  { id: 'the', categorie: 'boissons', prix: 30, photo: 'the-menthe', etiquettes: ['signature'],
    fr: { nom: 'Thé à la menthe', desc: 'Servi à la théière, menthe fraîche et gunpowder, comme à la maison.' },
    en: { nom: 'Mint tea', desc: 'Served by the pot, fresh mint and gunpowder tea, just like at home.' } },
  { id: 'jus', categorie: 'boissons', prix: 35, photo: 'jus-orange', etiquettes: [],
    fr: { nom: 'Jus d\'orange pressé', desc: 'Pressé à la commande, comme sur la place Jemaa el-Fna.' },
    en: { nom: 'Fresh orange juice', desc: 'Squeezed to order, just like on Jemaa el-Fna square.' } },
  { id: 'nossnoss', categorie: 'boissons', prix: 25, photo: '', etiquettes: [],
    fr: { nom: 'Café noss-noss', desc: 'Moitié café, moitié lait, servi dans un verre.' },
    en: { nom: 'Noss-noss coffee', desc: 'Half coffee, half milk, served in a glass.' } },
  { id: 'avocat', categorie: 'boissons', prix: 40, photo: '', etiquettes: ['vegetarien'],
    fr: { nom: 'Jus d\'avocat', desc: 'Avocat, lait et une touche de fleur d\'oranger.' },
    en: { nom: 'Avocado shake', desc: 'Avocado, milk and a hint of orange blossom.' } }
];

// Galerie : "type" sert au filtre (plats / lieu).
const GALERIE = [
  { photo: 'salon-rouge', type: 'lieu', fr: 'Le salon rouge, pour les dîners privés', en: 'The red lounge, for private dinners' },
  { photo: 'agneau-pruneaux', type: 'plats', fr: 'Souris d\'agneau aux pruneaux', en: 'Lamb shank with prunes' },
  { photo: 'riad-zellige', type: 'lieu', fr: 'L\'escalier de zellige', en: 'The zellige staircase' },
  { photo: 'the-menthe', type: 'plats', fr: 'Le thé, servi à la théière', en: 'Tea, served by the pot' },
  { photo: 'lanterne', type: 'lieu', fr: 'Lanterne en cuivre ciselé', en: 'Chiselled copper lantern' },
  { photo: 'couscous-agneau', type: 'plats', fr: 'Couscous du vendredi', en: 'Friday couscous' },
  { photo: 'riad-patio', type: 'lieu', fr: 'Le patio et sa fontaine', en: 'The patio and its fountain' },
  { photo: 'salades-variees', type: 'plats', fr: 'Assortiment de salades', en: 'Salad selection' },
  { photo: 'terrasse-atlas', type: 'lieu', fr: 'La terrasse, face à l\'Atlas', en: 'The terrace, facing the Atlas' },
  { photo: 'mhencha', type: 'plats', fr: 'M\'hencha au miel', en: 'Honey m\'hencha' },
  { photo: 'table-lanterne', type: 'lieu', fr: 'Une table sous les lanternes', en: 'A table under the lanterns' },
  { photo: 'tajine-kefta', type: 'plats', fr: 'Tajine de kefta aux œufs', en: 'Kefta tagine with eggs' },
  { photo: 'jemaa-nuit', type: 'lieu', fr: 'Jemaa el-Fna, à trois minutes', en: 'Jemaa el-Fna, three minutes away' },
  { photo: 'harira', type: 'plats', fr: 'Harira', en: 'Harira' },
  { photo: 'lanterne-lumiere', type: 'lieu', fr: 'Jeux d\'ombre et de lumière', en: 'Light and shadow' },
  { photo: 'poulet-citron', type: 'plats', fr: 'Poulet au citron confit', en: 'Chicken with preserved lemon' }
];

// Crédits des photos (licences Creative Commons : l'auteur doit être cité).
const CREDITS = [
  ['harira', 'Axel Freeman', 'CC BY 2.0', 'https://www.flickr.com/photos/199745331@N06/53525181373'],
  ['salade-marocaine', 'stu_spivack', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/35034346243@N01/3871987685'],
  ['briouates-2', 'jlastras', 'CC BY 2.0', 'https://www.flickr.com/photos/22662305@N04/3210175637'],
  ['salades-variees', 'midom', 'CC BY 2.0', 'https://www.flickr.com/photos/81295370@N00/6333921481'],
  ['couscous-agneau', 'The Marmot', 'CC BY 2.0', 'https://www.flickr.com/photos/38142119@N00/2122890652'],
  ['tajine-kefta', 'kevingessner', 'CC BY 2.0', 'https://www.flickr.com/photos/26681198@N06/13593110274'],
  ['poulet-citron', 'BryanAlexander', 'CC BY 2.0', 'https://www.flickr.com/photos/36521954815@N01/522905658'],
  ['agneau-pruneaux', 'TheGirlsNY', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/55768440@N00/4217898580'],
  ['tajine-legumes', 'britsinvade', 'CC BY 2.0', 'https://www.flickr.com/photos/26227335@N02/4761163140'],
  ['brochettes-kefta', 'fred_v', 'CC BY 2.0', 'https://www.flickr.com/photos/8514720@N04/4971298135'],
  ['mhencha', 'Axel Freeman', 'CC BY 2.0', 'https://www.flickr.com/photos/199745331@N06/53524153942'],
  ['salade-oranges', 'Stacy Spensley', 'CC BY 2.0', 'https://www.flickr.com/photos/21001756@N06/6428897259'],
  ['seffa', 'Axel Freeman', 'CC BY 2.0', 'https://www.flickr.com/photos/199745331@N06/53525310759'],
  ['the-menthe', '_demare.thibaut_', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/129287439@N02/17158560399'],
  ['jus-orange', 'michaeljohnbutton', 'CC BY 2.0', 'https://www.flickr.com/photos/73156278@N08/14065962094'],
  ['koutoubia', 'Qu1m', 'CC BY 2.0', 'https://www.flickr.com/photos/96076734@N00/3963573247'],
  ['lanterne', 'Bigul Malayi', 'CC0 1.0', 'https://wordpress.org/photos/photo/5126981cbe/'],
  ['lanterne-lumiere', 'exfordy', 'CC BY 2.0', 'https://www.flickr.com/photos/32659528@N00/387100380'],
  ['salon-rouge', 'FOTOSHO-TO', 'CC BY 2.0', 'https://www.flickr.com/photos/87193413@N00/9409050823'],
  ['riad-zellige', 'Citizen59', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/11085937@N02/2386587236'],
  ['riad-patio', 'Damien Ayers', 'CC BY 2.0', 'https://www.flickr.com/photos/13935267@N00/3021112155'],
  ['table-lanterne', 'andynash', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/94611718@N00/15920037111'],
  ['salle', 'Sam Howzit', 'CC BY 2.0', 'https://www.flickr.com/photos/12508217@N08/10148586926'],
  ['terrasse-atlas', 'martinvarsavsky', 'CC BY 2.0', 'https://www.flickr.com/photos/33928733@N00/11035208995'],
  ['riad-terrasse', 'alexdecarvalho', 'CC BY 2.0', 'https://www.flickr.com/photos/51035823282@N01/152967063'],
  ['jemaa-nuit', 'A. Cahlenstein Photography', 'CC BY 2.0', 'https://www.flickr.com/photos/65296735@N08/15539174756'],
  ['marchand', 'michaeljohnbutton', 'CC BY 2.0', 'https://www.flickr.com/photos/73156278@N08/14085549593']
];
