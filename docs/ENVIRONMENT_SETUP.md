# 🌍 Multi-Environment Setup Guide

## Overview

Caddy uses a multi-environment setup with separate configurations for development and production:

| Environment | Branch | URL | Convex | Clerk |
|------------|--------|-----|--------|-------|
| **Development** | `develop` | https://dev.caddy.team | Dev deployment | Test mode |
| **Production** | `main` | https://caddy.team | Prod deployment | Live mode |

## Architecture

```
┌─────────────────────────────────────────────┐
│                GitHub Repository             │
│          caddy-team/caddy-ndis              │
└──────────────┬────────────┬─────────────────┘
               │            │
         develop           main
               │            │
         ┌─────▼────┐ ┌────▼─────┐
         │   DEV    │ │   PROD   │
         │ Pipeline │ │ Pipeline │
         └─────┬────┘ └────┬─────┘
               │            │
    ┌──────────▼───────┐   │
    │  dev.caddy.team  │   │
    │                  │   │
    │ • Convex Dev     │   │
    │ • Clerk Test     │   │
    │ • Debug Enabled  │   │
    └──────────────────┘   │
                           │
                 ┌─────────▼──────────┐
                 │   caddy.team       │
                 │                    │
                 │ • Convex Prod      │
                 │ • Clerk Live       │
                 │ • Monitoring       │
                 └────────────────────┘
```

## Required Services

### 1. Convex (Database)
You need TWO separate Convex deployments:

**Development:**
- Project: `caddy-dev`
- URL: Will be like `https://something-dev.convex.cloud`
- Deploy Key: Get from Convex dashboard

**Production:**
- Project: `caddy-prod`
- URL: Will be like `https://something-prod.convex.cloud`
- Deploy Key: Get from Convex dashboard

### 2. Clerk (Authentication)
You need TWO Clerk applications:

**Development:**
- Name: `Caddy Development`
- Keys: Start with `pk_test_` and `sk_test_`
- Webhook: Point to dev deployment

**Production:**
- Name: `Caddy Production`
- Keys: Start with `pk_live_` and `sk_live_`
- Webhook: Point to production deployment

### 3. Resend (Email)
ONE Resend account for both environments:
- API Key: `re_...`
- From Email: `notifications@caddy.team`
- Reply To: `support@caddy.team`

## Quick Setup

### Step 1: Create Services

1. **Convex Setup:**
   ```bash
   # Development
   npx convex dev
   # Note the URL and get deploy key from dashboard
   
   # Production
   npx convex deploy --prod
   # Note the URL and get deploy key from dashboard
   ```

2. **Clerk Setup:**
   - Go to https://dashboard.clerk.com
   - Create two applications (Dev and Prod)
   - Note all keys

3. **Resend Setup:**
   - Go to https://resend.com
   - Create API key
   - Verify domain `caddy.team`

### Step 2: Configure GitHub Secrets

Run the automated script:
```bash
./scripts/setup-github-secrets.sh
```

Or manually add in GitHub Settings → Secrets:

**Development Secrets:**
- `VITE_CONVEX_URL_DEV`
- `CONVEX_DEPLOY_KEY_DEV`
- `VITE_CLERK_PUBLISHABLE_KEY_DEV`
- `CLERK_SECRET_KEY_DEV`
- `CLERK_WEBHOOK_SECRET_DEV`

**Production Secrets:**
- `VITE_CONVEX_URL_PROD`
- `CONVEX_DEPLOY_KEY_PROD`
- `VITE_CLERK_PUBLISHABLE_KEY_PROD`
- `CLERK_SECRET_KEY_PROD`
- `CLERK_WEBHOOK_SECRET_PROD`

**Shared Secrets:**
- `RESEND_API_KEY`
- `VERCEL_TOKEN` (already set)
- `VERCEL_ORG_ID` (already set)
- `VERCEL_PROJECT_ID` (already set)
- `SLACK_WEBHOOK` (optional)

