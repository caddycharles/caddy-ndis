# 001 - Use Next.js as Full-Stack Framework

**Date:** 2025-08-09  
**Status:** Accepted  
**Deciders:** Winston (Architect), Charles (Founder)  

## Context
We need to choose a web framework for Caddy that balances rapid development, performance, and maintainability. As a bootstrap startup with limited resources, we need a solution that provides both frontend and backend capabilities without excessive complexity.

## Decision
We will use Next.js 14 with App Router as our full-stack framework, leveraging API routes for backend functionality rather than a separate backend service.

## Consequences
### Positive
- Single codebase for frontend and backend
- Reduced deployment complexity
- Shared TypeScript types between frontend and backend
- Built-in optimizations (code splitting, image optimization)
- Excellent developer experience with hot reload
- Strong community and ecosystem
- Easy deployment to Railway

### Negative
- Potential scaling limitations if we need microservices later
- Tied to Node.js runtime for backend
- API routes may become complex for sophisticated business logic
- Need to carefully manage server/client boundaries

## Alternatives Considered
1. **Separate React frontend + Express backend**
   - Rejected: Additional complexity, deployment overhead
   
2. **T3 Stack (Next.js + tRPC + Prisma)**
   - Rejected: Additional complexity for MVP phase
   
3. **Remix**
   - Rejected: Smaller ecosystem, team unfamiliar

4. **Django + React**
   - Rejected: Two languages/ecosystems to maintain

## Related Decisions
- 002 - Use PostgreSQL for database
- 003 - Use Clerk for authentication
- 004 - Deploy to Railway