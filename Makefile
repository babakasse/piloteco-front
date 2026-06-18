# Executables
DOCKER_COMP_DEV  = docker compose -f docker-compose.dev.yml
DOCKER_COMP_PROD = docker compose -f docker-compose.yml

# Misc
.DEFAULT_GOAL = help
.PHONY: help setup install \
        dev-start dev-stop dev-logs dev-restart dev-build \
        prod-start prod-stop prod-logs prod-restart prod-build \
        start stop logs restart build start-build prod-start-build \
        up up-build quick-start deploy \
        health backend backend-check integration status \
        shell clean npm-lint npm-build npm-dev npm-lint-fix npm-prettier

## —— 🌿 PilotEco Frontend Makefile ——————————————————————————————————————————
help: ## Affiche cette aide
	@grep -E '(^[a-zA-Z0-9\._/-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-28s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

## —— ⚙️  Configuration ————————————————————————————————————————————————————————
setup: ## Configuration initiale (.env, permissions)
	@if [ ! -f .env ]; then cp .env.dist .env; echo "✅ .env créé depuis .env.dist"; else echo "ℹ️  .env existe déjà"; fi
	@chmod +x docker-scripts.sh docker-entrypoint.sh 2>/dev/null || true
	@echo "✅ Configuration terminée"

install: ## Installation des dépendances npm (sans Docker)
	npm install

## —— 🐳 Développement ————————————————————————————————————————————————————————
dev-start: ## Démarre l'environnement de développement
	@$(DOCKER_COMP_DEV) up -d
	@echo "✅ Frontend de développement démarré → http://localhost:3000"

dev-stop: ## Arrête l'environnement de développement
	@$(DOCKER_COMP_DEV) down

dev-logs: ## Affiche les logs de développement en temps réel
	@$(DOCKER_COMP_DEV) logs --tail=0 --follow

dev-restart: ## Redémarre l'environnement de développement
	@$(DOCKER_COMP_DEV) restart

dev-build: ## Construit l'image de développement
	@$(DOCKER_COMP_DEV) build --pull

## —— 🚀 Production ———————————————————————————————————————————————————————————
prod-start: ## Démarre l'environnement de production
	@$(DOCKER_COMP_PROD) up -d
	@echo "✅ Frontend de production démarré → http://localhost:3000"

prod-stop: ## Arrête l'environnement de production
	@$(DOCKER_COMP_PROD) down

prod-logs: ## Affiche les logs de production en temps réel
	@$(DOCKER_COMP_PROD) logs --tail=0 --follow

prod-restart: ## Redémarre l'environnement de production
	@$(DOCKER_COMP_PROD) restart

prod-build: ## Construit l'image de production
	@$(DOCKER_COMP_PROD) build --pull

## —— 🎯 Alias pratiques ——————————————————————————————————————————————————————
start: dev-start ## Alias → dev-start

stop: dev-stop ## Alias → dev-stop

logs: dev-logs ## Alias → dev-logs

restart: ## Redémarre l'environnement actif (dev ou prod)
	@$(DOCKER_COMP_DEV) restart 2>/dev/null || $(DOCKER_COMP_PROD) restart

build: dev-build ## Alias → dev-build

start-build: ## Démarre le développement avec build préalable
	@$(DOCKER_COMP_DEV) up --build -d
	@echo "✅ Frontend de développement démarré (avec build) → http://localhost:3000"

prod-start-build: ## Démarre la production avec build préalable
	@$(DOCKER_COMP_PROD) up --build -d
	@echo "✅ Frontend de production démarré (avec build) → http://localhost:3000"

## —— ⚡ Workflows rapides ——————————————————————————————————————————————————————
up: ## Vérifie le backend + démarre le développement
	@echo "🔍 Vérification du backend..."
	@docker ps --filter "name=piloteco-back" --format "{{.Names}}: {{.Status}}" 2>/dev/null || true
	@$(DOCKER_COMP_DEV) up -d
	@echo "✅ Frontend démarré → http://localhost:3000"

