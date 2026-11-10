// ─────────────────────────────────────────────────────────────
//  Kaboul Paris Nord — données du site
//  Tout ce qui change souvent (infos, menu) est ici.
// ─────────────────────────────────────────────────────────────

export const CONFIG = {
  nom: 'Kaboul Paris Nord',

  // ── Coordonnées : à remplir. Tant qu'un champ est vide, le site le masque
  //    ou affiche « Bientôt en ligne ».
  adresse: '153 rue La Fayette, 75010 Paris',
  telephone: '',          // ex. '01 23 45 67 89'
  whatsapp: '',           // format international sans « + », ex. '33612345678'

  // Horaires, du lundi au dimanche (7 lignes). Exemples :
  //   '11:00-23:00'   ·   '11:30-15:00, 18:30-23:00'   ·   'fermé'
  // Laisser le tableau vide tant que les horaires ne sont pas connus.
  horaires: ['11:00-22:30', '11:00-22:30', '11:00-22:30', '11:00-22:30', '11:00-22:30', '11:00-22:30', '11:00-22:30'],

  // Liens facultatifs (laisser vide pour masquer le bouton).
  googleAvis: '',         // lien « Laisser un avis » de la fiche Google
  instagram: '',
  tiktok: '',
  uberEats: '',
  deliveroo: '',

  // true = les avis restent dans le navigateur du visiteur (pas encore de serveur).
  // À passer à false quand les avis seront enregistrés en ligne.
  avisLocaux: true,
};

const P = 'assets/img/plats/';

