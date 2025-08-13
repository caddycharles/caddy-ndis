# Appendices

## A. Technology Decision Records

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 14 | Full-stack, performance, DX |
| Database | PostgreSQL | ACID, JSON support, proven |
| ORM | Prisma | Type safety, migrations |
| Hosting | Railway | Simple, scalable, cost-effective |
| Auth | Clerk | Complete solution, compliant |
| UI | Shadcn/ui | Accessible, customizable |
| State | Zustand | Simple, performant |
| Styling | Tailwind | Fast development, consistent |

## B. API Design Standards

```typescript
// Standard API Response
interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Standard Error Codes
enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
}
```

## C. Database Indexing Strategy

```sql
-- Performance-critical indexes
CREATE INDEX CONCURRENTLY idx_services_lookup 
  ON services(organization_id, service_date DESC, status)
  WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY idx_participants_search
  ON participants USING gin(
    to_tsvector('english', 
      first_name || ' ' || last_name || ' ' || ndis_number
    )
  );

CREATE INDEX CONCURRENTLY idx_budgets_status
  ON budgets(participant_id, category)
  WHERE end_date >= CURRENT_DATE;

-- Partial indexes for common queries
CREATE INDEX CONCURRENTLY idx_active_participants
  ON participants(organization_id)
  WHERE is_active = true AND deleted_at IS NULL;

CREATE INDEX CONCURRENTLY idx_unclaimed_services
  ON services(organization_id, service_date)
  WHERE claim_id IS NULL AND status = 'SUBMITTED';
```

## D. Performance Benchmarks

| Operation | Target | Actual | Status |
|-----------|--------|--------|--------|
| Dashboard Load | < 2s | TBD | Pending |
| Service Log | < 500ms | TBD | Pending |
| Participant List (100) | < 1s | TBD | Pending |
| CSV Import (1000) | < 60s | TBD | Pending |
| Claim Generation | < 5s | TBD | Pending |
| Budget Calculation | < 200ms | TBD | Pending |

---
