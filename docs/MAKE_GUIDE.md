# 🛠️ Guide des commandes Make - PilotEco Frontend

## Vue d'ensemble

Le Makefile fournit une interface simplifiée pour toutes les opérations Docker et de développement de PilotEco Frontend.

## 🚀 Commandes de base

### Configuration initiale

```bash
make setup           # Configuration automatique (.env, permissions)
make install         # Installation des dépendances npm
```

### Développement

```bash
make dev-start       # Démarre l'environnement de développement
make dev-stop        # Arrête l'environnement de développement
make dev-logs        # Affiche les logs en temps réel
make dev-restart     # Redémarre l'environnement de développement
```

### Production

```bash
make prod-start      # Démarre l'environnement de production
make prod-stop       # Arrête l'environnement de production
make prod-logs       # Affiche les logs de production
make prod-restart    # Redémarre l'environnement de production
```

## 🔍 Tests et vérifications

### Santé du système

```bash
make health          # Vérifie la santé du frontend
make backend-check   # Vérifie l'état du backend PHP
make integration     # Test complet frontend-backend
```

### Tests rapides

```bash
make dev             # Alias pour dev-start
make start           # Alias pour dev-start
make stop            # Alias pour dev-stop
make logs            # Alias pour dev-logs
```

## 🔨 Build et maintenance

### Construction

```bash
make build           # Construit l'image de développement (alias dev-build)
make prod-build      # Construit l'image de production
make dev-build       # Construit l'image de développement
make start-build     # Démarrer développement avec build (alias dev-start-build)
make prod-start-build # Démarrer production avec build
```

### Nettoyage

```bash
make clean           # Nettoie les ressources Docker
```

## 🛠️ Développement npm traditionnel

```bash
# Utiliser npm directement (sans Docker)
npm run dev          # Serveur de développement Vite
npm run build        # Build de production
npm run preview      # Aperçu du build
```

## 🔧 Utilitaires

### Debug et exploration

```bash
make shell           # Ouvre un shell dans le conteneur actif
```

### Documentation

```bash
make help            # Affiche l'aide complète
```

## 🌊 Workflows recommandés

### Premier démarrage

```bash
# Configuration et démarrage
make setup
make dev-start
```

### Développement quotidien

```bash
# Vérifier le backend
make backend-check

# Démarrer le développement
make dev-start
# ou plus simplement :
make start

# Voir les logs si nécessaire
make dev-logs
# ou plus simplement :
make logs

# Arrêter en fin de journée
make dev-stop
# ou plus simplement :
make stop
```

### Déploiement production

```bash
# Construire et démarrer
make prod-build
make prod-start

# Vérifier la santé
make health

# Tester l'intégration
make integration
```

### Dépannage

```bash
# Nettoyer et redémarrer
make clean
make dev-start

# Vérifier les logs
make logs

# Shell pour debug
make shell
```

## 🎯 Exemples d'usage

### Scénario 1 : Premier démarrage du projet

```bash
git clone <repo>
cd piloteco-front
make setup            # Configuration initiale
make dev-start        # Démarrage du développement
```

### Scénario 2 : Développement avec backend existant

```bash
make backend-check    # Vérifie que le backend PHP fonctionne
make dev-start        # Démarre le frontend
# Développement...
make dev-stop         # Arrête quand terminé
```

### Scénario 3 : Test complet avant commit

```bash
make integration      # Teste frontend + backend
make prod-build       # Teste le build de production
```

### Scénario 4 : Déploiement production

```bash
make prod-build       # Build de production
make prod-start       # Démarrage production
make health           # Vérification santé
make integration      # Test complet
```

### Scénario 5 : Dépannage

```bash
# État et debug
make health           # État du frontend
make logs             # Logs détaillés
make shell            # Investigation manuelle
make clean            # Nettoyage si problème
make dev-start        # Redémarrage propre
```

## 🔄 Aliases et raccourcis

- `make dev` = `make dev-start`
- `make start` = `make dev-start`
- `make stop` = `make dev-stop`
- `make logs` = `make dev-logs`
- `make build` = `make dev-build`
- `make start-build` = `make dev-start-build`

## 📊 Comparaison Make vs Scripts

| Tâche               | Make               | Scripts Docker                  |
| ------------------- | ------------------ | ------------------------------- |
| **Simplicité**      | `make dev-start`   | `./docker-scripts.sh dev-start` |
| **Aide**            | `make help`        | `./docker-scripts.sh help`      |
| **Workflows**       | `make quick-start` | Plusieurs commandes             |
| **Build**           | `make build`       | `./docker-scripts.sh build`     |
| **Flexibilité**     | ✅ Très haute      | ✅ Haute                        |
| **Couleurs**        | ✅                 | ✅                              |
| **Auto-complétion** | ✅ (bash/zsh)      | ❌                              |

## 💡 Tips et astuces

### Auto-complétion

```bash
# Activer l'auto-complétion Make (bash)
echo "complete -W \"\$(make -qp | awk -F':' '/^[a-zA-Z0-9][^$#\/\t=]*:([^=]|$)/ {split(\$1,A,/ /);for(i in A)print A[i]}')\" make" >> ~/.bashrc

# Pour zsh
echo "compctl -k \"\$(make -qp | awk -F':' '/^[a-zA-Z0-9][^$#\/\t=]*:([^=]|$)/ {split(\$1,A,/ /);for(i in A)print A[i]}')\" make" >> ~/.zshrc
```

### Variables d'environnement

```bash
# Surcharger des variables
VITE_APP_API_URL=http://custom-backend make dev-start

# Utiliser un fichier .env spécifique
cp .env.prod .env && make prod-start
```

### Développement hybride

```bash
# Frontend Docker + Backend local
make dev-start

# Frontend local + Backend Docker
make npm-dev
```
