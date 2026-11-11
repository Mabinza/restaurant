// ─────────────────────────────────────────────────────────────
//  Langue du site : français (texte d'origine) ou anglais.
//  Le site est écrit en français ; en anglais, les textes affichés
//  sont remplacés à partir du dictionnaire ci-dessous.
//  Pour corriger une traduction : modifier la partie droite de la ligne.
// ─────────────────────────────────────────────────────────────

const CLE = 'kpn-langue';
const lireChoix = () => { try { return localStorage.getItem(CLE); } catch (e) { return null; } };
const duNavigateur = () => ((navigator.language || 'fr').slice(0, 2) === 'fr' ? 'fr' : 'en');
const param = new URLSearchParams(location.search).get('lang');

export const CHOISIE = ['fr', 'en'].includes(param) ? param : lireChoix();   // null = jamais choisie
export const LANGUE = ['fr', 'en'].includes(CHOISIE) ? CHOISIE : duNavigateur();

export function choisirLangue(langue) {
  try { localStorage.setItem(CLE, langue); } catch (e) {}
  if (langue === LANGUE && !param) return false;
  const u = new URL(location.href); u.searchParams.delete('lang');
  location.replace(u.pathname + u.search + u.hash);   // recharge dans la nouvelle langue
  return true;
}

// Petites explications ajoutées en anglais pour les plats peu connus des visiteurs.
export const GLOSES = {
  'Kabuli palaw': 'Rice with carrots, raisins and meat',
  'Mantou': 'Afghan steamed dumplings',
  'Biryani': 'Spiced rice with chicken',
  'Chapli kebab + 2 naans nature & boisson 33cl': 'Spiced minced-meat patties',
  'Sandwich chapli kebab': 'Spiced minced-meat patty in bread',
  'Seekh kebab (2 pièces)': 'Minced-meat skewers',
  'Schante samossa (2 pièces)': 'Samosas topped with chickpeas, yogurt and chutney',
  'Paya pacha / pied de bœuf': 'Slow-cooked beef trotters',
  'Keema + naan': 'Minced meat in sauce',
  'Kofta + naan': 'Meatballs in sauce',
  'Depiaza + naan': 'Meat cooked with onions',
  'Bamia + naan': 'Okra stew',
  'Bolani': 'Stuffed flatbread',
  'Afghani naan': 'Traditional Afghan flatbread',
  'Lassi mangue': 'Yogurt drink with mango',
};

