// ─────────────────────────────────────────────────────────────
//  Kaboul Paris Nord — données du site
//  Tout ce qui change souvent (infos, menu) est ici.
// ─────────────────────────────────────────────────────────────

export const CONFIG = {
  nom: 'Kaboul Paris Nord',

  // Société qui exploite le restaurant (mentions légales).
  societe: {
    nom: 'SAS Amin Jan',
    tva: 'FR45 108 643 503',
    siren: '108 643 503',   // déduit du numéro de TVA
    siret: '',              // à compléter (14 chiffres)
    responsable: '',        // responsable de la publication, à compléter
    hebergeur: 'Render Services, Inc. — 525 Brannan Street, Suite 300, San Francisco, CA 94107, États-Unis — render.com',
  },

  // ── Coordonnées : à remplir. Tant qu'un champ est vide, le site le masque
  //    ou affiche « Bientôt en ligne ».
  adresse: '153 rue La Fayette, 75010 Paris',
  telephone: '',          // ex. '01 23 45 67 89'
  whatsapp: '',           // format international sans « + », ex. '33612345678'

  // Livraison proposée ? (false = le site indique « Pas de livraison pour le moment »)
  livraison: false,

  // Horaires, du lundi au dimanche (7 lignes). Exemples :
  //   '11:00-23:00'   ·   '11:30-15:00, 18:30-23:00'   ·   'fermé'
  // Laisser le tableau vide tant que les horaires ne sont pas connus.
  horaires: ['11:00-22:00', '11:00-22:00', '11:00-22:00', '11:00-22:00', '11:00-22:00', '11:00-22:00', '11:00-22:00'],

  // Liens facultatifs (laisser vide pour masquer le bouton).
  // Lien direct pour laisser un avis sur la fiche Google du restaurant.
  googleAvis: 'https://g.page/r/CWn5BgDWQ9XsECE/review',
  instagram: '',
  tiktok: '',
  uberEats: '',
  deliveroo: '',

  // Sauvegarde des avis en ligne (Supabase). Tant que ces deux champs sont vides,
  // les avis restent dans le navigateur du visiteur. Voir le README.
  supabaseUrl: 'https://xksgdbmtqqeubuedgxqv.supabase.co',
  supabaseCle: 'sb_publishable_kZ371KxzbwMLJPBra4mVKw_xAcfnTlN',   // clé publique « anon » / « publishable » (jamais la clé « service_role »)
};

const P = 'assets/img/plats/';

