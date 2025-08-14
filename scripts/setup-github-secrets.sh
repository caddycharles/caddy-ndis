#!/bin/bash

# GitHub Secrets Setup Script for Multi-Environment
# This script helps configure all required secrets for both dev and prod

set -e

echo "🔧 GitHub Secrets Setup for caddy-team/caddy-ndis"
echo "=================================================="
echo ""

REPO="caddy-team/caddy-ndis"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "This script will help you set up GitHub secrets for:"
echo "  • Development environment (develop branch)"
echo "  • Production environment (main branch)"
echo ""

# Function to set a secret
set_secret() {
    local secret_name=$1
    local secret_value=$2
    echo "Setting $secret_name..."
    gh secret set "$secret_name" --body="$secret_value" --repo="$REPO" 2>/dev/null && \
        echo -e "${GREEN}✅ $secret_name set${NC}" || \
        echo -e "${RED}❌ Failed to set $secret_name${NC}"
}

# Check if gh is authenticated
echo "Checking GitHub CLI authentication..."
if ! gh auth status &>/dev/null; then
    echo -e "${RED}❌ GitHub CLI not authenticated${NC}"
    echo "Please run: gh auth login"
    exit 1
fi
echo -e "${GREEN}✅ GitHub CLI authenticated${NC}"
echo ""

# Existing secrets (keep these)
echo "📋 Keeping existing Vercel secrets..."
echo "  • VERCEL_TOKEN"
echo "  • VERCEL_ORG_ID"
echo "  • VERCEL_PROJECT_ID"
echo ""

# Development Environment
echo "🔧 Development Environment Secrets"
echo "=================================="
echo ""

echo "Enter your DEVELOPMENT Convex URL (e.g., https://dev-deployment.convex.cloud):"
read -r CONVEX_URL_DEV
set_secret "VITE_CONVEX_URL_DEV" "$CONVEX_URL_DEV"

echo "Enter your DEVELOPMENT Convex Deploy Key:"
read -rs CONVEX_DEPLOY_KEY_DEV
echo ""
set_secret "CONVEX_DEPLOY_KEY_DEV" "$CONVEX_DEPLOY_KEY_DEV"

echo "Enter your DEVELOPMENT Clerk Publishable Key (pk_test_...):"
read -r CLERK_PUB_KEY_DEV
set_secret "VITE_CLERK_PUBLISHABLE_KEY_DEV" "$CLERK_PUB_KEY_DEV"

echo "Enter your DEVELOPMENT Clerk Secret Key (sk_test_...):"
read -rs CLERK_SECRET_KEY_DEV
echo ""
set_secret "CLERK_SECRET_KEY_DEV" "$CLERK_SECRET_KEY_DEV"

echo "Enter your DEVELOPMENT Clerk Webhook Secret (whsec_...):"
read -rs CLERK_WEBHOOK_SECRET_DEV
echo ""
set_secret "CLERK_WEBHOOK_SECRET_DEV" "$CLERK_WEBHOOK_SECRET_DEV"

echo ""

# Production Environment
echo "🚀 Production Environment Secrets"
echo "================================="
echo ""

echo "Enter your PRODUCTION Convex URL (e.g., https://prod-deployment.convex.cloud):"
read -r CONVEX_URL_PROD
set_secret "VITE_CONVEX_URL_PROD" "$CONVEX_URL_PROD"

echo "Enter your PRODUCTION Convex Deploy Key:"
read -rs CONVEX_DEPLOY_KEY_PROD
echo ""
set_secret "CONVEX_DEPLOY_KEY_PROD" "$CONVEX_DEPLOY_KEY_PROD"

echo "Enter your PRODUCTION Clerk Publishable Key (pk_live_...):"
read -r CLERK_PUB_KEY_PROD
set_secret "VITE_CLERK_PUBLISHABLE_KEY_PROD" "$CLERK_PUB_KEY_PROD"

echo "Enter your PRODUCTION Clerk Secret Key (sk_live_...):"
read -rs CLERK_SECRET_KEY_PROD
echo ""
set_secret "CLERK_SECRET_KEY_PROD" "$CLERK_SECRET_KEY_PROD"

echo "Enter your PRODUCTION Clerk Webhook Secret (whsec_...):"
read -rs CLERK_WEBHOOK_SECRET_PROD
echo ""
set_secret "CLERK_WEBHOOK_SECRET_PROD" "$CLERK_WEBHOOK_SECRET_PROD"

echo ""

# Shared Secrets
echo "📧 Shared Secrets (Both Environments)"
echo "====================================="
echo ""

echo "Enter your Resend API Key (re_...):"
read -rs RESEND_API_KEY
echo ""
set_secret "RESEND_API_KEY" "$RESEND_API_KEY"

echo "Enter Slack Webhook URL (optional, press Enter to skip):"
read -rs SLACK_WEBHOOK
echo ""
if [ -n "$SLACK_WEBHOOK" ]; then
    set_secret "SLACK_WEBHOOK" "$SLACK_WEBHOOK"
fi

echo ""

# Optional Monitoring
echo "📊 Optional Monitoring (Production Only)"
echo "========================================"
echo ""

echo "Enter Sentry DSN (optional, press Enter to skip):"
read -r SENTRY_DSN
if [ -n "$SENTRY_DSN" ]; then
    set_secret "SENTRY_DSN" "$SENTRY_DSN"
fi

echo "Enter PostHog API Key (optional, press Enter to skip):"
read -r POSTHOG_KEY
if [ -n "$POSTHOG_KEY" ]; then
    set_secret "POSTHOG_API_KEY" "$POSTHOG_KEY"
fi

echo ""
echo "=================================================="
echo ""

# Summary
echo "📋 Summary of Configured Secrets:"
echo ""
echo "Development Environment:"
echo "  ✓ VITE_CONVEX_URL_DEV"
echo "  ✓ CONVEX_DEPLOY_KEY_DEV"
echo "  ✓ VITE_CLERK_PUBLISHABLE_KEY_DEV"
echo "  ✓ CLERK_SECRET_KEY_DEV"
echo "  ✓ CLERK_WEBHOOK_SECRET_DEV"
echo ""
echo "Production Environment:"
echo "  ✓ VITE_CONVEX_URL_PROD"
echo "  ✓ CONVEX_DEPLOY_KEY_PROD"
echo "  ✓ VITE_CLERK_PUBLISHABLE_KEY_PROD"
echo "  ✓ CLERK_SECRET_KEY_PROD"
echo "  ✓ CLERK_WEBHOOK_SECRET_PROD"
echo ""
echo "Shared:"
echo "  ✓ RESEND_API_KEY"
[ -n "$SLACK_WEBHOOK" ] && echo "  ✓ SLACK_WEBHOOK"
[ -n "$SENTRY_DSN" ] && echo "  ✓ SENTRY_DSN"
[ -n "$POSTHOG_KEY" ] && echo "  ✓ POSTHOG_API_KEY"
echo ""

echo -e "${GREEN}✅ GitHub Secrets configuration complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Push the develop branch to trigger dev deployment"
echo "2. Merge to main to trigger production deployment"
echo ""
echo "Commands:"
echo "  git push origin develop    # Deploy to dev.caddy.team"
echo "  git push origin main       # Deploy to caddy.team"