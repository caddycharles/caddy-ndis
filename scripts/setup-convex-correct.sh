#!/bin/bash

# Correct Convex Setup Script
# Sets up both development and production Convex deployments

set -e

echo "🚀 Setting up Convex Deployments"
echo "================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Step 1: Development Deployment${NC}"
echo "--------------------------------"
echo "Run the following command to start the development server:"
echo ""
echo -e "${YELLOW}npx convex dev${NC}"
echo ""
echo "This will:"
echo "1. Prompt you to create a new project or use existing"
echo "2. Choose 'create a new project'"
echo "3. Name it: caddy-dev"
echo "4. It will give you a deployment URL like: https://something.convex.cloud"
echo ""
echo "Press Ctrl+C to stop the dev server once you have the URL"
echo ""
read -p "Press Enter when you have your dev URL..."

echo ""
echo -e "${BLUE}Step 2: Production Deployment${NC}"
echo "------------------------------"
echo "For production, we need to create a separate project:"
echo ""
echo "1. Go to https://dashboard.convex.dev"
echo "2. Click 'New Project'"
echo "3. Name it: caddy-prod"
echo "4. Copy the deployment URL and deploy key"
echo ""
echo "Alternatively, you can use:"
echo -e "${YELLOW}npx convex deploy${NC}"
echo ""
echo "This will deploy to your current project (if you want the same project for both)"
echo "OR prompt you to select/create a project"
echo ""
read -p "Press Enter when you have your production URL..."

echo ""
echo -e "${BLUE}Step 3: Get Deploy Keys${NC}"
echo "------------------------"
echo "Go to https://dashboard.convex.dev"
echo ""
echo "For EACH project (dev and prod):"
echo "1. Click on the project"
echo "2. Go to Settings → Deploy Keys"
echo "3. Click 'Generate a deploy key'"
echo "4. Copy the key (looks like: prod:project-name|eyJ2MiI6I...)"
echo ""

echo -e "${GREEN}✅ Manual steps complete!${NC}"
echo ""
echo "You should now have:"
echo ""
echo "Development:"
echo "  URL: https://[your-dev-project].convex.cloud"
echo "  Deploy Key: dev:[project]|[key]"
echo ""
echo "Production:"
echo "  URL: https://[your-prod-project].convex.cloud"
echo "  Deploy Key: prod:[project]|[key]"
echo ""
echo "Next: Run ./scripts/setup-all-secrets-interactive.sh to configure GitHub secrets"