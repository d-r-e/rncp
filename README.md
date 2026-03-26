# RNCP Planner for 42 School

![alt text](image.png)

## How to build

### Development

1. Edit `flask/.env` and set `CLIENT_ID`, `CLIENT_SECRET`, `SECOND_CLIENT_SECRET`, and `REDIRECT_URI`
2. Execute:

```bash
docker compose run angular npm install
docker compose up -d
```

### Production

0. Edit `flask/.env`
1. Build Angular production image/assets:
```bash
docker compose run angular sh -c "rm -rf node_modules && npm install && ng build"
```

2. Start production services:
```bash
docker compose up -d nginx flask
```

## Modifications réalisées (depuis la version de base)

### 1) Correction OAuth callback (route Angular)
- Ajout de la route `auth/callback/:campusId` en plus de `auth/callback`.
- Fichier modifié: `angular/src/app/app.routes.ts`.
- Impact: l'URL de callback `.../auth/callback/42` est maintenant correctement gérée côté front.

### 2) Correction du composant login
- Remplacement de l'import `environment.development` par `environment`.
- Suppression de la navigation prématurée vers `/rncp` juste après réception du `code` OAuth.
- Fichier modifié: `angular/src/app/login/login.component.ts`.
- Impact: cohérence dev/prod et évite une navigation prématurée pendant l'authentification.

### 3) Alignement des environnements Angular (dev/prod)
- `environment.ts` et `environment.development.ts` contiennent maintenant:
    - `production` explicite,
    - `auth_url` complet,
    - `redirect_uri` calculé dynamiquement via `window.location.origin`.
- Fichiers modifiés:
    - `angular/src/environments/environment.ts`
    - `angular/src/environments/environment.development.ts`
- Impact: plus besoin de modifier manuellement le redirect URI selon l'environnement.

### 4) Correction chargement des blocs JSON (cause du rendu non fonctionnel)
- Le chargement des assets passe par un chemin absolu `/assets/...`.
- Ajout d'une gestion d'erreur pour vider proprement `blocks` si le JSON échoue.
- Fichier modifié: `angular/src/app/path/path.component.ts`.
- Impact: les blocs de projets (famine, pestilence, snow-crash, etc.) se chargent correctement.

### 5) Alignement Nginx sur un rendu production
- Activation du mode serveur statique Angular (`root /usr/share/nginx/html` + `try_files`).
- Ajout de `include /etc/nginx/mime.types;`.
- Fichier modifié: `nginx.conf`.
- Impact: rendu local plus proche du site en production (build statique servi par Nginx).

### 6) Port local unifié avec le callback OAuth
- Mapping du port Nginx changé de `80:80` à `3000:80`.
- Fichier modifié: `docker-compose.yml`.
- Impact: cohérence avec le callback `http://localhost:3000/auth/callback/42`.

## Résultat
- Le parcours d'authentification fonctionne en local.
- Les données de blocs/projets se chargent correctement.
- Le rendu local est maintenant aligné sur le comportement attendu proche de la prod.

## Suite des modifications (ordre des projets Security)

### 7) Réorganisation de `blocks.security` dans `7-sec.json`
- Réorganisation manuelle de la liste des projets dans `angular/src/assets/7-sec.json` (section `blocks.security`) pour respecter l'ordre souhaité des projets de l'outer core.
- Les projets déjà présents ont conservé leurs informations existantes (`id`, `name`, `xp`) puis ont été replacés dans le nouvel ordre.
- Les nouveaux projets ajoutés dans la liste ont été intégrés avec des `id` temporaires, puis les `xp` ont été renseignés.

### 8) Projets retirés de la liste Security
- Les projets suivants ne sont plus affichés dans la liste `blocks.security`:
    - `Active Connect`
    - `MicroForensX`
    - `ActiveTechTales`
- Raison: ces projets ont tout simplement disparu de l'Outer Core.

### 9) Point d'attention cache navigateur
- Après modification des assets JSON, l'ancien ordre peut rester visible à cause du cache navigateur.
- En cas de décalage entre le fichier et l'affichage: forcer un rechargement (`Ctrl+Shift+R`) ou ouvrir en navigation privée.