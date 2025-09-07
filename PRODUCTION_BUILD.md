# Configuration des environnements - PilotEco Frontend

## Fonctionnement

Cette application utilise des configurations différentes selon l'environnement :

### Développement local

- **URL Backend** : `https://localhost`
- **Fichier utilisé** : `.env`
- **Commande** : `npm start`

### Production (Azure Static Web App)

- **URL Backend** : `https://piloteco-back.azurewebsites.net`
- **Fichier utilisé** : `.env.production`
- **Déploiement** : Automatique via GitHub Actions

## Fichiers de configuration

### `.env` (développement)

```bash
VITE_APP_API_URL=https://localhost
```

### `.env.production` (production)

```bash
VITE_APP_API_URL=https://piloteco-back.azurewebsites.net
```

### `public/config.js`

Fichier de configuration runtime qui est mis à jour lors du build selon l'environnement.

## Commandes

### Développement local

```bash
npm start  # Utilise .env (localhost:80)
```

### Build de production

```bash
npm run build -- --mode production  # Utilise .env.production
```

### Build de développement

```bash
npm run build  # Utilise .env (localhost:80)
```

## Déploiement automatique

Le workflow GitHub Actions :

1. **Détecte un push** sur la branche `main`
2. **Installe les dépendances** avec `npm ci`
3. **Build en mode production** avec `npm run build -- --mode production`
4. **Déploie automatiquement** sur Azure Static Web App

### Workflow (.github/workflows/azure-static-web-apps-happy-bay-0b8e73d03.yml)

```yaml
- name: Build for production
  run: npm run build -- --mode production
```

## Variables d'environnement

| Variable             | Développement       | Production                                |
| -------------------- | ------------------- | ----------------------------------------- |
| `VITE_APP_API_URL`   | `https://localhost` | `https://piloteco-back.azurewebsites.net` |
| `VITE_APP_BASE_NAME` | `/`                 | `/`                                       |
| `VITE_APP_VERSION`   | `v9.2.0`            | `v9.2.0`                                  |

## Architecture

```
┌─────────────────┐    ┌──────────────────┐
│ Développement   │    │ Production       │
│ localhost:3000  │    │ Azure Static App │
│                 │    │                  │
│ ↓ API calls     │    │ ↓ API calls      │
│                 │    │                  │
│ localhost:80    │    │ piloteco-back    │
│ (Backend local) │    │ .azurewebsites   │
└─────────────────┘    └──────────────────┘
```