up-build: ## Vérifie le backend + démarre avec build
	@echo "🔍 Vérification du backend..."
	@docker ps --filter "name=piloteco-back" --format "{{.Names}}: {{.Status}}" 2>/dev/null || true
	@$(DOCKER_COMP_DEV) up --build -d
	@echo "✅ Frontend démarré (avec build) → http://localhost:3000"

quick-start: ## Configuration complète + démarrage (premier lancement)
	@$(MAKE) setup
	@$(MAKE) up-build
	@echo "🎉 PilotEco Frontend prêt → http://localhost:3000"

deploy: ## Build + démarrage en production
	@$(MAKE) prod-build
	@$(MAKE) prod-start
	@$(MAKE) health

## —— 🔍 Tests & Vérifications ————————————————————————————————————————————————
health: ## Vérifie la santé du frontend
	@echo "🔍 Vérification de la santé du frontend..."
	@if docker ps | grep -q "piloteco-frontend"; then \
		echo "✅ Conteneur frontend en cours d'exécution"; \
		if curl -sf http://localhost:3000/health > /dev/null 2>&1; then \
			echo "✅ Frontend répond correctement sur http://localhost:3000"; \
		else \
			echo "⚠️  Frontend en cours de démarrage (pas encore disponible)"; \
		fi; \
	else \
		echo "❌ Aucun conteneur frontend trouvé"; \
	fi

backend: ## Vérifie l'état du backend PHP
	@echo "🔍 Vérification du backend PHP..."
	@if docker ps | grep -q "piloteco-back"; then \
		echo "✅ Backend PHP en cours d'exécution"; \
		docker ps --filter "name=piloteco-back" --format "  {{.Names}}: {{.Status}}"; \
		if curl -sf http://localhost > /dev/null 2>&1; then \
			echo "✅ Backend répond sur http://localhost"; \
		else \
			echo "❌ Backend ne répond pas sur le port 80"; \
		fi; \
	else \
		echo "❌ Backend PHP non trouvé – démarrez le backend d'abord"; \
	fi

backend-check: backend ## Alias → backend

integration: ## Test complet d'intégration frontend + backend
	@$(MAKE) backend
	@echo ""
	@$(MAKE) health
	@echo ""
	@echo "🔗 Test de connectivité croisée..."
	@if curl -sf http://localhost > /dev/null 2>&1; then \
		echo "✅ Connectivité frontend → backend OK"; \
	else \
		echo "❌ Problème de connectivité frontend → backend"; \
	fi
	@echo ""
	@echo "🌐 Réseaux Docker actifs:"
	@docker network ls | grep piloteco || echo "  Aucun réseau piloteco trouvé"

status: ## Affiche l'état de tous les conteneurs piloteco
	@echo "📊 État des conteneurs PilotEco:"
	@docker ps --filter "name=piloteco" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "Aucun conteneur trouvé"

## —— 🛠️  Utilitaires ——————————————————————————————————————————————————————————
shell: ## Ouvre un shell dans le conteneur actif
	@if docker ps --format "{{.Names}}" | grep -q "piloteco-frontend-dev"; then \
		docker exec -it piloteco-frontend-dev sh; \
	elif docker ps --format "{{.Names}}" | grep -q "piloteco-frontend"; then \
		docker exec -it piloteco-frontend sh; \
	else \
		echo "❌ Aucun conteneur frontend en cours d'exécution"; \
	fi

clean: ## Nettoie les ressources Docker (conteneurs + images)
	@echo "🧹 Nettoyage des ressources Docker..."
	@$(DOCKER_COMP_DEV) down --remove-orphans 2>/dev/null || true
	@$(DOCKER_COMP_PROD) down --remove-orphans 2>/dev/null || true
	@docker rmi piloteco-frontend:latest piloteco-frontend:dev 2>/dev/null || true
	@docker system prune -f
	@echo "✅ Nettoyage terminé"

## —— 📦 npm (sans Docker) ————————————————————————————————————————————————————
npm-dev: ## Lance le serveur de développement Vite (sans Docker)
	npm run start

npm-build: ## Build de production Vite (sans Docker)
	npm run build

npm-lint: ## Lint du code source
	npm run lint

npm-lint-fix: ## Lint avec correction automatique
	npm run lint:fix

npm-prettier: ## Formate le code avec Prettier
	npm run prettier
