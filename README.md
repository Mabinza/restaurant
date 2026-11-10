# Kaboul Paris Nord — site du restaurant

Site vitrine du restaurant, pensé d'abord pour le téléphone :

- **Accueil** avec les plats qui défilent, le logo et le badge halal
- **Les incontournables** : trois plats présentés pour ceux qui découvrent la cuisine afghane
- **Les bons plans** : les formules de la carte mises en avant
- **La carte complète** : catégories, recherche, fiche de chaque plat
- **Ma sélection** : le client compose sa liste, voit le total et peut la partager
- **Avis** des clients et **infos pratiques** (adresse, horaires, téléphone, plan)

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

## État actuel — à savoir

- **Téléphone manquant** : la carte « Téléphone » affiche « Bientôt en ligne ».
- **Les avis ne sont pas encore partagés.** Le site n'a pas de serveur : un avis publié est
  gardé dans le navigateur du visiteur et n'est visible que sur son appareil
  (`avisLocaux: true` dans `CONFIG`). Pour des avis publics, il faut brancher une base en ligne.
- **« Ma sélection » n'est pas une commande** : c'est une liste avec un total, à montrer au
  comptoir ou à envoyer. Rien n'arrive au restaurant tant que le WhatsApp n'est pas renseigné.
- **Textes des incontournables** : rédigés à partir des photos, à valider par le restaurant.

## Technique

HTML / CSS / JavaScript sans étape de build ni dépendance. Le site fournit aussi les
balises de partage (aperçu sur WhatsApp, Instagram…) et les données structurées
schema.org pour Google (restaurant + carte).
