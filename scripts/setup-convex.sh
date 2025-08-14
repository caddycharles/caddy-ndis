#!/bin/bash

# Convex Setup Script
# Sets up both development and production Convex deployments

set -e

echo "🚀 Setting up Convex Deployments"
echo "================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Step 1: Development Deployment${NC}"
echo "--------------------------------"
echo "Run the following command and select 'Create a new project':"
echo ""
echo -e "${YELLOW}npx convex dev${NC}"
echo ""
echo "Project name suggestion: caddy-dev"
echo "Once connected, press Ctrl+C to stop the dev server"
echo ""
read -p "Press Enter when ready to continue..."

echo ""
echo -e "${BLUE}Step 2: Production Deployment${NC}"
echo "------------------------------"
echo "Run the following command:"
echo ""
echo -e "${YELLOW}npx convex deploy --prod${NC}"
echo ""
echo "Project name suggestion: caddy-prod"
echo ""
read -p "Press Enter when ready to continue..."

echo ""
echo -e "${BLUE}Step 3: Note Your Deployment URLs${NC}"
echo "----------------------------------"
echo "You should now have two Convex deployments:"
echo ""
echo "Development:"
echo "  URL: https://[something]-dev.convex.cloud"
echo "  Deploy Key: Available in Convex dashboard"
echo ""
echo "Production:"
echo "  URL: https://[something]-prod.convex.cloud"
echo "  Deploy Key: Available in Convex dashboard"
echo ""

echo -e "${GREEN}✅ Convex setup complete!${NC}"
echo ""
echo "Next: Run ./scripts/setup-all-secrets.sh to configure GitHub secrets"