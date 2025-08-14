#!/bin/bash

# Caddy Deployment Setup Script
# This script helps you configure the deployment pipeline

set -e

echo "🚀 Caddy Deployment Setup"
echo "========================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Node.js $(node --version)${NC}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✅ npm $(npm --version)${NC}"
fi

# Check Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Git $(git --version)${NC}"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Setting up Vercel..."

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel
echo -e "${YELLOW}Please login to Vercel:${NC}"
vercel login

# Link project
echo -e "${YELLOW}Linking Vercel project...${NC}"
vercel link

# Get Vercel credentials
if [ -f .vercel/project.json ]; then
    echo -e "${GREEN}✅ Vercel project linked${NC}"
    echo ""
    echo "📝 Vercel Configuration:"
    cat .vercel/project.json
    echo ""
else
    echo -e "${RED}❌ Failed to link Vercel project${NC}"
    exit 1
fi

echo ""
echo "🗄️ Setting up Convex..."

# Login to Convex
echo -e "${YELLOW}Please login to Convex:${NC}"
npx convex login

# Deploy to Convex
echo -e "${YELLOW}Deploying Convex schema...${NC}"
npx convex deploy

echo ""
echo "🔑 GitHub Secrets Configuration"
echo "================================"
echo ""
echo "Please add the following secrets to your GitHub repository:"
echo "(Settings → Secrets and variables → Actions)"
echo ""
echo "Required Secrets:"
echo "  VERCEL_TOKEN          - Get from: https://vercel.com/account/tokens"
echo "  VERCEL_ORG_ID         - From .vercel/project.json above"
echo "  VERCEL_PROJECT_ID     - From .vercel/project.json above"
echo "  CONVEX_DEPLOY_KEY     - From Convex Dashboard → Settings"
echo "  VITE_CONVEX_URL       - Your Convex deployment URL"
echo "  VITE_CLERK_PUBLISHABLE_KEY - From Clerk Dashboard"
echo "  CLERK_SECRET_KEY      - From Clerk Dashboard"
echo "  CLERK_WEBHOOK_SECRET  - From Clerk Dashboard → Webhooks"
echo ""
echo "Optional:"
echo "  SLACK_WEBHOOK         - For deployment notifications"
echo ""

echo -e "${YELLOW}Press Enter when you've added the GitHub secrets...${NC}"
read

echo ""
echo "🌍 Environment Variables"
echo "========================"
echo ""
echo "Copying .env.example to .env.local..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo -e "${GREEN}✅ Created .env.local${NC}"
    echo -e "${YELLOW}Please edit .env.local with your values${NC}"
else
    echo -e "${YELLOW}⚠️  .env.local already exists${NC}"
fi

echo ""
echo "🎯 Next Steps"
echo "============="
echo ""
echo "1. Edit .env.local with your actual values"
echo "2. Configure Vercel environment variables in dashboard"
echo "3. Set up Clerk webhooks to point to your deployment"
echo "4. Commit and push to trigger deployment:"
echo ""
echo "   git add ."
echo "   git commit -m 'feat: configure deployment pipeline'"
echo "   git push origin main"
echo ""
echo -e "${GREEN}✅ Deployment setup complete!${NC}"
echo ""
echo "📚 Documentation: docs/DEPLOYMENT.md"
echo "💬 Support: devops@caddy-ndis.com.au"