### Step 3: Configure Local Development

For local development, create `.env.local`:

```bash
# Copy the template
cp .env.development.example .env.local

# Edit with your development values
nano .env.local
```

### Step 4: Deploy

```bash
# Deploy to development
git checkout develop
git push origin develop

# Deploy to production
git checkout main
git push origin main
```

## GitHub Actions Workflow

The CI/CD pipeline automatically:

1. **On push to `develop`:**
   - Runs tests with dev environment
   - Deploys to `dev.caddy.team`
   - Uses development Convex and Clerk

2. **On push to `main`:**
   - Runs tests with prod environment
   - Deploys to `caddy.team`
   - Uses production Convex and Clerk

3. **On pull request:**
   - Runs tests
   - Creates preview deployment
   - Comments URL on PR

## Vercel Configuration

Vercel automatically manages environments:

| Git Branch | Vercel Environment | Domain |
|------------|-------------------|--------|
| `develop` | Preview | dev.caddy.team |
| `main` | Production | caddy.team, www.caddy.team |
| PR | Preview | caddy-pr-*.vercel.app |

## Clerk Webhooks

Configure webhooks in Clerk dashboard:

**Development Webhook:**
- Endpoint: `https://dev.caddy.team/api/clerk-webhook`
- Events: `user.created`, `user.updated`, `user.deleted`

**Production Webhook:**
- Endpoint: `https://caddy.team/api/clerk-webhook`
- Events: Same as development

## Environment Variables Reference

### Client-Side (VITE_*)
These are exposed to the browser:

| Variable | Development | Production |
|----------|------------|------------|
| `VITE_CONVEX_URL` | Dev Convex URL | Prod Convex URL |
| `VITE_CLERK_PUBLISHABLE_KEY` | pk_test_... | pk_live_... |
| `VITE_DEBUG` | true | false |
| `VITE_ENABLE_DEVTOOLS` | true | false |

### Server-Side
These are only available in server/build:

| Variable | Description |
|----------|-------------|
| `CLERK_SECRET_KEY` | Clerk secret key |
| `CLERK_WEBHOOK_SECRET` | Webhook validation |
| `CONVEX_DEPLOY_KEY` | Convex deployment |
| `RESEND_API_KEY` | Email service |

## Testing Environments

### Development Testing
```bash
# Set dev environment locally
cp .env.development.example .env.local

# Run with dev config
npm run dev

# Test dev deployment
curl https://dev.caddy.team
```

### Production Testing
```bash
# Test production
curl https://caddy.team

# Check SSL
openssl s_client -connect caddy.team:443
```

## Troubleshooting

### Issue: "Environment variables not loading"
**Solution:** Check that variables start with `VITE_` for client-side access

### Issue: "Wrong Convex deployment"
**Solution:** Verify `CONVEX_DEPLOYMENT` matches your branch

### Issue: "Clerk not authenticating"
**Solution:** Check that test/live keys match environment

### Issue: "Deployment failing"
**Solution:** Check GitHub Secrets are set correctly:
```bash
gh secret list --repo caddy-team/caddy-ndis
```

## Security Best Practices

1. **Never commit `.env` files**
2. **Use different API keys** for dev/prod
3. **Rotate secrets regularly**
4. **Use GitHub environment protection** for production
5. **Enable 2FA** on all service accounts

## Monitoring

### Development
- Logs: Vercel Functions logs
- Errors: Console output
- Database: Convex dashboard (dev)

### Production
- Logs: Vercel Analytics
- Errors: Sentry (if configured)
- Analytics: PostHog (if configured)
- Database: Convex dashboard (prod)

## Rollback Procedure

### Development
```bash
# Revert last commit
git revert HEAD
git push origin develop
```

### Production
```bash
# Use Vercel instant rollback
vercel rollback

# Or git revert
git revert HEAD
git push origin main
```

---

Last Updated: 2025-01-14
Version: 1.0.0