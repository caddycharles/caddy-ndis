# 002 - Use PostgreSQL as Primary Database

**Date:** 2025-08-09  
**Status:** Accepted  
**Deciders:** Winston (Architect), John (PM)  

## Context
We need a reliable, scalable database that can handle complex NDIS data structures, support ACID transactions for financial data, and provide long-term data retention for compliance requirements (7 years).

## Decision
We will use PostgreSQL 15 as our primary database with Prisma as the ORM.

## Consequences
### Positive
- ACID compliance for financial transactions
- JSONB support for flexible NDIS data structures
- Row-level security for multi-tenancy
- Excellent performance with proper indexing
- Built-in full-text search capabilities
- Mature ecosystem and tooling
- Easy backup and point-in-time recovery
- Railway provides managed PostgreSQL

### Negative
- Requires careful index management for performance
- More complex than NoSQL for simple use cases
- Schema migrations need careful planning
- Connection pooling required at scale

## Alternatives Considered
1. **MongoDB**
   - Rejected: Lack of ACID transactions, compliance concerns
   
2. **MySQL**
   - Rejected: Less flexible JSON support, weaker full-text search
   
3. **SQLite**
   - Rejected: Not suitable for production multi-user environment
   
4. **DynamoDB**
   - Rejected: Vendor lock-in, complex for relational data

## Related Decisions
- 001 - Use Next.js as full-stack framework
- 005 - Use Prisma as ORM
- 006 - Implement soft deletes for compliance