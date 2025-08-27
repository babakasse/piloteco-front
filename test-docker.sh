#!/bin/bash

# Script de test automatisé pour PilotEco Frontend Docker
# Usage: ./test-docker.sh

set -e

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 Tests automatisés PilotEco Frontend Docker${NC}"
echo "======================================================="

# Test 1: Validation .env
echo -e "\n${YELLOW}Test 1: Validation du fichier .env${NC}"
make validate-env

# Test 2: Backend
echo -e "\n${YELLOW}Test 2: Vérification du backend PHP${NC}"
make backend

# Test 3: Frontend
echo -e "\n${YELLOW}Test 3: Vérification du frontend${NC}"
make health

# Test 4: Intégration
echo -e "\n${YELLOW}Test 4: Test d'intégration complet${NC}"
make integration

# Test 5: HTTP Response
echo -e "\n${YELLOW}Test 5: Test de réponse HTTP${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Frontend répond avec HTTP 200${NC}"
else
    echo -e "${RED}❌ Frontend répond avec HTTP $HTTP_CODE${NC}"
    exit 1
fi

# Test 6: Ports
echo -e "\n${YELLOW}Test 6: Vérification des ports${NC}"
if nc -z localhost 3000; then
    echo -e "${GREEN}✅ Port 3000 accessible${NC}"
else
    echo -e "${RED}❌ Port 3000 non accessible${NC}"
    exit 1
fi

if nc -z localhost 80; then
    echo -e "${GREEN}✅ Port 80 (backend) accessible${NC}"
else
    echo -e "${RED}❌ Port 80 (backend) non accessible${NC}"
    exit 1
fi

# Résumé
echo -e "\n${GREEN}🎉 Tous les tests sont passés avec succès !${NC}"
echo -e "${BLUE}📋 Résumé:${NC}"
echo "  ✅ Configuration .env valide"
echo "  ✅ Backend PHP fonctionnel"
echo "  ✅ Frontend Docker fonctionnel"
echo "  ✅ Intégration frontend-backend OK"
echo "  ✅ Réponse HTTP 200"
echo "  ✅ Ports accessibles"
echo ""
echo -e "${BLUE}🌐 Accès:${NC}"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost"
echo ""
echo -e "${GREEN}🚀 Votre environnement PilotEco est prêt !${NC}"