export const MENU = [
  {
    id: 'specialites', nom: 'Spécialités', titre: 'Les plats',
    items: [
      { nom: 'Assiette mixte', prix: 14, img: P + 'assiette-mixte.jpg', badge: 'Notre spécialité' },
      { nom: 'Kabuli palaw', prix: 10, img: P + 'kabuli-palaw.jpg' },
      { nom: 'Mantou', prix: 10, img: P + 'mantou.webp' },
      { nom: 'Biryani', prix: 8, img: P + 'biryani.jpg' },
      { nom: 'Assiette poulet kebab', prix: 9, img: P + 'assiette-poulet-kebab.jpg' },
      { nom: 'Chapli kebab + 2 naans nature & boisson 33cl', prix: 10, img: P + 'chapli-kebab.jpg' },
      { nom: 'Poisson avec riz', prix: 9, img: P + 'poisson.webp' },
    ],
  },
  {
    id: 'entrees', nom: 'Entrées', titre: 'Les entrées',
    items: [
      { nom: 'Naan fromage + 4 pièces poulet tikka', prix: 6, img: P + 'naan-tikka.webp' },
      { nom: 'Seekh kebab (2 pièces)', prix: 4, img: P + 'seekh-kebab.jpg' },
      { nom: 'Samossa (2 pièces)', prix: 3, img: P + 'samossa.jpg' },
      { nom: 'Schante samossa (2 pièces)', prix: 4, img: P + 'schante-samossa.jpg' },
      { nom: 'Poulet tandoori', prix: 3, img: P + 'poulet-tandoori.webp' },
      { nom: 'Poulet tikka (4 pièces)', prix: 4, img: P + 'poulet-tikka.jpg' },
      { nom: 'Sandwich chapli kebab', prix: 5, img: P + 'sandwich-chapli.jpg' },
    ],
  },
  {
    id: 'mijotes', nom: 'Plats mijotés', titre: 'Les plats mijotés',
    items: [
      { nom: 'Paya pacha / pied de bœuf', prix: 8, img: P + 'paya.webp' },
      { nom: 'Kurma + naan', prix: 8, img: P + 'kurma.jpg' },
      { nom: 'Keema + naan', prix: 8, img: P + 'keema.jpg' },
      { nom: 'Kofta + naan', prix: 8, img: P + 'kofta.jpg' },
      { nom: 'Poulet korma + naan', prix: 8, img: P + 'poulet-korma.jpg' },
      { nom: 'Veau kurma + naan', prix: 12, img: P + 'veau-kurma.jpg' },
      { nom: 'Depiaza + naan', prix: 12, img: P + 'depiaza.jpg' },
      { nom: 'Foie de bœuf + naan', prix: 8, img: P + 'foie.jpg' },
      { nom: 'Épinards + naan', prix: 8, img: P + 'epinards.jpg' },
      { nom: 'Bamia + naan', prix: 8, img: P + 'bamia.webp' },
      { nom: 'Chou-fleur + naan', prix: 8, img: P + 'chou-fleur.jpg' },
      { nom: 'Haricots rouges + naan', prix: 8, img: P + 'haricots.jpg' },
      { nom: 'Pois chiches + naan', prix: 8, img: P + 'pois-chiches.jpg' },
      { nom: 'Lentilles + naan', prix: 8, img: P + 'lentilles.jpg' },
      { nom: 'Riz avec sauce au choix', prix: 8, img: P + 'riz-sauce.jpg' },
      { nom: 'Riz blanc', prix: 4, img: P + 'riz-blanc.webp' },
    ],
  },
  {
    id: 'karahi', nom: 'Karahi', titre: 'Karahi', note: 'Servis avec naan',
    items: [
      { nom: 'Karahi poulet + naan', prix: 25, img: P + 'karahi-poulet.jpg' },
      { nom: 'Karahi agneau + naan', prix: 35, img: P + 'karahi-agneau.jpg' },
      { nom: 'Karahi poulet tikka + naan', prix: 30, img: P + 'karahi-tikka.webp' },
    ],
  },
  {
    id: 'wings', nom: 'Wings & frites', titre: 'Wings & frites',
    items: [
      { nom: '10 wings + frites & boisson 33cl', prix: 8.5, img: P + 'wings-10.webp' },
      { nom: '15 wings', prix: 7, img: P + 'wings-15.webp' },
      { nom: 'Barquette de frites', prix: 2.5, img: P + 'frites.jpg' },
    ],
  },
  {
    id: 'naans', nom: 'Naans & soupe', titre: 'Naans & soupe', liste: true, photo: P + 'naans-soupe.jpg',
    items: [
      { nom: 'Bolani', prix: 2 },
      { nom: 'Afghani naan', prix: 1.5 },
      { nom: 'Naan nature', prix: 1 },
      { nom: 'Naan fromage', prix: 2.5 },
      { nom: 'Afghani soupe', prix: 5 },
    ],
  },
  {
    id: 'boissons', nom: 'Boissons', titre: 'Les boissons', liste: true, photo: P + 'boissons.jpg',
    items: [
      { nom: 'Lassi mangue', prix: 3 },
      { nom: 'Thé, café', prix: 1.5 },
      { nom: 'Boissons 33cl', prix: 1.5, desc: 'Coca, Fanta…' },
      { nom: 'Boissons 1,5L', prix: 3, desc: 'Coca, Fanta…' },
      { nom: 'Bouteille d’eau 50cl', prix: 1 },
      { nom: 'Bouteille d’eau 1,5L', prix: 2 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
//  Page d'accueil
// ─────────────────────────────────────────────────────────────

// Plats qui défilent en haut de page (photos détourées uniquement).
export const DEFILE = ['Karahi poulet tikka + naan', 'Mantou', 'Poisson avec riz',
                       '10 wings + frites & boisson 33cl', 'Naan fromage + 4 pièces poulet tikka'];

// Les incontournables. ⚠️ Textes de présentation à valider par le restaurant.
export const VEDETTES = [
  {
    plat: 'Kabuli palaw', img: 'assets/img/kabuli-couverture.jpg', cadre: true, sur: 'Le plat national afghan',
    texte: 'Un riz basmati parfumé, des carottes fondantes, des raisins secs et de généreux morceaux de viande. S’il ne fallait en goûter qu’un, ce serait celui-là.',
  },
  {
    plat: 'Mantou', sur: 'Les raviolis afghans',
    texte: 'Des raviolis cuits à la vapeur, nappés de sauce et parsemés d’herbes fraîches, servis avec leur salade et leur chutney.',
  },
  {
    plat: 'Karahi poulet tikka + naan', titre: 'Karahi', sur: 'Mijoté dans son plat traditionnel',
    texte: 'Il porte le nom du plat dans lequel il mijote et arrive à table. Au poulet, à l’agneau ou au poulet tikka, toujours avec un naan tout chaud.',
    prix: 'à partir de 25,00 €',
  },
];

// Les bons plans : des plats de la carte, mis en avant.
export const BONS_PLANS = ['Chapli kebab + 2 naans nature & boisson 33cl', '10 wings + frites & boisson 33cl',
                           'Naan fromage + 4 pièces poulet tikka', 'Assiette mixte'];

