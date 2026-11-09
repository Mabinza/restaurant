# Kaboul Paris Nord — site du restaurant

Site vitrine du restaurant : la carte avec les photos des plats, les avis des clients
et les infos pratiques. Responsive (téléphone, tablette, ordinateur).

## Lancer le site en local

Le site est 100 % statique (aucune installation). Il faut juste un petit serveur web :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Où modifier quoi

| Quoi | Fichier |
| --- | --- |
| Adresse, horaires, téléphone | `js/data.js` → `CONFIG` |
| Plats, prix, catégories | `js/data.js` → `MENU` |
| Photos des plats | `assets/img/plats/` |
| Couleurs, typographie | `css/style.css` (variables en haut du fichier) |

Les photos en `.webp` sont détourées (fond transparent) ; celles en `.jpg` viennent
du menu PDF et sont à remplacer par les photos en haute définition.

## État actuel — à savoir

- **Les avis ne sont pas encore partagés.** Le site n'a pas de serveur : un avis publié est
  gardé dans le navigateur du visiteur et n'est visible que sur son appareil
  (`avisLocaux: true` dans `CONFIG`). Pour des avis publics, il faut brancher une base en ligne.
- L'adresse, les horaires et le téléphone sont vides : la section « Infos » affiche
  « Bientôt en ligne » en attendant.

## Technique

HTML / CSS / JavaScript sans étape de build ni dépendance.
