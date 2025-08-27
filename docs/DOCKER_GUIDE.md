# PilotEco Frontend - Guide Docker

## Vue d'ensemble

Ce guide explique comment dockeriser et déployer l'application PilotEco Frontend. L'application utilise une architecture multi-stage avec Nginx pour la production et un environnement de développement séparé.

**Important** : Ce frontend est conçu pour fonctionner avec le backend PHP PilotEco existant qui tourne sur les ports 80/443.

## Architecture Docker

### Structure des fichiers Docker

- `Dockerfile` - Build de production avec Nginx
- `Dockerfile.dev` - Environnement de développement
- `docker-compose.yml` - Orchestration pour la production
- `docker-compose.dev.yml` - Environnement de développement
- `nginx.conf` - Configuration Nginx optimisée
- `docker-entrypoint.sh` - Script d'injection des variables d'environnement

### Multi-stage Build

Le Dockerfile principal utilise un build en deux étapes :

1. **Builder stage** : Compilation de l'application React/Vite
2. **Production stage** : Serveur Nginx avec l'application compilée

### Intégration avec le backend PHP existant

Le frontend se connecte au backend PHP PilotEco qui tourne déjà dans des conteneurs :

- **Backend PHP** : `piloteco-back-php-1` sur port 80/443
- **Base PostgreSQL** : Port 32768 (mappé depuis 5432)

## Configuration des variables d'environnement

### Variables principales

```bash
# API Backend - Backend PHP existant
VITE_APP_API_URL=http://localhost

# Configuration de base
VITE_APP_BASE_NAME=""
VITE_APP_VERSION=v9.2.0

# URL backend pour le proxy Nginx (production)
BACKEND_URL=http://host.docker.internal
```

### Fichier .env

Créez un fichier `.env` basé sur `.env.dist` :

```bash
cp .env.dist .env
```

Exemple de configuration pour votre backend PHP :

```bash
# .env
VITE_APP_API_URL=http://localhost
VITE_APP_BASE_NAME=""
VITE_APP_VERSION=v9.2.0
BACKEND_URL=http://host.docker.internal
```

## Utilisation

### Développement

Pour démarrer l'environnement de développement avec hot-reloading :

```bash
# Construire et démarrer
docker-compose -f docker-compose.dev.yml up --build

# En arrière-plan
docker-compose -f docker-compose.dev.yml up -d --build

# Arrêter
docker-compose -f docker-compose.dev.yml down
```

L'application sera accessible sur `http://localhost:3000`

### Production

Pour démarrer l'environnement de production :

```bash
# Construire et démarrer
docker-compose up --build

# En arrière-plan
docker-compose up -d --build

# Arrêter
docker-compose down
```

L'application sera accessible sur `http://localhost:3000` (port mappé vers 80 dans le conteneur)

### Build manuel

Pour construire uniquement l'image :

```bash
# Image de production
docker build -t piloteco-frontend:latest .

# Image de développement
docker build -f Dockerfile.dev -t piloteco-frontend:dev .
```

## Configuration Nginx

### Fonctionnalités incluses

- **Gzip compression** pour optimiser les performances
- **Cache statique** pour les assets (JS, CSS, images)
- **Proxy API** vers le backend
- **Headers de sécurité**
- **Support SPA** avec fallback vers index.html
- **Health check** endpoint sur `/health`
- **CORS** configuré pour les appels API

### Proxy API

Les appels vers `/api/*` sont automatiquement proxifiés vers le backend configuré via `BACKEND_URL`.

## Sécurité

### Headers de sécurité inclus

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Health Check

Un endpoint de santé est disponible sur `/health` pour les orchestrateurs (Kubernetes, Docker Swarm).

## Optimisations

### Performance

- **Multi-stage build** réduit la taille de l'image finale
- **Compression Gzip** pour tous les assets textuels
- **Cache statique** avec expiration longue pour les assets versionnés
- **Alpine Linux** pour des images légères

### Monitoring

- Logs Nginx structurés
- Health check intégré
- Métriques prêtes pour Prometheus (via nginx-prometheus-exporter si ajouté)

## Intégration avec le Backend

### Configuration réseau

Le frontend utilise `host.docker.internal` pour se connecter au backend PHP qui tourne sur l'hôte. Cette configuration permet :

- **Développement** : Accès direct au backend PHP sur `http://localhost`
- **Production** : Proxy Nginx vers `http://host.docker.internal` pour les appels `/api/*`

### Architecture réseau

```
┌─────────────────────────────────────┐
│             Hôte Docker             │
│                                     │
│  ┌─────────────────┐                │
│  │ Backend PHP     │ Port 80/443    │
│  │ (Existing)      │                │
│  │                 │                │
│  └─────────────────┘                │
│           │                         │
│           │                         │
│  ┌─────────────────┐                │
│  │ PostgreSQL      │ Port 32768     │
│  │ (Existing)      │                │
│  └─────────────────┘                │
│                                     │
│  ┌─────────────────┐                │
│  │ Frontend        │ Port 3000      │
│  │ (Conteneur)     │                │
│  │                 │                │
│  └─────────────────┘                │
│           │                         │
│           │ host.docker.internal    │
│           └─────────────────────────┘
└─────────────────────────────────────┘
```

### Variables d'environnement

Les appels API utilisent `VITE_APP_API_URL` pour pointer vers le backend PHP. En production, le proxy Nginx route les appels `/api/*` vers le backend.

## Déploiement

### Avec Docker Compose

```bash
# Production
docker-compose up -d

# Mise à jour
docker-compose pull
docker-compose up -d --force-recreate
```

### Avec Kubernetes

Adaptez les fichiers Docker pour créer des manifests Kubernetes avec :

- Deployment
- Service
- Ingress
- ConfigMap pour les variables d'environnement

### Avec CI/CD

Exemple de pipeline :

```yaml
# .github/workflows/docker.yml
build:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - name: Build Docker image
      run: docker build -t piloteco-frontend:${{ github.sha }} .
    - name: Push to registry
      run: docker push piloteco-frontend:${{ github.sha }}
```

## Troubleshooting

### Problèmes courants

1. **Port déjà utilisé** : Changez le port dans docker-compose.yml
2. **Variables d'environnement** : Vérifiez le fichier .env
3. **Proxy API** : Vérifiez la configuration `BACKEND_URL`
4. **Hot reloading** : Utilisez `docker-compose.dev.yml` pour le développement

### Logs

```bash
# Logs du conteneur
docker-compose logs piloteco-frontend

# Logs Nginx
docker exec piloteco-frontend tail -f /var/log/nginx/access.log
docker exec piloteco-frontend tail -f /var/log/nginx/error.log
```

### Debug

```bash
# Shell dans le conteneur
docker exec -it piloteco-frontend sh

# Vérifier la configuration Nginx
docker exec piloteco-frontend nginx -t
```
