#!/bin/bash

# Script to set up GitHub secrets
# This will be run to configure the repository

echo "🔑 Setting up GitHub Secrets for caddy-ndis repository"
echo "======================================================"
echo ""

# Repository name
REPO="caddycharles/caddy-ndis"

# Vercel credentials from .vercel/project.json
VERCEL_ORG_ID="team_mTKCs7CqkhmNSNjYazZoXLWR"
VERCEL_PROJECT_ID="prj_4gKJlkkC5tLI991bnQtBvg30aAUr"

# Read from .env.local
if [ -f .env.local ]; then
    source .env.local
    echo "✅ Loaded environment variables from .env.local"
else
    echo "❌ .env.local not found!"
    exit 1
fi

echo ""
echo "📝 Setting GitHub Secrets..."
echo ""

# Set Vercel secrets
echo "Setting VERCEL_ORG_ID..."
gh secret set VERCEL_ORG_ID --body="$VERCEL_ORG_ID" --repo="$REPO"

echo "Setting VERCEL_PROJECT_ID..."
gh secret set VERCEL_PROJECT_ID --body="$VERCEL_PROJECT_ID" --repo="$REPO"

# Set Convex URL
echo "Setting VITE_CONVEX_URL..."
gh secret set VITE_CONVEX_URL --body="$VITE_CONVEX_URL" --repo="$REPO"

# Set Clerk keys
echo "Setting VITE_CLERK_PUBLISHABLE_KEY..."
gh secret set VITE_CLERK_PUBLISHABLE_KEY --body="$VITE_CLERK_PUBLISHABLE_KEY" --repo="$REPO"

echo "Setting CLERK_SECRET_KEY..."
gh secret set CLERK_SECRET_KEY --body="$CLERK_SECRET_KEY" --repo="$REPO"

echo "Setting CLERK_WEBHOOK_SECRET..."
gh secret set CLERK_WEBHOOK_SECRET --body="$CLERK_WEBHOOK_SECRET" --repo="$REPO"

# Note: VERCEL_TOKEN needs to be created manually
echo ""
echo "⚠️  IMPORTANT: You need to manually create and set VERCEL_TOKEN"
echo ""
echo "1. Go to: https://vercel.com/account/tokens"
echo "2. Create a new token with name 'caddy-ndis-deploy'"
echo "3. Copy the token"
echo "4. Run: gh secret set VERCEL_TOKEN --repo='$REPO'"
echo ""
echo "Press Enter after you've set the VERCEL_TOKEN..."
read

# Optional: Set Convex deploy key if available
echo ""
echo "Do you have a Convex Deploy Key? (y/n)"
read -r HAS_CONVEX_KEY

if [ "$HAS_CONVEX_KEY" = "y" ]; then
    echo "Enter your Convex Deploy Key:"
    read -s CONVEX_DEPLOY_KEY
    gh secret set CONVEX_DEPLOY_KEY --body="$CONVEX_DEPLOY_KEY" --repo="$REPO"
    echo "✅ Convex Deploy Key set"
fi

echo ""
echo "✅ GitHub Secrets configured successfully!"
echo ""
echo "📋 Secrets set:"
echo "  - VERCEL_ORG_ID"
echo "  - VERCEL_PROJECT_ID"
echo "  - VITE_CONVEX_URL"
echo "  - VITE_CLERK_PUBLISHABLE_KEY"
echo "  - CLERK_SECRET_KEY"
echo "  - CLERK_WEBHOOK_SECRET"
echo "  - VERCEL_TOKEN (manual)"
if [ "$HAS_CONVEX_KEY" = "y" ]; then
    echo "  - CONVEX_DEPLOY_KEY"
fi
echo ""
echo "🚀 Ready to deploy!"