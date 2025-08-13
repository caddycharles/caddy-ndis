# Technology Stack

## Overview

Caddy uses a modern, simplified tech stack centered around TanStack Start for the frontend and Convex as a complete backend platform. This combination provides real-time capabilities, type safety, and minimal operational overhead.

## Frontend Stack

```yaml
Framework:
  - TanStack Start (file-based routing, SSR)
  - React 18 (UI library)
  - TypeScript 5.x (end-to-end type safety)
  - Vite 5.x (build tool)

Styling:
  - Tailwind CSS 3.x (utility-first CSS)
  - Shadcn/ui (component library)
  - CSS Modules (component isolation)
  - CVA (class variance authority)

State Management:
  - Convex React (server state & real-time subscriptions)
  - Zustand 4.x (local UI state only)
  - TanStack Query (integrated via Convex)

Forms & Validation:
  - TanStack Form (form state management)
  - Zod 3.x (schema validation)
  - Convex validators (backend validation)

UI Components:
  - Shadcn/ui (full component set)
  - Radix UI (accessible primitives)
  - Lucide Icons (icon library)
  - Recharts (data visualization)
  - TanStack Table 8.x (data tables)
  - TanStack Virtual 3.x (virtualization)

Build & Tools:
  - Vite (bundler via TanStack Start)
  - ESLint + Prettier (code quality)
  - Husky (git hooks)
  - lint-staged (pre-commit)
```

## Backend Stack

```yaml
Platform:
  - Convex (complete backend platform)
  - No separate backend infrastructure needed

Database:
  - Convex reactive database
  - Document-based with relational capabilities
  - ACID-compliant transactions
  - Real-time subscriptions built-in
  - Automatic indexing
  - Row-level security

Functions:
  - Convex queries (read with subscriptions)
  - Convex mutations (write operations)
  - Convex actions (third-party integrations)
  - Scheduled functions (cron jobs)
  - HTTP endpoints (webhooks)

Authentication:
  - Clerk (user management)
  - Convex Auth integration
  - JWT validation
  - Webhook sync
  - Role-based access control

File Storage:
  - Convex file storage
  - Automatic CDN distribution
  - Secure upload/download
  - Access control
  - Image optimization

Real-time Features:
  - Built-in WebSocket management
  - Automatic reconnection
  - Optimistic updates
  - Conflict resolution
  - Offline queue
```

## Infrastructure Stack

```yaml
Backend Hosting:
  - Convex Cloud (fully managed)
  - Automatic scaling
  - Global edge distribution
  - Zero configuration
  - 99.99% uptime SLA

Frontend Hosting:
  - Vercel (recommended)
  - Alternative: Netlify, Cloudflare Pages
  - Edge functions support
  - Preview deployments
  - Automatic SSL

CDN & Edge:
  - Convex CDN (backend files)
  - Vercel Edge Network (frontend)
  - Automatic caching
  - Global distribution
  - DDoS protection

Monitoring:
  - Convex Dashboard (built-in metrics)
  - Sentry (error tracking)
  - Vercel Analytics (web vitals)
  - Custom metrics via Convex

CI/CD:
  - GitHub Actions
  - Automatic Convex deployments
  - Preview environments
  - Type-safe migrations
  - Automated testing

Security:
  - Clerk (authentication)
  - Convex (row-level security)
  - HTTPS everywhere
  - CSP headers
  - Rate limiting
```

## Development Tools

```yaml
IDE & Extensions:
  - VSCode (recommended)
  - Convex extension
  - Tailwind IntelliSense
  - Prettier extension
  - ESLint extension
  - TypeScript support

Local Development:
  - TanStack Start dev server
  - Convex dev deployment
  - Hot module replacement
  - Real-time data sync
  - Type generation

Testing:
  - Vitest (unit & integration)
  - Playwright (E2E tests)
  - Testing Library (React)
  - MSW (API mocking)
  - Convex test helpers

Performance Tools:
  - Lighthouse CI
  - Bundle analyzer
  - React DevTools
  - Convex Dashboard
```

## External Services

```yaml
Authentication:
  - Clerk (primary provider)
  - Social logins
  - MFA support
  - Organizations

Communications:
  - SendGrid/Resend (email)
  - Twilio (SMS)
  - Integration via Convex actions

Future Integrations:
  - NDIS Portal API
  - Accounting software
  - Calendar services
  - Payment processing
```

