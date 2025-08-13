# 004 - TanStack Start with Convex Platform

**Date:** 2025-01-13  
**Status:** Accepted  
**Deciders:** Charles (Technical Lead), Sally (UX Expert), John (PM), Mary (Analyst)  

## Context

The Caddy project is being restarted from scratch with only documentation from the previous iteration. The original technology stack (Next.js 14, PostgreSQL, Prisma, Redis) was chosen for a different context. Now we have the opportunity to select technologies that better align with our goals of radical simplicity, real-time collaboration, and minimal operational overhead.

Key requirements:
- Real-time budget tracking and updates across all users
- Offline-first capability for field workers
- Minimal DevOps and infrastructure management
- End-to-end type safety
- Rapid development with small team (1-2 developers)
- Bootstrap budget constraints (<$50K)

## Decision

We will use **TanStack Start** as our frontend framework and **Convex** as our complete backend platform.

### TanStack Start
- File-based routing with end-to-end type safety
- Full TanStack ecosystem integration (Query, Form, Table, Virtual)
- Simpler mental model than Next.js RSC
- Better Convex integration without RSC complications
- Vite-based for faster development

### Convex
- Reactive database with real-time subscriptions
- No separate backend infrastructure needed
- Built-in offline sync and conflict resolution
- Automatic scaling and global edge distribution
- ACID-compliant transactions
- Built-in file storage with CDN
- Zero DevOps overhead

## Consequences

### Positive
- **Radical Simplicity**: Single platform for all backend needs
- **Real-time by Default**: All data automatically syncs across clients
- **Reduced Complexity**: No cache layer, no queue infrastructure, no manual WebSocket management
- **Faster Development**: End-to-end TypeScript, auto-generated types, instant deployments
- **Lower Operational Cost**: Pay-per-use pricing, no idle server costs
- **Better UX**: Optimistic updates, offline support, instant feedback
- **Scalability**: Automatic scaling included, no manual optimization needed

### Negative
- **Vendor Lock-in**: Convex is a proprietary platform
- **Learning Curve**: Team needs to learn Convex patterns and TanStack Start
- **Less Community Resources**: Smaller ecosystem than Next.js/PostgreSQL
- **Limited Customization**: Must work within Convex's constraints
- **Data Export**: Need to plan for data portability

## Alternatives Considered

### 1. Next.js 14 + PostgreSQL + Prisma (Original Stack)
- **Rejected because**: Complex infrastructure, no built-in real-time, high operational overhead
- Would require additional services (Redis, WebSocket server, queue system)
- Longer development time for real-time features

### 2. Next.js 14 + Supabase
- **Rejected because**: Still requires managing real-time subscriptions manually
- RSC complications with real-time data
- Less integrated than Convex

### 3. SvelteKit + PocketBase
- **Rejected because**: Smaller ecosystem, less TypeScript support
- Would require retraining team on Svelte
- PocketBase less mature for production use

### 4. T3 Stack (Next.js + tRPC + Prisma)
- **Rejected because**: Still requires separate real-time solution
- More complex setup and configuration
- No built-in offline support

## Implementation Strategy

1. **Phase 1**: Set up TanStack Start with Convex development environment
2. **Phase 2**: Implement Convex schema based on existing data models
3. **Phase 3**: Build real-time features leveraging Convex subscriptions
4. **Phase 4**: Add offline support and optimistic updates
5. **Phase 5**: Implement file storage for documents and compliance

## Migration Path

Since this is a fresh start (not a migration), we will:
1. Define Convex schema based on documented data models
2. Build import functions for CSV data from NDIS portal
3. Create seed data for development and testing
4. Ensure data export capabilities for future portability

## Related Decisions

- [001-use-nextjs-fullstack.md](./001-use-nextjs-fullstack.md) - Superseded by this decision
- [002-postgresql-database.md](./002-postgresql-database.md) - Superseded by this decision
- [003-clerk-authentication.md](./003-clerk-authentication.md) - Still valid, Clerk integrates with Convex

## References

- [TanStack Start Documentation](https://tanstack.com/start)
- [Convex Documentation](https://docs.convex.dev)
- [Convex vs Traditional Stack Comparison](https://docs.convex.dev/database/document-storage#comparison)
- [Real-time Architecture Patterns](https://docs.convex.dev/client/react#subscriptions)