const EN = {
  // ── navigation
  'Incontournables': 'Must-tries', 'La carte': 'Menu', 'Avis': 'Reviews', 'Infos': 'Info', 'Carte': 'Menu',
  'Ma sélection': 'My selection', 'Sélection': 'Selection', 'Aller à la carte': 'Skip to the menu',
  'Ouvert': 'Open', 'Fermé': 'Closed', 'Fermé actuellement': 'Closed now',
  // ── accueil
  'Cuisine afghane': 'Afghan cuisine', 'saveurs parisiennes': 'Parisian flavours',
  'Kabuli palaw, mantou, karahi, grillades et naans sortis du four.': 'Kabuli palaw, mantou, karahi, grilled meats and naan fresh from the oven.',
  'Voir la carte': 'See the menu', 'Nous trouver': 'Find us',
  'Sur place': 'Eat in', 'À emporter': 'Takeaway',
  'Une carte halal': 'A fully halal menu', 'le plat mijoté, servi avec son naan': 'for a stew served with naan',
  'plats et boissons à la carte': 'dishes and drinks on the menu',
  // ── incontournables
  'À goûter absolument': 'Not to be missed', 'Les incontournables': 'Our must-tries',
  'Vous découvrez la cuisine afghane ? Commencez par ces trois plats.': 'New to Afghan food? Start with these three dishes.',
  'Notre spécialité · le plat national afghan': 'Our speciality · the Afghan national dish',
  'Un riz basmati parfumé, des carottes fondantes, des raisins secs et de généreux morceaux de viande. S’il ne fallait en goûter qu’un, ce serait celui-là.':
    'Fragrant basmati rice, tender carrots, raisins and generous pieces of meat. If you only try one dish, make it this one.',
  'Les raviolis afghans': 'Afghan dumplings',
  'Des raviolis cuits à la vapeur, nappés de sauce et parsemés d’herbes fraîches, servis avec leur salade et leur chutney.':
    'Steamed dumplings topped with sauce and fresh herbs, served with salad and chutney.',
  'Mijoté dans son plat traditionnel': 'Simmered in its traditional pan',
  'Il porte le nom du plat dans lequel il mijote et arrive à table. Au poulet, à l’agneau ou au poulet tikka, toujours avec un naan tout chaud.':
    'Named after the pan it is cooked and served in. With chicken, lamb or chicken tikka, always with warm naan.',
  'Voir sur la carte →': 'See on the menu →',
  'Petits prix': 'Great value', 'Les bons plans': 'Best deals',
  // ── carte
  'Tous nos plats': 'All our dishes',
  'Touchez un plat pour le voir en grand, et le': 'Tap a dish to see it larger, and', 'pour l’ajouter à votre sélection.': 'to add it to your selection.',
  'Chercher un plat': 'Search for a dish', 'Chercher un plat : naan, poulet, kebab…': 'Search: naan, chicken, kebab…',
  'Aucun plat trouvé': 'No dish found', 'Essayez un autre mot, ou parcourez les catégories.': 'Try another word, or browse the categories.',
  'Notre spécialité': 'Our speciality', 'Servis avec naan': 'Served with naan',
  'Spécialités': 'Specialities', 'Les plats': 'Main dishes', 'Entrées': 'Starters', 'Les entrées': 'Starters',
  'Plats mijotés': 'Stews', 'Les plats mijotés': 'Stews', 'Wings & frites': 'Wings & fries',
  'Naans & soupe': 'Naan & soup', 'Boissons': 'Drinks', 'Les boissons': 'Drinks',
  // ── plats
  'Assiette mixte': 'Mixed grill platter', 'Assiette poulet kebab': 'Chicken kebab platter',
  'Chapli kebab + 2 naans nature & boisson 33cl': 'Chapli kebab + 2 plain naans & 33cl drink',
  'Poisson avec riz': 'Fish with rice',
  'Naan fromage + 4 pièces poulet tikka': 'Cheese naan + 4 pieces chicken tikka',
  'Seekh kebab (2 pièces)': 'Seekh kebab (2 pieces)', 'Samossa (2 pièces)': 'Samosa (2 pieces)',
  'Schante samossa (2 pièces)': 'Schante samosa (2 pieces)', 'Poulet tandoori': 'Tandoori chicken',
  'Poulet tikka (4 pièces)': 'Chicken tikka (4 pieces)', 'Sandwich chapli kebab': 'Chapli kebab sandwich',
  'Paya pacha / pied de bœuf': 'Paya pacha / beef trotters', 'Poulet korma + naan': 'Chicken korma + naan',
  'Veau kurma + naan': 'Veal kurma + naan', 'Foie de bœuf + naan': 'Beef liver + naan', 'Épinards + naan': 'Spinach + naan',
  'Chou-fleur + naan': 'Cauliflower + naan', 'Haricots rouges + naan': 'Red kidney beans + naan',
  'Pois chiches + naan': 'Chickpeas + naan', 'Lentilles + naan': 'Lentils + naan',
  'Riz avec sauce au choix': 'Rice with your choice of sauce', 'Riz blanc': 'White rice',
  'Karahi poulet + naan': 'Chicken karahi + naan', 'Karahi agneau + naan': 'Lamb karahi + naan',
  'Karahi poulet tikka + naan': 'Chicken tikka karahi + naan',
  '10 wings + frites & boisson 33cl': '10 wings + fries & 33cl drink', 'Barquette de frites': 'Portion of fries',
  'Naan nature': 'Plain naan', 'Naan fromage': 'Cheese naan', 'Afghani soupe': 'Afghan soup',
  'Lassi mangue': 'Mango lassi', 'Thé, café': 'Tea, coffee', 'Boissons 33cl': 'Soft drinks 33cl', 'Boissons 1,5L': 'Soft drinks 1.5L',
  'Bouteille d’eau 50cl': 'Water bottle 50cl', 'Bouteille d’eau 1,5L': 'Water bottle 1.5L',
  // ── sélection
  'Ajouter à ma sélection': 'Add to my selection', 'Total estimé': 'Estimated total',
  'Ce n’est pas une commande : montrez cette liste au comptoir.': 'This is not an order: show this list at the counter.',
  'Ce n’est pas une commande : montrez cette liste au comptoir ou appelez-nous.': 'This is not an order: show this list at the counter or call us.',
  'Envoyer sur WhatsApp': 'Send on WhatsApp', 'Appeler le restaurant': 'Call the restaurant',
  'Partager ma sélection': 'Share my selection', 'Tout effacer': 'Clear all',
  'Votre sélection est vide': 'Your selection is empty', 'Touchez le + d’un plat pour l’ajouter et voir le total.': 'Tap the + on a dish to add it and see the total.',
  'Sélection copiée': 'Selection copied', 'Partage impossible sur cet appareil': 'Sharing is not available on this device',
  'Fermer': 'Close', 'Un de moins': 'One less', 'Un de plus': 'One more',
  // ── avis
  'Votre expérience': 'Your experience', 'Vos avis': 'Your reviews',
  'Vous êtes venu manger chez nous ? Dites-nous ce que vous en avez pensé.': 'Have you eaten with us? Tell us what you thought.',
  'Laisser un avis': 'Leave a review', 'Votre note': 'Your rating', 'Nom': 'Name', 'Commentaire': 'Comment',
  'Votre nom ou prénom': 'Your name', 'Les plats, l’accueil, l’ambiance…': 'The food, the welcome, the atmosphere…',
  'Publier mon avis': 'Post my review', 'Laisser aussi un avis sur Google': 'Also leave a review on Google',
  'Publier aussi sur Google': 'Also post it on Google',
  'Pour l’instant, votre avis est enregistré sur cet appareil uniquement.': 'For now, your review is saved on this device only.',
  'Aucun avis pour l’instant': 'No reviews yet', 'Soyez le premier à partager votre expérience.': 'Be the first to share your experience.',
  'Avis indisponibles': 'Reviews unavailable', 'Impossible de charger les avis pour le moment. Réessayez plus tard.': 'Reviews cannot be loaded right now. Please try again later.',
  'Choisissez une note en touchant les étoiles.': 'Choose a rating by tapping the stars.',
  'Indiquez votre nom et votre commentaire.': 'Please enter your name and your comment.',
  'Votre avis n’a pas pu être enregistré. Vérifiez votre connexion et réessayez.': 'Your review could not be saved. Check your connection and try again.',
  'Merci pour votre avis !': 'Thank you for your review!',
  'Merci ! Votre commentaire est copié : il ne reste qu’à le coller sur Google.': 'Thank you! Your comment is copied: just paste it on Google.',
  'Merci ! Vous pouvez aussi le publier sur Google.': 'Thank you! You can also post it on Google.',
  // ── infos
  'Infos pratiques': 'Practical info', 'Adresse': 'Address', 'Horaires': 'Opening hours', 'Téléphone': 'Phone',
  'Itinéraire': 'Directions', 'Appeler': 'Call', 'Bientôt en ligne': 'Coming soon', 'Tous les jours': 'Every day',
  'Sur place ou à emporter': 'Eat in or takeaway',
  'Mangez sur place ou emportez votre commande.': 'Eat in or take your order away.',
  'Pas de livraison pour le moment.': 'No delivery for now.',
  // ── bulle d'accueil
  'Dernières infos': 'Latest news', 'Bienvenue !': 'Welcome!',
  'Nous sommes ouverts !': 'We are open!',
  'Kaboul Paris Nord est ouvert depuis le 1er novembre 2026. Bienvenue ! Venez découvrir notre cuisine afghane, sur place ou à emporter.':
    'Kaboul Paris Nord has been open since 1 November 2026. Welcome! Come and discover our Afghan cuisine, to eat in or take away.',
  // ── pied de page
  'Cuisine afghane · saveurs parisiennes · halal': 'Afghan cuisine · Parisian flavours · halal',
  'Le logo, les textes, les photos et le contenu de ce site ne peuvent pas être copiés ni réutilisés sans autorisation écrite.':
    'The logo, texts, photos and content of this site may not be copied or reused without written permission.',
  'Mentions légales': 'Legal notice',
};

