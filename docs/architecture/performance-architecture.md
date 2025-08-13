# Performance Architecture

## Performance Budget

```yaml
Metrics:
  FCP: < 1.5s    # First Contentful Paint
  LCP: < 2.5s    # Largest Contentful Paint
  TTI: < 3.5s    # Time to Interactive
  CLS: < 0.1     # Cumulative Layout Shift
  FID: < 100ms   # First Input Delay

Bundle Sizes:
  Initial: < 50KB
  Route: < 30KB
  Total: < 300KB

API Response Times:
  p50: < 200ms
  p95: < 500ms
  p99: < 1000ms

Database Queries:
  Simple: < 10ms
  Complex: < 100ms
  Reports: < 1000ms
```

## Optimization Strategies

```typescript
// performance/optimizations.ts

// 1. Database Query Optimization
export const optimizedParticipantQuery = prisma.$queryRaw`
  SELECT 
    p.*,
    COALESCE(
      json_agg(
        DISTINCT jsonb_build_object(
          'id', b.id,
          'category', b.category,
          'remaining', b.allocated - b.spent,
          'status', CASE 
            WHEN (b.allocated - b.spent) / b.allocated > 0.4 THEN 'green'
            WHEN (b.allocated - b.spent) / b.allocated > 0.2 THEN 'amber'
            ELSE 'red'
          END
        )
      ) FILTER (WHERE b.id IS NOT NULL), 
      '[]'
    ) as budgets
  FROM participants p
  LEFT JOIN budgets b ON b.participant_id = p.id
  WHERE p.organization_id = ${organizationId}
    AND p.deleted_at IS NULL
  GROUP BY p.id
  LIMIT ${limit} OFFSET ${offset}
`;

// 2. React Component Optimization
export const ParticipantList = memo(
  ({ participants }: Props) => {
    const virtualizer = useVirtualizer({
      count: participants.length,
      getScrollElement: () => scrollRef.current,
      estimateSize: () => 80,
      overscan: 5,
    });
    
    return (
      <div ref={scrollRef} className="h-full overflow-auto">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <ParticipantRow
              key={participants[virtualItem.index].id}
              participant={participants[virtualItem.index]}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            />
          ))}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps.participants, nextProps.participants);
  }
);

// 3. API Response Caching
export const getCachedDashboard = async (
  organizationId: string
): Promise<Dashboard> => {
  const cacheKey = `dashboard:${organizationId}`;
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Parallel data fetching
  const [stats, alerts, messages, schedule] = await Promise.all([
    getDashboardStats(organizationId),
    getAlerts(organizationId),
    getRecentMessages(organizationId),
    getTodaySchedule(organizationId),
  ]);
  
  const dashboard = {
    stats,
    alerts,
    messages,
    schedule,
    generatedAt: new Date(),
  };
  
  // Cache for 30 seconds
  await redis.setex(cacheKey, 30, JSON.stringify(dashboard));
  
  return dashboard;
};
```

---
