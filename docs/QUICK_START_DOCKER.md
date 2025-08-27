# 🚀 Démarrage rapide - PilotEco Frontend Docker

## Prérequis

1. **Backend PHP en cours d'exécution** ✅

   ```bash
   docker ps | grep piloteco-back-php
   # Doit afficher : piloteco-back-php-1 ... Up ... 0.0.0.0:80->80/tcp
   ```

2. **PostgreSQL en cours d'exécution** ✅
   ```bash
   docker ps | grep postgres
   # Doit afficher : postgres:16-alpine ... Up ... 0.0.0.0:32768->5432/tcp
   ```

## Installation

```bash
# 1. Cloner le projet (si pas déjà fait)
cd /path/to/piloteco-front

# 2. Configuration automatique avec Make
make setup

# 3. Vérifier que le backend répond
make backend
# Doit afficher : ✅ Backend PHP en cours d'exécution
```

## Démarrage

### 🚀 Démarrage ultra-rapide (Make)

```bash
make quick-start
```

✅ Configuration automatique + vérification backend + démarrage dev

### Mode développement

```bash
# Avec Make (Recommandé)
make dev-start

# Ou avec les scripts Docker
./docker-scripts.sh dev-start
```

✅ Application disponible sur : http://localhost:3000
✅ Hot-reloading activé
✅ Code source monté en volume

### Mode production

```bash
# Avec Make (Recommandé)
make prod-start

# Ou avec les scripts Docker
./docker-scripts.sh prod-start
```

✅ Application optimisée sur : http://localhost:3000
✅ Nginx avec compression et cache
✅ Proxy API vers le backend PHP

## Vérification

```bash
# Avec Make (Recommandé)
make integration     # Vérifier l'état complet
make health          # Vérifier seulement le frontend
make backend         # Vérifier seulement le backend
make status          # Afficher l'état des conteneurs

# Ou avec les scripts Docker
./docker-scripts.sh integration
./docker-scripts.sh health
./docker-scripts.sh backend
```

## Tests rapides

```bash
# Frontend
curl http://localhost:3000/health
# Doit retourner : healthy

# Backend via frontend (production)
curl http://localhost:3000/api/
# Doit retourner la réponse du backend PHP

# Backend direct
curl http://localhost/
# Doit retourner la réponse du backend PHP
```

## Dépannage

### Le frontend ne démarre pas

```bash
# Vérifier les logs
./docker-scripts.sh dev-logs
# ou
./docker-scripts.sh prod-logs
```

### Problème de connectivité avec le backend

```bash
# Vérifier que le backend répond
curl -I http://localhost

# Vérifier la configuration réseau
docker network ls | grep piloteco
```

### Réinitialisation complète

```bash
# Arrêter le frontend
./docker-scripts.sh dev-stop
./docker-scripts.sh prod-stop

# Nettoyer
./docker-scripts.sh clean

# Redémarrer
./docker-scripts.sh dev-start
```

## Liens utiles

- **Frontend Dev** : http://localhost:3000
- **Frontend Prod** : http://localhost:3000
- **Backend PHP** : http://localhost
- **Docs** : [docs/DOCKER.md](docs/DOCKER.md)
- **Intégration** : [docs/BACKEND_INTEGRATION.md](docs/BACKEND_INTEGRATION.md)

## Support

```bash
# Aide complète
./docker-scripts.sh help

# Shell dans le conteneur
./docker-scripts.sh shell
```
