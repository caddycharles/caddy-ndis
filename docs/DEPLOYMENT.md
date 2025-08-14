# 🚀 Deployment Guide

## Overview

Caddy NDIS Support Coordination Platform uses a modern CI/CD pipeline with automatic deployments to Vercel on every push to the main branch.

## Architecture

```
GitHub → GitHub Actions → Vercel → Production
         ↓                ↓
    Quality Checks    Convex Deploy
    Security Scan     Database Migrations
    Tests
```

## Prerequisites

1. **GitHub Repository**
2. **Vercel Account** (Free tier works initially)
3. **Convex Account** (For database)
4. **Clerk Account** (For authentication)

## Initial Setup

### 1. Fork/Clone Repository

```bash
git clone https://github.com/your-org/caddy.git
cd caddy
npm install
```

### 2. Setup Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Link project:
```bash
vercel link
```

4. Get your Vercel credentials:
```bash
# Get Org ID and Project ID
cat .vercel/project.json
```

### 3. Setup Convex

1. Login to Convex:
```bash
npx convex login
```

2. Initialize production deployment:
```bash
npx convex deploy --prod
```

3. Save your deployment URL and deploy key

### 4. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and add:

| Secret Name | Description | Where to Find |
|------------|-------------|---------------|
| `VERCEL_TOKEN` | Vercel API Token | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | Vercel Organization ID | `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Vercel Project ID | `.vercel/project.json` |
| `CONVEX_DEPLOY_KEY` | Convex Deploy Key | Convex Dashboard → Settings |
| `VITE_CONVEX_URL` | Convex URL | https://dashboard.convex.dev |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk Public Key | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk Secret Key | Clerk Dashboard → API Keys |
| `CLERK_WEBHOOK_SECRET` | Clerk Webhook Secret | Clerk Dashboard → Webhooks |
| `SLACK_WEBHOOK` | (Optional) Slack notifications | Slack App Settings |

### 5. Configure Vercel Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

**Production Variables:**
```
VITE_CONVEX_URL=https://your-app.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx
CLERK_DOMAIN=https://your-app.clerk.accounts.dev
NODE_ENV=production
```

**Development Variables:**
```
VITE_CONVEX_URL=https://your-app-dev.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NODE_ENV=development
```

## Deployment Process

### Automatic Deployment (Recommended)

1. **Push to main branch:**
```bash
git add .
git commit -m "feat: your feature"
git push origin main
```

2. **GitHub Actions will:**
   - Run quality checks (TypeScript, Lint, Format)
   - Run tests
   - Security scan
   - Deploy to Vercel
   - Run Convex migrations
   - Send Slack notification

3. **Monitor deployment:**
   - Check GitHub Actions tab
   - View Vercel Dashboard
   - Monitor Convex Dashboard

### Manual Deployment

If needed, you can deploy manually:

```bash
# Deploy to Vercel
vercel --prod

# Deploy Convex schema
npx convex deploy --prod
```

## Environments

### Development
- Branch: `develop` or feature branches
- URL: `https://caddy-*.vercel.app`
- Auto-deployed on PR

### Staging
- Branch: `staging`
- URL: `https://caddy-staging.vercel.app`
- Auto-deployed on push

### Production
- Branch: `main`
- URL: `https://caddy.vercel.app`
- Auto-deployed on push
- Requires all checks to pass

## Rollback Procedure

### Quick Rollback (Vercel)

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Deployments"
4. Find previous stable deployment
5. Click "..." → "Promote to Production"

### Git Rollback

```bash
# Revert last commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push --force origin main
```

### Database Rollback (Convex)

```bash
# Restore from Convex snapshot
npx convex snapshot restore <snapshot-id>
```

## Monitoring

### Health Checks

- **Frontend:** `https://caddy.vercel.app`
- **API Health:** `https://caddy.vercel.app/api/health`
- **Convex Dashboard:** `https://dashboard.convex.dev`

### Monitoring Services

1. **Vercel Analytics** (Built-in)
   - Real User Monitoring
   - Web Vitals
   - Error tracking

2. **Convex Dashboard**
   - Database metrics
   - Function execution
   - Error logs

3. **Clerk Dashboard**
   - Authentication metrics
   - User activity
   - Security events

## Troubleshooting

### Common Issues

#### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Environment Variables Not Working
- Verify in Vercel Dashboard
- Check variable names (VITE_ prefix for client)
- Redeploy after adding variables

#### Convex Connection Issues
```bash
# Re-authenticate
npx convex login
npx convex deploy --prod
```

#### TypeScript Errors
```bash
# Check locally first
npm run typecheck
```

## Security Checklist

- [x] HTTPS only (enforced by Vercel)
- [x] Security headers configured
- [x] Environment variables secured
- [x] API keys rotated regularly
- [x] Webhook secrets configured
- [x] Rate limiting enabled
- [x] CORS configured properly
- [x] Content Security Policy set

## Performance Optimization

### Caching Strategy

- **Static Assets:** 1 year cache (immutable)
- **API Responses:** No cache
- **HTML:** No cache
- **Images:** 1 month cache

### CDN Configuration

Vercel automatically provides:
- Global CDN
- Automatic cache invalidation
- Smart routing
- DDoS protection

## Cost Estimation

| Service | Free Tier | Production Estimate |
|---------|-----------|-------------------|
| Vercel | 100GB bandwidth | $20/month |
| Convex | 1M function calls | $25-100/month |
| Clerk | 5,000 MAU | $25-99/month |
| **Total** | **$0/month** | **$70-220/month** |

## Support

- **Documentation:** `/docs`
- **Issues:** GitHub Issues
- **Slack:** #caddy-deploy channel
- **Email:** devops@caddy-ndis.com.au

## Next Steps

1. ✅ Setup GitHub Secrets
2. ✅ Configure Vercel Environment Variables
3. ✅ Test deployment pipeline
4. ⏭️ Setup monitoring dashboards
5. ⏭️ Configure alerts
6. ⏭️ Plan for scaling

---

Last Updated: 2025-01-14
Version: 1.0.0