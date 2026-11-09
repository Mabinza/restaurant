# Kaboul Paris Nord — site du restaurant

Site vitrine du restaurant : la carte avec les photos des plats, et une salle en 3D
où le client choisit sa table avant de réserver.

## Lancer le site en local

Le site est 100 % statique (aucune installation). Il faut juste un petit serveur web :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Où modifier quoi

| Quoi | Fichier |
| --- | --- |
| Adresse, horaires, téléphone, numéro WhatsApp, créneaux | `js/data.js` → `CONFIG` |
| Plats, prix, catégories | `js/data.js` → `MENU` |
| Plan de salle (tables, places, positions) | `js/data.js` → `SALLE` et `TABLES` |
| Photos des plats | `assets/img/plats/` |
| Couleurs, typographie | `css/style.css` (variables en haut du fichier) |
| Décor 3D de la salle | `js/salle.js` |

Les photos en `.webp` sont détourées (fond transparent) ; celles en `.jpg` viennent
du menu PDF et sont à remplacer par les photos en haute définition.

## État actuel — à savoir

- **Le plan de salle est un exemple.** Il sera remplacé par le vrai plan (scan Polycam).
- **Les tables « réservées » sont simulées** (`demoOccupation: true` dans `CONFIG`).
  Le site n'a pas encore de serveur : il ne connaît pas les vraies disponibilités.
- **La réservation n'est pas transmise au restaurant** tant que `CONFIG.whatsapp` est vide.
  Une fois le numéro renseigné, le client envoie sa demande pré-remplie par WhatsApp.

## Technique

HTML / CSS / JavaScript sans étape de build. La 3D utilise [Three.js](https://threejs.org)
(licence MIT), fourni dans `vendor/three/`.
