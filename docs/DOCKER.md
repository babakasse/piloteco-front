# 🐳 PilotEco Frontend - Configuration Docker

## Démarrage rapide

### Prérequis

- Backend PHP PilotEco déjà en cours d'exécution sur port 80/443
- PostgreSQL sur port 32768

### Développement

```bash
# Avec Make (Recommandé)
make dev-start       # Démarrer en mode développement avec hot-reloading
make dev-logs        # Voir les logs
make dev-stop        # Arrêter

# Ou avec les scripts Docker
./docker-scripts.sh dev-start
./docker-scripts.sh dev-logs
./docker-scripts.sh dev-stop
```

### Production

```bash
# Avec Make (Recommandé)
make prod-start      # Démarrer en mode production
make health          # Vérifier la santé
make prod-stop       # Arrêter

# Ou avec les scripts Docker
./docker-scripts.sh prod-start
./docker-scripts.sh health
./docker-scripts.sh prod-stop
```

# Arrêter

./docker-scripts.sh prod-stop

````

## Variables d'environnement

Créez un fichier `.env` :

```bash
# Configuration API - Backend PHP existant
VITE_APP_API_URL=http://localhost
VITE_APP_BASE_NAME=""
VITE_APP_VERSION=v9.2.0

# Configuration Docker (production)
BACKEND_URL=http://host.docker.internal
````

## Accès

- **Développement** : http://localhost:3000
- **Production** : http://localhost:3000
- **Health Check** : http://localhost:3000/health
- **Backend PHP** : http://localhost (déjà en cours)

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
        │      Backend PHP (Existing)     │
        │         Port 80/443             │
        └─────────────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────┐
        │    PostgreSQL (Existing)        │
        │         Port 32768              │
        └─────────────────────────────────┘
```

## Commandes utiles

```bash
# Make (Recommandé)
make help            # Aide complète
make build           # Construire l'image
make clean           # Nettoyer Docker
make shell           # Shell dans le conteneur
make integration     # Test complet frontend-backend
make quick-start     # Configuration et démarrage automatique

# Scripts Docker (Alternative)
./docker-scripts.sh help
./docker-scripts.sh build
./docker-scripts.sh clean
./docker-scripts.sh shell
./docker-scripts.sh integration
```

### Workflows complets avec Make

```bash
# Démarrage rapide complet
make quick-start     # setup + backend check + dev-start

# Déploiement production
make deploy          # build + prod-start

# Redémarrage intelligent
make restart         # redémarre l'environnement actif
```

Consultez [docs/DOCKER_GUIDE.md](docs/DOCKER_GUIDE.md) pour plus de détails.