export const MENU = [
  {
    id: 'specialites', nom: 'Spécialités', titre: 'Les plats',
    items: [
      { nom: 'Kabuli palaw', prix: 10, img: P + 'kabuli-palaw.webp', badge: 'Notre spécialité' },
      { nom: 'Assiette mixte', prix: 14, img: P + 'assiette-mixte.webp' },
      { nom: 'Mantou', prix: 10, img: P + 'mantou.webp', badge: 'Notre spécialité' },
      { nom: 'Biryani', prix: 8, img: P + 'biryani.webp' },
      { nom: 'Assiette poulet kebab', prix: 9, img: P + 'assiette-poulet-kebab.webp' },
      { nom: 'Chapli kebab + 2 naans nature & boisson 33cl', prix: 10, img: P + 'chapli-kebab.webp' },
      { nom: 'Poisson avec riz', prix: 9, img: P + 'poisson.webp' },
    ],
  },
  {
    id: 'entrees', nom: 'Entrées', titre: 'Les entrées',
    items: [
      { nom: 'Naan fromage + 4 pièces poulet tikka', prix: 6, img: P + 'naan-tikka.webp' },
      { nom: 'Seekh kebab (2 pièces)', prix: 4, img: P + 'seekh-kebab.webp' },
      { nom: 'Samossa (2 pièces)', prix: 3, img: P + 'samossa.webp' },
      { nom: 'Schante samossa (2 pièces)', prix: 4, img: P + 'schante-samossa.webp' },
      { nom: 'Poulet tandoori', prix: 3, img: P + 'poulet-tandoori.webp' },
      { nom: 'Poulet tikka (4 pièces)', prix: 4, img: P + 'poulet-tikka.webp' },
      { nom: 'Sandwich chapli kebab', prix: 5, img: P + 'sandwich-chapli.webp' },
    ],
  },
  {
    id: 'mijotes', nom: 'Plats mijotés', titre: 'Les plats mijotés',
    items: [
      { nom: 'Paya pacha / pied de bœuf', prix: 8, img: P + 'paya.webp' },
      { nom: 'Kurma + naan', prix: 8, img: P + 'kurma.jpg' },
      { nom: 'Keema + naan', prix: 8, img: P + 'keema.webp' },
      { nom: 'Kofta + naan', prix: 8, img: P + 'kofta.webp' },
      { nom: 'Poulet korma + naan', prix: 8, img: P + 'poulet-korma.webp' },
      { nom: 'Veau kurma + naan', prix: 12, img: P + 'veau-kurma.webp' },
      { nom: 'Depiaza + naan', prix: 12, img: P + 'depiaza.webp' },
      { nom: 'Foie de bœuf + naan', prix: 8, img: P + 'foie.webp' },
      { nom: 'Épinards + naan', prix: 8, img: P + 'epinards.webp' },
      { nom: 'Bamia + naan', prix: 8, img: P + 'bamia.webp' },
      { nom: 'Chou-fleur + naan', prix: 8, img: P + 'chou-fleur.webp' },
      { nom: 'Haricots rouges + naan', prix: 8, img: P + 'haricots.webp' },
      { nom: 'Pois chiches + naan', prix: 8, img: P + 'pois-chiches.webp' },
      { nom: 'Lentilles + naan', prix: 8, img: P + 'lentilles.webp' },
      { nom: 'Riz avec sauce au choix', prix: 8, img: P + 'riz-sauce.webp' },
      { nom: 'Riz blanc', prix: 4, img: P + 'riz-blanc.webp' },
    ],
  },
  {
    id: 'karahi', nom: 'Karahi', titre: 'Karahi', note: 'Servis avec naan',
    items: [
      { nom: 'Karahi poulet + naan', prix: 25, img: P + 'karahi-poulet.webp' },
      { nom: 'Karahi agneau + naan', prix: 35, img: P + 'karahi-agneau.webp' },
      { nom: 'Karahi poulet tikka + naan', prix: 30, img: P + 'karahi-tikka.webp' },
    ],
  },
  {
    id: 'wings', nom: 'Wings & frites', titre: 'Wings & frites',
    items: [
      { nom: '10 wings + frites & boisson 33cl', prix: 8.5, img: P + 'wings-10.webp' },
      { nom: '15 wings', prix: 7, img: P + 'wings-15.webp' },
      { nom: 'Barquette de frites', prix: 2.5, img: P + 'frites.webp' },
    ],
  },
  {
    id: 'naans', nom: 'Naans & soupe', titre: 'Naans & soupe',
    items: [
      { nom: 'Bolani', prix: 2, img: P + 'bolani.webp' },
      { nom: 'Afghani naan', prix: 1.5, img: P + 'afghani-naan.webp', badge: 'Notre spécialité' },
      { nom: 'Naan nature', prix: 1, img: P + 'naan-nature.webp' },
      { nom: 'Naan fromage', prix: 2.5, img: P + 'naan-fromage.webp' },
      { nom: 'Afghani soupe', prix: 5, img: P + 'soupe.webp', badge: 'Notre spécialité' },
    ],
  },
  {
    id: 'boissons', nom: 'Boissons', titre: 'Les boissons',
    items: [
      { nom: 'Lassi mangue', prix: 3, img: P + 'lassi.jpg' },
      { nom: 'Thé, café', prix: 1.5, img: P + 'the-cafe.webp' },
      { nom: 'Boissons 33cl', prix: 1.5, img: P + 'boissons-33cl.webp', desc: 'Coca, Fanta…' },
      { nom: 'Boissons 1,5L', prix: 3, img: P + 'boissons-15l.webp', desc: 'Coca, Fanta…' },
      { nom: 'Bouteille d’eau 50cl', prix: 1, img: P + 'eau-15l.webp' },
      { nom: 'Bouteille d’eau 1,5L', prix: 2, img: P + 'eau-15l.webp' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
//  Page d'accueil
// ─────────────────────────────────────────────────────────────

// Plats qui défilent en haut de page (photos détourées uniquement).
export const DEFILE = ['Kabuli palaw', 'Karahi poulet tikka + naan', 'Assiette mixte', 'Mantou', 'Poisson avec riz',
                       '10 wings + frites & boisson 33cl', 'Naan fromage + 4 pièces poulet tikka'];

// Les incontournables. ⚠️ Textes de présentation à valider par le restaurant.
export const VEDETTES = [
  {
    plat: 'Kabuli palaw', sur: 'Notre spécialité · le plat national afghan',
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