// Textes dont une partie change (heure, nombre, nom d'un plat).
const heure = (h, m) => `${h % 12 || 12}${m && m !== '00' ? ':' + m : ''} ${h < 12 || h === 24 ? 'am' : 'pm'}`;
const REGLES = [
  [/^Ouvert · jusqu’à (\d+) h(?: (\d\d))?$/, (_, h, m) => `Open · until ${heure(+h, m)}`],
  [/^Fermé · ouvre à (\d+) h(?: (\d\d))?$/, (_, h, m) => `Closed · opens at ${heure(+h, m)}`],
  [/^(\d+) h(?: (\d\d))? – (\d+) h(?: (\d\d))?$/, (_, a, b, c, d) => `${heure(+a, b)} – ${heure(+c, d)}`],
  [/^(\d+) avis$/, (_, n) => `${n} review${n === '1' ? '' : 's'}`],
  [/^(.+) ajouté$/, (_, nom) => `${traduire(nom)} added`],
  [/^à partir de (.+)$/, (_, p) => `from ${p}`],
  [/^(©.*) · Tous droits réservés$/, (_, d) => `${d} · All rights reserved`],
  [/^Voir (.+)$/, (_, nom) => `View ${traduire(nom)}`],
];
const COUPE = / \+.*$| \(.*$| \/.*$/;

export const enAnglais = texte => EN[texte] ?? texte;

export function traduire(texte) {
  if (LANGUE !== 'en') return texte;
  if (texte in EN) return EN[texte];
  for (const [re, fn] of REGLES) if (re.test(texte)) return texte.replace(re, fn);
  // nom de plat raccourci (« Karahi poulet tikka » pour « Karahi poulet tikka + naan »)
  for (const cle in EN) if (cle.startsWith(texte + ' ') && '+(/'.includes(cle[texte.length + 1])) return EN[cle].replace(COUPE, '');
  return texte;
}

// ── application à la page
const ATTRIBUTS = ['placeholder', 'aria-label', 'title'];
const ignore = n => n.parentElement?.closest('.un-avis, script, style, [lang="fa"], [lang="ar"], [data-fixe]');   // avis des clients : jamais traduits

function passerTexte(n) {
  const brut = n.nodeValue, net = brut.trim();
  if (!net || ignore(n)) return;
  const tr = traduire(net);
  if (tr !== net) n.nodeValue = brut.replace(net, tr);
}
function passer(racine) {
  if (racine.nodeType === Node.TEXT_NODE) return passerTexte(racine);
  if (racine.nodeType !== Node.ELEMENT_NODE) return;
  const marche = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT);
  for (let n = marche.nextNode(); n; n = marche.nextNode()) passerTexte(n);
  [racine, ...racine.querySelectorAll(ATTRIBUTS.map(a => `[${a}]`).join(','))].forEach(e => ATTRIBUTS.forEach(a => {
    const v = e.getAttribute?.(a); if (v) { const tr = traduire(v); if (tr !== v) e.setAttribute(a, tr); }
  }));
}

export function installerLangue() {
  document.documentElement.lang = LANGUE;
  if (LANGUE === 'en') {
    document.title = 'Kaboul Paris Nord — Afghan halal restaurant · Menu';
    document.querySelector('meta[name=description]')?.setAttribute('content',
      'Kaboul Paris Nord, Afghan halal restaurant at 153 rue La Fayette, Paris: kabuli palaw, mantou, karahi, grilled meats and naan. Open every day.');
    passer(document.body);
    new MutationObserver(ms => ms.forEach(m => {
      if (m.type === 'characterData') passerTexte(m.target);
      else m.addedNodes.forEach(passer);
    })).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
}
export const pret = () => document.documentElement.classList.remove('attente');
