# Kaboul Paris Nord — site du restaurant

Site vitrine du restaurant, pensé d'abord pour le téléphone :

- **Accueil** avec les plats qui défilent, le logo et le badge halal
- **Les incontournables** : trois plats présentés pour ceux qui découvrent la cuisine afghane
- **Les bons plans** : les formules de la carte mises en avant
- **La carte complète** : catégories, recherche, fiche de chaque plat
- **Ma sélection** : le client compose sa liste, voit le total et peut la partager
- **Avis** des clients et **infos pratiques** (adresse, horaires, téléphone, plan)

## En ligne

Le site est statique : il se publie tel quel, sans étape de construction.

- Adresse : https://kaboulparisnord.onrender.com
- Hébergé sur **Render** (site statique « kaboulparisnord »), qui republie automatiquement la branche
  à chaque modification. `render.yaml` décrit ce déploiement.

Quand l'adresse change, la mettre à jour dans les balises `og:url`, `og:image` et `canonical`
de `index.html`, sinon l'aperçu du lien partagé pointe vers l'ancienne.

## Lancer le site en local

Le site est 100 % statique (aucune installation). Il faut juste un petit serveur web :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Où modifier quoi

Presque tout se règle dans **`js/data.js`** :

| Quoi | Où |
| --- | --- |
| Adresse, téléphone, WhatsApp, horaires, liens (Google, Instagram…) | `CONFIG` |
| Dernière info affichée dans la bulle d'accueil | `CONFIG.actualite` |
| Plats, prix, catégories | `MENU` |
| Plats qui défilent en haut de page | `DEFILE` |
| Textes des incontournables | `VEDETTES` |
| Bons plans mis en avant | `BONS_PLANS` |

Le reste : photos dans `assets/img/plats/`, couleurs et typographie en haut de `css/style.css`.

Dès qu'un champ de `CONFIG` est rempli, le site s'adapte tout seul : bouton « Appeler »,
itinéraire et plan Google Maps, tableau des horaires avec l'indication « Ouvert / Fermé »,
envoi de la sélection par WhatsApp, liens vers les réseaux.

Les photos en `.webp` sont détourées (fond transparent). Les quelques `.jpg` restants viennent du menu PDF,
agrandis par IA : à remplacer par les vraies photos HD quand elles existent.

## Langues

Le site est écrit en français. La version anglaise est produite par `js/langue.js` : un dictionnaire
(texte français → texte anglais) appliqué à la page. Pour corriger ou ajouter une traduction, modifier
ce fichier ; un texte absent du dictionnaire reste affiché en français. Un plat ajouté dans `MENU`
doit donc aussi y recevoir sa traduction. À la première visite, une bulle de bienvenue propose de
choisir la langue ; le bouton FR / EN en haut de page permet d'en changer ensuite.

## Affichette QR code

`impression/affichette-qr.pdf` : page 1, une affiche A4 pour la vitrine (QR code vers la carte) ;
page 2, deux cartes de table à découper, chacune avec deux QR codes : la carte et la page d'avis Google.
Les QR codes pointent vers l'adresse du site et vers le lien d'avis Google : si l'un des deux change,
il faut les régénérer et réimprimer.

## État actuel — à savoir

- **Téléphone manquant** : la carte « Téléphone » affiche « Bientôt en ligne ».
- **Les avis sont enregistrés en ligne** (Supabase, projet « kaboul-paris-nord ») et visibles par tous.
- **Avis Google** : Google n'accepte que les avis écrits sur Google par une personne connectée à
  son compte. Le site ne peut donc pas en publier à sa place : il copie le commentaire et ouvre
  la page d'avis Google (champ `googleAvis`).
- **« Ma sélection » n'est pas une commande** : c'est une liste avec un total, à montrer au
  comptoir ou à envoyer. Rien n'arrive au restaurant tant que le WhatsApp n'est pas renseigné.
- **Textes des incontournables** : rédigés à partir des photos, à valider par le restaurant.

## Sauvegarde des avis (Supabase)

Les avis sont dans la table `avis` du projet Supabase « kaboul-paris-nord » (structure dans
`supabase/avis.sql`). Les visiteurs peuvent seulement lire les avis visibles et en ajouter.

Pour masquer un avis : dans Supabase, **Table Editor → avis**, décocher `visible` (ou supprimer la ligne).

## Rapidité

- `assets/img/plats/s/` contient une version allégée (480 px) de chaque photo, utilisée dans les cartes.
  La grande version sert pour l'accueil et la fiche du plat. **Quand on ajoute ou remplace une photo,
  il faut aussi créer sa petite version** (même nom, en `.webp`).
- Les polices sont dans `assets/polices/` (plus d'appel à Google Fonts).
- `sw.js` garde photos et polices dans le navigateur du visiteur : à la deuxième visite elles
  s'affichent tout de suite, puis sont rafraîchies en arrière-plan. Une photo remplacée apparaît donc
  à la visite suivante. Pages, scripts et styles sont toujours redemandés au serveur.

## Technique

HTML / CSS / JavaScript sans étape de build ni dépendance. Le site fournit aussi les
balises de partage (aperçu sur WhatsApp, Instagram…) et les données structurées
schema.org pour Google (restaurant + carte).

### Après une modification

Les navigateurs gardent le site en mémoire. Après avoir changé `js/data.js`, `js/app.js` ou
`css/style.css`, changer le numéro `?v=…` (le même partout) dans `index.html` et en haut de
`js/app.js`, sinon les visiteurs peuvent voir l'ancienne version.

## Droits

© SAS Amin Jan (Kaboul Paris Nord). Tous droits réservés — voir `LICENSE`.
Les mentions légales affichées sur le site viennent de `CONFIG.societe` dans `js/data.js`.
