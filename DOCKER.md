# 🐳 PilotEco Frontend - Configuration Docker

## Démarrage rapide

### Développement

```bash
# Démarrer en mode développement avec hot-reloading
./docker-scripts.sh dev-start

# Voir les logs
./docker-scripts.sh dev-logs

# Arrêter
./docker-scripts.sh dev-stop
```

### Production

```bash
# Démarrer en mode production
./docker-scripts.sh prod-start

# Vérifier la santé
./docker-scripts.sh health

# Arrêter
./docker-scripts.sh prod-stop
```

## Variables d'environnement

Créez un fichier `.env` :

```bash
# Configuration API
VITE_APP_API_URL=http://localhost:3010
VITE_APP_BASE_NAME=""
VITE_APP_VERSION=v9.2.0

# Configuration Docker (production)
BACKEND_URL=http://piloteco-backend:3010
```

## Accès

- **Développement** : http://localhost:3000
- **Production** : http://localhost:3000
- **Health Check** : http://localhost:3000/health

## Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │  Vite Dev Server│
│   (Production)  │    │  (Development)  │
│                 │    │                 │
│  Port 80 → 3000 │    │   Port 3000     │
└─────────────────┘    └─────────────────┘
         │                       │
         │                       │
    ┌─────────────────────────────────────┐
    │          React App                  │
    │     (Carbon Footprint Tool)         │
    └─────────────────────────────────────┘
                     │
                     │ API Calls
                     ▼
        ┌─────────────────────────────────┐
        │         Backend API             │
        │      (PilotEco Backend)         │
        └─────────────────────────────────┘
```

## Commandes utiles

```bash
# Aide complète
./docker-scripts.sh help

# Construire l'image
./docker-scripts.sh build

# Nettoyer Docker
./docker-scripts.sh clean

# Shell dans le conteneur
./docker-scripts.sh shell
```

Consultez [docs/DOCKER_GUIDE.md](docs/DOCKER_GUIDE.md) pour plus de détails.
