# Intégration Frontend-Backend PilotEco

## Vue d'ensemble

Cette documentation explique l'intégration entre le frontend React/TypeScript dockerisé et le backend PHP existant.

## Architecture actuelle

### Backend PHP (Existant)

- **Container** : `piloteco-back-php-1`
- **Image** : `app-php`
- **Ports** : 80, 443 (HTTP/HTTPS)
- **Status** : Healthy
- **Base de données** : PostgreSQL sur port 32768

### Frontend React (Nouveau)

- **Container** : `piloteco-frontend`
- **Port** : 3000
- **Technologie** : React + TypeScript + Vite + Material-UI

## Configuration réseau

### Développement

```bash
Frontend (port 3000) → Backend PHP (port 80)
```

### Production

```bash
Frontend (Nginx proxy) → Backend PHP (host.docker.internal:80)
```

## Variables d'environnement

### Frontend (.env)

```bash
# API Backend PHP
VITE_APP_API_URL=http://localhost

# Version
VITE_APP_VERSION=v9.2.0

# Configuration Docker
BACKEND_URL=http://host.docker.internal
```

### Vérification de la connectivité

```bash
# Tester la connexion au backend depuis le frontend
curl http://localhost/api/health

# Vérifier les conteneurs
docker ps --filter "name=piloteco"
```

## Endpoints API

### Backend PHP

- **Base URL** : `http://localhost`
- **API Routes** : `/api/*`
- **Health Check** : `/api/health` (à implémenter si nécessaire)

### Configuration Axios (Frontend)

Le frontend utilise déjà une configuration axios dans `src/utils/axios.ts` :

```typescript
// Configuration existante adaptée pour le backend PHP
const axiosServices = axios.create({
  baseURL: window.ENV?.VITE_APP_API_URL || 'http://localhost'
});
```

## Déploiement coordonné

### 1. Backend déjà en cours

```bash
# Vérifier que le backend PHP fonctionne
curl -I http://localhost
```

### 2. Démarrer le frontend

```bash
# Mode développement
./docker-scripts.sh dev-start

# Mode production
./docker-scripts.sh prod-start
```

### 3. Vérification complète

```bash
# Frontend
curl http://localhost:3000/health

# Backend via frontend proxy (production)
curl http://localhost:3000/api/

# Backend direct
curl http://localhost/
```

## Authentification

### Contexte JWT existant

Le frontend utilise `JWTContext` avec stockage dans `localStorage` :

```typescript
// Token stocké comme 'serviceToken'
// Headers Authorization: Bearer <token>
```

### Intégration avec le backend PHP

Assurez-vous que le backend PHP :

- Accepte les tokens JWT dans les headers `Authorization: Bearer`
- Retourne des codes de statut HTTP appropriés (401 pour non-autorisé)

## CORS Configuration

### Backend PHP

Le backend doit autoriser les requêtes depuis :

- `http://localhost:3000` (développement)
- Domaine de production

### Frontend Nginx (Production)

Le proxy Nginx gère les headers CORS automatiquement.

## Surveillance et logs

### Logs Frontend

```bash
# Développement
./docker-scripts.sh dev-logs

# Production
./docker-scripts.sh prod-logs
```

### Logs Backend

```bash
# Backend PHP
docker logs piloteco-back-php-1

# Base PostgreSQL
docker logs <postgres-container-id>
```

## Dépannage

### Problèmes de connectivité

1. **Frontend ne peut pas joindre le backend**

   ```bash
   # Vérifier que le backend est accessible
   curl http://localhost

   # Vérifier la configuration réseau
   docker network ls
   ```

2. **Erreurs CORS**

   - Vérifier la configuration CORS du backend PHP
   - S'assurer que les domaines sont autorisés

3. **Problèmes d'authentification**
   - Vérifier le format des tokens JWT
   - Contrôler les headers Authorization

### Health Checks

```bash
# Frontend
curl http://localhost:3000/health

# Backend (à adapter selon l'API PHP)
curl http://localhost/api/status
```

## Migration progressive

Si vous voulez migrer de l'ancien setup vers Docker :

1. **Phase 1** : Frontend dockerisé → Backend PHP existant ✅
2. **Phase 2** : Optimisation réseau et performance
3. **Phase 3** : Surveillance et monitoring
4. **Phase 4** : Déploiement en production

## Scripts utiles

```bash
# Vérifier l'état de tous les services
docker ps --filter "name=piloteco"

# Redémarrer le frontend sans affecter le backend
./docker-scripts.sh prod-stop
./docker-scripts.sh prod-start

# Test complet de l'intégration
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/assessments
```
