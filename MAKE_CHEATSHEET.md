# 📋 Aide-mémoire Make - PilotEco Frontend

## 🚀 Commandes essentielles

```bash
# 🎯 Workflow quotidien (ultra-simple)
make up              # Vérifier backend + démarrer tout
make logs            # Voir les logs
make stop            # Arrêter

# Premier démarrage (avec build)
make quick-start     # Configuration complète + démarrage

# Développement quotidien (commandes détaillées si besoin)
make backend         # Vérifier le backend PHP
make start           # Démarrer le développement
make logs            # Voir les logs
make stop            # Arrêter

# Après modification du Dockerfile ou package.json
make build           # Reconstruire l'image
make start-build     # Démarrer avec build

# Production rapide
make prod-start         # Démarrer en production
make health             # Vérifier la santé
make prod-stop          # Arrêter

# Production avec build
make deploy             # Build + démarrage production

# Tests
make integration        # Test complet frontend-backend
make status             # État des conteneurs

# Maintenance
make clean              # Nettoyer Docker
make restart            # Redémarrer l'environnement actif

# Aide
make help               # Aide complète
```

## 🔧 Workflows courants

### Développement quotidien (ultra-simple)

```bash
make up              # Tout en une commande !
```

### Premier démarrage

```bash
make quick-start     # Configuration + démarrage complet
```

### Développement avec plus de contrôle

```bash
make backend && make start
```

### Premier démarrage ou après modification Docker

```bash
make up-build
# ou pour une configuration complète
make quick-start
```

### Après modification du code (pas de build nécessaire)

```bash
# Le conteneur se recharge automatiquement (hot-reload)
# Rien à faire ! 🎉
```

### Test avant commit

```bash
make integration && make npm-lint
```

### Déploiement production

```bash
make deploy
```

### Dépannage

```bash
make status
make logs
make clean && make start-build
```

## 💡 Tips

**Quand utiliser les commandes avec/sans build :**

- **Sans build** (`start`, `prod-start`) :

  - ✅ Développement quotidien
  - ✅ Redémarrage rapide
  - ✅ Après modification du code source

- **Avec build** (`start-build`, `prod-start-build`, `deploy`) :
  - ✅ Premier démarrage
  - ✅ Après modification du Dockerfile
  - ✅ Après modification du package.json
  - ✅ Après ajout de nouvelles dépendances

**Performance :**

- `make start` : ~2-3 secondes ⚡
- `make start-build` : ~30-60 secondes 🔄

## 📚 Documentation complète

- `make help` - Aide détaillée
- [docs/MAKE_GUIDE.md](docs/MAKE_GUIDE.md) - Guide complet
- [docs/DOCKER.md](docs/DOCKER.md) - Configuration Docker

## 🎯 URLs importantes

- **Frontend** : http://localhost:3000
- **Backend PHP** : http://localhost
- **Health Check** : http://localhost:3000/health