## Technology Decision Rationale

### Why TanStack Start?
- **Modern DX**: File-based routing with type safety
- **Performance**: Built on Vite for fast builds
- **Flexibility**: SSR, SSG, and SPA modes
- **Ecosystem**: Full TanStack integration
- **Simplicity**: Less complexity than Next.js App Router

### Why Convex?
- **Real-time First**: Every query is a live subscription
- **No Infrastructure**: Complete backend platform
- **Type Safety**: End-to-end TypeScript
- **Scalability**: Automatic scaling included
- **Cost**: Pay only for usage, generous free tier

### Why Clerk?
- **Developer Experience**: Best-in-class DX
- **Features**: Organizations, MFA, social login
- **Integration**: Native Convex support
- **Customization**: Fully customizable UI
- **Security**: SOC 2 compliant

### Why Shadcn/ui?
- **Customization**: Copy-paste components
- **Accessibility**: Built on Radix UI
- **Design**: Modern, clean aesthetic
- **Flexibility**: Modify as needed
- **TypeScript**: Full type support

## Performance Targets

```yaml
Core Web Vitals:
  - LCP: < 2.5s
  - FID: < 100ms
  - CLS: < 0.1
  - INP: < 200ms

Bundle Size:
  - Initial JS: < 200KB
  - Initial CSS: < 50KB
  - Route chunks: < 100KB
  - Total: < 500KB

Real-time Performance:
  - Subscription latency: < 100ms
  - Optimistic update: Instant
  - Sync time: < 1s
  - Offline recovery: < 5s
```

## Migration from Original Stack

### What Changed
| Original | New | Reason |
|----------|-----|--------|
| Next.js 14 | TanStack Start | Simpler, better Convex integration |
| PostgreSQL | Convex Database | Real-time, no management |
| Prisma ORM | Convex Functions | Type-safe, reactive |
| Redis Cache | Convex Subscriptions | Automatic caching |
| Bull Queue | Convex Scheduled | Built-in background jobs |
| Railway | Convex Cloud | Zero DevOps |

### Migration Benefits
1. **Reduced Complexity**: Single platform vs multiple services
2. **Real-time Built-in**: No WebSocket server needed
3. **Cost Savings**: ~70% reduction in infrastructure costs
4. **Developer Velocity**: 2-3x faster development
5. **Operational Overhead**: Near zero vs significant

## Cost Analysis

### Monthly Costs (Estimated)
```yaml
Development (0-10 users):
  - Convex: $0 (free tier)
  - Clerk: $0 (free tier)
  - Vercel: $0 (hobby tier)
  - Total: $0/month

MVP (10-100 users):
  - Convex: $25/month
  - Clerk: $25/month
  - Vercel: $20/month
  - Total: ~$70/month

Scale (100-1000 users):
  - Convex: $100-250/month
  - Clerk: $100-250/month
  - Vercel: $20/month
  - Total: ~$220-520/month
```

### Cost Comparison
- **Original Stack**: $500-1000/month (servers, database, Redis, monitoring)
- **New Stack**: $70-520/month (all inclusive)
- **Savings**: 60-80% reduction

## Security Considerations

### Application Security
- **Authentication**: Clerk handles auth securely
- **Authorization**: Row-level security in Convex
- **Data Encryption**: At rest and in transit
- **Input Validation**: Zod schemas everywhere
- **XSS Protection**: React's built-in protection

### Infrastructure Security
- **DDoS Protection**: Cloudflare/Vercel
- **Rate Limiting**: Built into Convex
- **Secrets Management**: Environment variables
- **Audit Logging**: Complete activity tracking
- **Compliance**: NDIS requirements met

## Future Technology Considerations

### Potential Additions
- **Mobile App**: React Native with Convex
- **Analytics**: PostHog or Plausible
- **A/B Testing**: Statsig or GrowthBook
- **Feature Flags**: LaunchDarkly or built-in
- **API Gateway**: If external API needed

### Technology Watch List
- **Bun**: Potential Node.js replacement
- **Remix**: Alternative to TanStack Start
- **Supabase**: Alternative to Convex
- **Neon**: If PostgreSQL needed
- **Temporal**: For complex workflows

---