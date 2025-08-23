#!/bin/bash

# PilotEco Frontend - Scripts Docker utilitaires

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'aide
show_help() {
    echo -e "${BLUE}PilotEco Frontend - Docker Management${NC}"
    echo -e "${YELLOW}Compatible avec le backend PHP existant sur port 80/443${NC}"
    echo ""
    echo -e "${GREEN}Usage:${NC} ./docker-scripts.sh [COMMAND]"
    echo ""
    echo -e "${YELLOW}Commands:${NC}"
    echo "  dev-start     Démarrer l'environnement de développement"
    echo "  dev-stop      Arrêter l'environnement de développement"
    echo "  dev-logs      Voir les logs de développement"
    echo "  prod-start    Démarrer l'environnement de production"
    echo "  prod-stop     Arrêter l'environnement de production"
    echo "  prod-logs     Voir les logs de production"
    echo "  build         Construire l'image de production"
    echo "  clean         Nettoyer les images et conteneurs"
    echo "  health        Vérifier la santé de l'application"
    echo "  backend       Vérifier l'état du backend PHP"
    echo "  integration   Tester l'intégration frontend-backend"
    echo "  shell         Ouvrir un shell dans le conteneur"
    echo "  help          Afficher cette aide"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./docker-scripts.sh dev-start      # Démarre en mode développement"
    echo "  ./docker-scripts.sh prod-start     # Démarre en mode production"
    echo "  ./docker-scripts.sh backend        # Vérifie le backend PHP"
    echo "  ./docker-scripts.sh integration    # Test complet frontend-backend"
}

# Vérifier que Docker est installé
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Erreur: Docker n'est pas installé${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}Erreur: Docker Compose n'est pas installé${NC}"
        exit 1
    fi
}

# Développement
dev_start() {
    echo -e "${GREEN}Démarrage de l'environnement de développement...${NC}"
    docker-compose -f docker-compose.dev.yml up --build -d
    echo -e "${GREEN}✅ Environnement de développement démarré${NC}"
    echo -e "${BLUE}Application disponible sur: http://localhost:3000${NC}"
}

dev_stop() {
    echo -e "${YELLOW}Arrêt de l'environnement de développement...${NC}"
    docker-compose -f docker-compose.dev.yml down
    echo -e "${GREEN}✅ Environnement de développement arrêté${NC}"
}

dev_logs() {
    echo -e "${BLUE}Logs de l'environnement de développement:${NC}"
    docker-compose -f docker-compose.dev.yml logs -f piloteco-frontend-dev
}

# Production
prod_start() {
    echo -e "${GREEN}Démarrage de l'environnement de production...${NC}"
    docker-compose up --build -d
    echo -e "${GREEN}✅ Environnement de production démarré${NC}"
    echo -e "${BLUE}Application disponible sur: http://localhost:3000${NC}"
}

prod_stop() {
    echo -e "${YELLOW}Arrêt de l'environnement de production...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Environnement de production arrêté${NC}"
}

prod_logs() {
    echo -e "${BLUE}Logs de l'environnement de production:${NC}"
    docker-compose logs -f piloteco-frontend
}

# Build
build_image() {
    echo -e "${GREEN}Construction de l'image de production...${NC}"
    docker build -t piloteco-frontend:latest .
    echo -e "${GREEN}✅ Image construite avec succès${NC}"
}

# Nettoyage
clean_docker() {
    echo -e "${YELLOW}Nettoyage des ressources Docker...${NC}"
    
    # Arrêter tous les conteneurs
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    docker-compose down 2>/dev/null || true
    
    # Supprimer les images
    docker rmi piloteco-frontend:latest 2>/dev/null || true
    docker rmi piloteco-frontend:dev 2>/dev/null || true
    
    # Nettoyer les ressources inutilisées
    docker system prune -f
    
    echo -e "${GREEN}✅ Nettoyage terminé${NC}"
}

# Health check
check_health() {
    echo -e "${BLUE}Vérification de la santé de l'application...${NC}"
    
    # Vérifier si le conteneur est en cours d'exécution
    if docker ps | grep -q "piloteco-frontend"; then
        echo -e "${GREEN}✅ Conteneur frontend en cours d'exécution${NC}"
        
        # Tester l'endpoint de santé
        if curl -f http://localhost:3000/health &>/dev/null; then
            echo -e "${GREEN}✅ Frontend répond correctement${NC}"
        else
            echo -e "${RED}❌ Frontend ne répond pas${NC}"
        fi
    else
        echo -e "${RED}❌ Conteneur frontend non trouvé${NC}"
    fi
}

# Vérifier le backend PHP
check_backend() {
    echo -e "${BLUE}Vérification du backend PHP...${NC}"
    
    # Vérifier si le conteneur backend est en cours d'exécution
    if docker ps | grep -q "piloteco-back-php"; then
        echo -e "${GREEN}✅ Backend PHP en cours d'exécution${NC}"
        
        # Tester la connectivité
        if curl -f -s http://localhost &>/dev/null; then
            echo -e "${GREEN}✅ Backend répond sur port 80${NC}"
        else
            echo -e "${RED}❌ Backend ne répond pas sur port 80${NC}"
        fi
        
        # Afficher les informations du conteneur
        echo -e "${BLUE}Informations du conteneur backend:${NC}"
        docker ps --filter "name=piloteco-back-php" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    else
        echo -e "${RED}❌ Backend PHP non trouvé${NC}"
        echo -e "${YELLOW}💡 Assurez-vous que le backend PHP est démarré${NC}"
    fi
}

# Test d'intégration
test_integration() {
    echo -e "${BLUE}Test d'intégration frontend-backend...${NC}"
    
    # Vérifier les deux services
    check_backend
    echo ""
    check_health
    echo ""
    
    # Test de connectivité croisée
    echo -e "${BLUE}Test de connectivité:${NC}"
    
    # Frontend → Backend direct
    if curl -f -s http://localhost &>/dev/null; then
        echo -e "${GREEN}✅ Frontend peut accéder au backend directement${NC}"
    else
        echo -e "${RED}❌ Problème de connectivité frontend → backend${NC}"
    fi
    
    # Afficher les réseaux Docker
    echo -e "${BLUE}Réseaux Docker actifs:${NC}"
    docker network ls | grep piloteco || echo "Aucun réseau piloteco trouvé"
}

# Shell
open_shell() {
    echo -e "${BLUE}Ouverture du shell dans le conteneur...${NC}"
    if docker ps | grep -q "piloteco-frontend"; then
        docker exec -it piloteco-frontend sh
    elif docker ps | grep -q "piloteco-frontend-dev"; then
        docker exec -it piloteco-frontend-dev sh
    else
        echo -e "${RED}❌ Aucun conteneur en cours d'exécution${NC}"
    fi
}

# Main
main() {
    check_docker
    
    case "$1" in
        "dev-start")
            dev_start
            ;;
        "dev-stop")
            dev_stop
            ;;
        "dev-logs")
            dev_logs
            ;;
        "prod-start")
            prod_start
            ;;
        "prod-stop")
            prod_stop
            ;;
        "prod-logs")
            prod_logs
            ;;
        "build")
            build_image
            ;;
        "clean")
            clean_docker
            ;;
        "health")
            check_health
            ;;
        "backend")
            check_backend
            ;;
        "integration")
            test_integration
            ;;
        "shell")
            open_shell
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        "")
            show_help
            ;;
        *)
            echo -e "${RED}Commande inconnue: $1${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

main "$@"
