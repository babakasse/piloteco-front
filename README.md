# PilotEco Frontend

Application frontend pour l'évaluation de l'empreinte carbone basée sur React + TypeScript + Vite et Material-UI.

## 🏗️ Architecture

### Vue d'ensemble

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend PHP   │    │   PostgreSQL    │
│   React + Vite  │◄──►│   API REST      │◄──►│   Database      │
│   Port 3000     │    │   Port 80/443   │    │   Port 32768    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Stack technique

**Frontend (ce projet)**

- **Framework** : React 18 + TypeScript
- **Build** : Vite (développement rapide)
- **UI** : Material-UI v5 + thème Able Pro
- **State Management** : Context API (Auth, Langue, Config)
- **API** : Axios avec intercepteurs JWT
- **Charts** : Recharts pour visualisations CO₂
- **i18n** : Système français/anglais
- **Container** : Docker multi-stage (dev + prod)

**Backend (séparé)**

- **API** : PHP avec endpoints REST
- **Base de données** : PostgreSQL
- **Container** : Docker (piloteco-back-php-1)

### Domaine métier

- **Évaluations carbone** : Suivi des émissions par entreprise
- **Scopes d'émissions** : Scope 1 (direct), Scope 2 (électricité), Scope 3 (indirect)
- **Unités** : Toujours en `tCO₂e` (tonnes CO₂ équivalent)
- **Workflows** : Création → Ajout émissions → Visualisation → Comparaison historique

### Patterns de développement

- **Composants** : MainCard wrapper pour toutes les pages
- **API** : Pattern service avec gestion d'erreurs centralisée
- **Traductions** : `useLanguage()` hook avec clés `t('translation-key')`
- **Formulaires** : Validation Material-UI avec callbacks de succès
- **Routing** : Routes protégées avec authentification JWT

## 🐳 Docker (Nouveau)

### Démarrage rapide avec Docker

```bash
# Configuration initiale
make setup

# Démarrage en développement
make dev-start
# ou plus simplement :
make start

# Vérifier que tout fonctionne
make health

# Accéder à l'application
open http://localhost:3000
```

### Commandes Make disponibles

```bash
# 🎯 Commandes simplifiées (développement)
make start           # Démarrer en développement (alias dev-start)
make stop            # Arrêter le développement (alias dev-stop)
make logs            # Voir les logs (alias dev-logs)
make build           # Construire l'image de développement (alias dev-build)
make start-build     # Démarrer avec build (alias dev-start-build)

# 🚀 Workflows quotidiens
make dev             # Alias pour dev-start
make setup           # Configuration initiale du projet
make install         # Installer les dépendances npm

# 🔍 Tests et vérifications
make backend-check   # Vérifier le backend PHP
make health          # Vérifier le frontend
make integration     # Test complet frontend-backend

# 🏭 Production
make prod-start      # Démarrer en production
make prod-stop       # Arrêter la production
make prod-logs       # Voir les logs de production
make prod-build      # Construire l'image de production
make prod-start-build # Démarrer en production avec build

# 🛠️ Utilitaires
make shell           # Shell dans le conteneur
make clean           # Nettoyer Docker
make help            # Aide complète
```

Voir [docs/QUICK_START_DOCKER.md](docs/QUICK_START_DOCKER.md) pour plus de détails.

## 🛠️ Développement traditionnel

### Prérequis

- Node.js 18+
- npm ou yarn
- Backend PHP PilotEco en cours d'exécution

### Installation

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.dist .env

# Démarrer en mode développement
npm run dev
```

## 📚 Documentation

- **[Guide Docker](docs/DOCKER.md)** - Configuration Docker complète
- **[Guide Make](docs/MAKE_GUIDE.md)** - Toutes les commandes Make disponibles
- **[Démarrage rapide Docker](docs/QUICK_START_DOCKER.md)** - Guide en 5 minutes
- **[Intégration Backend](docs/BACKEND_INTEGRATION.md)** - Connexion avec le backend PHP
- **[Système de traduction](docs/TRANSLATION_SYSTEM.md)** - i18n français/anglais
- **[Guide traduction rapide](docs/QUICK_TRANSLATION_GUIDE.md)** - Ajout de nouvelles traductions

## 🔧 Scripts disponibles

```bash
# Make (Recommandé)
make start           # Développement Docker (alias dev-start)
make prod-start      # Production Docker
make integration     # Test complet
make help            # Aide complète Make

# Développement traditionnel
npm run dev          # Serveur de développement Vite
npm run build        # Build de production
npm run preview      # Aperçu du build de production

# Scripts Docker (Alternative)
./docker-scripts.sh dev-start    # Développement Docker
./docker-scripts.sh prod-start   # Production Docker
./docker-scripts.sh help         # Aide complète Docker
```

## 🌍 Fonctionnalités

- **Évaluation carbone** : Suivi des émissions Scope 1, 2 et 3
- **Multi-langue** : Support français/anglais
- **Authentification** : JWT avec stockage local
- **Tableaux de bord** : Visualisation des données d'émissions
- **Import en masse** : Import de données d'émissions
- **Templates sectoriels** : Assistants par secteur d'activité
